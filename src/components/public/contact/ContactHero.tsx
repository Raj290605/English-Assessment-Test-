"use client";

import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0A192F]">
      {/* Ambient background effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-yellow-500 font-semibold tracking-widest uppercase text-sm mb-6">
            Get In Touch
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-8">
            Let's Plan Your Next Step
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Whether you have a question, need guidance on your application, or want to know more about our services, our team is ready to assist you.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
