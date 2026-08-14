'use client';

import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface StudentHeaderProps {
  user: any;
  onOpenSidebar: () => void;
}

export function StudentHeader({ user, onOpenSidebar }: StudentHeaderProps) {
  return (
    <header className="pt-8 pb-6 px-6 lg:px-10 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 lg:hidden text-slate-500 hover:text-slate-900 transition-colors rounded-md"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-[26px] font-bold text-slate-900 leading-tight">
            Welcome back, {user.name?.split(' ')[0] || 'Student'}! <span className="text-2xl" role="img" aria-label="wave">👋</span>
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium hidden sm:block">
            Here's an overview of your assessment.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full border border-slate-200 transition-colors bg-white">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border border-white rounded-full" />
        </button>

        {/* User avatar */}
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm border border-slate-100">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[13px] font-bold text-slate-900 leading-tight">{user.name}</span>
              <span className="text-[11px] text-slate-400 font-medium">ID: {user.studentId}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
