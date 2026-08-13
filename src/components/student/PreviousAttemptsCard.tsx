import React from 'react';
import Link from 'next/link';
import { Video, ChevronRight, Info } from 'lucide-react';

interface PreviousAttemptsCardProps {
  assessments: any[];
  currentAssessmentId?: string;
  isFullPage?: boolean;
}

export function PreviousAttemptsCard({ assessments, isFullPage = false }: PreviousAttemptsCardProps) {
  const displayAssessments = isFullPage ? assessments : assessments.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">YOUR PREVIOUS ATTEMPTS</h3>
        {!isFullPage && (
          <Link href="/dashboard/attempts" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
            View All Attempts →
          </Link>
        )}
      </div>
      
      <div className="flex-1 flex flex-col gap-3">
        {displayAssessments && displayAssessments.length > 0 ? (
          displayAssessments.map((a: any) => {
            const isEvaluated = a.status === 'EVALUATED';
            const progress = a.responses ? Math.round((a.responses.length / 20) * 100) : 0;
            
            return (
              <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer gap-4">
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex flex-col justify-center h-10">
                    <div className="text-[13px] font-bold text-slate-900 leading-none mb-1">Attempt {a.attemptNumber}</div>
                    <div className="text-[11px] text-slate-500 leading-none">
                      {new Date(a.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · {' '}
                      {new Date(a.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:ml-auto">
                  {isEvaluated ? (
                    <div className="flex items-center gap-3">
                      {a.evaluation?.overallScore && (
                        <span className="text-[12px] font-bold text-emerald-600">{a.evaluation.overallScore} / 10</span>
                      )}
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md tracking-wide">Evaluated</span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md tracking-wide">In Progress</span>
                  )}
                  
                  <Link href={`/dashboard?assessmentId=${a.id}`} className="shrink-0 p-1">
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl">
            <Video className="w-8 h-8 text-slate-300 mb-2" />
            <span className="text-[13px] font-semibold text-slate-600">No attempts yet</span>
            <span className="text-[11px] text-slate-400 mt-1">Your history will appear here.</span>
          </div>
        )}
      </div>

      <div className="mt-4 bg-slate-50 rounded-xl p-3 flex items-start gap-2 border border-slate-100">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span className="text-[11px] text-slate-500 font-medium leading-relaxed">
          Reattempts are allowed as per admin settings.
        </span>
      </div>

    </div>
  );
}
