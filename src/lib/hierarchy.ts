import prisma from './db';
import { AdminLevel, PostLevel } from '@prisma/client';
import { unstable_cache } from 'next/cache';

/**
 * ============================================================
 * CACHED TERRITORY AGGREGATIONS
 * ============================================================
 * Time-to-Memory Constraints: O(1) fetch from Edge Cache.
 * Memory Complexity: Serialized JSON segments representing territory subsets.
 * ============================================================
 */

export interface GetUsersOptions {
  locationId: string;
  cursor?: string;
  limit?: number;
  designatedPost?: PostLevel;
}

/**
 * Fetches location metadata with aggressive caching.
 * Tree structure is nearly static; 1-hour revalidation is optimal.
 */
export const getLocationDetailsCached = unstable_cache(
  async (locationId: string) => {
    return prisma.location.findUnique({
      where: { id: locationId },
      select: { id: true, name: true, level: true, pathIds: true }
    });
  },
  ['location-details'],
  { revalidate: 3600, tags: ['location-details'] }
);

/**
 * Highly optimized, cursor-based user fetcher.
 * Uses path-prefix matching on pathIds column.
 */
export async function getUsersInHierarchy({ locationId, cursor, limit = 50, designatedPost }: GetUsersOptions) {
  const location = await getLocationDetailsCached(locationId);
  if (!location) throw new Error('Location not found');

  const pathPrefix = location.pathIds ? `${location.pathIds}.${locationId}` : locationId;

  const whereClause: any = {
    location: { pathIds: { startsWith: pathPrefix } },
    isActive: true,
  };

  if (designatedPost) whereClause.designatedPost = designatedPost;

  const users = await prisma.user.findMany({
    where: whereClause,
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { id: 'asc' },
    select: {
      id: true, fullName: true, designatedPost: true, isVerified: true, profilePictureUrl: true,
      location: { select: { id: true, name: true, level: true } }
    }
  });

  let nextCursor: string | undefined = undefined;
  if (users.length > limit) {
    const nextItem = users.pop();
    if (nextItem) nextCursor = nextItem.id;
  }

  return { data: users, nextCursor };
}

/**
 * Cached regional user aggregation.
 * Recalculating counts across millions of rows is expensive; 5-minute cache is ideal.
 */
export const getHierarchyCountsCached = unstable_cache(
  async (locationId: string) => {
    const location = await getLocationDetailsCached(locationId);
    if (!location) return { total: 0, active: 0 };

    const pathPrefix = location.pathIds ? `${location.pathIds}.${locationId}` : locationId;

    const [total, active] = await Promise.all([
      prisma.user.count({ where: { location: { pathIds: { startsWith: pathPrefix } } } }),
      prisma.user.count({ where: { location: { pathIds: { startsWith: pathPrefix } }, isActive: true } })
    ]);

    return { total, active };
  },
  ['hierarchy-counts'],
  { revalidate: 300, tags: ['hierarchy-counts'] }
);
