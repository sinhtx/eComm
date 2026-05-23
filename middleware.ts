import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Extract visitor IP from various header sources
  // Priority: x-forwarded-for > x-real-ip > unknown
  const ip =
    request.headers
      .get('x-forwarded-for')
      ?.split(',')[0]
      .trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  // Clone request headers and add custom header for downstream use
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-visitor-ip', ip)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Configure which routes the middleware should run on
// Skip static files, images, and other assets
export const config = {
  matcher: [
    // Exclude Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$).*)',
  ],
}
