import { createClient } from 'npm:@supabase/supabase-js@2'
// Inline CORS headers — the @supabase/supabase-js@2/cors subpath does not exist.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

function jsonResponse(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseServiceKey) {
    return jsonResponse({ error: 'Server configuration error' }, 500)
  }

  // Extract token from query params (GET) or body (POST)
  const url = new URL(req.url)
  let token: string | null = url.searchParams.get('token')

  if (req.method === 'POST') {
    const contentType = req.headers.get('content-type') ?? ''
    if (contentType.includes('application/x-www-form-urlencoded')) {
      // Two distinct form-encoded scenarios:
      // 1. RFC 8058 one-click unsubscribe (Gmail/Apple Mail inbox button):
      //    body = "List-Unsubscribe=One-Click", token is in the URL query string
      //    (already captured above from url.searchParams).
      // 2. Manual form POST from a custom unsubscribe page:
      //    body = "token=xxx", no List-Unsubscribe key.
      // If we don't see List-Unsubscribe in the body, try the body for a token.
      const formText = await req.text()
      const params = new URLSearchParams(formText)
      if (!params.get('List-Unsubscribe')) {
        const formToken = params.get('token')
        if (formToken) token = formToken
      }
    } else {
      // JSON body (from the app's unsubscribe page)
      try {
        const body = await req.json()
        if (body.token) token = body.token
      } catch {
        // Fall through — token stays from query param
      }
    }
  }

  if (!token) {
    return jsonResponse({ error: 'Token is required' }, 400)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Look up the token
  const { data: tokenRecord, error: lookupError } = await supabase
    .from('email_unsubscribe_tokens')
    .select('*')
    .eq('token', token)
    .maybeSingle()

  if (lookupError || !tokenRecord) {
    return jsonResponse({ error: 'Invalid or expired token' }, 404)
  }

  if (tokenRecord.used_at) {
    return jsonResponse({ valid: false, reason: 'already_unsubscribed' })
  }

  // GET: Validate token (the app's unsubscribe page calls this on load)
  if (req.method === 'GET') {
    return jsonResponse({ valid: true })
  }

  // POST: Process the unsubscribe
  // Atomic check-and-update to avoid TOCTOU race
  const { data: updated, error: updateError } = await supabase
    .from('email_unsubscribe_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token)
    .is('used_at', null)
    .select()
    .maybeSingle()

  if (updateError) {
    console.error('Failed to mark token as used', { error: updateError, token })
    return jsonResponse({ error: 'Failed to process unsubscribe' }, 500)
  }

  if (!updated) {
    return jsonResponse({ success: false, reason: 'already_unsubscribed' })
  }

  // Add email to suppressed list (upsert to handle duplicates)
  const { error: suppressError } = await supabase
    .from('suppressed_emails')
    .upsert(
      { email: tokenRecord.email.toLowerCase(), reason: 'unsubscribe' },
      { onConflict: 'email' },
    )

  if (suppressError) {
    console.error('Failed to suppress email', {
      error: suppressError,
      email: tokenRecord.email,
    })
    return jsonResponse({ error: 'Failed to process unsubscribe' }, 500)
  }

  console.log('Email unsubscribed', { email: tokenRecord.email })

  return jsonResponse({ success: true })
})