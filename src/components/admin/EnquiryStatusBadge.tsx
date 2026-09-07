import React from 'react';

type EnquiryStatusType = 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'CONVERTED' | 'CLOSED';

interface EnquiryStatusBadgeProps {
  status: EnquiryStatusType;
}

const STATUS_CONFIG: Record<
  EnquiryStatusType,
  { label: string; dotColor: string; bgColor: string; textColor: string; borderColor: string }
> = {
  NEW: {
    label: 'New',
    dotColor: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  CONTACTED: {
    label: 'Contacted',
    dotColor: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
  FOLLOW_UP: {
    label: 'Follow Up',
    dotColor: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
  },
  CONVERTED: {
    label: 'Converted',
    dotColor: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
  CLOSED: {
    label: 'Closed',
    dotColor: 'bg-slate-400',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-200',
  },
};

export function EnquiryStatusBadge({ status }: EnquiryStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.NEW;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} inline-block`} />
      {config.label}
    </span>
  );
}
