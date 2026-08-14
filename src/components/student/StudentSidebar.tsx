'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Video, Clock, FileText, User, HelpCircle, LogOut, ShieldCheck, ArrowRight } from 'lucide-react';

interface StudentSidebarProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export function StudentSidebar({ user, isOpen, onClose }: StudentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const mainNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Video, label: 'My Assessments', href: '/dashboard/my-assessments' },
    { icon: Clock, label: 'Previous Attempts', href: '/dashboard/attempts' },
    { icon: FileText, label: 'Results & Feedback', href: '/dashboard/results' },
  ];

  const accountNavItems = [
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
    { icon: HelpCircle, label: 'Help & Support', href: '/dashboard/support' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const renderNavItems = (items: typeof mainNavItems) => {
    return items.map((item) => {
      const active = isActive(item.href);
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
          <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
          {item.label}
        </Link>
      );
    });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-[280px] h-[100dvh] bg-[#0A1930] text-slate-300
        transition-transform duration-300 ease-in-out flex flex-col border-r border-[#1E293B]
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:static'}
      `}>

        {/* Branding */}
        <div className="p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl border border-slate-700/50 bg-white/5 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col leading-none gap-1">
              <span className="font-bold text-white tracking-widest text-[12px]">CREDIBILITY</span>
              <span className="font-semibold text-blue-400 text-[10px] tracking-widest">INTERVIEW TEST</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            {renderNavItems(mainNavItems)}
          </div>

          <div className="space-y-1">
            <h4 className="px-3 text-[10px] font-bold text-slate-500 tracking-[0.2em] mb-2 mt-4">ACCOUNT</h4>
            {renderNavItems(accountNavItems)}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-3">

          {/* Support Card */}
          <div className="bg-[#112240] rounded-xl p-4 border border-slate-800">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                <HelpCircle className="w-3.5 h-3.5 text-white" />
              </div>
              <h4 className="text-[12px] font-semibold text-white">Need Help?</h4>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">We're here to assist you</p>
            <Link
              href="/dashboard/support"
              onClick={onClose}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              Contact Support <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-[13px]"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            Logout
          </button>

          <div className="px-3 pb-1 pt-1 text-[10px] text-slate-500 leading-relaxed">
            © 2026 Credibility Interview Test<br />
            All rights reserved.
          </div>
        </div>

      </aside>
    </>
  );
}
