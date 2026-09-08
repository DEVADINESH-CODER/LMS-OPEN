import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClass } from '../../context/ClassContext';
import { storageService } from '../../lib/storage-provider';
import { ClassId, GroupMessage } from '../../types';
import { 
  MessageSquare, 
  Send, 
  Pin, 
  Trash2, 
  ShieldCheck, 
  PinOff, 
  AlertCircle,
  User,
  Sparkles
} from 'lucide-react';

import { subscribeToChannel } from '../../lib/appwrite';

export const ClassGroupChat: React.FC = () => {
  const { user } = useAuth();
  const { activeClassId } = useClass();

  // If user is student, always enforce their assigned class
  const targetClassId: ClassId = user?.role === 'student' ? user.student.classId : activeClassId;

  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    if (!user) return;
    try {
      await storageService.syncGroupMessages();
      const msgs = storageService.getGroupMessages(
        targetClassId, 
        user.role, 
        user.role === 'student' ? user.student.classId : undefined
      );
      setMessages(msgs);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // 3s polling fallback
    
    // Realtime channel subscription
    const unsubscribe = subscribeToChannel(
      'databases.python_class_lms.collections.group_messages.documents',
      () => {
        loadMessages();
      }
    );

    return () => {
      clearInterval(interval);
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [targetClassId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    try {
      const sender = user.role === 'teacher' 
        ? { id: user.teacher.id, name: user.teacher.name, role: 'teacher' as const }
        : { 
            id: user.student.id, 
            name: user.student.name, 
            role: 'student' as const, 
            classId: user.student.classId 
          };

      storageService.sendGroupMessage(targetClassId, inputText, sender);
      setInputText('');
      loadMessages();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleTogglePin = (messageId: string, currentPinned: boolean) => {
    if (!user || user.role !== 'teacher') return;
    storageService.pinGroupMessage(messageId, !currentPinned, 'teacher');
    loadMessages();
  };

  const handleDelete = (messageId: string) => {
    if (!user || user.role !== 'teacher') return;
    if (confirm('Are you sure you want to delete this message?')) {
      storageService.deleteGroupMessage(messageId, 'teacher');
      loadMessages();
    }
  };

  const pinnedMessage = messages.find(m => m.isPinned);

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)] min-h-[500px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fadeIn">
      
      {/* Group Chat Top Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md shadow-sky-600/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                Class {targetClassId} Discussion Group
              </h2>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Isolated classroom chat • Instructor moderated • Verified identities
            </p>
          </div>
        </div>

        {user?.role === 'teacher' && (
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Moderator Active</span>
          </div>
        )}
      </div>

      {/* Pinned Message Alert Banner */}
      {pinnedMessage && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 p-3 px-4 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 animate-fadeIn">
          <div className="flex items-center gap-2 min-w-0">
            <Pin className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="truncate">
              <span className="font-bold mr-1">Pinned by Teacher:</span>
              <span>{pinnedMessage.content}</span>
            </div>
          </div>
          {user?.role === 'teacher' && (
            <button
              onClick={() => handleTogglePin(pinnedMessage.id, true)}
              className="text-amber-700 hover:text-amber-900 dark:text-amber-400 text-[10px] font-semibold flex items-center gap-1 shrink-0"
              title="Unpin message"
            >
              <PinOff className="w-3.5 h-3.5" />
              <span>Unpin</span>
            </button>
          )}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border-b border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs italic space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <p>No messages yet in Class {targetClassId}.</p>
            <p className="text-[11px]">Ask a question about today's Python topic to start the discussion!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = user?.role === 'student' 
              ? msg.senderId === user.student.id 
              : msg.senderId === user?.teacher.id;
            const isTeacherMsg = msg.senderRole === 'teacher';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
              >
                {/* Sender Identity & Role */}
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 px-1">
                  <span>{msg.senderName}</span>
                  {isTeacherMsg && (
                    <span className="text-[9px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded font-extrabold">
                      STAFF
                    </span>
                  )}
                  {msg.isPinned && (
                    <Pin className="w-3 h-3 text-amber-500 inline fill-current" />
                  )}
                  <span className="text-[10px] text-slate-400 font-normal">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Bubble */}
                <div className="flex items-center gap-2 max-w-[85%] sm:max-w-[70%]">
                  <div
                    className={`p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isTeacherMsg
                        ? 'bg-gradient-to-r from-indigo-600 to-sky-700 text-white shadow-md shadow-indigo-600/10'
                        : isMe
                        ? 'bg-sky-600 text-white rounded-br-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Teacher Moderation Actions on Hover */}
                  {user?.role === 'teacher' && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleTogglePin(msg.id, msg.isPinned)}
                        className="p-1 rounded text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title={msg.isPinned ? 'Unpin' : 'Pin to Top'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder={`Post a message to Class ${targetClassId}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all shadow-inner"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white disabled:opacity-40 transition-colors shadow-md shadow-sky-600/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
