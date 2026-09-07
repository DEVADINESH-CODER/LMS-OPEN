import React, { useState, useMemo } from 'react';
import { OFFICIAL_SYLLABUS, COURSE_SPECIFICATIONS } from '../../data/officialSyllabus';
import { ADAPTIVE_SCENARIOS } from '../../data/adaptivePractice';
import { CodeRunner } from '../common/CodeRunner';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  Code2, 
  Terminal, 
  Bug, 
  ArrowRight, 
  Award,
  Zap,
  Filter,
  Check,
  FileText,
  FlaskConical,
  Library,
  Target,
  GraduationCap,
  Calendar,
  ExternalLink
} from 'lucide-react';

interface StudentSyllabusViewProps {
  onNavigate?: (tab: string) => void;
}

export const StudentSyllabusView: React.FC<StudentSyllabusViewProps> = ({ onNavigate }) => {
  // Navigation Modes: 'official' (Standard University Curriculum) or 'adaptive' (Real-World Applied Challenges)
  const [activeMode, setActiveMode] = useState<'official' | 'adaptive'>('official');
  
  // Official Syllabus Sub-section
  const [syllabusSection, setSyllabusSection] = useState<'theory' | 'lab' | 'books'>('theory');
  const [selectedUnitNumber, setSelectedUnitNumber] = useState<number | 'all'>('all');

  // Adaptive Lab State
  const [adaptiveUnitFilter, setAdaptiveUnitFilter] = useState<number | 'all'>('all');
  const [adaptiveDifficultyFilter, setAdaptiveDifficultyFilter] = useState<string>('all');
  const [activeScenarioId, setActiveScenarioId] = useState<string>('AS-U1-01');
  const [revealedPredictions, setRevealedPredictions] = useState<Record<string, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [masteredScenarios, setMasteredScenarios] = useState<Record<string, boolean>>({});

  // Filtered adaptive scenarios
  const filteredScenarios = useMemo(() => {
    return ADAPTIVE_SCENARIOS.filter(s => {
      const matchUnit = adaptiveUnitFilter === 'all' || s.unit === adaptiveUnitFilter;
      const matchDiff = adaptiveDifficultyFilter === 'all' || s.difficulty === adaptiveDifficultyFilter;
      return matchUnit && matchDiff;
    });
  }, [adaptiveUnitFilter, adaptiveDifficultyFilter]);

  const currentScenario = useMemo(() => {
    return ADAPTIVE_SCENARIOS.find(s => s.id === activeScenarioId) || ADAPTIVE_SCENARIOS[0];
  }, [activeScenarioId]);

  const handleMarkMastered = (id: string) => {
    setMasteredScenarios(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      return next;
    });
  };

  const filteredUnits = useMemo(() => {
    if (selectedUnitNumber === 'all') return OFFICIAL_SYLLABUS;
    return OFFICIAL_SYLLABUS.filter(u => u.unitNumber === selectedUnitNumber);
  }, [selectedUnitNumber]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 border border-slate-800 text-white p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-semibold tracking-wide uppercase mb-2">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>{COURSE_SPECIFICATIONS.courseCode} • {COURSE_SPECIFICATIONS.credits}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {COURSE_SPECIFICATIONS.courseTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Official university curriculum standards, prescribed laboratory experiments, and everyday applied problem solving challenges.
              </p>
            </div>

            {/* Quick Curriculum Badges */}
            <div className="flex items-center gap-2">
              <div className="px-3.5 py-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
                <div className="text-lg font-black text-sky-400">5</div>
                <div className="text-[10px] text-slate-400 font-medium">Theory Units</div>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
                <div className="text-lg font-black text-emerald-400">12</div>
                <div className="text-[10px] text-slate-400 font-medium">Lab Experiments</div>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
                <div className="text-lg font-black text-amber-400">12</div>
                <div className="text-[10px] text-slate-400 font-medium">Real-World Scenarios</div>
              </div>
            </div>
          </div>

          {/* Primary View Switcher */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-slate-800/80">
            <button
              onClick={() => setActiveMode('official')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                activeMode === 'official'
                  ? 'bg-sky-600 text-white shadow-sky-600/30 ring-2 ring-sky-400/50'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-sky-300" />
              <span>University Syllabus Specifications</span>
            </button>

            <button
              onClick={() => setActiveMode('adaptive')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                activeMode === 'adaptive'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/30 ring-2 ring-amber-400/50'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Applied Real-World Challenges Lab</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-mono">12 Scenarios</span>
            </button>
          </div>
        </div>
      </div>

      {/* Classroom Diary Info Banner: Clarifies that period recaps are posted post-class */}
      <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100">
              Classroom Lecture Notes & Completed Recaps
            </div>
            <div className="text-slate-600 dark:text-slate-400 mt-0.5">
              After each class, your instructor posts what was taught, code examples, interactive predict exercises, and homework in <strong>Today's Class</strong>.
            </div>
          </div>
        </div>

        {onNavigate && (
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => onNavigate('today')}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Today's Class</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={() => onNavigate('revision')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Revision Notes
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: OFFICIAL UNIVERSITY SYLLABUS SPECIFICATIONS (NORMAL SYLLABUS)   */}
      {/* ========================================================================= */}
      {activeMode === 'official' && (
        <div className="space-y-6">
          {/* Sub Navigation Bar: Theory Units / Lab Experiments / Textbooks */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSyllabusSection('theory')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  syllabusSection === 'theory'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Theory Units (I–V)</span>
              </button>

              <button
                onClick={() => setSyllabusSection('lab')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  syllabusSection === 'lab'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Laboratory Exercises</span>
              </button>

              <button
                onClick={() => setSyllabusSection('books')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  syllabusSection === 'books'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Library className="w-3.5 h-3.5" />
                <span>Textbooks & References</span>
              </button>
            </div>

            {syllabusSection === 'theory' && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px] font-medium mr-1">Filter:</span>
                {(['all', 1, 2, 3, 4, 5] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => setSelectedUnitNumber(u)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedUnitNumber === u
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {u === 'all' ? 'All Units' : `Unit ${u}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section: Theory Units */}
          {syllabusSection === 'theory' && (
            <div className="space-y-4">
              {/* Course Objectives Banner */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                  <Target className="w-4 h-4 text-sky-500" />
                  <span>Prescribed Course Objectives</span>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  {COURSE_SPECIFICATIONS.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Units List */}
              <div className="space-y-5">
                {filteredUnits.map((unit) => (
                  <div
                    key={unit.unitNumber}
                    className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-400 font-black text-base flex items-center justify-center shrink-0">
                          U{unit.unitNumber}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wide">
                            Unit {unit.unitNumber} • {unit.hours} Lecture Hours
                          </div>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                            {unit.title}
                          </h3>
                        </div>
                      </div>

                      <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                        {unit.topics.length} Syllabus Modules
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {unit.description}
                    </p>

                    {/* Topics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {unit.topics.map((t, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{t.topicName}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                              {t.importance}
                            </span>
                          </div>
                          <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                            {t.subtopics.map((sub, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-1.5">
                                <span className="text-sky-500 font-bold">•</span>
                                <span>{sub}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Unit Learning Outcomes */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Unit Learning Outcomes (Target Competencies):</span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300">
                        {unit.outcomes.map((outc, oIdx) => (
                          <li key={oIdx} className="flex items-start gap-2 bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>{outc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Laboratory Exercises */}
          {syllabusSection === 'lab' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      Prescribed Laboratory Exercises (Hands-on Programming)
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                    12 Lab Problems
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Standard practical syllabus experiments designed to build algorithmic proficiency, code hygiene, and debugging capability.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COURSE_SPECIFICATIONS.labExperiments.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1.5 hover:border-emerald-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          {exp.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                          Laboratory
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        {exp.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        {exp.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section: Textbooks & References */}
          {syllabusSection === 'books' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Prescribed Textbooks */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                    <BookOpen className="w-4 h-4 text-sky-500" />
                    <span>Prescribed Textbooks</span>
                  </div>
                  <div className="space-y-3">
                    {COURSE_SPECIFICATIONS.textbooks.map((tb, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{tb.title}</div>
                        <div className="text-slate-600 dark:text-slate-300">{tb.author}</div>
                        <div className="text-[11px] text-slate-400">{tb.edition} ({tb.year})</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reference Books */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                    <Library className="w-4 h-4 text-indigo-500" />
                    <span>Reference Books</span>
                  </div>
                  <div className="space-y-3">
                    {COURSE_SPECIFICATIONS.references.map((rb, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{rb.title}</div>
                        <div className="text-slate-600 dark:text-slate-300">{rb.author}</div>
                        <div className="text-[11px] text-slate-400">{rb.edition} ({rb.year})</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: APPLIED REAL-WORLD CHALLENGES LAB (EVERYDAY APPLICATION DOMAINS)  */}
      {/* ========================================================================= */}
      {activeMode === 'adaptive' && (
        <div className="space-y-6">
          {/* Header & Filter Controls */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Applied Real-World Programming Scenarios</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-world computational challenges based on everyday applications (Swiggy, Uber, Netflix, UPI, Gaming, Healthcare, IPL).
                </p>
              </div>

              {/* Progress Count */}
              <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Mastered: {Object.values(masteredScenarios).filter(Boolean).length} / {ADAPTIVE_SCENARIOS.length}</span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3" />
                <span>Unit:</span>
              </span>
              {(['all', 1, 2, 3, 4, 5] as const).map((unit) => (
                <button
                  key={unit}
                  onClick={() => setAdaptiveUnitFilter(unit)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    adaptiveUnitFilter === unit
                      ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {unit === 'all' ? 'All Units' : `Unit ${unit}`}
                </button>
              ))}

              <span className="text-[11px] font-semibold text-slate-400 ml-3 mr-1">
                Difficulty:
              </span>
              {(['all', 'starter', 'intermediate', 'mastery'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setAdaptiveDifficultyFilter(diff)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                    adaptiveDifficultyFilter === diff
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Selector Horizontal Scroll Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredScenarios.map((scenario) => {
              const isSelected = scenario.id === activeScenarioId;
              const isMastered = !!masteredScenarios[scenario.id];

              return (
                <button
                  key={scenario.id}
                  onClick={() => setActiveScenarioId(scenario.id)}
                  className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/40 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xl">{scenario.emoji}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          Unit {scenario.unit}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          scenario.difficulty === 'starter'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : scenario.difficulty === 'intermediate'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}>
                          {scenario.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">
                      {scenario.title}
                    </div>

                    <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                      {scenario.realWorldDomain}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {scenario.realWorldSituation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <span className="text-slate-400 font-mono">
                      Topic: {scenario.topic}
                    </span>
                    {isMastered && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Solved</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Scenario Detail Deck */}
          <div className="rounded-3xl border border-amber-300 dark:border-amber-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <span className="text-xl">{currentScenario.emoji}</span>
                  <span>{currentScenario.realWorldDomain}</span>
                  <span>•</span>
                  <span>Unit {currentScenario.unit}: {currentScenario.topic}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {currentScenario.title}
                </h2>
              </div>

              <button
                onClick={() => handleMarkMastered(currentScenario.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                  masteredScenarios[currentScenario.id]
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{masteredScenarios[currentScenario.id] ? 'Challenge Mastered!' : 'Mark as Mastered'}</span>
              </button>
            </div>

            {/* Step 1 & 2: Real-World Situation & Provocative Question */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>1. Real-World Situation</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentScenario.realWorldSituation}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs space-y-2">
                <div className="font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-sky-500" />
                  <span>2. The Intuitive Question</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  "{currentScenario.provocativeQuestion}"
                </p>
              </div>
            </div>

            {/* Step 3 & 4: Student Thinking & Computational Logic */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-3">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100">3. Natural Human Reasoning: </span>
                <span className="text-slate-600 dark:text-slate-300">{currentScenario.studentThinking}</span>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="font-bold text-slate-900 dark:text-slate-100">4. Computational Algorithm: </span>
                <span className="text-slate-600 dark:text-slate-300">{currentScenario.computationalLogic}</span>
              </div>
            </div>

            {/* Step 5: Python Syntax Rule */}
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-2">
              <div className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple-500" />
                <span>5. Python Syntax & Mechanics</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentScenario.conceptAndSyntax}
              </p>
              <pre className="p-3 rounded-xl bg-slate-900 text-purple-300 font-mono text-xs overflow-x-auto">
                {currentScenario.syntaxSnippet}
              </pre>
            </div>

            {/* Step 6: Live Interactive Code Runner */}
            <div className="space-y-3">
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-500" />
                <span>6. Live Interactive Python Code</span>
              </div>
              <CodeRunner
                code={currentScenario.code}
                expectedOutput={currentScenario.expectedOutput}
                allowEdit={true}
              />
              {/* Code Line Walkthrough */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1.5">
                <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">How the code executes:</div>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                  {currentScenario.codeExplanation.map((exp, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-sky-500 font-bold">•</span>
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step 7: Predict Challenge */}
            <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
              <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center justify-between">
                <span>7. Predict Before Running</span>
                <button
                  onClick={() => setRevealedPredictions(prev => ({ ...prev, [currentScenario.id]: !prev[currentScenario.id] }))}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold"
                >
                  {revealedPredictions[currentScenario.id] ? 'Hide Answer' : 'Reveal Answer'}
                </button>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                {currentScenario.predictChallenge.question}
              </p>
              <div className="space-y-1.5">
                {currentScenario.predictChallenge.options.map((opt, oIdx) => (
                  <div
                    key={oIdx}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      revealedPredictions[currentScenario.id] && oIdx === currentScenario.predictChallenge.correctIndex
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              {revealedPredictions[currentScenario.id] && (
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 text-xs animate-fadeIn">
                  💡 {currentScenario.predictChallenge.explanation}
                </div>
              )}
            </div>

            {/* Step 8: Debug Trap */}
            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-3">
              <div className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                <Bug className="w-4 h-4 text-rose-500" />
                <span>8. Debugging Trap: What Beginners Get Wrong ({currentScenario.debugTrap.errorType})</span>
              </div>
              <pre className="p-3 rounded-xl bg-slate-900 text-rose-300 font-mono text-xs overflow-x-auto">
                {currentScenario.debugTrap.buggyCode}
              </pre>
              <p className="text-slate-700 dark:text-slate-300">
                <strong className="text-rose-600 dark:text-rose-400">What went wrong: </strong> {currentScenario.debugTrap.whatWentWrong}
              </p>
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-900 dark:text-emerald-200">
                <strong>Fix: </strong> {currentScenario.debugTrap.fix}
              </div>
            </div>

            {/* Step 9: Mini Transfer Challenge */}
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>9. Try It Yourself: Mini Practice Challenge</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRevealedHints(prev => ({ ...prev, [currentScenario.id]: !prev[currentScenario.id] }))}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold"
                  >
                    {revealedHints[currentScenario.id] ? 'Hide Hint' : '💡 Show Hint'}
                  </button>
                  <button
                    onClick={() => setRevealedSolutions(prev => ({ ...prev, [currentScenario.id]: !prev[currentScenario.id] }))}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold"
                  >
                    {revealedSolutions[currentScenario.id] ? 'Hide Solution' : 'Check Solution'}
                  </button>
                </div>
              </div>

              <p className="text-slate-800 dark:text-slate-200 font-medium">
                {currentScenario.miniPractice.challenge}
              </p>

              {revealedHints[currentScenario.id] && (
                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-900 dark:text-amber-200 italic animate-fadeIn">
                  💡 <strong>Hint:</strong> {currentScenario.miniPractice.hint}
                </div>
              )}

              {revealedSolutions[currentScenario.id] && (
                <div className="animate-fadeIn space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 text-[11px]">Model Python Solution:</span>
                  <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto">
                    {currentScenario.miniPractice.solutionCode}
                  </pre>
                </div>
              )}
            </div>

            {/* Step 10: Bridge to Next Concept */}
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs flex items-center gap-3">
              <ArrowRight className="w-5 h-5 text-indigo-500 shrink-0" />
              <div>
                <span className="font-bold text-indigo-900 dark:text-indigo-200">Bridge to Next Concept: </span>
                <span className="text-slate-700 dark:text-slate-300">{currentScenario.bridgeToNext}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
