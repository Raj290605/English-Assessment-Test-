import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/services/authService';
import { StudentDashboardShell } from '@/components/student/StudentDashboardShell';
import { User, Mail, Shield, Clock } from 'lucide-react';

export default async function StudentProfilePage() {
  const session = await getSession();
  
  if (!session || session.role !== 'STUDENT') {
    redirect('/login');
  }

  return (
    <StudentDashboardShell user={session}>
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
        
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Student Profile</h2>
          
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-sm flex items-center justify-center shrink-0">
              <span className="text-3xl font-bold text-blue-600">{session.name?.charAt(0).toUpperCase()}</span>
            </div>
            
            <div className="flex-1 space-y-4 pt-2">
              <div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Full Name</div>
                <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> {session.name}
                </div>
              </div>
              
              <hr className="border-slate-100" />
              
              <div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Student ID</div>
                <div className="text-base font-medium text-slate-700 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" /> {session.studentId}
                </div>
              </div>

              <hr className="border-slate-100" />
              
              <div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Account Role</div>
                <div className="text-base font-medium text-slate-700 flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-md text-sm font-bold tracking-wide">
                    {session.role}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </StudentDashboardShell>
  );
}
