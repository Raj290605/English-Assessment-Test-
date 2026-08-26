"use client";

import { motion } from "framer-motion";

export default function InterfacePreview() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Assessment Experience Preview
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Get familiar with the clean, distraction-free interface you will use during your practice sessions.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] rounded-[2rem] bg-slate-100 border border-slate-200 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Mock Browser/App Header */}
          <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-6 gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            <div className="w-3 h-3 rounded-full bg-slate-300" />
          </div>

          {/* Interface Content Placeholder */}
          <div className="flex-1 bg-slate-50/50 flex flex-col relative group cursor-default">
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-100 transition-colors duration-500">
                <svg className="w-20 h-20 mb-6 opacity-40 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-xl font-medium tracking-widest uppercase text-center px-4">
                  Assessment Interface Preview
                </span>
                
                {/* Simulated interface blocks to give a sense of structure without fake data */}
                <div className="absolute top-8 left-8 right-8 h-12 bg-slate-200/50 rounded-lg max-w-2xl mx-auto hidden sm:block" />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-12 bg-blue-500/20 rounded-full hidden sm:block" />
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
