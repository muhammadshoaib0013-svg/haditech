import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow the login page through — no cookie needed
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check for valid admin session cookie
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)
  const isAuthenticated = sessionCookie?.value === ADMIN_COOKIE_VALUE

  if (!isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.url)
    const currentPath = request.nextUrl.pathname + request.nextUrl.search
    loginUrl.searchParams.set('next', currentPath)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
