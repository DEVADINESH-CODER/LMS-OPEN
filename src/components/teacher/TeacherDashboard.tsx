import React from 'react';
import { useClass } from '../../context/ClassContext';
import { storageService } from '../../lib/storage-provider';
import { ClassId } from '../../types';
import { 
  Layers, 
  Send, 
  Users, 
  Map, 
  TrendingUp, 
  BarChart3, 
  MessageSquare, 
  UserCheck, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  BookOpen,
  RotateCcw,
  Trash2,
  Edit3,
  Lock,
  Check
} from 'lucide-react';

interface TeacherDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenPublish: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate, onOpenPublish }) => {
  const { classes, activeClassId, setActiveClassId } = useClass();
  const currentClass = classes.find(c => c.id === activeClassId) || classes[0];
  const [refreshCount, setRefreshCount] = React.useState(0);
  const [actionNotice, setActionNotice] = React.useState<string | null>(null);

  const progress = storageService.getClassProgress(activeClassId);
  const students = storageService.getStudents(activeClassId);
  const lessons = storageService.getClassLessons(activeClassId);
  const publishedLessons = lessons.filter(l => l.status === 'published');
  const publishedCount = publishedLessons.length;
  const privateConvs = storageService.getPrivateConversationsForTeacher().filter(c => c.classId === activeClassId);
  const unreadDoubts = privateConvs.reduce((acc, c) => acc + c.teacherUnreadCount, 0);

  const activeLesson = publishedLessons.find(l => l.periodNumber === currentClass.activePeriod) || 
                       publishedLessons[publishedLessons.length - 1];

  const handleRevertLesson = (lessonId: string, periodNumber: number, topic: string) => {
    if (window.confirm(`Are you sure you want to REVERT Period ${periodNumber} ("${topic}") to Draft?\n\nStudents in Class ${activeClassId} will no longer see this as today's active published lesson.`)) {
      storageService.revertLessonToDraft(lessonId);
      setActionNotice(`Period ${periodNumber} successfully reverted to Draft.`);
      setRefreshCount(prev => prev + 1);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const handleDeleteLesson = (lessonId: string, periodNumber: number) => {
    if (window.confirm(`Permanently DELETE Period ${periodNumber} for Class ${activeClassId}?\n\nThis cannot be undone.`)) {
      storageService.deleteLesson(lessonId);
      setActionNotice(`Period ${periodNumber} deleted from Class ${activeClassId}.`);
      setRefreshCount(prev => prev + 1);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fadeIn">
      
      {/* Top Banner with Class Switcher */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Independent Classroom Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentClass.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Class Identifier: <span className="font-mono text-sky-400 font-semibold">{currentClass.id}</span> ({currentClass.name}) • Academic Year {currentClass.academicYear}
            </p>
          </div>

          {/* 3 Classes Switcher Buttons */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 self-start md:self-auto">
            {classes.map((cls) => {
              const isActive = cls.id === activeClassId;
              return (
                <button
                  key={cls.id}
                  onClick={() => setActiveClassId(cls.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <span>{cls.id}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-slate-400 mb-1">Active Curriculum Period</div>
            <div className="text-2xl font-black text-amber-400">
              Period {currentClass.activePeriod}
              <span className="text-xs font-normal text-slate-400 ml-1">/ 45</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Next: Period {currentClass.activePeriod + 1}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-slate-400 mb-1">Enrolled Students</div>
            <div className="text-2xl font-black text-sky-400">
              {students.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {students.filter(s => s.isActive).length} active, {students.filter(s => !s.isActive).length} inactive
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-slate-400 mb-1">Published Lessons</div>
            <div className="text-2xl font-black text-emerald-400">
              {publishedCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Live in Class Revision</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-slate-400 mb-1">Student Private Inquiries</div>
            <div className="text-2xl font-black text-rose-400">
              {unreadDoubts}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Awaiting teacher response</div>
          </div>

        </div>
      </div>

      {/* Main Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Publish Today's Class */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/20 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <Send className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-extrabold text-lg">Publish Today's Class</h3>
            <p className="text-xs text-sky-100 mt-1 leading-relaxed">
              Load topic from 45-period master plan, configure code & pedagogical steps, and publish directly to Class {activeClassId}.
            </p>
          </div>

          <button
            onClick={onOpenPublish}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-white text-sky-900 font-bold text-xs hover:bg-sky-50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Open Lesson Editor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Student Management */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">Students Management</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Add students, import CSV, reset forgotten PINs, toggle active/deactive status, and view register numbers.
            </p>
          </div>

          <button
            onClick={() => onNavigate('students')}
            className="mt-6 w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>Manage {activeClassId} Students</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 4: Live Classroom Poll */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-sky-500/50 transition-all">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">Live Classroom Poll</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Frame dynamic Yes/No questions in live class. 5-minute auto-expiring live window with instant response bars.
            </p>
          </div>

          <button
            onClick={() => onNavigate('live-poll')}
            className="mt-6 w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>Launch In-Class Poll</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Action Notice Banner */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Published Lesson Control & Revert Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Active Lesson Control • Class {activeClassId}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage the currently live published lesson. You can edit content, revert to draft, or delete.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPublish}
              className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish / Edit Period</span>
            </button>
          </div>
        </div>

        {activeLesson ? (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                  Period {activeLesson.periodNumber}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Unit {activeLesson.unit}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Live Published
                </span>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                {activeLesson.topic}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Published on: {new Date(activeLesson.publishedAt || activeLesson.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>

            {/* Revert & Delete Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleRevertLesson(activeLesson.id, activeLesson.periodNumber, activeLesson.topic)}
                className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                title="Unpublish this lesson and revert to draft"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Revert to Draft</span>
              </button>

              <button
                onClick={() => handleDeleteLesson(activeLesson.id, activeLesson.periodNumber)}
                className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-300/80 dark:border-rose-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                title="Delete this lesson completely"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <p className="font-semibold">No lesson is currently in published status for Class {activeClassId}.</p>
            <p>You can open the lesson editor to publish any period from the 45-period master plan.</p>
            <button
              onClick={onOpenPublish}
              className="mt-2 px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs"
            >
              Publish Today's Lesson
            </button>
          </div>
        )}
      </div>

      {/* Progress Snapshot for Active Class */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
            <TrendingUp className="w-4 h-4 text-sky-500" />
            <span>Class {activeClassId} Learning Status Overview</span>
          </div>
          <button
            onClick={() => onNavigate('master-plan')}
            className="text-xs text-sky-600 hover:underline font-semibold"
          >
            View Master Plan & Syllabus
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
            <div className="font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Understood Concepts:</span>
            </div>
            <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc pl-4 text-[11px]">
              {progress.conceptsUnderstood.slice(0, 3).map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
            <div className="font-bold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Needs Reinforcement:</span>
            </div>
            <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc pl-4 text-[11px]">
              {progress.conceptsRequiringReinforcement.slice(0, 3).map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40">
            <div className="font-bold text-sky-800 dark:text-sky-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Recent Teacher Observations:</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 line-clamp-3 text-[11px]">
              {progress.teacherObservations || 'No notes logged yet for this period.'}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
