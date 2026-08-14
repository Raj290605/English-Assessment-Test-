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
    <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden mt-6" id="history">
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Assessment History</h3>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <table className="w-full text-left text-sm text-slate-700 border-collapse">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-widest font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold border-b border-slate-200">Attempt</th>
              <th className="px-6 py-4 font-semibold border-b border-slate-200">Status</th>
              <th className="px-6 py-4 font-semibold border-b border-slate-200">Date</th>
              <th className="px-6 py-4 text-right font-semibold border-b border-slate-200">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assessments.map((a: any) => {
              const isViewing = a.id === currentAssessmentId;
              const isEvaluated = a.status === 'EVALUATED';
              
              return (
                <tr key={a.id} className={`transition-colors ${isViewing ? 'bg-blue-50/50' : 'hover:bg-slate-50/50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900 text-[13px]">Attempt {a.attemptNumber}</span>
                      {isViewing && (
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-100 px-2 py-0.5 rounded">Viewing Result</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-6 py-4 text-[13px] text-slate-500">
                    {new Date(a.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isEvaluated && !isViewing && (
                      <Link
                        href={`/dashboard?assessmentId=${a.id}`}
                        prefetch={false}
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
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
      <div className="md:hidden divide-y divide-slate-100">
        {assessments.map((a: any) => {
          const isViewing = a.id === currentAssessmentId;
          const isEvaluated = a.status === 'EVALUATED';
          
          return (
            <div key={a.id} className={`p-5 space-y-4 ${isViewing ? 'bg-blue-50/50' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-900 text-[13px]">Attempt {a.attemptNumber}</div>
                  <div className="text-[12px] text-slate-500 mt-1">
                    {new Date(a.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                {isViewing ? (
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-100 px-2 py-0.5 rounded">Viewing Result</span>
                ) : <div />}
                
                {isEvaluated && !isViewing && (
                  <Link
                    href={`/dashboard?assessmentId=${a.id}`}
                    prefetch={false}
                    className="flex items-center gap-1 text-[13px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
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
      default: return { color: 'bg-slate-300', text: 'Not Started' };
    }
  };
  
  const config = getStatusConfig();
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${config.color}`} />
      <span className="text-[12px] font-medium text-slate-700">{config.text}</span>
    </div>
  );
}
