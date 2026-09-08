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
  ChevronDown, 
  ChevronUp, 
  X,
  Sparkles,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

import { subscribeToChannel } from '../../lib/appwrite';

export const LivePollBanner: React.FC = () => {
  const { user } = useAuth();
  const [poll, setPoll] = useState<LivePoll | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Sync poll state
  const syncPoll = async () => {
    if (!user || user.role !== 'student') {
      setPoll(null);
      return;
    }

    await storageService.syncLivePoll();
    const current = storageService.getLivePoll(user.student.classId);
    setPoll(current);

    if (current) {
      const remaining = Math.max(0, Math.floor((new Date(current.expiresAt).getTime() - Date.now()) / 1000));
      setSecondsRemaining(remaining);
    } else {
      setSecondsRemaining(0);
    }
  };

  useEffect(() => {
    syncPoll();
    const interval = setInterval(syncPoll, 2000);

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
  }, [user]);

  if (!user || user.role !== 'student' || !poll || secondsRemaining <= 0) {
    return null;
  }

  const myVote = poll.votes[user.student.id];
  const votesList = Object.values(poll.votes);
  const totalVotes = votesList.length;
  const yesVotes = votesList.filter(v => v.choice === 'Yes').length;
  const noVotes = votesList.filter(v => v.choice === 'No').length;
  const yesPercent = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
  const noPercent = totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleVote = (choice: 'Yes' | 'No') => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const updated = storageService.submitPollVote(
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

  // Minimized Floating Pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 animate-bounce">
        <button
          onClick={() => setIsMinimized(false)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-sky-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 hover:scale-105 transition transform"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
          <span>Live In-Class Poll ({formattedTime})</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 left-5 sm:left-auto sm:w-[440px] z-50 animate-slideUp">
      <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-emerald-500/50 dark:border-emerald-500/40 shadow-2xl space-y-3.5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-black text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Live In-Class Poll
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-mono text-[11px] font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" />
              {formattedTime}
            </span>

            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Minimize poll"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question */}
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
            Instructor asks:
          </p>
          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-snug">
            "{poll.question}"
          </h4>
        </div>

        {/* Voting Buttons or Results */}
        {!myVote ? (
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleVote('Yes')}
                className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.02] transform"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>YES</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleVote('No')}
                className="py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-extrabold text-sm shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.02] transform"
              >
                <ThumbsDown className="w-4 h-4" />
                <span>NO</span>
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400">
              One-click response. Poll auto-cleans when 5 minutes expire.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 pt-1">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your vote: <strong className="uppercase font-extrabold underline">{myVote.choice}</strong></span>
              </div>
              <button
                onClick={() => handleVote(myVote.choice === 'Yes' ? 'No' : 'Yes')}
                className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline"
              >
                Switch to {myVote.choice === 'Yes' ? 'No' : 'Yes'}
              </button>
            </div>

            {/* Live Visual Bars */}
            <div className="space-y-1.5 text-xs font-semibold">
              <div className="flex justify-between text-[11px]">
                <span className="text-emerald-600 dark:text-emerald-400">Yes: {yesPercent}% ({yesVotes})</span>
                <span className="text-rose-600 dark:text-rose-400">No: {noPercent}% ({noVotes})</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${yesPercent}%` }}
                />
                <div 
                  className="bg-rose-500 h-full transition-all duration-500" 
                  style={{ width: `${noPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                {totalVotes} classmate{totalVotes === 1 ? '' : 's'} responded so far
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
