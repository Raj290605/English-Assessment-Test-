import { NextResponse } from 'next/server';
import { getSession } from '@/lib/services/authService';
import { generateSignedPlaybackUrl } from '@/lib/services/cloudinaryService';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { responseId, publicId } = await request.json();
    if (!responseId && !publicId) {
      return NextResponse.json({ error: 'Response ID or Public ID required' }, { status: 400 });
    }

    let targetPublicId = publicId;

    if (responseId) {
      const responseRecord = await prisma.questionResponse.findUnique({
        where: { id: responseId },
        include: {
          assessment: {
            select: { studentId: true },
          },
        },
      });

      if (!responseRecord) {
        return NextResponse.json({ error: 'Response not found' }, { status: 404 });
      }

      // Check access permission: Must be Admin OR owning Student
      if (session.role !== 'ADMIN') {
        const student = await prisma.user.findUnique({
          where: { id: responseRecord.assessment.studentId },
        });
        if (!student || student.studentId !== session.studentId) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }

      targetPublicId = responseRecord.cloudinaryPublicId;
    }

    const signedPlaybackUrl = generateSignedPlaybackUrl(targetPublicId, 3600); // 1 hour expiration

    return NextResponse.json({ streamUrl: signedPlaybackUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
