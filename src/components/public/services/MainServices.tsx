"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const servicesList = [
  {
    id: "01",
    title: "University Selection",
    description: "Identify suitable universities based on your academic profile, preferences, destination, and long-term goals. We help you build a balanced list of ambitious, realistic, and safe options.",
    imageSrc: "/images/services/university-selection.jpg",
    altText: "Student discussing university options with an education counsellor",
  },
  {
    id: "02",
    title: "Course Selection",
    description: "Choose appropriate courses and programs based on your interests, academic background, and future career plans. We ensure your degree path aligns with your true aspirations.",
    imageSrc: "/images/services/course-selection.jpg",
    altText: "Student discussing academic course options with an education counsellor",
  },
  {
    id: "03",
    title: "Application Guidance",
    description: "Navigate the complex application process with expert support. From organizing transcripts to reviewing requirements, we ensure your submissions are accurate and timely.",
    imageSrc: "/images/services/application-guidance.jpg",
    altText: "Education counsellor helping a student with a university application",
  },
  {
    id: "04",
    title: "Education Loans & Financial Guidance",
    description: "Understand and navigate available education-financing options. We help you explore scholarships and structure a clear plan to fund your international education.",
    imageSrc: "/images/services/education-loans.jpg",
    altText: "Student receiving education financing guidance from a counsellor",
  },
  {
    id: "05",
    title: "Accommodation",
    description: "Find secure and comfortable housing near your chosen campus. We assist in exploring on-campus and off-campus living arrangements tailored to your budget.",
    imageSrc: "/images/services/accommodation.jpg",
    altText: "Student exploring overseas accommodation options with an education counsellor",
  },
  {
    id: "06",
    title: "Visa & Documentation Support",
    description: "Navigate the documentation and visa-preparation process with clarity. We guide you through the requirements to ensure a smooth transition.",
    imageSrc: "/images/services/visa-documentation.jpg",
    altText: "Education counsellor helping a student prepare visa documentation",
  },
  {
    id: "07",
    title: "Pre-Departure Support",
    description: "Prepare for the practical aspects of moving abroad. From travel checklists to cultural adaptation tips, we ensure you are ready before you even take off.",
    imageSrc: "/images/services/pre-departure-support.jpg",
    altText: "Student receiving final pre-departure guidance before studying abroad",
  },
];

export default function MainServices() {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        {servicesList.map((service, index) => {
          const isEven = index % 2 === 1;
          
          return (
            <div 
              key={service.id} 
              className={`flex flex-col gap-12 lg:gap-24 items-center ${
                isEven ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="flex-1 w-full"
              >
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-5xl md:text-7xl font-bold text-slate-200 select-none">
                    {service.id}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                    {service.title}
                  </h3>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed max-w-xl pl-16 md:pl-24">
                  {service.description}
                </p>
              </motion.div>

              {/* Visual Placeholder */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1 w-full relative"
              >
                <div className="aspect-video rounded-[2.5rem] bg-slate-200 border border-slate-100 shadow-2xl relative overflow-hidden group">
                  <Image
                    src={service.imageSrc}
                    alt={service.altText}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Subtle ambient blur */}
                <div className={`absolute -z-10 top-1/2 ${isEven ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 blur-[80px] rounded-full`} />
              </motion.div>
              
            </div>
          );
        })}
      </div>
    </section>
  );
}
