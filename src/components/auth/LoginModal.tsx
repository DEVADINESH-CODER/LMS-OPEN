import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, User, Lock, ArrowRight, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';

interface LoginModalProps {
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onSuccess }) => {
  const { loginStudent, loginTeacher } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  
  // Student state
  const [registerNumber, setRegisterNumber] = useState('');
  const [pin, setPin] = useState('');

  // Teacher state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await loginStudent(registerNumber, pin);
      onSuccess?.();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Check Register Number and PIN.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await loginTeacher(email, password);
      onSuccess?.();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Check Email and Password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Autofill helpers
  const fillStudentDemo = (regNo: string, pinCode = '1234') => {
    setActiveTab('student');
    setRegisterNumber(regNo);
    setPin(pinCode);
    setErrorMessage(null);
  };

  const fillTeacherDemo = () => {
    setActiveTab('teacher');
    setEmail('teacher@college.edu');
    setPassword('Teacher@2024');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fadeIn">
        
        {/* Header Branding */}
        <div className="p-6 bg-gradient-to-br from-sky-600 to-indigo-700 text-white text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <BookOpen className="w-6 h-6 text-sky-200" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Python Class LMS</h2>
          <p className="text-xs text-sky-100/90 mt-1 font-medium">
            Private Learning Portal for Classes C1 112, C2 147, and C3 091
          </p>

          <div className="mt-4 flex rounded-xl bg-black/20 p-1 backdrop-blur-sm border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setActiveTab('student'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'student' ? 'bg-white text-sky-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Entry</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('teacher'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'teacher' ? 'bg-white text-sky-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Faculty Admin</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
              {errorMessage}
            </div>
          )}

          {activeTab === 'student' ? (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Register Number
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 717823P101"
                    value={registerNumber}
                    onChange={(e) => setRegisterNumber(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Personal Security PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    maxLength={8}
                    placeholder="4-8 digit numeric PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all font-mono"
                  />
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Default PIN for registered students is <span className="font-mono font-semibold">1234</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying Identity...' : 'Access My Class'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo Quick Logins */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Test Student Logins:</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => fillStudentDemo('26009479')}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-sky-950 text-slate-700 dark:text-slate-300 text-center"
                  >
                    <div className="font-bold text-sky-600 dark:text-sky-400">C1 112</div>
                    <div className="text-[10px] text-slate-400 truncate">Ajay Krishnan</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillStudentDemo('26016734')}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-sky-950 text-slate-700 dark:text-slate-300 text-center"
                  >
                    <div className="font-bold text-indigo-600 dark:text-indigo-400">C2 147</div>
                    <div className="text-[10px] text-slate-400 truncate">Aditya N</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillStudentDemo('26018966')}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-sky-950 text-slate-700 dark:text-slate-300 text-center"
                  >
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">C3 091</div>
                    <div className="text-[10px] text-slate-400 truncate">Abimanyu R</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Teacher / Faculty Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="teacher@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Authenticating...' : 'Open Faculty Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={fillTeacherDemo}
                  className="w-full py-2 px-3 rounded-lg border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-indigo-100 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Autofill Demo Teacher Account</span>
                </button>
              </div>
            </form>
          )}

          {/* Privacy & Zero-Trust Notice */}
          <div className="mt-5 text-center text-[10px] text-slate-400 dark:text-slate-500">
            🔒 Lightweight secure identity system. Identity & class derived securely from verified backend session.
          </div>
        </div>

      </div>
    </div>
  );
};
