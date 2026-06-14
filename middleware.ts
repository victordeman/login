import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from "jose"
import { SESSION_COOKIE_NAME, SECRET_KEY } from "@/lib/constants"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get(SESSION_COOKIE_NAME)

  let session: { userId: string, role: string } | null = null

  if (authToken) {
    try {
      const { payload } = await jwtVerify(authToken.value, SECRET_KEY)
      session = payload as { userId: string, role: string }
    } catch (error) {
      // Invalid token, treat as unauthenticated
    }
  }

  // Protect /admin
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Protect /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect authenticated users away from /login
  if (pathname.startsWith('/login')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
}
