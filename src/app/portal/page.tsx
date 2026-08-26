import { redirect } from 'next/navigation';
import { getSession } from '@/lib/services/authService';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Mic, ShieldCheck, User } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      
      {/* Back to Home Button */}
      <Link 
        href="/"
        className="absolute top-6 left-6 md:top-10 md:left-10 z-20 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-all bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:shadow"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/[0.04] blur-3xl rounded-full pointer-events-none" />

      <main className="relative z-10 w-full max-w-4xl">

        {/* Brand / Heading */}
        <div className="text-center mb-12">

          {/* Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20 mb-6">
            <Mic className="w-8 h-8 text-white" />
          </div>

          {/* Eyebrow */}
          <p className="text-xs font-semibold tracking-[0.2em] text-blue-600 uppercase mb-3">
            University Interview Preparation
          </p>

          {/* Main heading */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Credibility Interview Test
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-slate-600">
            Practice your university credibility interview and build
            confidence before the real interview.
          </p>
        </div>

        {/* Portal Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">

          {/* Admin Portal */}
          <Link
            href="/admin-login"
            className="group relative rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/[0.06]"
          >
            <div className="flex flex-col h-full">

              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-6 transition-colors duration-200 group-hover:bg-slate-900 group-hover:text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900">
                  Admin Portal
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Review student assessments, evaluate responses and manage interview results.
                </p>
              </div>

              <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-slate-700">
                Enter Portal
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>

            </div>
          </Link>

          {/* Student Portal */}
          <Link
            href="/login"
            className="group relative rounded-2xl border border-blue-200 bg-white p-7 sm:p-8 transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-600/[0.08]"
          >
            <div className="flex flex-col h-full">

              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white">
                <User className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900">
                  Student Portal
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Practice your credibility interview, complete assessments and review your results.
                </p>
              </div>

              <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-blue-600">
                Enter Portal
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>

            </div>
          </Link>

        </div>

        {/* Trust Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-400">
            Secure • Private • Professional Interview Preparation
          </p>
        </div>

      </main>
    </div>
  );
}