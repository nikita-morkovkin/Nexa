import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { nextUrl, cookies, url } = request;
  const session = cookies.get('nexa_session')?.value;

  const isAuthRoute = nextUrl.pathname.startsWith('/account');
  const isDeactivateRoute = nextUrl.pathname === '/account/deactivate';
  const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');

  if (!session && isDashboardRoute) {
    return NextResponse.redirect(new URL('/account/login', url));
  }

  if (!session && isDeactivateRoute) {
    return NextResponse.redirect(new URL('/account/login', url));
  }

  if (session && isAuthRoute && !isDeactivateRoute) {
    return NextResponse.redirect(new URL('/dashboard/settings', url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/dashboard/:path*'],
};
