import { NextResponse } from 'next/server';
import { getSession } from '@/lib/services/authService';
import { createReattemptAssessment } from '@/lib/services/assessmentService';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newAssessment = await createReattemptAssessment(session.id);
    return NextResponse.json({ assessment: newAssessment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
