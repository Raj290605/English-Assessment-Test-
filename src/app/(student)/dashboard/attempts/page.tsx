import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/services/authService';
import { getStudentAssessmentDetails } from '@/lib/services/assessmentService';
import { StudentDashboardShell } from '@/components/student/StudentDashboardShell';
import { PreviousAttemptsCard } from '@/components/student/PreviousAttemptsCard';
import { Clock } from 'lucide-react';

export default async function StudentAttemptsPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'STUDENT') {
    redirect('/login');
  }

  let assessmentDetails = {
    assessment: null,
    assessments: [],
    questions: [],
  };

  try {
    assessmentDetails = await getStudentAssessmentDetails(session.id);
  } catch (err) {
    console.error('Failed to load history:', err);
  }

  const { assessments, assessment } = assessmentDetails;

  return (
    <StudentDashboardShell user={session}>
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] mb-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">Previous Attempts</h2>
              <p className="text-[13px] text-slate-500 mt-0.5 font-medium">Review your past interview assessments and status.</p>
            </div>
          </div>
        </div>

        <PreviousAttemptsCard 
          assessments={assessments}
          currentAssessmentId={assessment?.id}
          isFullPage={true}
        />

      </div>
    </StudentDashboardShell>
  );
}
