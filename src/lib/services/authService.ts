import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from '../prisma';
import { UserSession } from '../types';
import { Role } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'english-assessment-platform-super-secret-key-2026'
);

const COOKIE_NAME = 'assessment_token';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: UserSession): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    studentId: user.studentId,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      studentId: payload.studentId as string,
      name: payload.name as string,
      role: payload.role as Role,
    };
  } catch (err) {
    return null;
  }
}

export async function removeSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function verifyUserCredentials(studentId: string, password: string): Promise<UserSession | null> {
  const cleanId = studentId ? studentId.trim() : '';
  if (!cleanId || !password) return null;

  let user = await prisma.user.findUnique({
    where: { studentId: cleanId },
    select: {
      id: true,
      studentId: true,
      name: true,
      role: true,
      passwordHash: true,
    },
  });

  if (!user) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        studentId: true,
        name: true,
        role: true,
        passwordHash: true,
      },
    });
    user = users.find((u) => u.studentId.toLowerCase() === cleanId.toLowerCase()) || null;
  }

  if (!user) return null;

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) return null;

  return {
    id: user.id,
    studentId: user.studentId,
    name: user.name,
    role: user.role,
  };
}
