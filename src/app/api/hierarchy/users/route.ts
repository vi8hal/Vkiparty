import { NextRequest, NextResponse } from 'next/server';
import { getUsersInHierarchy, getHierarchyCountsCached } from '@/lib/hierarchy';
import { PostLevel } from '@prisma/client';
import { rateLimit } from '@/lib/redis';

/**
 * ============================================================
 * HIGH PERFORMANCE HIERARCHY MEMBERSHIP API
 * ============================================================
 * Exposes a robust, memory-safe API for iterating paginated users
 * under any region (Ward -> Village -> Panchayat -> State etc.)
 * 
 * Performance characteristics:
 * 1. Constant latency: Handled by Redis caching
 * 2. Constant memory (O(1)): Through Prisma cursors (prevents JVM/Node OOMs)
 * 3. Rate-limited: To prevent query spam on location endpoints
 * ============================================================
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');
    const cursor = searchParams.get('cursor') || undefined;
    const limitParams = searchParams.get('limit');
    const limit = limitParams ? parseInt(limitParams, 10) : 50;
    const designatedPost = searchParams.get('designatedPost') as PostLevel | undefined;

    if (!locationId) {
      return NextResponse.json(
        { error: 'locationId is required' },
        { status: 400 }
      );
    }

    // High Concurrency / Anti-DDoS limitation 
    const ip = request.headers.get('x-forwarded-for') || 'anon';
    const { allowed } = await rateLimit(`hierachy_api_${ip}`, 50, 60);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Too many hierarchy fetches.' },
        { status: 429 }
      );
    }

    // Leverage our newly created lib/hierarchy algorithms
    const [counts, usersResult] = await Promise.all([
      // Execute fast Redis-cached aggregate count
      getHierarchyCountsCached(locationId),
      // Execute Cursor-paginated streaming memory-safe fetch
      getUsersInHierarchy({
        locationId,
        cursor,
        limit,
        designatedPost,
      })
    ]);

    return NextResponse.json({
      success: true,
      counts,
      data: usersResult.data,
      nextCursor: usersResult.nextCursor
    });

  } catch (error: any) {
    console.error('Hierarchy Fetch Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
