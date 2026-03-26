// ============================================================
// src/app/api/auth/verify-otp/route.ts
// POST — Complete registration after OTP verified
// ============================================================

import { NextRequest } from 'next/server';
import { z } from 'zod';
import * as argon2 from 'argon2';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyOtp } from '@/lib/otp';
import { redis } from '@/lib/redis';
import { SESSION_OPTIONS, SessionData, createSession } from '@/lib/session';
import { ok, errors, routeHandler } from '@/lib/api';

const schema = z.object({
  email:   z.string().email(),
  otp:     z.string().length(6),
  purpose: z.enum(['REGISTRATION', 'FORGOT_PASSWORD']),
});

export const POST = routeHandler(async (req: NextRequest) => {
  const body   = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return errors.validation(parsed.error.issues);

  const { email, otp, purpose } = parsed.data;

  const result = await verifyOtp(email, otp, purpose as any);

  if (!result.success) {
    const msgs = {
      EXPIRED:      'Verification code has expired. Please request a new one.',
      INVALID:      'Invalid verification code. Please check and try again.',
      MAX_ATTEMPTS: 'Too many failed attempts. Please request a new code.',
      NOT_FOUND:    'No verification code found. Please request a new one.',
    };
    return errors.badRequest(msgs[result.error]);
  }

  // REGISTRATION: Create the user account
  if (purpose === 'REGISTRATION') {
    const pending = await redis.get(`reg:pending:${email}`);
    if (!pending) return errors.badRequest('Registration session expired. Please start again.');

    const data = JSON.parse(pending as string);
    const passwordHash = await argon2.hash(data.password, {
      type:        argon2.argon2id,
      memoryCost:  65536,
      timeCost:    3,
      parallelism: 4,
    });

    const user = await prisma.user.create({
      data: {
        email:          data.email,
        passwordHash,
        fullName:       data.fullName,
        age:            data.age,
        designatedPost: data.designatedPost,
        locationId:     data.locationId,
        phone:          data.phone,
        isVerified:     true,
      },
    });

    await redis.del(`reg:pending:${email}`);

    // Create session
    const sessionData: SessionData = {
      userId:         user.id,
      email:          user.email,
      fullName:       user.fullName,
      designatedPost: user.designatedPost,
      locationId:     user.locationId,
      sessionId:      '',
      isVerified:     true,
    };

    const dbSession = await createSession(
      sessionData,
      req.headers.get('x-forwarded-for') ?? undefined,
      req.headers.get('user-agent') ?? undefined
    );
    sessionData.sessionId = dbSession.id;

    const session = await getIronSession<SessionData>(await cookies(), SESSION_OPTIONS);
    Object.assign(session, sessionData);
    await session.save();

    // Audit log
    await prisma.auditLog.create({
      data: { userId: user.id, action: 'REGISTRATION', ipAddress: req.headers.get('x-forwarded-for') ?? undefined }
    });

    return ok({ user: { id: user.id, email: user.email, fullName: user.fullName } }, 'Welcome to Manki Party!');
  }

  // FORGOT_PASSWORD: just confirm OTP was valid, return a reset token
  const resetToken = Buffer.from(JSON.stringify({ email, ts: Date.now() })).toString('base64');
  await redis.set(`pwd:reset:${email}`, '1', { ex: 600 });

  return ok({ resetToken, email }, 'Code verified. You can now reset your password.');
});
