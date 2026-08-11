import { prisma } from '../prisma';
import { AssessmentStatus, QuestionResponseStatus } from '@prisma/client';

export async function getOrCreateAssessment(studentId: string) {
  let assessment = await prisma.assessment.findFirst({
    where: { studentId },
    include: {
      responses: true,
      student: {
        select: { id: true, studentId: true, name: true },
      },
    },
    orderBy: { attemptNumber: 'desc' },
  });

  if (!assessment) {
    try {
      assessment = await prisma.assessment.create({
        data: {
          studentId,
          status: AssessmentStatus.NOT_STARTED,
          attemptNumber: 1,
        },
        include: {
          responses: true,
          student: {
            select: { id: true, studentId: true, name: true },
          },
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        assessment = await prisma.assessment.findFirst({
          where: { studentId },
          include: {
            responses: true,
            student: {
              select: { id: true, studentId: true, name: true },
            },
          },
          orderBy: { attemptNumber: 'desc' },
        });
        if (!assessment) throw error;
      } else {
        throw error;
      }
    }
  }

  return assessment;
}

export async function createReattemptAssessment(studentId: string) {
  const latest = await prisma.assessment.findFirst({
    where: { studentId },
    orderBy: { attemptNumber: 'desc' },
  });

  if (!latest) throw new Error('No existing assessment to reattempt');
  if (latest.status === AssessmentStatus.NOT_STARTED || latest.status === AssessmentStatus.IN_PROGRESS) {
    throw new Error('Complete your current assessment before starting a new one.');
  }

  const newAttempt = await prisma.assessment.create({
    data: {
      studentId,
      attemptNumber: latest.attemptNumber + 1,
      status: AssessmentStatus.NOT_STARTED,
    },
  });
  return newAttempt;
}

export async function startAssessment(assessmentId: string, studentId: string) {
  const assessment = await prisma.assessment.findFirst({
    where: { id: assessmentId, studentId },
  });

  if (!assessment) throw new Error('Assessment not found');

  if (assessment.status === AssessmentStatus.NOT_STARTED) {
    return prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        status: AssessmentStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
    });
  }

  return assessment;
}

export async function getAllQuestions() {
  return prisma.question.findMany({
    orderBy: { questionNumber: 'asc' },
  });
}

export async function saveQuestionResponse(data: {
  assessmentId: string;
  studentId: string;
  questionId: string;
  questionNumber: number;
  cloudinaryPublicId: string;
  cloudinaryUrl: string;
  durationSeconds: number;
}) {
  // Ensure student owns the assessment
  const assessment = await prisma.assessment.findFirst({
    where: { id: data.assessmentId, studentId: data.studentId },
  });

  if (!assessment) throw new Error('Unauthorized assessment access');
  if (assessment.status === AssessmentStatus.SUBMITTED || assessment.status === AssessmentStatus.EVALUATED) {
    throw new Error('Assessment has already been submitted');
  }

  // Update status to IN_PROGRESS if NOT_STARTED
  if (assessment.status === AssessmentStatus.NOT_STARTED) {
    await prisma.assessment.update({
      where: { id: data.assessmentId },
      data: { status: AssessmentStatus.IN_PROGRESS },
    });
  }

  // Upsert response
  const response = await prisma.questionResponse.upsert({
    where: {
      assessmentId_questionId: {
        assessmentId: data.assessmentId,
        questionId: data.questionId,
      },
    },
    update: {
      cloudinaryPublicId: data.cloudinaryPublicId,
      cloudinaryUrl: data.cloudinaryUrl,
      durationSeconds: data.durationSeconds,
      status: QuestionResponseStatus.UPLOADED,
      submissionTimestamp: new Date(),
    },
    create: {
      assessmentId: data.assessmentId,
      questionId: data.questionId,
      questionNumber: data.questionNumber,
      cloudinaryPublicId: data.cloudinaryPublicId,
      cloudinaryUrl: data.cloudinaryUrl,
      durationSeconds: data.durationSeconds,
      status: QuestionResponseStatus.UPLOADED,
    },
  });

  return response;
}

export async function submitAssessment(assessmentId: string, studentId: string) {
  const assessment = await prisma.assessment.findFirst({
    where: { id: assessmentId, studentId },
    include: { responses: true },
  });

  if (!assessment) throw new Error('Assessment not found');

  // Verify all 20 responses are uploaded
  const responseCount = assessment.responses.length;
  if (responseCount < 20) {
    throw new Error(`Cannot submit assessment: Only ${responseCount} of 20 questions have been answered.`);
  }

  return prisma.assessment.update({
    where: { id: assessmentId },
    data: {
      status: AssessmentStatus.SUBMITTED,
      submittedAt: new Date(),
    },
  });
}

export async function getStudentAssessmentDetails(studentId: string, assessmentId?: string) {
  const historyPromise = prisma.assessment.findMany({
    where: { studentId },
    select: {
      id: true,
      studentId: true,
      attemptNumber: true,
      status: true,
      createdAt: true,
      submittedAt: true,
    },
    orderBy: { attemptNumber: 'desc' },
  });

  const questionsPromise = getAllQuestions();

  let [assessments, questions] = await Promise.all([
    historyPromise,
    questionsPromise,
  ]);

  let targetAssessment = null;

  if (assessmentId) {
    targetAssessment = await prisma.assessment.findFirst({
      where: { id: assessmentId, studentId },
      include: {
        responses: {
          include: { feedback: true }
        },
        evaluation: true,
        student: { select: { id: true, studentId: true, name: true } },
      }
    });
  }

  if (!targetAssessment) {
    if (assessments.length === 0) {
      try {
        targetAssessment = await prisma.assessment.create({
          data: {
            studentId,
            status: AssessmentStatus.NOT_STARTED,
            attemptNumber: 1,
          },
          include: {
            responses: { include: { feedback: true } },
            evaluation: true,
            student: { select: { id: true, studentId: true, name: true } },
          },
        });
        
        assessments = [{
          id: targetAssessment.id,
          studentId: targetAssessment.studentId,
          attemptNumber: targetAssessment.attemptNumber,
          status: targetAssessment.status,
          createdAt: targetAssessment.createdAt,
          submittedAt: targetAssessment.submittedAt,
        } as any, ...assessments];
      } catch (error: any) {
        if (error.code === 'P2002') {
          targetAssessment = await prisma.assessment.findFirst({
            where: { studentId },
            include: {
              responses: { include: { feedback: true } },
              evaluation: true,
              student: { select: { id: true, studentId: true, name: true } },
            },
            orderBy: { attemptNumber: 'desc' },
          });
          if (!targetAssessment) throw error;
        } else {
          throw error;
        }
      }
    } else {
      const latestId = assessments[0].id;
      targetAssessment = await prisma.assessment.findUnique({
        where: { id: latestId },
        include: {
          responses: { include: { feedback: true } },
          evaluation: true,
          student: { select: { id: true, studentId: true, name: true } },
        }
      });
    }
  }

  return {
    assessment: targetAssessment,
    assessments,
    questions,
  };
}
