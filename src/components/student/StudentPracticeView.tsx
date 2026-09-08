import React, { useState, useEffect } from 'react';
import { storageService } from '../../lib/storage-provider';
import { PracticeQuestion } from '../../types';
import { CodeRunner } from '../common/CodeRunner';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  Code2, 
  HelpCircle, 
  Lightbulb, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Filter, 
  Award, 
  Terminal,
  Bug,
  BrainCircuit,
  Zap,
  Edit3
} from 'lucide-react';

import { ADAPTIVE_SCENARIOS } from '../../data/adaptivePractice';
import { AdaptiveScenario } from '../../types';

interface StudentPracticeViewProps {
  onOpenManageBank?: () => void;
}

export const StudentPracticeView: React.FC<StudentPracticeViewProps> = ({ onOpenManageBank }) => {
  const { user } = useAuth();
  const [practiceMode, setPracticeMode] = useState<'gym' | 'adaptive'>('gym');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [completedProblems, setCompletedProblems] = useState<Record<string, boolean>>({});
  const [questions, setQuestions] = useState<PracticeQuestion[]>(() => storageService.getPracticeQuestions());

  // Adaptive lab state
  const [activeScenarioId, setActiveScenarioId] = useState<string>('AS-U1-01');
  const [revealedPredictions, setRevealedPredictions] = useState<Record<string, boolean>>({});
  const [adaptiveMastered, setAdaptiveMastered] = useState<Record<string, boolean>>({});

  useEffect(() => {
    storageService.syncPractice().then(() => {
      setQuestions(storageService.getPracticeQuestions());
    });
  }, []);

  const allQuestions = questions;

  const filteredQuestions = allQuestions.filter(q => {
    const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    const matchUnit = selectedUnit === 'all' || q.unit === selectedUnit;
    return matchDiff && matchUnit;
  });

  const currentAdaptive = ADAPTIVE_SCENARIOS.find(s => s.id === activeScenarioId) || ADAPTIVE_SCENARIOS[0];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleHint = (id: string) => {
    setRevealedHints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSolution = (id: string) => {
    setRevealedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const markComplete = (id: string) => {
    setCompletedProblems(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 }
        });
      }
      return next;
    });
  };

  const getTypeIcon = (type: PracticeQuestion['type']) => {
    switch (type) {
      case 'output_prediction': return <Terminal className="w-3.5 h-3.5 text-amber-500" />;
      case 'debugging': return <Bug className="w-3.5 h-3.5 text-rose-500" />;
      case 'logic_building': return <BrainCircuit className="w-3.5 h-3.5 text-sky-500" />;
      case 'coding': return <Code2 className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fadeIn">
      {/* Faculty Management Banner if teacher */}
      {user?.role === 'teacher' && onOpenManageBank && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-purple-500/15 border border-sky-300 dark:border-sky-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500 text-white shadow-sm">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 dark:text-slate-100">
                Faculty Practice Bank Controls
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                You can dynamically add new problems, edit solutions, or delete existing questions in the Practice Bank Manager.
              </div>
            </div>
          </div>

          <button
            onClick={onOpenManageBank}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 shrink-0 self-start sm:self-auto"
          >
            Open Practice Bank Manager
          </button>
        </div>
      )}

      {/* Practice Header & Sub-Tabs */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Code2 className="w-6 h-6 text-sky-500" />
              <span>Python Practice & Mastery Center</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Reinforce classroom concepts with targeted drills and real-world transfer problems.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl self-start sm:self-auto">
            <button
              onClick={() => setPracticeMode('gym')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                practiceMode === 'gym'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Targeted Drills</span>
            </button>

            <button
              onClick={() => setPracticeMode('adaptive')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                practiceMode === 'adaptive'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Adaptive Real-World (12 Scenarios)</span>
            </button>
          </div>
        </div>

        {/* Filters bar for Gym mode */}
        {practiceMode === 'gym' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400 font-semibold mr-1">Difficulty:</span>
              {['all', 'basic', 'standard', 'challenge'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400 font-semibold mr-1">Unit:</span>
              <button
                onClick={() => setSelectedUnit('all')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedUnit === 'all'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All
              </button>
              {[1, 2, 3, 4, 5].map((u) => (
                <button
                  key={u}
                  onClick={() => setSelectedUnit(u)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedUnit === u
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  U{u}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {practiceMode === 'adaptive' ? (
        /* ADAPTIVE MODE VIEW IN PRACTICE TAB */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ADAPTIVE_SCENARIOS.map((sc) => {
              const isSelected = sc.id === currentAdaptive.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => setActiveScenarioId(sc.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 shadow-md ring-2 ring-sky-400/40'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-xl">{sc.emoji}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      U{sc.unit} • P{sc.periodRef}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">{sc.title}</div>
                  <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium mt-0.5">{sc.realWorldDomain}</div>
                </button>
              );
            })}
          </div>

          {/* Active scenario card */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentAdaptive.emoji}</span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{currentAdaptive.title}</h3>
                  <p className="text-xs text-slate-500">{currentAdaptive.realWorldDomain} • {currentAdaptive.topic}</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 capitalize">
                {currentAdaptive.difficulty}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-2">
              <div><strong>🌍 Everyday Problem: </strong> {currentAdaptive.realWorldSituation}</div>
              <div><strong>❓ Question: </strong> "{currentAdaptive.provocativeQuestion}"</div>
              <div><strong>🧠 Thinking & Logic: </strong> {currentAdaptive.computationalLogic}</div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Live Interactive Python Code:
              </div>
              <CodeRunner code={currentAdaptive.code} expectedOutput={currentAdaptive.expectedOutput} title={currentAdaptive.title} allowEdit={true} />
            </div>

            {/* Mini Practice */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
              <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                <span>Try It Yourself Challenge:</span>
                <button
                  onClick={() => setRevealedHints(prev => ({ ...prev, [currentAdaptive.id]: !prev[currentAdaptive.id] }))}
                  className="text-[11px] underline"
                >
                  {revealedHints[currentAdaptive.id] ? 'Hide Hint' : 'Show Hint'}
                </button>
              </div>
              <p className="text-slate-800 dark:text-slate-200">{currentAdaptive.miniPractice.challenge}</p>
              {revealedHints[currentAdaptive.id] && (
                <p className="text-amber-700 dark:text-amber-300 italic pt-1">💡 Hint: {currentAdaptive.miniPractice.hint}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD GYM VIEW */
        <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center mx-auto text-sky-600">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {allQuestions.length === 0 ? 'No Practice Questions Published Yet' : 'No Practice Problems Matched Filters'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {allQuestions.length === 0 
                ? 'Your instructor has not yet added custom problem sheets to the database. In the meantime, explore the 12 Real-World Scenarios in the Adaptive tab!'
                : 'Try adjusting your difficulty or unit filters to view other practice problems.'}
            </p>
            {allQuestions.length === 0 && (
              <button
                onClick={() => setPracticeMode('adaptive')}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:opacity-95"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Explore 12 Real-World Scenarios</span>
              </button>
            )}
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            const hasHint = revealedHints[q.id];
            const hasSolution = revealedSolutions[q.id];
            const isDone = completedProblems[q.id];

            return (
              <div
                key={q.id}
                className={`rounded-2xl border transition-all shadow-sm overflow-hidden ${
                  isDone 
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleExpand(q.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        markComplete(q.id);
                      }}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                      }`}
                      title={isDone ? 'Mark Incomplete' : 'Mark as Solved'}
                    >
                      {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                          q.difficulty === 'basic' 
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : q.difficulty === 'standard'
                            ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                            : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        }`}>
                          {q.difficulty}
                        </span>

                        <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 capitalize font-medium">
                          {getTypeIcon(q.type)}
                          <span>{q.type.replace('_', ' ')}</span>
                        </span>

                        <span className="text-[11px] text-slate-400">
                          Unit {q.unit} • Period {q.periodNumber}
                        </span>
                      </div>

                      <h3 className={`font-bold text-sm sm:text-base truncate ${isDone ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                        {q.title}
                      </h3>
                    </div>
                  </div>

                  <div className="text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    {/* Problem Statement */}
                    <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed mt-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      {q.problemStatement}
                    </div>

                    {/* Starter Code if present */}
                    {q.starterCode && (
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Starter Code / Playground:
                        </div>
                        <CodeRunner code={q.starterCode} expectedOutput={q.expectedOutput || ''} title="Practice Workspace" allowEdit={true} />
                      </div>
                    )}

                    {/* Hints Button & Box */}
                    {q.hints && q.hints.length > 0 && (
                      <div>
                        <button
                          onClick={() => toggleHint(q.id)}
                          className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
                        >
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>{hasHint ? 'Hide Hints' : 'Need a Hint?'}</span>
                        </button>

                        {hasHint && (
                          <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 space-y-1">
                            {q.hints.map((hint, hIdx) => (
                              <div key={hIdx} className="flex items-start gap-1.5">
                                <span className="font-bold">•</span>
                                <span>{hint}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Solution Reveal */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                      <button
                        onClick={() => toggleSolution(q.id)}
                        className="inline-flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-bold hover:underline"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{hasSolution ? 'Hide Model Solution' : 'Reveal Solution & Explanation'}</span>
                      </button>

                      {hasSolution && (
                        <div className="p-4 bg-sky-50/50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 rounded-xl space-y-3 text-xs">
                          {q.solutionCode && (
                            <div>
                              <div className="font-bold text-sky-900 dark:text-sky-200 mb-1">Model Python Code:</div>
                              <pre className="bg-slate-950 text-emerald-300 p-3 rounded-lg font-mono overflow-x-auto">
                                {q.solutionCode}
                              </pre>
                            </div>
                          )}

                          <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            <span className="font-bold text-sky-900 dark:text-sky-200">Explanation: </span>
                            {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      )}
    </div>
  );
};
