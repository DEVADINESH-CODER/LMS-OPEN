import React, { useState } from 'react';
import { Bug, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface DebugCardProps {
  buggyCode: string;
  commonMistakeWhy: string;
  fixedCode: string;
  explanation: string;
}

export const DebugCard: React.FC<DebugCardProps> = ({
  buggyCode,
  commonMistakeWhy,
  fixedCode,
  explanation
}) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="rounded-xl border border-rose-500/30 bg-rose-50/40 dark:bg-rose-950/20 p-5 my-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold text-sm">
          <Bug className="w-4 h-4" />
          <span>Debug This: Common Beginner Mistake</span>
        </div>

        <button
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2.5 py-1 rounded-md hover:bg-rose-200 dark:hover:bg-rose-800 transition-colors font-medium"
        >
          {showSolution ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hide Solution</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Reveal Fix</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
        {/* Broken Code */}
        <div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1.5">
            <AlertTriangle className="w-3 h-3" />
            <span>Broken Code (Find the defect)</span>
          </div>
          <div className="bg-[#1f1618] border border-rose-900/60 rounded-lg p-3 text-xs font-mono text-rose-200 overflow-x-auto">
            <pre>{buggyCode}</pre>
          </div>
        </div>

        {/* Fixed Code */}
        <div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5">
            <Check className="w-3 h-3" />
            <span>Corrected Python Code</span>
          </div>
          <div className="bg-[#121c17] border border-emerald-900/60 rounded-lg p-3 text-xs font-mono text-emerald-200 overflow-x-auto">
            {showSolution ? (
              <pre>{fixedCode}</pre>
            ) : (
              <div className="py-6 text-center text-slate-500 italic text-xs">
                Click "Reveal Fix" to compare
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Why this mistake happens */}
      <div className="mt-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-900/70 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
        <span className="font-semibold text-rose-800 dark:text-rose-300">Why beginners make this mistake: </span>
        {commonMistakeWhy}
      </div>

      {showSolution && (
        <div className="mt-2 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed bg-emerald-50/80 dark:bg-emerald-950/40 p-3 rounded-lg border border-emerald-300 dark:border-emerald-800">
          <span className="font-semibold">Key Takeaway: </span>
          {explanation}
        </div>
      )}
    </div>
  );
};
