'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  UserPlus,
  Video,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  ChevronDown,
  Shield,
} from 'lucide-react';
import { AdminDashboardShell } from '@/components/admin/AdminDashboardShell';
import { CreateStudentModal } from '@/components/admin/CreateStudentModal';
import { CreateAdminModal } from '@/components/admin/CreateAdminModal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalStudents: number;
  pendingReview: number;
  evaluated: number;
  inProgress: number;
  pendingList: PendingItem[];
  recentActivity: ActivityItem[];
}

interface PendingItem {
  assessmentId: string;
  studentDbId: string;
  studentId: string;
  studentName: string;
  attemptNumber: number;
  submittedAt: string | null;
  responsesCount: number;
}

interface ActivityItem {
  type: 'evaluated' | 'submitted' | 'student_added';
  studentName: string;
  studentId: string;
  timestamp: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns a compact relative or absolute date label. */
function formatSubmittedAt(iso: string | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  const timeStr = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  if (diffDays === 0) return `Today · ${timeStr}`;
  if (diffDays === 1) return `Yesterday · ${timeStr}`;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

/** Returns relative label like "10:42 AM", "Yesterday", or "Aug 12". */
function formatActivityTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** Generates 1–2 char initials from a full name. */
function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/** Greeting based on hour. */
function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** A single pending assessment row — inbox/task style. */
function PendingEvaluationItem({ item }: { item: PendingItem }) {
  const href = `/admin/students/${item.studentDbId}?assessmentId=${item.assessmentId}`;

  return (
    <div className="flex items-center gap-4 py-4 px-5 hover:bg-slate-50/80 transition-colors group border-b border-slate-100 last:border-b-0">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#0D2342] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
        {initials(item.studentName)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[14px] font-semibold text-slate-900 leading-tight">
            {item.studentName}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-[12px] text-slate-500 flex-wrap">
          <span className="font-mono">{item.studentId}</span>
          <span className="text-slate-300">·</span>
          <span>Attempt {item.attemptNumber}</span>
          <span className="text-slate-300">·</span>
          <span>{formatSubmittedAt(item.submittedAt)}</span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1">
            <Video className="w-3 h-3 text-slate-400" />
            {item.responsesCount} responses
          </span>
        </div>
      </div>

      {/* Status + action */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 border border-amber-200 text-amber-700">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
          Ready for Review
        </span>

        <Link
          href={href}
          className="flex items-center gap-1 text-[13px] font-semibold text-[#2563EB] hover:text-blue-800 transition-colors whitespace-nowrap group-hover:underline"
        >
          Review
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

/** Empty state when no assessments are pending. */
function NoPendingState() {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-8 text-center">
      <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-4">
        <CheckCircle2 className="w-6 h-6 text-green-600" />
      </div>
      <p className="text-[15px] font-semibold text-slate-800">You're all caught up</p>
      <p className="text-[13px] text-slate-500 mt-1 mb-5">
        No assessments are waiting for review.
      </p>
      <Link
        href="/admin/students"
        className="text-[13px] font-semibold text-[#2563EB] hover:text-blue-800 transition-colors flex items-center gap-1"
      >
        View all students
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

/** Activity icon per event type. */
function ActivityIcon({ type }: { type: ActivityItem['type'] }) {
  const base = 'w-7 h-7 rounded-full flex items-center justify-center shrink-0';
  if (type === 'evaluated')
    return (
      <div className={`${base} bg-green-50 border border-green-200`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
      </div>
    );
  if (type === 'submitted')
    return (
      <div className={`${base} bg-blue-50 border border-blue-200`}>
        <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
      </div>
    );
  return (
    <div className={`${base} bg-slate-100 border border-slate-200`}>
      <UserPlus className="w-3.5 h-3.5 text-slate-600" />
    </div>
  );
}

/** Activity label per event type. */
function activityLabel(type: ActivityItem['type']): string {
  if (type === 'evaluated') return 'Evaluation completed';
  if (type === 'submitted') return 'Assessment submitted';
  return 'Student added';
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      // Auth check
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meRes.ok || meData.user?.role !== 'ADMIN') {
        router.push('/admin-login');
        return;
      }
      setUser(meData.user);

      // Dashboard stats
      const statsRes = await fetch('/api/admin/dashboard-stats');
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (err) {
      console.error('[AdminDashboard] load error:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const s = stats;
  const totalPending = s?.pendingReview ?? 0;
  const submittedToday = s?.pendingList?.filter((p) => {
    if (!p.submittedAt) return false;
    const d = new Date(p.submittedAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length ?? 0;

  return (
    <AdminDashboardShell user={user}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-7">
        {/* Left: Greeting */}
        <div>
          <h1 className="text-[24px] font-bold text-slate-900 leading-tight">
            {greeting()}, {user?.name?.split(' ')[0] || 'Admin'} 👋
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Here&apos;s what needs your attention today.
          </p>
        </div>

        {/* Right: Actions + Avatar */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notification bell */}
          <button className="relative p-2 text-slate-500 hover:bg-white rounded-full border border-slate-200 transition-colors bg-white shadow-sm">
            <Bell className="w-4 h-4" />
          </button>

          {/* Admin avatar */}
          <div className="hidden sm:flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name ? initials(user.name) : 'AD'}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[12px] font-semibold text-slate-800">
                {user?.name || 'Admin'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Administrator
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </div>

          {/* Add Admin button */}
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-[13px] font-semibold transition-colors shadow-sm"
          >
            <Shield className="w-4 h-4 text-[#2563EB]" />
            <span className="hidden sm:inline">Add Admin</span>
            <span className="sm:hidden">Admin</span>
          </button>

          {/* Add Student button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-[13px] font-semibold transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Student</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* ── Status Strip ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 mb-6 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Students */}
          <div className="flex flex-col gap-0.5 sm:border-r sm:border-slate-100 sm:pr-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Students
            </span>
            <span className="text-[22px] font-bold text-slate-900 font-mono leading-none">
              {s?.totalStudents ?? '—'}
            </span>
          </div>

          {/* Pending Review — amber emphasis */}
          <div className="flex flex-col gap-0.5 sm:border-r sm:border-slate-100 sm:pr-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              Pending Review
            </span>
            <span className="text-[22px] font-bold text-amber-600 font-mono leading-none">
              {s?.pendingReview ?? '—'}
            </span>
          </div>

          {/* Evaluated */}
          <div className="flex flex-col gap-0.5 sm:border-r sm:border-slate-100 sm:pr-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Evaluated
            </span>
            <span className="text-[22px] font-bold text-slate-900 font-mono leading-none">
              {s?.evaluated ?? '—'}
            </span>
          </div>

          {/* In Progress */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              In Progress
            </span>
            <span className="text-[22px] font-bold text-slate-900 font-mono leading-none">
              {s?.inProgress ?? '—'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Needs Your Attention ──────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6 overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <Video className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[14px] font-bold text-slate-900 uppercase tracking-wider">
                  Needs Your Attention
                </h2>
                {totalPending > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                    {totalPending} pending
                  </span>
                )}
              </div>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Assessments waiting for your evaluation
              </p>
            </div>
          </div>

          {totalPending > 0 && (
            <Link
              href="/admin/students"
              className="flex items-center gap-1 text-[13px] font-semibold text-[#2563EB] hover:text-blue-800 transition-colors shrink-0"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Sub-header count line */}
        {totalPending > 0 && (
          <div className="px-5 py-2.5 bg-slate-50/60 border-b border-slate-100 flex items-center gap-2 text-[12px] text-slate-500">
            <span className="font-semibold text-slate-700">
              {totalPending} {totalPending === 1 ? 'assessment' : 'assessments'} waiting
            </span>
            {submittedToday > 0 && (
              <>
                <span className="text-slate-300">·</span>
                <span>{submittedToday} submitted today</span>
              </>
            )}
          </div>
        )}

        {/* Pending list */}
        {s && s.pendingList.length > 0 ? (
          <div>
            {s.pendingList.map((item) => (
              <PendingEvaluationItem key={item.assessmentId} item={item} />
            ))}
          </div>
        ) : (
          <NoPendingState />
        )}
      </div>

      {/* ── Secondary columns: Recent Activity + Assessment Status ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-6">

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
              Recent Activity
            </h3>
            <Link
              href="/admin/students"
              className="text-[12px] font-semibold text-[#2563EB] hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {s && s.recentActivity.length > 0 ? (
              s.recentActivity.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                  <ActivityIcon type={ev.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-slate-800 leading-tight truncate">
                      {activityLabel(ev.type)}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-mono truncate">
                      {ev.studentName}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {formatActivityTime(ev.timestamp)}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-[13px] text-slate-400">
                No recent activity yet.
              </div>
            )}
          </div>
        </div>

        {/* Assessment Status */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
              Assessment Status
            </h3>
          </div>

          <div className="px-5 py-4 space-y-4">
            {/* Evaluated */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[13px] text-slate-700">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                Evaluated
              </div>
              <span className="text-[15px] font-bold text-slate-900 font-mono">
                {s?.evaluated ?? '—'}
              </span>
            </div>

            {/* Pending Review */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[13px] text-slate-700">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                Pending Review
              </div>
              <span className="text-[15px] font-bold text-amber-600 font-mono">
                {s?.pendingReview ?? '—'}
              </span>
            </div>

            {/* In Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[13px] text-slate-700">
                <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                In Progress
              </div>
              <span className="text-[15px] font-bold text-slate-900 font-mono">
                {s?.inProgress ?? '—'}
              </span>
            </div>
          </div>

          <div className="px-5 pb-4">
            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/admin/students"
                className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB] hover:text-blue-800 transition-colors"
              >
                View assessments
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4">
        <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-[13px] font-semibold transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Student
          </button>
          
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-semibold transition-colors"
          >
            <Shield className="w-4 h-4 text-slate-500" />
            Add Admin
          </button>

          <Link
            href="/admin/students"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-semibold transition-colors"
          >
            <Clock className="w-4 h-4 text-slate-500" />
            Review Assessments
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <Link
            href="/admin/students"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-semibold transition-colors"
          >
            <Users className="w-4 h-4 text-slate-500" />
            Manage Students
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* ── Create Student Modal ──────────────────────────────────────────── */}
      <CreateStudentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadData}
      />

      {/* ── Create Admin Modal ────────────────────────────────────────────── */}
      <CreateAdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={loadData}
      />
    </AdminDashboardShell>
  );
}
