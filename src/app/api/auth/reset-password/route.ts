import { NextRequest } from 'next/server';
import { z } from 'zod';
import * as argon2 from 'argon2';
import prisma from '@/lib/db';
import { ok, errors } from '@/lib/api';

export async function POST(req: NextRequest) {
  const body   = await req.json();
  const parsed = z.object({
    email:       z.string().email(),
    newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  }).safeParse(body);
  if (!parsed.success) return errors.validation(parsed.error.issues);

  const { email, newPassword } = parsed.data;

  // Check reset was pre-authorised by OTP verification
  const { redis } = await import('@/lib/redis');
  const allowed = await redis.get(`pwd:reset:${email}`);
  if (!allowed) return errors.forbidden('Password reset session expired. Please start over.');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return errors.notFound('User');

  const passwordHash = await argon2.hash(newPassword, {
    type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4,
  });

  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  await redis.del(`pwd:reset:${email}`);

  // Revoke all existing sessions (force re-login on all devices)
  const { revokeAllSessions } = await import('@/lib/session');
  await revokeAllSessions(user.id);

  await prisma.auditLog.create({ data: { userId: user.id, action: 'PASSWORD_RESET' } });

  return ok({}, 'Password reset successfully. Please log in with your new password.');
}
