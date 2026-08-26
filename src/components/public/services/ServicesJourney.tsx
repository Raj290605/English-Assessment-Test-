"use client";

import { motion } from "framer-motion";
import { Search, MapPin, FileCheck, BookOpen, PlaneTakeoff } from "lucide-react";

const journeySteps = [
  {
    icon: Search,
    title: "Explore",
    description: "Identify options tailored to you.",
  },
  {
    icon: MapPin,
    title: "Choose",
    description: "Select the perfect university fit.",
  },
  {
    icon: FileCheck,
    title: "Apply",
    description: "Submit strong, organized applications.",
  },
  {
    icon: BookOpen,
    title: "Prepare",
    description: "Navigate interviews and finances.",
  },
  {
    icon: PlaneTakeoff,
    title: "Move Forward",
    description: "Secure housing and transition smoothly.",
  },
];

export default function ServicesJourney() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              A Connected Journey
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Our services are not isolated offerings. They integrate seamlessly to support you from your first idea to your first day on campus.
            </p>
          </motion.div>
        </div>

        {/* Desktop Horizontal Journey */}
        <div className="hidden lg:block relative pb-12">
          {/* Connecting Line */}
          <div className="absolute top-10 left-[10%] right-[10%] h-px bg-slate-200" />
          
          <div className="grid grid-cols-5 gap-8">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Node */}
                  <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-6 relative z-10 text-slate-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:scale-110">
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed px-4">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile/Tablet Vertical Journey */}
        <div className="lg:hidden relative max-w-sm mx-auto">
          {/* Connecting Line */}
          <div className="absolute top-10 bottom-10 left-10 w-px bg-slate-200" />
          
          <div className="space-y-16">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex gap-8 group"
                >
                  {/* Node */}
                  <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 relative z-10 text-slate-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl">
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  {/* Content */}
                  <div className="pt-3">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
