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

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[3/2] rounded-[2rem] overflow-hidden bg-slate-100 relative shadow-xl border border-slate-200/80">
              <img
                src="/company%20image.png"
                alt="Skillsoft Overseas Education"
                className="w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Decorative background blur */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/60 blur-[80px] rounded-full pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
