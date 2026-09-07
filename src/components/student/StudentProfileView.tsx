import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChangePinModal } from '../auth/ChangePinModal';
import { 
  User, 
  KeyRound, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Layers,
  Award
} from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { user } = useAuth();
  const [showPinModal, setShowPinModal] = useState(false);

  if (!user || user.role !== 'student') return null;

  const { student } = user;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Verified Student Identity
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Your identity and class enrollment are securely verified by the backend system.
        </p>
      </div>

      {/* Identity Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        
        {/* Header Ribbon */}
        <div className="p-6 bg-gradient-to-r from-sky-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-bold text-lg">
              {student.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-extrabold text-lg">{student.name}</h3>
              <div className="text-xs text-sky-100 font-mono">{student.registerNumber}</div>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold">
            Class {student.classId}
          </div>
        </div>

        {/* Identity Details */}
        <div className="p-6 divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
          
          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Official Register Number</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{student.registerNumber}</span>
          </div>

          {student.email && (
            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Student Email Id</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{student.email}</span>
            </div>
          )}

          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Assigned Classroom</span>
            <span className="font-semibold text-sky-600 dark:text-sky-400">{student.classId} (Strictly Isolated)</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Internal Identity ID</span>
            <span className="font-mono text-slate-400 text-xs">{student.id}</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Account Status</span>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Active & Verified</span>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Security Credentials</span>
            <button
              onClick={() => setShowPinModal(true)}
              className="px-3 py-1.5 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold flex items-center gap-1.5 hover:bg-sky-100 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change My PIN</span>
            </button>
          </div>

        </div>

      </div>

      {/* Security Guarantees Callout */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Zero-Trust Privacy Protections</span>
        </div>
        <ul className="space-y-1.5 list-disc pl-4">
          <li>Your identity, enrolled class, and student ID are derived strictly from your authenticated server session.</li>
          <li>Class group chats are isolated to Class {student.classId}. Students from other classes cannot see your messages.</li>
          <li>Private messages are strictly between you and your instructor. No other student can see or access your doubts.</li>
          <li>If you ever forget your PIN, request a temporary PIN reset from your instructor in class.</li>
        </ul>
      </div>

      <ChangePinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        isMandatory={false}
      />
    </div>
  );
};
