import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../lib/storage-provider';
import { PrivateConversation, PrivateMessage, Student, ClassId } from '../../types';
import { 
  UserCheck, 
  Send, 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  User, 
  ChevronRight,
  Search,
  CheckCheck,
  UserPlus,
  X,
  GraduationCap
} from 'lucide-react';

export const PrivateChatView: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<PrivateConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<PrivateMessage[]>([]);
  const [activeConv, setActiveConv] = useState<PrivateConversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  
  // Teacher-initiated conversation state
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerClass, setPickerClass] = useState<ClassId | 'all'>('all');
  const [allStudents, setAllStudents] = useState<Student[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations or direct student conversation
  const loadData = () => {
    if (!user) return;

    try {
      if (user.role === 'teacher') {
        const list = storageService.getPrivateConversationsForTeacher();
        setConversations(list);
        setAllStudents(storageService.getStudents());

        if (!selectedConvId && list.length > 0) {
          setSelectedConvId(list[0].id);
        }

        if (selectedConvId) {
          const { conversation, messages } = storageService.getConversationById(selectedConvId, 'teacher');
          setActiveConv(conversation);
          setActiveMessages(messages);
        }
      } else {
        // Student view: automatically locked to their own conversation!
        const { conversation, messages } = storageService.getStudentPrivateConversation(
          user.student.id,
          user.student.classId
        );
        setActiveConv(conversation);
        setActiveMessages(messages);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [user, selectedConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !activeConv) return;

    try {
      const sender = user.role === 'teacher'
        ? { id: user.teacher.id, role: 'teacher' as const }
        : { id: user.student.id, role: 'student' as const };

      storageService.sendPrivateMessage(activeConv.id, inputText, sender);
      setInputText('');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSelectStudentForChat = (student: Student) => {
    try {
      const { conversation } = storageService.initiateTeacherConversation(student.id);
      setSelectedConvId(conversation.id);
      setIsPickerOpen(false);
      setPickerSearch('');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.studentName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.studentRegNo.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.classId.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredPickerStudents = allStudents.filter(s => {
    const matchesClass = pickerClass === 'all' || s.classId === pickerClass;
    const matchesSearch = 
      s.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      s.registerNumber.toLowerCase().includes(pickerSearch.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-10rem)] min-h-[500px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row animate-fadeIn">
      
      {/* Teacher's Student Inbox Sidebar */}
      {user?.role === 'teacher' && (
        <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
          
          {/* Header */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs">
                <UserCheck className="w-4 h-4 text-sky-500" />
                <span>Student Inquiries</span>
              </div>

              <button
                onClick={() => setIsPickerOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition"
                title="Search and message any enrolled student"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Message Student</span>
              </button>
            </div>
            
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter active chats..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs space-y-2">
                <p>No matching active conversations.</p>
                <button
                  onClick={() => setIsPickerOpen(true)}
                  className="text-sky-600 dark:text-sky-400 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Message an enrolled student</span>
                </button>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedConvId === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-l-4 border-sky-500'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                          {conv.studentName}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                          {conv.classId}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {conv.studentRegNo}
                      </div>
                    </div>

                    {conv.teacherUnreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.teacherUnreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Teacher Student Picker Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl animate-scaleUp overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Message a Student
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Select any student from the 154 registered students across all classes.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Class Filter & Search */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                {(['all', 'C1-112', 'C2-147', 'C3-091'] as const).map(cId => (
                  <button
                    key={cId}
                    onClick={() => setPickerClass(cId)}
                    className={`px-3 py-1 rounded-xl font-bold text-xs shrink-0 transition ${
                      pickerClass === cId
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {cId === 'all' ? 'All (154)' : cId}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search student by name or register number..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Students List */}
            <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800 max-h-[380px]">
              {filteredPickerStudents.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs italic">
                  No students matching "{pickerSearch}"
                </div>
              ) : (
                filteredPickerStudents.map((s) => {
                  const hasExistingConv = conversations.some(c => c.studentId === s.id);

                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectStudentForChat(s)}
                      className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition gap-2 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-sky-100 dark:group-hover:bg-sky-950 group-hover:text-sky-600 transition">
                          {s.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                            {s.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {s.registerNumber}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {s.classId}
                        </span>

                        {hasExistingConv ? (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            Open Chat →
                          </span>
                        ) : (
                          <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">
                            Start Chat →
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      )}

      {/* Main Chat Thread */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900">
        
        {/* Thread Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  {user?.role === 'teacher'
                    ? `${activeConv?.studentName || 'Select a student'} (${activeConv?.classId || ''})`
                    : 'Private Desk with Instructor'}
                </h3>
                <span className="text-[10px] bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold px-2 py-0.5 rounded-full">
                  Confidential
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {user?.role === 'teacher'
                  ? `Reg No: ${activeConv?.studentRegNo || ''} • 1-on-1 private academic consultation`
                  : 'Only your instructor can read your private questions. No student-to-student messaging allowed.'}
              </p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Message Bubble List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {activeMessages.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs italic space-y-2">
              <Lock className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p>No messages in this private conversation yet.</p>
              <p className="text-[11px]">Type your question below to message the instructor privately.</p>
            </div>
          ) : (
            activeMessages.map((msg) => {
              const isMe = user?.role === 'student'
                ? msg.senderRole === 'student'
                : msg.senderRole === 'teacher';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-400 mb-1 px-1">
                    {msg.senderRole === 'teacher' ? 'Prof. Deva Dinesh (Teacher)' : (activeConv?.studentName || 'Student')}
                    {' • '}
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] sm:max-w-[70%] ${
                      isMe
                        ? 'bg-sky-600 text-white rounded-br-none shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        {activeConv && (
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={user?.role === 'teacher' ? 'Reply to student privately...' : 'Ask your instructor a private question...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all shadow-inner"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white disabled:opacity-40 transition-colors shadow-md shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
