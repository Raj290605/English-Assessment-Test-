"use client";

import { motion } from "framer-motion";

export default function ServicesOverview() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Guidance Beyond the Application
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Choosing to study abroad involves much more than selecting a university. It requires careful planning, confident decision-making, and navigating complex procedures. Our comprehensive suite of services is designed to support you through the critical decisions and practical steps along the entire journey.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
