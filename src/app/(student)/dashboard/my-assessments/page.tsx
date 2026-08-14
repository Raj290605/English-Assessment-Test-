import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/services/authService';
import { prisma } from '@/lib/prisma';
import { StudentDashboardShell } from '@/components/student/StudentDashboardShell';
import { SubmissionViewer } from '@/components/student/SubmissionViewer';
import { SubmissionList } from '@/components/student/SubmissionList';
import { FileVideo } from 'lucide-react';

export default async function MyAssessmentsPage(props: any) {
  const searchParams = await props.searchParams;
  const assessmentId = searchParams?.assessmentId;
  const session = await getSession();

  if (!session || session.role !== 'STUDENT') {
    redirect('/login');
  }

  // Load all assessments for this student
  const assessments = await prisma.assessment.findMany({
    where: { studentId: session.id },
    select: {
      id: true,
      attemptNumber: true,
      status: true,
      createdAt: true,
      submittedAt: true,
      _count: { select: { responses: true } },
    },
    orderBy: { attemptNumber: 'desc' },
  });

  // Only show submitted/evaluated assessments
  const submittedAssessments = assessments.filter(
    (a) => a.status === 'SUBMITTED' || a.status === 'EVALUATED'
  );

  // If a specific assessmentId is provided, load full responses + questions
  let selectedAssessment: any = null;
  let questions: any[] = [];

  if (assessmentId) {
    selectedAssessment = await prisma.assessment.findFirst({
      where: { id: assessmentId, studentId: session.id },
      include: {
        responses: {
          orderBy: { questionNumber: 'asc' },
        },
      },
    });

    if (selectedAssessment) {
      questions = await prisma.question.findMany({
        orderBy: { questionNumber: 'asc' },
      });
    }
  }

  return (
    <StudentDashboardShell user={session}>
      <div className="w-full flex flex-col gap-6">

        {/* Page header */}
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <FileVideo className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">My Submitted Assessments</h2>
            <p className="text-[13px] text-slate-500 mt-0.5">View your submitted assessment videos and responses.</p>
          </div>
        </div>

        {selectedAssessment ? (
          /* Submission Viewer Mode */
          <SubmissionViewer
            assessment={selectedAssessment}
            questions={questions}
            allAssessments={submittedAssessments}
          />
        ) : (
          /* List Mode */
          <SubmissionList assessments={submittedAssessments} />
        )}
      </div>
    </StudentDashboardShell>
  );
}
