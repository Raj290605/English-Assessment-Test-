import React from 'react';
import Link from 'next/link';
import { Video, ChevronRight, CheckCircle2, Award, FileVideo } from 'lucide-react';

interface SubmissionListProps {
  assessments: any[];
}

export function SubmissionList({ assessments }: SubmissionListProps) {
  if (!assessments || assessments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center text-center">
        <FileVideo className="w-12 h-12 text-slate-200 mb-4" />
        <h3 className="text-base font-bold text-slate-700">No submitted assessments yet</h3>
        <p className="text-sm text-slate-400 mt-1.5 max-w-sm">
          Complete and submit your assessment to see your videos here.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <p className="text-xs text-slate-500 font-medium">{assessments.length} submitted assessment{assessments.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="divide-y divide-slate-100">
        {assessments.map((a) => {
          const isEvaluated = a.status === 'EVALUATED';
          const responseCount = a._count?.responses ?? 0;

          return (
            <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors gap-4">

              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isEvaluated ? 'bg-emerald-50' : 'bg-blue-50'}`}>
                  {isEvaluated ? (
                    <Award className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-slate-900">Attempt {a.attemptNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isEvaluated ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                      {isEvaluated ? 'EVALUATED' : 'SUBMITTED'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Submitted: {a.submittedAt
                      ? new Date(a.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                      : new Date(a.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    }
                    {' · '}
                    {responseCount} response{responseCount !== 1 ? 's' : ''} submitted
                  </div>
                </div>
              </div>

              <Link
                href={`/dashboard/my-assessments?assessmentId=${a.id}`}
                className="sm:ml-auto inline-flex items-center gap-2 h-9 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-lg border border-slate-200 transition-colors shrink-0"
              >
                <Video className="w-4 h-4" /> View Submission <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
