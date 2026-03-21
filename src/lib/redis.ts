// ============================================================
// src/lib/redis.ts
//
// Upstash Redis client — serverless-compatible Redis for Vercel.
// Used for: rate limiting, OTP tracking, socket.io adapter,
// session caching, and real-time presence data.
// ============================================================

import { Redis } from '@upstash/redis';

// Upstash HTTP-based Redis client — works in Vercel Edge & serverless
export const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ─── RATE LIMITER ────────────────────────────────────────────

export async function rateLimit(
  key:         string,
  maxRequests: number,
  windowSecs:  number
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const now     = Date.now();
  const window  = Math.floor(now / (windowSecs * 1000));
  const rKey    = `rl:${key}:${window}`;

  try {
    const count = await redis.incr(rKey);
    if (count === 1) await redis.expire(rKey, windowSecs);

    return {
      allowed:   count <= maxRequests,
      remaining: Math.max(0, maxRequests - count),
      resetIn:   windowSecs - (Math.floor(now / 1000) % windowSecs),
    };
  } catch {
    return { allowed: true, remaining: maxRequests, resetIn: windowSecs };
  }
}

// ─── USER PRESENCE ───────────────────────────────────────────

/** Mark a user as online (TTL: 30 seconds — refresh on heartbeat) */
export async function setUserOnline(userId: string) {
  await redis.set(`presence:${userId}`, '1', { ex: 30 });
}

export async function isUserOnline(userId: string): Promise<boolean> {
  const val = await redis.get(`presence:${userId}`);
  return val === '1';
}

/** Get online status for multiple users */
export async function getBulkOnlineStatus(
  userIds: string[]
): Promise<Record<string, boolean>> {
  if (!userIds.length) return {};
  const pipeline = redis.pipeline();
  userIds.forEach(id => pipeline.get(`presence:${id}`));
  const results = await pipeline.exec();
  return Object.fromEntries(userIds.map((id, i) => [id, results[i] === '1']));
}
