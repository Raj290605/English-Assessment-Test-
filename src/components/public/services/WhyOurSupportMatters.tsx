"use client";

import { motion } from "framer-motion";

export default function WhyOurSupportMatters() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-yellow-500 font-semibold tracking-wider uppercase text-sm mb-6">
            The Value of Guidance
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-8">
            Why Our Support Matters
          </h2>
          <div className="space-y-6 text-lg sm:text-xl text-slate-600 leading-relaxed text-left md:text-center">
            <p>
              Navigating international university applications can be overwhelming. Between complex documentation, stringent deadlines, and high-stakes interviews, the margin for error is small.
            </p>
            <p>
              Our professional support brings structure to chaos. We provide clearer decision-making, an organized timeline, and personalized guidance through every complex step. This ensures that your application represents your true potential without the stress of navigating the system alone.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Subtle ambient effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-100/50 blur-[100px] rounded-full pointer-events-none -z-10" />
    </section>
  );
}
