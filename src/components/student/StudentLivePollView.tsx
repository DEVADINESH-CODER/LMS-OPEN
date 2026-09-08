import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../lib/storage-provider';
import { LivePoll } from '../../types';
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown,
  RefreshCw,
  Users,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { subscribeToChannel } from '../../lib/appwrite';

export const StudentLivePollView: React.FC = () => {
  const { user } = useAuth();
  const [poll, setPoll] = useState<LivePoll | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const studentClass = user?.role === 'student' ? user.student.classId : undefined;

  // Sync poll with Appwrite Cloud and local storage
  const syncPoll = async () => {
    if (!studentClass) return;
    setIsRefreshing(true);
    try {
      await storageService.syncLivePoll();
      const current = storageService.getLivePoll(studentClass);
      setPoll(current);
      if (current) {
        const remaining = Math.max(0, Math.floor((new Date(current.expiresAt).getTime() - Date.now()) / 1000));
        setSecondsRemaining(remaining);
      } else {
        setSecondsRemaining(0);
      }
    } catch (e) {
      console.warn('Sync poll failed:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Sync on mount + periodic refresh
  useEffect(() => {
    syncPoll();
    const interval = setInterval(syncPoll, 2500);

    const unsubscribe = subscribeToChannel(
      'databases.python_class_lms.collections.live_poll.documents',
      () => {
        syncPoll();
      }
    );

    return () => {
      clearInterval(interval);
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [studentClass]);

  // Smooth 1-second local countdown ticker
  useEffect(() => {
    if (!poll) return;
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(poll.expiresAt).getTime() - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        setPoll(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [poll]);

  if (!user || user.role !== 'student') return null;

  const myVote = poll?.votes?.[user.student.id];
  const votesList = Object.values(poll?.votes || {});
  const totalVotes = votesList.length;
  const yesVotes = votesList.filter(v => v.choice === 'Yes').length;
  const noVotes = votesList.filter(v => v.choice === 'No').length;
  const yesPercent = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
  const noPercent = totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressRatio = poll ? (secondsRemaining / poll.durationSeconds) * 100 : 0;

  const handleVote = async (choice: 'Yes' | 'No') => {
    if (!poll || submitting) return;
    setSubmitting(true);
    try {
      const updated = await storageService.submitPollVote(
        poll.id,
        user.student.id,
        user.student.name,
        choice,
        user.student.registerNumber,
        user.student.classId
      );
      setPoll(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to submit vote');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              Live In-Class Poll
            </h2>
            {poll && secondsRemaining > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                POLL ACTIVE NOW
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold">
                Idle
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time interactive question framed by your instructor during class.
          </p>
        </div>

        <button
          onClick={syncPoll}
          disabled={isRefreshing}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Sync Poll</span>
        </button>
      </div>

      {/* ACTIVE POLL CARD */}
      {poll && secondsRemaining > 0 ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/50 dark:border-emerald-500/40 shadow-xl space-y-6 animate-scaleUp">
          {/* Top Badge: Target & Timer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                {poll.targetClass === 'all' ? 'All Classes' : `Class ${poll.targetClass}`}
              </span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-500" />
                Live Session Question
              </span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-mono font-extrabold text-sm">
              <Clock className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '3s' }} />
              <span>{formattedTime} remaining</span>
            </div>
          </div>

          {/* Countdown Progress Bar */}
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-teal-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${progressRatio}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Instructor asks:
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug">
              "{poll.question}"
            </h3>
          </div>

          {/* Voting Action Area */}
          <div className="pt-2">
            {!myVote ? (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Select your response below (one-click instant submission):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleVote('Yes')}
                    className="py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-extrabold text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-3 transition transform"
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span>YES, I AGREE / COMPLETED</span>
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleVote('No')}
                    className="py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 active:scale-95 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center gap-3 transition transform"
                  >
                    <ThumbsDown className="w-5 h-5" />
                    <span>NO / NEED MORE TIME</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Your vote is recorded as: <strong className="uppercase font-black underline text-base">{myVote.choice}</strong></span>
                  </div>

                  <button
                    disabled={submitting}
                    onClick={() => handleVote(myVote.choice === 'Yes' ? 'No' : 'Yes')}
                    className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 transition"
                  >
                    Switch vote to {myVote.choice === 'Yes' ? 'No' : 'Yes'}
                  </button>
                </div>

                {/* Live Aggregated Statistics */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-sky-500" />
                      Class Tally: {totalVotes} student{totalVotes === 1 ? '' : 's'} voted
                    </span>
                    <span className="text-slate-400 font-mono">
                      Live Results
                    </span>
                  </div>

                  {/* YES STAT */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-600 dark:text-emerald-400">YES ({yesVotes} votes)</span>
                      <span className="text-emerald-700 dark:text-emerald-300 font-mono font-extrabold">{yesPercent}%</span>
                    </div>
                    <div className="w-full h-5 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden p-0.5">
                      <div 
                        className="bg-emerald-500 h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2 text-white font-bold text-[11px]"
                        style={{ width: `${Math.max(yesPercent, 2)}%` }}
                      >
                        {yesPercent > 10 && `${yesPercent}%`}
                      </div>
                    </div>
                  </div>

                  {/* NO STAT */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-rose-600 dark:text-rose-400">NO ({noVotes} votes)</span>
                      <span className="text-rose-700 dark:text-rose-300 font-mono font-extrabold">{noPercent}%</span>
                    </div>
                    <div className="w-full h-5 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden p-0.5">
                      <div 
                        className="bg-rose-500 h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2 text-white font-bold text-[11px]"
                        style={{ width: `${Math.max(noPercent, 2)}%` }}
                      >
                        {noPercent > 10 && `${noPercent}%`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* IDLE / NO ACTIVE POLL STATE */
        <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center mx-auto text-sky-600 dark:text-sky-400">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-slate-100">
              No Active Poll Right Now
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When the faculty frames a live Yes/No question in class, it will automatically appear here on this screen in real-time with a 5-minute countdown.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={syncPoll}
              disabled={isRefreshing}
              className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 inline-flex items-center gap-2 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Check for Live Poll</span>
            </button>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
        <span>
          Live classroom polls hold for 5 minutes during the active session. Once completed or closed by faculty, votes are recorded without database clutter.
        </span>
      </div>
    </div>
  );
};
