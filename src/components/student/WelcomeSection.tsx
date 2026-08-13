import React from 'react';

interface WelcomeSectionProps {
  user: { name: string; studentId: string };
  status: string;
}

export function WelcomeSection({ user, status }: WelcomeSectionProps) {
  const getWelcomeMessage = () => {
    switch (status) {
      case 'NOT_STARTED':
        return "You're ready to begin your assessment. Review the guidelines before starting.";
      case 'IN_PROGRESS':
        return "Continue your assessment and complete your remaining responses.";
      case 'SUBMITTED':
        return "Your assessment has been submitted and is awaiting evaluation.";
      case 'EVALUATED':
        return "Your assessment has been evaluated. Review your results and feedback below.";
      default:
        return "Track your progress and review feedback below.";
    }
  };

  return (
    <div className="pt-2 pb-2">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
        Good morning, {user.name}
      </h2>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5">
        {getWelcomeMessage()}
      </p>
    </div>
  );
}
