"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactLayout() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");
    
    // Simulate network request
    setTimeout(() => {
      setFormState("success");
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormState("idle");
        (e.target as HTMLFormElement).reset();
      }, 3000);
    }, 1500);
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-yellow-400/10 blur-[100px] rounded-full pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Let's Get in Touch</h2>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Have questions about your overseas education journey? Fill out the form below and our experts will reach out to you.
            </p>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-2xl shadow-blue-900/5 p-8 sm:p-12 relative overflow-hidden ring-1 ring-slate-100">
              
              {/* Form Success State Overlay */}
              {formState === "success" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center text-center p-8"
                >
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent</h3>
                  <p className="text-slate-500">We have received your message and will get back to you shortly.</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-slate-700">Subject</label>
                    <input 
                      type="text" 
                      id="subject"
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formState === "submitting" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
