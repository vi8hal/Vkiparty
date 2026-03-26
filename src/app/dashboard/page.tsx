import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import prisma from '@/lib/db';
import DashboardClient from './DashboardClient';
import { getHierarchyCountsCached } from '@/lib/hierarchy';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic';

// ─── CACHED REGIONAL FEED ────────────────────────────────────
// Time Complexity: O(1) fetch from Edge Data Cache
// Memory Complexity: Only stores serialized JSON of 50 most recent posts
const getCachedRegionalPosts = unstable_cache(
  async (locationId: string) => {
    return prisma.feedPost.findMany({
      where: { locationId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            designatedPost: true,
            profilePictureUrl: true,
          }
        }
      }
    });
  },
  ['region-feed'],
  { revalidate: 60, tags: ['region-feed'] } // Cache for 60 seconds
);

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/auth/login');
  }

  // Fetch complete user info safely (Login is infrequent compared to dashboard feed hit)
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      location: true
    }
  });

  if (!user || (!user.isActive && !user.isVerified)) {
    redirect('/auth/login');
  }

  // Optimized Cached Data Hooks
  const [regionalPosts, membersCountResult] = await Promise.all([
    getCachedRegionalPosts(user.locationId),
    getHierarchyCountsCached(user.locationId)
  ]);

  const totalMembers = membersCountResult.active;

  return (
    <DashboardClient 
      user={user} 
      location={user.location} 
      posts={regionalPosts} 
      membersCount={totalMembers} 
    />
  );
}
