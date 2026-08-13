import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/services/authService';
import { getStudentAssessmentDetails } from '@/lib/services/assessmentService';

import { StudentDashboardShell } from '@/components/student/StudentDashboardShell';
import { AssessmentOverviewCard } from '@/components/student/AssessmentOverviewCard';
import { AssessmentProgressCard } from '@/components/student/AssessmentProgressCard';
import { DashboardStats } from '@/components/student/DashboardStats';
import { TipsAssessmentCard } from '@/components/student/TipsAssessmentCard';
import { PreviousAttemptsCard } from '@/components/student/PreviousAttemptsCard';
import { DashboardMotivationBanner } from '@/components/student/DashboardMotivationBanner';

export default async function StudentDashboardPage(props: any) {
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

  const { assessment, assessments, questions } = assessmentDetails;
  
  const totalQuestions = questions?.length || 0;
  const answeredCount = assessment?.responses?.length || 0;
  const status = assessment?.status || 'NOT_STARTED';
  const attemptsCount = assessments?.length || 0;

  return (
    <StudentDashboardShell user={session}>
      <div className="w-full flex flex-col gap-6">
        
        {/* TOP ROW: Overview & Progress */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7">
            <AssessmentOverviewCard status={status} />
          </div>
          <div className="xl:col-span-5">
            <AssessmentProgressCard 
              status={status} 
              answeredCount={answeredCount} 
              totalQuestions={totalQuestions} 
            />
          </div>
        </div>

        {/* STATS ROW */}
        <DashboardStats 
          status={status}
          answeredCount={answeredCount}
          totalQuestions={totalQuestions}
          attemptsCount={attemptsCount}
        />

        {/* TIPS & PREVIOUS ATTEMPTS ROW */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7">
            <TipsAssessmentCard />
          </div>
          <div className="xl:col-span-5" id="attempts">
            <PreviousAttemptsCard 
              assessments={assessments}
              currentAssessmentId={assessment?.id}
            />
          </div>
        </div>

        {/* BOTTOM MOTIVATION BANNER */}
        <DashboardMotivationBanner />

      </div>
    </StudentDashboardShell>
  );
}
