import React from 'react';
import { ClipboardList, TrendingUp, History, Star } from 'lucide-react';

interface DashboardStatCardsProps {
  status: string;
  answeredCount: number;
  totalQuestions: number;
  attemptsCount: number;
  latestScore: number | null;
}

export function DashboardStatCards({
  status,
  answeredCount,
  totalQuestions,
  attemptsCount,
  latestScore,
}: DashboardStatCardsProps) {
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const statusMap: Record<string, { label: string; text: string }> = {
    NOT_STARTED: { label: 'Not Started', text: 'Ready to begin' },
    IN_PROGRESS: { label: 'In Progress', text: 'Keep going!' },
    SUBMITTED: { label: 'Submitted', text: 'Pending review' },
    EVALUATED: { label: 'Evaluated', text: 'Results available' },
  };

  const currentStatus = statusMap[status] || statusMap['NOT_STARTED'];

  const getPerformanceLabel = (score: number) => {
    if (score >= 9) return { text: 'Excellent Performance', color: 'text-emerald-600' };
    if (score >= 7) return { text: 'Good Performance', color: 'text-emerald-600' };
    if (score >= 5) return { text: 'Average Performance', color: 'text-amber-600' };
    return { text: 'Needs Improvement', color: 'text-red-600' };
  };

  const perfLabel = latestScore != null ? getPerformanceLabel(Math.round(latestScore)) : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1 - Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
          <ClipboardList className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h4 className="text-[12px] text-slate-500 font-medium mb-0.5">Assessment status</h4>
          <div className="text-[19px] font-bold text-slate-900 leading-tight mb-0.5">{currentStatus.label}</div>
          <div className="text-[12px] text-slate-400 font-medium">{currentStatus.text}</div>
        </div>
      </div>

      {/* Card 2 - Progress */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h4 className="text-[12px] text-slate-500 font-medium mb-0.5">Progress</h4>
          <div className="text-[19px] font-bold text-slate-900 leading-tight mb-0.5">{progressPercent}%</div>
          <div className="text-[12px] text-slate-400 font-medium">{answeredCount} / {totalQuestions} responses</div>
        </div>
      </div>

      {/* Card 3 - Attempts */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
          <History className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h4 className="text-[12px] text-slate-500 font-medium mb-0.5">Attempts</h4>
          <div className="text-[19px] font-bold text-slate-900 leading-tight mb-0.5">{attemptsCount}</div>
          <div className="text-[12px] text-slate-400 font-medium">Total attempts</div>
        </div>
      </div>

      {/* Card 4 - Latest score */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
          <Star className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h4 className="text-[12px] text-slate-500 font-medium mb-0.5">Latest score</h4>
          {latestScore != null ? (
            <>
              <div className="flex items-baseline gap-1 mb-0.5">
                <span className="text-[19px] font-bold text-slate-900 leading-tight">{Math.round(latestScore)}</span>
                <span className="text-[14px] font-semibold text-slate-400">/ 10</span>
              </div>
              <div className={`text-[12px] font-medium ${perfLabel?.color}`}>{perfLabel?.text}</div>
            </>
          ) : (
            <>
              <div className="text-[19px] font-bold text-slate-900 leading-tight mb-0.5">—</div>
              <div className="text-[12px] text-slate-400 font-medium">Not available</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
