import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import prisma from '@/lib/db';
import { PostType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, locationId, type } = body;

    // Strict location-bound security check
    if (session.locationId !== locationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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

    // Revalidate the dashboard page to show the new post instantly
    revalidatePath('/dashboard');

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
