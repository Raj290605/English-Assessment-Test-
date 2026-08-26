import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/services/authService';
import bcrypt from 'bcryptjs';
import { encryptPassword } from '@/lib/services/cryptoService';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        studentId: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        encryptedPassword: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // We shouldn't send encryptedPassword directly to the client
    // We'll map it to a boolean to indicate if it's available
    const mappedUsers = users.map(u => ({
      id: u.id,
      studentId: u.studentId,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      hasEncryptedPassword: u.encryptedPassword !== null,
    }));

    const students = mappedUsers.filter((u: any) => u.role === 'STUDENT');
    const admins = mappedUsers.filter((u: any) => u.role === 'ADMIN');

    return NextResponse.json({ students, admins });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { studentId, name, password } = body;

    if (!studentId || !name || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { studentId },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Admin ID / Username already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const encryptedPwd = encryptPassword(password);

    const newAdmin = await prisma.user.create({
      data: {
        studentId,
        name,
        passwordHash,
        encryptedPassword: encryptedPwd,
        role: Role.ADMIN,
      },
      select: {
        id: true,
        studentId: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json(newAdmin, { status: 201 });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, newPassword } = body;

    if (!id || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 12);
    const encryptedPwd = encryptPassword(newPassword);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { 
        passwordHash,
        encryptedPassword: encryptedPwd 
      },
      select: {
        id: true,
        studentId: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
