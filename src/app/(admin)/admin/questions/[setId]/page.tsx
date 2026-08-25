'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { Question } from '@prisma/client';
import QuestionList from '@/components/admin/QuestionList';
import QuestionFormModal from '@/components/admin/QuestionFormModal';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface PageProps {
  params: Promise<{
    setId: string;
  }>;
}

export default function QuestionSetPage({ params }: PageProps) {
  const { setId } = React.use(params);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [setName, setSetName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchQuestionsAndSetInfo();
  }, [setId]);

  const fetchQuestionsAndSetInfo = async () => {
    setIsLoading(true);
    try {
      // Fetch set info
      const setsRes = await fetch('/api/admin/question-sets');
      if (setsRes.ok) {
        const setsData = await setsRes.json();
        const currentSet = setsData.questionSets?.find((s: any) => s.id === setId);
        if (currentSet) {
          setSetName(currentSet.name);
        } else {
          setSetName('Unknown Set');
        }
      }

      // Fetch questions for this set
      const res = await fetch(`/api/admin/questions?setId=${setId}`);
      if (!res.ok) throw new Error('Failed to fetch questions');
      const data = await res.json();
      setQuestions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditQuestion = (q: Question) => {
    setModalMode('edit');
    setEditingQuestion(q);
    setIsModalOpen(true);
  };

  const handleAddQuestion = () => {
    setModalMode('add');
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleSaveQuestion = async (data: any) => {
    if (isSaving) return;
    setIsSaving(true);
    setError(null);
    try {
      if (modalMode === 'edit') {
        if (!editingQuestion) throw new Error('No question selected for editing');
        
        const body = { promptText: data.promptText, id: editingQuestion.id };
        const res = await fetch('/api/admin/questions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to update question');
        }
      } else {
        // Add Mode
        const body = { promptText: data.promptText, questionSetId: setId };
        const res = await fetch('/api/admin/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to create question');
        }
      }

      await fetchQuestionsAndSetInfo();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
      alert(err.message); 
    } finally {
      setIsSaving(false);
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
          <h1 className="text-xl font-bold text-white truncate max-w-[200px]">{setName || 'Question Set'}</h1>
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
          <div className="flex flex-col gap-6">
            <Link 
              href="/admin/questions" 
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Question Bank
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">{setName || 'Question Set'}</h1>
                <p className="text-slate-400 mt-1">Manage and edit questions belonging to this set.</p>
              </div>
              
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#2546a8] text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-900/20 w-fit"
              >
                <Plus className="w-4 h-4" />
                Add New Question
              </button>
            </div>
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
            <QuestionList
              questions={questions}
              onEdit={handleEditQuestion}
              isSaving={isSaving}
            />
          )}
        </main>
      </div>

      <QuestionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
        initialData={editingQuestion}
        isSaving={isSaving}
        mode={modalMode}
      />
    </div>
  );
}
