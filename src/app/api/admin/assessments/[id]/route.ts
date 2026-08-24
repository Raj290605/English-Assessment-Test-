import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/services/authService';
import { AssessmentStatus } from '@prisma/client';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate and authorize as Admin
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: assessmentId } = await params;
    if (!assessmentId) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 });
    }

    // 2. Retrieve the assessment to get studentId and attemptNumber
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      select: { id: true, studentId: true, attemptNumber: true, status: true },
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Removed block on IN_PROGRESS assessments as per new requirements.

    const { studentId, attemptNumber } = assessment;

    // 4. Atomic transaction: delete + collision-safe renumbering
    await prisma.$transaction(async (tx) => {
      // Step 1: Delete the target assessment.
      // Prisma schema has onDelete: Cascade for:
      //   - AssessmentQuestion (assessmentId -> Assessment)
      //   - QuestionResponse (assessmentId -> Assessment)
      //   - OverallEvaluation (assessmentId -> Assessment)
      //   - QuestionFeedback (responseId -> QuestionResponse -> cascades)
      // So a single delete cleans up all dependent records.
      await tx.assessment.delete({ where: { id: assessmentId } });

      // Step 2: Find remaining assessments for this student that come AFTER
      // the deleted attempt (they need to shift down by 1).
      const toRenumber = await tx.assessment.findMany({
        where: {
          studentId,
          attemptNumber: { gt: attemptNumber },
        },
        select: { id: true, attemptNumber: true },
        orderBy: { attemptNumber: 'asc' },
      });

      if (toRenumber.length === 0) {
        // Nothing to renumber; we're done.
        return;
      }

      // Step 3: Move affected assessments to temporary NEGATIVE attempt numbers
      // to avoid unique constraint violations during renumbering.
      // e.g., attemptNumber 3 → -3, 4 → -4
      for (const a of toRenumber) {
        await tx.assessment.update({
          where: { id: a.id },
          data: { attemptNumber: -a.attemptNumber },
        });
      }

      // Step 4: Assign final sequential numbers (each shifted down by 1).
      for (const a of toRenumber) {
        await tx.assessment.update({
          where: { id: a.id },
          data: { attemptNumber: a.attemptNumber - 1 },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Assessment attempt deleted successfully. Remaining attempts have been renumbered.',
    });
  } catch (error: any) {
    console.error('Error deleting assessment:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete assessment' }, { status: 500 });
  }
}
