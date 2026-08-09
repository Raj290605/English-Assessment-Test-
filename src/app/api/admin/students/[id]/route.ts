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
    const studentId = resolvedParams.id;

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Delete the student record
    // Since Prisma relations should have onDelete: Cascade for user's assessments,
    // this will delete the user and cascade to assessments, responses, etc. if configured properly.
    // Let's first check if the user exists and has the role STUDENT.
    const studentToDelete = await prisma.user.findUnique({
      where: { id: studentId }
    });

    if (!studentToDelete) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    if (studentToDelete.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Cannot delete non-student accounts' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: studentId }
    });

    return NextResponse.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}
