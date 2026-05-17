import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { SignupEmail } from '../_shared/email-templates/signup.tsx'
import { InviteEmail } from '../_shared/email-templates/invite.tsx'
import { MagicLinkEmail } from '../_shared/email-templates/magic-link.tsx'
import { RecoveryEmail } from '../_shared/email-templates/recovery.tsx'
import { EmailChangeEmail } from '../_shared/email-templates/email-change.tsx'
import { ReauthenticationEmail } from '../_shared/email-templates/reauthentication.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, webhook-id, webhook-timestamp, webhook-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const EMAIL_SUBJECTS: Record<string, string> = {
  signup: 'Confirm your email',
  invite: "You've been invited",
  magiclink: 'Your login link',
  recovery: 'Reset your password',
  email_change: 'Confirm your new email',
  reauthentication: 'Your verification code',
}

const EMAIL_TEMPLATES: Record<string, React.ComponentType<any>> = {
  signup: SignupEmail,
  invite: InviteEmail,
  magiclink: MagicLinkEmail,
  recovery: RecoveryEmail,
  email_change: EmailChangeEmail,
  reauthentication: ReauthenticationEmail,
}

// Email sender configuration. Mirrors the values in send-transactional-email
// so auth and transactional emails share the same verified Resend domain.
const SITE_NAME = 'Build Your Footprint'
const SENDER_DOMAIN = 'buildyourfootprint.com'
const FROM_DOMAIN = 'buildyourfootprint.com'

// Maximum age (in seconds) for the webhook timestamp before we reject the
// request as stale. 5 minutes matches the Standard Webhooks default tolerance.
const MAX_WEBHOOK_AGE_SECONDS = 60 * 5

// Decode a Standard Webhooks secret. Supabase stores the hook secret as
// `v1,whsec_<base64>` — strip the `v1,whsec_` prefix and base64-decode the rest
// to recover the raw HMAC key.
function decodeWebhookSecret(secret: string): Uint8Array {
  const prefix = 'v1,whsec_'
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

// Verify the Standard Webhooks signature header. Format:
//   webhook-signature: v1,<base64-signature> [v1,<other-signature> ...]
// Multiple signatures (space-separated) are allowed during key rotation; we
// accept the request if any one of them matches.
async function verifyWebhookSignature(
  secret: string,
  webhookId: string,
  webhookTimestamp: string,
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
  const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`
  const sigBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedContent))
  const sigBytes = new Uint8Array(sigBuffer)
  let binary = ''
  for (const b of sigBytes) binary += String.fromCharCode(b)
  const expected = btoa(binary)

  // signatureHeader may contain multiple "v1,<sig>" entries separated by spaces.
  const candidates = signatureHeader.split(' ')
  for (const candidate of candidates) {
    const [version, sig] = candidate.split(',')
    if (version !== 'v1' || !sig) continue
    if (timingSafeEqual(sig, expected)) return true
  }
  return false
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const secret = Deno.env.get('SEND_EMAIL_HOOK_SECRET')
  if (!secret) {
    console.error('SEND_EMAIL_HOOK_SECRET not configured')
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  // Read Standard Webhooks headers
  const webhookId = req.headers.get('webhook-id')
  const webhookTimestamp = req.headers.get('webhook-timestamp')
  const webhookSignature = req.headers.get('webhook-signature')
  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return new Response(
      JSON.stringify({ error: 'Missing webhook headers' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  // Reject stale timestamps (replay protection)
  const timestampSeconds = parseInt(webhookTimestamp, 10)
  if (Number.isNaN(timestampSeconds)) {
    return new Response(
      JSON.stringify({ error: 'Invalid webhook timestamp' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - timestampSeconds)
  if (ageSeconds > MAX_WEBHOOK_AGE_SECONDS) {
    return new Response(
      JSON.stringify({ error: 'Webhook timestamp too old' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  // Read the raw body for signature verification (must use the exact bytes
  // sent by Supabase — parsing then re-stringifying could change formatting).
  const rawBody = await req.text()

  const signatureValid = await verifyWebhookSignature(
    secret,
    webhookId,
    webhookTimestamp,
    webhookSignature,
    rawBody,
  )
  if (!signatureValid) {
    console.error('Webhook signature verification failed', { webhookId })
    return new Response(
      JSON.stringify({ error: 'Invalid signature' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  // Parse the verified payload. Supabase Send Email Hook v1 shape:
  //   {
  //     user: { id, email, ... },
  //     email_data: {
  //       email_action_type: 'signup' | 'invite' | 'magiclink' | 'recovery'
  //                        | 'email_change' | 'reauthentication',
  //       token: '...',
  //       token_hash: '...',
  //       site_url: 'https://...',
  //       redirect_to: 'https://...',
  //       new_email?: '...',     // email_change
  //       token_new?: '...',     // email_change
  //     },
  //   }
  let payload: any
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  const user = payload?.user ?? {}
  const emailData = payload?.email_data ?? {}
  const emailType = emailData.email_action_type as string | undefined
  const recipient = user.email as string | undefined

  if (!emailType || !recipient) {
    console.error('Webhook payload missing email_action_type or user.email', { emailType, recipient })
    return new Response(
      JSON.stringify({ error: 'Invalid payload' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  const EmailTemplate = EMAIL_TEMPLATES[emailType]
  if (!EmailTemplate) {
    console.error('Unknown email type', { emailType })
    return new Response(
      JSON.stringify({ error: `Unknown email type: ${emailType}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  // Construct the confirmation URL. Supabase expects the verify endpoint at
  // <site_url>/auth/v1/verify with token_hash + type + redirect_to params.
  const siteUrl: string = emailData.site_url || `https://buildyourfootprint.com`
  const tokenHash: string = emailData.token_hash || ''
  const redirectTo: string = emailData.redirect_to || siteUrl
  const confirmationUrl =
    `${siteUrl.replace(/\/$/, '')}/auth/v1/verify` +
    `?token=${encodeURIComponent(tokenHash)}` +
    `&type=${encodeURIComponent(emailType)}` +
    `&redirect_to=${encodeURIComponent(redirectTo)}`

  // Build template props matching the existing templates' expected shape.
  const templateProps = {
    siteName: SITE_NAME,
    siteUrl,
    recipient,
    confirmationUrl,
    token: emailData.token,
    email: recipient,
    oldEmail: recipient,
    newEmail: emailData.new_email,
  }

  // Render React Email to HTML and plain text
  const html = await renderAsync(React.createElement(EmailTemplate, templateProps))
  const text = await renderAsync(React.createElement(EmailTemplate, templateProps), {
    plainText: true,
  })

  // Enqueue the rendered email for async processing by process-email-queue.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const messageId = crypto.randomUUID()

  // Log pending BEFORE enqueue so we have a record even if enqueue crashes
  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: emailType,
    recipient_email: recipient,
    status: 'pending',
  })

  const { error: enqueueError } = await supabase.rpc('enqueue_email', {
    queue_name: 'auth_emails',
    payload: {
      message_id: messageId,
      to: recipient,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject: EMAIL_SUBJECTS[emailType] || 'Notification',
      html,
      text,
      purpose: 'auth',
      label: emailType,
      idempotency_key: `auth-${messageId}`,
      queued_at: new Date().toISOString(),
    },
  })

  if (enqueueError) {
    console.error('Failed to enqueue auth email', { error: enqueueError, emailType })
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: emailType,
      recipient_email: recipient,
      status: 'failed',
      error_message: 'Failed to enqueue email',
    })
    return new Response(JSON.stringify({ error: 'Failed to enqueue email' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  console.log('Auth email enqueued', { emailType, recipient })

  return new Response(
    JSON.stringify({ success: true, queued: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  )
})