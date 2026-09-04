"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

export default function PreparationVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const KNOWN_DURATION = 1678; // Exactly 27m 58s (verified from media tracks)
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(KNOWN_DURATION);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
    const totalSecs = Math.floor(timeInSeconds);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hours > 0) {
      return `${hours}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Synchronize video duration as soon as media metadata is ready
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleDuration = () => {
      if (
        video.duration &&
        !isNaN(video.duration) &&
        isFinite(video.duration) &&
        video.duration > 0
      ) {
        setDuration(video.duration);
      }
    };

    if (video.readyState >= 1) {
      handleDuration();
    }

    video.addEventListener("loadedmetadata", handleDuration);
    video.addEventListener("durationchange", handleDuration);
    video.addEventListener("canplay", handleDuration);

    return () => {
      video.removeEventListener("loadedmetadata", handleDuration);
      video.removeEventListener("durationchange", handleDuration);
      video.removeEventListener("canplay", handleDuration);
    };
  }, []);

  // Fullscreen state synchronization
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Controls auto-hide when playing
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  // Play / Pause toggle
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch((err) => {
          console.warn("Autoplay / playback prevented:", err);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  // Mute toggle
  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      if (volume === 0) {
        setVolume(0.6);
        videoRef.current.volume = 0.6;
      }
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Volume slider change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      if (newVol === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  // Seek time
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Skip relative seconds (+10s or -10s)
  const skip = (seconds: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const target = Math.min(
      Math.max(0, videoRef.current.currentTime + seconds),
      duration || 0
    );
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  // Fullscreen toggle
  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Keyboard controls
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      skip(10);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      skip(-10);
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key === "m" || e.key === "M") {
      e.preventDefault();
      toggleMute();
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section
      id="credibility-video"
      className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-600 text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Credibility Interview Guidance
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              See What to Expect in Your Interview
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Watch this official Pre-CAS guidance video to understand key question categories, evaluator expectations, and tips for confident, articulate delivery.
            </p>
          </motion.div>
        </div>

        {/* Video Player Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Ambient Glow */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-[2.6rem] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={togglePlay}
            className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 group cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          >
            {/* HTML5 Video Element */}
            <video
              ref={videoRef}
              src="/SAMPLE%20PRE-CAS%20GUIDANCE%20VIDEO.mp4"
              className="w-full h-full object-contain bg-slate-950"
              playsInline
              preload="metadata"
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
              onLoadedMetadata={() => {
                if (videoRef.current && videoRef.current.duration > 0) {
                  setDuration(videoRef.current.duration);
                }
              }}
              onPlay={() => {
                setIsPlaying(true);
                setHasStarted(true);
              }}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                setIsPlaying(false);
                setShowControls(true);
              }}
            >
              <source
                src="/SAMPLE%20PRE-CAS%20GUIDANCE%20VIDEO.mp4"
                type="video/mp4"
              />
              <source
                src="/SAMPLE PRE-CAS GUIDANCE VIDEO.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            {/* Initial Poster / Pre-play Overlay */}
            {!hasStarted && (
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/70 flex flex-col justify-between p-6 sm:p-10 pointer-events-none z-20">
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider border border-blue-400/30 shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
                    Pre-CAS Preparation Guide
                  </span>
                  {duration > 0 && (
                    <span className="text-xs text-slate-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 font-mono">
                      {formatTime(duration)}
                    </span>
                  )}
                </div>

                {/* Center Action */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-600/90 hover:bg-blue-500 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/20 transform group-hover:scale-110 transition-all duration-300 mb-4">
                    <Play className="w-9 h-9 sm:w-10 sm:h-10 text-white ml-1.5" fill="currentColor" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 drop-shadow-md">
                    Watch Pre-CAS Guidance Walkthrough
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 max-w-md drop-shadow">
                    Click anywhere to start video playback and review sample interview scenarios.
                  </p>
                </div>

                {/* Bottom Details */}
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-yellow-400" />
                    UKVI & University Standard Questions
                  </span>
                  <span className="hidden sm:inline-block text-slate-400">
                    High Definition • Stereo Audio
                  </span>
                </div>
              </div>
            )}

            {/* Center Play/Pause Indicator on hover/pause once started */}
            {hasStarted && (
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none z-20 ${
                  !isPlaying || showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                {!isPlaying && (
                  <div className="w-20 h-20 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl">
                    <Play className="w-8 h-8 ml-1" fill="currentColor" />
                  </div>
                )}
              </div>
            )}

            {/* Controls Bar */}
            <AnimatePresence>
              {hasStarted && showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent p-4 sm:p-6 flex flex-col gap-3 z-30 pointer-events-auto"
                >
                  {/* Progress timeline scrubber */}
                  <div className="relative group/scrubber w-full flex items-center">
                    <input
                      type="range"
                      min={0}
                      max={duration || KNOWN_DURATION}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      aria-label="Video timeline scrubber"
                      className="w-full h-1.5 sm:h-2 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:h-2.5 transition-all focus:outline-none"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 ${progressPercent}%, rgba(51, 65, 85, 0.7) ${progressPercent}%)`,
                      }}
                    />
                  </div>

                  {/* Buttons & Info Bar */}
                  <div className="flex items-center justify-between text-white">
                    {/* Left Controls */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Play / Pause */}
                      <button
                        type="button"
                        onClick={togglePlay}
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                        className="p-2 rounded-lg hover:bg-white/15 text-white transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" fill="currentColor" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                        )}
                      </button>

                      {/* Rewind 10s */}
                      <button
                        type="button"
                        onClick={(e) => skip(-10, e)}
                        title="Rewind 10 seconds (←)"
                        aria-label="Rewind 10 seconds"
                        className="p-2 rounded-lg hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      {/* Forward 10s */}
                      <button
                        type="button"
                        onClick={(e) => skip(10, e)}
                        title="Fast-forward 10 seconds (→)"
                        aria-label="Forward 10 seconds"
                        className="p-2 rounded-lg hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>

                      {/* Volume & Mute */}
                      <div className="flex items-center gap-1.5 group/vol relative">
                        <button
                          type="button"
                          onClick={toggleMute}
                          aria-label={isMuted ? "Unmute" : "Mute"}
                          className="p-2 rounded-lg hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-5 h-5 text-red-400" />
                          ) : volume < 0.5 ? (
                            <Volume1 className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          aria-label="Volume slider"
                          className="w-16 sm:w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none hidden sm:inline-block"
                        />
                      </div>

                      {/* Time display */}
                      <div className="text-xs sm:text-sm font-mono text-slate-300 ml-1">
                        <span>{formatTime(currentTime)}</span>
                        <span className="text-slate-500 mx-1">/</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
                        aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        className="p-2 rounded-lg hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                      >
                        {isFullscreen ? (
                          <Minimize className="w-5 h-5" />
                        ) : (
                          <Maximize className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 3 Guidance Highlight Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid sm:grid-cols-3 gap-6 mt-12"
        >
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-1">Authentic Answers</h4>
            <p className="text-sm text-slate-600">
              Avoid memorized scripts. Learn how to explain your personal background, ambitions, and course choices naturally.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-1">Financial Clarity</h4>
            <p className="text-sm text-slate-600">
              Know how to answer questions about course tuition fees, living costs, and funding sources with complete precision.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-1">Course & University Details</h4>
            <p className="text-sm text-slate-600">
              Understand module structures, campus location, and why your selected institution fits your career trajectory.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
