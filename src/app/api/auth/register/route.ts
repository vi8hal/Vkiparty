// ============================================================
// src/app/api/auth/register/route.ts
// POST /api/auth/register — Step 1: Send registration OTP
// ============================================================

import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { createOtp } from '@/lib/otp';
import { sendRegistrationOtp } from '@/lib/mailer';
import { rateLimit } from '@/lib/redis';
import { ok, errors, routeHandler } from '@/lib/api';

const schema = z.object({
  email:    z.string().email('Invalid email address'),
  fullName: z.string().min(2).max(100).trim(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  age:      z.number().int().min(18).max(100),
  designatedPost: z.enum([
    'PRESIDENT','VICE_PRESIDENT','SECRETARY','JOINT_SECRETARY',
    'TREASURER','SPOKESPERSON','YOUTH_WING','WOMEN_WING','KARYAKARTA'
  ]),
  locationId: z.string().uuid('Invalid location'),
  phone:      z.string().regex(/^[6-9]\d{9}$/).optional(),
});

export const POST = routeHandler(async (req: NextRequest) => {
  // Rate limit by IP
  const ip  = req.headers.get('x-forwarded-for') ?? 'unknown';
  const rl  = await rateLimit(`register:${ip}`, 5, 300);
  if (!rl.allowed) return errors.tooManyReqs();

  const body   = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return errors.validation(parsed.error.issues);

  const { email, fullName, age, designatedPost, locationId, phone } = parsed.data;

  // Check email uniqueness
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return errors.conflict('An account with this email already exists');

  // Verify location exists
  const location = await prisma.location.findUnique({ where: { id: locationId } });
  if (!location) return errors.notFound('Location');

  // Store registration data temporarily in Redis until OTP verified
  const { redis } = await import('@/lib/redis');
  await redis.set(
    `reg:pending:${email}`,
    JSON.stringify({ email, fullName, age, designatedPost, locationId, phone,
      password: parsed.data.password }),
    { ex: 600 } // 10 minutes — same as OTP expiry
  );

  // Generate and send OTP
  const otp = await createOtp(email, 'REGISTRATION', undefined, ip);
  await sendRegistrationOtp(email, otp);

  return ok({ email }, 'Verification code sent to your email');
});
