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
        orderBy: { createdAt: 'desc' },
        take: 1,
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

  return students.map((s) => {
    const latestAssessment = s.assessments[0] || null;
    return {
      id: s.id,
      studentId: s.studentId,
      name: s.name,
      assessmentId: latestAssessment?.id || null,
      status: latestAssessment?.status || AssessmentStatus.NOT_STARTED,
      responsesCount: latestAssessment?.responses.length || 0,
      submittedAt: latestAssessment?.submittedAt || null,
      evaluation: latestAssessment?.evaluation || null,
    };
  });
}

export async function getAdminStudentAssessmentDetail(studentId: string) {
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
    where: { studentId: student.id },
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
    orderBy: { createdAt: 'desc' },
  });

  const questions = await prisma.question.findMany({
    orderBy: { questionNumber: 'asc' },
  });

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
  const overallScore = Number(
    (
      (data.fluencyScore +
        data.grammarScore +
        data.pronunciationScore +
        data.vocabularyScore +
        data.confidenceScore) /
      5
    ).toFixed(1)
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
