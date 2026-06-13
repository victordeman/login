import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE_NAME = "auth-token"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get(SESSION_COOKIE_NAME)

  // Protect /dashboard, /admin, and /profile
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/profile')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect authenticated users away from /login
  if (pathname.startsWith('/login')) {
    if (authToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/profile/:path*', '/login'],
}
