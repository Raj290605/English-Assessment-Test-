"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function CompanyVideo() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Get to Know Skillsoft
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Meet the team behind your journey and discover how we support students worldwide.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-100"
        >
          {/* Ambient glow behind the video container */}
          <div className="absolute inset-0 bg-blue-500/5 blur-2xl transition-colors duration-500" />
          
          {/* Video Player */}
          <video 
            className="relative z-10 w-full h-full object-cover"
            controls
            preload="metadata"
            poster="/company image.png"
          >
            <source src="/about us video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
      </div>
    </section>
  );
}
