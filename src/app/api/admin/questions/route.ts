import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/services/authService';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const setId = searchParams.get('setId');

    if (!setId) {
      return NextResponse.json({ error: 'Question Set ID is required' }, { status: 400 });
    }

    const questions = await prisma.question.findMany({
      where: { questionSetId: setId },
      orderBy: { questionNumber: 'asc' },
    });
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, promptText } = body;

    if (!id) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    if (!promptText) {
      return NextResponse.json({ error: 'Prompt text is required' }, { status: 400 });
    }

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        promptText,
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { promptText, questionSetId } = body;

    if (!promptText || !promptText.trim()) {
      return NextResponse.json({ error: 'Prompt text is required' }, { status: 400 });
    }

    if (!questionSetId) {
      return NextResponse.json({ error: 'Question Set ID is required' }, { status: 400 });
    }

    // Verify set exists
    const questionSetExists = await prisma.questionSet.findUnique({
      where: { id: questionSetId }
    });

    if (!questionSetExists) {
      return NextResponse.json({ error: 'Question Set not found' }, { status: 404 });
    }

    // Get next question number atomically
    const newQuestion = await prisma.$transaction(async (tx) => {
      const maxQuestion = await tx.question.findFirst({
        where: { questionSetId },
        orderBy: { questionNumber: 'desc' },
      });

      const nextNumber = maxQuestion ? maxQuestion.questionNumber + 1 : 1;

      return tx.question.create({
        data: {
          promptText: promptText.trim(),
          questionSetId,
          questionNumber: nextNumber,
          timeLimitSec: 120, // default time limit
          isActive: true
        }
      });
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
