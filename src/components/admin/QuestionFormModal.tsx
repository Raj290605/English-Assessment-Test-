'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '@prisma/client';
import { X, Save, AlertCircle } from 'lucide-react';

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: Question | null;
  isSaving: boolean;
  mode?: 'add' | 'edit';
}

export default function QuestionFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving,
  mode = 'edit'
}: QuestionFormModalProps) {
  const [promptText, setPromptText] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setPromptText(initialData.promptText);
      } else if (mode === 'add') {
        setPromptText('');
      }
    }
  }, [initialData, isOpen, mode]);

  if (!isOpen) return null;
  if (mode === 'edit' && !initialData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPrompt = promptText.trim();
    if (!trimmedPrompt) {
      alert("Question prompt cannot be empty.");
      return;
    }
    await onSave({
      promptText: trimmedPrompt,
    });
  };

  const isUnchanged = Boolean(mode === 'edit' && initialData && promptText.trim() === initialData.promptText);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="bg-[#0f1423] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            {mode === 'edit' ? `Edit Question ${initialData?.questionNumber}` : 'Add New Question'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-6">
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-blue-200">
              <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
              <p className="text-sm leading-relaxed">
                Changes apply to <strong className="text-white">new assessments</strong>. 
                Existing or in-progress assessments will remain unchanged.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Question Prompt <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  value={promptText}
                  onChange={e => setPromptText(e.target.value)}
                  className="w-full bg-[#151b2b] border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all"
                  rows={4}
                  placeholder="Enter the speaking prompt..."
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-white/10 bg-white/[0.02] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !promptText.trim() || isUnchanged}
              className="px-5 py-2.5 rounded-xl font-medium text-white bg-[#1E3A8A] hover:bg-[#2546a8] shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {mode === 'edit' ? 'Save Changes' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
