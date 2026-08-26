"use client";

import { motion } from "framer-motion";

export default function WhoWeAre() {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-8">
              Who We Are
            </h2>
            <div className="space-y-6 text-lg text-slate-600">
              <p>
                Skillsoft Overseas Education is a dedicated consultancy focused on bridging the gap between ambitious students and world-class international education opportunities.
              </p>
              <p>
                We understand that studying abroad is more than just an academic decision—it is a life-changing journey. That is why we focus on providing authentic, personalized guidance tailored to each student's unique profile, career aspirations, and personal preferences.
              </p>
              <p>
                Our approach is rooted in clarity and practical support. Rather than offering generic advice, we work closely with you to navigate the complexities of university selection, course alignment, financial planning, and transition preparation, ensuring you step onto your new campus with confidence.
              </p>
            </div>
          </motion.div>

          {/* Right Visual (Placeholder) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-200 relative group shadow-2xl border border-slate-100">
              {/* Placeholder Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-100 group-hover:bg-slate-200 transition-colors duration-500">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-lg font-medium tracking-widest uppercase">Company Image</span>
              </div>
            </div>
            
            {/* Decorative background blur */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 blur-[80px] rounded-full" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
