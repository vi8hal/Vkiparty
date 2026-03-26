// ============================================================
// src/lib/notifications.ts
//
// Scalable notification queuing and delivery.
// Designed for 21-crore user scale using Upstash Redis.
// avoids DB bottlenecks for massive broadcast lists.
// ============================================================

import { redis } from './redis';
import prisma from './db';

interface NotificationJob {
  userId: string;
  triggeredBy: string;
  type: 'NEW_MESSAGE' | 'SYSTEM' | 'CAMPAIGN_ASSIGNED' | 'MENTION';
  title: string;
  body: string;
  link?: string;
}

/**
 * Queue a single notification for immediate delivery.
 * Pushes to a Redis list for separate worker processing.
 */
export async function queueNotification(job: NotificationJob) {
  try {
    // In a high-scale system, we push to a Redis queue.
    // For now, we simulate by adding to a list that a background worker would poll.
    await redis.lpush('queue:notifications', JSON.stringify({
      ...job,
      enqueuedAt: new Date().toISOString()
    }));
  } catch (err) {
    console.error('[Notification Queue Error]', err);
    // Fallback: critical notifications could be written directly to DB.
  }
}

/**
 * Queue bulk notifications (e.g., for a whole chat room).
 * Optimized to handle thousands of users without blocking the main thread.
 */
export async function queueBulkNotifications(jobs: NotificationJob[]) {
  if (jobs.length === 0) return;

  // Split into chunks of 500 to avoid Redis payload limits
  const CHUNK_SIZE = 500;
  for (let i = 0; i < jobs.length; i += CHUNK_SIZE) {
    const chunk = jobs.slice(i, i + CHUNK_SIZE);
    try {
      await redis.lpush(
        'queue:notifications',
        ...chunk.map(job => JSON.stringify({ ...job, enqueuedAt: new Date().toISOString() }))
      );
    } catch (err) {
      console.error('[Bulk Notification Queue Error]', err);
    }
  }
}

/**
 * EMERGENCY FALLBACK: Sync write to DB.
 * Only use if Redis is down or for extremely critical 1-to-1 sync alerts.
 */
export async function notifyImmediately(job: NotificationJob) {
  return prisma.notification.create({
    data: {
      userId:      job.userId,
      triggeredBy: job.triggeredBy,
      type:        job.type,
      title:       job.title,
      body:        job.body,
      link:        job.link,
    }
  });
}
