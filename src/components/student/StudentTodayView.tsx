import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../lib/storage-provider';
import { LessonContent } from '../../types';
import { CodeRunner } from '../common/CodeRunner';
import { PredictRunExplain } from '../common/PredictRunExplain';
import { DebugCard } from '../common/DebugCard';
import { VivaCard } from '../common/VivaCard';
import { PedagogicalFlow } from '../common/PedagogicalFlow';
import { 
  Calendar, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Compass, 
  CheckCircle, 
  Code, 
  HelpCircle, 
  AlertCircle, 
  FileText, 
  ChevronRight, 
  ListChecks, 
  Target, 
  FileCheck,
  BarChart3,
  Flame,
  ArrowRight
} from 'lucide-react';
import { subscribeToChannel } from '../../lib/appwrite';
import { LivePoll } from '../../types';

interface StudentTodayViewProps {
  onNavigate?: (tab: string) => void;
}

export const StudentTodayView: React.FC<StudentTodayViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'student') return null;

  const studentClass = user.student.classId;
  const [todayLesson, setTodayLesson] = useState<LessonContent | null>(() => storageService.getTodayLessonForStudent(studentClass));
  const [activePoll, setActivePoll] = useState<LivePoll | null>(() => storageService.getLivePoll(studentClass));

  useEffect(() => {
    const syncAndLoad = async () => {
      await storageService.syncLessons();
      setTodayLesson(storageService.getTodayLessonForStudent(studentClass));
      await storageService.syncLivePoll();
      setActivePoll(storageService.getLivePoll(studentClass));
    };

    syncAndLoad();

    const unsubLessons = subscribeToChannel(
      'databases.python_class_lms.collections.lessons.documents',
      () => {
        syncAndLoad();
      }
    );

    const unsubPoll = subscribeToChannel(
      'databases.python_class_lms.collections.live_poll.documents',
      () => {
        syncAndLoad();
      }
    );

    return () => {
      if (typeof unsubLessons === 'function') unsubLessons();
      if (typeof unsubPoll === 'function') unsubPoll();
    };
  }, [studentClass]);

  if (!todayLesson) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fadeIn">
        {/* Active Poll Prompt if running */}
        {activePoll && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 animate-bounce">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">
                  Live Classroom Poll in Progress!
                </span>
                <p className="font-extrabold text-sm sm:text-base">
                  "{activePoll.question}"
                </p>
              </div>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('live-poll')}
                className="px-4 py-2 rounded-2xl bg-white text-emerald-800 font-extrabold text-xs shadow-md hover:bg-emerald-50 flex items-center gap-1.5 transition"
              >
                <span>Answer Live Poll</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <div className="p-8 text-center max-w-2xl mx-auto my-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center mx-auto text-sky-600 mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No Lesson Published Yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            Your instructor has not yet published the latest lecture for class <span className="font-semibold text-sky-600">{studentClass}</span>. Check the Revision section to review past lectures or explore Practice problems!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fadeIn">
      
      {/* Active Poll Prompt Banner */}
      {activePoll && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">
                Live In-Class Poll Ongoing
              </span>
              <p className="font-extrabold text-sm sm:text-base">
                "{activePoll.question}"
              </p>
            </div>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('live-poll')}
              className="px-4 py-2 rounded-2xl bg-white text-emerald-800 font-extrabold text-xs shadow-md hover:bg-emerald-50 flex items-center gap-1.5 transition"
            >
              <span>View & Vote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Top Banner Card: Today's Topic & Period Badge */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 text-white p-6 sm:p-8 shadow-xl shadow-sky-600/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
              Class {studentClass}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-bold">
              Period {todayLesson.periodNumber} of 45
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-sky-100 hidden sm:inline">
              Unit {todayLesson.unit}
            </span>
          </div>

          <div className="text-sky-100 text-[11px] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{todayLesson.publishedAt ? new Date(todayLesson.publishedAt).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : 'Today'}</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-snug">
          {todayLesson.topic}
        </h1>

        <p className="text-xs sm:text-sm text-sky-100/90 mt-2.5 max-w-2xl leading-relaxed">
          {todayLesson.whatYouWillLearn}
        </p>
      </div>

      {/* Pedagogical Step Tracker */}
      <PedagogicalFlow currentStep={5} />

      {/* 1. Real-Life Situation Card */}
      <div className="rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-bold text-sm mb-3">
          <Compass className="w-4 h-4" />
          <span>1. Real-Life Situation & Problem Context</span>
        </div>

        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
          {todayLesson.realLifeSituation.title}
        </h3>

        <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
          <p>{todayLesson.realLifeSituation.scenario}</p>
          <div className="pt-2 border-t border-sky-200/60 dark:border-sky-800/60 text-sky-900 dark:text-sky-200 font-medium">
            <span className="font-bold">Connection to Programming: </span>
            {todayLesson.realLifeSituation.connectionToCode}
          </div>
        </div>
      </div>

      {/* 2. What Was Taught & Core Concept Explanation */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-3">
          <Lightbulb className="w-4 h-4" />
          <span>2. Core Concept & What Was Taught</span>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-4">
          {todayLesson.conceptExplanation}
        </div>

        {/* Terminology Grid */}
        {todayLesson.terminology && todayLesson.terminology.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              Essential Technical Terminology:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {todayLesson.terminology.map((t, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                  <div className="font-bold text-sky-700 dark:text-sky-400 mb-1">{t.term}</div>
                  <div className="text-slate-600 dark:text-slate-300 text-[11px] leading-snug">{t.definition}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Python Syntax Box */}
        {todayLesson.syntax && (
          <div className="mt-4">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Python Syntax Rule:
            </div>
            <div className="bg-slate-950 text-sky-300 p-3.5 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
              <pre>{todayLesson.syntax}</pre>
            </div>
          </div>
        )}
      </div>

      {/* 3. Progressive Examples (Very Simple, Slightly Advanced, Practical) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-base px-1">
          <BookOpen className="w-5 h-5 text-sky-500" />
          <span>Progressive Real-World Examples</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {todayLesson.examples.map((ex, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{ex.title}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  ex.level === 'very_simple' 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : ex.level === 'slightly_advanced'
                    ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                }`}>
                  {ex.level.replace('_', ' ')}
                </span>
              </div>

              <CodeRunner code={ex.code} expectedOutput={ex.output} title={ex.title} />

              <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
                <span className="font-semibold text-slate-800 dark:text-slate-200">How it works: </span>
                {ex.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Latest Main Hands-on Code with Step-by-Step Breakdown */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm mb-2">
          <Code className="w-4 h-4" />
          <span>Core Lesson Program & Step-by-Step Explanation</span>
        </div>

        <CodeRunner code={todayLesson.code} expectedOutput={todayLesson.expectedOutput} title="Main Python Script" allowEdit={true} />

        {/* Step-by-Step Walkthrough */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5 flex items-center gap-1.5">
            <ListChecks className="w-4 h-4 text-sky-500" />
            <span>Step-by-Step Execution Breakdown:</span>
          </div>
          <div className="space-y-2">
            {todayLesson.stepByStepExplanation && todayLesson.stepByStepExplanation.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Predict -> Run -> Explain Interactive Widget */}
      {todayLesson.predictTheOutput && (
        <PredictRunExplain
          snippet={todayLesson.predictTheOutput.snippet}
          options={todayLesson.predictTheOutput.options}
          correctAnswerIndex={todayLesson.predictTheOutput.correctAnswerIndex}
          explanation={todayLesson.predictTheOutput.explanation}
        />
      )}

      {/* 6. Modify the Code Challenge */}
      {todayLesson.modifyTheCodeChallenge && (
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm mb-2">
            <Target className="w-4 h-4" />
            <span>Modify The Code Challenge</span>
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div><span className="font-semibold text-slate-900 dark:text-slate-100">Original Goal: </span>{todayLesson.modifyTheCodeChallenge.originalGoal}</div>
            <div className="text-indigo-900 dark:text-indigo-200 font-medium"><span className="font-bold">Your Challenge: </span>{todayLesson.modifyTheCodeChallenge.newGoal}</div>
            <div className="p-2.5 bg-white/70 dark:bg-slate-900/70 rounded-lg text-slate-600 dark:text-slate-400 text-[11px] italic">
              💡 Hint: {todayLesson.modifyTheCodeChallenge.hint}
            </div>
          </div>
        </div>
      )}

      {/* 7. Debug This: Common Beginner Mistake */}
      {todayLesson.debugThis && (
        <DebugCard
          buggyCode={todayLesson.debugThis.buggyCode}
          commonMistakeWhy={todayLesson.debugThis.commonMistakeWhy}
          fixedCode={todayLesson.debugThis.fixedCode}
          explanation={todayLesson.debugThis.explanation}
        />
      )}

      {/* 8. Important Points & Key Takeaways */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            <span>Important Points to Remember</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {todayLesson.importantPoints.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-sky-500 font-bold">•</span>
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>Key Takeaways</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {todayLesson.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 9. Homework & Mini Challenge */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 p-5 shadow-sm">
        <div className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <FileCheck className="w-4 h-4" />
          <span>Today's Homework & Mini Challenge</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
          {todayLesson.homework}
        </p>
        {todayLesson.miniChallenge && (
          <div className="mt-2 text-xs text-amber-900 dark:text-amber-200 font-semibold">
            ⭐ Mini Challenge: {todayLesson.miniChallenge}
          </div>
        )}
      </div>

      {/* 10. Viva Voce Questions Section */}
      {todayLesson.vivaQuestions && todayLesson.vivaQuestions.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>Viva Voce & Oral Exam Questions</span>
            </div>
            <span className="text-[11px] text-slate-400">Click to reveal answers</span>
          </div>

          <div className="space-y-2">
            {todayLesson.vivaQuestions.map((viva, idx) => (
              <VivaCard
                key={idx}
                index={idx}
                question={viva.question}
                expectedAnswer={viva.expectedAnswer}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
