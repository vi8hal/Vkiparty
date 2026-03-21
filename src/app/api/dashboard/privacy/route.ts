import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    
    // Whitelist allowed toggle toggles
    const updateData: any = {};
    if (typeof body.showAddress === 'boolean') updateData.showAddress = body.showAddress;
    if (typeof body.showContacts === 'boolean') updateData.showContacts = body.showContacts;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Bad Request: No valid fields provided.' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, showAddress: updatedUser.showAddress, showContacts: updatedUser.showContacts });
  } catch (error) {
    console.error('Error updating privacy:', error);
    return NextResponse.json({ error: 'Server error updating privacy' }, { status: 500 });
  }
}
