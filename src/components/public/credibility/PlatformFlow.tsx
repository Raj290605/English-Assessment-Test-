"use client";

import { motion } from "framer-motion";

const flowSteps = [
  {
    step: "01",
    title: "Log In",
    description: "Access the secure assessment platform using your student credentials.",
  },
  {
    step: "02",
    title: "Receive Questions",
    description: "Be presented with interview-style questions across different topics.",
  },
  {
    step: "03",
    title: "Record Answer",
    description: "Use your microphone or camera to record your response securely in the browser.",
  },
  {
    step: "04",
    title: "Submit",
    description: "Complete the assessment and submit your responses for evaluation.",
  },
  {
    step: "05",
    title: "Review & Improve",
    description: "Receive constructive feedback to help you refine and strengthen your answers.",
  },
];

export default function PlatformFlow() {
  return (
    <section id="how-it-works" className="py-24 bg-[#0A192F] relative overflow-hidden text-white">
      {/* Ambient background effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How the Platform Works
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A streamlined, professional experience designed to mirror real interview conditions.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-[2.25rem] left-[5%] right-[5%] h-px bg-slate-800" />
          
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-4 relative">
            {flowSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-row lg:flex-col items-start lg:items-center text-left lg:text-center gap-6 lg:gap-0 group"
              >
                {/* Number Node */}
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-slate-700 flex flex-shrink-0 items-center justify-center text-xl font-bold text-yellow-500 mb-0 lg:mb-6 relative z-10 group-hover:bg-yellow-500 group-hover:text-slate-900 group-hover:border-yellow-500 transition-all duration-300 shadow-xl backdrop-blur-sm">
                  {item.step}
                </div>
                
                {/* Content */}
                <div className="pt-2 lg:pt-0">
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed lg:px-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
