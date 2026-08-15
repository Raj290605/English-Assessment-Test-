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
    const { name, adminId, password } = body;

    const cleanName = name ? name.trim() : '';
    const cleanAdminId = adminId ? adminId.trim() : '';
    const cleanPassword = password ? password.trim() : '';

    if (!cleanName || !cleanAdminId || !cleanPassword) {
      return NextResponse.json(
        { error: 'Admin Name, Admin ID, and Password are all required.' },
        { status: 400 }
      );
    }

    if (cleanPassword.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters long.' },
        { status: 400 }
      );
    }

    // Check if adminId/studentId already exists (case-insensitive check)
    // We check all users because studentId is uniquely constrained in Prisma schema
    const existingUsers = await prisma.user.findMany({
      select: { studentId: true },
    });

    const isDuplicate = existingUsers.some(
      (u) => u.studentId.toLowerCase() === cleanAdminId.toLowerCase()
    );

    if (isDuplicate) {
      return NextResponse.json(
        { error: `ID "${cleanAdminId}" is already taken. Please use a unique Admin ID.` },
        { status: 400 }
      );
    }

    // Hash the password using bcrypt
    const hashedPassword = await hashPassword(cleanPassword);

    // Create the new admin user
    // Note: We map adminId to studentId field because the auth system uses studentId for all logins
    const newAdmin = await prisma.user.create({
      data: {
        name: cleanName,
        studentId: cleanAdminId, 
        passwordHash: hashedPassword,
        role: Role.ADMIN,
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
        message: 'Admin created successfully.',
        admin: newAdmin,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create admin.' },
      { status: 500 }
    );
  }
}
