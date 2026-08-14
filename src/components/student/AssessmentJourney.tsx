import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';

interface AssessmentJourneyProps {
  status: string;
  assessment: any;
}

export function AssessmentJourney({ status, assessment }: AssessmentJourneyProps) {
  // Determine current active step (1-indexed for logic)
  let currentStepIndex = 1;
  if (status === 'IN_PROGRESS') currentStepIndex = 1;
  if (status === 'SUBMITTED') currentStepIndex = 2; // In this design, Under Evaluation is stage 3, but once submitted, it is IN the evaluation queue. Let's make UNDER EVALUATION the active step if SUBMITTED.
  if (status === 'EVALUATED') currentStepIndex = 4;

  // Since we only have NOT_STARTED, IN_PROGRESS, SUBMITTED, EVALUATED
  if (status === 'SUBMITTED') {
    currentStepIndex = 3; // "Under Evaluation" is the active step
  } else if (status === 'IN_PROGRESS') {
    currentStepIndex = 1; // "Started" is active (or maybe Submitted is the next step to reach)
  }

  const stages = [
    { label: 'Started', key: 'STARTED' },
    { label: 'Submitted', key: 'SUBMITTED' },
    { label: 'Under Evaluation', key: 'EVALUATING' },
    { label: 'Results', key: 'RESULTS' },
  ];

  const getDateStr = (date: any) => {
    if (!date) return 'Pending';
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStageDate = (index: number) => {
    if (!assessment) return 'Pending';
    if (index === 0) return getDateStr(assessment.createdAt);
    if (index === 1) {
      if (status === 'SUBMITTED' || status === 'EVALUATED') return getDateStr(assessment.submittedAt || assessment.updatedAt);
      return 'Pending';
    }
    if (index === 2) {
      if (status === 'SUBMITTED') return 'In progress';
      if (status === 'EVALUATED') return 'Completed';
      return 'Pending';
    }
    if (index === 3) {
      if (status === 'EVALUATED') return getDateStr(assessment.evaluation?.createdAt || assessment.updatedAt);
      return 'Pending';
    }
    return 'Pending';
  };

  // Helper to render the circles
  const renderCircle = (index: number) => {
    const isCompleted = index < currentStepIndex - 1 || (index === 3 && status === 'EVALUATED');
    const isActive = index === currentStepIndex - 1 && status !== 'EVALUATED';

    if (isCompleted) {
      return (
        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center z-10 shrink-0">
          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
        </div>
      );
    }
    if (isActive) {
      return (
        <div className="w-6 h-6 rounded-full border-2 border-blue-600 bg-white z-10 shrink-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
      );
    }
    return (
      <div className="w-6 h-6 rounded-full border-2 border-slate-200 bg-white z-10 shrink-0" />
    );
  };

  const renderInfoBox = () => {
    if (status === 'SUBMITTED') {
      return (
        <div className="mt-8 bg-emerald-50/50 rounded-lg border border-emerald-100 p-4 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-slate-900 leading-tight mb-1">Your assessment is currently under evaluation.</div>
            <div className="text-[13px] text-slate-600">You will be notified once your results are ready.</div>
          </div>
        </div>
      );
    }
    if (status === 'EVALUATED') {
      return (
        <div className="mt-8 bg-blue-50/50 rounded-lg border border-blue-100 p-4 flex gap-3">
          <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-slate-900 leading-tight mb-1">Your assessment has been evaluated.</div>
            <div className="text-[13px] text-slate-600">You can now view your detailed results and feedback.</div>
          </div>
        </div>
      );
    }
    if (status === 'IN_PROGRESS') {
      return (
        <div className="mt-8 bg-amber-50/50 rounded-lg border border-amber-100 p-4 flex gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-slate-900 leading-tight mb-1">Your assessment is in progress.</div>
            <div className="text-[13px] text-slate-600">Complete and submit your responses to proceed.</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col h-full">
      <h3 className="text-[15px] font-bold text-slate-900 mb-10">Assessment Journey</h3>
      
      <div className="flex-1 flex flex-col justify-center">
        {/* Stepper container */}
        <div className="relative flex justify-between items-start w-full px-2 max-w-[500px] mx-auto">
          {/* Background Line */}
          <div className="absolute top-3 left-4 right-4 h-[2px] bg-slate-100 -z-0" />
          
          {/* Active Line */}
          <div 
            className="absolute top-3 left-4 h-[2px] bg-emerald-500 -z-0 transition-all duration-700" 
            style={{ 
              width: status === 'EVALUATED' ? '100%' : `${((currentStepIndex - 1) / (stages.length - 1)) * 100}%`,
              maxWidth: 'calc(100% - 32px)'
            }} 
          />

          {stages.map((stage, index) => {
            const isActive = index === currentStepIndex - 1 && status !== 'EVALUATED';
            return (
              <div key={stage.key} className="flex flex-col items-center z-10 w-24 relative -ml-10 first:ml-0 last:mr-0">
                {renderCircle(index)}
                <div className={`mt-3 text-[12px] font-semibold text-center leading-tight ${isActive ? 'text-blue-600' : 'text-slate-800'}`}>
                  {stage.label}
                </div>
                <div className={`mt-1 text-[11px] text-center ${isActive ? 'text-blue-500 font-medium' : 'text-slate-400'}`}>
                  {getStageDate(index)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        {renderInfoBox()}
      </div>
    </div>
  );
}
