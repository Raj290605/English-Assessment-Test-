import { NextResponse } from 'next/server';
import { getSession } from '@/lib/services/authService';
import { saveQuestionFeedback } from '@/lib/services/feedbackService';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const feedback = await saveQuestionFeedback({
      responseId: body.responseId,
      remarks: body.remarks,
      strengths: body.strengths,
      needsImprovement: body.needsImprovement,
      score: body.score !== undefined ? Number(body.score) : undefined,
    });

    return NextResponse.json({ feedback });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
