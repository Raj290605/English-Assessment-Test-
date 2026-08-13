import React from 'react';
import Link from 'next/link';
import { Mic, CheckCircle2, Lock } from 'lucide-react';
import { ReattemptButton } from './ReattemptButton';

interface AssessmentOverviewCardProps {
  status: string;
}

export function AssessmentOverviewCard({ status }: AssessmentOverviewCardProps) {
  const isEvaluated = status === 'EVALUATED';
  const isSubmitted = status === 'SUBMITTED';

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] h-full flex flex-col">
      <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-6">CREDIBILITY INTERVIEW ASSESSMENT</h3>
      
      <div className="flex flex-col md:flex-row gap-6 items-start flex-1">
        
        {/* Icon Block */}
        <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
          <Mic className="w-10 h-10 text-blue-600" />
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col h-full">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Credibility Interview Assessment</h2>
          <p className="text-[13px] text-slate-500 mb-5">Evaluate your communication, fluency and confidence.</p>
          
          <div className="flex flex-wrap gap-4 text-[11px] font-medium text-slate-600 mb-6">
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Video + Audio Recorded</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Adaptive Assessment</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Expert Evaluation</div>
          </div>
          
          <hr className="border-slate-100 mb-5" />

          {/* Status Row */}
          <div className="flex items-center gap-3 mb-6">
            <span className="px-2.5 py-1 text-[10px] font-bold text-blue-700 bg-blue-100 rounded uppercase tracking-wider">
              {status.replace('_', ' ')}
            </span>
            <span className="text-[13px] text-slate-600">
              {status === 'NOT_STARTED' && "Start your assessment when you're ready."}
              {status === 'IN_PROGRESS' && "Continue your assessment where you left off."}
              {status === 'SUBMITTED' && "Your responses are currently under expert evaluation."}
              {status === 'EVALUATED' && "Your evaluation is ready to review in the section below."}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-auto mb-5">
            {!isEvaluated && !isSubmitted ? (
              <Link
                href="/assessment"
                className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                {status === 'NOT_STARTED' ? 'Start Assessment' : 'Continue Assessment'} →
              </Link>
            ) : (
              isEvaluated && (
                <div className="flex-1 sm:flex-none [&>button]:h-10 [&>button]:w-full [&>button]:px-6 [&>button]:bg-blue-600 [&>button]:hover:bg-blue-700 [&>button]:text-white [&>button]:font-semibold [&>button]:text-[13px] [&>button]:rounded-lg [&>button]:shadow-sm [&>button]:transition-colors [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:gap-2">
                  <ReattemptButton />
                </div>
              )
            )}
            
            <button className="h-10 px-6 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-[13px] rounded-lg transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none">
              <CheckCircle2 className="w-4 h-4" /> Check Instructions
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            Please ensure a quiet place and stable internet connection before starting.
          </div>

        </div>
      </div>
    </div>
  );
}
