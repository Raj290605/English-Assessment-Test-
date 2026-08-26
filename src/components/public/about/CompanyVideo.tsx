"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function CompanyVideo() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Get to Know Skillsoft
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Meet the team behind your journey and discover how we support students worldwide.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-100 group cursor-pointer"
        >
          {/* Ambient glow behind the video container */}
          <div className="absolute inset-0 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-colors duration-500" />
          
          {/* Fake Thumbnail Background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 flex flex-col items-center justify-center text-slate-500 group-hover:scale-105 transition-transform duration-700 ease-out">
            <svg className="w-20 h-20 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-lg font-medium tracking-widest uppercase">Company Video</span>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 shadow-xl border border-white/20">
              <Play className="w-10 h-10 text-white ml-2" fill="currentColor" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
