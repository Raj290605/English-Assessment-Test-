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
    <>
      {error && (
        <div className="fixed bottom-4 right-4 z-50 text-sm text-white bg-red-600 p-4 rounded-xl shadow-lg font-medium max-w-sm">
          {error}
        </div>
      )}
      <button
        onClick={handleReattempt}
        disabled={loading}
        className="w-full h-full flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Starting...' : 'Start New Attempt'}
      </button>
    </>
  );
}
