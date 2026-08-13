import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/services/authService';
import { getStudentAssessmentDetails } from '@/lib/services/assessmentService';
import { StudentDashboardShell } from '@/components/student/StudentDashboardShell';
import { EvaluationSummary } from '@/components/student/EvaluationSummary';
import { FileText } from 'lucide-react';

export default async function StudentResultsPage(props: any) {
  const searchParams = await props.searchParams;
  const assessmentId = searchParams?.assessmentId;
  const session = await getSession();
  
  if (!session || session.role !== 'STUDENT') {
    redirect('/login');
  }

  let assessmentDetails: { assessment: any; assessments: any[]; questions: any[] } = {
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
        
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] mb-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">Results & Feedback</h2>
              <p className="text-[13px] text-slate-500 mt-0.5 font-medium">Review your latest evaluation metrics and detailed feedback.</p>
            </div>
          </div>
        </div>

        {assessment?.status === 'EVALUATED' && assessment.evaluation ? (
          <EvaluationSummary 
            evaluation={assessment.evaluation}
            responses={assessment.responses || []}
            questions={assessmentDetails.questions || []}
          />
        ) : (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <FileText className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No Results Available</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">Your assessment is either in progress or awaiting evaluation by an expert.</p>
          </div>
        )}

      </div>
    </StudentDashboardShell>
  );
}
