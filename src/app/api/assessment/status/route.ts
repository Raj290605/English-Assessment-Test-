import { NextResponse } from 'next/server';
import { getSession } from '@/lib/services/authService';
import { getStudentAssessmentDetails } from '@/lib/services/assessmentService';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId') || undefined;

    const data = await getStudentAssessmentDetails(session.id, assessmentId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
