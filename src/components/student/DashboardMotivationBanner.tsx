import React from 'react';
import { Trophy, Target } from 'lucide-react';

export function DashboardMotivationBanner() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] flex items-center justify-between overflow-hidden relative">
      
      <div className="flex items-center gap-4 z-10">
        <div className="w-12 h-12 rounded-full bg-[#FFFBEB] flex items-center justify-center shrink-0 border border-amber-100">
          <Trophy className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <div className="text-[13px] font-bold text-slate-900 leading-tight">Every attempt brings you closer to your goal.</div>
          <div className="text-[12px] text-slate-500 mt-0.5">Stay consistent, stay confident, you've got this! <span role="img" aria-label="muscle">💪</span></div>
        </div>
      </div>

      {/* Decorative Target Visual on the right */}
      <div className="relative z-10 hidden sm:flex items-center justify-center pr-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center relative">
          <Target className="w-6 h-6 text-blue-500 relative z-10" />
          <div className="absolute inset-0 rounded-full border border-blue-200 opacity-50 scale-150" />
          <div className="absolute inset-0 rounded-full border border-blue-100 opacity-30 scale-200" />
          {/* Leaf mockup */}
          <div className="absolute -bottom-2 -left-4 w-4 h-4 bg-emerald-100 rounded-full rounded-tl-none -rotate-12" />
        </div>
      </div>

      {/* Subtle background abstract shapes */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-50/30 to-transparent pointer-events-none" />
    </div>
  );
}
