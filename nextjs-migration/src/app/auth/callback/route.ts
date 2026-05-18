import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { EmailOtpType } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

// Only allow same-origin redirects to prevent open-redirect attacks.
function safeRedirectPath(redirectTo: string | null, requestUrl: string): string {
  if (!redirectTo) return '/portal'
  try {
    const target = new URL(redirectTo)
    if (target.origin === new URL(requestUrl).origin)
      return target.pathname + target.search + target.hash
  } catch {
    if (redirectTo.startsWith('/')) return redirectTo
  }
  return '/portal'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')
  const next = safeRedirectPath(
    searchParams.get('redirect_to') ?? searchParams.get('next'),
    request.url,
  )

  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        },
      },
    },
  )

  if (token_hash) {
    if (!type) {
      return NextResponse.redirect(new URL('/login?error=missing_params', request.url))
    }
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (!error) return NextResponse.redirect(new URL(next, request.url))
    console.error('[auth/callback] verifyOtp failed', { type, error: error.message })
    return NextResponse.redirect(new URL('/login?error=verification_failed', request.url))
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(next, request.url))
    console.error('[auth/callback] exchangeCodeForSession failed', { error: error.message })
    return NextResponse.redirect(new URL('/login?error=verification_failed', request.url))
  }

  return NextResponse.redirect(new URL('/login?error=missing_params', request.url))
}
