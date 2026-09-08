import React, { useState, useEffect } from 'react';
import { useClass } from '../../context/ClassContext';
import { storageService } from '../../lib/storage-provider';
import { LivePoll, ClassId } from '../../types';
import { 
  BarChart3, 
  Clock, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Users, 
  Flame, 
  RefreshCw,
  StopCircle,
  HelpCircle,
  TrendingUp
} from 'lucide-react';

const QUICK_PRESETS = [
  "Did you complete the while loop coding challenge?",
  "Is the difference between '==' and 'is' clear?",
  "Should we do one more live trace with student inputs?",
  "Are you able to run the Python script without errors?",
  "Do you understand the syntax of if-elif-else branches?",
  "Ready to start today's hands-on practice problems?"
];

import { subscribeToChannel } from '../../lib/appwrite';

export const LivePollStudio: React.FC = () => {
  const { classes, activeClassId } = useClass();
  const [activePoll, setActivePoll] = useState<LivePoll | null>(storageService.getLivePoll());
  
  // Create Poll Form State
  const [question, setQuestion] = useState('');
  const [targetClass, setTargetClass] = useState<ClassId | 'all'>(activeClassId || 'all');
  const [durationSeconds, setDurationSeconds] = useState(300); // 5 minutes
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Sync state with storage and tick timer
  const refreshPoll = async () => {
    await storageService.syncLivePoll();
    const current = storageService.getLivePoll();
    setActivePoll(current);
    if (current) {
      const remaining = Math.max(0, Math.floor((new Date(current.expiresAt).getTime() - Date.now()) / 1000));
      setSecondsRemaining(remaining);
    } else {
      setSecondsRemaining(0);
    }
  };

  useEffect(() => {
    refreshPoll();
    const interval = setInterval(refreshPoll, 2000);

    const unsubscribe = subscribeToChannel(
      'databases.python_class_lms.collections.live_poll.documents',
      () => {
        refreshPoll();
      }
    );

    return () => {
      clearInterval(interval);
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleLaunchPoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      const poll = storageService.createLivePoll(
        question.trim(),
        targetClass,
        ['Yes', 'No'],
        durationSeconds
      );
      setActivePoll(poll);
      setQuestion('');
      refreshPoll();
    } catch (err: any) {
      alert(err.message || 'Failed to create poll');
    }
  };

  const handleEndPoll = () => {
    if (confirm('End this live poll now? Students will no longer be able to submit votes.')) {
      storageService.endLivePoll();
      setActivePoll(null);
      refreshPoll();
    }
  };

  // Compute live vote statistics
  const votes = activePoll ? Object.values(activePoll.votes) : [];
  const totalVotes = votes.length;
  const yesVotes = votes.filter(v => v.choice === 'Yes').length;
  const noVotes = votes.filter(v => v.choice === 'No').length;
  const yesPercent = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
  const noPercent = totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0;

  // Format mm:ss
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressRatio = activePoll ? (secondsRemaining / activePoll.durationSeconds) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Live Classroom Poll
            </h2>
            {activePoll ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                POLL ACTIVE
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold">
                Idle
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Frame dynamic Yes/No questions in real-time. Poll holds for 5 minutes with live countdown and auto-cleans without database clutter.
          </p>
        </div>

        <button
          onClick={refreshPoll}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Now</span>
        </button>
      </div>

      {/* ACTIVE POLL DISPLAY */}
      {activePoll ? (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 dark:border-emerald-500/30 shadow-xl space-y-6 animate-scaleUp">
          
          {/* Top Bar: Target Class & 5-Minute Countdown */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                {activePoll.targetClass === 'all' ? 'All Classes (C1 112, C2 147, C3 091)' : `Target: Class ${activePoll.targetClass}`}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Live In-Class Session
              </span>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-mono font-extrabold text-sm">
              <Clock className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '3s' }} />
              <span>{formattedTime} remaining</span>
            </div>
          </div>

          {/* Time Progress Bar */}
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${progressRatio}%` }}
            />
          </div>

          {/* Question Display */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Active Question Framed to Students:
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 leading-snug">
              "{activePoll.question}"
            </h3>
          </div>

          {/* Real-time Response Stats & Visual Bars */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-sky-500" />
                Live Response Tally: {totalVotes} student{totalVotes === 1 ? '' : 's'} voted
              </span>
              <span className="text-slate-400">
                Options: Yes / No
              </span>
            </div>

            {/* YES BAR */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  YES ({yesVotes} vote{yesVotes === 1 ? '' : 's'})
                </span>
                <span className="text-emerald-700 dark:text-emerald-300 font-extrabold font-mono text-sm">
                  {yesPercent}%
                </span>
              </div>
              <div className="w-full h-7 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden p-1 flex items-center">
                <div
                  className="h-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 flex items-center justify-end pr-2 text-white font-bold text-xs"
                  style={{ width: `${Math.max(yesPercent, 2)}%` }}
                >
                  {yesPercent > 10 && `${yesPercent}%`}
                </div>
              </div>
            </div>

            {/* NO BAR */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  NO ({noVotes} vote{noVotes === 1 ? '' : 's'})
                </span>
                <span className="text-rose-700 dark:text-rose-300 font-extrabold font-mono text-sm">
                  {noPercent}%
                </span>
              </div>
              <div className="w-full h-7 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden p-1 flex items-center">
                <div
                  className="h-full rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-500 flex items-center justify-end pr-2 text-white font-bold text-xs"
                  style={{ width: `${Math.max(noPercent, 2)}%` }}
                >
                  {noPercent > 10 && `${noPercent}%`}
                </div>
              </div>
            </div>
          </div>

          {/* Student Votes Breakdown */}
          {totalVotes > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Recent Submissions:
              </div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                {votes.slice(-15).reverse().map((v, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold ${
                      v.choice === 'Yes'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    <span>{v.studentName}</span>
                    <span className="font-extrabold font-mono">[{v.choice}]</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-400">
              Poll will automatically expire and delete when timer reaches 00:00.
            </p>

            <button
              onClick={handleEndPoll}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-2 transition"
            >
              <StopCircle className="w-4 h-4" />
              <span>End Poll Early</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* LAUNCH NEW POLL FORM */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
          <HelpCircle className="w-4 h-4 text-sky-500" />
          <span>{activePoll ? 'Replace With New Poll' : 'Launch In-Class Quick Poll'}</span>
        </div>

        {/* Quick Question Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
            Quick In-Class Presets (1-Click Fill):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_PRESETS.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setQuestion(preset)}
                className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 bg-slate-50/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs transition"
              >
                "{preset}"
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLaunchPoll} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Poll Question (Yes / No response)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Did everyone finish typing the while loop program?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Target Classroom
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value as ClassId | 'all')}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100 text-xs"
              >
                <option value="all">All Classes (C1 112, C2 147, C3 091)</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>Class {c.id} Only</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Poll Duration
              </label>
              <select
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100 text-xs"
              >
                <option value={300}>5 Minutes (Default Auto-Expiry)</option>
                <option value={180}>3 Minutes</option>
                <option value={120}>2 Minutes</option>
                <option value={60}>1 Minute Quick Check</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              Students currently active in the portal will receive an immediate live pop-up banner to submit their Yes/No response in one click.
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!question.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 active:from-sky-700 active:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-sky-600/25 flex items-center gap-2 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Launch Live 5-Minute Poll</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
