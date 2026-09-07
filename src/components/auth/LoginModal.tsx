import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  User, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  Eye, 
  EyeOff, 
  GraduationCap,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface LoginModalProps {
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onSuccess }) => {
  const { loginStudent, loginTeacher } = useAuth();
  
  // Default is 100% focused on Student
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  
  // Student state
  const [registerNumber, setRegisterNumber] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Teacher state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      setErrorMessage(err.message || 'Login failed. Please verify your Register Number and PIN.');
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
      setErrorMessage(err.message || 'Login failed. Please verify your Faculty Email and Password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-50 via-sky-50/25 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 relative overflow-x-hidden selection:bg-sky-500 selection:text-white">
      
      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-10">
        {/* Left: LMS Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-600/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-slate-100">
              Python Class LMS
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Academic Portal • C1-112, C2-147, C3-091
            </p>
          </div>
        </div>

        {/* Right Corner: Discrete Faculty / Teacher Admin Logo Button */}
        <div>
          <button
            type="button"
            onClick={() => {
              setActiveTab(activeTab === 'student' ? 'teacher' : 'student');
              setErrorMessage(null);
            }}
            className={`group flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl border transition-all text-xs font-bold shadow-sm backdrop-blur-md ${
              activeTab === 'teacher'
                ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            title={activeTab === 'student' ? "Switch to Faculty / Teacher Administration" : "Switch to Student Portal"}
          >
            <div className={`w-6 h-6 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
              activeTab === 'teacher'
                ? 'bg-white/20 text-white'
                : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:inline">
              {activeTab === 'student' ? 'Faculty Admin' : '← Student Portal'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Form Section (Centered & Focused) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 animate-scaleUp">
          
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-xl shadow-sky-500/25 mb-1">
              {activeTab === 'student' ? (
                <GraduationCap className="w-7 h-7" />
              ) : (
                <ShieldCheck className="w-7 h-7" />
              )}
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {activeTab === 'student' ? 'Student Sign In' : 'Faculty Administration'}
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {activeTab === 'student'
                ? 'Enter your assigned Register Number and PIN to access lessons and live classroom activities.'
                : 'Enter instructor credentials to publish lessons, inspect analytics, and conduct live polls.'}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 font-semibold animate-fadeIn">
              {errorMessage}
            </div>
          )}

          {/* STUDENT FORM */}
          {activeTab === 'student' ? (
            <form onSubmit={handleStudentSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Register Number
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Enter your Register Number"
                    value={registerNumber}
                    onChange={(e) => setRegisterNumber(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all uppercase font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Security PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    maxLength={8}
                    placeholder="Enter your PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 active:from-sky-700 active:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] transform"
                >
                  <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 pt-2">
                Need help or forgot your PIN? Contact your course instructor.
              </p>
            </form>
          ) : (
            /* TEACHER FORM */
            <form onSubmit={handleTeacherSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Faculty Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="teacher@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Faculty Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] transform"
                >
                  <span>{isLoading ? 'Authenticating...' : 'Open Faculty Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('student');
                    setErrorMessage(null);
                  }}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  ← Return to Student Sign In
                </button>
              </div>
            </form>
          )}

          {/* Privacy & Security Note */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>End-to-end encrypted identity session verification</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-400 dark:text-slate-600 z-10">
        <p>Python Class LMS • Academic Year 2024-2025 • Department of Computer Science & Engineering</p>
      </footer>

    </div>
  );
};
