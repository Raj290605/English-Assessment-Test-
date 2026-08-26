"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Globe, Award, Play } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0A192F]">
      {/* Ambient background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Decorative curved bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto text-white fill-current">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="text-blue-400 font-semibold tracking-wide uppercase text-sm mb-4">
              Guiding Dreams.
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Building Futures <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                Across Borders.
              </span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
              From choosing the right university to landing on your dream campus, we're with you at every step of your international education journey.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-yellow-500 text-slate-900 font-semibold hover:bg-yellow-400 transition-colors duration-300"
              >
                Explore Our Services
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-600 text-white font-semibold hover:bg-slate-800 transition-colors duration-300"
              >
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Statistics */}
            <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-white">10,000+</span>
                </div>
                <p className="text-sm text-slate-400">Students Guided</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-white">150+</span>
                </div>
                <p className="text-sm text-slate-400">Universities</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-white">98%</span>
                </div>
                <p className="text-sm text-slate-400">Student Satisfaction</p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual (Placeholder) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative lg:ml-auto w-full max-w-lg aspect-[4/5] lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden bg-slate-800 shadow-2xl border border-slate-700/50 flex flex-col items-center justify-center group"
          >
            {/* Placeholder styling */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 flex flex-col items-center justify-center text-slate-500">
              <svg className="w-24 h-24 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-lg font-medium tracking-widest uppercase">Hero Visual</span>
            </div>

            {/* Simulated UI overlay from design */}
            <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-2xl flex items-center gap-4 transform translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="w-5 h-5 text-white ml-1" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Watch Video</p>
                <p className="text-slate-300 text-xs">Student Success Stories</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
