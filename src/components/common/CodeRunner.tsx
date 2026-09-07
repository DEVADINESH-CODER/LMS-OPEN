import React, { useState } from 'react';
import { Play, Copy, Check, Terminal, RotateCcw } from 'lucide-react';

interface CodeRunnerProps {
  code: string;
  expectedOutput: string;
  title?: string;
  allowEdit?: boolean;
}

export const CodeRunner: React.FC<CodeRunnerProps> = ({ 
  code, 
  expectedOutput, 
  title = "Python Code Example",
  allowEdit = false 
}) => {
  const [currentCode, setCurrentCode] = useState(code);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setOutput(null);

    // Simulate Python execution delay
    setTimeout(() => {
      setOutput(expectedOutput);
      setIsRunning(false);
    }, 450);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCurrentCode(code);
    setOutput(null);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-[#0d1117] shadow-xl my-4 text-sm font-mono">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-800 text-slate-300">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
          </div>
          <span className="text-xs text-sky-400 font-semibold">{title}</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">python 3.11</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>

          {allowEdit && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800"
              title="Reset Code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1 text-xs text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 px-3 py-1 rounded transition-colors font-sans font-semibold disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-pulse' : ''}`} />
            <span>{isRunning ? "Running..." : "Run Code"}</span>
          </button>
        </div>
      </div>

      {/* Code Editor / Viewer */}
      <div className="p-4 overflow-x-auto text-[#e6edf3] leading-relaxed">
        {allowEdit ? (
          <textarea
            value={currentCode}
            onChange={(e) => setCurrentCode(e.target.value)}
            className="w-full bg-transparent resize-y outline-none font-mono text-xs sm:text-sm text-[#e6edf3] min-h-[120px]"
            spellCheck={false}
          />
        ) : (
          <pre className="text-xs sm:text-sm whitespace-pre">{currentCode}</pre>
        )}
      </div>

      {/* Simulated Output Terminal */}
      {output !== null && (
        <div className="border-t border-slate-800 bg-[#090d16] p-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400 mb-2 pb-1 border-b border-slate-800/80">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] font-semibold text-slate-300">Terminal Output (stdout)</span>
          </div>
          <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">{output}</pre>
        </div>
      )}
    </div>
  );
};
