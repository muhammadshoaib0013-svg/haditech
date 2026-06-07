import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'

function checkAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)
  return sessionCookie?.value === ADMIN_COOKIE_VALUE
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    const contentType = res.headers.get('content-type') || ''
    const isImage = contentType.startsWith('image/')

    return NextResponse.json({
      success: res.status === 200 && isImage,
      status: res.status,
      contentType,
      isImage
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      status: 500,
      contentType: 'application/json',
      error: err instanceof Error ? err.message : 'Fetch failed'
    })
  }
}
