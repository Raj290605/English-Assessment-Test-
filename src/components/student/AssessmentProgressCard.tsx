import React from 'react';
import { CheckCircle2, PlayCircle, Mic2, Clock } from 'lucide-react';

interface AssessmentProgressCardProps {
  status: string;
  answeredCount: number;
  totalQuestions: number;
}

export function AssessmentProgressCard({ status, answeredCount, totalQuestions }: AssessmentProgressCardProps) {
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] h-full flex flex-col">
      <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-6">ASSESSMENT PROGRESS</h3>
      
      <div className="flex flex-col sm:flex-row items-center gap-8 mb-6 flex-1">
        
        {/* Progress Circle (Visual representation) */}
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#F1F5F9" strokeWidth="8" />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#2563EB" 
              strokeWidth="8" 
              strokeDasharray={`${progressPercent * 2.83} 283`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900 leading-none mb-1">{progressPercent}%</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Completed</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-[13px] font-semibold text-slate-900 leading-tight">Completed</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Good progress! Keep it up.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <PlayCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-[13px] font-semibold text-slate-900 leading-tight">In Progress</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Continue your assessment.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mic2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-[13px] font-semibold text-slate-900 leading-tight">Recorded</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Video & audio is being captured.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100 mt-auto">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-slate-400" />
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Estimated Duration</div>
            <div className="text-[12px] font-semibold text-slate-700">As per your pace</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-slate-500 font-medium">Time Spent</div>
          <div className="text-[13px] font-bold text-slate-900">18 min</div>
        </div>
      </div>

    </div>
  );
}
