import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../lib/storage-provider';
import { Megaphone, AlertCircle, Calendar } from 'lucide-react';

export const StudentAnnouncementsView: React.FC = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'student') return null;

  const announcements = storageService.getAnnouncements('student', user.student.classId);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fadeIn">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Class Announcements
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Official notices for Class <span className="font-bold text-sky-600">{user.student.classId}</span> from your instructor.
        </p>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs italic">
            No active announcements for your class at this time.
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-6 rounded-3xl border bg-white dark:bg-slate-900 shadow-sm space-y-2.5 ${
                ann.priority === 'important'
                  ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    ann.targetClass === 'all'
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                      : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                  }`}>
                    {ann.targetClass === 'all' ? 'All Classes' : `Class ${ann.targetClass}`}
                  </span>

                  {ann.priority === 'important' && (
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Important Notice</span>
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(ann.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                {ann.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {ann.content}
              </p>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                Posted by: <span className="font-semibold text-slate-600 dark:text-slate-300">{ann.authorName}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
