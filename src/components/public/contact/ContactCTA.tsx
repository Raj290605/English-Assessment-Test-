"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Have Questions About Studying Abroad?
          </h2>
          <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto">
            Discover how we can support your journey from university selection to pre-departure preparation.
          </p>

          <Link
            href="/services"
            className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
          >
            Explore Our Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>

      {/* Subtle ambient effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-slate-50 blur-[100px] rounded-full pointer-events-none -z-10" />
    </section>
  );
}
