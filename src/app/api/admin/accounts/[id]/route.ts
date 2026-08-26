import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/services/authService';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const accountId = resolvedParams.id;

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    const adminToDelete = await prisma.user.findUnique({
      where: { id: accountId }
    });

    if (!adminToDelete) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 });
    }

    if (adminToDelete.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Can only delete admin accounts through this endpoint' }, { status: 400 });
    }

    // Protection 1: Prevent deleting the currently authenticated admin
    if (adminToDelete.id === user.id) {
      return NextResponse.json({ error: 'Cannot delete your currently active session account' }, { status: 400 });
    }

    // Protection 2: Prevent deleting the default system admin
    if (adminToDelete.studentId === 'admin') {
      return NextResponse.json({ error: 'Cannot delete the default system administrator account' }, { status: 400 });
    }

    // Protection 3: Prevent deleting admins tied to evaluations (Restrict constraint)
    const evaluationCount = await prisma.overallEvaluation.count({
      where: { adminId: accountId }
    });
    if (evaluationCount > 0) {
      return NextResponse.json({ error: 'Cannot delete this admin because they are linked to historical student evaluations' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: accountId }
    });

    return NextResponse.json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json(
      { error: 'Failed to delete admin' },
      { status: 500 }
    );
  }
}
