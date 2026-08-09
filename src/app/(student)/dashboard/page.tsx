import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/services/authService';
import { getStudentAssessmentDetails } from '@/lib/services/assessmentService';
import { Navbar } from '@/components/common/Navbar';
import { Mic, CheckCircle2, Play, Clock, Video, ShieldAlert, Award } from 'lucide-react';

export default async function StudentDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') {
    redirect('/login');
  }

  let assessmentDetails: { assessment: any; questions: any[] } = {
    assessment: { status: 'NOT_STARTED', responses: [] },
    questions: [],
  };

  try {
    assessmentDetails = await getStudentAssessmentDetails(session.id);
  } catch (err) {
    console.error('Failed to load assessment details:', err);
  }

  const { assessment, questions } = assessmentDetails;
  const totalQuestions = questions && questions.length > 0 ? questions.length : 25;
  const answeredCount = assessment?.responses ? assessment.responses.length : 0;
  const status = assessment?.status || 'NOT_STARTED';
  const isSubmitted = status === 'SUBMITTED' || status === 'EVALUATED';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar user={session} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="glass-panel p-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Speaking Evaluation
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Welcome, {session.name}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Student ID: <span className="font-mono text-slate-200">{session.studentId}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                status === 'EVALUATED'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : isSubmitted
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  : status === 'IN_PROGRESS'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {isSubmitted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                Status: {status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Assessment Progress Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Assessment Progress</h2>
                <p className="text-xs text-slate-400 mt-0.5">25 Spoken Response Questions</p>
              </div>
              <span className="text-2xl font-black text-blue-400 font-mono">
                {answeredCount} / {totalQuestions}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-700/80 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-blue-500/50"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block">Questions Completed</span>
                <span className="text-lg font-bold text-slate-200">{answeredCount} questions</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block">Questions Remaining</span>
                <span className="text-lg font-bold text-slate-200">{totalQuestions - answeredCount} questions</span>
              </div>
            </div>

            {!isSubmitted ? (
              <Link
                href="/assessment"
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
              >
                <Play className="w-5 h-5 fill-current" />
                {answeredCount > 0 ? `Resume Assessment (Question ${answeredCount + 1})` : 'Start Assessment'}
              </Link>
            ) : (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 shrink-0 text-blue-400" />
                <div>
                  <span className="font-semibold block">Assessment Complete</span>
                  Your 25 video responses have been submitted securely for evaluator grading.
                </div>
              </div>
            )}
          </div>

          {/* Quick Guide Card */}
          <div className="glass-card space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-400" />
              Instructions
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                Allow camera and microphone access when prompted by browser.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                Read each prompt and record a spoken response.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                Review your video playback and re-record if needed before saving.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center font-bold shrink-0 mt-0.5">4</span>
                Your progress is auto-saved. Complete all 25 questions to submit.
              </li>
            </ul>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Do not refresh or close tab while active recording or upload is in progress.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
