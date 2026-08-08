import { NextResponse } from 'next/server';
import { getSession } from '@/lib/services/authService';
import { saveOverallEvaluation } from '@/lib/services/feedbackService';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const evaluation = await saveOverallEvaluation({
      assessmentId: body.assessmentId,
      adminId: session.id,
      fluencyScore: Number(body.fluencyScore || 0),
      grammarScore: Number(body.grammarScore || 0),
      pronunciationScore: Number(body.pronunciationScore || 0),
      vocabularyScore: Number(body.vocabularyScore || 0),
      confidenceScore: Number(body.confidenceScore || 0),
      overallRemarks: body.overallRemarks || '',
      strengths: body.strengths || '',
      areasForImprovement: body.areasForImprovement || '',
    });

    return NextResponse.json({ evaluation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
