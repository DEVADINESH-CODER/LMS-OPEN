// TypeScript Definitions for Python Class LMS

export type ClassId = 'C1-112' | 'C2-147' | 'C3-091';

export interface ClassInfo {
  id: ClassId;
  name: string;
  activePeriod: number;
  totalStudents: number;
  academicYear: string;
}

export interface Student {
  id: string; // Internal Student ID (e.g. "STU-C1-001")
  registerNumber: string; // Official Register Number (e.g. "26009479")
  name: string;
  email?: string; // Official Student Email Id
  classId: ClassId;
  pinHash: string;
  salt: string;
  mustChangePin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherAdmin {
  id: string;
  email: string;
  name: string;
  role: 'teacher';
  department: string;
}

export type AuthUser = 
  | { role: 'student'; student: Student; token: string }
  | { role: 'teacher'; teacher: TeacherAdmin; token: string };

export interface MasterPeriod {
  periodNumber: number; // 1 to 45
  phase: 'Concept' | 'Practical';
  stage?: string; // e.g. "Stage 1 — Guided Coding", "Stage 2 — Partially Guided", etc.
  unit: number; // 1 to 5
  unitName: string;
  topic: string;
  subtopics: string[];
  learningObjective: string;
  teachingFocus: string;
  practicalActivity: string;
  practice: string;
  expectedOutcome: string;
  realWorldAnchor?: string;
  coreSyntax?: string;
  
  // Teacher-Only Pedagogical Deck
  openingQuestion?: string;
  conceptFlow?: string;
  connectsBack?: string;
  connectsForward?: string;
  leaveKnowing?: string;
  teacherRole?: string;
  studentRole?: string;
  expectedAbility?: string;
  demoCode?: string;
  predictQuestion?: {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  };
  debugExercise?: {
    buggyCode: string;
    errorType: string;
    hint: string;
    fix: string;
  };
}

export interface OfficialSyllabusUnit {
  unitNumber: number;
  title: string;
  hours: number;
  description: string;
  topics: {
    topicName: string;
    subtopics: string[];
    importance: 'Fundamental' | 'Core' | 'Applied' | 'Advanced';
  }[];
  outcomes: string[];
}

export interface LessonContent {
  id: string;
  classId: ClassId;
  periodNumber: number;
  unit: number;
  topic: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Core Pedagogical Structure
  whatYouWillLearn: string;
  whatWasTaught: string;
  realLifeSituation: {
    title: string;
    scenario: string;
    connectionToCode: string;
  };
  conceptExplanation: string;
  terminology: { term: string; definition: string }[];
  syntax: string;
  
  // Progressive Examples
  examples: {
    title: string;
    level: 'very_simple' | 'slightly_advanced' | 'practical';
    code: string;
    output: string;
    explanation: string;
  }[];
  
  // Interactive Pedagogy
  code: string; // Main today code
  expectedOutput: string;
  stepByStepExplanation: string[];
  predictTheOutput: {
    snippet: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  };
  modifyTheCodeChallenge: {
    originalGoal: string;
    newGoal: string;
    hint: string;
  };
  debugThis: {
    buggyCode: string;
    commonMistakeWhy: string;
    fixedCode: string;
    explanation: string;
  };
  practiceQuestions: {
    question: string;
    type: 'basic' | 'standard' | 'challenge';
    solutionHint?: string;
  }[];
  miniChallenge: string;
  homework: string;
  importantPoints: string[];
  keyTakeaways: string[];
  vivaQuestions: {
    question: string;
    expectedAnswer: string;
  }[];
  
  // Teacher-Facing Specifics (Strictly Teacher Eyes Only)
  teacherNotes: {
    teachingStrategy: string;
    openingQuestion?: string;
    conceptFlow?: string;
    connectsBack?: string;
    connectsForward?: string;
    teacherRole?: string;
    studentRole?: string;
    questionsToAskStudents: string[];
    expectedMisconceptions: string[];
    suggestedBoardFlow: string;
    classroomActivity: string;
    difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    prerequisites: string[];
  };
  
  resources?: {
    id: string;
    title: string;
    url: string;
    type: 'pdf' | 'link' | 'code' | 'image';
  }[];
}

export interface ClassProgress {
  classId: ClassId;
  currentPeriod: number;
  currentUnit: number;
  currentTopic: string;
  completedTopics: string[];
  partiallyCompletedTopics: string[];
  pendingTopics: string[];
  conceptsUnderstood: string[];
  conceptsRequiringReinforcement: string[];
  studentDifficulties: string;
  questionsAsked: string[];
  feedback: string;
  practiceGiven: string;
  homework: string;
  teacherObservations: string;
  nextRecommendedPeriod: number;
  lastUpdated: string;
}

export interface PracticeQuestion {
  id: string;
  unit: number;
  periodNumber: number;
  topic: string;
  difficulty: 'basic' | 'standard' | 'challenge';
  type: 'output_prediction' | 'debugging' | 'logic_building' | 'coding';
  title: string;
  problemStatement: string;
  starterCode?: string;
  solutionCode?: string;
  expectedOutput?: string;
  hints: string[];
  explanation: string;
}

export interface Announcement {
  id: string;
  targetClass: ClassId | 'all';
  title: string;
  content: string;
  priority: 'normal' | 'important';
  createdAt: string;
  authorName: string;
}

export interface GroupMessage {
  id: string;
  classId: ClassId;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher';
  content: string;
  isPinned: boolean;
  isDeleted: boolean;
  createdAt: string;
}

export interface PrivateConversation {
  id: string;
  studentId: string;
  classId: ClassId;
  studentName: string;
  studentRegNo: string;
  lastMessageAt: string;
  lastMessageSnippet?: string;
  teacherUnreadCount: number;
  studentUnreadCount: number;
}

export interface PrivateMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'student' | 'teacher';
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface InAppNotification {
  id: string;
  recipientType: 'student' | 'teacher';
  targetStudentId?: string;
  targetClassId?: ClassId | 'all';
  title: string;
  message: string;
  type: 'lesson' | 'practice' | 'homework' | 'announcement' | 'chat';
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: 'teacher' | 'student';
  action: string;
  details: string;
  timestamp: string;
}

export interface AdaptiveScenario {
  id: string;
  unit: number;
  periodRef: number;
  topic: string;
  title: string;
  realWorldDomain: string;
  emoji: string;
  difficulty: 'starter' | 'intermediate' | 'mastery';
  
  // Pedagogical 12-Step Flow
  realWorldSituation: string;
  provocativeQuestion: string;
  studentThinking: string;
  computationalLogic: string;
  conceptAndSyntax: string;
  syntaxSnippet: string;
  
  // Interactive runnable code
  code: string;
  expectedOutput: string;
  codeExplanation: string[];
  
  // Predict Challenge
  predictChallenge: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  
  // Debug Trap
  debugTrap: {
    buggyCode: string;
    errorType: string;
    whatWentWrong: string;
    fix: string;
  };
  
  // Mini Practice
  miniPractice: {
    challenge: string;
    hint: string;
    solutionCode: string;
  };
  
  bridgeToNext: string;
}

export interface PollVote {
  studentId: string;
  studentName: string;
  studentRegNo?: string;
  classId?: ClassId;
  choice: string;
  timestamp: string;
}

export interface LivePoll {
  id: string;
  targetClass: ClassId | 'all';
  question: string;
  options: string[]; // ['Yes', 'No'] or custom
  createdAt: string;
  expiresAt: string; // ISO string 5 minutes from launch
  durationSeconds: number; // 300
  isActive: boolean;
  votes: Record<string, PollVote>; // keyed by studentId
}
