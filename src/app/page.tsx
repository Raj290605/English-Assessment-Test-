import { redirect } from 'next/navigation';
import { getSession } from '@/lib/services/authService';
import Link from 'next/link';
import { Mic, ShieldCheck, User } from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeProvider';

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    if (session.role === 'ADMIN') {
      redirect('/admin/dashboard');
    } else {
      redirect('/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-200">
      {/* Theme toggle top-right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-8 relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-2xl shadow-blue-500/30 mb-2">
          <Mic className="w-10 h-10 text-white" />
        </div>

        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            English Assessment Platform
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
            Professional 20-question video speaking evaluation portal for students and evaluators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <Link
            href="/login"
            className="group glass-panel p-6 flex flex-col items-center justify-center hover:border-blue-500/50 transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Portal</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Take speaking assessment</p>
          </Link>

          <Link
            href="/admin-login"
            className="group glass-panel p-6 flex flex-col items-center justify-center hover:border-emerald-500/50 transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Portal</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review & grade assessments</p>
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-mono">
          Secure Cloudinary Private Media &bull; Next.js 14 &bull; 20-Question Rubric
        </div>
      </div>
    </div>
  );
}