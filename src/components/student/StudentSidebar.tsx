'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Clock, FileText, User, HelpCircle, LogOut, Mic, ArrowRight } from 'lucide-react';

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

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: CheckSquare, label: 'My Assessments', href: '/dashboard' },
    { icon: Clock, label: 'Previous Attempts', href: '/dashboard/attempts' },
    { icon: FileText, label: 'Results & Feedback', href: '/dashboard/results' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
  ];

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
        fixed top-0 left-0 bottom-0 z-50 w-[260px] bg-[#0A1930] text-slate-300
        transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:static'}
      `}>
        
        {/* Branding */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg border border-slate-700 flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-white tracking-wide text-sm">CREDIBILITY</span>
              <span className="font-semibold text-blue-400 text-sm">INTERVIEW TEST</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href.split('#')[0] && (item.href === '/dashboard' ? (pathname === '/dashboard' && item.label === 'Dashboard') : true);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-colors text-[13px] ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-4">
          <Link href="/dashboard/support" className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-[13px]">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            Help & Support
          </Link>

          {/* Support Card */}
          <div className="bg-[#112240] rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
                <HelpCircle className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <h4 className="text-[13px] font-semibold text-white">Need Help?</h4>
            <p className="text-[11px] text-slate-400 mt-1 mb-4">We're here to assist you</p>
            <Link href="/dashboard/support" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5">
              Contact Support <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-[13px]"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            Logout
          </button>

          <div className="px-4 pb-2 pt-2 text-[10px] text-slate-500 leading-relaxed">
            © 2026 Credibility Interview Test<br />
            All rights reserved.
          </div>
        </div>

      </aside>
    </>
  );
}
