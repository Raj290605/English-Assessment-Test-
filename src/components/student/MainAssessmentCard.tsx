import React from 'react';
import Link from 'next/link';
import { ReattemptButton } from './ReattemptButton';

interface MainAssessmentCardProps {
  status: string;
  answeredCount: number;
  totalQuestions: number;
}

export function MainAssessmentCard({ status, answeredCount, totalQuestions }: MainAssessmentCardProps) {
  const isSubmitted = status === 'SUBMITTED' || status === 'EVALUATED';
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const renderContent = () => {
    switch (status) {
      case 'NOT_STARTED':
        return {
          title: 'Start Assessment',
          desc: "Begin when you're ready to start.",
          actionText: 'Start Assessment'
        };
      case 'IN_PROGRESS':
        return {
          title: 'Continue your assessment',
          desc: 'Pick up where you left off.',
          actionText: 'Continue Assessment'
        };
      case 'SUBMITTED':
        return {
          title: 'Assessment submitted',
          desc: 'Your responses have been securely submitted for evaluation.',
          actionText: null
        };
      case 'EVALUATED':
        return {
          title: 'Assessment evaluated',
          desc: 'Your evaluation is ready to review in the section below.',
          actionText: 'Start New Attempt'
        };
      default:
        return {
          title: 'Assessment',
          desc: 'Continue your assessment',
          actionText: 'Continue Assessment'
        };
    }
  };

  const content = renderContent();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-md p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      
      <div className="flex-1 space-y-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assessment</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{content.title}</h2>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-md">{content.desc}</p>
        
        {!isSubmitted && (
          <div className="pt-2 max-w-sm flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {Math.round(progressPercent)}%
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 w-full md:w-auto">
        {status === 'NOT_STARTED' || status === 'IN_PROGRESS' ? (
          <Link
            href="/assessment"
            className="block w-full md:w-auto py-2.5 px-6 bg-white dark:bg-slate-900 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold text-[13px] rounded-md text-center transition-colors shadow-sm"
          >
            {content.actionText}
          </Link>
        ) : (
          status === 'EVALUATED' && (
            <div className="w-full md:w-auto">
              {/* Note: ReattemptButton should ideally match this styling. 
                  Since we can't change it without ensuring functionality is kept exactly, 
                  we wrapper it closely. If ReattemptButton internally has its own heavy styles, 
                  we rely on its functional implementation. */}
              <div className="[&>button]:w-full [&>button]:py-2.5 [&>button]:px-6 [&>button]:bg-white [&>button]:dark:bg-slate-900 [&>button]:border [&>button]:border-blue-600 [&>button]:text-blue-600 [&>button]:font-semibold [&>button]:text-[13px] [&>button]:rounded-md [&>button]:shadow-sm [&>button]:hover:bg-blue-50">
                <ReattemptButton />
              </div>
            </div>
          )
        )}
      </div>

    </div>
  );
}
