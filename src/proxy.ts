// ============================================================
// src/middleware.ts
// Next.js Edge Middleware — route protection
// Redirects unauthenticated users to /auth/login
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, SESSION_OPTIONS } from '@/lib/session';

// Routes that require authentication
const PROTECTED = ['/dashboard', '/chat', '/profile', '/search', '/notifications', '/campaigns', '/events', '/polls'];

// Routes only for guests (redirect to dashboard if already authed)
const GUEST_ONLY = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export async function proxy(req: NextRequest) {
  const path     = req.nextUrl.pathname;
  const res      = NextResponse.next();

  // Check if the path is protected
  const isProtected = PROTECTED.some(p => path.startsWith(p));
  const isGuestOnly = GUEST_ONLY.some(p => path.startsWith(p));

  if (!isProtected && !isGuestOnly) return res;

  // Read session cookie
  const session = await getIronSession<SessionData>(req, res, SESSION_OPTIONS);

  const isAuthed = Boolean(session.userId);

  if (isProtected && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }

  if (isGuestOnly && isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*', '/chat/:path*', '/profile/:path*',
    '/search/:path*', '/notifications/:path*', '/campaigns/:path*',
    '/events/:path*', '/polls/:path*',
    '/auth/login', '/auth/register', '/auth/forgot-password',
  ],
};
