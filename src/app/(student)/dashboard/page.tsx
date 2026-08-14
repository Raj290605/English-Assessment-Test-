import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/services/authService';
import { getStudentAssessmentDetails } from '@/lib/services/assessmentService';
import { StudentDashboardShell } from '@/components/student/StudentDashboardShell';
import { AssessmentHero } from '@/components/student/AssessmentHero';
import { DashboardStatCards } from '@/components/student/DashboardStatCards';
import { AssessmentJourney } from '@/components/student/AssessmentJourney';
import { RecentActivity } from '@/components/student/RecentActivity';
import { QuickActions } from '@/components/student/QuickActions';

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
  const latestScore = assessment?.evaluation?.overallScore ?? null;

  return (
    <StudentDashboardShell user={session}>
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6 pb-12">
        
        {/* PRIMARY HERO CARD */}
        <AssessmentHero
          status={status}
          answeredCount={answeredCount}
          totalQuestions={totalQuestions}
          assessmentId={assessment?.id}
        />

        {/* 4 STAT CARDS */}
        <DashboardStatCards
          status={status}
          answeredCount={answeredCount}
          totalQuestions={totalQuestions}
          attemptsCount={attemptsCount}
          latestScore={latestScore}
        />

        {/* TWO COLUMN LAYOUT: JOURNEY & RECENT ACTIVITY */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
          <AssessmentJourney status={status} assessment={assessment} />
          <RecentActivity assessments={assessments} />
        </div>

        {/* QUICK ACTIONS */}
        <QuickActions />

      </div>
    </StudentDashboardShell>
  );
}
