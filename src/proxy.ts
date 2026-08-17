import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token');
  const { pathname } = request.nextUrl;

  const isAuthenticated = !!token;
  const isAuthRoute = pathname.startsWith('/auth');

  // Redirect authenticated users away from /auth routes to /home
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Redirect unauthenticated users accessing protected routes to /auth/login
  if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/auth/:path*'],
};
