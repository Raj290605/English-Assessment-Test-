import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface RecentActivityProps {
  assessments: any[];
}

export function RecentActivity({ assessments }: RecentActivityProps) {
  const recentEvents = assessments.slice(0, 3);

  const formatTime = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[15px] font-bold text-slate-900">Recent Activity</h3>
        <Link
          href="/dashboard/my-assessments"
          className="text-[13px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {recentEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <Clock className="w-8 h-8 text-slate-200 mb-3" />
            <p className="text-sm text-slate-500 font-medium">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {recentEvents.map((a, i) => {
              const isEvaluated = a.status === 'EVALUATED';
              const isSubmitted = a.status === 'SUBMITTED';
              
              let Icon = ArrowRight;
              let iconColor = 'text-blue-600';
              let iconBg = 'bg-blue-50';
              let title = `Attempt ${a.attemptNumber} started`;
              let desc = 'You started a new assessment.';

              if (isEvaluated) {
                Icon = Clock;
                iconColor = 'text-purple-600';
                iconBg = 'bg-purple-50';
                title = `Attempt ${a.attemptNumber} evaluated`;
                desc = 'Your previous attempt has been evaluated.';
              } else if (isSubmitted) {
                Icon = CheckCircle2;
                iconColor = 'text-emerald-600';
                iconBg = 'bg-emerald-50';
                title = 'Assessment submitted';
                desc = 'Your responses have been submitted successfully.';
              }

              const date = a.updatedAt || a.createdAt;

              return (
                <div key={a.id} className="flex gap-4 items-start">
                  <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 pt-0.5">
                    <h4 className="text-[14px] font-bold text-slate-900 leading-tight mb-1">{title}</h4>
                    <p className="text-[13px] text-slate-500 leading-snug">{desc}</p>
                  </div>

                  <div className="text-right pt-0.5 shrink-0">
                    <div className="text-[12px] font-medium text-slate-500 mb-0.5">{formatDate(date)}</div>
                    <div className="text-[11px] font-medium text-slate-400">{formatTime(date)}</div>
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
