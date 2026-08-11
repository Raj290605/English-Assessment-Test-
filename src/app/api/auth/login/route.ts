import { NextResponse } from 'next/server';
import { verifyUserCredentials, createSession } from '@/lib/services/authService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, password } = body;

    if (!studentId || !password) {
      return NextResponse.json(
        { error: 'Student ID and password are required' },
        { status: 400 }
      );
    }

    const user = await verifyUserCredentials(studentId, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid Student ID or password' },
        { status: 401 }
      );
    }

    await createSession(user);

    return NextResponse.json({
      user: {
        id: user.id,
        studentId: user.studentId,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
