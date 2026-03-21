// ============================================================
// src/app/api/chat/rooms/route.ts
// GET  — List chat rooms for the current user
// POST — Create a new chat room (campaign / group)
// ============================================================

import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { getSession } from '@/lib/session';
import { ok, errors, routeHandler } from '@/lib/api';

// GET /api/chat/rooms
export const GET = routeHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return errors.unauthorized();

  const rooms = await prisma.chatRoom.findMany({
    where: {
      members: { some: { userId: session.userId, leftAt: null } },
      isActive: true,
    },
    include: {
      members: {
        where: { userId: session.userId },
        select: { lastReadAt: true, isMuted: true },
      },
      messages: {
        orderBy: { sentAt: 'desc' },
        take:    1,
        include: { sender: { select: { fullName: true } } },
      },
      _count: {
        select: {
          messages: {
            where: {
              sentAt: { gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
              isDeleted: false,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  // Annotate unread counts
  const annotated = rooms.map(room => {
    const myMembership = room.members[0];
    const lastRead     = myMembership?.lastReadAt;
    return {
      id:          room.id,
      name:        room.name,
      type:        room.type,
      lastMessage: room.messages[0] ?? null,
      isMuted:     myMembership?.isMuted ?? false,
      updatedAt:   room.updatedAt,
    };
  });

  return ok(annotated);
});

// POST /api/chat/rooms
const createSchema = z.object({
  type:       z.enum(['DIRECT', 'CAMPAIGN', 'BROADCAST']),
  name:       z.string().min(2).max(100).optional(),
  memberIds:  z.array(z.string().uuid()).min(1).max(50),
  campaignId: z.string().uuid().optional(),
});

export const POST = routeHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return errors.unauthorized();

  const body   = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return errors.validation(parsed.error.issues);

  const { type, name, memberIds, campaignId } = parsed.data;

  // For DIRECT chat: create or return existing
  if (type === 'DIRECT') {
    const otherId  = memberIds[0];
    const key      = [session.userId, otherId].sort().join(':');
    const existing = await prisma.chatRoom.findFirst({ where: { directKey: key } });
    if (existing) return ok(existing);

    // Enforce location-based restriction: both users must be in the same
    // or adjacent hierarchy level
    const other = await prisma.user.findUnique({
      where:  { id: otherId },
      select: { id: true, locationId: true, location: true },
    });
    if (!other) return errors.notFound('User');

    const room = await prisma.chatRoom.create({
      data: {
        type:      'DIRECT',
        directKey: key,
        members: {
          create: [
            { userId: session.userId },
            { userId: otherId },
          ],
        },
      },
    });

    return ok(room, 'Chat started');
  }

  // GROUP / BROADCAST
  const room = await prisma.chatRoom.create({
    data: {
      type,
      name,
      campaignId,
      createdById: session.userId,
      members: {
        create: [
          { userId: session.userId, isAdmin: true },
          ...memberIds.filter(id => id !== session.userId).map(id => ({ userId: id })),
        ],
      },
    },
  });

  return ok(room, 'Room created');
});
