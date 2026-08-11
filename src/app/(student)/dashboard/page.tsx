import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/services/authService';
import { getStudentAssessmentDetails } from '@/lib/services/assessmentService';
import { Navbar } from '@/components/common/Navbar';
import { Mic, CheckCircle2, Play, Clock, Video, ShieldAlert, Award, History } from 'lucide-react';
import { ReattemptButton } from '@/components/student/ReattemptButton';

export default async function StudentDashboardPage(props: any) {
  const searchParams = await props.searchParams;
  const assessmentId = searchParams?.assessmentId;
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') {
    redirect('/login');
  }

  let assessmentDetails: { assessment: any; assessments: any[]; questions: any[] } = {
    assessment: { status: 'NOT_STARTED', responses: [] },
    assessments: [],
    questions: [],
  };

  try {
    assessmentDetails = await getStudentAssessmentDetails(session.id, assessmentId);
  } catch (err) {
    console.error('Failed to load assessment details:', err);
  }

  const { assessment, assessments, questions } = assessmentDetails;
  const totalQuestions = questions && questions.length > 0 ? questions.length : 20;
  const answeredCount = assessment?.responses ? assessment.responses.length : 0;
  const status = assessment?.status || 'NOT_STARTED';
  const isSubmitted = status === 'SUBMITTED' || status === 'EVALUATED';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar user={session} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="glass-panel p-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Speaking Evaluation
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome, {session.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Student ID: <span className="font-mono text-slate-800 dark:text-slate-200">{session.studentId}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${status === 'EVALUATED'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : isSubmitted
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                  : status === 'IN_PROGRESS'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
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
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Assessment Progress</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">20 Spoken Response Questions</p>
              </div>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                {answeredCount} / {totalQuestions}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-3 p-0.5 border border-slate-300 dark:border-slate-700/80 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-blue-500/50"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-lg bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Questions Completed</span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{answeredCount} questions</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Questions Remaining</span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{totalQuestions - answeredCount} questions</span>
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
              <>
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-300 text-sm flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 shrink-0 text-blue-500 dark:text-blue-400" />
                  <div>
                    <span className="font-semibold block">Assessment Complete</span>
                    Your video responses have been submitted securely for evaluator grading.
                  </div>
                </div>
                <ReattemptButton />
              </>
            )}
          </div>

          {/* Quick Guide Card */}
          <div className="glass-card space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              Instructions
            </h3>
            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                Allow camera and microphone access when prompted by browser.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                Read each prompt and record a spoken response.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                Review your video playback and re-record if needed before saving.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 mt-0.5">4</span>
                Your progress is auto-saved. Complete all 20 questions to submit.
              </li>
            </ul>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Do not refresh or close tab while active recording or upload is in progress.</span>
            </div>
          </div>
        </div>

        {/* Evaluation Results Section */}
        {status === 'EVALUATED' && assessment?.evaluation && (
          <div className="glass-panel p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                Evaluation Results
              </h2>
              <div className="text-right">
                <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  {assessment.evaluation.overallScore}<span className="text-lg text-slate-500">/100</span>
                </div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Overall Score
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-xl font-bold text-slate-900 dark:text-white">{assessment.evaluation.fluencyScore}/20</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Fluency</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-xl font-bold text-slate-900 dark:text-white">{assessment.evaluation.grammarScore}/20</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Grammar</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-xl font-bold text-slate-900 dark:text-white">{assessment.evaluation.pronunciationScore}/20</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Pronunciation</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-xl font-bold text-slate-900 dark:text-white">{assessment.evaluation.vocabularyScore}/20</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Vocabulary</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-xl font-bold text-slate-900 dark:text-white">{assessment.evaluation.confidenceScore}/20</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Confidence</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Strengths
                </h3>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                  {assessment.evaluation.strengths || 'No specific strengths recorded.'}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Areas for Improvement
                </h3>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                  {assessment.evaluation.areasForImprovement || 'No specific areas for improvement recorded.'}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Overall Remarks
              </h3>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                {assessment.evaluation.overallRemarks || 'No overall remarks provided.'}
              </div>
            </div>

            {/* Question-level feedback */}
            {assessment.responses && assessment.responses.some((r: any) => r.feedback) && (
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Question Feedback</h3>
                <div className="space-y-4">
                  {assessment.responses
                    .filter((r: any) => r.feedback)
                    .sort((a: any, b: any) => a.questionNumber - b.questionNumber)
                    .map((r: any) => (
                      <div key={r.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">Question {r.questionNumber}</span>
                          {r.feedback.score !== null && (
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                              Score: {r.feedback.score}/10
                            </span>
                          )}
                        </div>

                        {r.feedback.remarks && (
                          <div>
                            <span className="text-xs font-semibold text-slate-500 block mb-1">Remarks:</span>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{r.feedback.remarks}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {r.feedback.strengths && (
                            <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10 text-xs">
                              <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">Strengths:</span>
                              <span className="text-slate-600 dark:text-slate-400">{r.feedback.strengths}</span>
                            </div>
                          )}
                          {r.feedback.needsImprovement && (
                            <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/10 text-xs">
                              <span className="font-semibold text-amber-700 dark:text-amber-400 block mb-1">Needs Improvement:</span>
                              <span className="text-slate-600 dark:text-slate-400">{r.feedback.needsImprovement}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Assessment History Section */}
        {assessments && assessments.length > 0 && (
          <div className="glass-panel p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              Assessment History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Attempt</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
                  {assessments.map((a: any) => (
                    <tr key={a.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        Attempt {a.attemptNumber} {a.id === assessment?.id ? '(Currently Viewing)' : ''}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${a.status === 'EVALUATED'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : a.status === 'SUBMITTED'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : a.status === 'IN_PROGRESS'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                          }`}>
                          {a.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {a.status === 'EVALUATED' ? (
                          a.id === assessment?.id ? (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                              Viewing Result
                            </span>
                          ) : (
                            <Link
                              href={`/dashboard?assessmentId=${a.id}`}
                              prefetch={false}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                            >
                              View Result
                            </Link>
                          )
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                            No Evaluation
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
