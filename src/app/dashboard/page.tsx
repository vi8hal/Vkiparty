import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import prisma from '@/lib/db';
import DashboardClient from './DashboardClient';
import { getHierarchyCountsCached } from '@/lib/hierarchy';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/auth/login');
  }

  // Fetch complete user info and region territory details safely
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      location: true
    }
  });

  if (!user || (!user.isActive && !user.isVerified)) {
    redirect('/auth/login');
  }

  // Fetch "Twitter-like" regional feed strictly bounded by locationId
  // Also includes Noticeboard/Advisories from Admins if they share same region context
  const regionalPosts = await prisma.feedPost.findMany({
    where: { 
      // STRICTLY restricted to user's designated territory
      locationId: user.locationId 
    },
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

  // Utilize the pre-existing time-to-memory constrained hierarchy aggregation
  // Takes actual live stats of dynamic territory
  const membersCountResult = await getHierarchyCountsCached(user.locationId);
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
