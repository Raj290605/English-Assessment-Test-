import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'english-assessment-platform-super-secret-key-2026'
);
const COOKIE_NAME = 'assessment_token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let session: { id: string; studentId: string; role: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      session = {
        id: payload.id as string,
        studentId: payload.studentId as string,
        role: payload.role as string,
      };
    } catch (err) {
      session = null;
    }
  }

  // Protect student routes (/dashboard, /assessment)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/assessment')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (session.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // Protect admin routes (/admin/*)
  if (pathname.startsWith('/admin')) {
    // Exclude /admin-login
    if (pathname === '/admin-login') {
      if (session && session.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    if (!session) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Auth pages redirect if already logged in
  if (pathname === '/login') {
    if (session) {
      if (session.role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/assessment/:path*', '/admin/:path*', '/login', '/admin-login'],
};
