import { NextResponse } from 'next/server';
import { getSession } from '@/lib/services/authService';
import { getAdminStudentList } from '@/lib/services/feedbackService';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const students = await getAdminStudentList();
    return NextResponse.json({ students });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
