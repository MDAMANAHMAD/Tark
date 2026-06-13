import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if it's an admin dashboard route, excluding the login page
  const isAdminPath = path.startsWith('/admin') && path !== '/admin/login';

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to login if trying to access admin pages while logged out
  if (isAdminPath && !token) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // Redirect to dashboard if trying to access login while already logged in
  if (path === '/admin/login' && token) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
