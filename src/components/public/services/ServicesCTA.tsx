"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mic } from "lucide-react";
import Link from "next/link";

export default function ServicesCTA() {
  return (
    <section className="py-24 bg-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-[#0A192F] p-8 sm:p-12 lg:p-16 flex flex-col items-center text-center shadow-2xl border border-slate-800"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/20 blur-[80px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-500/10 blur-[60px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 max-w-2xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Plan Your Next Step?
          </h2>
          <p className="text-slate-300 text-lg">
            Whether you need help selecting a university or preparing for your credibility interview, our experts are here to guide you.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="#contact"
            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-8 py-4 rounded-xl bg-yellow-500 text-slate-900 font-bold hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-xl shadow-yellow-500/20"
          >
            Contact Us
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#credibility-interview-test"
            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-8 py-4 rounded-xl border border-slate-700 bg-slate-800/50 text-white font-bold hover:bg-slate-800 hover:border-slate-600 transition-all duration-300"
          >
            Explore Credibility Interview Test
            <Mic className="w-5 h-5 text-yellow-500" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
