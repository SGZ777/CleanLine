import { NextResponse } from 'next/server';

export function proxy(request) {
  const hasSession =
    request.cookies.get('cleanline_session')?.value === '1' ||
    request.cookies.get('cleanline_token') != null;
  const path = request.nextUrl.pathname;
  const publicRoutes = ['/', '/login'];
  const isPublicRoute = publicRoutes.includes(path);

  if (!hasSession && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (hasSession && isPublicRoute) {
    return NextResponse.redirect(new URL('/homeAdm', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/homeAdm/:path*',
    '/funcionarios/:path*',
    '/setores/:path*',
    '/rotas/:path*',
    '/checklists/:path*',
    '/indicadores/:path*',
  ],
};
