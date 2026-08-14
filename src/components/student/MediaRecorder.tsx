'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Square, RefreshCw, Upload, CheckCircle2, AlertCircle, Clock, Lightbulb } from 'lucide-react';

interface MediaRecorderProps {
  questionId: string;
  questionNumber: number;
  assessmentId: string;
  timeLimitSec: number;
  hasSavedResponse: boolean;
  onResponseSaved: () => void;
}

type RecordingStatus = 'IDLE' | 'RECORDING' | 'STOPPED' | 'UPLOADING' | 'SAVED' | 'ERROR';

export function MediaRecorderComponent({
  questionId,
  questionNumber,
  assessmentId,
  timeLimitSec,
  hasSavedResponse,
  onResponseSaved,
}: MediaRecorderProps) {
  const [status, setStatus] = useState<RecordingStatus>(hasSavedResponse ? 'SAVED' : 'IDLE');
  const [elapsed, setElapsed] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);

  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const initMediaStream = async () => {
    try {
      if (mediaStreamRef.current) return;
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
      } catch (firstErr) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      }
      mediaStreamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('MediaStream error:', err);
      let msg = `Camera/Microphone Error (${err.name || 'Unknown'}): ${err.message || 'Access failed'}`;
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera or Microphone access denied. Please check your browser permission settings and Windows Privacy Settings.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg = 'Camera or Microphone is currently in use by another application. Please close other apps using the camera and refresh.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera or microphone found on your device. Please connect a camera/microphone and refresh.';
      }
      setErrorMessage(msg);
      setStatus('ERROR');
    }
  };

  useEffect(() => {
    if (status !== 'SAVED') {
      initMediaStream();
    }
    return () => {
      stopMediaTracks();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [questionNumber]);

  useEffect(() => {
    if (status === 'SAVED') {
      stopMediaTracks();
    }
  }, [status]);

  const stopMediaTracks = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  };

  const startRecording = async () => {
    setErrorMessage('');
    chunksRef.current = [];
    setRecordedBlob(null);
    setReviewUrl(null);

    if (!mediaStreamRef.current) {
      await initMediaStream();
    }

    if (!mediaStreamRef.current) return;

    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : '';

      const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setReviewUrl(url);
      };

      recorder.start(500);
      setStatus('RECORDING');
      setElapsed(0);

      timerIntervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev + 1 >= timeLimitSec) {
            stopRecording();
            return timeLimitSec;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      setErrorMessage('Failed to start media recorder: ' + err.message);
      setStatus('ERROR');
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setStatus('STOPPED');
  };

  const resetRecording = () => {
    if (reviewUrl) {
      URL.revokeObjectURL(reviewUrl);
    }
    setReviewUrl(null);
    setRecordedBlob(null);
    setElapsed(0);
    setErrorMessage('');
    setStatus('IDLE');
    initMediaStream();
  };

  const uploadAndSaveResponse = async () => {
    if (!recordedBlob) return;
    setStatus('UPLOADING');
    setErrorMessage('');

    try {
      const sigRes = await fetch('/api/cloudinary/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, questionNumber }),
      });

      const sigData = await sigRes.json();
      if (!sigRes.ok) throw new Error(sigData.error || 'Failed to generate upload signature');

      const { signedParams } = sigData;

      const formData = new FormData();
      formData.append('file', recordedBlob, `q${questionNumber}.webm`);
      formData.append('api_key', signedParams.apiKey);
      formData.append('timestamp', signedParams.timestamp.toString());
      formData.append('signature', signedParams.signature);
      formData.append('folder', signedParams.folder);
      formData.append('public_id', signedParams.publicId);
      formData.append('type', signedParams.type);

      const cloudUrl = `https://api.cloudinary.com/v1_1/${signedParams.cloudName}/video/upload`;
      const cloudRes = await fetch(cloudUrl, {
        method: 'POST',
        body: formData,
      });

      const cloudData = await cloudRes.json();
      if (!cloudRes.ok) {
        throw new Error(cloudData.error?.message || 'Cloudinary upload failed');
      }

      const saveRes = await fetch('/api/assessment/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId,
          questionId,
          questionNumber,
          cloudinaryPublicId: cloudData.public_id,
          cloudinaryUrl: cloudData.secure_url,
          durationSeconds: elapsed || Math.round(cloudData.duration || 0),
        }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || 'Failed to save response to database');

      setStatus('SAVED');
      onResponseSaved();
    } catch (err: any) {
      setErrorMessage(err.message || 'Recording upload failed. Please try again.');
      setStatus('STOPPED');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          Camera & Recording
        </h3>
        
        {/* Status Pill */}
          {status === 'STOPPED' && (
            <span className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wide border border-amber-100 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Ready for Review
            </span>
          )}
          {status === 'UPLOADING' && (
            <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wide border border-blue-100 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 animate-bounce" /> Uploading...
            </span>
          )}
          {status === 'SAVED' && (
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wide border border-emerald-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Response Saved
            </span>
          )}
          {status === 'IDLE' && (
            <span className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wide border border-emerald-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Camera Ready
            </span>
          )}
        </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm flex items-center gap-2 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Video Viewport Container */}
      <div className="relative aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center mb-4">
        
        {/* Live Camera Stream */}
        {status !== 'STOPPED' && status !== 'UPLOADING' && status !== 'SAVED' && (
          <video
            ref={liveVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover -scale-x-100"
          />
        )}

        {/* Review Video Playback */}
        {(status === 'STOPPED' || status === 'UPLOADING') && reviewUrl && (
          <video
            src={reviewUrl}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Saved Response Display */}
        {status === 'SAVED' && (
          <div className="text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Response Recorded</h4>
          </div>
        )}
      </div>

      {/* Timer and Progress Line */}
      <div className="flex items-center gap-3 mb-4 w-full">
        <div className="flex items-center gap-1.5 font-bold text-[13px] text-slate-700 shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(elapsed)} / {formatTime(timeLimitSec)}</span>
        </div>
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${status === 'RECORDING' ? 'bg-rose-500' : 'bg-slate-300'}`}
            style={{ width: `${Math.min(100, (elapsed / timeLimitSec) * 100)}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        {status === 'IDLE' && (
          <button
            onClick={startRecording}
            className="w-full h-10 bg-[#0D62F9] hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-sm"
          >
            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
            Start Video Recording
          </button>
        )}

        {status === 'RECORDING' && (
          <button
            onClick={stopRecording}
            className="w-full h-10 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-colors text-sm animate-pulse"
          >
            <Square className="w-4 h-4 fill-white" />
            Stop Recording
          </button>
        )}

        {(status === 'STOPPED' || status === 'SAVED') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <button
              onClick={resetRecording}
              className="h-10 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-lg border border-slate-200 flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Re-record Video
            </button>

            {status === 'STOPPED' && recordedBlob && (
              <button
                onClick={uploadAndSaveResponse}
                className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <Upload className="w-4 h-4" />
                Upload Response
              </button>
            )}
            
            {status === 'SAVED' && (
              <div className="h-10 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-lg flex items-center justify-center gap-2 text-sm cursor-default">
                <CheckCircle2 className="w-4 h-4" />
                Successfully Saved
              </div>
            )}
          </div>
        )}

        {status === 'ERROR' && (
          <button
            onClick={() => {
              setErrorMessage('');
              setStatus('IDLE');
              initMediaStream();
            }}
            className="w-full h-10 bg-[#0D62F9] hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Camera Connection
          </button>
        )}
      </div>

      {/* Tip Box */}
      <div className="mt-4 bg-[#F8FAFC] rounded-xl p-3 border border-slate-100 flex items-center gap-2.5 text-[13px] text-slate-600">
        <Lightbulb className="w-4 h-4 text-blue-500 shrink-0" />
        <span className="font-semibold text-slate-700">Tip:</span> Look at the camera and speak clearly.
      </div>

    </div>
  );
}