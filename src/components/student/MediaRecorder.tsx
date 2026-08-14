'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Video, Mic, Play, Square, RefreshCw, Upload, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

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

  // Initialize camera/mic stream
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
        // Fallback to basic constraints if specific resolution constraints fail
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
        msg = 'Camera or Microphone is currently in use by another application (e.g., Zoom, Teams, Google Meet, or another browser tab). Please close other apps using the camera and refresh.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera or microphone found on your device. Please connect a camera/microphone and refresh.';
      }
      setErrorMessage(msg);
      setStatus('ERROR');
    }
  };

  // 1. Initialize camera when the question loads
  useEffect(() => {
    if (status !== 'SAVED') {
      initMediaStream();
    }

    // ONLY clean up when moving to a new question or leaving the page
    return () => {
      stopMediaTracks();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [questionNumber]);

  // 2. Shut off the camera only when the upload is totally finished
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
      // Changed fallback to empty string to prevent browser format crashes
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

      recorder.start(500); // Record in 500ms chunks
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
      // Step 1: Request signed upload parameters from backend
      const sigRes = await fetch('/api/cloudinary/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, questionNumber }),
      });

      const sigData = await sigRes.json();
      if (!sigRes.ok) throw new Error(sigData.error || 'Failed to generate upload signature');

      const { signedParams } = sigData;

      // Step 2: Direct upload blob to Cloudinary REST API
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

      // Step 3: Save response record in database
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
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200">
        <div className="flex items-center gap-2">
          {status === 'RECORDING' && (
            <span className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-recording" />
              Recording In Progress
            </span>
          )}
          {status === 'STOPPED' && (
            <span className="text-amber-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Ready for Review
            </span>
          )}
          {status === 'UPLOADING' && (
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-4 h-4 animate-bounce" /> Uploading Video to Secure Cloud...
            </span>
          )}
          {status === 'SAVED' && (
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Response Saved & Uploaded
            </span>
          )}
          {status === 'IDLE' && (
            <span className="text-slate-600 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Video className="w-4 h-4" /> Camera Ready
            </span>
          )}
        </div>

        {/* Timer */}
        <div className="font-mono text-sm font-bold text-slate-800 px-3 py-1 rounded bg-slate-200 border border-slate-300">
          {formatTime(elapsed)} / {formatTime(timeLimitSec)}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Video Viewport Container */}
      <div className="relative aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 shadow-2xl flex items-center justify-center">
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
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Response Successfully Uploaded</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your video response for Question {questionNumber} has been saved. You can advance to the next question or re-record if needed.
            </p>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {status === 'IDLE' && (
          <button
            onClick={startRecording}
            className="w-full sm:w-auto py-3 px-6 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Video Recording
          </button>
        )}

        {status === 'RECORDING' && (
          <button
            onClick={stopRecording}
            className="w-full sm:w-auto py-3 px-6 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition-all"
          >
            <Square className="w-4 h-4 fill-current" />
            Stop Recording
          </button>
        )}

        {(status === 'STOPPED' || status === 'SAVED') && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={resetRecording}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-300 flex items-center gap-2 text-xs transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Re-record Video
            </button>

            {status === 'STOPPED' && recordedBlob && (
              <button
                onClick={uploadAndSaveResponse}
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 text-xs transition-all"
              >
                <Upload className="w-4 h-4" />
                Confirm & Upload Response
              </button>
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
            className="w-full sm:w-auto py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Camera & Microphone Connection
          </button>
        )}
      </div>
    </div>
  );
}