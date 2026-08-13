'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, PlayCircle } from 'lucide-react';

interface StudentVideoPlayerProps {
  responseId: string;
  publicId: string;
  fallbackUrl?: string;
}

export function StudentVideoPlayer({ responseId, publicId, fallbackUrl }: StudentVideoPlayerProps) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasRequested, setHasRequested] = useState(false);

  const fetchSignedStreamUrl = async () => {
    setLoading(true);
    setError('');
    setHasRequested(true);
    try {
      const res = await fetch('/api/cloudinary/stream-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responseId, publicId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to authorize video playback');

      setStreamUrl(data.streamUrl);
    } catch (err: any) {
      if (fallbackUrl) {
        setStreamUrl(fallbackUrl);
      } else {
        setError(err.message || 'We couldn\'t load your recording. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!hasRequested && !streamUrl) {
    return (
      <div className="w-full bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center py-10 px-4 text-center">
        <PlayCircle className="w-10 h-10 text-slate-300 mb-3" />
        <h5 className="text-sm font-semibold text-slate-700 mb-1">Your Submitted Response</h5>
        <p className="text-[12px] text-slate-500 mb-4 max-w-sm">Load the secure playback of the video you submitted for this question.</p>
        <button 
          onClick={fetchSignedStreamUrl}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <PlayCircle className="w-4 h-4" /> Load Recording
        </button>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full max-w-2xl bg-slate-950 rounded-xl overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center">
      {loading && (
        <div className="text-center space-y-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono">Loading your submitted recording...</p>
        </div>
      )}

      {!loading && error && (
        <div className="p-6 text-center space-y-3 max-w-xs">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <p className="text-[13px] text-rose-300 font-medium">{error}</p>
          <button
            onClick={fetchSignedStreamUrl}
            className="text-xs px-4 py-2 mt-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {!loading && streamUrl && (
        <video
          src={streamUrl}
          controls
          controlsList="nodownload"
          playsInline
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
