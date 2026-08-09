'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { AuthenticatedVideoPlayer } from '@/components/admin/AuthenticatedVideoPlayer';
import { ArrowLeft, Save, CheckCircle2, AlertCircle, Award, Video, MessageSquare, Star, Sliders } from 'lucide-react';

export default function StudentReviewPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params?.id as string;

  const [user, setUser] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  // Per-Question Form State
  const [remarks, setRemarks] = useState('');
  const [strengths, setStrengths] = useState('');
  const [needsImprovement, setNeedsImprovement] = useState('');
  const [questionScore, setQuestionScore] = useState<number | ''>('');
  const [savingFeedback, setSavingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  // Overall Evaluation Form State
  const [fluencyScore, setFluencyScore] = useState(7);
  const [grammarScore, setGrammarScore] = useState(7);
  const [pronunciationScore, setPronunciationScore] = useState(7);
  const [vocabularyScore, setVocabularyScore] = useState(7);
  const [confidenceScore, setConfidenceScore] = useState(7);
  const [overallRemarks, setOverallRemarks] = useState('');
  const [overallStrengths, setOverallStrengths] = useState('');
  const [overallAreasForImprovement, setOverallAreasForImprovement] = useState('');
  const [savingEvaluation, setSavingEvaluation] = useState(false);
  const [evaluationSuccess, setEvaluationSuccess] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudentData = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meRes.ok || meData.user?.role !== 'ADMIN') {
        router.push('/admin-login');
        return;
      }
      setUser(meData.user);

      const res = await fetch(`/api/admin/student-detail?studentId=${studentId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch student details');

      setStudent(data.student);
      setAssessment(data.assessment);
      setQuestions(data.questions || []);

      // If overall evaluation exists, populate state
      if (data.assessment?.evaluation) {
        const ev = data.assessment.evaluation;
        setFluencyScore(ev.fluencyScore);
        setGrammarScore(ev.grammarScore);
        setPronunciationScore(ev.pronunciationScore);
        setVocabularyScore(ev.vocabularyScore);
        setConfidenceScore(ev.confidenceScore);
        setOverallRemarks(ev.overallRemarks || '');
        setOverallStrengths(ev.strengths || '');
        setOverallAreasForImprovement(ev.areasForImprovement || '');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchStudentData();
  }, [studentId]);

  // Sync per-question feedback form state when selected question changes
  const currentQuestion = questions[selectedQuestionIndex];
  const currentResponse = assessment?.responses?.find((r: any) => r.questionId === currentQuestion?.id);

  useEffect(() => {
    if (currentResponse?.feedback) {
      const fb = currentResponse.feedback;
      setRemarks(fb.remarks || '');
      setStrengths(fb.strengths || '');
      setNeedsImprovement(fb.needsImprovement || '');
      setQuestionScore(fb.score !== null && fb.score !== undefined ? fb.score : '');
    } else {
      setRemarks('');
      setStrengths('');
      setNeedsImprovement('');
      setQuestionScore('');
    }
    setFeedbackSuccess('');
  }, [selectedQuestionIndex, currentResponse]);

  const handleSaveQuestionFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentResponse) return;
    setSavingFeedback(true);
    setFeedbackSuccess('');

    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responseId: currentResponse.id,
          remarks,
          strengths,
          needsImprovement,
          score: questionScore === '' ? undefined : Number(questionScore),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save feedback');

      setFeedbackSuccess(`Feedback saved for Question ${currentQuestion.questionNumber}`);
      fetchStudentData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingFeedback(false);
    }
  };

  const handleSaveOverallEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessment) return;
    setSavingEvaluation(true);
    setEvaluationSuccess('');

    try {
      const res = await fetch('/api/admin/evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: assessment.id,
          fluencyScore,
          grammarScore,
          pronunciationScore,
          vocabularyScore,
          confidenceScore,
          overallRemarks,
          strengths: overallStrengths,
          areasForImprovement: overallAreasForImprovement,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save overall evaluation');

      setEvaluationSuccess('Overall Assessment Evaluation successfully saved!');
      fetchStudentData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingEvaluation(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium">Loading Student Submissions...</p>
        </div>
      </div>
    );
  }

  const calculatedOverallScore = Number(
    ((fluencyScore + grammarScore + pronunciationScore + vocabularyScore + confidenceScore) / 5).toFixed(1)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Student List
          </Link>
        </div>

        {student && (
          <div className="glass-panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{student.name}</h1>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {student.studentId}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Assessment Status:{' '}
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{assessment?.status?.replace('_', ' ') || 'NOT STARTED'}</span>
              </p>
            </div>

            {assessment?.evaluation && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-right">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-semibold">Overall Evaluated Score</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {assessment.evaluation.overallScore} / 10
                </span>
              </div>
            )}
          </div>
        )}

        {/* 25 Question Navigator Bar */}
        <div className="glass-panel p-4 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {questions.map((q, idx) => {
              const resp = assessment?.responses?.find((r: any) => r.questionId === q.id);
              const hasFeedback = Boolean(resp?.feedback);
              const isSelected = idx === selectedQuestionIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestionIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : resp
                      ? hasFeedback
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                        : 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/40'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-500 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>Q{q.questionNumber}</span>
                  {hasFeedback && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Question Player & Feedback */}
        {currentQuestion && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Video Player & Prompt */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass-card space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/60 pb-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Question #{currentQuestion.questionNumber}</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{currentQuestion.category || 'General'}</span>
                </div>
                <p className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                  "{currentQuestion.promptText}"
                </p>
              </div>

              {currentResponse ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                      <Video className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Recorded Spoken Response
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      Duration: {currentResponse.durationSeconds}s
                    </span>
                  </div>
                  <AuthenticatedVideoPlayer
                    responseId={currentResponse.id}
                    publicId={currentResponse.cloudinaryPublicId}
                    fallbackUrl={currentResponse.cloudinaryUrl}
                  />
                </div>
              ) : (
                <div className="aspect-video w-full glass-card flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                  <Video className="w-12 h-12 mb-2 stroke-1" />
                  <p className="text-sm font-semibold">No response recorded for Question {currentQuestion.questionNumber}</p>
                </div>
              )}
            </div>

            {/* Right: Per-Question Feedback Form */}
            <div className="lg:col-span-5">
              <div className="glass-card space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Question #{currentQuestion.questionNumber} Feedback
                </h3>

                {feedbackSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{feedbackSuccess}</span>
                  </div>
                )}

                {currentResponse ? (
                  <form onSubmit={handleSaveQuestionFeedback} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Question Remarks
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter general remarks regarding student's response..."
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        What Student Did Well (Strengths)
                      </label>
                      <textarea
                        rows={2}
                        value={strengths}
                        onChange={(e) => setStrengths(e.target.value)}
                        placeholder="e.g. Excellent fluency and natural pace..."
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Areas to Improve
                      </label>
                      <textarea
                        rows={2}
                        value={needsImprovement}
                        onChange={(e) => setNeedsImprovement(e.target.value)}
                        placeholder="e.g. Work on past tense verb endings..."
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Question Score (Optional 1-10)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.5"
                        value={questionScore}
                        onChange={(e) => setQuestionScore(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 8"
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingFeedback}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {savingFeedback ? 'Saving Remarks...' : 'Save Question Feedback'}
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Cannot enter feedback until response is submitted by student.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Overall Evaluation Rubric Section */}
        <div className="glass-panel p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                Overall Assessment Evaluation Rubric
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Evaluate candidate performance across key language metrics and save official report.
              </p>
            </div>

            <div className="px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-semibold">Calculated Score</span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{calculatedOverallScore} / 10</span>
            </div>
          </div>

          {evaluationSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{evaluationSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSaveOverallEvaluation} className="space-y-6">
            {/* Metric Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Fluency', value: fluencyScore, setter: setFluencyScore },
                { label: 'Grammar', value: grammarScore, setter: setGrammarScore },
                { label: 'Pronunciation', value: pronunciationScore, setter: setPronunciationScore },
                { label: 'Vocabulary', value: vocabularyScore, setter: setVocabularyScore },
                { label: 'Confidence', value: confidenceScore, setter: setConfidenceScore },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{m.label}</span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">{m.value} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={m.value}
                    onChange={(e) => m.setter(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Qualitative Feedback Textareas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Overall Remarks
                </label>
                <textarea
                  required
                  rows={4}
                  value={overallRemarks}
                  onChange={(e) => setOverallRemarks(e.target.value)}
                  placeholder="Comprehensive overall remarks on student's performance..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  General Strengths
                </label>
                <textarea
                  required
                  rows={4}
                  value={overallStrengths}
                  onChange={(e) => setOverallStrengths(e.target.value)}
                  placeholder="Key strengths observed throughout the 25 questions..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Areas for Improvement
                </label>
                <textarea
                  required
                  rows={4}
                  value={overallAreasForImprovement}
                  onChange={(e) => setOverallAreasForImprovement(e.target.value)}
                  placeholder="Recommended focus areas and action items for growth..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingEvaluation}
                className="py-3 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 text-sm transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {savingEvaluation ? 'Saving Evaluation...' : 'Save & Publish Overall Evaluation'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
