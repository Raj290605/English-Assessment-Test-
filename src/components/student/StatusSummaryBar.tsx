import React from 'react';
import { Activity, Target, RotateCcw, Clock } from 'lucide-react';

interface StatusSummaryBarProps {
  status: string;
  latestScore: number | null;
  attemptsCount: number;
  lastActivity: string | Date | null;
}

const statusLabel: Record<string, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  SUBMITTED: 'Submitted',
  EVALUATED: 'Evaluated',
};

const statusDot: Record<string, string> = {
  NOT_STARTED: 'bg-slate-400',
  IN_PROGRESS: 'bg-amber-500',
  SUBMITTED: 'bg-blue-500',
  EVALUATED: 'bg-emerald-500',
};

export function StatusSummaryBar({
  status,
  latestScore,
  attemptsCount,
  lastActivity,
}: StatusSummaryBarProps) {
  
  const formatDate = (date: string | Date | null) => {
    if (!date) return 'No activity yet';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const items = [
    {
      label: 'Current Status',
      value: statusLabel[status] ?? status,
      icon: <Activity className="w-4 h-4 text-slate-400" />,
      dot: statusDot[status] ?? 'bg-slate-400',
    },
    {
      label: 'Latest Score',
      value: latestScore != null ? `${Math.round(latestScore)} / 10` : '—',
      icon: <Target className="w-4 h-4 text-slate-400" />,
      highlight: latestScore != null,
    },
    {
      label: 'Total Attempts',
      value: `${attemptsCount} attempt${attemptsCount !== 1 ? 's' : ''}`,
      icon: <RotateCcw className="w-4 h-4 text-slate-400" />,
    },
    {
      label: 'Last Activity',
      value: formatDate(lastActivity),
      icon: <Clock className="w-4 h-4 text-slate-400" />,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
        {items.map((item, i) => (
          <div key={i} className="px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              {item.icon}
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
            </div>
            <div className={`flex items-center gap-2 ${item.highlight ? 'text-emerald-600 font-bold text-base' : 'text-slate-800 font-semibold text-sm'}`}>
              {item.dot && (
                <span className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`} />
              )}
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
