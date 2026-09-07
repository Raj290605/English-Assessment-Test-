'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { AdminDashboardShell } from '@/components/admin/AdminDashboardShell';
import { EnquiryStatusBadge } from '@/components/admin/EnquiryStatusBadge';

// ── Types ────────────────────────────────────────────────────────────────────

type EnquiryStatusType = 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'CONVERTED' | 'CLOSED';

interface EnquiryListItem {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  interestedService: string;
  status: EnquiryStatusType;
  createdAt: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'New', value: 'NEW' },
  { label: 'Contacted', value: 'CONTACTED' },
  { label: 'Follow Up', value: 'FOLLOW_UP' },
  { label: 'Converted', value: 'CONVERTED' },
  { label: 'Closed', value: 'CLOSED' },
];

function formatDate(iso: string): string {
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
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function EnquiriesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enquiries, setEnquiries] = useState<EnquiryListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const loadUser = useCallback(async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meRes.ok || meData.user?.role !== 'ADMIN') {
        router.push('/admin-login');
        return null;
      }
      setUser(meData.user);
      return meData.user;
    } catch {
      router.push('/admin-login');
      return null;
    }
  }, [router]);

  const loadEnquiries = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      params.set('page', String(page));
      params.set('limit', '20');

      const res = await fetch(`/api/admin/enquiries?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error('[EnquiriesPage] load error:', err);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    (async () => {
      const u = await loadUser();
      if (u) {
        setLoading(false);
      }
    })();
  }, [loadUser]);

  useEffect(() => {
    if (!loading) {
      loadEnquiries();
    }
  }, [loading, loadEnquiries]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleStatusChange = (value: string) => {
    setPage(1);
    setStatusFilter(value);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Loading enquiries…</p>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboardShell user={user}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-slate-900 leading-tight">
            Enquiries
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">
            Manage contact form submissions and student enquiries.
          </p>
        </div>
      </div>

      {/* ── Search + Filters ────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, email, or phone…"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </form>

          {/* Status filter count */}
          <div className="text-[12px] text-slate-500 font-medium shrink-0">
            {total} {total === 1 ? 'result' : 'results'}
          </div>
        </div>

        {/* Status tabs */}
        <div className="px-5 pb-3 flex items-center gap-1.5 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStatusChange(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                statusFilter === tab.value
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_1.2fr_1.5fr_1.2fr_1fr_80px] gap-4 px-5 py-3 bg-slate-50/80 border-b border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Student</span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Phone</span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Interested In</span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Submitted</span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Action</span>
        </div>

        {/* Rows */}
        {enquiries.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {enquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr_1.5fr_1.2fr_1fr_80px] gap-2 md:gap-4 px-5 py-4 hover:bg-slate-50/80 transition-colors group"
              >
                {/* Student */}
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-slate-900 truncate leading-tight">
                    {enquiry.fullName}
                  </p>
                  <p className="text-[12px] text-slate-500 truncate md:hidden">
                    {enquiry.email}
                  </p>
                  <p className="text-[12px] text-slate-400 truncate hidden md:block">
                    {enquiry.email}
                  </p>
                </div>

                {/* Phone */}
                <div className="flex items-center">
                  <span className="text-[13px] text-slate-600 truncate">
                    {enquiry.phone || '—'}
                  </span>
                </div>

                {/* Interested In */}
                <div className="flex items-center">
                  <span className="text-[13px] text-slate-600 truncate">
                    {enquiry.interestedService}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <EnquiryStatusBadge status={enquiry.status} />
                </div>

                {/* Submitted */}
                <div className="flex items-center">
                  <span className="text-[12px] text-slate-500">
                    {formatDate(enquiry.createdAt)}
                  </span>
                </div>

                {/* Action */}
                <div className="flex items-center">
                  <Link
                    href={`/admin/enquiries/${enquiry.id}`}
                    className="flex items-center gap-1 text-[13px] font-semibold text-[#2563EB] hover:text-blue-800 transition-colors group-hover:underline"
                  >
                    View
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 px-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-[15px] font-semibold text-slate-800">No enquiries found</p>
            <p className="text-[13px] text-slate-500 mt-1">
              {search || statusFilter
                ? 'Try adjusting your search or filter.'
                : 'New enquiries from the contact form will appear here.'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/60">
            <span className="text-[12px] text-slate-500">
              Page {page} of {totalPages} · {total} total
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </AdminDashboardShell>
  );
}
