'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Mic, Info } from 'lucide-react';
import { ReattemptButton } from './ReattemptButton';

interface AssessmentHeroProps {
  status: string;
  answeredCount: number;
  totalQuestions: number;
  assessmentId?: string | null;
}

export function AssessmentHero({ status, answeredCount, totalQuestions, assessmentId }: AssessmentHeroProps) {
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const remaining = totalQuestions - answeredCount;

  const config = {
    NOT_STARTED: {
      badge: 'READY',
      badgeBg: 'bg-blue-100 text-blue-700',
      title: 'Start your assessment',
      subtitle: `Complete all ${totalQuestions > 0 ? totalQuestions + ' ' : ''}questions.`,
      action: (
        <Link href="/assessment" className="inline-flex items-center gap-2 h-11 px-6 bg-[#0A1930] hover:bg-[#112240] text-white font-medium text-sm rounded-lg transition-colors">
          Start Assessment <ArrowRight className="w-4 h-4" />
        </Link>
      ),
    },
    IN_PROGRESS: {
      badge: 'IN PROGRESS',
      badgeBg: 'bg-blue-100 text-blue-700',
      title: 'Continue your assessment',
      subtitle: 'You have unfinished responses.\nPick up where you left off.',
      action: (
        <Link href="/assessment" className="inline-flex items-center gap-2 h-11 px-6 bg-[#0A1930] hover:bg-[#112240] text-white font-medium text-sm rounded-lg transition-colors">
          Continue Assessment <ArrowRight className="w-4 h-4" />
        </Link>
      ),
    },
    SUBMITTED: {
      badge: 'UNDER EVALUATION',
      badgeBg: 'bg-blue-100 text-blue-700',
      title: 'Assessment under evaluation',
      subtitle: 'Your responses have been successfully submitted.',
      action: assessmentId ? (
        <Link href={`/dashboard/my-assessments?assessmentId=${assessmentId}`} className="inline-flex items-center gap-2 h-11 px-6 bg-[#0A1930] hover:bg-[#112240] text-white font-medium text-sm rounded-lg transition-colors">
          View My Submission <ArrowRight className="w-4 h-4" />
        </Link>
      ) : null,
    },
    EVALUATED: {
      badge: 'EVALUATED',
      badgeBg: 'bg-blue-100 text-blue-700',
      title: 'Assessment evaluated',
      subtitle: 'Your latest assessment results are ready to be viewed.',
      action: (
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <Link href="/dashboard/results" className="inline-flex items-center gap-2 h-11 px-6 bg-[#0A1930] hover:bg-[#112240] text-white font-medium text-sm rounded-lg transition-colors">
            View Results & Feedback <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="h-11 px-6 bg-white border border-slate-300 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-center">
            <ReattemptButton compact />
          </div>
        </div>
      ),
    },
  } as Record<string, any>;

  const c = config[status] ?? config['NOT_STARTED'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden">
      {/* Left Area - Call to Action */}
      <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Mic className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <span className={`inline-block text-[10px] font-bold tracking-widest px-2.5 py-1 rounded mb-3 ${c.badgeBg}`}>
              {c.badge}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">
              {c.title}
            </h2>
            <p className="text-[15px] text-slate-500 mb-6 whitespace-pre-wrap leading-relaxed">
              {c.subtitle}
            </p>
            {c.action}
          </div>
        </div>
      </div>

      {/* Right Area - Progress Divider */}
      <div className="md:w-[400px] border-t md:border-t-0 md:border-l border-slate-200 p-8 md:p-10 flex flex-col justify-center bg-slate-50/30">
        <div className="text-sm text-slate-500 font-medium mb-2">Assessment progress</div>
        
        <div className="text-5xl font-extrabold text-blue-600 tracking-tight mb-4">
          {progressPercent}%
        </div>
        
        {totalQuestions > 0 && (
          <>
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-700" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
            
            <div className="flex items-center justify-between text-[13px] text-slate-500 mb-8">
              <span>{answeredCount} completed</span>
              <span>{remaining} remaining</span>
            </div>
          </>
        )}
        
        <button className="flex items-center gap-2 text-[13px] text-blue-600 font-medium hover:text-blue-800 transition-colors mt-auto">
          <Info className="w-4 h-4" /> How it works
        </button>
      </div>
    </div>
  );
}
