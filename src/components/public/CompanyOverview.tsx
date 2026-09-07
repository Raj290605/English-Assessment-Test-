"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CompanyOverview() {

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-yellow-500 font-semibold tracking-wider uppercase text-sm mb-4">
              Who We Are
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.2] mb-6">
              Your Journey. <br />
              <span className="text-blue-600">Our Guidance.</span>
            </h2>
            <div className="space-y-6 text-lg text-slate-600">
              <p>
                We are an overseas education consultancy dedicated to helping students make informed decisions and achieve their academic goals abroad.
              </p>
              <p>
                With expert guidance, personalized support and end-to-end assistance, we turn your aspirations into achievable milestones.
              </p>
            </div>
            
            <div className="mt-10">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
              >
                Learn More About Us
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Right Visual (Graduation Video) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-900 relative group shadow-2xl">
              {/* Graduation Image */}
              <img
                src="/graduation image.png"
                alt="Students Graduating"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Overlay for visual contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
            </div>
            
            {/* Decorative background blob */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100 blur-[80px] rounded-full" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
