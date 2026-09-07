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
             <img 
               src="/images/assessment_interface.jpg" 
               alt="Assessment Interface Preview" 
               className="absolute inset-0 w-full h-full object-cover"
             />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
