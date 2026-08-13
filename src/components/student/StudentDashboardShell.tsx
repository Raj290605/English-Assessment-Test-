'use client';

import React, { useState, useEffect } from 'react';
import { StudentSidebar } from './StudentSidebar';
import { StudentHeader } from './StudentHeader';

interface StudentDashboardShellProps {
  user: any;
  children: React.ReactNode;
}

export function StudentDashboardShell({ user, children }: StudentDashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-900">
      
      {/* SIDEBAR */}
      <div className="shrink-0 z-50">
        <StudentSidebar 
          user={user} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      </div>
      
      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 bg-[#F4F7FA]">
        <StudentHeader 
          user={user} 
          onOpenSidebar={() => setIsSidebarOpen(true)} 
        />
        
        {/* Content canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1400px] mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
