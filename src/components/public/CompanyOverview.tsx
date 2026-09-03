"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

export default function CompanyOverview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-yellow-500 font-semibold tracking-wider uppercase text-sm mb-4">
              Who We Are
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.2] mb-6">
              Your Journey. <br />
              <span className="text-blue-600">Our Guidance.</span>
            </h2>
            <div className="space-y-6 text-lg text-slate-600">
              <p>
                We are an overseas education consultancy dedicated to helping students make informed decisions and achieve their academic goals abroad.
              </p>
              <p>
                With expert guidance, personalized support and end-to-end assistance, we turn your aspirations into achievable milestones.
              </p>
            </div>
            
            <div className="mt-10">
              <Link
                href="#about"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
              >
                Learn More About Us
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Right Visual (Graduation Video) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-900 relative group shadow-2xl">
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover cursor-pointer"
                playsInline
                autoPlay
                loop
                muted={isMuted}
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src="/Graduation%20Visual.mp4" type="video/mp4" />
                <source src="/Graduation Visual.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Gradient Overlay for visual contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

              {/* Sound Toggle Button */}
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-slate-900/90 transition-all duration-200"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-slate-200" />
                ) : (
                  <Volume2 className="w-5 h-5 text-yellow-400" />
                )}
              </button>

              {/* Play / Pause Center Overlay Button */}
              <div
                onClick={togglePlay}
                className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-300 ${
                  isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                }`}
              >
                <button
                  type="button"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                  className="w-20 h-20 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center group-hover:scale-110 hover:bg-white/35 transition-all duration-300 shadow-xl border border-white/40 text-white"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" fill="currentColor" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Decorative background blob */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100 blur-[80px] rounded-full" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
