import { NextResponse } from 'next/server';

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request) {
  const token = request.cookies.get('cleanline_token')?.value;
  const path = request.nextUrl.pathname;
  const isPublicRoute = path === '/' || path === '/login';

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    const payload = parseJwt(token);

    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('cleanline_token');
      return response;
    }

    if (!isPublicRoute && payload.role !== 'admin') {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('cleanline_token');
      return response;
    }
  }

  if (token && isPublicRoute) {
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
