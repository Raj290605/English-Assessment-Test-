"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const practiceAreas = [
  "Structuring clear and concise answers under time pressure.",
  "Explaining your academic choices with confidence and logic.",
  "Communicating future plans and linking them to your degree.",
  "Demonstrating genuine understanding of your chosen destination.",
  "Building confidence through repeated, realistic simulated practice.",
  "Getting accustomed to being recorded while maintaining professionalism.",
];

export default function PracticeAreas() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-6">
              What Students Can Practice
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              The assessment platform is designed to target the specific communication skills required during a formal credibility interview.
            </p>
            <ul className="space-y-4">
              {practiceAreas.map((area, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{area}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-[2.5rem] bg-slate-200 overflow-hidden relative shadow-2xl border border-slate-100 group">
               <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-100 group-hover:bg-slate-200 transition-colors duration-500">
                  <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="text-lg font-medium tracking-widest uppercase text-center px-4">
                    Practice Visual
                  </span>
                </div>
            </div>
            {/* Ambient blur */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-yellow-500/10 blur-[80px] rounded-full pointer-events-none" />
          </motion.div>

        </div>

      </div>
    </section>
  );
}
