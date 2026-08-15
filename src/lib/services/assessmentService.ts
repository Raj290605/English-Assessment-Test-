import { prisma } from '../prisma';
import { AssessmentStatus, QuestionResponseStatus } from '@prisma/client';

export async function freezeQuestionsForAssessment(assessmentId: string) {
  // Fetch currently active questions
  const activeQuestions = await prisma.question.findMany({
    where: { isActive: true },
    orderBy: { questionNumber: 'asc' },
  });

  if (activeQuestions.length === 0) return;

  const data = activeQuestions.map((q, index) => ({
    assessmentId,
    questionId: q.id,
    questionNumber: index + 1 // Guarantee continuous 1 to N sequence for the specific assessment
  }));

  // Create frozen snapshots
  await prisma.assessmentQuestion.createMany({
    data,
    skipDuplicates: true
  });
}

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
      await freezeQuestionsForAssessment(assessment.id);
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
  
  await freezeQuestionsForAssessment(newAttempt.id);
  
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
  // Global active questions used ONLY by new assessments or Admin APIs
  return prisma.question.findMany({
    where: { isActive: true },
    orderBy: { questionNumber: 'asc' },
  });
}

export async function getAssessmentQuestions(assessmentId: string) {
  // Fetch frozen question mapping for this specific assessment
  const aqs = await prisma.assessmentQuestion.findMany({
    where: { assessmentId },
    orderBy: { questionNumber: 'asc' },
    include: { question: true }
  });
  
  // Transform back into the expected Question shape for the frontend
  return aqs.map(aq => ({
    ...aq.question,
    questionNumber: aq.questionNumber // Use the frozen sequence number
  }));
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

  // Fetch the current question text to snapshot it
  const question = await prisma.question.findUnique({
    where: { id: data.questionId }
  });

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
      promptSnapshot: question?.promptText,
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
      promptSnapshot: question?.promptText,
    },
  });

  return response;
}

export async function submitAssessment(assessmentId: string, studentId: string) {
  const assessment = await prisma.assessment.findFirst({
    where: { id: assessmentId, studentId },
    include: { responses: true, questions: true },
  });

  if (!assessment) throw new Error('Assessment not found');

  // Verify all frozen questions are uploaded
  const requiredQuestionsCount = assessment.questions.length;
  const responseCount = assessment.responses.length;
  
  if (responseCount < requiredQuestionsCount) {
    throw new Error(`Cannot submit assessment: Only ${responseCount} of ${requiredQuestionsCount} questions have been answered.`);
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

  let assessments = await historyPromise;
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
        
        await freezeQuestionsForAssessment(targetAssessment.id);
        
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
  
  // Ensure we fetch the frozen questions for this specific assessment
  const questions = await getAssessmentQuestions(targetAssessment!.id);

  return {
    assessment: targetAssessment,
    assessments,
    questions,
  };
}
