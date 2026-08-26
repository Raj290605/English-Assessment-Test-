"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export default function CompanyOverview() {
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

          {/* Right Visual (Placeholder) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-200 relative group shadow-2xl">
              {/* Placeholder Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-200">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-lg font-medium tracking-widest uppercase">Graduation Visual</span>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-white/40 transition-all duration-300 shadow-xl border border-white/40">
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                </button>
              </div>

              {/* Stats Overlay */}
              <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-tight">15+ Years</p>
                  <p className="text-slate-300 text-xs">of Experience in Overseas Education</p>
                </div>
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
