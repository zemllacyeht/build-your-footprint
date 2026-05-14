import { createClient } from 'npm:@supabase/supabase-js@2'

// Maximum age (in seconds) for the webhook timestamp before we reject the
// request as stale. 5 minutes matches Svix/Standard Webhooks default tolerance.
const MAX_WEBHOOK_AGE_SECONDS = 60 * 5

// Decode a Svix webhook secret. Resend stores webhook secrets as
// `whsec_<base64>` — strip the `whsec_` prefix and base64-decode the rest.
function decodeWebhookSecret(secret: string): Uint8Array {
  const prefix = 'whsec_'
  const stripped = secret.startsWith(prefix) ? secret.slice(prefix.length) : secret
  const binary = atob(stripped)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

// Constant-time comparison to avoid leaking timing information about which
// byte differed when comparing signatures.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

// Verify the Svix signature header. Format:
//   svix-signature: v1,<base64-signature> [v1,<other-signature> ...]
// Multiple signatures (space-separated) are allowed during key rotation; we
// accept the request if any one of them matches.
async function verifyWebhookSignature(
  secret: string,
  svixId: string,
  svixTimestamp: string,
  signatureHeader: string,
  rawBody: string,
): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    decodeWebhookSecret(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`
  const sigBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedContent))
  const sigBytes = new Uint8Array(sigBuffer)
  let binary = ''
  for (const b of sigBytes) binary += String.fromCharCode(b)
  const expected = btoa(binary)

  const candidates = signatureHeader.split(' ')
  for (const candidate of candidates) {
    const [version, sig] = candidate.split(',')
    if (version !== 'v1' || !sig) continue
    if (timingSafeEqual(sig, expected)) return true
  }
  return false
}

function jsonResponse(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function redactEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return '***'
  return `${local[0]}***@${domain}`
}

// Map a Resend event type to a row for suppressed_emails + email_send_log.
// Returns null for events we deliberately ignore (delivered, opened, clicked, etc.)
function mapResendEvent(eventType: string): {
  reason: 'bounce' | 'complaint'
  status: 'bounced' | 'complained'
  message: string
} | null {
  switch (eventType) {
    case 'email.bounced':
      return {
        reason: 'bounce',
        status: 'bounced',
        message: 'Permanent bounce — email address is invalid or rejected',
      }
    case 'email.complained':
      return {
        reason: 'complaint',
        status: 'complained',
        message: 'Spam complaint — recipient marked email as spam',
      }
    default:
      return null
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const secret = Deno.env.get('RESEND_WEBHOOK_SECRET')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!secret || !supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables')
    return jsonResponse({ error: 'Server configuration error' }, 500)
  }

  // Read Svix headers (Resend uses svix-* naming)
  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')
  if (!svixId || !svixTimestamp || !svixSignature) {
    return jsonResponse({ error: 'Missing webhook headers' }, 401)
  }

  // Reject stale timestamps (replay protection)
  const timestampSeconds = parseInt(svixTimestamp, 10)
  if (Number.isNaN(timestampSeconds)) {
    return jsonResponse({ error: 'Invalid webhook timestamp' }, 401)
  }
  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - timestampSeconds)
  if (ageSeconds > MAX_WEBHOOK_AGE_SECONDS) {
    return jsonResponse({ error: 'Webhook timestamp too old' }, 401)
  }

  // Read raw body for signature verification (must use exact bytes sent by Resend)
  const rawBody = await req.text()

  const signatureValid = await verifyWebhookSignature(
    secret,
    svixId,
    svixTimestamp,
    svixSignature,
    rawBody,
  )
  if (!signatureValid) {
    console.error('Webhook signature verification failed', { svixId })
    return jsonResponse({ error: 'Invalid signature' }, 401)
  }

  // Parse the verified payload. Resend webhook envelope:
  //   {
  //     type: 'email.bounced' | 'email.complained' | 'email.delivered' | ...,
  //     created_at: 'ISO timestamp',
  //     data: {
  //       email_id: 'string',
  //       to: ['recipient@example.com', ...],
  //       from: '...',
  //       subject: '...',
  //       bounce?: { type: 'hard' | 'soft', message: '...' },
  //       complaint?: { feedback_type: '...' },
  //       ...
  //     }
  //   }
  let envelope: any
  try {
    envelope = JSON.parse(rawBody)
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400)
  }

  const eventType = envelope?.type as string | undefined
  if (!eventType) {
    return jsonResponse({ error: 'Missing event type' }, 400)
  }

  const mapped = mapResendEvent(eventType)
  if (!mapped) {
    // Event type we don't care about (delivered, opened, clicked, delivery_delayed).
    // Return 200 so Resend doesn't retry.
    return jsonResponse({ success: true, ignored: eventType })
  }

  // Resend's `data.to` is an array (recipients on the original send).
  // For bounces/complaints there's always exactly one address.
  const recipients: string[] = Array.isArray(envelope?.data?.to)
    ? envelope.data.to
    : envelope?.data?.to
      ? [envelope.data.to]
      : []
  const recipientEmail = recipients[0]
  if (!recipientEmail) {
    console.error('Webhook payload missing recipient', { eventType })
    return jsonResponse({ error: 'Missing recipient' }, 400)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const normalizedEmail = recipientEmail.toLowerCase()
  const emailId = envelope?.data?.email_id as string | undefined

  // Build metadata snapshot for audit trail
  const metadata = {
    event_type: eventType,
    resend_email_id: emailId ?? null,
    bounce: envelope?.data?.bounce ?? null,
    complaint: envelope?.data?.complaint ?? null,
    created_at: envelope?.created_at ?? null,
  }

  // 1. Upsert to suppressed_emails (idempotent — safe for retries)
  const { error: suppressError } = await supabase
    .from('suppressed_emails')
    .upsert(
      {
        email: normalizedEmail,
        reason: mapped.reason,
        metadata,
      },
      { onConflict: 'email' },
    )

  if (suppressError) {
    console.error('Failed to upsert suppressed email', {
      error: suppressError,
      email_redacted: redactEmail(normalizedEmail),
    })
    return jsonResponse({ error: 'Failed to write suppression' }, 500)
  }

  // 2. Append a log entry (never update existing rows)
  const { error: insertError } = await supabase.from('email_send_log').insert({
    message_id: emailId ?? null,
    template_name: 'system',
    recipient_email: normalizedEmail,
    status: mapped.status,
    error_message: mapped.message,
    metadata,
  })

  if (insertError) {
    // Non-fatal — the suppression was already recorded.
    console.warn('Failed to insert email_send_log', { error: insertError })
  }

  console.log('Suppression processed', {
    email_redacted: redactEmail(normalizedEmail),
    reason: mapped.reason,
    resend_email_id: emailId ?? null,
  })

  return jsonResponse({ success: true })
})