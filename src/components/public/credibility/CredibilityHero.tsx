"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function CredibilityHero() {
  const scrollToVideo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900 border-b border-slate-800">
      {/* High-tech ambient background effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen"
        style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-yellow-500 text-sm font-semibold tracking-widest uppercase mb-8">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            Credibility Interview Test
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
            Prepare With Confidence. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
              Answer With Clarity.
            </span>
          </h1>
          
          <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            A professional practice platform designed to help you prepare for your credibility interview experience. Rehearse real-world scenarios and refine your answers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/portal"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-900/20"
            >
              Start Your Preparation
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <a
              href="#how-it-works"
              onClick={scrollToVideo}
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-8 py-4 rounded-xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              See How It Works
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
