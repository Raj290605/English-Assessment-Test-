"use client";

import { motion } from "framer-motion";

export default function MissionVision() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle ambient center blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-50 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <p className="text-yellow-500 font-semibold tracking-wider uppercase text-sm mb-4">
              Our Mission
            </p>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-6">
              To empower students with clarity and confidence.
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              We exist to demystify the international education process. Our mission is to provide transparent, personalized, and actionable guidance that allows every student to navigate their study abroad journey with certainty and peace of mind.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center relative"
          >
            {/* Decorative quote mark or accent */}
            <div className="absolute -top-12 -left-8 text-9xl text-slate-100 font-serif leading-none select-none -z-10">
              "
            </div>
            
            <p className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-4">
              Our Vision
            </p>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-6">
              A seamless transition to global education.
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              We envision a world where geographical borders do not limit academic ambition. We strive to be the most trusted partner for students, ensuring that their transition into global universities is smooth, supported, and ultimately successful.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
