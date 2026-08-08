import { NextResponse } from 'next/server';
import { getSession } from '@/lib/services/authService';
import { saveQuestionResponse } from '@/lib/services/assessmentService';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const response = await saveQuestionResponse({
      assessmentId: body.assessmentId,
      studentId: session.id,
      questionId: body.questionId,
      questionNumber: body.questionNumber,
      cloudinaryPublicId: body.cloudinaryPublicId,
      cloudinaryUrl: body.cloudinaryUrl,
      durationSeconds: body.durationSeconds || 0,
    });

    return NextResponse.json({ response });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
