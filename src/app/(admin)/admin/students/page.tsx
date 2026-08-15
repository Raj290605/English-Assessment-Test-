'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Search, ArrowRight, Video, CheckCircle2, ChevronDown, ChevronRight, Clock, Trash2, AlertTriangle } from 'lucide-react';
import { AdminDashboardShell } from '@/components/admin/AdminDashboardShell';
import { CreateStudentModal } from '@/components/admin/CreateStudentModal';

interface StudentAssessmentRow {
  id: string; // User DB ID
  studentId: string;
  name: string;
  assessmentId: string | null;
  attemptNumber: number;
  status: string;
  responsesCount: number;
  submittedAt: string | null;
  evaluation: { id: string; overallScore: number; updatedAt: string } | null;
}

interface GroupedStudent {
  id: string;
  studentId: string;
  name: string;
  attemptsCount: number;
  latestStatus: string;
  latestScore: number | null;
  latestActivityDate: string | null;
  attempts: StudentAssessmentRow[];
}

export default function AdminStudentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [studentsData, setStudentsData] = useState<StudentAssessmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // Delete attempt state
  const [assessmentToDelete, setAssessmentToDelete] = useState<StudentAssessmentRow | null>(null);
  const [isDeletingAttempt, setIsDeletingAttempt] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meRes.ok || meData.user?.role !== 'ADMIN') {
        router.push('/admin-login');
        return;
      }
      setUser(meData.user);

      const res = await fetch('/api/admin/students');
      if (res.ok) {
        const data = await res.json();
        setStudentsData(data.students);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Group by student
  const groupedStudents = useMemo(() => {
    const map = new Map<string, GroupedStudent>();

    for (const row of studentsData) {
      if (!map.has(row.id)) {
        map.set(row.id, {
          id: row.id,
          studentId: row.studentId,
          name: row.name,
          attemptsCount: row.assessmentId ? 1 : 0,
          latestStatus: row.status,
          latestScore: row.evaluation?.overallScore ?? null,
          latestActivityDate: row.submittedAt,
          attempts: row.assessmentId ? [row] : [],
        });
      } else {
        const existing = map.get(row.id)!;
        if (row.assessmentId) {
          existing.attemptsCount += 1;
          existing.attempts.push(row);
          
          // The API returns ordered by attemptNumber desc, so the first one we see is the latest.
          // But to be bulletproof, update latest info if this attemptNumber is higher:
          const maxAttemptNumber = Math.max(...existing.attempts.map(a => a.attemptNumber));
          if (row.attemptNumber === maxAttemptNumber) {
            existing.latestStatus = row.status;
            existing.latestScore = row.evaluation?.overallScore ?? null;
            existing.latestActivityDate = row.submittedAt;
          }
        }
      }
    }

    // Sort attempts ascending inside each student
    for (const group of map.values()) {
      group.attempts.sort((a, b) => a.attemptNumber - b.attemptNumber);
    }

    return Array.from(map.values());
  }, [studentsData]);

  // Filter top-level students
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return groupedStudents;
    const q = searchQuery.toLowerCase();
    return groupedStudents.filter(
      (s) => s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q)
    );
  }, [groupedStudents, searchQuery]);

  const toggleExpand = (studentId: string) => {
    setExpandedStudentId(prev => (prev === studentId ? null : studentId));
  };

  const handleDeleteAttempt = async () => {
    if (!assessmentToDelete || !assessmentToDelete.assessmentId) return;
    setIsDeletingAttempt(true);
    setDeleteError(null);
    setDeleteSuccess(null);

    try {
      const res = await fetch(`/api/admin/assessments/${assessmentToDelete.assessmentId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete assessment');

      setDeleteSuccess(`Attempt #${assessmentToDelete.attemptNumber} deleted. Remaining attempts have been renumbered.`);
      setAssessmentToDelete(null);
      await loadData();
    } catch (err: any) {
      setDeleteError(err.message);
      await loadData();
    } finally {
      setIsDeletingAttempt(false);
    }
  };

  const renderStatusBadge = (status: string, isAttemptRow: boolean = false) => {
    if (status === 'EVALUATED') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold bg-green-50 border border-green-200 text-green-700 ${isAttemptRow ? 'text-[10px]' : 'text-[11px]'}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          Evaluated
        </span>
      );
    }
    if (status === 'SUBMITTED') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold bg-blue-50 border border-blue-200 text-blue-700 ${isAttemptRow ? 'text-[10px]' : 'text-[11px]'}`}>
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          Ready for Review
        </span>
      );
    }
    if (status === 'IN_PROGRESS') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold bg-amber-50 border border-amber-200 text-amber-700 ${isAttemptRow ? 'text-[10px]' : 'text-[11px]'}`}>
          <Video className="w-3.5 h-3.5 text-amber-500" />
          In Progress
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-medium bg-slate-100 border border-slate-200 text-slate-500 ${isAttemptRow ? 'text-[10px]' : 'text-[11px]'}`}>
        Not Started
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Loading students…</p>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboardShell user={user}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-slate-900 leading-tight">
            Students
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Manage your registered students and their assessments.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-[13px] font-semibold transition-colors shadow-sm shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* ── Student List ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3 font-semibold w-10"></th>
                  <th className="px-2 py-3 font-semibold">Student</th>
                  <th className="px-5 py-3 font-semibold">ID</th>
                  <th className="px-5 py-3 font-semibold">Attempts</th>
                  <th className="px-5 py-3 font-semibold">Latest Status</th>
                  <th className="px-5 py-3 font-semibold">Latest Score</th>
                  <th className="px-5 py-3 font-semibold text-right">Latest Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const isExpanded = expandedStudentId === student.id;
                  
                  return (
                    <React.Fragment key={student.id}>
                      {/* Top Level Row */}
                      <tr 
                        className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${isExpanded ? 'bg-slate-50/80' : ''}`}
                        onClick={() => toggleExpand(student.id)}
                        aria-expanded={isExpanded}
                      >
                        <td className="pl-4 pr-2 py-3.5">
                          <button 
                            className="p-1 rounded hover:bg-slate-200 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            aria-label={isExpanded ? "Collapse attempts" : "Expand attempts"}
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="px-2 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#0D2342] text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                              {student.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                            </div>
                            <span className="text-[13px] font-semibold text-slate-900">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">
                          {student.studentId}
                        </td>
                        <td className="px-5 py-3.5 text-[13px] text-slate-700 font-medium">
                          {student.attemptsCount} Attempt{student.attemptsCount !== 1 ? 's' : ''}
                        </td>
                        <td className="px-5 py-3.5">
                          {renderStatusBadge(student.latestStatus)}
                        </td>
                        <td className="px-5 py-3.5 text-[13px] font-mono font-bold text-slate-700">
                          {student.latestScore !== null ? `${student.latestScore} / 10` : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-[12px] text-slate-500 text-right">
                          {student.latestActivityDate 
                            ? new Date(student.latestActivityDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) 
                            : '—'}
                        </td>
                      </tr>

                      {/* Expandable Child Area */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={7} className="p-0 border-b border-slate-200">
                            <div className="px-14 py-4 animate-in slide-in-from-top-2 fade-in duration-200">
                              {student.attempts.length > 0 ? (
                                <div className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
                                  <table className="w-full text-left">
                                    <tbody className="divide-y divide-slate-100">
                                      {student.attempts.map((attempt) => (
                                        <tr key={attempt.assessmentId} className="hover:bg-slate-50/50 transition-colors">
                                          <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                                              <span className="text-[13px] font-semibold text-slate-700">
                                                Attempt {attempt.attemptNumber}
                                              </span>
                                            </div>
                                          </td>
                                          <td className="px-4 py-3">
                                            {renderStatusBadge(attempt.status, true)}
                                          </td>
                                          <td className="px-4 py-3 text-[12px] text-slate-500">
                                            {attempt.responsesCount} responses
                                          </td>
                                          <td className="px-4 py-3 text-[12px] text-slate-500">
                                            {attempt.submittedAt 
                                              ? new Date(attempt.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                                              : '—'}
                                          </td>
                                          <td className="px-4 py-3 text-[13px] font-mono font-bold text-slate-700">
                                            {attempt.evaluation?.overallScore !== undefined && attempt.evaluation?.overallScore !== null ? `${attempt.evaluation.overallScore} / 10` : '—'}
                                          </td>
                                          <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                              {attempt.status === 'SUBMITTED' ? (
                                                <Link
                                                  href={`/admin/students/${student.id}?assessmentId=${attempt.assessmentId}`}
                                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A8A] text-white hover:bg-blue-800 rounded-lg text-[11px] font-bold transition-all shadow-sm"
                                                >
                                                  Review &rarr;
                                                </Link>
                                              ) : attempt.status === 'EVALUATED' || attempt.evaluation ? (
                                                <Link
                                                  href={`/admin/students/${student.id}?assessmentId=${attempt.assessmentId}`}
                                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-[11px] font-bold transition-all shadow-sm"
                                                >
                                                  View Evaluation &rarr;
                                                </Link>
                                              ) : (
                                                <span className="text-[11px] text-slate-400 italic">Not ready</span>
                                              )}
                                              {/* Delete button — hidden for IN_PROGRESS */}
                                              {attempt.status !== 'IN_PROGRESS' && attempt.assessmentId && (
                                                <button
                                                  onClick={(e) => { e.stopPropagation(); setDeleteError(null); setDeleteSuccess(null); setAssessmentToDelete(attempt); }}
                                                  title={`Delete Attempt #${attempt.attemptNumber}`}
                                                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                                                  aria-label={`Delete Attempt ${attempt.attemptNumber}`}
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-[12px] text-slate-500 italic py-2">
                                  No attempts yet.
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="text-[14px] font-semibold text-slate-800 mb-1">No students found</h3>
            <p className="text-[13px] text-slate-500">
              {searchQuery ? `No results matching "${searchQuery}"` : "You haven't added any students yet."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[12px] font-semibold transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Add Student
              </button>
            )}
          </div>
        )}
      </div>

      <CreateStudentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadData}
      />

      {/* ── Delete Attempt Confirmation Modal ─────────────────────────────── */}
      {assessmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => { if (!isDeletingAttempt) { setAssessmentToDelete(null); setDeleteError(null); } }}
          />
          {/* Dialog */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-slate-900">
                  Delete Attempt #{assessmentToDelete.attemptNumber}?
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            {/* Attempt details */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Student</span>
                <span className="font-semibold text-slate-800">
                  {/* Find student name from grouped data */}
                  {groupedStudents.find(s => s.attempts.some(a => a.assessmentId === assessmentToDelete.assessmentId))?.name ?? '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Attempt</span>
                <span className="font-semibold text-slate-800">#{assessmentToDelete.attemptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="font-semibold text-slate-800">{assessmentToDelete.status.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Score</span>
                <span className="font-semibold text-slate-800">
                  {assessmentToDelete.evaluation?.overallScore != null ? `${assessmentToDelete.evaluation.overallScore} / 10` : '—'}
                </span>
              </div>
              {assessmentToDelete.submittedAt && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Submitted</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(assessmentToDelete.submittedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>

            {/* Warning text */}
            <p className="text-[12px] text-slate-600 leading-relaxed">
              This will permanently delete this assessment attempt, including its responses,
              recording references, evaluation, and feedback.
              Any remaining attempts will be automatically renumbered.
            </p>

            {/* Error message */}
            {deleteError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[12px] flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{deleteError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={() => { setAssessmentToDelete(null); setDeleteError(null); }}
                disabled={isDeletingAttempt}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAttempt}
                disabled={isDeletingAttempt}
                className="px-4 py-2 rounded-xl text-[13px] font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isDeletingAttempt ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Deleting…</>
                ) : (
                  <><Trash2 className="w-3.5 h-3.5" />Delete Attempt</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Toast ────────────────────────────────────────────────── */}
      {deleteSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 bg-emerald-700 text-white rounded-xl shadow-lg text-[13px] font-semibold animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {deleteSuccess}
          <button onClick={() => setDeleteSuccess(null)} className="ml-2 opacity-70 hover:opacity-100">✕</button>
        </div>
      )}
    </AdminDashboardShell>
  );
}
