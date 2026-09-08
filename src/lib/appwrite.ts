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
    const docId = (lesson.id || `LES_${lesson.classId}_P${lesson.periodNumber}`).replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 36);
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

export async function deleteLessonFromServer(lessonId: string): Promise<void> {
  if (!isAppwriteConfigured) return;
  try {
    const docId = lessonId.replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 36);
    await databases.deleteDocument(databaseId, COLLECTIONS.LESSONS, docId);
  } catch (e) {
    console.warn('Could not delete lesson from Appwrite:', e);
  }
}

// --- GROUP CHAT SYNC ---

export async function fetchGroupMessagesFromServer(classId?: string): Promise<any[] | null> {
  if (!isAppwriteConfigured) return null;
  try {
    const queries: any[] = [];
    const res = await databases.listDocuments(databaseId, COLLECTIONS.GROUP_MESSAGES, queries);
    return res.documents.map(d => ({
      id: d.messageId || d.$id,
      classId: d.classId,
      senderId: d.senderId,
      senderName: d.senderName,
      senderRole: d.senderRole,
      content: d.content,
      isPinned: Boolean(d.isPinned),
      isDeleted: Boolean(d.isDeleted),
      createdAt: d.createdAt
    }));
  } catch {
    return null;
  }
}

export async function saveGroupMessageToServer(msg: any): Promise<void> {
  if (!isAppwriteConfigured) return;
  try {
    const docId = (msg.id || `GM-${Date.now()}`).replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 36);
    const payload = {
      messageId: msg.id || docId,
      classId: msg.classId,
      senderId: msg.senderId,
      senderName: msg.senderName,
      senderRole: msg.senderRole,
      content: msg.content,
      isPinned: Boolean(msg.isPinned),
      isDeleted: Boolean(msg.isDeleted),
      createdAt: msg.createdAt || new Date().toISOString()
    };
    try {
      await databases.getDocument(databaseId, COLLECTIONS.GROUP_MESSAGES, docId);
      await databases.updateDocument(databaseId, COLLECTIONS.GROUP_MESSAGES, docId, payload);
    } catch {
      await databases.createDocument(databaseId, COLLECTIONS.GROUP_MESSAGES, docId, payload);
    }
  } catch (e) {
    console.warn('Could not sync group message to Appwrite:', e);
  }
}

// --- PRIVATE CHAT SYNC ---

export async function fetchPrivateConversationsFromServer(): Promise<any[] | null> {
  if (!isAppwriteConfigured) return null;
  try {
    const res = await databases.listDocuments(databaseId, COLLECTIONS.PRIVATE_CONVERSATIONS);
    return res.documents.map(d => ({
      id: d.conversationId || d.$id,
      studentId: d.studentId,
      classId: d.classId,
      studentName: d.studentName,
      studentRegNo: d.studentRegNo,
      lastMessageAt: d.lastMessageAt,
      lastMessageSnippet: d.lastMessageSnippet || ''
    }));
  } catch {
    return null;
  }
}

export async function savePrivateConversationToServer(conv: any): Promise<void> {
  if (!isAppwriteConfigured) return;
  try {
    const docId = (conv.id || `CONV-${conv.studentId}`).replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 36);
    const payload = {
      conversationId: conv.id || docId,
      studentId: conv.studentId,
      classId: conv.classId,
      studentName: conv.studentName,
      studentRegNo: conv.studentRegNo || '',
      lastMessageAt: conv.lastMessageAt || new Date().toISOString(),
      lastMessageSnippet: (conv.lastMessageSnippet || '').slice(0, 255)
    };
    try {
      await databases.getDocument(databaseId, COLLECTIONS.PRIVATE_CONVERSATIONS, docId);
      await databases.updateDocument(databaseId, COLLECTIONS.PRIVATE_CONVERSATIONS, docId, payload);
    } catch {
      await databases.createDocument(databaseId, COLLECTIONS.PRIVATE_CONVERSATIONS, docId, payload);
    }
  } catch (e) {
    console.warn('Could not sync private conversation to Appwrite:', e);
  }
}

export async function fetchPrivateMessagesFromServer(): Promise<any[] | null> {
  if (!isAppwriteConfigured) return null;
  try {
    const res = await databases.listDocuments(databaseId, COLLECTIONS.PRIVATE_MESSAGES);
    return res.documents.map(d => ({
      id: d.messageId || d.$id,
      conversationId: d.conversationId,
      senderId: d.senderId,
      senderName: d.senderName,
      senderRole: d.senderRole,
      content: d.content,
      isRead: Boolean(d.isRead),
      createdAt: d.createdAt
    }));
  } catch {
    return null;
  }
}

export async function savePrivateMessageToServer(msg: any): Promise<void> {
  if (!isAppwriteConfigured) return;
  try {
    const docId = (msg.id || `PM-${Date.now()}`).replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 36);
    const payload = {
      messageId: msg.id || docId,
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      senderName: msg.senderName,
      senderRole: msg.senderRole,
      content: msg.content,
      isRead: Boolean(msg.isRead),
      createdAt: msg.createdAt || new Date().toISOString()
    };
    try {
      await databases.getDocument(databaseId, COLLECTIONS.PRIVATE_MESSAGES, docId);
      await databases.updateDocument(databaseId, COLLECTIONS.PRIVATE_MESSAGES, docId, payload);
    } catch {
      await databases.createDocument(databaseId, COLLECTIONS.PRIVATE_MESSAGES, docId, payload);
    }
  } catch (e) {
    console.warn('Could not sync private message to Appwrite:', e);
  }
}

// --- CLASS PROGRESS SYNC ---

export async function fetchClassProgressFromServer(): Promise<Record<string, any> | null> {
  if (!isAppwriteConfigured) return null;
  try {
    const res = await databases.listDocuments(databaseId, COLLECTIONS.CLASS_PROGRESS);
    const progressMap: Record<string, any> = {};
    for (const d of res.documents) {
      if (d.progressData) {
        try {
          progressMap[d.classId] = JSON.parse(d.progressData);
        } catch {}
      }
    }
    return Object.keys(progressMap).length > 0 ? progressMap : null;
  } catch {
    return null;
  }
}

export async function saveClassProgressToServer(progress: any): Promise<void> {
  if (!isAppwriteConfigured || !progress.classId) return;
  try {
    const docId = `PROG_${progress.classId}`.replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 36);
    const payload = {
      classId: progress.classId,
      currentPeriod: Number(progress.currentPeriod) || 1,
      currentUnit: Number(progress.currentUnit) || 1,
      currentTopic: (progress.currentTopic || '').slice(0, 255),
      progressData: JSON.stringify(progress),
      lastUpdated: progress.lastUpdated || new Date().toISOString()
    };
    try {
      await databases.getDocument(databaseId, COLLECTIONS.CLASS_PROGRESS, docId);
      await databases.updateDocument(databaseId, COLLECTIONS.CLASS_PROGRESS, docId, payload);
    } catch {
      await databases.createDocument(databaseId, COLLECTIONS.CLASS_PROGRESS, docId, payload);
    }
  } catch (e) {
    console.warn('Could not sync class progress to Appwrite:', e);
  }
}

// --- PRACTICE BANK SYNC ---

export async function fetchPracticeQuestionsFromServer(): Promise<any[] | null> {
  if (!isAppwriteConfigured) return null;
  try {
    const res = await databases.listDocuments(databaseId, COLLECTIONS.PRACTICE_QUESTIONS);
    return res.documents
      .map(d => {
        if (d.questionData) {
          try {
            return JSON.parse(d.questionData);
          } catch {}
        }
        return null;
      })
      .filter(Boolean);
  } catch {
    return null;
  }
}

export async function savePracticeQuestionToServer(q: any): Promise<void> {
  if (!isAppwriteConfigured) return;
  try {
    const docId = (q.id || `PQ-${Date.now()}`).replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 36);
    const payload = {
      questionId: q.id || docId,
      unit: Number(q.unit) || 1,
      periodNumber: Number(q.periodNumber) || 1,
      topic: (q.topic || 'Python Practice').slice(0, 255),
      difficulty: q.difficulty || 'standard',
      type: q.type || 'coding',
      questionData: JSON.stringify(q)
    };
    try {
      await databases.getDocument(databaseId, COLLECTIONS.PRACTICE_QUESTIONS, docId);
      await databases.updateDocument(databaseId, COLLECTIONS.PRACTICE_QUESTIONS, docId, payload);
    } catch {
      await databases.createDocument(databaseId, COLLECTIONS.PRACTICE_QUESTIONS, docId, payload);
    }
  } catch (e) {
    console.warn('Could not sync practice question to Appwrite:', e);
  }
}

export async function deletePracticeQuestionFromServer(questionId: string): Promise<void> {
  if (!isAppwriteConfigured) return;
  try {
    const docId = questionId.replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 36);
    await databases.deleteDocument(databaseId, COLLECTIONS.PRACTICE_QUESTIONS, docId);
  } catch (e) {
    console.warn('Could not delete practice question from Appwrite:', e);
  }
}



