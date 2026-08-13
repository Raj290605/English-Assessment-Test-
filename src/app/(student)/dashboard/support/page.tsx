import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/services/authService';
import { StudentDashboardShell } from '@/components/student/StudentDashboardShell';
import { HelpCircle, Mail, MessageSquare, Book } from 'lucide-react';

export default async function StudentSupportPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'STUDENT') {
    redirect('/login');
  }

  return (
    <StudentDashboardShell user={session}>
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">Help & Support</h2>
              <p className="text-[13px] text-slate-500 mt-0.5 font-medium">How can we assist you today?</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors cursor-pointer group flex flex-col items-center text-center gap-3">
              <Book className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Knowledge Base</h3>
                <p className="text-xs text-slate-500">Read guides and FAQs.</p>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors cursor-pointer group flex flex-col items-center text-center gap-3">
              <MessageSquare className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Live Chat</h3>
                <p className="text-xs text-slate-500">Chat with support staff.</p>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors cursor-pointer group flex flex-col items-center text-center gap-3">
              <Mail className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Email Support</h3>
                <p className="text-xs text-slate-500">Send us a ticket.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </StudentDashboardShell>
  );
}
