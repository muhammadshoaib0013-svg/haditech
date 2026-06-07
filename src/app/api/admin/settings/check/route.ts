import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'
import { normalizeWhatsAppNumber } from '@/lib/whatsapp'

function checkAuth(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)
  return cookie?.value === ADMIN_COOKIE_VALUE
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Detect server-side environment variables presence
  const ADMIN_PASSWORD = !!process.env.ADMIN_PASSWORD
  const NEXT_PUBLIC_SUPABASE_URL = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const NEXT_PUBLIC_SUPABASE_ANON_KEY = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const SUPABASE_SERVICE_ROLE_KEY = !!process.env.SUPABASE_SERVICE_ROLE_KEY

  const RESEND_API_KEY = !!process.env.RESEND_API_KEY
  const META_WHATSAPP_ACCESS_TOKEN = !!process.env.META_WHATSAPP_ACCESS_TOKEN
  const WHATSAPP_DEFAULT_TO = process.env.WHATSAPP_DEFAULT_TO || ""
  const WHATSAPP_DEFAULT_TO_NORMALIZED = normalizeWhatsAppNumber(WHATSAPP_DEFAULT_TO)

  return NextResponse.json({
    success: true,
    config: {
      ADMIN_PASSWORD,
      NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY,
      RESEND_API_KEY,
      META_WHATSAPP_ACCESS_TOKEN,
      WHATSAPP_DEFAULT_TO: WHATSAPP_DEFAULT_TO ? "set" : "missing",
      WHATSAPP_DEFAULT_TO_NORMALIZED,
      bucketName: 'haditech-media'
    }
  })
}
