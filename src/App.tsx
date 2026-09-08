import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClassProvider, useClass } from './context/ClassContext';
import { NotificationProvider } from './context/NotificationContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LoginModal } from './components/auth/LoginModal';
import { ChangePinModal } from './components/auth/ChangePinModal';

// Student views
import { StudentTodayView } from './components/student/StudentTodayView';
import { StudentRevisionView } from './components/student/StudentRevisionView';
import { StudentPracticeView } from './components/student/StudentPracticeView';
import { StudentSyllabusView } from './components/student/StudentSyllabusView';
import { StudentProfileView } from './components/student/StudentProfileView';
import { StudentAnnouncementsView } from './components/student/StudentAnnouncementsView';

// Teacher views
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { PublishLessonModal } from './components/teacher/PublishLessonModal';
import { MasterPlanView } from './components/teacher/MasterPlanView';
import { StudentManagementView } from './components/teacher/StudentManagementView';
import { LivePollStudio } from './components/teacher/LivePollStudio';
import { LivePollBanner } from './components/student/LivePollBanner';
import { AnnouncementsManager } from './components/teacher/AnnouncementsManager';
import { ChangeTeacherPasswordModal } from './components/teacher/ChangeTeacherPasswordModal';
import { PracticeBankManager } from './components/teacher/PracticeBankManager';

// Chat views
import { ClassGroupChat } from './components/chat/ClassGroupChat';
import { PrivateChatView } from './components/chat/PrivateChatView';

const MainLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { activeClassId } = useClass();

  // Retrieve saved tab from hash or localStorage
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash) return hash;
    const saved = localStorage.getItem('lms_current_active_tab');
    if (saved) return saved;
    return 'today';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Modals
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishPeriodNumber, setPublishPeriodNumber] = useState<number>(1);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [showTeacherPasswordModal, setShowTeacherPasswordModal] = useState(false);

  // Set and validate tab based on user role
  React.useEffect(() => {
    if (user) {
      const hash = window.location.hash.replace('#', '').trim();
      const saved = localStorage.getItem('lms_current_active_tab');
      const validTabsForRole = user.role === 'teacher' 
        ? ['dashboard', 'master-plan', 'students', 'live-poll', 'group-chat', 'private-chat', 'practice-bank', 'practice-preview', 'announcements', 'syllabus']
        : ['today', 'revision', 'practice', 'group-chat', 'private-chat', 'syllabus', 'announcements', 'profile'];
      
      const targetTab = hash && validTabsForRole.includes(hash)
        ? hash
        : saved && validTabsForRole.includes(saved)
        ? saved
        : user.role === 'teacher' ? 'dashboard' : 'today';

      setCurrentTab(targetTab);
      window.location.hash = targetTab;
      localStorage.setItem('lms_current_active_tab', targetTab);
    }
  }, [user?.role]);

  // Sync tab navigation with hash & localStorage
  const handleNavigateTab = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    localStorage.setItem('lms_current_active_tab', tab);
  };

  // Listen for browser back/forward navigation
  React.useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) {
        setCurrentTab(hash);
        localStorage.setItem('lms_current_active_tab', hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 font-mono">Initializing LMS Environment...</span>
        </div>
      </div>
    );
  }

  // Not logged in -> Show Login Portal
  if (!user) {
    return <LoginModal />;
  }

  // Mandatory PIN Change Guard for Students
  const isMandatoryPinChange = user.role === 'student' && user.student.mustChangePin;

  const handleOpenPublishPeriod = (periodNum: number) => {
    setPublishPeriodNumber(periodNum);
    setShowPublishModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Header */}
      <Header
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenChangePin={() => setShowChangePinModal(true)}
        onOpenChangePassword={() => setShowTeacherPasswordModal(true)}
        onNavigate={(tab) => handleNavigateTab(tab)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (tab === 'publish') {
              setShowPublishModal(true);
            } else if (tab === 'change-password') {
              setShowTeacherPasswordModal(true);
            } else {
              handleNavigateTab(tab);
            }
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {user.role === 'student' ? (
            <>
              {currentTab === 'today' && <StudentTodayView />}
              {currentTab === 'revision' && <StudentRevisionView />}
              {currentTab === 'practice' && <StudentPracticeView />}
              {currentTab === 'group-chat' && <ClassGroupChat />}
              {currentTab === 'private-chat' && <PrivateChatView />}
              {currentTab === 'syllabus' && <StudentSyllabusView onNavigate={(tab) => handleNavigateTab(tab)} />}
              {currentTab === 'announcements' && <StudentAnnouncementsView />}
              {currentTab === 'profile' && <StudentProfileView />}
            </>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <TeacherDashboard
                  onNavigate={(tab) => handleNavigateTab(tab)}
                  onOpenPublish={() => setShowPublishModal(true)}
                />
              )}
              {currentTab === 'master-plan' && (
                <MasterPlanView onPublishPeriod={handleOpenPublishPeriod} />
              )}
              {currentTab === 'students' && <StudentManagementView />}
              {currentTab === 'live-poll' && <LivePollStudio />}
              {currentTab === 'group-chat' && <ClassGroupChat />}
              {currentTab === 'private-chat' && <PrivateChatView />}
              {currentTab === 'practice-bank' && (
                <PracticeBankManager onPreviewStudentMode={() => handleNavigateTab('practice-preview')} />
              )}
              {currentTab === 'practice-preview' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sky-800 dark:text-sky-300">Student Practice Preview Mode</span>
                      <span className="text-slate-500">• Previewing student solving experience</span>
                    </div>
                    <button
                      onClick={() => handleNavigateTab('practice-bank')}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-500 text-xs"
                    >
                      Back to Practice Bank Manager
                    </button>
                  </div>
                  <StudentPracticeView onOpenManageBank={() => handleNavigateTab('practice-bank')} />
                </div>
              )}
              {currentTab === 'announcements' && <AnnouncementsManager />}
              {currentTab === 'syllabus' && <StudentSyllabusView onNavigate={(tab) => handleNavigateTab(tab)} />}
            </>
          )}
        </main>
      </div>

      {/* Global In-Class Live Poll Banner for Students */}
      <LivePollBanner />

      {/* Teacher Publish Lesson Modal */}
      {showPublishModal && (
        <PublishLessonModal
          isOpen={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          initialPeriodNumber={publishPeriodNumber}
        />
      )}

      {/* Mandatory or Voluntary Change PIN Modal for Students */}
      <ChangePinModal
        isOpen={showChangePinModal || isMandatoryPinChange}
        onClose={() => setShowChangePinModal(false)}
        isMandatory={isMandatoryPinChange}
      />

      {/* Faculty Change Password Modal */}
      <ChangeTeacherPasswordModal
        isOpen={showTeacherPasswordModal}
        onClose={() => setShowTeacherPasswordModal(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ClassProvider>
        <NotificationProvider>
          <MainLayout />
        </NotificationProvider>
      </ClassProvider>
    </AuthProvider>
  );
}
