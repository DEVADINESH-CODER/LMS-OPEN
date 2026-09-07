import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClass } from '../../context/ClassContext';
import { useNotifications } from '../../context/NotificationContext';
import { ClassId } from '../../types';
import { 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  Layers, 
  Check, 
  User, 
  KeyRound, 
  CheckCircle2, 
  BookOpen, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenChangePin?: () => void;
  onOpenChangePassword?: () => void;
  onNavigate?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenSidebar, 
  onOpenChangePin, 
  onOpenChangePassword, 
  onNavigate 
}) => {
  const { user, logout } = useAuth();
  const { classes, activeClassId, setActiveClassId } = useClass();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate?.(user?.role === 'teacher' ? 'dashboard' : 'today')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-base tracking-tight text-slate-900 dark:text-slate-50">
                <span>Python Class LMS</span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-extrabold hidden sm:inline-block">
                  45 Periods
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                C1 112 • C2 147 • C3 091
              </div>
            </div>
          </div>
        </div>

        {/* Center: Class Switcher (Teacher) or Locked Class Badge (Student) */}
        <div className="flex items-center">
          {user?.role === 'teacher' ? (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium">
              <span className="text-slate-500 dark:text-slate-400 px-2 hidden md:inline flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Class:</span>
              </span>
              {classes.map((cls) => {
                const isActive = cls.id === activeClassId;
                return (
                  <button
                    key={cls.id}
                    onClick={() => setActiveClassId(cls.id as ClassId)}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-semibold ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>{cls.id}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>}
                  </button>
                );
              })}
            </div>
          ) : user?.role === 'student' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Class {user.student.classId}</span>
            </div>
          ) : null}
        </div>

        {/* Right: Notifications, Dark Mode, Profile & Logout */}
        <div className="flex items-center gap-2">
          
          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-3 z-50 text-xs">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">In-App Alerts</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sky-600 hover:text-sky-700 dark:text-sky-400 text-[11px] font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 italic">No notifications yet</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markAsRead(n.id);
                          if (n.linkUrl) onNavigate?.(n.linkUrl.replace('/', ''));
                          setShowNotifications(false);
                        }}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                          !n.isRead ? 'bg-sky-50/40 dark:bg-sky-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {n.title}
                          </div>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mt-1 text-[11px] line-clamp-2">
                          {n.message}
                        </p>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Profile Pill */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden md:block text-right">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {user.role === 'teacher' ? user.teacher.name : user.student.name}
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {user.role === 'teacher' ? 'Instructor / Admin' : user.student.registerNumber}
                </div>
              </div>

              {user.role === 'student' && (
                <button
                  onClick={onOpenChangePin}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  title="Change PIN"
                >
                  <KeyRound className="w-4 h-4" />
                </button>
              )}

              {user.role === 'teacher' && onOpenChangePassword && (
                <button
                  onClick={onOpenChangePassword}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Change Faculty Password"
                >
                  <KeyRound className="w-3.5 h-3.5 text-sky-500" />
                  <span className="hidden md:inline">Change Password</span>
                </button>
              )}

              <button
                onClick={logout}
                className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
