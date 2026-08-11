'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCcw } from 'lucide-react';

export function ReattemptButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReattempt = async () => {
    if (!window.confirm('Are you sure you want to start a new assessment attempt? Your previous attempt will be preserved.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/assessment/reattempt', {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to start new attempt');
      }

      router.refresh();
      router.push('/assessment');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {error && (
        <div className="mb-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
      <button
        onClick={handleReattempt}
        disabled={loading}
        className="w-full py-3 px-6 bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold rounded-xl shadow-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.01] disabled:opacity-50"
      >
        <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Starting New Attempt...' : 'Start New Attempt'}
      </button>
    </div>
  );
}
