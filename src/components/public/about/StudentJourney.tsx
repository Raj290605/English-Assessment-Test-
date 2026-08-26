"use client";

import { motion } from "framer-motion";
import { Search, MapPin, FileCheck, BookOpen, PlaneTakeoff } from "lucide-react";

const journeySteps = [
  {
    icon: Search,
    title: "Discover",
    description: "Identify your academic goals, interests, and the best potential pathways for your future.",
  },
  {
    icon: MapPin,
    title: "Choose",
    description: "Select the right universities and programs that perfectly align with your profile.",
  },
  {
    icon: FileCheck,
    title: "Apply",
    description: "Navigate the application process with expert guidance on documentation and requirements.",
  },
  {
    icon: BookOpen,
    title: "Prepare",
    description: "Practice for credibility interviews and organize your educational finances securely.",
  },
  {
    icon: PlaneTakeoff,
    title: "Move Forward",
    description: "Secure your visa, finalize accommodation, and step confidently onto your new campus.",
  },
];

export default function StudentJourney() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-4">
              How We Support Students
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Your Journey With Us
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              We provide comprehensive support across every stage of your international education transition.
            </p>
          </motion.div>
        </div>

        {/* Desktop Horizontal Journey */}
        <div className="hidden lg:block relative mt-24 pb-12">
          {/* Connecting Line */}
          <div className="absolute top-8 left-[10%] right-[10%] h-0.5 bg-slate-200" />
          
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
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Node */}
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6 relative z-10 text-blue-600">
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile/Tablet Vertical Journey */}
        <div className="lg:hidden relative mt-12 max-w-lg mx-auto">
          {/* Connecting Line */}
          <div className="absolute top-8 bottom-8 left-8 w-0.5 bg-slate-200" />
          
          <div className="space-y-12">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex gap-6"
                >
                  {/* Node */}
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0 relative z-10 text-blue-600">
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  {/* Content */}
                  <div className="pt-2">
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
