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

export const INITIAL_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'PQ-001',
    unit: 1,
    periodNumber: 5,
    topic: 'Type Casting & Fundamental Types',
    difficulty: 'basic',
    type: 'output_prediction',
    title: 'String Concatenation vs Integer Addition',
    problemStatement: 'What will be printed when the following Python code executes?\n\na = "20"\nb = "30"\nprint(a + b)\nprint(int(a) + int(b))',
    expectedOutput: '2030\n50',
    hints: [
      'Look at the quotes around "20" and "30". What type are they?',
      'The + operator on strings concatenates them; on ints it adds mathematically.'
    ],
    explanation: '"20" + "30" produces string "2030". After int() conversion, 20 + 30 evaluates to 50.'
  },
  {
    id: 'PQ-002',
    unit: 1,
    periodNumber: 7,
    topic: 'Operators & Digit Extraction',
    difficulty: 'standard',
    type: 'logic_building',
    title: 'Extracting Digits with Modulo & Floor Division',
    problemStatement: 'Given a 2-digit integer `num = 47`, write Python expressions using `%` and `//` to extract:\n1. The units digit (7)\n2. The tens digit (4)',
    starterCode: `num = 47

# Write expressions for units and tens digits:
units_digit = ...
tens_digit = ...

print(f"Tens: {tens_digit}, Units: {units_digit}")`,
    solutionCode: `num = 47

units_digit = num % 10
tens_digit = num // 10

print(f"Tens: {tens_digit}, Units: {units_digit}")`,
    expectedOutput: 'Tens: 4, Units: 7',
    hints: [
      'Any number % 10 yields the last digit.',
      'Integer division // 10 removes the last digit.'
    ],
    explanation: '47 % 10 gives remainder 7. 47 // 10 gives integer quotient 4.'
  },
  {
    id: 'PQ-003',
    unit: 2,
    periodNumber: 10,
    topic: 'Conditional Logic',
    difficulty: 'basic',
    type: 'debugging',
    title: 'Fix the Assignment in Conditional Bug',
    problemStatement: 'The following program is supposed to check if a user is an admin, but it crashes with a SyntaxError. Find and fix the mistake.',
    starterCode: `role = "student"

if role = "admin":
    print("Full administrative access granted")
else:
    print("Standard student dashboard")`,
    solutionCode: `role = "student"

if role == "admin":
    print("Full administrative access granted")
else:
    print("Standard student dashboard")`,
    expectedOutput: 'Standard student dashboard',
    hints: [
      'In Python, = is for assigning a value. What operator is for comparison?'
    ],
    explanation: 'Single = cannot be used inside conditional tests; == must be used.'
  },
  {
    id: 'PQ-004',
    unit: 2,
    periodNumber: 12,
    topic: 'while Loops',
    difficulty: 'challenge',
    type: 'coding',
    title: 'Compute Sum of First N Natural Numbers',
    problemStatement: 'Write a Python program using a while loop that computes the sum of numbers from 1 to N (e.g. for N = 5, 1+2+3+4+5 = 15).',
    starterCode: `N = 5
total = 0
counter = 1

# Write your while loop below:

print("Sum:", total)`,
    solutionCode: `N = 5
total = 0
counter = 1

while counter <= N:
    total += counter
    counter += 1

print("Sum:", total)`,
    expectedOutput: 'Sum: 15',
    hints: [
      'In each cycle, add counter to total.',
      'Remember to increment counter so the loop finishes!'
    ],
    explanation: 'Accumulator pattern: total accumulates counter while counter increments from 1 to 5.'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];

export const INITIAL_GROUP_MESSAGES: GroupMessage[] = [];

export const INITIAL_PRIVATE_CONVERSATIONS: PrivateConversation[] = [];

export const INITIAL_PRIVATE_MESSAGES: PrivateMessage[] = [];

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [];
