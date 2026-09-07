import React, { useState } from 'react';
import { MASTER_45_PERIODS } from '../../data/masterPlan';
import { useClass } from '../../context/ClassContext';
import { MasterPeriod } from '../../types';
import { storageService } from '../../lib/storage-provider';
import { 
  Send, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  Compass, 
  Code, 
  Sparkles, 
  Search, 
  Lock, 
  HelpCircle, 
  Bug, 
  BookOpen, 
  ArrowRight, 
  ClipboardList, 
  CheckCircle2, 
  Filter,
  RotateCcw,
  Edit3
} from 'lucide-react';

interface MasterPlanViewProps {
  onPublishPeriod: (periodNumber: number) => void;
}

export const MasterPlanView: React.FC<MasterPlanViewProps> = ({ onPublishPeriod }) => {
  const { classes, activeClassId } = useClass();
  const [phaseFilter, setPhaseFilter] = useState<'all' | 'Concept' | 'Practical'>('all');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPeriod, setExpandedPeriod] = useState<number | null>(1);
  const [showCheckpointModal, setShowCheckpointModal] = useState<MasterPeriod | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const classLessons = storageService.getClassLessons(activeClassId);
  const publishedPeriodNumbers = new Set(classLessons.filter(l => l.status === 'published').map(l => l.periodNumber));

  const handleRevertPeriod = (periodNumber: number, topic: string) => {
    if (window.confirm(`Unpublish Period ${periodNumber} ("${topic}") for Class ${activeClassId}?\n\nThis will revert the lesson to draft and remove it from students' Today view.`)) {
      storageService.unpublishLesson(activeClassId, periodNumber);
      setRefreshKey(prev => prev + 1);
    }
  };

  const filteredPeriods = MASTER_45_PERIODS.filter(p => {
    const matchPhase = phaseFilter === 'all' || p.phase === phaseFilter;
    const matchUnit = selectedUnit === 'all' || p.unit === selectedUnit;
    const matchQuery = p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.periodNumber.toString() === searchQuery ||
                       (p.realWorldAnchor && p.realWorldAnchor.toLowerCase().includes(searchQuery.toLowerCase())) ||
                       p.learningObjective.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPhase && matchUnit && matchQuery;
  });

  const togglePeriod = (pNum: number) => {
    setExpandedPeriod(expandedPeriod === pNum ? null : pNum);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Python Programming (19AI301/CS3301)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              45-Period Teaching Roadmap & Master Plan
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Official curriculum: 30 Concept Periods (Units I–V) + 15 Practical Execution Periods (Stages 1–7). Role-separated with teacher pedagogical instructions.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 text-xs text-slate-300">
            <span className="font-bold text-sky-400">Class Progress Status:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">C1 112: Period 12</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">C2 147: Period 10</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">C3 091: Period 8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3">
        {/* Phase Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setPhaseFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                phaseFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All 45 Periods
            </button>
            <button
              onClick={() => setPhaseFilter('Concept')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                phaseFilter === 'Concept'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              📘 Concept Phase (P1–30)
            </button>
            <button
              onClick={() => setPhaseFilter('Practical')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                phaseFilter === 'Practical'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              💻 Practical Execution (P31–45)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search concept, anchor, or P#..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Unit Sub-filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium text-slate-500 dark:text-slate-400 pb-1">
          <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            <Filter className="w-3 h-3" /> Filter Unit:
          </span>
          <button
            onClick={() => setSelectedUnit('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
              selectedUnit === 'all'
                ? 'bg-sky-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Units
          </button>
          {[1, 2, 3, 4, 5].map((u) => (
            <button
              key={u}
              onClick={() => setSelectedUnit(u)}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                selectedUnit === u
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Unit {u}
            </button>
          ))}
        </div>
      </div>

      {/* 45 Periods Accordion List */}
      <div className="space-y-3">
        {filteredPeriods.map((period) => {
          const isExpanded = expandedPeriod === period.periodNumber;

          return (
            <div
              key={period.periodNumber}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all"
            >
              {/* Card Header */}
              <div
                onClick={() => togglePeriod(period.periodNumber)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-sm ${
                    period.phase === 'Concept'
                      ? 'bg-gradient-to-br from-sky-500 to-indigo-600 shadow-sky-500/20'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-700 shadow-emerald-500/20'
                  }`}>
                    P{period.periodNumber}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        period.phase === 'Concept'
                          ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {period.stage ? period.stage : `Unit ${period.unit}: ${period.unitName}`}
                      </span>

                      {period.realWorldAnchor && (
                        <span className="text-slate-400 hidden md:inline truncate max-w-xs">
                          ⚓ {period.realWorldAnchor}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                      {period.topic}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCheckpointModal(period);
                    }}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Open Teacher Daily Checkpoint"
                  >
                    <ClipboardList className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden md:inline">Checkpoint</span>
                  </button>

                  {publishedPeriodNumbers.has(period.periodNumber) ? (
                    <div className="flex items-center gap-1.5">
                      <span className="hidden lg:inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        Live in {activeClassId}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRevertPeriod(period.periodNumber, period.topic);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800 text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Revert to Draft (Unpublish)"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Revert</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPublishPeriod(period.periodNumber);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Edit Published Lesson"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPublishPeriod(period.periodNumber);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Publish to Class</span>
                    </button>
                  )}

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
                  
                  {/* TEACHER EYES ONLY PEDAGOGICAL DECK */}
                  <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Teacher Pedagogical Deck (Instructor Eyes Only)</span>
                      </div>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400/80 italic">Not visible on student portal</span>
                    </div>

                    {/* Opening Question & Concept Flow */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {period.openingQuestion && (
                        <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-amber-200/60 dark:border-amber-900/40">
                          <div className="font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Classroom Opening Hook:</span>
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 leading-relaxed italic">
                            "{period.openingQuestion}"
                          </p>
                        </div>
                      )}

                      {period.conceptFlow && (
                        <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-amber-200/60 dark:border-amber-900/40">
                          <div className="font-bold text-indigo-900 dark:text-indigo-300 mb-1 flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Classroom Rhythm & Flow:</span>
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-mono text-[11px]">
                            {period.conceptFlow}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Practicals: Roles & Progression */}
                    {(period.teacherRole || period.studentRole) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-emerald-200/60 dark:border-emerald-900/40">
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">Teacher Role:</span>
                          <p className="text-slate-700 dark:text-slate-300">{period.teacherRole}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-emerald-200/60 dark:border-emerald-900/40">
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">Student Role:</span>
                          <p className="text-slate-700 dark:text-slate-300">{period.studentRole}</p>
                        </div>
                      </div>
                    )}

                    {/* Connections Back & Forward */}
                    {(period.connectsBack || period.connectsForward || period.leaveKnowing) && (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 border-t border-amber-200/50 dark:border-amber-900/40 text-[11px]">
                        {period.connectsBack && (
                          <div className="text-slate-600 dark:text-slate-400">
                            <span className="font-bold text-slate-700 dark:text-slate-300">Connects Back: </span>
                            {period.connectsBack}
                          </div>
                        )}
                        {period.connectsForward && (
                          <div className="text-slate-600 dark:text-slate-400">
                            <span className="font-bold text-slate-700 dark:text-slate-300">Connects Forward: </span>
                            {period.connectsForward}
                          </div>
                        )}
                        {period.leaveKnowing && (
                          <div className="text-amber-800 dark:text-amber-300 font-semibold w-full pt-1">
                            🎓 Leave Knowing: {period.leaveKnowing}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Objective & Real-World Anchor */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40">
                      <div className="font-bold text-sky-800 dark:text-sky-300 mb-1 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        <span>Learning Objective:</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {period.learningObjective}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                        <span>Real-World Anchor & Context:</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {period.realWorldAnchor || period.teachingFocus}
                      </p>
                    </div>
                  </div>

                  {/* Demo Code / Core Syntax */}
                  {period.demoCode && (
                    <div className="space-y-1.5">
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-sky-500" />
                        <span>Classroom Demonstration Code:</span>
                      </div>
                      <div className="bg-slate-950 text-sky-300 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
                        <pre>{period.demoCode}</pre>
                      </div>
                    </div>
                  )}

                  {/* Interactive Pedagogical Snippets: Predict & Debug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {period.predictQuestion && (
                      <div className="p-3.5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-1.5">
                        <span className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5" /> Predict The Output Trap:
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{period.predictQuestion.question}</p>
                        <p className="text-[11px] text-indigo-900 dark:text-indigo-300 italic">
                          Key: {period.predictQuestion.options[period.predictQuestion.correctAnswerIndex]}
                        </p>
                      </div>
                    )}

                    {period.debugExercise && (
                      <div className="p-3.5 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1.5">
                        <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                          <Bug className="w-3.5 h-3.5" /> Debug This Bug Trap:
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{period.debugExercise.errorType}</p>
                        <p className="text-[11px] text-rose-900 dark:text-rose-300 italic">
                          Fix: {period.debugExercise.hint}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Practical Activity & Practice */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Practical Lab Activity: </span>
                      <span className="text-slate-600 dark:text-slate-400">{period.practicalActivity}</span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Student Practice Assignment: </span>
                      <span className="text-slate-600 dark:text-slate-400">{period.practice}</span>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Teacher Daily Checkpoint Modal (from Section 9 of PDF) */}
      {showCheckpointModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                  P{showCheckpointModal.periodNumber}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Teacher Daily Checkpoint
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {showCheckpointModal.topic}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCheckpointModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200">
                Track actual pacing against roadmap: record what was completed, struggles, and pacing status.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Period & Unit:</label>
                  <input
                    type="text"
                    readOnly
                    value={`Period ${showCheckpointModal.periodNumber} | Unit ${showCheckpointModal.unit}`}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pacing Status:</label>
                  <select className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold">
                    <option>On track</option>
                    <option>Ahead of roadmap</option>
                    <option>Behind — adjust next period</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">What students understood:</label>
                <input
                  type="text"
                  placeholder="e.g. Core definition, syntax execution, predicting output"
                  defaultValue={showCheckpointModal.leaveKnowing || ''}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">What students struggled with:</label>
                <input
                  type="text"
                  placeholder="e.g. Boundary values, aliasing, off-by-one errors"
                  defaultValue={showCheckpointModal.debugExercise?.errorType || ''}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Questions asked by students:</label>
                <input
                  type="text"
                  placeholder="e.g. Can we solve recursion with loops?"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">What needs reinforcement:</label>
                <textarea
                  rows={2}
                  placeholder="Action items to review in the next period warm-up..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowCheckpointModal(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Daily checkpoint for Period ${showCheckpointModal.periodNumber} logged!`);
                  setShowCheckpointModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm"
              >
                Save Checkpoint Entry
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
