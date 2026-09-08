import { 
  ClassId, 
  ClassInfo, 
  Student, 
  TeacherAdmin, 
  LessonContent, 
  ClassProgress, 
  PracticeQuestion, 
  Announcement, 
  GroupMessage, 
  PrivateConversation, 
  PrivateMessage, 
  InAppNotification,
  AuditLog,
  AuthUser,
  LivePoll,
  PollVote
} from '../types';
import { 
  INITIAL_CLASSES, 
  INITIAL_STUDENTS, 
  INITIAL_TEACHER, 
  INITIAL_LESSONS, 
  INITIAL_PROGRESS, 
  INITIAL_PRACTICE_QUESTIONS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_GROUP_MESSAGES, 
  INITIAL_PRIVATE_CONVERSATIONS, 
  INITIAL_PRIVATE_MESSAGES, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';
import { hashPin, verifyPin, generateSalt, createSessionToken, checkRateLimit } from './security';
import {
  fetchTeacherAuthFromServer,
  saveTeacherAuthToServer,
  fetchStudentFromServer,
  saveStudentPinToServer,
  fetchAnnouncementsFromServer,
  saveAnnouncementToServer,
  deleteAnnouncementFromServer,
  fetchLessonsFromServer,
  saveLessonToServer,
  deleteLessonFromServer,
  updateStudentStatusOnServer,
  fetchGroupMessagesFromServer,
  saveGroupMessageToServer,
  fetchPrivateConversationsFromServer,
  savePrivateConversationToServer,
  fetchPrivateMessagesFromServer,
  savePrivateMessageToServer,
  fetchClassProgressFromServer,
  saveClassProgressToServer,
  fetchPracticeQuestionsFromServer,
  savePracticeQuestionToServer,
  deletePracticeQuestionFromServer,
  fetchLivePollFromServer,
  saveLivePollToServer,
  submitPollVoteToServer,
  deleteLivePollFromServer
} from './appwrite';

const STORAGE_KEYS = {
  CLASSES: 'lms_classes_v4',
  STUDENTS: 'lms_students_v4',
  LESSONS: 'lms_lessons_v4',
  PROGRESS: 'lms_progress_v4',
  PRACTICE: 'lms_practice_v4',
  ANNOUNCEMENTS: 'lms_announcements_v4',
  GROUP_MSGS: 'lms_group_msgs_v4',
  CONVERSATIONS: 'lms_conversations_v4',
  PRIVATE_MSGS: 'lms_private_msgs_v4',
  NOTIFICATIONS: 'lms_notifications_v4',
  AUDIT_LOGS: 'lms_audit_logs_v4',
  TEACHER_AUTH: 'lms_teacher_auth_v4',
  LIVE_POLL: 'lms_live_poll_v4'
};

function getLocal<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage error:', err);
  }
}

class StorageService {
  private classes: ClassInfo[];
  private students: Student[];
  private lessons: LessonContent[];
  private progress: Record<string, ClassProgress>;
  private practice: PracticeQuestion[];
  private announcements: Announcement[];
  private groupMessages: GroupMessage[];
  private conversations: PrivateConversation[];
  private privateMessages: PrivateMessage[];
  private notifications: InAppNotification[];
  private auditLogs: AuditLog[];
  private livePoll: LivePoll | null = null;
  private teacherPasswordHash: string = '';
  private teacherPasswordSalt: string = '';

  constructor() {
    // Purge legacy local mock cache keys if present
    if (typeof window !== 'undefined') {
      try {
        const legacyKeys = [
          'lms_lessons', 'lms_lessons_v1', 'lms_lessons_v2', 'lms_lessons_v3',
          'lms_practice', 'lms_practice_v1', 'lms_practice_v2', 'lms_practice_v3',
          'lms_progress', 'lms_progress_v1', 'lms_progress_v2', 'lms_progress_v3',
          'lms_announcements', 'lms_announcements_v1', 'lms_announcements_v2', 'lms_announcements_v3'
        ];
        legacyKeys.forEach(k => localStorage.removeItem(k));
      } catch {}
    }

    this.classes = getLocal(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    this.students = getLocal(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    this.lessons = getLocal(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
    this.progress = getLocal(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
    this.practice = getLocal(STORAGE_KEYS.PRACTICE, INITIAL_PRACTICE_QUESTIONS);
    this.announcements = getLocal(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    this.groupMessages = getLocal(STORAGE_KEYS.GROUP_MSGS, INITIAL_GROUP_MESSAGES);
    this.conversations = getLocal(STORAGE_KEYS.CONVERSATIONS, INITIAL_PRIVATE_CONVERSATIONS);
    this.privateMessages = getLocal(STORAGE_KEYS.PRIVATE_MSGS, INITIAL_PRIVATE_MESSAGES);
    this.notifications = getLocal(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.auditLogs = getLocal(STORAGE_KEYS.AUDIT_LOGS, []);
    this.save();

    this.livePoll = getLocal<LivePoll | null>(STORAGE_KEYS.LIVE_POLL, null);

    const teacherAuth = getLocal<{ hash: string; salt: string } | null>(STORAGE_KEYS.TEACHER_AUTH, null);
    if (teacherAuth && teacherAuth.hash && teacherAuth.salt) {
      this.teacherPasswordHash = teacherAuth.hash;
      this.teacherPasswordSalt = teacherAuth.salt;
    }

    // Trigger initial background sync with Appwrite Cloud
    this.syncWithServer().catch(() => {});
  }

  public async syncGroupMessages(): Promise<void> {
    try {
      const serverGroupMsgs = await fetchGroupMessagesFromServer();
      if (serverGroupMsgs !== null) {
        this.groupMessages = serverGroupMsgs;
        setLocal(STORAGE_KEYS.GROUP_MSGS, this.groupMessages);
      }
    } catch {}
  }

  public async syncPrivateMessages(): Promise<void> {
    try {
      const serverConvs = await fetchPrivateConversationsFromServer();
      if (serverConvs !== null) {
        this.conversations = serverConvs;
        setLocal(STORAGE_KEYS.CONVERSATIONS, this.conversations);
      }
      const serverPrivateMsgs = await fetchPrivateMessagesFromServer();
      if (serverPrivateMsgs !== null) {
        this.privateMessages = serverPrivateMsgs;
        setLocal(STORAGE_KEYS.PRIVATE_MSGS, this.privateMessages);
      }
    } catch {}
  }

  public async syncPractice(): Promise<void> {
    try {
      const serverPractice = await fetchPracticeQuestionsFromServer();
      if (serverPractice !== null) {
        this.practice = serverPractice;
        setLocal(STORAGE_KEYS.PRACTICE, this.practice);
      }
    } catch {}
  }

  public async syncLessons(): Promise<void> {
    try {
      const serverLessons = await fetchLessonsFromServer();
      if (serverLessons !== null) {
        this.lessons = serverLessons;
        setLocal(STORAGE_KEYS.LESSONS, this.lessons);
      }
    } catch {}
  }

  public async syncLivePoll(): Promise<void> {
    try {
      const serverPoll = await fetchLivePollFromServer();
      if (serverPoll && serverPoll.isActive) {
        const now = Date.now();
        const exp = new Date(serverPoll.expiresAt).getTime();
        if (now < exp) {
          this.livePoll = serverPoll;
          setLocal(STORAGE_KEYS.LIVE_POLL, this.livePoll);
          return;
        }
      }
      
      // If server returned null or inactive, check if local poll is still valid
      if (this.livePoll && this.livePoll.isActive) {
        const now = Date.now();
        const exp = new Date(this.livePoll.expiresAt).getTime();
        if (now < exp) {
          return;
        }
      }

      this.livePoll = null;
      setLocal(STORAGE_KEYS.LIVE_POLL, null);
    } catch {}
  }

  public async syncWithServer(): Promise<void> {
    try {
      // 1. Sync teacher auth from Appwrite Cloud
      const serverAuth = await fetchTeacherAuthFromServer();
      if (serverAuth) {
        this.teacherPasswordHash = serverAuth.passwordHash;
        this.teacherPasswordSalt = serverAuth.salt;
        setLocal(STORAGE_KEYS.TEACHER_AUTH, { hash: serverAuth.passwordHash, salt: serverAuth.salt });
      }

      // 2. Sync announcements from Appwrite Cloud
      const serverAnnouncements = await fetchAnnouncementsFromServer();
      if (serverAnnouncements !== null) {
        this.announcements = serverAnnouncements;
        setLocal(STORAGE_KEYS.ANNOUNCEMENTS, this.announcements);
      }

      // 3. Sync lessons from Appwrite Cloud (strictly deduplicated by classId & periodNumber)
      await this.syncLessons();

      // 4. Sync Class Progress from Appwrite Cloud
      const serverProgress = await fetchClassProgressFromServer();
      if (serverProgress) {
        this.progress = { ...this.progress, ...serverProgress };
        setLocal(STORAGE_KEYS.PROGRESS, this.progress);
      }

      // 5. Sync Practice Bank from Appwrite Cloud
      await this.syncPractice();

      // 6. Sync Group Messages from Appwrite Cloud
      await this.syncGroupMessages();

      // 7. Sync Private Conversations & Messages from Appwrite Cloud
      await this.syncPrivateMessages();

      // 8. Sync Live Poll from Appwrite Cloud
      await this.syncLivePoll();
    } catch {
      // Fallback to local storage silently
    }
  }

  private save() {
    setLocal(STORAGE_KEYS.CLASSES, this.classes);
    setLocal(STORAGE_KEYS.STUDENTS, this.students);
    setLocal(STORAGE_KEYS.LESSONS, this.lessons);
    setLocal(STORAGE_KEYS.PROGRESS, this.progress);
    setLocal(STORAGE_KEYS.PRACTICE, this.practice);
    setLocal(STORAGE_KEYS.ANNOUNCEMENTS, this.announcements);
    setLocal(STORAGE_KEYS.GROUP_MSGS, this.groupMessages);
    setLocal(STORAGE_KEYS.CONVERSATIONS, this.conversations);
    setLocal(STORAGE_KEYS.PRIVATE_MSGS, this.privateMessages);
    setLocal(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    setLocal(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  // --- AUTHENTICATION ---

  public async loginStudent(registerNumber: string, pin: string): Promise<AuthUser> {
    const cleanRegNo = registerNumber.trim().toUpperCase();
    
    // Rate limit check: max 5 attempts per register number per minute
    const rateCheck = checkRateLimit(`login_${cleanRegNo}`, 5, 60000);
    if (!rateCheck.allowed) {
      throw new Error('Too many login attempts. Please wait 1 minute before retrying.');
    }

    const student = this.students.find(s => s.registerNumber.toUpperCase() === cleanRegNo);
    if (!student) {
      throw new Error('Invalid Register Number or PIN.');
    }

    if (!student.isActive) {
      throw new Error('This student account has been deactivated. Please contact your instructor.');
    }

    // Always fetch latest PIN & credentials from Appwrite Cloud first
    try {
      const serverStudent = await fetchStudentFromServer(student.id);
      if (serverStudent) {
        student.pinHash = serverStudent.pinHash;
        student.salt = serverStudent.salt;
        student.mustChangePin = serverStudent.mustChangePin;
        student.isActive = serverStudent.isActive;
        this.save();
      }
    } catch {
      // Offline fallback: continue with local cache
    }

    const isPinValid = await verifyPin(pin, student.pinHash, student.salt);
    if (!isPinValid) {
      throw new Error('Invalid Register Number or PIN.');
    }

    const token = await createSessionToken({
      sub: student.id,
      role: 'student',
      regNo: student.registerNumber,
      name: student.name,
      classId: student.classId,
      mustChangePin: student.mustChangePin
    });

    this.logAudit(student.id, 'student', 'STUDENT_LOGIN', `Student ${student.name} logged in`);

    return {
      role: 'student',
      student: { ...student },
      token
    };
  }

  public async loginTeacher(email: string, password: string): Promise<AuthUser> {
    const cleanEmail = email.trim().toLowerCase();
    
    const rateCheck = checkRateLimit(`login_teacher_${cleanEmail}`, 5, 60000);
    if (!rateCheck.allowed) {
      throw new Error('Too many login attempts. Please wait 1 minute.');
    }

    // Always fetch latest teacher credentials from Appwrite Cloud
    try {
      const serverAuth = await fetchTeacherAuthFromServer();
      if (serverAuth) {
        this.teacherPasswordHash = serverAuth.passwordHash;
        this.teacherPasswordSalt = serverAuth.salt;
        setLocal(STORAGE_KEYS.TEACHER_AUTH, { hash: serverAuth.passwordHash, salt: serverAuth.salt });
      }
    } catch {
      // Offline fallback: continue with local cache
    }

    if (cleanEmail === INITIAL_TEACHER.email.toLowerCase()) {
      let isMatch = false;
      if (this.teacherPasswordHash && this.teacherPasswordSalt) {
        isMatch = await verifyPin(password, this.teacherPasswordHash, this.teacherPasswordSalt);
      } else if (password === 'Teacher@2024' || password === '1234') {
        // Fallback check for initial teacher passwords ONLY if not yet custom hashed
        isMatch = true;
      }

      if (isMatch) {
        const token = await createSessionToken({
          sub: INITIAL_TEACHER.id,
          role: 'teacher',
          name: INITIAL_TEACHER.name
        });

        this.logAudit(INITIAL_TEACHER.id, 'teacher', 'TEACHER_LOGIN', 'Teacher logged in successfully');

        return {
          role: 'teacher',
          teacher: INITIAL_TEACHER,
          token
        };
      }
    }

    throw new Error('Invalid Teacher Email or Password.');
  }

  public async changeTeacherPassword(currentPassword: string, newPassword: string): Promise<void> {
    // Check latest state from server first
    try {
      const serverAuth = await fetchTeacherAuthFromServer();
      if (serverAuth) {
        this.teacherPasswordHash = serverAuth.passwordHash;
        this.teacherPasswordSalt = serverAuth.salt;
        setLocal(STORAGE_KEYS.TEACHER_AUTH, { hash: serverAuth.passwordHash, salt: serverAuth.salt });
      }
    } catch {}

    let isCurrentValid = false;
    if (this.teacherPasswordHash && this.teacherPasswordSalt) {
      isCurrentValid = await verifyPin(currentPassword, this.teacherPasswordHash, this.teacherPasswordSalt);
    } else if (currentPassword === 'Teacher@2024' || currentPassword === '1234') {
      isCurrentValid = true;
    }

    if (!isCurrentValid) {
      throw new Error('Current faculty password is incorrect.');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('New faculty password must be at least 6 characters long.');
    }

    const salt = generateSalt(16);
    const hash = await hashPin(newPassword, salt);
    this.teacherPasswordSalt = salt;
    this.teacherPasswordHash = hash;

    setLocal(STORAGE_KEYS.TEACHER_AUTH, { hash, salt });
    this.logAudit(INITIAL_TEACHER.id, 'teacher', 'TEACHER_PASSWORD_CHANGED', 'Faculty password was updated successfully');

    // Immediately push to Appwrite Cloud
    await saveTeacherAuthToServer(hash, salt);
  }

  public async changeStudentPin(studentId: string, currentPin: string, newPin: string): Promise<void> {
    const student = this.students.find(s => s.id === studentId);
    if (!student) throw new Error('Student not found.');

    // Fetch latest PIN from server first to verify
    try {
      const serverStudent = await fetchStudentFromServer(student.id);
      if (serverStudent) {
        student.pinHash = serverStudent.pinHash;
        student.salt = serverStudent.salt;
        student.mustChangePin = serverStudent.mustChangePin;
      }
    } catch {}

    const isValid = await verifyPin(currentPin, student.pinHash, student.salt);
    if (!isValid) throw new Error('Current PIN is incorrect.');

    if (newPin.length < 4 || newPin.length > 8 || !/^\d+$/.test(newPin)) {
      throw new Error('New PIN must be between 4 and 8 digits (numeric only).');
    }

    const newSalt = generateSalt(16);
    const newHash = await hashPin(newPin, newSalt);
    student.pinHash = newHash;
    student.salt = newSalt;
    student.mustChangePin = false;
    student.updatedAt = new Date().toISOString();
    this.save();

    this.logAudit(student.id, 'student', 'PIN_CHANGED', `Student ${student.name} updated their private PIN`);

    // Immediately push to Appwrite Cloud
    await saveStudentPinToServer(student.id, newHash, newSalt);
  }

  // --- CLASSES ---

  public getClasses(): ClassInfo[] {
    return [...this.classes];
  }

  public getClassById(classId: ClassId): ClassInfo | undefined {
    return this.classes.find(c => c.id === classId);
  }

  // --- LESSONS & TODAY'S CLASS ---

  public getTodayLessonForStudent(classId: ClassId): LessonContent | null {
    // Return the latest published lesson for the student's class
    const published = this.lessons
      .filter(l => l.classId === classId && l.status === 'published')
      .sort((a, b) => b.periodNumber - a.periodNumber);
    return published[0] || null;
  }

  public getLessons(): LessonContent[] {
    return [...this.lessons];
  }

  public getClassLessons(classId: ClassId): LessonContent[] {
    return this.lessons
      .filter(l => l.classId === classId)
      .sort((a, b) => b.periodNumber - a.periodNumber);
  }

  public getPublishedRevisionLessons(classId: ClassId, query = ''): LessonContent[] {
    const published = this.lessons.filter(l => l.classId === classId && l.status === 'published');
    
    // Deduplicate strictly by periodNumber so duplicate periods are never shown
    const periodMap = new Map<number, LessonContent>();
    published.forEach(l => {
      const existing = periodMap.get(l.periodNumber);
      if (!existing || new Date(l.updatedAt || l.publishedAt || 0) >= new Date(existing.updatedAt || existing.publishedAt || 0)) {
        periodMap.set(l.periodNumber, l);
      }
    });

    let list = Array.from(periodMap.values());
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(l => 
        l.topic.toLowerCase().includes(q) ||
        l.whatWasTaught.toLowerCase().includes(q) ||
        l.conceptExplanation.toLowerCase().includes(q) ||
        l.periodNumber.toString() === q ||
        `period ${l.periodNumber}`.includes(q)
      );
    }
    return list.sort((a, b) => a.periodNumber - b.periodNumber);
  }

  public publishLesson(lessonData: Omit<LessonContent, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): LessonContent {
    const now = new Date().toISOString();
    const canonicalId = lessonData.id || `LES_${lessonData.classId}_P${lessonData.periodNumber}`;
    
    const index = this.lessons.findIndex(l => l.id === canonicalId || (l.classId === lessonData.classId && l.periodNumber === lessonData.periodNumber));
    
    let updatedLesson: LessonContent;
    if (index !== -1) {
      updatedLesson = {
        ...this.lessons[index],
        ...lessonData,
        id: canonicalId,
        status: 'published',
        publishedAt: now,
        updatedAt: now
      };
      this.lessons[index] = updatedLesson;
    } else {
      updatedLesson = {
        ...lessonData,
        id: canonicalId,
        status: 'published',
        publishedAt: now,
        createdAt: now,
        updatedAt: now
      };
      this.lessons.push(updatedLesson);
    }

    this.updateClassActivePeriod(lessonData.classId, lessonData.periodNumber);
    this.save();
    this.createClassNotification(lessonData.classId, `Period ${lessonData.periodNumber} Published`, `Lesson on "${lessonData.topic}" is now live on your Today page.`, 'lesson');
    saveLessonToServer(updatedLesson).catch(() => {});
    return updatedLesson;
  }

  public saveLessonDraft(lessonData: Omit<LessonContent, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): LessonContent {
    const now = new Date().toISOString();
    const canonicalId = lessonData.id || `LES_${lessonData.classId}_P${lessonData.periodNumber}`;
    const index = this.lessons.findIndex(l => l.id === canonicalId || (l.classId === lessonData.classId && l.periodNumber === lessonData.periodNumber));

    let draftLesson: LessonContent;
    if (index !== -1) {
      draftLesson = {
        ...this.lessons[index],
        ...lessonData,
        id: canonicalId,
        status: 'draft',
        updatedAt: now
      };
      this.lessons[index] = draftLesson;
    } else {
      draftLesson = {
        ...lessonData,
        id: canonicalId,
        status: 'draft',
        createdAt: now,
        updatedAt: now
      };
      this.lessons.push(draftLesson);
    }
    this.save();
    saveLessonToServer(draftLesson).catch(() => {});
    return draftLesson;
  }

  public duplicateLessonToClass(lessonId: string, targetClassId: ClassId): LessonContent {
    const source = this.lessons.find(l => l.id === lessonId);
    if (!source) throw new Error('Source lesson not found.');

    const now = new Date().toISOString();
    const targetCanonicalId = `LES_${targetClassId}_P${source.periodNumber}`;
    const duplicated: LessonContent = {
      ...source,
      id: targetCanonicalId,
      classId: targetClassId,
      status: 'draft', // Saved as draft first to allow teacher review
      publishedAt: undefined,
      createdAt: now,
      updatedAt: now
    };

    const existingIdx = this.lessons.findIndex(l => l.id === targetCanonicalId || (l.classId === targetClassId && l.periodNumber === source.periodNumber));
    if (existingIdx !== -1) {
      this.lessons[existingIdx] = duplicated;
    } else {
      this.lessons.push(duplicated);
    }

    this.save();
    saveLessonToServer(duplicated).catch(() => {});
    return duplicated;
  }

  public revertLessonToDraft(lessonId: string): LessonContent {
    const lesson = this.lessons.find(l => l.id === lessonId);
    if (!lesson) throw new Error('Lesson not found.');

    const now = new Date().toISOString();
    lesson.status = 'draft';
    lesson.updatedAt = now;

    // Recalculate class active period based on remaining published lessons
    const classPublished = this.lessons
      .filter(l => l.classId === lesson.classId && l.status === 'published' && l.id !== lessonId)
      .sort((a, b) => b.periodNumber - a.periodNumber);

    const newActivePeriod = classPublished.length > 0 ? classPublished[0].periodNumber : Math.max(1, lesson.periodNumber - 1);
    const cls = this.classes.find(c => c.id === lesson.classId);
    if (cls) {
      cls.activePeriod = newActivePeriod;
    }

    this.save();
    this.logAudit(INITIAL_TEACHER.id, 'teacher', 'LESSON_REVERTED', `Reverted Period ${lesson.periodNumber} (${lesson.topic}) for ${lesson.classId} to draft`);
    
    // Sync revert to Appwrite Cloud immediately
    saveLessonToServer(lesson).catch(() => {});
    return lesson;
  }

  public unpublishLesson(classId: ClassId, periodNumber: number): LessonContent | null {
    const lesson = this.lessons.find(l => l.classId === classId && l.periodNumber === periodNumber && l.status === 'published');
    if (!lesson) return null;
    return this.revertLessonToDraft(lesson.id);
  }

  public deleteLesson(lessonId: string): void {
    const index = this.lessons.findIndex(l => l.id === lessonId);
    if (index === -1) throw new Error('Lesson not found.');

    const lesson = this.lessons[index];
    this.lessons.splice(index, 1);

    // Recalculate class active period if needed
    const classPublished = this.lessons
      .filter(l => l.classId === lesson.classId && l.status === 'published')
      .sort((a, b) => b.periodNumber - a.periodNumber);

    if (classPublished.length > 0) {
      const cls = this.classes.find(c => c.id === lesson.classId);
      if (cls) cls.activePeriod = classPublished[0].periodNumber;
    }

    this.save();
    this.logAudit(INITIAL_TEACHER.id, 'teacher', 'LESSON_DELETED', `Deleted Period ${lesson.periodNumber} for ${lesson.classId}`);
    
    // Delete document from Appwrite Cloud
    deleteLessonFromServer(lessonId).catch(() => {});
  }

  private updateClassActivePeriod(classId: ClassId, periodNumber: number) {
    const cls = this.classes.find(c => c.id === classId);
    if (cls && periodNumber > cls.activePeriod) {
      cls.activePeriod = periodNumber;
    }
  }

  // --- CLASS PROGRESS ---

  public getClassProgress(classId: ClassId): ClassProgress {
    if (!this.progress[classId]) {
      this.progress[classId] = {
        classId,
        currentPeriod: 1,
        currentUnit: 1,
        currentTopic: 'Introduction to Computational Thinking',
        completedTopics: [],
        partiallyCompletedTopics: [],
        pendingTopics: [],
        conceptsUnderstood: [],
        conceptsRequiringReinforcement: [],
        studentDifficulties: '',
        questionsAsked: [],
        feedback: '',
        practiceGiven: '',
        homework: '',
        teacherObservations: '',
        nextRecommendedPeriod: 2,
        lastUpdated: new Date().toISOString()
      };
      this.save();
    }
    return this.progress[classId];
  }

  public updateClassProgress(classId: ClassId, updates: Partial<ClassProgress>): ClassProgress {
    const current = this.getClassProgress(classId);
    this.progress[classId] = {
      ...current,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    this.save();
    saveClassProgressToServer(this.progress[classId]).catch(() => {});
    return this.progress[classId];
  }

  // --- GROUP CHAT (Class-Isolated) ---

  public getGroupMessages(classId: ClassId, userRole: 'student' | 'teacher', userClassId?: ClassId): GroupMessage[] {
    // IDOR Check: Students can NEVER view messages from another class
    if (userRole === 'student' && userClassId !== classId) {
      throw new Error('Unauthorized: You cannot access messages belonging to another class.');
    }
    return this.groupMessages
      .filter(m => m.classId === classId && !m.isDeleted)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public sendGroupMessage(
    classId: ClassId, 
    content: string, 
    sender: { id: string; name: string; role: 'student' | 'teacher'; classId?: ClassId }
  ): GroupMessage {
    // IDOR Check
    if (sender.role === 'student' && sender.classId !== classId) {
      throw new Error('Unauthorized: You cannot post in another class group chat.');
    }

    const newMsg: GroupMessage = {
      id: `GM-${classId}-${Date.now()}`,
      classId,
      senderId: sender.id,
      senderName: sender.role === 'teacher' ? `${sender.name} (Teacher)` : sender.name,
      senderRole: sender.role,
      content: content.trim(),
      isPinned: false,
      isDeleted: false,
      createdAt: new Date().toISOString()
    };

    this.groupMessages.push(newMsg);
    this.save();
    saveGroupMessageToServer(newMsg).catch(() => {});
    return newMsg;
  }

  public pinGroupMessage(messageId: string, isPinned: boolean, userRole: 'student' | 'teacher'): void {
    if (userRole !== 'teacher') throw new Error('Forbidden: Only teacher can pin messages.');
    const msg = this.groupMessages.find(m => m.id === messageId);
    if (msg) {
      msg.isPinned = isPinned;
      this.save();
      saveGroupMessageToServer(msg).catch(() => {});
    }
  }

  public deleteGroupMessage(messageId: string, userRole: 'student' | 'teacher'): void {
    if (userRole !== 'teacher') throw new Error('Forbidden: Only teacher can delete messages.');
    const msg = this.groupMessages.find(m => m.id === messageId);
    if (msg) {
      msg.isDeleted = true;
      this.save();
      saveGroupMessageToServer(msg).catch(() => {});
    }
  }

  // --- PRIVATE CHAT (Student <-> Teacher ONLY) ---

  public getPrivateConversationsForTeacher(): PrivateConversation[] {
    return [...this.conversations].sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }

  public getStudentPrivateConversation(studentId: string, studentClassId: ClassId): { conversation: PrivateConversation; messages: PrivateMessage[] } {
    let conv = this.conversations.find(c => c.studentId === studentId);
    if (!conv) {
      const student = this.students.find(s => s.id === studentId);
      conv = {
        id: `CONV-${studentId}`,
        studentId,
        classId: studentClassId,
        studentName: student ? student.name : 'Student',
        studentRegNo: student ? student.registerNumber : '',
        lastMessageAt: new Date().toISOString(),
        teacherUnreadCount: 0,
        studentUnreadCount: 0
      };
      this.conversations.push(conv);
      this.save();
    }

    const messages = this.privateMessages
      .filter(m => m.conversationId === conv!.id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return { conversation: conv, messages };
  }

  public initiateTeacherConversation(studentId: string): { conversation: PrivateConversation; messages: PrivateMessage[] } {
    const student = this.students.find(s => s.id === studentId);
    if (!student) throw new Error('Student not found.');
    return this.getStudentPrivateConversation(student.id, student.classId);
  }

  public getConversationById(conversationId: string, userRole: 'student' | 'teacher', currentStudentId?: string): { conversation: PrivateConversation; messages: PrivateMessage[] } {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (!conv) throw new Error('Conversation not found.');

    // IDOR Protection: Student can ONLY view their own conversation!
    if (userRole === 'student' && conv.studentId !== currentStudentId) {
      throw new Error('Unauthorized: You cannot access another student\'s private conversation.');
    }

    const messages = this.privateMessages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return { conversation: conv, messages };
  }

  public sendPrivateMessage(
    conversationId: string, 
    content: string, 
    sender: { id: string; role: 'student' | 'teacher' }
  ): PrivateMessage {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (!conv) throw new Error('Conversation not found.');

    if (sender.role === 'student' && conv.studentId !== sender.id) {
      throw new Error('Unauthorized: Student ID mismatch.');
    }

    const now = new Date().toISOString();
    const newMsg: PrivateMessage = {
      id: `PM-${Date.now()}`,
      conversationId,
      senderId: sender.id,
      senderRole: sender.role,
      content: content.trim(),
      createdAt: now,
      isRead: false
    };

    this.privateMessages.push(newMsg);
    conv.lastMessageAt = now;
    conv.lastMessageSnippet = newMsg.content.slice(0, 100);
    if (sender.role === 'student') {
      conv.teacherUnreadCount += 1;
    } else {
      conv.studentUnreadCount += 1;
    }

    this.save();
    savePrivateConversationToServer(conv).catch(() => {});
    savePrivateMessageToServer(newMsg).catch(() => {});
    return newMsg;
  }

  // --- STUDENT MANAGEMENT (Teacher Only) ---

  public getStudents(classFilter?: ClassId): Student[] {
    if (classFilter) {
      return this.students.filter(s => s.classId === classFilter);
    }
    return [...this.students];
  }

  public async addStudent(studentData: { registerNumber: string; name: string; classId: ClassId; initialPin?: string }): Promise<Student> {
    const cleanRegNo = studentData.registerNumber.trim().toUpperCase();
    if (this.students.some(s => s.registerNumber.toUpperCase() === cleanRegNo)) {
      throw new Error(`Student with Register Number ${cleanRegNo} already exists.`);
    }

    const salt = generateSalt(16);
    const pin = studentData.initialPin || '1234';
    const pinHash = await hashPin(pin, salt);
    const now = new Date().toISOString();

    const newStudent: Student = {
      id: `STU-${studentData.classId}-${Date.now().toString().slice(-4)}`,
      registerNumber: cleanRegNo,
      name: studentData.name.trim(),
      classId: studentData.classId,
      pinHash,
      salt,
      mustChangePin: true, // New student must change initial PIN upon first login
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    this.students.push(newStudent);
    this.updateClassStudentCount(studentData.classId);
    this.save();
    return newStudent;
  }

  public updateStudent(studentId: string, updates: Partial<Pick<Student, 'name' | 'classId' | 'isActive'>>): Student {
    const student = this.students.find(s => s.id === studentId);
    if (!student) throw new Error('Student not found.');

    if (updates.name) student.name = updates.name.trim();
    if (updates.classId && updates.classId !== student.classId) {
      const oldClass = student.classId;
      student.classId = updates.classId;
      this.updateClassStudentCount(oldClass);
      this.updateClassStudentCount(updates.classId);
    }
    if (typeof updates.isActive === 'boolean') student.isActive = updates.isActive;
    student.updatedAt = new Date().toISOString();

    this.save();
    return student;
  }

  public async resetStudentPin(studentId: string, tempPin = '1234'): Promise<{ tempPin: string }> {
    const student = this.students.find(s => s.id === studentId);
    if (!student) throw new Error('Student not found.');

    const salt = generateSalt(16);
    student.pinHash = await hashPin(tempPin, salt);
    student.salt = salt;
    student.mustChangePin = true; // Mandatory change on next student login
    student.updatedAt = new Date().toISOString();

    this.save();
    this.logAudit(INITIAL_TEACHER.id, 'teacher', 'PIN_RESET', `Reset PIN for student ${student.registerNumber} (${student.name})`);

    // Sync to Appwrite Cloud
    await saveStudentPinToServer(student.id, student.pinHash, student.salt, true);

    return { tempPin };
  }

  public toggleStudentActive(studentId: string): Student {
    const student = this.students.find(s => s.id === studentId);
    if (!student) throw new Error('Student not found.');

    student.isActive = !student.isActive;
    student.updatedAt = new Date().toISOString();
    this.save();

    // Sync to Appwrite Cloud
    updateStudentStatusOnServer(student.id, student.isActive).catch(() => {});

    return student;
  }

  public async importStudentsCsv(csvContent: string, defaultPin = '1234'): Promise<{ imported: number; skipped: number; errors: string[] }> {
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Format: RegisterNumber, Name, ClassId (C1-112 | C2-147 | C3-091)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (i === 0 && (line.toLowerCase().includes('register') || line.toLowerCase().includes('regno'))) {
        continue; // Skip header
      }

      const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length < 3) {
        skipped++;
        errors.push(`Line ${i + 1}: Insufficient columns. Expected RegisterNumber, Name, ClassId.`);
        continue;
      }

      const [regNo, name, rawClassId] = parts;
      const classId = rawClassId as ClassId;

      if (!['C1-112', 'C2-147', 'C3-091'].includes(classId)) {
        skipped++;
        errors.push(`Line ${i + 1}: Invalid ClassId '${rawClassId}'. Must be C1-112, C2-147, or C3-091.`);
        continue;
      }

      try {
        await this.addStudent({
          registerNumber: regNo,
          name,
          classId,
          initialPin: defaultPin
        });
        imported++;
      } catch (err: any) {
        skipped++;
        errors.push(`Line ${i + 1}: ${err.message}`);
      }
    }

    return { imported, skipped, errors };
  }

  public exportStudentsCsv(classFilter?: ClassId): string {
    const list = this.getStudents(classFilter);
    const header = 'Register Number,Student Name,Class ID,Active Status,Created At\n';
    const rows = list.map(s => 
      `"${s.registerNumber}","${s.name}","${s.classId}","${s.isActive ? 'Active' : 'Inactive'}","${s.createdAt}"`
    ).join('\n');
    return header + rows;
  }

  private updateClassStudentCount(classId: ClassId) {
    const cls = this.classes.find(c => c.id === classId);
    if (cls) {
      cls.totalStudents = this.students.filter(s => s.classId === classId).length;
    }
  }

  // --- ANNOUNCEMENTS ---

  public getAnnouncements(userRole: 'student' | 'teacher', userClassId?: ClassId): Announcement[] {
    if (userRole === 'teacher') {
      return [...this.announcements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    // Student sees only announcements for their class or 'all'
    return this.announcements
      .filter(a => a.targetClass === 'all' || a.targetClass === userClassId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createAnnouncement(announcementData: { targetClass: ClassId | 'all'; title: string; content: string; priority: 'normal' | 'important' }): Announcement {
    const newAnn: Announcement = {
      id: `ANN-${Date.now()}`,
      ...announcementData,
      createdAt: new Date().toISOString(),
      authorName: INITIAL_TEACHER.name
    };
    this.announcements.unshift(newAnn);
    this.save();

    // Trigger notification
    this.createClassNotification(
      announcementData.targetClass, 
      `Announcement: ${announcementData.title}`, 
      announcementData.content.slice(0, 100), 
      'announcement'
    );

    // Sync to Appwrite Cloud
    saveAnnouncementToServer(newAnn).catch(() => {});

    return newAnn;
  }

  public updateAnnouncement(
    announcementId: string, 
    updates: Partial<Omit<Announcement, 'id' | 'createdAt' | 'authorName'>>
  ): Announcement {
    const index = this.announcements.findIndex(a => a.id === announcementId);
    if (index === -1) throw new Error('Announcement not found.');

    this.announcements[index] = {
      ...this.announcements[index],
      ...updates
    };
    this.save();
    this.logAudit(INITIAL_TEACHER.id, 'teacher', 'ANNOUNCEMENT_UPDATED', `Updated announcement "${this.announcements[index].title}"`);
    
    // Sync to Appwrite Cloud
    saveAnnouncementToServer(this.announcements[index]).catch(() => {});
    
    return this.announcements[index];
  }

  public deleteAnnouncement(announcementId: string): void {
    const index = this.announcements.findIndex(a => a.id === announcementId);
    if (index === -1) throw new Error('Announcement not found.');

    const deleted = this.announcements[index];
    this.announcements.splice(index, 1);
    this.save();
    this.logAudit(INITIAL_TEACHER.id, 'teacher', 'ANNOUNCEMENT_DELETED', `Deleted announcement "${deleted.title}" (ID: ${announcementId})`);

    // Sync to Appwrite Cloud
    deleteAnnouncementFromServer(announcementId).catch(() => {});
  }

  // --- NOTIFICATIONS ---

  public getNotifications(userRole: 'student' | 'teacher', userId?: string, userClassId?: ClassId): InAppNotification[] {
    if (userRole === 'teacher') {
      return this.notifications
        .filter(n => n.recipientType === 'teacher')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return this.notifications
      .filter(n => 
        n.recipientType === 'student' && 
        (n.targetClassId === 'all' || n.targetClassId === userClassId || n.targetStudentId === userId)
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public markNotificationAsRead(notificationId: string): void {
    const notif = this.notifications.find(n => n.id === notificationId);
    if (notif) {
      notif.isRead = true;
      this.save();
    }
  }

  public markAllNotificationsAsRead(userRole: 'student' | 'teacher', userClassId?: ClassId): void {
    this.notifications.forEach(n => {
      if (userRole === 'teacher' && n.recipientType === 'teacher') {
        n.isRead = true;
      } else if (userRole === 'student' && n.recipientType === 'student') {
        if (n.targetClassId === 'all' || n.targetClassId === userClassId) {
          n.isRead = true;
        }
      }
    });
    this.save();
  }

  private createClassNotification(targetClassId: ClassId | 'all', title: string, message: string, type: InAppNotification['type']) {
    const newNotif: InAppNotification = {
      id: `NOTIF-${Date.now()}`,
      recipientType: 'student',
      targetClassId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
      linkUrl: type === 'lesson' ? '/today' : '/announcements'
    };
    this.notifications.unshift(newNotif);
    this.save();
  }

  // --- AUDIT LOGGING ---

  private logAudit(actorId: string, actorRole: 'student' | 'teacher', action: string, details: string) {
    this.auditLogs.unshift({
      id: `AUDIT-${Date.now()}`,
      actorId,
      actorRole,
      action,
      details,
      timestamp: new Date().toISOString()
    });
    if (this.auditLogs.length > 500) this.auditLogs.pop();
    this.save();
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  // --- PRACTICE QUESTIONS (DYNAMIC PRACTICE BANK) ---

  public getPracticeQuestions(unit?: number, difficulty?: string): PracticeQuestion[] {
    let list = [...this.practice];
    if (unit) list = list.filter(p => p.unit === unit);
    if (difficulty) list = list.filter(p => p.difficulty === difficulty);
    return list;
  }

  public getPracticeQuestionById(questionId: string): PracticeQuestion | undefined {
    return this.practice.find(p => p.id === questionId);
  }

  public addPracticeQuestion(
    questionData: Omit<PracticeQuestion, 'id'> & { id?: string }
  ): PracticeQuestion {
    const id = questionData.id || `PQ-${Date.now()}`;
    const newQuestion: PracticeQuestion = {
      ...questionData,
      id,
      periodNumber: questionData.periodNumber || 1,
      hints: questionData.hints && questionData.hints.length > 0 ? questionData.hints : ['Carefully trace variable values step by step.']
    };

    this.practice.unshift(newQuestion);
    this.save();
    this.logAudit(INITIAL_TEACHER.id, 'teacher', 'PRACTICE_QUESTION_ADDED', `Added practice question "${newQuestion.title}" to Unit ${newQuestion.unit}`);
    savePracticeQuestionToServer(newQuestion).catch(() => {});
    return newQuestion;
  }

  public updatePracticeQuestion(
    questionId: string, 
    updates: Partial<Omit<PracticeQuestion, 'id'>>
  ): PracticeQuestion {
    const index = this.practice.findIndex(p => p.id === questionId);
    if (index === -1) throw new Error('Practice question not found.');

    this.practice[index] = {
      ...this.practice[index],
      ...updates
    };

    this.save();
    this.logAudit(INITIAL_TEACHER.id, 'teacher', 'PRACTICE_QUESTION_UPDATED', `Updated practice question "${this.practice[index].title}"`);
    savePracticeQuestionToServer(this.practice[index]).catch(() => {});
    return this.practice[index];
  }

  public deletePracticeQuestion(questionId: string): void {
    const index = this.practice.findIndex(p => p.id === questionId);
    if (index === -1) throw new Error('Practice question not found.');

    const deleted = this.practice[index];
    this.practice.splice(index, 1);
    this.save();
    this.logAudit(INITIAL_TEACHER.id, 'teacher', 'PRACTICE_QUESTION_DELETED', `Deleted practice question "${deleted.title}" (ID: ${questionId})`);
    deletePracticeQuestionFromServer(questionId).catch(() => {});
  }

  // --- LIVE CLASSROOM POLL (DYNAMIC 5-MINUTE AUTO-EXPIRING) ---

  public async createLivePoll(
    question: string, 
    targetClass: ClassId | 'all', 
    options: string[] = ['Yes', 'No'], 
    durationSeconds = 300
  ): Promise<LivePoll> {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) throw new Error('Poll question cannot be empty.');

    const now = new Date();
    const duration = Math.max(30, durationSeconds); // at least 30 seconds, default 300s (5 min)
    const expiresAt = new Date(now.getTime() + duration * 1000).toISOString();

    const newPoll: LivePoll = {
      id: `POLL-${Date.now()}`,
      targetClass,
      question: cleanQuestion,
      options: options.length >= 2 ? options : ['Yes', 'No'],
      createdAt: now.toISOString(),
      expiresAt,
      durationSeconds: duration,
      isActive: true,
      votes: {}
    };

    this.livePoll = newPoll;
    setLocal(STORAGE_KEYS.LIVE_POLL, newPoll);
    this.logAudit(INITIAL_TEACHER.id, 'teacher', 'POLL_LAUNCHED', `Launched 5-min live poll "${cleanQuestion}" for ${targetClass}`);
    await saveLivePollToServer(newPoll);
    return newPoll;
  }

  public getLivePoll(classId?: ClassId): LivePoll | null {
    const stored = getLocal<LivePoll | null>(STORAGE_KEYS.LIVE_POLL, this.livePoll);
    if (!stored) {
      this.livePoll = null;
      return null;
    }

    const now = Date.now();
    const exp = new Date(stored.expiresAt).getTime();
    if (now >= exp || !stored.isActive) {
      this.livePoll = null;
      setLocal(STORAGE_KEYS.LIVE_POLL, null);
      return null;
    }

    this.livePoll = stored;

    if (classId && stored.targetClass !== 'all' && stored.targetClass !== classId) {
      return null;
    }

    return stored;
  }

  public async submitPollVote(
    pollId: string, 
    studentId: string, 
    studentName: string, 
    choice: string,
    studentRegNo?: string,
    classId?: ClassId
  ): Promise<LivePoll> {
    const poll = this.getLivePoll(classId);
    if (!poll || poll.id !== pollId) {
      throw new Error('This live poll is no longer active or has expired.');
    }

    if (!poll.options.includes(choice)) {
      throw new Error(`Invalid poll option. Available options: ${poll.options.join(', ')}`);
    }

    const vote: PollVote = {
      studentId,
      studentName,
      studentRegNo,
      classId,
      choice,
      timestamp: new Date().toISOString()
    };

    // Optimistic local update
    poll.votes[studentId] = vote;
    this.livePoll = poll;
    setLocal(STORAGE_KEYS.LIVE_POLL, poll);

    try {
      const serverUpdated = await submitPollVoteToServer(pollId, vote);
      if (serverUpdated && serverUpdated.id === pollId) {
        this.livePoll = serverUpdated;
        setLocal(STORAGE_KEYS.LIVE_POLL, serverUpdated);
        return serverUpdated;
      }
    } catch (e) {
      console.warn('Failed to submit vote to server:', e);
    }
    return poll;
  }

  public async endLivePoll(pollId?: string): Promise<void> {
    const poll = getLocal<LivePoll | null>(STORAGE_KEYS.LIVE_POLL, this.livePoll);
    this.livePoll = null;
    setLocal(STORAGE_KEYS.LIVE_POLL, null);
    if (poll) {
      poll.isActive = false;
      this.logAudit(INITIAL_TEACHER.id, 'teacher', 'POLL_ENDED', `Closed live poll "${poll.question}"`);
      await deleteLivePollFromServer();
    }
  }

  public clearLivePoll(): void {
    this.livePoll = null;
    setLocal(STORAGE_KEYS.LIVE_POLL, null);
  }

  public resetToDefaults(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
      } catch {}
    }
    this.classes = INITIAL_CLASSES;
    this.students = INITIAL_STUDENTS;
    this.lessons = INITIAL_LESSONS;
    this.progress = INITIAL_PROGRESS;
    this.practice = INITIAL_PRACTICE_QUESTIONS;
    this.announcements = INITIAL_ANNOUNCEMENTS;
    this.groupMessages = INITIAL_GROUP_MESSAGES;
    this.conversations = INITIAL_PRIVATE_CONVERSATIONS;
    this.privateMessages = INITIAL_PRIVATE_MESSAGES;
    this.notifications = INITIAL_NOTIFICATIONS;
    this.auditLogs = [];
    this.livePoll = null;
    this.save();
  }
}

export const storageService = new StorageService();
