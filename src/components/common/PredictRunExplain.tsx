import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface PredictRunExplainProps {
  snippet: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export const PredictRunExplain: React.FC<PredictRunExplainProps> = ({
  snippet,
  options,
  correctAnswerIndex,
  explanation
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSelect = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedAnswer(idx);
    setHasSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setHasSubmitted(false);
  };

  const isCorrect = selectedAnswer === correctAnswerIndex;

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-5 my-6 shadow-sm">
      {/* Badge Header */}
      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm mb-3">
        <HelpCircle className="w-4 h-4" />
        <span>Predict → Run → Explain Challenge</span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
        Before looking at the answer or running the code, train your brain to act like the Python interpreter. What will this print?
      </p>

      {/* Code Snippet Box */}
      <div className="rounded-lg bg-slate-900 text-slate-100 p-3 font-mono text-xs sm:text-sm my-3 border border-slate-800">
        <pre>{snippet}</pre>
      </div>

      {/* Prediction Options */}
      <div className="space-y-2 mt-4">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Choose your prediction:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {options.map((option, idx) => {
            let btnStyle = "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-400 text-slate-800 dark:text-slate-200";

            if (hasSubmitted) {
              if (idx === correctAnswerIndex) {
                btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-semibold";
              } else if (idx === selectedAnswer) {
                btnStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 line-through";
              } else {
                btnStyle = "opacity-50 border-slate-200 dark:border-slate-800";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={hasSubmitted}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm text-left transition-all ${btnStyle}`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-mono">{option}</span>
                </div>
                {hasSubmitted && idx === correctAnswerIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                )}
                {hasSubmitted && idx === selectedAnswer && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result & Explanation */}
      {hasSubmitted && (
        <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-900/60 animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Brilliant! Your mental model matches Python's interpreter.</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <XCircle className="w-4 h-4" />
                  <span>Not quite! Don't worry, this is a very common beginner prediction.</span>
                </div>
              )}
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
            >
              Try Again
            </button>
          </div>

          <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-slate-900 dark:text-slate-100">Why this happens: </span>
              {explanation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
