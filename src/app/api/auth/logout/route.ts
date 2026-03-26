import { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { SESSION_OPTIONS, SessionData } from '@/lib/session';
import { ok, errors } from '@/lib/api';

export async function POST(req: NextRequest) {
  const { getSession, revokeSession } = await import('@/lib/session');
  const session = await getSession();

  if (session) {
    await revokeSession(session.sessionId);
    await prisma.auditLog.create({
      data: { userId: session.userId, action: 'LOGOUT', ipAddress: req.headers.get('x-forwarded-for') ?? undefined }
    });
  }

  // Destroy cookie
  const ironSession = await getIronSession<SessionData>(await cookies(), SESSION_OPTIONS);
  ironSession.destroy();

  return ok({}, 'Logged out successfully');
}
