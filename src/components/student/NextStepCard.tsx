'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play, CheckCircle2, Clock, Trophy, FileVideo } from 'lucide-react';
import { ReattemptButton } from './ReattemptButton';

interface NextStepCardProps {
  status: string;
  answeredCount: number;
  totalQuestions: number;
  assessmentId?: string | null;
  latestScore?: number | null;
}

export function NextStepCard({ status, answeredCount, totalQuestions, assessmentId, latestScore }: NextStepCardProps) {
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const remaining = totalQuestions - answeredCount;

  const config = {
    NOT_STARTED: {
      icon: <Play className="w-6 h-6 text-blue-600" />,
      iconBg: 'bg-blue-50 border-blue-100',
      badge: 'READY TO START',
      badgeBg: 'bg-blue-50 text-blue-700 border border-blue-200',
      title: 'Your assessment is ready',
      subtitle: `Complete all ${totalQuestions > 0 ? totalQuestions + ' ' : ''}questions to submit your credibility interview assessment.`,
      action: (
        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 h-11 px-7 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
        >
          Start Assessment <ArrowRight className="w-4 h-4" />
        </Link>
      ),
      accent: 'border-l-4 border-l-blue-500',
    },
    IN_PROGRESS: {
      icon: <Clock className="w-6 h-6 text-amber-600" />,
      iconBg: 'bg-amber-50 border-amber-100',
      badge: 'IN PROGRESS',
      badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200',
      title: 'Assessment in progress',
      subtitle: `${answeredCount} / ${totalQuestions} questions completed. Pick up where you left off.`,
      action: (
        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 h-11 px-7 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
        >
          Resume Assessment <ArrowRight className="w-4 h-4" />
        </Link>
      ),
      accent: 'border-l-4 border-l-amber-500',
    },
    SUBMITTED: {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      iconBg: 'bg-emerald-50 border-emerald-100',
      badge: 'SUBMITTED',
      badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      title: 'Assessment submitted',
      subtitle: 'Your responses are currently being reviewed by our evaluators.',
      action: assessmentId ? (
        <Link
          href={`/dashboard/my-assessments?assessmentId=${assessmentId}`}
          className="inline-flex items-center gap-2 h-11 px-7 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 transition-colors"
        >
          <FileVideo className="w-4 h-4" /> View My Submission
        </Link>
      ) : null,
      accent: 'border-l-4 border-l-emerald-500',
    },
    EVALUATED: {
      icon: <Trophy className="w-6 h-6 text-purple-600" />,
      iconBg: 'bg-purple-50 border-purple-100',
      badge: 'EVALUATED',
      badgeBg: 'bg-purple-50 text-purple-700 border border-purple-200',
      title: 'Assessment Evaluated',
      subtitle: 'Your latest assessment has been evaluated.',
      action: (
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/results"
            className="inline-flex items-center gap-2 h-11 px-7 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
          >
            View Results & Feedback <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="h-11 px-6 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 hover:bg-slate-50 cursor-pointer">
            <ReattemptButton compact />
          </div>
        </div>
      ),
      accent: 'border-l-4 border-l-purple-500',
      scoreDisplay: latestScore != null ? (
        <div className="flex items-baseline gap-1 mt-3 mb-1">
          <span className="text-4xl font-extrabold text-slate-900">{Math.round(latestScore)}</span>
          <span className="text-xl font-bold text-slate-400">/ 10</span>
        </div>
      ) : null,
    },
  } as Record<string, any>;

  const c = config[status] ?? config['NOT_STARTED'];

  return (
    <div className={`bg-white rounded-2xl p-7 border border-slate-200 shadow-sm ${c.accent} relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full pointer-events-none" />

      <div className="relative">
        <div className="flex items-start gap-5">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${c.iconBg}`}>
            {c.icon}
          </div>

          <div className="flex-1 min-w-0">
            <span className={`inline-block text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md mb-3 ${c.badgeBg}`}>
              {c.badge}
            </span>

            <h2 className="text-xl font-bold text-slate-900 mb-1.5">{c.title}</h2>
            {c.scoreDisplay}
            <p className="text-sm text-slate-500 mb-5 leading-relaxed">{c.subtitle}</p>

            {status === 'IN_PROGRESS' && totalQuestions > 0 && (
              <div className="mb-5 max-w-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {c.action}
          </div>
        </div>
      </div>
    </div>
  );
}
