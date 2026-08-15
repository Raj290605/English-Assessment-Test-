'use client';

import React from 'react';
import { Question } from '@prisma/client';
import { Edit2 } from 'lucide-react';

interface QuestionListProps {
  questions: Question[];
  onEdit: (q: Question) => void;
  isSaving: boolean;
}

export default function QuestionList({
  questions,
  onEdit,
  isSaving,
}: QuestionListProps) {

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-[#151b2b] rounded-2xl border border-white/10 p-12 text-center">
        <p className="text-slate-400">No questions found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#151b2b] rounded-2xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="py-5 px-6 text-xs font-semibold text-slate-300 uppercase tracking-wider w-20">No.</th>
              <th className="py-5 px-6 text-xs font-semibold text-slate-300 uppercase tracking-wider">Prompt</th>
              <th className="py-5 px-6 text-xs font-semibold text-slate-300 uppercase tracking-wider w-32 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {questions.map((q) => {
              return (
                <tr 
                  key={q.id} 
                  className="transition-colors hover:bg-white/[0.02]"
                >
                  <td className="py-5 px-6 text-sm text-slate-300 font-medium">
                    {q.questionNumber}
                  </td>
                  <td className="py-5 px-6 text-sm text-slate-100 pr-10">
                    <span className="block leading-relaxed">{q.promptText}</span>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(q)}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors disabled:opacity-50 text-sm font-medium border border-transparent hover:border-blue-500/20"
                        title="Edit Question"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
