'use client';

import React, { useState, useEffect } from 'react';
import { Play, Lock, AlertCircle, RefreshCw } from 'lucide-react';

interface AuthenticatedVideoPlayerProps {
  responseId: string;
  publicId: string;
  fallbackUrl?: string;
}

export function AuthenticatedVideoPlayer({ responseId, publicId, fallbackUrl }: AuthenticatedVideoPlayerProps) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSignedStreamUrl = async () => {
    setLoading(true);
    setError('');
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
      setError(err.message || 'Error loading video stream');
      // If error occurs, fallback to stored URL if available
      if (fallbackUrl) setStreamUrl(fallbackUrl);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignedStreamUrl();
  }, [responseId, publicId]);

  return (
    <div className="relative aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 shadow-2xl flex items-center justify-center">
      {loading && (
        <div className="text-center space-y-2 text-slate-400">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono">Authorizing Secure Private Stream...</p>
        </div>
      )}

      {!loading && error && (
        <div className="p-4 text-center space-y-3 max-w-xs">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <p className="text-xs text-rose-300 font-semibold">{error}</p>
          <button
            onClick={fetchSignedStreamUrl}
            className="text-xs px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 inline-flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Stream Authorization
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
