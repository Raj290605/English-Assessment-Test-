'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Mic, ShieldCheck, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  user?: {
    name: string;
    studentId: string;
    role: string;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/portal');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">English Assessment</span>
            <span className="block text-xs text-slate-500 font-medium">Speaking Evaluation Portal</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                {user.role === 'ADMIN' ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <UserIcon className="w-4 h-4 text-blue-500 shrink-0" />
                )}
                <div className="text-xs">
                  <span className="font-semibold text-slate-800">{user.name}</span>
                  <span className="text-slate-500 ml-1.5 font-mono">({user.studentId})</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${user.role === 'ADMIN'
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                  }`}>
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
