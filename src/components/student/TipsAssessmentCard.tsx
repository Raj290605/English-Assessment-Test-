import React from 'react';
import { Ear, Mic2, UserCheck, Settings, ArrowRight, User } from 'lucide-react';

export function TipsAssessmentCard() {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] h-full flex flex-col">
      <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-6">TIPS FOR A GREAT ASSESSMENT</h3>
      
      <div className="flex flex-col sm:flex-row gap-8 flex-1">
        
        {/* Placeholder for Illustration */}
        <div className="flex-1 min-h-[160px] bg-[#F8FAFC] border border-slate-100 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
          {/* Abstract geometric illustration placeholder */}
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center opacity-80 z-10">
            <User className="w-12 h-12 text-blue-500" />
          </div>
          <div className="absolute bottom-0 left-10 w-16 h-12 bg-blue-50 rounded-t-xl" />
          <div className="absolute bottom-0 right-10 w-20 h-16 bg-blue-50 rounded-t-xl" />
          <div className="absolute top-8 right-8 w-6 h-6 rounded-full bg-yellow-100" />
          <div className="absolute bottom-12 left-12 w-4 h-4 rounded-full bg-emerald-100" />
        </div>

        {/* Tips List */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
              <Ear className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-slate-900 leading-tight">Find a quiet place</div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Avoid background noise and interruptions.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
              <Mic2 className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-slate-900 leading-tight">Speak clearly</div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Take your time and express your thoughts.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
              <UserCheck className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-slate-900 leading-tight">Be confident & natural</div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Be yourself and answer honestly.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
              <Settings className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-slate-900 leading-tight">Check your setup</div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Ensure camera, mic and internet are working.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 pt-4 border-t border-slate-100">
        <button className="text-[13px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5">
          View Assessment Guidelines <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
