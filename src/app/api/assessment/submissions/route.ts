import { NextResponse } from 'next/server';
import { getSession } from '@/lib/services/authService';
import { prisma } from '@/lib/prisma';

// GET /api/assessment/submissions
// Returns all assessment attempts for the student with their responses (videos)
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');

    if (assessmentId) {
      // Single assessment with full responses + questions
      const assessment = await prisma.assessment.findFirst({
        where: { id: assessmentId, studentId: session.id },
        include: {
          responses: {
            orderBy: { questionNumber: 'asc' },
          },
        },
      });

      if (!assessment) {
        return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
      }

      // Also get questions for the question text
      const questions = await prisma.question.findMany({
        orderBy: { questionNumber: 'asc' },
      });

      return NextResponse.json({ assessment, questions });
    }

    // All attempts summary (no responses, just metadata)
    const assessments = await prisma.assessment.findMany({
      where: { studentId: session.id },
      select: {
        id: true,
        attemptNumber: true,
        status: true,
        createdAt: true,
        submittedAt: true,
        _count: { select: { responses: true } },
      },
      orderBy: { attemptNumber: 'desc' },
    });

    return NextResponse.json({ assessments });
  } catch (error) {
    console.error('Submissions API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
