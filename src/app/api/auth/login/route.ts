// ============================================================
// src/app/api/auth/login/route.ts
// ============================================================
import { NextRequest } from 'next/server';
import { z } from 'zod';
import * as argon2 from 'argon2';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { SESSION_OPTIONS, SessionData, createSession } from '@/lib/session';
import { rateLimit } from '@/lib/redis';
import { ok, errors, routeHandler } from '@/lib/api';

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export const POST = routeHandler(async (req: NextRequest) => {
  const ip  = req.headers.get('x-forwarded-for') ?? 'unknown';
  const rl  = await rateLimit(`login:${ip}`, 10, 60);
  if (!rl.allowed) return errors.tooManyReqs('Too many login attempts. Please wait 60 seconds.');

  const body   = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return errors.validation(parsed.error.issues);

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  // Generic message — don't reveal whether email exists
  const INVALID_MSG = 'Invalid email or password';

  if (!user || !user.isActive)        return errors.unauthorized(INVALID_MSG);
  if (user.isBanned)                  return errors.forbidden('Your account has been suspended.');
  if (!user.isVerified)               return errors.unauthorized('Please verify your email first.');

  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) {
    await prisma.auditLog.create({
      data: { userId: user.id, action: 'LOGIN_FAILED', ipAddress: ip }
    });
    return errors.unauthorized(INVALID_MSG);
  }

  const sessionData: SessionData = {
    userId:         user.id,
    email:          user.email,
    fullName:       user.fullName,
    designatedPost: user.designatedPost,
    locationId:     user.locationId,
    sessionId:      '',
    isVerified:     user.isVerified,
  };

  const dbSession = await createSession(sessionData, ip, req.headers.get('user-agent') ?? undefined);
  sessionData.sessionId = dbSession.id;

  const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS);
  Object.assign(session, sessionData);
  await session.save();

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await prisma.auditLog.create({ data: { userId: user.id, action: 'LOGIN', ipAddress: ip } });

  return ok({
    user: { id: user.id, email: user.email, fullName: user.fullName,
            designatedPost: user.designatedPost, locationId: user.locationId,
            profilePictureUrl: user.profilePictureUrl },
  }, 'Welcome back!');
});



