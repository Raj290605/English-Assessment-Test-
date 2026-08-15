'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AssessmentHeader } from '@/components/student/AssessmentHeader';
import { MediaRecorderComponent } from '@/components/student/MediaRecorder';
import { CheckCircle2, ArrowLeft, ArrowRight, Info, Clock, AlertCircle, Lock } from 'lucide-react';
import { ClipboardList } from 'lucide-react'; // For the progress card icon

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
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meRes.ok || !meData.user) {
        router.push('/login');
        return;
      }
      setUser(meData.user);

      const statusRes = await fetch('/api/assessment/status');
      const statusData = await statusRes.json();
      if (!statusRes.ok) throw new Error(statusData.error || 'Failed to load assessment');

      const ass = statusData.assessment;
      setAssessment(ass);
      setQuestions(statusData.questions || []);

      const resMap: Record<string, QuestionResponse> = {};
      if (ass.responses) {
        ass.responses.forEach((r: any) => {
          resMap[r.questionId] = r;
        });
      }
      setResponsesMap(resMap);

      const answeredCount = ass.responses ? ass.responses.length : 0;
      if (answeredCount > 0 && answeredCount < (statusData.questions?.length || 1)) {
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
      <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center text-slate-500">
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
  const totalQuestions = questions.length;
  const isAllAnswered = totalAnswered === totalQuestions && totalQuestions > 0;
  const progressPercent = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

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

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <AssessmentHeader user={user} />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-5 py-3 space-y-3">
        {error && (
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TOP PROGRESS CARD */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 md:p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto text-center md:text-left">
            <h2 className="text-lg font-bold text-slate-900 mb-0.5">
              Question <span className="text-blue-600">{currentIndex + 1}</span> of {totalQuestions}
            </h2>
            <div className="text-emerald-500 font-medium text-xs">{totalAnswered} answered</div>
          </div>

          <div className="flex-1 w-full max-w-xl mx-auto flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-600 font-medium">Overall Progress</span>
              <span className="text-sm font-bold text-blue-600">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-700" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 border-l border-slate-200 pl-6">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <ClipboardList className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 leading-tight">{totalAnswered} / {totalQuestions}</span>
              <span className="text-[11px] text-slate-500 font-medium">Answered</span>
            </div>
          </div>
        </div>

        {/* QUESTION NAVIGATION CARD */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 flex flex-col xl:flex-row items-start xl:items-center gap-4">
          
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <div className="w-3 h-3 rounded-full border-2 border-blue-600 bg-blue-600" /> Current
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Answered
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <div className="w-3 h-3 rounded-full border border-slate-300 bg-white" /> Unanswered
            </div>
          </div>

          <div className="flex-1 w-full overflow-x-auto pb-1 xl:pb-0 scrollbar-hide">
            <div className="flex items-center gap-2 min-w-max px-1">
              {questions.map((q, idx) => {
                const isSaved = Boolean(responsesMap[q.id]);
                const isCurrent = idx === currentIndex;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className="relative flex items-center justify-center group"
                    title={`Question ${q.questionNumber}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isSaved
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-500'
                        : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'
                    }`}>
                      {q.questionNumber}
                    </div>
                    {isSaved && !isCurrent && (
                      <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[1px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 fill-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TWO COLUMN WORKSPACE */}
        {currentQuestion && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            
            {/* LEFT COLUMN: QUESTION & INSTRUCTIONS */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-5 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold px-2 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">
                  {currentQuestion.category || 'Self Introduction'}
                </span>
                <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                  <Clock className="w-3 h-3" /> Time Limit: {Math.floor(currentQuestion.timeLimitSec / 60).toString().padStart(2, '0')}:{(currentQuestion.timeLimitSec % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-blue-600 font-bold text-sm mb-1.5">Question {currentQuestion.questionNumber}</h3>
                <p className="text-xl font-bold text-slate-900 leading-tight">
                  {currentQuestion.promptText}
                </p>
              </div>

              {/* Instructions Box directly under the question */}
              <div className="bg-[#F8FAFC] rounded-lg p-4 border border-slate-100 mt-2">
                <div className="flex items-center gap-1.5 mb-2.5 text-blue-600">
                  <Info className="w-4 h-4" />
                  <h4 className="font-bold text-[12px] uppercase tracking-wider">Instructions</h4>
                </div>
                <ul className="space-y-2 text-[11.5px] text-slate-600 font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    Please answer the question clearly and confidently.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    You will have up to {Math.floor(currentQuestion.timeLimitSec / 60)} minute{currentQuestion.timeLimitSec >= 120 ? 's' : ''} {currentQuestion.timeLimitSec % 60 > 0 ? `${currentQuestion.timeLimitSec % 60} seconds` : ''} to record your response.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    You can re-record your answer if needed before submitting.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    Make sure you are in a quiet environment.
                  </li>
                </ul>
              </div>
            </div>

            {/* RIGHT COLUMN: CAMERA & RECORDING */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-5 flex flex-col h-full">
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
        )}

        {/* BOTTOM NAVIGATION */}
        <div className="flex items-center justify-between pt-1 pb-2">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="h-10 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 text-[12px] disabled:opacity-40 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous Question
          </button>

          <button
            onClick={handleNext}
            className={`h-10 px-6 font-bold rounded-lg shadow-sm flex items-center gap-2 text-[12px] transition-all ${
              currentIndex === totalQuestions - 1
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 border border-emerald-600'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25 border border-blue-600'
            }`}
          >
            {currentIndex === totalQuestions - 1 ? 'Submit Assessment' : 'Save & Next Question'}
            {currentIndex < totalQuestions - 1 && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

      </main>

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 relative shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-emerald-500" />
              Submit Complete Assessment?
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              You have answered {totalAnswered} of {totalQuestions} questions. Once submitted, your video recordings will be locked for evaluator review and grading.
            </p>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 mt-4">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto"
              >
                Review Responses
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-sm shadow-emerald-500/25 transition-colors disabled:opacity-50 w-full sm:w-auto"
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
