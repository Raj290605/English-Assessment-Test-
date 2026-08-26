"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CredibilityCTA() {
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
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 max-w-2xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Practicing?
          </h2>
          <p className="text-slate-300 text-lg">
            Log in to access the Credibility Interview Test platform and begin your preparation.
          </p>
        </div>

        <div className="relative z-10">
          <Link
            href="/portal"
            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-10 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-900/20"
          >
            Enter the Platform
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
