import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const latestResponse = await prisma.questionResponse.findFirst({
      orderBy: { submissionTimestamp: 'desc' },
      where: {
        feedback: {
          isNot: null
        }
      },
      include: {
        assessment: {
          select: {
            id: true,
            studentId: true,
            student: { select: { id: true, studentId: true, name: true } },
          }
        },
        question: true,
      }
    });

    return NextResponse.json({ latestResponse });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
