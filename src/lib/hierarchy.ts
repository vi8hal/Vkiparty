import prisma from './db';
import { redis } from './redis';
import { AdminLevel, PostLevel } from '@prisma/client';

/**
 * ============================================================
 * HIERARCHY PERFORMANCE OPTIMIZATIONS
 * ============================================================
 * Time-to-Memory Constraints: Avoid fetching thousands of records.
 * We use Cursor-Based Pagination and specific select statements 
 * so memory usage stays O(1) relative to total regional members.
 * 
 * Concurrency: We aggressively cache static structure and expensive
 * aggregations (like user counts per region) using Redis.
 * ============================================================
 */

export interface GetUsersOptions {
  locationId: string;
  cursor?: string;
  limit?: number;
  designatedPost?: PostLevel;
}

/**
 * Highly optimized, cursor-based user fetcher for a specific territory.
 * It uses the 'pathIds' index to quickly find all locations underneath the parent.
 */
export async function getUsersInHierarchy({ locationId, cursor, limit = 50, designatedPost }: GetUsersOptions) {
  // 1. Fetch parent location via cache to minimize DB load for pathIds resolution
  const location = await getLocationDetailsCached(locationId);
  if (!location) throw new Error('Location not found');

  // Build the prefix to match all child hierarchy levels
  const pathPrefix = location.pathIds ? `${location.pathIds}.${locationId}` : locationId;

  const whereClause: any = {
    location: {
      pathIds: {
        startsWith: pathPrefix
      }
    },
    isActive: true,
  };

  // Add post filter if required (e.g. only Presidents)
  if (designatedPost) {
    whereClause.designatedPost = designatedPost;
  }

  // 2. Fetch using Cursor to keep memory constant, avoiding huge RAM spikes
  const users = await prisma.user.findMany({
    where: whereClause,
    take: limit + 1, // Fetch 1 extra to determine if there's a next page
    ...(cursor && { cursor: { id: cursor }, skip: 1 }), // Skip the cursor itself
    orderBy: {
      id: 'asc'
    },
    select: {
      id: true,
      fullName: true,
      designatedPost: true,
      location: {
        select: {
          id: true,
          name: true,
          level: true
        }
      },
      profilePictureUrl: true,
      isVerified: true
    }
  });

  let nextCursor: string | undefined = undefined;
  if (users.length > limit) {
    const nextItem = users.pop(); // Remove the extra item
    if (nextItem) nextCursor = nextItem.id;
  }

  return {
    data: users,
    nextCursor,
  };
}

/**
 * Concurrency cache wrapper for location details.
 * Prevents DB hits for mostly static tree data.
 */
export async function getLocationDetailsCached(locationId: string) {
  const cacheKey = `location:${locationId}`;
  
  // Try Redis cache first
  const cached = await redis.get<{ id: string, name: string, level: AdminLevel, pathIds: string }>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fallback to database
  const loc = await prisma.location.findUnique({
    where: { id: locationId },
    select: {
      id: true,
      name: true,
      level: true,
      pathIds: true,
    }
  });

  if (loc) {
    // Cache for 1 hour (tree structure rarely changes)
    await redis.set(cacheKey, loc, { ex: 3600 });
  }

  return loc;
}

/**
 * Aggregation endpoint for regional user counts.
 * Caches heavily because "Count all users in State" is an expensive DB operation.
 */
export async function getHierarchyCountsCached(locationId: string) {
  const cacheKey = `counts:hierarchy:${locationId}`;
  
  const cached = await redis.get<{ total: number, active: number }>(cacheKey);
  if (cached) {
    return cached;
  }

  const location = await getLocationDetailsCached(locationId);
  if (!location) return { total: 0, active: 0 };

  const pathPrefix = location.pathIds ? `${location.pathIds}.${locationId}` : locationId;

  // Optimize aggregation
  const [total, active] = await Promise.all([
    prisma.user.count({
      where: {
        location: {
          pathIds: { startsWith: pathPrefix }
        }
      }
    }),
    prisma.user.count({
      where: {
        location: {
          pathIds: { startsWith: pathPrefix }
        },
        isActive: true
      }
    })
  ]);

  const result = { total, active };
  
  // Cache for 15 minutes
  await redis.set(cacheKey, result, { ex: 900 });

  return result;
}
