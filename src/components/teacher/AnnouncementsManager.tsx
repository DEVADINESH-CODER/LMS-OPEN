import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { storageService } from '../../lib/storage-provider';
import { Announcement, ClassId } from '../../types';
import { 
  Megaphone, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  User,
  Sparkles,
  Edit2,
  Trash2,
  X,
  Check
} from 'lucide-react';

export const AnnouncementsManager: React.FC = () => {
  const { classes, activeClassId } = useClass();
  const [announcements, setAnnouncements] = useState<Announcement[]>(storageService.getAnnouncements('teacher'));

  // Create Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetClass, setTargetClass] = useState<ClassId | 'all'>('all');
  const [priority, setPriority] = useState<'normal' | 'important'>('normal');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTargetClass, setEditTargetClass] = useState<ClassId | 'all'>('all');
  const [editPriority, setEditPriority] = useState<'normal' | 'important'>('normal');

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    storageService.createAnnouncement({
      title: title.trim(),
      content: content.trim(),
      targetClass,
      priority
    });

    setTitle('');
    setContent('');
    setSuccessMsg('Announcement posted and in-app notifications delivered!');
    setAnnouncements(storageService.getAnnouncements('teacher'));
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleStartEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setEditTitle(ann.title);
    setEditContent(ann.content);
    setEditTargetClass(ann.targetClass);
    setEditPriority(ann.priority);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editTitle.trim() || !editContent.trim()) return;

    try {
      storageService.updateAnnouncement(editingId, {
        title: editTitle.trim(),
        content: editContent.trim(),
        targetClass: editTargetClass,
        priority: editPriority
      });

      setEditingId(null);
      setSuccessMsg('Announcement updated successfully!');
      setAnnouncements(storageService.getAnnouncements('teacher'));
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update announcement');
    }
  };

  const handleDelete = (id: string) => {
    try {
      storageService.deleteAnnouncement(id);
      setDeletingId(null);
      setSuccessMsg('Announcement deleted successfully.');
      setAnnouncements(storageService.getAnnouncements('teacher'));
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete announcement');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Classroom Announcements
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Broadcast, edit, and manage targeted notifications for C1 112, C2 147, C3 091, or all students.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Post New Announcement Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs sm:text-sm">
        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-sm">
          <Megaphone className="w-4 h-4 text-sky-500" />
          <span>Create Announcement</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              Target Audience
            </label>
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value as ClassId | 'all')}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100"
            >
              <option value="all">All Classes (C1 112, C2 147, C3 091)</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>Class {c.id} Only</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'normal' | 'important')}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100"
            >
              <option value="normal">Normal Announcement</option>
              <option value="important">Important / Urgent Notice</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
            Announcement Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Bring lab manuals for Period 13 session..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
            Message Body
          </label>
          <textarea
            rows={3}
            required
            placeholder="Enter announcement details..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center gap-2 transition"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Announcement</span>
          </button>
        </div>
      </form>

      {/* Edit Announcement Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
                <Edit2 className="w-4 h-4 text-amber-500" />
                <span>Edit Announcement</span>
              </div>
              <button 
                onClick={() => setEditingId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Target Class</label>
                  <select
                    value={editTargetClass}
                    onChange={(e) => setEditTargetClass(e.target.value as ClassId | 'all')}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                  >
                    <option value="all">All Classes</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>Class {c.id}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as 'normal' | 'important')}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Content</label>
                <textarea
                  rows={4}
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcements Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
            Published Announcements ({announcements.length}):
          </div>
          <span className="text-[11px] text-slate-400">
            Active across classroom portals
          </span>
        </div>

        {announcements.length === 0 ? (
          <div className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-500 text-xs">
            No announcements yet. Use the form above to broadcast an announcement.
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm space-y-2 transition ${
                ann.priority === 'important'
                  ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    ann.targetClass === 'all'
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                      : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                  }`}>
                    {ann.targetClass === 'all' ? 'All Classes' : `Class ${ann.targetClass}`}
                  </span>

                  {ann.priority === 'important' && (
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Important</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">
                    {new Date(ann.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => handleStartEdit(ann)}
                      title="Edit announcement"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {deletingId === ann.id ? (
                      <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/50 p-1 rounded-lg border border-rose-300 dark:border-rose-800 animate-fadeIn">
                        <span className="text-[10px] text-rose-700 dark:text-rose-300 font-bold px-1">Delete?</span>
                        <button
                          onClick={() => handleDelete(ann.id)}
                          className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-500"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] hover:bg-slate-300"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingId(ann.id)}
                        title="Delete announcement"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {ann.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                {ann.content}
              </p>

              <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                <span>Author: {ann.authorName}</span>
                <span className="text-[10px] text-slate-400 font-mono">ID: {ann.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
