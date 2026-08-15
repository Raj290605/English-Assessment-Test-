import { prisma } from '../prisma';
import { AssessmentStatus, Role } from '@prisma/client';

export async function getAdminStudentList() {
  const students = await prisma.user.findMany({
    where: { role: Role.STUDENT },
    select: {
      id: true,
      studentId: true,
      name: true,
      createdAt: true,
      assessments: {
        orderBy: { attemptNumber: 'desc' },
        include: {
          responses: {
            select: { id: true, questionNumber: true },
          },
          evaluation: {
            select: { id: true, overallScore: true, updatedAt: true },
          },
        },
      },
    },
    orderBy: { studentId: 'asc' },
  });

  const list = [];
  for (const s of students) {
    if (s.assessments.length === 0) {
      list.push({
        id: s.id,
        studentId: s.studentId,
        name: s.name,
        assessmentId: null,
        attemptNumber: 1,
        status: AssessmentStatus.NOT_STARTED,
        responsesCount: 0,
        submittedAt: null,
        evaluation: null,
      });
    } else {
      for (const a of s.assessments) {
        list.push({
          id: s.id,
          studentId: s.studentId,
          name: s.name,
          assessmentId: a.id,
          attemptNumber: a.attemptNumber,
          status: a.status,
          responsesCount: a.responses.length,
          submittedAt: a.submittedAt,
          evaluation: a.evaluation,
        });
      }
    }
  }

  return list;
}

export async function getAdminStudentAssessmentDetail(studentId: string, assessmentId?: string | null) {
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      studentId: true,
      name: true,
    },
  });

  if (!student) throw new Error('Student not found');

  const assessment = await prisma.assessment.findFirst({
    where: assessmentId ? { id: assessmentId, studentId: student.id } : { studentId: student.id },
    include: {
      responses: {
        include: {
          question: true,
          feedback: true,
        },
        orderBy: { questionNumber: 'asc' },
      },
      evaluation: true,
    },
    orderBy: { attemptNumber: 'desc' },
  });

  let questions: any[] = [];
  if (assessment) {
    const assessmentQuestions = await prisma.assessmentQuestion.findMany({
      where: { assessmentId: assessment.id },
      orderBy: { questionNumber: 'asc' },
      include: { question: true }
    });

    questions = assessmentQuestions.map(aq => ({
      ...aq.question,
      questionNumber: aq.questionNumber // use the frozen order
    }));
  }

  return {
    student,
    assessment,
    questions,
  };
}

export async function saveQuestionFeedback(data: {
  responseId: string;
  remarks: string;
  strengths?: string;
  needsImprovement?: string;
  score?: number;
}) {
  return prisma.questionFeedback.upsert({
    where: { responseId: data.responseId },
    update: {
      remarks: data.remarks,
      strengths: data.strengths || null,
      needsImprovement: data.needsImprovement || null,
      score: data.score !== undefined ? data.score : null,
    },
    create: {
      responseId: data.responseId,
      remarks: data.remarks,
      strengths: data.strengths || null,
      needsImprovement: data.needsImprovement || null,
      score: data.score !== undefined ? data.score : null,
    },
  });
}

export async function saveOverallEvaluation(data: {
  assessmentId: string;
  adminId: string;
  fluencyScore: number;
  grammarScore: number;
  pronunciationScore: number;
  vocabularyScore: number;
  confidenceScore: number;
  overallRemarks: string;
  strengths: string;
  areasForImprovement: string;
}) {
  const overallScore = Math.round(
    (data.fluencyScore +
      data.grammarScore +
      data.pronunciationScore +
      data.vocabularyScore +
      data.confidenceScore) /
    5
  );

  const evaluation = await prisma.overallEvaluation.upsert({
    where: { assessmentId: data.assessmentId },
    update: {
      adminId: data.adminId,
      fluencyScore: data.fluencyScore,
      grammarScore: data.grammarScore,
      pronunciationScore: data.pronunciationScore,
      vocabularyScore: data.vocabularyScore,
      confidenceScore: data.confidenceScore,
      overallScore,
      overallRemarks: data.overallRemarks,
      strengths: data.strengths,
      areasForImprovement: data.areasForImprovement,
    },
    create: {
      assessmentId: data.assessmentId,
      adminId: data.adminId,
      fluencyScore: data.fluencyScore,
      grammarScore: data.grammarScore,
      pronunciationScore: data.pronunciationScore,
      vocabularyScore: data.vocabularyScore,
      confidenceScore: data.confidenceScore,
      overallScore,
      overallRemarks: data.overallRemarks,
      strengths: data.strengths,
      areasForImprovement: data.areasForImprovement,
    },
  });

  // Mark assessment status as EVALUATED
  await prisma.assessment.update({
    where: { id: data.assessmentId },
    data: { status: AssessmentStatus.EVALUATED },
  });

  return evaluation;
}
