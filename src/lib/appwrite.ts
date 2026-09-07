import { Client, Account, Databases, Storage } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
export const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'python_class_lms';
export const storageBucketId = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID || 'course_materials';

export const isAppwriteConfigured = Boolean(projectId && projectId.trim() !== '');

export const client = new Client();

if (isAppwriteConfigured) {
  client.setEndpoint(endpoint).setProject(projectId);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Appwrite Collection IDs mapping
export const COLLECTIONS = {
  CLASSES: 'classes',
  STUDENTS: 'students',
  ADMIN_USERS: 'admin_users',
  MASTER_PLAN: 'master_plan',
  SYLLABUS: 'syllabus',
  LESSONS: 'lessons',
  CLASS_PROGRESS: 'class_progress',
  PRACTICE_QUESTIONS: 'practice_questions',
  ANNOUNCEMENTS: 'announcements',
  GROUP_MESSAGES: 'group_messages',
  PRIVATE_CONVERSATIONS: 'private_conversations',
  PRIVATE_MESSAGES: 'private_messages',
  NOTIFICATIONS: 'notifications',
  AUDIT_LOGS: 'audit_logs',
};

/**
 * Get file download URL from Appwrite Storage
 */
export function getStorageFileUrl(fileId: string): string {
  if (!isAppwriteConfigured || !fileId) return '';
  return storage.getFileView(storageBucketId, fileId).toString();
}

/**
 * Realtime helper for subscribing to chat and notifications
 */
export function subscribeToChannel(channel: string, callback: (response: any) => void) {
  if (!isAppwriteConfigured) {
    return () => {}; // No-op if Appwrite is not configured
  }
  return client.subscribe(channel, callback);
}
