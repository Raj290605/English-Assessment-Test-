'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface QuestionSet {
  id: string;
  name: string;
}

export default function QuestionBankLandingPage() {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchQuestionSets();
  }, []);

  const fetchQuestionSets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/question-sets');
      if (!res.ok) throw new Error('Failed to fetch question sets');
      const data = await res.json();
      if (data.questionSets) {
        setQuestionSets(data.questionSets);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f1423] text-slate-200">
      <AdminSidebar
        user={null}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen relative min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#151b2b] border-b border-white/10 sticky top-0 z-30">
          <h1 className="text-xl font-bold text-white">Question Bank</h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <main className="flex-1 p-6 lg:py-10 lg:px-10 xl:px-12 space-y-6 w-full max-w-[90%] 2xl:max-w-7xl">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-white">Question Bank</h1>
            <p className="text-slate-400">Select a question set to manage and edit its questions.</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-[#1E3A8A]/30 border-t-[#1E3A8A] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {questionSets.map((set) => (
                <Link
                  key={set.id}
                  href={`/admin/questions/${set.id}`}
                  className="bg-[#151b2b] hover:bg-white/[0.04] border border-white/10 hover:border-[#1E3A8A]/50 transition-all rounded-2xl p-6 group flex flex-col justify-between min-h-[160px]"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                      <BookOpen className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">{set.name}</h2>
                    <p className="text-sm text-slate-400">
                      Manage and edit questions belonging to {set.name}.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-blue-400 mt-6 text-sm font-semibold group-hover:text-blue-300 transition-colors">
                    View Questions
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
