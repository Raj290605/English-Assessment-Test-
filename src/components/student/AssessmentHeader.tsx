'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';

interface AssessmentHeaderProps {
  user: any;
}

export function AssessmentHeader({ user }: AssessmentHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/portal');
    router.refresh();
  };

  return (
    <header className="h-[76px] bg-[#0A1930] px-6 lg:px-10 flex items-center justify-between shrink-0 shadow-sm border-b border-slate-800">
      <div className="flex items-center gap-6">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-slate-700/50 bg-white/5 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col leading-none gap-0.5">
            <span className="font-bold text-white tracking-widest text-[13px]">CREDIBILITY</span>
            <span className="font-semibold text-blue-400 text-[10px] tracking-widest">INTERVIEW TEST</span>
          </div>
        </div>

        {/* Back Button */}
        <Link 
          href="/dashboard"
          className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-600/50 text-blue-400 hover:bg-blue-600/10 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm border border-slate-700">
            {user?.name?.substring(0, 2).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[14px] font-bold text-white mb-1">{user?.name || 'Student'}</span>
            <span className="text-[10px] font-bold text-white bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded tracking-wider w-max uppercase">
              Student
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-700/50"></div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
