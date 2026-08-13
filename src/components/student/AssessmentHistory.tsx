import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface AssessmentHistoryProps {
  assessments: any[];
  currentAssessmentId?: string;
}

export function AssessmentHistory({ assessments, currentAssessmentId }: AssessmentHistoryProps) {
  if (!assessments || assessments.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-6" id="history">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h3 className="text-[13px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">Assessment History</h3>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/30 text-[11px] uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-semibold border-b border-slate-200 dark:border-slate-800">Attempt</th>
              <th className="px-6 py-4 font-semibold border-b border-slate-200 dark:border-slate-800">Status</th>
              <th className="px-6 py-4 font-semibold border-b border-slate-200 dark:border-slate-800">Date</th>
              <th className="px-6 py-4 text-right font-semibold border-b border-slate-200 dark:border-slate-800">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {assessments.map((a: any) => {
              const isViewing = a.id === currentAssessmentId;
              const isEvaluated = a.status === 'EVALUATED';
              
              return (
                <tr key={a.id} className={`transition-colors ${isViewing ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900 dark:text-white text-[13px]">Attempt {a.attemptNumber}</span>
                      {isViewing && (
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">Viewing Result</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-6 py-4 text-[13px] text-slate-500 dark:text-slate-400">
                    {new Date(a.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isEvaluated && !isViewing && (
                      <Link
                        href={`/dashboard?assessmentId=${a.id}`}
                        prefetch={false}
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 transition-colors"
                      >
                        View Result <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {!isEvaluated && (
                      <span className="text-[12px] text-slate-400 italic">Pending</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {assessments.map((a: any) => {
          const isViewing = a.id === currentAssessmentId;
          const isEvaluated = a.status === 'EVALUATED';
          
          return (
            <div key={a.id} className={`p-5 space-y-4 ${isViewing ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-[13px]">Attempt {a.attemptNumber}</div>
                  <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                    {new Date(a.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                {isViewing ? (
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">Viewing Result</span>
                ) : <div />}
                
                {isEvaluated && !isViewing && (
                  <Link
                    href={`/dashboard?assessmentId=${a.id}`}
                    prefetch={false}
                    className="flex items-center gap-1 text-[13px] font-semibold text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 transition-colors"
                  >
                    View Result <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                {!isEvaluated && (
                  <span className="text-[12px] text-slate-400 italic">Pending</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = () => {
    switch(status) {
      case 'EVALUATED': return { color: 'bg-emerald-500', text: 'Evaluated' };
      case 'SUBMITTED': return { color: 'bg-blue-500', text: 'Submitted' };
      case 'IN_PROGRESS': return { color: 'bg-amber-500', text: 'In Progress' };
      default: return { color: 'bg-slate-300 dark:bg-slate-600', text: 'Not Started' };
    }
  };
  
  const config = getStatusConfig();
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${config.color}`} />
      <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300">{config.text}</span>
    </div>
  );
}
