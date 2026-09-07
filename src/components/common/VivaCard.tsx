import React, { useState } from 'react';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';

interface VivaCardProps {
  question: string;
  expectedAnswer: string;
  index: number;
}

export const VivaCard: React.FC<VivaCardProps> = ({ question, expectedAnswer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-indigo-200 dark:border-indigo-900/60 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm my-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 text-left text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">
            Q{index + 1}
          </span>
          <span className="font-semibold">{question}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-indigo-50/20 dark:bg-indigo-950/10">
          <div className="flex items-start gap-2 mt-2">
            <Award className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-indigo-900 dark:text-indigo-300">Model Viva Answer: </span>
              {expectedAnswer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
