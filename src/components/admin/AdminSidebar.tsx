'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Settings,
  HelpCircle,
  LogOut,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

interface AdminSidebarProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Main navigation items.
 * Reports and Evaluations are excluded until dedicated pages exist.
 */
const mainNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Users, label: 'Students', href: '/admin/students' },
  { icon: ClipboardList, label: 'Assessments', href: '/admin/assessments' },
  { icon: ShieldCheck, label: 'Account Management', href: '/admin/accounts' },
];

export function AdminSidebar({ user, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const isActive = (href: string, label: string) => {
    if (label === 'Dashboard') return pathname === '/admin/dashboard';
    if (label === 'Students') return pathname.startsWith('/admin/students');
    if (label === 'Assessments') return pathname.startsWith('/admin/assessments');
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: (typeof mainNavItems)[number]) => {
    const active = isActive(item.href, item.label);
    return (
      <Link
        key={item.label}
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-[13px] ${
          active
            ? 'bg-[#1E3A8A] text-white shadow-sm'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <item.icon
          className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`}
        />
        {item.label}
      </Link>
    );
  };

  // Derive initials for avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
    : 'AD';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-[240px] bg-[#071A3A] text-slate-300
          flex flex-col border-r border-[#0D2342]/80
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:static'}
        `}
        style={{ height: '100dvh' }}
      >
        {/* ── Branding ─────────────────────────────────────── */}
        <div className="px-5 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl border border-slate-700/50 bg-white/5 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex flex-col leading-none gap-[3px]">
              <span className="font-bold text-white tracking-widest text-[11px]">
                CREDIBILITY
              </span>
              <span className="font-semibold text-blue-400 text-[10px] tracking-widest">
                INTERVIEW TEST
              </span>
            </div>
          </div>
        </div>

        {/* ── Navigation ───────────────────────────────────── */}
        <nav className="flex-1 px-3 overflow-y-auto min-h-0">
          {/* Main nav */}
          <div className="space-y-0.5 mb-4">
            {mainNavItems.map(renderNavItem)}
            <Link
              href="/admin/questions"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-[13px] ${
                pathname === '/admin/questions'
                  ? 'bg-[#1E3A8A] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              Question Bank
            </Link>
          </div>
        </nav>

        {/* ── Bottom: Admin profile + Logout ───────────────── */}
        {/* This section is intentionally shrink-0 so it stays visible at all heights */}
        <div className="shrink-0 border-t border-slate-800/60 p-4 space-y-3">
          {/* Admin info */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shrink-0 border border-blue-400/20">
              {initials}
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[13px] font-semibold text-white truncate">
                {user?.name || 'Admin'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Assessment Administrator
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-[13px]"
          >
            <LogOut className="w-4 h-4 text-slate-500 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
