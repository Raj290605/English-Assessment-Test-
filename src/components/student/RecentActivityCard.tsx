import React from 'react';
import Link from 'next/link';
import { History, ChevronRight, CheckCircle2, Award, Clock } from 'lucide-react';

interface RecentActivityCardProps {
  assessments: any[];
}

export function RecentActivityCard({ assessments }: RecentActivityCardProps) {
  // Only show the 3 most recent events
  const recentEvents = assessments.slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Recent Activity</h3>
        </div>
        <Link
          href="/dashboard/my-assessments"
          className="text-[12px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex-1 p-6">
        {recentEvents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center pb-4">
            <Clock className="w-8 h-8 text-slate-200 mb-3" />
            <p className="text-sm text-slate-500 font-medium">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-5">
            {recentEvents.map((a, i) => {
              const isEvaluated = a.status === 'EVALUATED';
              const isSubmitted = a.status === 'SUBMITTED';
              
              let Icon = Clock;
              let iconColor = 'text-amber-500';
              let iconBg = 'bg-amber-50';
              let actionText = 'Assessment started';

              if (isEvaluated) {
                Icon = Award;
                iconColor = 'text-purple-600';
                iconBg = 'bg-purple-50';
                actionText = 'Assessment evaluated';
              } else if (isSubmitted) {
                Icon = CheckCircle2;
                iconColor = 'text-emerald-600';
                iconBg = 'bg-emerald-50';
                actionText = 'Assessment submitted';
              }

              const date = new Date(a.updatedAt || a.createdAt);

              return (
                <div key={a.id} className="flex gap-4 relative">
                  {/* Timeline connector */}
                  {i !== recentEvents.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-[-20px] w-px bg-slate-100" />
                  )}
                  
                  <div className={`w-8 h-8 rounded-full ${iconBg} ${iconColor} flex items-center justify-center shrink-0 z-10 border border-white ring-4 ring-white`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="pt-1.5">
                    <p className="text-sm font-semibold text-slate-800 leading-none mb-1">
                      {actionText}
                    </p>
                    <p className="text-[12px] text-slate-500">
                      Attempt {a.attemptNumber} · {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
