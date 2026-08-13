import React from 'react';
import { Camera, Volume2, Mic, CheckCircle } from 'lucide-react';

export function InstructionsCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-md p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Assessment Guidelines</h3>
      
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <Camera className="w-4 h-4 text-slate-400 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">Camera & microphone</span>
            <span className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">Allow browser access before starting your session.</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Volume2 className="w-4 h-4 text-slate-400 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">Quiet environment</span>
            <span className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">Choose a place with minimal background noise.</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mic className="w-4 h-4 text-slate-400 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">Speak clearly</span>
            <span className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">Answer naturally, clearly, and directly into the mic.</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-slate-400 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">Review before submitting</span>
            <span className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">Review your responses before final submission.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
