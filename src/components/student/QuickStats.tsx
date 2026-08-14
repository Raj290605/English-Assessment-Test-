import React from 'react';
import { Activity, Target, CheckSquare, RefreshCcw } from 'lucide-react';

interface QuickStatsProps {
  status: string;
  answeredCount: number;
  totalQuestions: number;
  attemptsCount: number;
}

export function QuickStats({ status, answeredCount, totalQuestions, attemptsCount }: QuickStatsProps) {
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1 */}
      <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col gap-1.5 shadow-sm">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Activity className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Status</span>
        </div>
        <div className="text-lg font-semibold text-slate-900 capitalize leading-none">
          {status.replace('_', ' ').toLowerCase()}
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col gap-1.5 shadow-sm">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Target className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Progress</span>
        </div>
        <div className="text-lg font-semibold text-slate-900 leading-none">
          {progressPercent}%
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col gap-1.5 shadow-sm">
        <div className="flex items-center gap-1.5 text-slate-500">
          <CheckSquare className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Responses</span>
        </div>
        <div className="text-lg font-semibold text-slate-900 leading-none flex items-baseline gap-1">
          {answeredCount} <span className="text-[11px] font-medium text-slate-400 normal-case tracking-normal">completed</span>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col gap-1.5 shadow-sm">
        <div className="flex items-center gap-1.5 text-slate-500">
          <RefreshCcw className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Attempts</span>
        </div>
        <div className="text-lg font-semibold text-slate-900 leading-none flex items-baseline gap-1">
          {attemptsCount} <span className="text-[11px] font-medium text-slate-400 normal-case tracking-normal">total</span>
        </div>
      </div>
    </div>
  );
}
