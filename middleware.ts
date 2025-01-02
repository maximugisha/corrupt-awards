// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// Add routes that don't require authentication
const publicPaths = [
  '/api/auth/login',
  '/api/auth/register',
  '/login',
  '/register',
  '/'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for API routes
  if (pathname.startsWith('/api/')) {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // Handle browser requests
  const token = request.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyToken(token);

  if (!payload) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};