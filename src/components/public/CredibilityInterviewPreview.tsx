"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
              <p className="text-blue-400 font-semibold tracking-wider uppercase text-sm mb-4">
                Prepare With Confidence
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Preparing for Your <br />
                Credibility Interview?
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-md">
                Our AI-powered platform helps you practice real interview questions, record your answers and get evaluated to improve your performance.
              </p>
              
              <Link
                href="#interview-test"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-yellow-500/30 text-yellow-500 font-semibold hover:bg-yellow-500 hover:text-slate-900 transition-all duration-300"
              >
                Explore Credibility Interview Test
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Right Visual (Platform Preview Placeholder) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:ml-auto w-full max-w-xl aspect-[16/10] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden group"
            >
              {/* Fake UI Header */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              
              <div className="absolute inset-0 pt-10 flex flex-col items-center justify-center text-slate-500 bg-gradient-to-br from-slate-900 to-slate-800">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-lg font-medium tracking-widest uppercase">Platform Preview</span>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
