import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClass } from '../../context/ClassContext';
import { 
  Calendar, 
  BookOpen, 
  FileText, 
  Code2, 
  MessageSquare, 
  UserCheck, 
  Megaphone, 
  Sparkles, 
  LayoutDashboard, 
  Send, 
  Map, 
  Users, 
  BarChart3, 
  X,
  Lock
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, isOpen, onClose }) => {
  const { user } = useAuth();
  const { activeClassId } = useClass();

  const studentNavItems = [
    { id: 'today', label: "Today's Class", icon: Calendar, highlight: true },
    { id: 'revision', label: "Revision & Notes", icon: BookOpen },
    { id: 'practice', label: "Practice Problems", icon: Code2 },
    { id: 'group-chat', label: `Class ${user?.role === 'student' ? user.student.classId : ''} Chat`, icon: MessageSquare },
    { id: 'private-chat', label: "Ask Teacher Privately", icon: UserCheck },
    { id: 'syllabus', label: "Official Syllabus & Real-World Lab", icon: FileText },
    { id: 'announcements', label: "Announcements", icon: Megaphone },
    { id: 'profile', label: "My Student Identity", icon: Lock },
  ];

  const teacherNavItems = [
    { id: 'dashboard', label: "Teacher Dashboard", icon: LayoutDashboard },
    { id: 'publish', label: "Publish Today's Class", icon: Send, highlight: true },
    { id: 'live-poll', label: "Live Classroom Poll", icon: BarChart3, highlight: true },
    { id: 'master-plan', label: "45-Period Master Plan", icon: Map },
    { id: 'students', label: "Students Management", icon: Users },
    { id: 'group-chat', label: `Group Chat (${activeClassId})`, icon: MessageSquare },
    { id: 'private-chat', label: "Student Private Inquiries", icon: UserCheck },
    { id: 'practice-bank', label: "Practice Bank", icon: Code2 },
    { id: 'announcements', label: "Post Announcements", icon: Megaphone },
    { id: 'syllabus', label: "Official Syllabus", icon: FileText },
    { id: 'change-password', label: "Change Faculty Password", icon: Lock },
  ];

  const navItems = user?.role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-10 flex flex-col`}
      >
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-200 dark:border-slate-800">
          <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Navigation Menu</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Banner in Sidebar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            {user?.role === 'teacher' ? 'Faculty Portal' : 'Student Workspace'}
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
            {user?.role === 'teacher' ? user.teacher.name : user?.student.name}
          </div>
          <div className="text-xs text-sky-600 dark:text-sky-400 font-medium">
            {user?.role === 'teacher' ? 'All Classes Access' : `Assigned Class: ${user?.student.classId}`}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : item.highlight
                    ? 'text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-950/60'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : ''}`} />
                <span className="truncate">{item.label}</span>
                {item.highlight && !isActive && (
                  <Sparkles className="w-3.5 h-3.5 ml-auto text-amber-500 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex flex-col gap-1">
          <div>Python Class LMS v1.0</div>
          <div className="text-[10px] text-slate-400/80">Teach • Understand • Practice • Revise</div>
        </div>
      </aside>
    </>
  );
};
