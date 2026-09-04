"use client";

import { motion } from "framer-motion";

const universities = [
  { src: "/university-logos/university-01.png.png", alt: "University 01" },
  { src: "/university-logos/university-02.png.png", alt: "University 02" },
  { src: "/university-logos/university-03.png.png", alt: "University 03" },
  { src: "/university-logos/university-04.png.png", alt: "University 04" },
  { src: "/university-logos/university-05.png.png", alt: "University 05" },
  { src: "/university-logos/university-06.png.png", alt: "University 06" },
];

export default function UniversitiesShowcase() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-yellow-500 font-semibold tracking-wider uppercase text-sm mb-4">
            Global Opportunities
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Universities Our Students Apply To
          </h2>
        </motion.div>
      </div>

      <div className="relative max-w-[100vw] mx-auto">
        {/* Carousel Container */}
        <div className="flex overflow-hidden relative group">
          {/* Gradient Edges */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <motion.div
            className="flex gap-8 px-4 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30,
            }}
          >
            {/* Double the array for seamless infinite scroll */}
            {[...universities, ...universities].map((uni, index) => (
              <div
                key={index}
                className="w-48 sm:w-64 h-32 flex-shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center p-6 group-hover:grayscale-[0.5] hover:!grayscale-0 hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={uni.src}
                  alt={uni.alt}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
