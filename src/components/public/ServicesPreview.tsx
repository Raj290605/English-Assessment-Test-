"use client";

import { motion } from "framer-motion";
import { ArrowRight, Building2, GraduationCap, Calculator, Home } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Building2,
    title: "University Selection",
    description: "Find the right universities that match your profile, goals and preferences.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: GraduationCap,
    title: "Course Selection",
    description: "Choose the best courses aligned with your interests and career aspirations.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Calculator,
    title: "Education Finance",
    description: "Guidance on education loans and financial planning to fund your dreams.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: Home,
    title: "Accommodation & Pre-Departure",
    description: "Assistance with accommodation and everything you need before you take off.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

export default function ServicesPreview() {
  return (
    <section id="services" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-yellow-500 font-semibold tracking-wider uppercase text-sm mb-4">
              How We Help
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Comprehensive Support <br />
              <span className="text-blue-600">For Every Step</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors group"
            >
              Explore All Services
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${service.bgColor} ${service.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-slate-500 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
