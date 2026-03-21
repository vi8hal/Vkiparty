// ============================================================
// src/app/api/chat/rooms/[roomId]/messages/route.ts
// GET  — Fetch messages (cursor-based pagination)
// POST — Send a message
// ============================================================

import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { ok, errors, routeHandler } from '@/lib/api';

const PAGE_SIZE = 30;

// GET /api/chat/rooms/:roomId/messages?cursor=<messageId>
export const GET = routeHandler(async (
  req: NextRequest,
  { params }: { params: { roomId: string } }
) => {
  const session = await getSession();
  if (!session) return errors.unauthorized();

  const { roomId } = params;
  const cursor = req.nextUrl.searchParams.get('cursor') ?? undefined;

  // Verify membership
  const member = await prisma.chatRoomMember.findFirst({
    where: { roomId, userId: session.userId, leftAt: null },
  });
  if (!member) return errors.forbidden('You are not a member of this chat room');

  const messages = await prisma.message.findMany({
    where:    { roomId, isDeleted: false },
    take:     PAGE_SIZE + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy:  { sentAt: 'desc' },
    include: {
      sender: {
        select: {
          id: true, fullName: true,
          profilePictureUrl: true, designatedPost: true,
        },
      },
      reactions: {
        include: { user: { select: { id: true, fullName: true } } },
      },
      replyTo: {
        select: {
          id: true, content: true,
          sender: { select: { fullName: true } },
        },
      },
    },
  });

  const hasMore     = messages.length > PAGE_SIZE;
  const trimmed     = hasMore ? messages.slice(0, PAGE_SIZE) : messages;
  const nextCursor  = hasMore ? trimmed[trimmed.length - 1].id : null;

  // Update last read
  await prisma.chatRoomMember.update({
    where: { roomId_userId: { roomId, userId: session.userId } },
    data:  { lastReadAt: new Date() },
  });

  return ok({ messages: trimmed.reverse(), nextCursor, hasMore });
});

// POST /api/chat/rooms/:roomId/messages
const sendSchema = z.object({
  content:     z.string().min(1).max(4000).optional(),
  messageType: z.enum(['TEXT', 'IMAGE', 'DOCUMENT', 'AUDIO']).default('TEXT'),
  mediaUrl:    z.string().url().optional(),
  mediaSize:   z.number().int().max(10_000_000).optional(), // 10MB max
  replyToId:   z.string().uuid().optional(),
});

export const POST = routeHandler(async (
  req: NextRequest,
  { params }: { params: { roomId: string } }
) => {
  const session = await getSession();
  if (!session) return errors.unauthorized();

  const { roomId } = params;

  const member = await prisma.chatRoomMember.findFirst({
    where: { roomId, userId: session.userId, leftAt: null },
  });
  if (!member) return errors.forbidden('Not a member of this room');

  const body   = await req.json();
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) return errors.validation(parsed.error.issues);

  const { content, messageType, mediaUrl, mediaSize, replyToId } = parsed.data;

  if (!content && !mediaUrl) {
    return errors.badRequest('Message must have content or media');
  }

  const message = await prisma.message.create({
    data: { roomId, senderId: session.userId, content, messageType, mediaUrl, mediaSize, replyToId },
    include: {
      sender: { select: { id: true, fullName: true, profilePictureUrl: true, designatedPost: true } },
      replyTo: { select: { id: true, content: true, sender: { select: { fullName: true } } } },
    },
  });

  // Update room's updatedAt for ordering
  await prisma.chatRoom.update({ where: { id: roomId }, data: { updatedAt: new Date() } });

  // Create notifications for other members (fire and forget)
  notifyRoomMembers(roomId, session.userId, session.fullName, content ?? 'Sent a file').catch(() => {});

  return ok(message, undefined, 201);
});

async function notifyRoomMembers(
  roomId: string, senderId: string, senderName: string, preview: string
) {
  const members = await prisma.chatRoomMember.findMany({
    where: { roomId, userId: { not: senderId }, leftAt: null, isMuted: false },
    select: { userId: true },
  });

  if (!members.length) return;

  await prisma.notification.createMany({
    data: members.map(m => ({
      userId:      m.userId,
      triggeredBy: senderId,
      type:        'NEW_MESSAGE' as const,
      title:       `New message from ${senderName}`,
      body:        preview.length > 80 ? preview.slice(0, 77) + '…' : preview,
      link:        `/chat/${roomId}`,
    })),
    skipDuplicates: true,
  });
}
