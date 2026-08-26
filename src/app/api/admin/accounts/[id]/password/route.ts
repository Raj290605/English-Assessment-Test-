import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/services/authService';
import { decryptPassword } from '@/lib/services/cryptoService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify admin session
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    // Next.js 16 expects params to be unwrapped
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return new NextResponse(JSON.stringify({ error: 'Missing account ID' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    // 2. Fetch the user
    const user = await prisma.user.findUnique({
      where: { id },
      select: { encryptedPassword: true },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Account not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    // 3. Handle legacy accounts
    if (!user.encryptedPassword) {
      return new NextResponse(JSON.stringify({ error: 'Password not available' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    // 4. Decrypt password
    const plaintext = decryptPassword(user.encryptedPassword);

    // 5. Return plaintext password exclusively to admin
    return new NextResponse(JSON.stringify({ password: plaintext }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error revealing password:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to reveal password' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
}
