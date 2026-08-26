"use client";

import { motion } from "framer-motion";

export default function WhatIsIt() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
            What is the Credibility Interview Test?
          </h2>
          <div className="space-y-6 text-lg text-slate-600 leading-relaxed text-left md:text-center">
            <p>
              The Credibility Interview Test is an advanced preparation platform designed exclusively to help international students practice for their upcoming credibility interviews.
            </p>
            <p>
              It provides a structured environment where you can respond to interview-style questions across a variety of crucial topics. By simulating the questioning process, the platform allows you to organize your thoughts, practice delivering clear and concise answers, and ultimately build the confidence necessary to succeed.
            </p>
            <p className="text-sm text-slate-500 italic mt-8 border-t border-slate-100 pt-8">
              Note: This is a preparation and practice tool. It is not an official university interview or a government-mandated test, and it does not guarantee university admission or visa approval.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
