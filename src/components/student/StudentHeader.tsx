'use client';

import React from 'react';
import { Menu, Bell, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeProvider';

interface StudentHeaderProps {
  user: any;
  onOpenSidebar: () => void;
}

export function StudentHeader({ user, onOpenSidebar }: StudentHeaderProps) {
  return (
    <header className="h-24 px-6 lg:px-8 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="p-2 -ml-2 lg:hidden text-slate-500 hover:text-slate-900 transition-colors rounded-md"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">
            Welcome back, {user.name} <span className="text-2xl inline-block ml-1" role="img" aria-label="wave">👋</span>
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">Track your progress, complete your assessment and view your results.</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden sm:flex items-center gap-3 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
          <ThemeToggle />
        </div>
        
        <button className="relative p-2 text-slate-600 hover:bg-slate-50 rounded-full border border-slate-200 transition-colors bg-white">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        
        {user && (
          <div className="flex items-center gap-3 pl-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden border border-slate-100">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[14px] font-bold text-slate-900 leading-tight">{user.name}</span>
              <span className="text-[11px] text-slate-500 font-medium">Student ID: {user.studentId}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block ml-1" />
          </div>
        )}
      </div>
    </header>
  );
}
