import React from 'react';
import Link from 'next/link';
import { Mic, BarChart2, History, ChevronRight } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'My Assessments',
      subtitle: 'Start or continue your assessment',
      icon: <Mic className="w-5 h-5 text-blue-600" />,
      href: '/dashboard/my-assessments',
    },
    {
      title: 'Results & Feedback',
      subtitle: 'View your results and feedback',
      icon: <BarChart2 className="w-5 h-5 text-blue-600" />,
      href: '/dashboard/results',
    },
    {
      title: 'Previous Attempts',
      subtitle: 'View your attempt history',
      icon: <History className="w-5 h-5 text-blue-600" />,
      href: '/dashboard/attempts',
    },
  ];

  return (
    <div className="mt-2">
      <h3 className="text-[15px] font-bold text-slate-900 mb-4 px-1">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, i) => (
          <Link
            key={i}
            href={action.href}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                {action.icon}
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-slate-900 leading-tight mb-0.5">{action.title}</h4>
                <p className="text-[12px] text-slate-500">{action.subtitle}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-2" />
          </Link>
        ))}
      </div>
    </div>
  );
}
