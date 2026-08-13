'use client';

import React from 'react';
import { Award, TrendingUp, Zap, BookOpen, Volume2, Sparkles, MessageSquare, ListChecks } from 'lucide-react';
import { StudentVideoPlayer } from './StudentVideoPlayer';

interface EvaluationSummaryProps {
  evaluation: any;
  responses: any[];
  questions?: any[];
}

export function EvaluationSummary({ evaluation, responses, questions = [] }: EvaluationSummaryProps) {
  const submittedResponses = responses
    ?.filter(r => r.status === 'UPLOADED' || r.status === 'SAVED' || r.cloudinaryPublicId)
    .sort((a, b) => a.questionNumber - b.questionNumber) || [];

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* OVERALL SCORE PANEL (Premium Treatment) */}
      <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 mx-auto shadow-sm border border-blue-100">
            <Award className="w-8 h-8" />
          </div>
          
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Overall Score</h3>
          
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-7xl font-extrabold text-slate-900 tracking-tight">{evaluation.overallScore}</span>
            <span className="text-3xl font-bold text-slate-300">/ 10</span>
          </div>
          
          <p className="text-sm font-medium text-slate-500 max-w-md mx-auto mt-4">
            This score reflects your comprehensive performance across fluency, grammar, pronunciation, vocabulary, and confidence.
          </p>
        </div>
      </div>

      {/* CATEGORY SCORES */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Fluency', score: evaluation.fluencyScore, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Grammar', score: evaluation.grammarScore, icon: ListChecks, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Pronunciation', score: evaluation.pronunciationScore, icon: Volume2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Vocabulary', score: evaluation.vocabularyScore, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Confidence', score: evaluation.confidenceScore, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map(cat => (
          <div key={cat.label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col hover:border-blue-200 transition-colors">
            <div className={`w-10 h-10 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center mb-4`}>
              <cat.icon className="w-5 h-5" />
            </div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{cat.label}</div>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className="text-2xl font-bold text-slate-900 leading-none">{cat.score}</span>
              <span className="text-[13px] font-bold text-slate-400">/ 10</span>
            </div>
          </div>
        ))}
      </div>

      {/* STRENGTHS & AREAS FOR IMPROVEMENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50/50 rounded-2xl p-6 md:p-8 border border-emerald-100">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-widest">Key Strengths</h4>
          </div>
          <p className="text-[14px] text-emerald-900 leading-relaxed whitespace-pre-wrap font-medium">
            {evaluation.strengths || 'No specific strengths recorded.'}
          </p>
        </div>

        <div className="bg-amber-50/50 rounded-2xl p-6 md:p-8 border border-amber-100">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <h4 className="text-sm font-bold text-amber-800 uppercase tracking-widest">Areas for Improvement</h4>
          </div>
          <p className="text-[14px] text-amber-900 leading-relaxed whitespace-pre-wrap font-medium">
            {evaluation.areasForImprovement || 'No specific areas for improvement recorded.'}
          </p>
        </div>
      </div>

      {/* OVERALL REMARKS */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Overall Remarks</h4>
        </div>
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <p className="text-[14px] text-slate-700 leading-relaxed whitespace-pre-wrap">
            {evaluation.overallRemarks || 'No overall remarks provided.'}
          </p>
        </div>
      </div>

      {/* YOUR SUBMITTED RESPONSES & FEEDBACK */}
      {submittedResponses.length > 0 && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-1">Your Submitted Responses</h4>
            <p className="text-[13px] text-slate-500">Review your recorded answers and any available expert feedback.</p>
          </div>
          
          <div className="flex flex-col gap-8">
            {submittedResponses.map(r => {
              const question = questions.find(q => q.id === r.questionId || q.questionNumber === r.questionNumber);
              
              return (
                <div key={r.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  {/* Header: Question info & Score */}
                  <div className="p-5 md:p-6 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 mt-1">
                        Q{r.questionNumber}
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Question</h5>
                        <p className="text-[14px] text-slate-800 font-medium leading-relaxed">
                          {question ? question.promptText || question.text || 'Question text not available' : 'Question text not available'}
                        </p>
                      </div>
                    </div>
                    {r.feedback?.score != null && (
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</span>
                        <div className="flex items-baseline gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                          <span className="text-lg font-bold text-slate-900">{r.feedback.score}</span>
                          <span className="text-[12px] font-bold text-slate-500">/ 10</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 md:p-6 space-y-6">
                    {/* Video Player */}
                    {r.cloudinaryPublicId ? (
                      <div>
                        <StudentVideoPlayer 
                          responseId={r.id} 
                          publicId={r.cloudinaryPublicId} 
                          fallbackUrl={r.cloudinaryUrl}
                        />
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
                        <p className="text-sm text-slate-500 font-medium">No recording is available for this response.</p>
                      </div>
                    )}

                    {/* Feedback Content */}
                    {r.feedback && (
                      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-5">
                        {r.feedback.remarks && (
                          <div>
                            <h5 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-2">Expert Feedback</h5>
                            <p className="text-[13px] text-slate-700 leading-relaxed">{r.feedback.remarks}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          {r.feedback.strengths && (
                            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                              <h5 className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Sparkles className="w-3 h-3"/> Strengths</h5>
                              <p className="text-[13px] text-emerald-900 leading-relaxed">{r.feedback.strengths}</p>
                            </div>
                          )}
                          {r.feedback.needsImprovement && (
                            <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100">
                              <h5 className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-1.5"><TrendingUp className="w-3 h-3"/> Needs Improvement</h5>
                              <p className="text-[13px] text-amber-900 leading-relaxed">{r.feedback.needsImprovement}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
