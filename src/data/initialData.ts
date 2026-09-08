import { 
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
  InAppNotification 
} from '../types';

import { ALL_ENROLLED_STUDENTS } from './studentsData';

export const INITIAL_CLASSES: ClassInfo[] = [
  {
    id: 'C1-112',
    name: 'C1 112',
    activePeriod: 1,
    totalStudents: 49,
    academicYear: '2024-2025'
  },
  {
    id: 'C2-147',
    name: 'C2 147',
    activePeriod: 1,
    totalStudents: 55,
    academicYear: '2024-2025'
  },
  {
    id: 'C3-091',
    name: 'C3 091',
    activePeriod: 1,
    totalStudents: 50,
    academicYear: '2024-2025'
  }
];

export const INITIAL_TEACHER: TeacherAdmin = {
  id: 'TEA-001',
  email: 'teacher@college.edu',
  name: 'Prof. Deva Dinesh',
  role: 'teacher',
  department: 'Department of Computer Science'
};

export const INITIAL_STUDENTS: Student[] = ALL_ENROLLED_STUDENTS;

// Only instructor-published lessons will be shown (starts empty, populated via Appwrite / instructor post)
export const INITIAL_LESSONS: LessonContent[] = [];

export const INITIAL_PROGRESS: Record<string, ClassProgress> = {
  'C1-112': {
    classId: 'C1-112',
    currentPeriod: 1,
    currentUnit: 1,
    currentTopic: 'Orientation & Introduction to Python',
    completedTopics: [],
    partiallyCompletedTopics: [],
    pendingTopics: ['Periods 1-45: Units I to V'],
    conceptsUnderstood: [],
    conceptsRequiringReinforcement: [],
    studentDifficulties: '',
    questionsAsked: [],
    feedback: '',
    practiceGiven: '',
    homework: '',
    teacherObservations: '',
    nextRecommendedPeriod: 1,
    lastUpdated: new Date().toISOString()
  },
  'C2-147': {
    classId: 'C2-147',
    currentPeriod: 1,
    currentUnit: 1,
    currentTopic: 'Orientation & Introduction to Python',
    completedTopics: [],
    partiallyCompletedTopics: [],
    pendingTopics: ['Periods 1-45: Units I to V'],
    conceptsUnderstood: [],
    conceptsRequiringReinforcement: [],
    studentDifficulties: '',
    questionsAsked: [],
    feedback: '',
    practiceGiven: '',
    homework: '',
    teacherObservations: '',
    nextRecommendedPeriod: 1,
    lastUpdated: new Date().toISOString()
  },
  'C3-091': {
    classId: 'C3-091',
    currentPeriod: 1,
    currentUnit: 1,
    currentTopic: 'Orientation & Introduction to Python',
    completedTopics: [],
    partiallyCompletedTopics: [],
    pendingTopics: ['Periods 1-45: Units I to V'],
    conceptsUnderstood: [],
    conceptsRequiringReinforcement: [],
    studentDifficulties: '',
    questionsAsked: [],
    feedback: '',
    practiceGiven: '',
    homework: '',
    teacherObservations: '',
    nextRecommendedPeriod: 1,
    lastUpdated: new Date().toISOString()
  }
};

export const INITIAL_PRACTICE_QUESTIONS: PracticeQuestion[] = [];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];

export const INITIAL_GROUP_MESSAGES: GroupMessage[] = [];

export const INITIAL_PRIVATE_CONVERSATIONS: PrivateConversation[] = [];

export const INITIAL_PRIVATE_MESSAGES: PrivateMessage[] = [];

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [];
