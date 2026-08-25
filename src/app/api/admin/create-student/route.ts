import { NextResponse } from 'next/server';
import { getSession, hashPassword } from '@/lib/services/authService';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, studentId, password, questionSetId } = body;

    const cleanName = name ? name.trim() : '';
    const cleanStudentId = studentId ? studentId.trim() : '';
    const cleanPassword = password ? password.trim() : '';
    const cleanQuestionSetId = questionSetId ? questionSetId.trim() : '';

    if (!cleanName || !cleanStudentId || !cleanPassword || !cleanQuestionSetId) {
      return NextResponse.json(
        { error: 'Student Name, Login ID, Password, and Question Set are all required.' },
        { status: 400 }
      );
    }

    if (cleanPassword.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters long.' },
        { status: 400 }
      );
    }

    // Check if studentId already exists (case-insensitive check)
    const existingUsers = await prisma.user.findMany({
      select: { studentId: true },
    });

    const isDuplicate = existingUsers.some(
      (u) => u.studentId.toLowerCase() === cleanStudentId.toLowerCase()
    );

    if (isDuplicate) {
      return NextResponse.json(
        { error: `Student ID "${cleanStudentId}" already exists. Please use a unique ID.` },
        { status: 400 }
      );
    }

    // Verify Question Set exists
    const questionSetExists = await prisma.questionSet.findUnique({
      where: { id: cleanQuestionSetId }
    });

    if (!questionSetExists) {
      return NextResponse.json({ error: 'Selected Question Set not found.' }, { status: 400 });
    }

    // Hash the password using bcrypt
    const hashedPassword = await hashPassword(cleanPassword);

    // Create the new student user
    const newStudent = await prisma.user.create({
      data: {
        name: cleanName,
        studentId: cleanStudentId,
        passwordHash: hashedPassword,
        questionSetId: cleanQuestionSetId,
        role: Role.STUDENT,
      },
      select: {
        id: true,
        studentId: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Student created successfully.',
        student: newStudent,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create student.' },
      { status: 500 }
    );
  }
}
