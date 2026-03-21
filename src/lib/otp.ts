// ============================================================
// src/lib/otp.ts
//
// Email OTP system for registration, password reset, etc.
//
// Security properties:
//  • 6-digit cryptographically random OTP
//  • Argon2id hashed before DB storage
//  • 10-minute expiry
//  • Max 5 failed attempts before invalidation
//  • Rate limited per email (5 OTPs per hour via Redis)
//  • OTP is single-use
// ============================================================

import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import prisma from './db';
import { redis } from './redis';
import { OtpPurpose } from '@prisma/client';

const OTP_LENGTH    = Number(process.env.OTP_LENGTH)           || 6;
const OTP_EXPIRY    = Number(process.env.OTP_EXPIRY_MINUTES)   || 10;
const MAX_ATTEMPTS  = Number(process.env.OTP_MAX_ATTEMPTS)     || 5;
const RATE_LIMIT    = Number(process.env.OTP_RATE_LIMIT_PER_HOUR) || 5;

// ─── GENERATE ────────────────────────────────────────────────

/**
 * Generate a cryptographically secure numeric OTP.
 */
function generateOtp(): string {
  const max   = Math.pow(10, OTP_LENGTH);
  const bytes = crypto.randomBytes(4);
  const num   = bytes.readUInt32BE(0) % max;
  return num.toString().padStart(OTP_LENGTH, '0');
}

// ─── RATE LIMITING ───────────────────────────────────────────

async function checkRateLimit(email: string): Promise<boolean> {
  const key = `otp:rl:${email}`;
  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, 3600); // 1 hour window
    }
    return count <= RATE_LIMIT;
  } catch {
    // If Redis is down, allow (fail open for OTP rate limiting)
    return true;
  }
}

// ─── CREATE OTP ──────────────────────────────────────────────

/**
 * Create an OTP for a given email and purpose.
 * Invalidates any existing OTP for the same email+purpose.
 * Returns the PLAIN OTP (to be emailed — never stored in plain).
 *
 * @throws Error if rate limit exceeded
 */
export async function createOtp(
  email: string,
  purpose: OtpPurpose,
  userId?: string,
  ipAddress?: string
): Promise<string> {
  const allowed = await checkRateLimit(email);
  if (!allowed) {
    throw new Error('Too many OTP requests. Please wait an hour before requesting again.');
  }

  // Invalidate existing OTPs for this email+purpose
  await prisma.otpRecord.updateMany({
    where:  { email, purpose, isUsed: false },
    data:   { isUsed: true },
  });

  const plain    = generateOtp();
  const hashed   = await argon2.hash(plain, {
    type:        argon2.argon2id,
    memoryCost:  16384, // Lighter than login — OTPs are short-lived
    timeCost:    2,
    parallelism: 1,
  });

  await prisma.otpRecord.create({
    data: {
      email,
      otp:       hashed,
      purpose,
      userId,
      expiresAt: new Date(Date.now() + OTP_EXPIRY * 60 * 1000),
      ipAddress,
    },
  });

  return plain;
}

// ─── VERIFY OTP ──────────────────────────────────────────────

export type OtpVerifyResult =
  | { success: true;  record: { id: string; userId: string | null; email: string } }
  | { success: false; error: 'EXPIRED' | 'INVALID' | 'MAX_ATTEMPTS' | 'NOT_FOUND' };

/**
 * Verify an OTP for a given email and purpose.
 * Marks as used on success; increments attempt counter on failure.
 */
export async function verifyOtp(
  email:   string,
  plain:   string,
  purpose: OtpPurpose
): Promise<OtpVerifyResult> {
  const record = await prisma.otpRecord.findFirst({
    where: {
      email,
      purpose,
      isUsed: false,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) return { success: false, error: 'NOT_FOUND' };

  if (new Date() > record.expiresAt) {
    await prisma.otpRecord.update({
      where: { id: record.id },
      data:  { isUsed: true },
    });
    return { success: false, error: 'EXPIRED' };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return { success: false, error: 'MAX_ATTEMPTS' };
  }

  const valid = await argon2.verify(record.otp, plain);

  if (!valid) {
    await prisma.otpRecord.update({
      where: { id: record.id },
      data:  { attempts: { increment: 1 } },
    });
    return { success: false, error: 'INVALID' };
  }

  // Mark as used
  await prisma.otpRecord.update({
    where: { id: record.id },
    data:  { isUsed: true },
  });

  return { success: true, record: { id: record.id, userId: record.userId, email: record.email } };
}
