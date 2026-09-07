import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../lib/storage-provider';
import { LessonContent } from '../../types';
import { CodeRunner } from '../common/CodeRunner';
import { PredictRunExplain } from '../common/PredictRunExplain';
import { DebugCard } from '../common/DebugCard';
import { VivaCard } from '../common/VivaCard';
import { 
  Search, 
  BookOpen, 
  Calendar, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle, 
  Compass, 
  FileText,
  Filter
} from 'lucide-react';

export const StudentRevisionView: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [activeLesson, setActiveLesson] = useState<LessonContent | null>(null);

  if (!user || user.role !== 'student') return null;

  const studentClass = user.student.classId;
  const lessons = storageService.getPublishedRevisionLessons(studentClass, searchQuery);

  const filteredLessons = selectedUnit === 'all' 
    ? lessons 
    : lessons.filter(l => l.unit === selectedUnit);

  if (activeLesson) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fadeIn">
        <button
          onClick={() => setActiveLesson(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 p-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Revision Archives ({studentClass})</span>
        </button>

        {/* Header */}
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Period {activeLesson.periodNumber} of 45
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
              Unit {activeLesson.unit}
            </span>
            <span className="text-slate-400 ml-auto text-[11px]">
              Class {activeLesson.classId}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {activeLesson.topic}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            {activeLesson.whatYouWillLearn}
          </p>
        </div>

        {/* Real-Life Context */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm mb-2">
            <Compass className="w-4 h-4" />
            <span>Real-Life Situation & Background</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-sky-50/50 dark:bg-sky-950/20 p-4 rounded-xl">
            <div className="font-bold text-slate-900 dark:text-slate-100 mb-1">{activeLesson.realLifeSituation.title}</div>
            <p>{activeLesson.realLifeSituation.scenario}</p>
            <div className="mt-2 text-sky-800 dark:text-sky-300 font-semibold">{activeLesson.realLifeSituation.connectionToCode}</div>
          </div>
        </div>

        {/* Code & Runner */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">
            Python Script & Execution
          </h3>
          <CodeRunner code={activeLesson.code} expectedOutput={activeLesson.expectedOutput} title={`Period ${activeLesson.periodNumber} Script`} />
        </div>

        {/* Predict -> Run -> Explain */}
        {activeLesson.predictTheOutput && (
          <PredictRunExplain
            snippet={activeLesson.predictTheOutput.snippet}
            options={activeLesson.predictTheOutput.options}
            correctAnswerIndex={activeLesson.predictTheOutput.correctAnswerIndex}
            explanation={activeLesson.predictTheOutput.explanation}
          />
        )}

        {/* Debug Card */}
        {activeLesson.debugThis && (
          <DebugCard
            buggyCode={activeLesson.debugThis.buggyCode}
            commonMistakeWhy={activeLesson.debugThis.commonMistakeWhy}
            fixedCode={activeLesson.debugThis.fixedCode}
            explanation={activeLesson.debugThis.explanation}
          />
        )}

        {/* Viva Questions */}
        {activeLesson.vivaQuestions && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-3">Viva Review Questions:</div>
            {activeLesson.vivaQuestions.map((v, i) => (
              <VivaCard key={i} index={i} question={v.question} expectedAnswer={v.expectedAnswer} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fadeIn">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Revision Archives
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Browse and revise all published lectures for Class <span className="font-bold text-sky-600">{studentClass}</span>.
          </p>
        </div>

        {/* Unit Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedUnit('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedUnit === 'all' 
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Units
          </button>
          {[1, 2, 3, 4, 5].map((u) => (
            <button
              key={u}
              onClick={() => setSelectedUnit(u)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedUnit === u 
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Unit {u}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by topic, period number, concept, or code keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all shadow-sm"
        />
      </div>

      {/* Published Lesson Cards Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredLessons.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 italic text-xs">
            No published lessons matched your search query in Class {studentClass}.
          </div>
        ) : (
          filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => setActiveLesson(lesson)}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-400 dark:hover:border-sky-600 cursor-pointer transition-all hover:shadow-md group flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-[11px] font-semibold">
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold">
                    Period {lesson.periodNumber}
                  </span>
                  <span className="text-slate-400">Unit {lesson.unit}</span>
                  {lesson.publishedAt && (
                    <span className="text-slate-400 hidden sm:inline">
                      • {new Date(lesson.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {lesson.topic}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {lesson.whatWasTaught || lesson.whatYouWillLearn}
                </p>

                <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400">
                  <span>{lesson.examples.length} Practical Examples</span>
                  <span>•</span>
                  <span>Predict Challenge</span>
                  <span>•</span>
                  <span>Viva Questions</span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-sky-500 group-hover:bg-sky-50 dark:group-hover:bg-sky-950 transition-colors shrink-0 mt-2">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
