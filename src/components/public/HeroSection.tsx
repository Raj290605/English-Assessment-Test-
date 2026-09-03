"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Globe, Award } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#030815]">
      
      {/* Absolute Background Image & Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        {/* The Hero Image aligned to the right. Wide enough to sit firmly under the solid part of the gradient */}
        <img
          src="/hero-bg.jpg"
          alt="International student looking at university campus"
          className="absolute inset-0 w-full h-full object-cover object-[70%_center] lg:object-center"
        />
        {/* Gradient overlay to blend the image seamlessly into the deep blue background */}
        {/* On desktop: Solid color until 25%, fading to transparent by 80% so the right side remains vibrant */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030815] via-[#030815]/90 to-[#030815]/50 lg:bg-none lg:bg-gradient-to-r lg:from-[#030815] lg:from-[25%] lg:via-[#030815]/75 lg:via-[55%] lg:to-transparent lg:to-[80%]" />
        
        {/* Secondary gradient from bottom up to blend with the bottom transition curve */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030815] via-[#030815]/60 to-transparent lg:h-1/3 lg:top-auto lg:bottom-0" />
      </div>

      {/* Ambient background effects (positioned over the dark part) */}
      <div className="absolute top-0 left-0 lg:left-1/4 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-20 left-10 w-[400px] h-[300px] bg-[#E8BA55]/5 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* Decorative curved bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden">
        <svg viewBox="0 0 1440 120" className="w-full h-auto text-white relative z-10 block" preserveAspectRatio="none">
          <path 
            d="M0,80 Q720,150 1440,60 L1440,120 L0,120 Z" 
            fill="currentColor" 
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 max-w-2xl"
          >
            <p className="text-[#E8BA55] font-semibold tracking-wide text-sm sm:text-base mb-4">
              Guiding Dreams.
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-bold text-white leading-[1.15] mb-6">
              Building Futures <br />
              <span className="text-[#E8BA55]">
                Across Borders.
              </span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg font-light">
              From choosing the right university to landing on your dream campus, we're with you at every step of your international education journey.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#services"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-lg bg-[#E8BA55] text-slate-900 font-semibold hover:bg-[#d6a945] transition-colors duration-300 shadow-lg shadow-[#E8BA55]/10"
              >
                Explore Our Services
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-lg border border-slate-600/80 text-white font-medium hover:bg-slate-800/50 transition-colors duration-300 backdrop-blur-sm bg-transparent"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Statistics - Glassmorphism Card */}
            <div className="mt-14 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 grid grid-cols-3 gap-6 max-w-2xl shadow-2xl">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Users className="w-5 h-5 text-white/70" />
                  <span className="text-xl sm:text-2xl font-bold text-white">Expert</span>
                </div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Guidance</p>
              </div>
              <div className="border-l border-white/10 pl-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <Globe className="w-5 h-5 text-white/70" />
                  <span className="text-xl sm:text-2xl font-bold text-white">150+</span>
                </div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Universities</p>
              </div>
              <div className="border-l border-white/10 pl-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <Award className="w-5 h-5 text-white/70" />
                  <span className="text-xl sm:text-2xl font-bold text-white">End-to-End</span>
                </div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Support</p>
              </div>
            </div>
          </motion.div>

          <div className="hidden lg:block lg:col-span-5" />

        </div>
      </div>
    </section>
  );
}
