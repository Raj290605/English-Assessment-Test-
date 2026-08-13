import React from 'react';
import { ClipboardList, CheckCircle2, Clock, Video } from 'lucide-react';

interface DashboardStatsProps {
  status: string;
  answeredCount: number;
  totalQuestions: number;
  attemptsCount: number;
}

export function DashboardStats({ status, answeredCount, totalQuestions, attemptsCount }: DashboardStatsProps) {
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      
      {/* Assessment Status */}
      <div className="bg-[#F0F7FF] rounded-2xl p-5 border border-blue-100 flex items-center gap-4 h-full">
        <div className="w-12 h-12 rounded-xl bg-white border border-blue-50 flex items-center justify-center shrink-0 shadow-sm">
          <ClipboardList className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500 mb-0.5">Assessment Status</div>
          <div className="text-[15px] font-bold text-slate-900 leading-tight capitalize">{status.replace('_', ' ').toLowerCase()}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{status === 'EVALUATED' ? 'View Results' : 'Keep going!'}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-[#F0FDF4] rounded-2xl p-5 border border-emerald-100 flex items-center gap-4 h-full">
        <div className="w-12 h-12 rounded-xl bg-white border border-emerald-50 flex items-center justify-center shrink-0 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500 mb-0.5">Progress</div>
          <div className="text-[15px] font-bold text-slate-900 leading-tight">{progressPercent}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Completed</div>
        </div>
      </div>

      {/* Time Spent */}
      <div className="bg-[#FFFBEB] rounded-2xl p-5 border border-amber-100 flex items-center gap-4 h-full">
        <div className="w-12 h-12 rounded-xl bg-white border border-amber-50 flex items-center justify-center shrink-0 shadow-sm">
          <Clock className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500 mb-0.5">Time Spent</div>
          <div className="text-[15px] font-bold text-slate-900 leading-tight">18 min</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Total</div>
        </div>
      </div>

      {/* Recording Status */}
      <div className="bg-[#F5F3FF] rounded-2xl p-5 border border-purple-100 flex items-center gap-4 h-full">
        <div className="w-12 h-12 rounded-xl bg-white border border-purple-50 flex items-center justify-center shrink-0 shadow-sm">
          <Video className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500 mb-0.5">Recording Status</div>
          <div className="text-[15px] font-bold text-slate-900 leading-tight">Active</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Captured securely</div>
        </div>
      </div>

    </div>
  );
}
