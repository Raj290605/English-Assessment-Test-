'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Video, CheckCircle2, ChevronDown, ChevronRight, Clock, Filter } from 'lucide-react';
import { AdminDashboardShell } from '@/components/admin/AdminDashboardShell';

interface StudentAssessmentRow {
  id: string;
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

type FilterMode = 'all' | 'ready' | 'evaluated' | 'in_progress';

export default function AdminAssessmentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [assessmentsData, setAssessmentsData] = useState<StudentAssessmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('ready');
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meRes.ok || meData.user?.role !== 'ADMIN') {
        router.push('/admin-login');
        return;
      }
      setUser(meData.user);

      // Reusing the same endpoint, but we'll filter client-side for "Assessments" focus
      const res = await fetch('/api/admin/students');
      if (res.ok) {
        const data = await res.json();
        setAssessmentsData(data.students);
      }
    } catch (err) {
      console.error('Failed to load assessments:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Group by student and apply filterMode
  const groupedStudents = useMemo(() => {
    const map = new Map<string, GroupedStudent>();

    // 1. First group everything
    for (const row of assessmentsData) {
      if (!row.assessmentId) continue; // Only care about students with at least 1 attempt

      if (!map.has(row.id)) {
        map.set(row.id, {
          id: row.id,
          studentId: row.studentId,
          name: row.name,
          attemptsCount: 1,
          latestStatus: row.status,
          latestScore: row.evaluation?.overallScore ?? null,
          latestActivityDate: row.submittedAt,
          attempts: [row],
        });
      } else {
        const existing = map.get(row.id)!;
        existing.attemptsCount += 1;
        existing.attempts.push(row);
        
        const maxAttemptNumber = Math.max(...existing.attempts.map(a => a.attemptNumber));
        if (row.attemptNumber === maxAttemptNumber) {
          existing.latestStatus = row.status;
          existing.latestScore = row.evaluation?.overallScore ?? null;
          existing.latestActivityDate = row.submittedAt;
        }
      }
    }

    // 2. Sort attempts and filter based on FilterMode
    const result: GroupedStudent[] = [];
    for (const group of map.values()) {
      group.attempts.sort((a, b) => a.attemptNumber - b.attemptNumber);

      // Filter attempts
      let matchingAttempts = group.attempts;
      if (filterMode === 'ready') {
        matchingAttempts = group.attempts.filter(a => a.status === 'SUBMITTED');
      } else if (filterMode === 'evaluated') {
        matchingAttempts = group.attempts.filter(a => a.status === 'EVALUATED');
      } else if (filterMode === 'in_progress') {
        matchingAttempts = group.attempts.filter(a => a.status === 'IN_PROGRESS');
      }

      // Only include the student if they have AT LEAST ONE matching attempt
      if (matchingAttempts.length > 0) {
        // Overwrite attempts with only matching ones to keep UI clean
        // We still keep the original attemptsCount, latestStatus, etc. so the top row doesn't lie
        // about the student's overall state, but the expanded area only shows relevant items.
        result.push({
          ...group,
          attempts: matchingAttempts
        });
      }
    }

    return result;
  }, [assessmentsData, filterMode]);

  // Filter top-level by search
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
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold bg-amber-50 border border-amber-200 text-amber-700 ${isAttemptRow ? 'text-[10px]' : 'text-[11px]'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
          Ready for Review
        </span>
      );
    }
    if (status === 'IN_PROGRESS') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold bg-slate-100 border border-slate-300 text-slate-700 ${isAttemptRow ? 'text-[10px]' : 'text-[11px]'}`}>
          <Video className="w-3.5 h-3.5 text-slate-500" />
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
          <p className="text-sm text-slate-500 font-medium">Loading assessments…</p>
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
            Assessments
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Review submissions and grade assessments.
          </p>
        </div>
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'ready', label: 'Ready for Review' },
            { id: 'evaluated', label: 'Evaluated' },
            { id: 'in_progress', label: 'In Progress' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterMode(tab.id as FilterMode);
                setExpandedStudentId(null);
              }}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all ${
                filterMode === tab.id
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
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

      {/* ── Assessment List ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3 font-semibold w-10"></th>
                  <th className="px-2 py-3 font-semibold">Student</th>
                  <th className="px-5 py-3 font-semibold">ID</th>
                  <th className="px-5 py-3 font-semibold">Overall Latest Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Matching Attempts</th>
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
                        <td className="px-5 py-3.5">
                          {renderStatusBadge(student.latestStatus)}
                        </td>
                        <td className="px-5 py-3.5 text-[13px] font-bold text-slate-700 text-right">
                          {student.attempts.length} {filterMode !== 'all' ? 'matching' : ''} attempt{student.attempts.length !== 1 ? 's' : ''}
                        </td>
                      </tr>

                      {/* Expandable Child Area */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={5} className="p-0 border-b border-slate-200">
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
                                            {attempt.status === 'SUBMITTED' ? (
                                              <Link
                                                href={`/admin/students/${student.id}?assessmentId=${attempt.assessmentId}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] text-white hover:bg-blue-700 rounded-lg text-[11px] font-bold transition-all shadow-sm"
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
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : null}
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
              {filterMode === 'ready' ? <Clock className="w-5 h-5 text-amber-500" /> : <Filter className="w-5 h-5 text-slate-400" />}
            </div>
            <h3 className="text-[14px] font-semibold text-slate-800 mb-1">
              {filterMode === 'ready' ? "You're all caught up" : "No assessments found"}
            </h3>
            <p className="text-[13px] text-slate-500">
              {searchQuery ? `No results matching "${searchQuery}"` : 
               filterMode === 'ready' ? "No assessments are waiting for review." : 
               "Adjust the filters or wait for students to complete an assessment."}
            </p>
          </div>
        )}
      </div>
    </AdminDashboardShell>
  );
}
