import { NextResponse } from 'next/server';
import { getSession } from '@/lib/services/authService';
import { submitAssessment } from '@/lib/services/assessmentService';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assessmentId } = await request.json();
    const updated = await submitAssessment(assessmentId, session.id);
    return NextResponse.json({ success: true, assessment: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
