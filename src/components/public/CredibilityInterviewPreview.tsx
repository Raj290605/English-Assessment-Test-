"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Video } from "lucide-react";
import Link from "next/link";

export default function CredibilityInterviewPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A192F] rounded-[2.5rem] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          
          {/* Ambient effects */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-500/10 blur-[80px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Video className="w-3.5 h-3.5" />
                Includes Guidance Video
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Preparing for Your <br />
                Credibility Interview?
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-md">
                Our AI-powered platform helps you practice real interview questions, record your answers and get evaluated to improve your performance.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/credibility-interview-test"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-yellow-500 text-slate-900 font-semibold hover:bg-yellow-400 hover:shadow-lg transition-all duration-300"
                >
                  Explore Credibility Test
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/credibility-interview-test#credibility-video"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  <Play className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  Watch Guidance Video
                </Link>
              </div>
            </motion.div>

            {/* Right Visual (Platform & Video Preview) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:ml-auto w-full max-w-xl aspect-[16/10] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden group"
            >
              <Link href="/credibility-interview-test#credibility-video" className="block w-full h-full relative cursor-pointer">
                {/* Header bar */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-[#0A192F] border-b border-slate-700/50 flex items-center justify-between px-4 z-20">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                    Pre-CAS Guidance Video
                  </span>
                </div>
                
                {/* Platform Preview Image with Dark Video Overlay */}
                <div className="absolute inset-0 pt-10 bg-slate-950">
                  <img 
                    src="/platform-preview.png" 
                    alt="Credibility Interview Platform Preview" 
                    className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Center Play Overlay */}
                <div className="absolute inset-0 pt-10 flex flex-col items-center justify-center z-10 p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600 group-hover:bg-blue-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border border-white/20 mb-3">
                    <Play className="w-7 h-7 ml-1" fill="currentColor" />
                  </div>
                  <span className="text-white font-bold text-base drop-shadow-md">
                    Watch Official Pre-CAS Guidance Video
                  </span>
                  <span className="text-slate-300 text-xs mt-1">
                    Click to watch video walkthrough
                  </span>
                </div>
              </Link>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
