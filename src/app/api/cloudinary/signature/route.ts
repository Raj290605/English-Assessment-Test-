import { NextResponse } from 'next/server';
import { getSession } from '@/lib/services/authService';
import { generateUploadSignature } from '@/lib/services/cloudinaryService';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assessmentId, questionNumber } = await request.json();
    if (!assessmentId || !questionNumber) {
      return NextResponse.json(
        { error: 'Assessment ID and Question Number are required' },
        { status: 400 }
      );
    }

    const signedParams = generateUploadSignature(
      session.studentId,
      assessmentId,
      questionNumber
    );

    return NextResponse.json({ signedParams });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
