import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiFetch } from './services/api';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token');
  const { pathname } = request.nextUrl;

  const isToken = !!token;
  const isAuthRoute = pathname.startsWith('/auth');

  if (isToken) {
    const response = await apiFetch('/auth', {
      method: 'GET',
      headers: {
        Cookie: `access_token=${token.value}`,
      },
    });
    if (!response.data) {
      const redirectResponse = NextResponse.redirect(new URL('/auth/login', request.url));
      redirectResponse.cookies.delete('access_token');
      return redirectResponse;
    }
    if (isAuthRoute) return NextResponse.redirect(new URL('/home', request.url));
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-data', JSON.stringify(response.data));
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } else {
    if (!isAuthRoute) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/home/:path*', '/auth/:path*'],
};
