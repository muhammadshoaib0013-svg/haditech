import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'

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

  return NextResponse.json({
    success: true,
    config: {
      ADMIN_PASSWORD,
      NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY,
      bucketName: 'haditech-media'
    }
  })
}
