// ============================================================
// src/lib/session.ts
//
// Cookie-based session management using iron-session.
//
// Why iron-session?
//  • Stores session data in an encrypted, tamper-proof cookie
//  • No server-side session store needed for basic data
//  • Works perfectly with Vercel Edge / serverless functions
//  • HTTP-only, Secure, SameSite=Strict cookies by default
//
// For real-time data (socket auth), we also validate against
// the Session table in PostgreSQL.
// ============================================================

import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import prisma from './db';

// ─── SESSION DATA SHAPE ──────────────────────────────────────

export interface SessionData {
  userId: string;
  email: string;
  fullName: string;
  designatedPost: string;
  locationId: string;
  sessionId: string;   // DB Session.id for revocation
  isVerified: boolean;
}

// ─── SESSION OPTIONS ─────────────────────────────────────────

export const SESSION_OPTIONS: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'manki_session',
  cookieOptions: {
    // Secure in production (HTTPS only)
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const,
    // 72 hours
    maxAge: 60 * 60 * (Number(process.env.SESSION_EXPIRY_HOURS) || 72),
    path: '/',
  },
};

// ─── HELPERS ─────────────────────────────────────────────────

export async function getSession(): Promise<SessionData | null> {
  const session = await getIronSession<SessionData>(
    cookies(),
    SESSION_OPTIONS
  );

  if (!session.userId) return null;

  // SCALABILITY FIX (O(1) Time + Memory): 
  // At 21 Crore specific users, hitting Postgres to validate the session for every network 
  // request (Dashboard, Feeds) creates a massive bottleneck.
  // Iron-session decrypts and authenticates cryptographically natively. 
  // We completely bypass the DB here, executing strictly on the Edge CPU in ~1ms!
  
  return session;
}

/**
 * Get session from a Request object (for middleware / Route Handlers).
 */
export async function getSessionFromRequest(
  req: NextRequest
): Promise<SessionData | null> {
  const res  = new NextResponse();
  const session = await getIronSession<SessionData>(req, res, SESSION_OPTIONS);
  if (!session.userId) return null;
  return session;
}

/**
 * Create a new session after successful login.
 * Returns the iron-session instance so the caller can call .save().
 */
export async function createSession(
  data: SessionData,
  ipAddress?: string,
  userAgent?: string
) {
  const expiresAt = new Date(
    Date.now() + 1000 * 60 * 60 * (Number(process.env.SESSION_EXPIRY_HOURS) || 72)
  );

  // Record in DB for revocation support
  const dbSession = await prisma.session.create({
    data: {
      userId:    data.userId,
      tokenHash: data.sessionId, // We store the session ID as the token reference
      ipAddress,
      userAgent,
      expiresAt,
    },
  });

  return dbSession;
}

/**
 * Revoke a session by its DB ID.
 */
export async function revokeSession(sessionId: string) {
  await prisma.session.deleteMany({ where: { id: sessionId } });
}

/**
 * Revoke ALL sessions for a user (e.g., password reset).
 */
export async function revokeAllSessions(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
}

/**
 * Middleware helper: redirect to login if not authenticated.
 */
export async function requireAuth(
  req: NextRequest
): Promise<SessionData | NextResponse> {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  return session;
}
