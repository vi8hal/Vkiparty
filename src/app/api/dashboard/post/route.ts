import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import prisma from '@/lib/db';
import { PostType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { content, locationId, type } = body;

    // O(1) TIME COMPLEXITY SCALABILITY FIX:
    // We already cryptographically trust the user's location via the JWT Session!
    // NO NEED to perform a database `findUnique` read before writing.
    // This removes half the DB latency and frees connection pooling slots.

    if (session.locationId !== locationId) {
      return NextResponse.json({ error: 'Forbidden: Cannot post outside your territory bound' }, { status: 403 });
    }

    const postActionType = Object.values(PostType).includes(type) ? type : 'GENERAL';

    const post = await prisma.feedPost.create({
      data: {
        content,
        authorId: session.userId,
        locationId: locationId,
        type: postActionType
      }
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Server error creating post' }, { status: 500 });
  }
}
