import Link from "next/link";
import { GraduationCap, Facebook, Instagram, Linkedin, Youtube, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A192F] pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white border border-slate-700">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold leading-tight">Skillsoft</span>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider font-semibold">Overseas Education</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Helping students achieve their international education goals through expert guidance and personalized support.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Services</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Credibility Interview Test</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Contact</Link></li>
              <li><Link href="/portal" className="text-slate-400 hover:text-white transition-colors text-sm">Login</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-white font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">University Selection</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Course Selection</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Education Finance</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Accommodation</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Pre-Departure Support</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Visa & Documentation</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <Phone className="w-5 h-5 text-slate-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <Mail className="w-5 h-5 text-slate-500 shrink-0" />
                <span>info@skillsoftedu.com</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-5 h-5 text-slate-500 shrink-0" />
                <span className="leading-relaxed">New Delhi, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Skillsoft Overseas Education. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
