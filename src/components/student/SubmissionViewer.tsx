'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowLeft, Video, CheckCircle2 } from 'lucide-react';
import { StudentVideoPlayer } from './StudentVideoPlayer';

interface SubmissionViewerProps {
  assessment: any;
  questions: any[];
  allAssessments: any[];
}

export function SubmissionViewer({ assessment, questions, allAssessments }: SubmissionViewerProps) {
  const responses: any[] = assessment.responses ?? [];
  // Sort by questionNumber
  const sortedResponses = [...responses].sort((a, b) => a.questionNumber - b.questionNumber);

  // Build a map: questionNumber → response
  const responseByQNum: Record<number, any> = {};
  sortedResponses.forEach((r) => {
    responseByQNum[r.questionNumber] = r;
  });

  // Total questions based on actual responses or questions list
  const totalCount = questions.length > 0 ? questions.length : sortedResponses.length;
  const questionNumbers = Array.from({ length: totalCount }, (_, i) => i + 1);

  const [selectedQNum, setSelectedQNum] = useState<number>(() => {
    // Start at first answered question
    return sortedResponses[0]?.questionNumber ?? 1;
  });

  const currentResponse = responseByQNum[selectedQNum];
  const currentQuestion = questions.find(
    (q) => q.questionNumber === selectedQNum || q.id === currentResponse?.questionId
  );

  const hasPrev = selectedQNum > 1;
  const hasNext = selectedQNum < totalCount;

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb/header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/my-assessments"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Submissions
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-bold text-slate-800">Attempt {assessment.attemptNumber}</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          {sortedResponses.length} video{sortedResponses.length !== 1 ? 's' : ''} submitted
          {assessment.submittedAt && (
            <> · {new Date(assessment.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5">

        {/* LEFT — Video Player + Question Info */}
        <div className="flex flex-col gap-4">

          {/* Question Info */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {selectedQNum}
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Question {selectedQNum} of {totalCount}
                </div>
                <p className="text-[14px] text-slate-800 font-medium leading-relaxed">
                  {currentQuestion
                    ? currentQuestion.promptText || currentQuestion.text || 'Question text not available'
                    : 'Question text not available'}
                </p>
              </div>
            </div>
          </div>

          {/* Video Player */}
          {currentResponse?.cloudinaryPublicId ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <StudentVideoPlayer
                responseId={currentResponse.id}
                publicId={currentResponse.cloudinaryPublicId}
                fallbackUrl={currentResponse.cloudinaryUrl}
              />
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl border border-slate-200 border-dashed flex flex-col items-center justify-center p-14 text-center">
              <Video className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-600">No recording for this question</p>
              <p className="text-xs text-slate-400 mt-1">This question was not answered in this attempt.</p>
            </div>
          )}

          {/* Prev / Next navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedQNum((n) => Math.max(1, n - 1))}
              disabled={!hasPrev}
              className="inline-flex items-center gap-2 h-10 px-5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <span className="text-sm text-slate-400 font-medium hidden sm:inline">
              {selectedQNum} / {totalCount}
            </span>

            <button
              onClick={() => setSelectedQNum((n) => Math.min(totalCount, n + 1))}
              disabled={!hasNext}
              className="inline-flex items-center gap-2 h-10 px-5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT — Question Number Grid */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-fit">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Questions</div>

          <div className="grid grid-cols-5 gap-2">
            {questionNumbers.map((qNum) => {
              const hasVideo = !!responseByQNum[qNum]?.cloudinaryPublicId;
              const isSelected = qNum === selectedQNum;

              return (
                <button
                  key={qNum}
                  onClick={() => setSelectedQNum(qNum)}
                  className={`
                    w-full aspect-square rounded-lg text-sm font-bold transition-all
                    ${isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : hasVideo
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200 border border-slate-200'
                    }
                  `}
                  title={`Question ${qNum}${hasVideo ? ' — Video recorded' : ' — No recording'}`}
                >
                  {qNum}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-emerald-50 border border-emerald-200 shrink-0" />
              Recorded
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-blue-600 shrink-0 rounded-sm" />
              Selected
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200 shrink-0" />
              No recording
            </div>
          </div>

          {/* Other attempts */}
          {allAssessments.length > 1 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Other Attempts</div>
              <div className="space-y-1.5">
                {allAssessments
                  .filter((a) => a.id !== assessment.id)
                  .map((a) => (
                    <Link
                      key={a.id}
                      href={`/dashboard/my-assessments?assessmentId=${a.id}`}
                      className="flex items-center justify-between w-full text-[12px] text-slate-600 hover:text-blue-600 font-medium py-1 transition-colors"
                    >
                      Attempt {a.attemptNumber}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
