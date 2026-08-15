'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';

interface AdminDashboardShellProps {
  user: any;
  children: React.ReactNode;
}

/**
 * Outer layout for all Admin pages.
 * Mirrors StudentDashboardShell: fixed sidebar + scrollable content area.
 */
export function AdminDashboardShell({ user, children }: AdminDashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-900">
      {/* Sidebar */}
      <div className="shrink-0 z-50">
        <AdminSidebar
          user={user}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 bg-[#F4F7FA]">
        <main className="flex-1 overflow-y-auto px-6 md:px-8 pt-8 pb-12">
          <div className="max-w-[1200px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
