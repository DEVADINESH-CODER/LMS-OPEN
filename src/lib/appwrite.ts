import { Client, Account, Databases, Storage } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '6a9efb2b003c964b429d';
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
    return () => {};
  }
  return client.subscribe(channel, callback);
}

// --- SERVER SYNC HELPERS ---

export async function fetchTeacherAuthFromServer(): Promise<{ passwordHash: string; salt: string } | null> {
  if (!isAppwriteConfigured) return null;
  try {
    const doc = await databases.getDocument(databaseId, COLLECTIONS.ADMIN_USERS, 'teacher_admin');
    if (doc && doc.passwordHash && doc.salt) {
      return { passwordHash: doc.passwordHash, salt: doc.salt };
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveTeacherAuthToServer(passwordHash: string, salt: string): Promise<void> {
  if (!isAppwriteConfigured) return;
  try {
    await databases.updateDocument(databaseId, COLLECTIONS.ADMIN_USERS, 'teacher_admin', {
      passwordHash,
      salt,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Could not sync teacher auth to Appwrite:', e);
  }
}

export async function fetchStudentFromServer(studentId: string): Promise<{ pinHash: string; salt: string; mustChangePin: boolean; isActive: boolean } | null> {
  if (!isAppwriteConfigured) return null;
  try {
    const doc = await databases.getDocument(databaseId, COLLECTIONS.STUDENTS, studentId);
    if (doc && doc.pinHash && doc.salt) {
      return {
        pinHash: doc.pinHash,
        salt: doc.salt,
        mustChangePin: Boolean(doc.mustChangePin),
        isActive: Boolean(doc.isActive)
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveStudentPinToServer(studentId: string, pinHash: string, salt: string, mustChangePin: boolean = false): Promise<void> {
  if (!isAppwriteConfigured) return;
  try {
    await databases.updateDocument(databaseId, COLLECTIONS.STUDENTS, studentId, {
      studentId,
      pinHash,
      salt,
      mustChangePin,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Could not sync student PIN to Appwrite:', e);
  }
}

export async function updateStudentStatusOnServer(studentId: string, isActive: boolean): Promise<void> {
  if (!isAppwriteConfigured) return;
  try {
    await databases.updateDocument(databaseId, COLLECTIONS.STUDENTS, studentId, {
      studentId,
      isActive,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Could not sync student status to Appwrite:', e);
  }
}

export async function fetchAnnouncementsFromServer(): Promise<any[] | null> {
  if (!isAppwriteConfigured) return null;
  try {
    const res = await databases.listDocuments(databaseId, COLLECTIONS.ANNOUNCEMENTS);
    return res.documents.map(d => ({
      id: d.announcementId || d.$id,
      title: d.title,
      content: d.content,
      targetClass: d.targetClass,
      priority: d.priority,
      authorName: d.authorName,
      createdAt: d.createdAt
    }));
  } catch {
    return null;
  }
}

export async function saveAnnouncementToServer(ann: any): Promise<void> {
  if (!isAppwriteConfigured) return;
  try {
    const docId = (ann.id || `ANN-${Date.now()}`).replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 36);
    const payload = {
      announcementId: ann.id,
      title: ann.title,
      content: ann.content,
      targetClass: ann.targetClass,
      priority: ann.priority,
      authorName: ann.authorName,
      createdAt: ann.createdAt
    };
    try {
      await databases.getDocument(databaseId, COLLECTIONS.ANNOUNCEMENTS, docId);
      await databases.updateDocument(databaseId, COLLECTIONS.ANNOUNCEMENTS, docId, payload);
    } catch {
      await databases.createDocument(databaseId, COLLECTIONS.ANNOUNCEMENTS, docId, payload);
    }
  } catch (e) {
    console.warn('Could not sync announcement to Appwrite:', e);
  }
}

export async function deleteAnnouncementFromServer(annId: string): Promise<void> {
  if (!isAppwriteConfigured) return;
  try {
    const docId = annId.replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 36);
    await databases.deleteDocument(databaseId, COLLECTIONS.ANNOUNCEMENTS, docId);
  } catch {}
}

export async function fetchLessonsFromServer(): Promise<any[] | null> {
  if (!isAppwriteConfigured) return null;
  try {
    const res = await databases.listDocuments(databaseId, COLLECTIONS.LESSONS);
    return res.documents
      .map(d => {
        if (d.lessonData) {
          try {
            return JSON.parse(d.lessonData);
          } catch {}
        }
        return null;
      })
      .filter(Boolean);
  } catch {
    return null;
  }
}

export async function saveLessonToServer(lesson: any): Promise<void> {
  if (!isAppwriteConfigured) return;
  try {
    const docId = (lesson.id || `LES-${Date.now()}`).replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 36);
    const payload = {
      lessonId: (lesson.id || docId).slice(0, 64),
      classId: lesson.classId,
      periodNumber: Number(lesson.periodNumber) || 1,
      topic: (lesson.topic || 'Untitled Lesson').slice(0, 255),
      lessonData: JSON.stringify(lesson),
      publishedAt: lesson.publishedAt || new Date().toISOString()
    };
    try {
      await databases.getDocument(databaseId, COLLECTIONS.LESSONS, docId);
      await databases.updateDocument(databaseId, COLLECTIONS.LESSONS, docId, payload);
    } catch {
      await databases.createDocument(databaseId, COLLECTIONS.LESSONS, docId, payload);
    }
  } catch (e) {
    console.warn('Could not sync lesson to Appwrite:', e);
  }
}

