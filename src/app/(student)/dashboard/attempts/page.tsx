import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/services/authService';
import { prisma } from '@/lib/prisma';
import { StudentDashboardShell } from '@/components/student/StudentDashboardShell';
import Link from 'next/link';
import { Clock, Video, ChevronRight, Award, CheckCircle2, AlertCircle } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  NOT_STARTED: { label: 'Not Started', color: 'text-slate-500', bg: 'bg-slate-100', icon: AlertCircle },
  IN_PROGRESS: { label: 'In Progress', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  SUBMITTED: { label: 'Submitted', color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle2 },
  EVALUATED: { label: 'Evaluated', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Award },
};

export default async function StudentAttemptsPage() {
  const session = await getSession();

  if (!session || session.role !== 'STUDENT') {
    redirect('/login');
  }

  const assessments = await prisma.assessment.findMany({
    where: { studentId: session.id },
    select: {
      id: true,
      attemptNumber: true,
      status: true,
      createdAt: true,
      submittedAt: true,
      _count: { select: { responses: true } },
    },
    orderBy: { attemptNumber: 'desc' },
  });

  return (
    <StudentDashboardShell user={session}>
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">Previous Attempts</h2>
            <p className="text-[13px] text-slate-500 mt-0.5 font-medium">
              {assessments.length} attempt{assessments.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>

        {assessments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center text-center">
            <Clock className="w-12 h-12 text-slate-200 mb-4" />
            <h3 className="text-base font-bold text-slate-700">No attempts yet</h3>
            <p className="text-sm text-slate-400 mt-1.5">Your attempt history will appear here.</p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-2 h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {assessments.map((a) => {
                const sc = statusConfig[a.status] ?? statusConfig['NOT_STARTED'];
                const StatusIcon = sc.icon;
                const isSubmittedOrEvaluated = a.status === 'SUBMITTED' || a.status === 'EVALUATED';
                const responseCount = a._count?.responses ?? 0;

                return (
                  <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 hover:bg-slate-50/60 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sc.bg}`}>
                        <StatusIcon className={`w-5 h-5 ${sc.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-bold text-slate-900">Attempt {a.attemptNumber}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${sc.bg} ${sc.color}`}>
                            {sc.label}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {new Date(a.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          {a.submittedAt && (
                            <> · Submitted {new Date(a.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</>
                          )}
                          {' · '}
                          {responseCount} response{responseCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:ml-auto">
                      {isSubmittedOrEvaluated && (
                        <Link
                          href={`/dashboard/my-assessments?assessmentId=${a.id}`}
                          className="inline-flex items-center gap-2 h-9 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-lg transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" /> View Videos
                        </Link>
                      )}
                      {(a.status === 'NOT_STARTED' || a.status === 'IN_PROGRESS') && (
                        <Link
                          href="/assessment"
                          className="inline-flex items-center gap-2 h-9 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          Continue <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </StudentDashboardShell>
  );
}
