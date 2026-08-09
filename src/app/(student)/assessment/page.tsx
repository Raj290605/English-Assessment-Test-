'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { MediaRecorderComponent } from '@/components/student/MediaRecorder';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Send, HelpCircle, Lock } from 'lucide-react';

interface Question {
  id: string;
  questionNumber: number;
  promptText: string;
  category?: string | null;
  timeLimitSec: number;
}

interface QuestionResponse {
  questionId: string;
  questionNumber: number;
  cloudinaryPublicId: string;
  cloudinaryUrl: string;
}

export default function AssessmentWizardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responsesMap, setResponsesMap] = useState<Record<string, QuestionResponse>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [error, setError] = useState('');

  const fetchAssessmentData = async () => {
    try {
      // 1. Fetch user session
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meRes.ok || !meData.user) {
        router.push('/login');
        return;
      }
      setUser(meData.user);

      // 2. Fetch assessment & questions
      const statusRes = await fetch('/api/assessment/status');
      const statusData = await statusRes.json();
      if (!statusRes.ok) throw new Error(statusData.error || 'Failed to load assessment');

      const ass = statusData.assessment;
      setAssessment(ass);
      setQuestions(statusData.questions || []);

      // Build map of saved responses
      const resMap: Record<string, QuestionResponse> = {};
      if (ass.responses) {
        ass.responses.forEach((r: any) => {
          resMap[r.questionId] = r;
        });
      }
      setResponsesMap(resMap);

      // Set current question index to first unanswered question
      const answeredCount = ass.responses ? ass.responses.length : 0;
      if (answeredCount > 0 && answeredCount < 25) {
        setCurrentIndex(answeredCount);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessmentData();
  }, []);

  // Prevent accidental navigation during assessment
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium">Loading Assessment Questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isCurrentAnswered = currentQuestion ? Boolean(responsesMap[currentQuestion.id]) : false;
  const totalAnswered = Object.keys(responsesMap).length;
  const isAllAnswered = totalAnswered === 25;

  const handleResponseSaved = () => {
    fetchAssessmentData();
  };

  const handleFinalSubmit = async () => {
    if (!assessment) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId: assessment.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setShowSubmitModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar user={user} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Progress Header Bar */}
        <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Progress: <span className="text-blue-600 dark:text-blue-400 font-mono">{totalAnswered}</span> / 25 Answered
            </h2>
          </div>

          {/* Question Step Indicator Dots */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1">
            {questions.map((q, idx) => {
              const isSaved = Boolean(responsesMap[q.id]);
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                      : isSaved
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title={`Question ${q.questionNumber}: ${isSaved ? 'Saved' : 'Not Saved'}`}
                >
                  {q.questionNumber}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Current Question Card */}
        {currentQuestion && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 space-y-6">
              <div className="glass-card space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {currentQuestion.category || 'General Speaking'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Limit: {currentQuestion.timeLimitSec}s
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Question Prompt #{currentQuestion.questionNumber}
                  </span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                    "{currentQuestion.promptText}"
                  </p>
                </div>

                {isCurrentAnswered && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Response for this question has been saved and uploaded.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recorder Viewport Column */}
            <div className="md:col-span-7">
              <div className="glass-card">
                <MediaRecorderComponent
                  key={currentQuestion.id}
                  questionId={currentQuestion.id}
                  questionNumber={currentQuestion.questionNumber}
                  assessmentId={assessment?.id}
                  timeLimitSec={currentQuestion.timeLimitSec}
                  hasSavedResponse={isCurrentAnswered}
                  onResponseSaved={handleResponseSaved}
                />
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="py-2.5 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-2 text-sm disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Question
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 text-sm transition-all"
            >
              Next Question
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              disabled={!isAllAnswered}
              className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 text-sm disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
              Complete & Submit Assessment
            </button>
          )}
        </div>
      </main>

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 space-y-4 relative">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              Submit Complete Assessment?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              You have answered all 25 assessment questions. Once submitted, your video recordings will be locked for evaluator review and grading.
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="py-2 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors"
              >
                Review Responses
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="py-2 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/25 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Yes, Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
