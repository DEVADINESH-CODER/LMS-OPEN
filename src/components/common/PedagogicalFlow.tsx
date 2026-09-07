import React from 'react';
import { Compass } from 'lucide-react';

const STEPS = [
  'Real-life Situation',
  'Problem Context',
  'Student Thinking',
  'Logic Formulation',
  'Python Concept',
  'Code Execution',
  'Output Analysis',
  'Step Explanation',
  'Modification',
  'Targeted Practice',
  'Viva Application'
];

interface PedagogicalFlowProps {
  currentStep?: number;
}

export const PedagogicalFlow: React.FC<PedagogicalFlowProps> = ({ currentStep = 5 }) => {
  return (
    <div className="bg-slate-100 dark:bg-slate-900/90 rounded-xl p-3 border border-slate-200 dark:border-slate-800 my-4 text-xs">
      <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 mb-2">
        <Compass className="w-3.5 h-3.5 text-sky-500" />
        <span>Teaching Flow: Real-life Situation → Logic → Python → Practice</span>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
        {STEPS.map((step, idx) => {
          const isPassed = idx < currentStep;
          const isCurrent = idx === currentStep;

          let badgeClass = "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400";
          if (isCurrent) {
            badgeClass = "bg-sky-600 text-white font-bold shadow-sm ring-2 ring-sky-300 dark:ring-sky-800";
          } else if (isPassed) {
            badgeClass = "bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-medium";
          }

          return (
            <React.Fragment key={idx}>
              <div className={`px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1 ${badgeClass}`}>
                <span>{idx + 1}.</span>
                <span>{step}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <span className="text-slate-300 dark:text-slate-700 select-none">→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
