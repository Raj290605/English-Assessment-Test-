"use client";

import { motion } from "framer-motion";
import { ArrowRight, Rocket } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-24 bg-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[80px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/10 blur-[60px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />

        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
          <div className="hidden sm:flex w-20 h-20 rounded-full bg-white/20 backdrop-blur-md items-center justify-center flex-shrink-0 border border-white/20">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Ready to Start Your Journey?
            </h2>
            <p className="text-blue-100 text-lg">
              Let's make your study abroad dream a reality.
            </p>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-auto flex-shrink-0">
          <Link
            href="#contact"
            className="inline-flex w-full md:w-auto justify-center items-center gap-2 px-8 py-4 rounded-xl bg-yellow-400 text-slate-900 font-bold text-lg hover:bg-yellow-300 hover:scale-105 transition-all duration-300 shadow-xl shadow-yellow-500/20"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
