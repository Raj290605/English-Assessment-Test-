'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { ShieldCheck, Search, Filter, CheckCircle2, Clock, Award, ArrowRight, UserCheck, UserPlus, Trash2 } from 'lucide-react';
import { CreateStudentModal } from '@/components/admin/CreateStudentModal';

interface StudentListItem {
  id: string;
  studentId: string;
  name: string;
  assessmentId: string | null;
  status: string;
  responsesCount: number;
  submittedAt: string | null;
  evaluation: {
    id: string;
    overallScore: number | null;
  } | null;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadAdminData = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meRes.ok || meData.user?.role !== 'ADMIN') {
        router.push('/admin-login');
        return;
      }
      setUser(meData.user);

      const res = await fetch('/api/admin/students');
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!window.confirm(`Are you sure you want to delete the record for ${studentName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      if (res.ok) {
        // Remove student from the list locally to avoid reloading the whole page
        setStudents((prev) => prev.filter((s) => s.id !== studentId));
      } else {
        alert(data.error || 'Failed to delete student.');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('An unexpected error occurred while deleting the student.');
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === 'ALL') return matchesSearch;
    if (filterStatus === 'SUBMITTED') return matchesSearch && s.status === 'SUBMITTED';
    if (filterStatus === 'EVALUATED') return matchesSearch && s.status === 'EVALUATED';
    if (filterStatus === 'IN_PROGRESS') return matchesSearch && (s.status === 'IN_PROGRESS' || s.status === 'NOT_STARTED');
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium">Loading Evaluator Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Admin Header */}
        <div className="glass-panel p-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-600/10 blur-3xl rounded-full pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Evaluator Command Center
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Admin Evaluation Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Review student 20-question speaking recordings, enter question remarks, and evaluate scoring rubrics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/20 border border-emerald-500/30 shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                Add New Student
              </button>
              <div className="p-4 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Total Candidates</span>
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">{students.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Submissions Ready</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {students.filter((s) => s.status === 'SUBMITTED' || s.status === 'EVALUATED').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Controls Bar */}
        <div className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Student ID or Name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto max-w-full">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
            {[
              { id: 'ALL', label: 'All Students' },
              { id: 'SUBMITTED', label: 'Ready for Review' },
              { id: 'EVALUATED', label: 'Evaluated' },
              { id: 'IN_PROGRESS', label: 'In Progress' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterStatus === f.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Student Table List */}
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student Name & ID</th>
                  <th className="px-6 py-4">Assessment Status</th>
                  <th className="px-6 py-4">Responses</th>
                  <th className="px-6 py-4">Submitted At</th>
                  <th className="px-6 py-4">Overall Score</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                      No student assessments found matching filter parameters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{s.studentId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          s.status === 'EVALUATED'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : s.status === 'SUBMITTED'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : s.status === 'IN_PROGRESS'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                        }`}>
                          {s.status === 'EVALUATED' && <Award className="w-3.5 h-3.5" />}
                          {s.status === 'SUBMITTED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {s.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {s.responsesCount} / 20
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {s.evaluation?.overallScore ? (
                          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-extrabold text-sm border border-emerald-500/20">
                            {s.evaluation.overallScore} / 10
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500 italic">Not graded</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDeleteStudent(s.id, s.name)}
                            className="inline-flex items-center gap-1.5 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 text-red-600 dark:text-red-400 font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:border-red-500 text-xs transition-all shadow-sm hover:shadow-red-500/20"
                            title="Delete Student Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/admin/students/${s.id}`}
                            className="inline-flex items-center gap-1.5 py-2 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-xs transition-all shadow-sm hover:shadow-emerald-500/20"
                          >
                            Review & Grade
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <CreateStudentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadAdminData}
      />
    </div>
  );
}
