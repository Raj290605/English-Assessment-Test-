import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/services/authService';
import { getStudentAssessmentDetails } from '@/lib/services/assessmentService';
import { StudentDashboardShell } from '@/components/student/StudentDashboardShell';
import { EvaluationSummary } from '@/components/student/EvaluationSummary';
import { FileText, Clock } from 'lucide-react';

export default async function StudentResultsPage(props: any) {
  const searchParams = await props.searchParams;
  const assessmentId = searchParams?.assessmentId;
  const session = await getSession();

  if (!session || session.role !== 'STUDENT') {
    redirect('/login');
  }

  let assessmentDetails: Awaited<ReturnType<typeof getStudentAssessmentDetails>> = {
    assessment: null,
    assessments: [],
    questions: [],
  };

  try {
    assessmentDetails = await getStudentAssessmentDetails(session.id, assessmentId);
  } catch (err) {
    console.error('Failed to load assessment details:', err);
  }

  const { assessment } = assessmentDetails;

  return (
    <StudentDashboardShell user={session}>
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">

        {/* Page header */}
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">Results & Feedback</h2>
            <p className="text-[13px] text-slate-500 mt-0.5 font-medium">
              Your evaluation scores and expert feedback.
            </p>
          </div>
        </div>

        {assessment?.status === 'EVALUATED' && assessment.evaluation ? (
          <EvaluationSummary
            evaluation={assessment.evaluation}
            responses={assessment.responses || []}
            questions={assessmentDetails.questions || []}
          />
        ) : assessment?.status === 'SUBMITTED' ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <Clock className="w-12 h-12 text-amber-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Evaluation Pending</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              Your assessment has been submitted and is awaiting expert evaluation. Check back soon.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <FileText className="w-12 h-12 text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No Results Available</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              Complete and submit your assessment to receive evaluation and feedback.
            </p>
          </div>
        )}

      </div>
    </StudentDashboardShell>
  );
}
