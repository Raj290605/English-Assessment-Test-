'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  BookOpen,
  MessageSquare,
  Calendar,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AdminDashboardShell } from '@/components/admin/AdminDashboardShell';
import { EnquiryStatusBadge } from '@/components/admin/EnquiryStatusBadge';

// ── Types ────────────────────────────────────────────────────────────────────

type EnquiryStatusType = 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'CONVERTED' | 'CLOSED';

interface EnquiryDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  interestedService: string;
  message: string;
  status: EnquiryStatusType;
  adminNotes: string | null;
  contactedAt: string | null;
  followUpAt: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_OPTIONS: { label: string; value: EnquiryStatusType }[] = [
  { label: 'New', value: 'NEW' },
  { label: 'Contacted', value: 'CONTACTED' },
  { label: 'Follow Up', value: 'FOLLOW_UP' },
  { label: 'Converted', value: 'CONVERTED' },
  { label: 'Closed', value: 'CLOSED' },
];

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) +
    ' · ' +
    d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function EnquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const enquiryId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enquiry, setEnquiry] = useState<EnquiryDetail | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Edit state
  const [editStatus, setEditStatus] = useState<EnquiryStatusType>('NEW');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<'success' | 'error' | null>(null);

  const loadData = useCallback(async () => {
    try {
      // Auth
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meRes.ok || meData.user?.role !== 'ADMIN') {
        router.push('/admin-login');
        return;
      }
      setUser(meData.user);

      // Enquiry detail
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`);
      if (res.status === 404) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setEnquiry(data.enquiry);
        setEditStatus(data.enquiry.status);
        setEditNotes(data.enquiry.adminNotes || '');
      }
    } catch (err) {
      console.error('[EnquiryDetail] load error:', err);
    } finally {
      setLoading(false);
    }
  }, [router, enquiryId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    setSaving(true);
    setSaveResult(null);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          adminNotes: editNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEnquiry(data.enquiry);
        setSaveResult('success');
        setTimeout(() => setSaveResult(null), 3000);
      } else {
        setSaveResult('error');
      }
    } catch {
      setSaveResult('error');
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Loading enquiry…</p>
        </div>
      </div>
    );
  }

  if (notFound || !enquiry) {
    return (
      <AdminDashboardShell user={user}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-[15px] font-semibold text-slate-800">Enquiry not found</p>
          <p className="text-[13px] text-slate-500 mt-1 mb-5">
            This enquiry may have been removed or the ID is invalid.
          </p>
          <Link
            href="/admin/enquiries"
            className="text-[13px] font-semibold text-[#2563EB] hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Enquiries
          </Link>
        </div>
      </AdminDashboardShell>
    );
  }

  return (
    <AdminDashboardShell user={user}>

      {/* ── Back navigation ─────────────────────────────────────────────── */}
      <Link
        href="/admin/enquiries"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Enquiries
      </Link>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-slate-900 leading-tight">
            {enquiry.fullName}
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Submitted {formatDateTime(enquiry.createdAt)}
          </p>
        </div>
        <EnquiryStatusBadge status={enquiry.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* ── Left: Enquiry Information ──────────────────────────────────── */}
        <div className="space-y-6">

          {/* Student Information */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
                Student Information
              </h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Full Name</p>
                  <p className="text-[14px] font-medium text-slate-900">{enquiry.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Phone</p>
                  <p className="text-[14px] font-medium text-slate-900">{enquiry.phone || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Email</p>
                  <p className="text-[14px] font-medium text-slate-900">{enquiry.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiry Details */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
                Enquiry Details
              </h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Interested In</p>
                  <p className="text-[14px] font-medium text-slate-900">{enquiry.interestedService}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Message</p>
                  <p className="text-[14px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {enquiry.message}
                  </p>
                </div>
              </div>

              {enquiry.contactedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">First Contacted</p>
                    <p className="text-[14px] font-medium text-slate-900">
                      {formatDateTime(enquiry.contactedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Admin Management ───────────────────────────────────── */}
        <div className="space-y-6">

          {/* Status & Notes */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
                Admin Management
              </h2>
            </div>
            <div className="px-5 py-4 space-y-5">

              {/* Status selector */}
              <div>
                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as EnquiryStatusType)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Admin notes */}
              <div>
                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={5}
                  maxLength={5000}
                  placeholder="Add internal notes about this enquiry…"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Notes are internal and not visible to students.
                </p>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-[13px] font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>

              {/* Save feedback */}
              {saveResult === 'success' && (
                <div className="flex items-center gap-2 text-[13px] text-green-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Changes saved successfully
                </div>
              )}
              {saveResult === 'error' && (
                <div className="flex items-center gap-2 text-[13px] text-red-600 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  Failed to save changes. Please try again.
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
                Details
              </h2>
            </div>
            <div className="px-5 py-4 space-y-3 text-[12px]">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Source</span>
                <span className="text-slate-700 font-semibold capitalize">
                  {enquiry.source.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Submitted</span>
                <span className="text-slate-700 font-semibold">
                  {formatDateTime(enquiry.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Last Updated</span>
                <span className="text-slate-700 font-semibold">
                  {formatDateTime(enquiry.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </AdminDashboardShell>
  );
}
