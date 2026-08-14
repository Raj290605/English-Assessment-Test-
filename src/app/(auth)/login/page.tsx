'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mic,
  ArrowRight,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  MessageSquareText,
  PlayCircle,
  Target,
} from 'lucide-react';

export default function StudentLoginPage() {
  const router = useRouter();

  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* Top navigation */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
              <Mic className="w-5 h-5 text-white" />
            </div>

            <div className="leading-tight">
              <p className="font-bold text-sm tracking-tight">
                Credibility Interview Test
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Student Portal
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center">

        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-8">

          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-center">

            {/* ========================================================= */}
            {/* LEFT SIDE */}
            {/* ========================================================= */}

            <section className="hidden lg:block max-w-xl">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-700 text-xs font-semibold mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Student Preparation Portal
              </div>

              {/* Heading */}
              <h1 className="text-5xl xl:text-6xl font-extrabold tracking-[-0.04em] leading-[1.05] text-slate-950">
                Prepare with
                <br />

                <span className="text-blue-600">
                  confidence.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-4 text-lg leading-7 text-slate-600 max-w-lg">
                Practice your credibility interview before your university
                interview and build confidence in answering questions clearly
                and naturally.
              </p>

              {/* Feature list */}
              <div className="mt-6 space-y-3">

                {/* Feature 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <PlayCircle className="w-4 h-4 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Practice realistic questions
                    </p>

                    <p className="text-xs text-slate-500">
                      Prepare for the questions universities may ask
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <MessageSquareText className="w-4 h-4 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Record your responses
                    </p>

                    <p className="text-xs text-slate-500">
                      Practice speaking naturally on camera
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Improve your interview readiness
                    </p>

                    <p className="text-xs text-slate-500">
                      Learn from your previous assessment attempts
                    </p>
                  </div>
                </div>

              </div>

              {/* Assessment information */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-1">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 border-2 border-slate-50 flex items-center justify-center">
                    <Mic className="w-3.5 h-3.5 text-blue-600" />
                  </div>

                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 border-2 border-slate-50 flex items-center justify-center">
                    <MessageSquareText className="w-3.5 h-3.5 text-indigo-600" />
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-50 flex items-center justify-center">
                    <Target className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    20-question speaking assessment
                  </p>

                  <p className="text-xs text-slate-500">
                    Designed for focused interview preparation
                  </p>
                </div>
              </div>

              {/* Security line */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Your assessment access is securely protected</span>
                </div>
              </div>

            </section>

            {/* ========================================================= */}
            {/* RIGHT SIDE - LOGIN CARD */}
            {/* ========================================================= */}

            <section className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">

              <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-[0_20px_70px_-20px_rgba(15,23,42,0.25)] p-7 sm:p-9">

                {/* Mobile brand */}
                <div className="lg:hidden text-center mb-8">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Student Portal
                  </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="relative">

                    <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl" />

                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Mic className="w-8 h-8 text-white" />
                    </div>

                  </div>
                </div>

                {/* Heading */}
                <div className="text-center">

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 mb-2">
                    Student Access
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                    Welcome back
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Sign in to start or continue your credibility interview
                    assessment.
                  </p>

                </div>

                {/* Error */}
                {error && (
                  <div className="mt-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-600 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Login form */}
                <form onSubmit={handleLogin} className="mt-5 space-y-4">

                  {/* Student ID */}
                  <div>
                    <label
                      htmlFor="student-id"
                      className="block text-xs font-semibold text-slate-700 mb-2"
                    >
                      Student ID
                    </label>

                    <div className="relative">

                      <User className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                      <input
                        id="student-id"
                        type="text"
                        required
                        autoComplete="username"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Enter your student ID"
                        className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />

                    </div>
                  </div>

                  {/* Password */}
                  <div>

                    <label
                      htmlFor="student-password"
                      className="block text-xs font-semibold text-slate-700 mb-2"
                    >
                      Password
                    </label>

                    <div className="relative">

                      <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                      <input
                        id="student-password"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />

                    </div>
                  </div>

                  {/* Login button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 px-5 rounded-xl bg-slate-950 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                        Authenticating...
                      </>
                    ) : (
                      <>
                        Continue to Assessment

                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>

                </form>

                {/* Security note */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />

                    <span>
                      Secure student assessment environment
                    </span>
                  </div>
                </div>

              </div>

              {/* Back button + footer */}
              <div className="mt-4 text-center space-y-2">

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
                >
                  ← Back to portal selection
                </Link>

                <p className="text-[11px] text-slate-400">
                  Credibility Interview Test · Student Preparation Portal
                </p>

              </div>

            </section>

          </div>
        </div>
      </div>
    </main>
  );
}