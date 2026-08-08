import { Role, AssessmentStatus, QuestionResponseStatus } from '@prisma/client';

export interface UserSession {
  id: string;
  studentId: string;
  name: string;
  role: Role;
}

export interface QuestionData {
  id: string;
  questionNumber: number;
  promptText: string;
  category?: string | null;
  timeLimitSec: number;
}

export interface QuestionResponseData {
  id: string;
  assessmentId: string;
  questionId: string;
  questionNumber: number;
  status: QuestionResponseStatus;
  cloudinaryPublicId: string;
  cloudinaryUrl: string;
  durationSeconds: number;
  submissionTimestamp: Date;
}

export interface QuestionFeedbackData {
  id: string;
  responseId: string;
  remarks: string;
  strengths?: string | null;
  needsImprovement?: string | null;
  score?: number | null;
}

export interface OverallEvaluationData {
  id: string;
  assessmentId: string;
  adminId: string;
  fluencyScore: number;
  grammarScore: number;
  pronunciationScore: number;
  vocabularyScore: number;
  confidenceScore: number;
  overallScore?: number | null;
  overallRemarks: string;
  strengths: string;
  areasForImprovement: string;
}
