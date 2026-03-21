import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { rateLimit } from '@/lib/redis';
import { ok, errors } from '@/lib/api';

export async function POST(req: NextRequest) {
  const ip  = req.headers.get('x-forwarded-for') ?? 'unknown';
  const rl  = await rateLimit(`forgotpwd:${ip}`, 3, 300);
  if (!rl.allowed) return errors.tooManyReqs();

  const body   = await req.json();
  const parsed = z.object({ email: z.string().email() }).safeParse(body);
  if (!parsed.success) return errors.validation(parsed.error.issues);

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success — don't reveal whether email exists
  if (user && user.isActive && !user.isBanned) {
    const { createOtp } = await import('@/lib/otp');
    const { sendPasswordResetOtp } = await import('@/lib/mailer');
    const otp = await createOtp(email, 'FORGOT_PASSWORD', user.id, ip);
    await sendPasswordResetOtp(email, otp);
  }

  return ok({}, 'If that email is registered, you will receive a reset code shortly.');
}
