import React from 'react';
import Link from 'next/link';
import { ArrowRight, Lightbulb, Play, RotateCcw, BarChart2 } from 'lucide-react';

interface WhatsNextCardProps {
  status: string;
}

export function WhatsNextCard({ status }: WhatsNextCardProps) {
  const config = {
    NOT_STARTED: {
      text: 'Your assessment is ready when you are.',
      ctaText: 'Start Now',
      ctaHref: '/assessment',
      ctaIcon: <Play className="w-3.5 h-3.5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    IN_PROGRESS: {
      text: 'Continue your assessment from where you left off.',
      ctaText: 'Resume',
      ctaHref: '/assessment',
      ctaIcon: <ArrowRight className="w-3.5 h-3.5" />,
      color: 'bg-amber-600 hover:bg-amber-700',
    },
    SUBMITTED: {
      text: 'Your responses are being reviewed. Check back soon.',
      ctaText: 'View Dashboard',
      ctaHref: '/dashboard',
      ctaIcon: <ArrowRight className="w-3.5 h-3.5" />,
      color: 'bg-slate-600 hover:bg-slate-700',
    },
    EVALUATED: {
      text: 'Your latest assessment has been evaluated. Review your feedback or start another attempt.',
      ctaText: 'View Feedback',
      ctaHref: '/dashboard/results',
      ctaIcon: <BarChart2 className="w-3.5 h-3.5" />,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  } as Record<string, any>;

  const c = config[status] ?? config['NOT_STARTED'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full pointer-events-none opacity-50" />
      
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">What's Next?</h3>
      </div>
      
      <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
        {c.text}
      </p>
      
      <div className="mt-auto">
        <Link
          href={c.ctaHref}
          className={`inline-flex items-center gap-2 h-9 px-5 ${c.color} text-white font-semibold text-sm rounded-lg transition-colors shadow-sm`}
        >
          {c.ctaText} {c.ctaIcon}
        </Link>
      </div>
    </div>
  );
}
