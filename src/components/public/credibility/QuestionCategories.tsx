"use client";

import { motion } from "framer-motion";
import { User, BookOpen, MapPin, Building2, Briefcase, GraduationCap } from "lucide-react";

const categories = [
  {
    icon: User,
    title: "Personal Background",
    description: "Questions regarding your personal history, motivations, and overall readiness for international study.",
  },
  {
    icon: GraduationCap,
    title: "Academic History",
    description: "Inquiries about your previous qualifications, study gaps, and how they relate to your chosen degree.",
  },
  {
    icon: BookOpen,
    title: "Course Choice",
    description: "Detailed questions about the modules, structure, and academic expectations of your selected program.",
  },
  {
    icon: Building2,
    title: "University Choice",
    description: "Why you selected this specific institution over others, including its facilities and location.",
  },
  {
    icon: MapPin,
    title: "Destination Choice",
    description: "Your understanding of the country you are moving to and why it is the best fit for your education.",
  },
  {
    icon: Briefcase,
    title: "Future Career Plans",
    description: "How this specific degree from this specific institution will impact your long-term career trajectory.",
  },
];

export default function QuestionCategories() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-4">
              Comprehensive Practice
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              What You May Be Asked
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              The platform prepares you across all major areas typically covered during a credibility interview.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {category.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
