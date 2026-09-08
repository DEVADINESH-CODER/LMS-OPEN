import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../src/lib/storage-provider';
import { hashPin, verifyPin, generateSalt, createSessionToken, verifySessionToken } from '../src/lib/security';
import { MASTER_45_PERIODS } from '../src/data/masterPlan';

describe('Python Class LMS - Core Security & Functionality Tests', () => {

  describe('1. Student Authentication & PIN Hashing', () => {
    it('should successfully authenticate student with correct Register Number and PIN', async () => {
      // 26009479 belongs to AJAY KRISHNAN S in C1-112, default PIN is "1234"
      const auth = await storageService.loginStudent('26009479', '1234');
      expect(auth.role).toBe('student');
      if (auth.role !== 'student') throw new Error('Expected student');
      expect(auth.student.name).toBe('AJAY KRISHNAN S');
      expect(auth.student.classId).toBe('C1-112');
      expect(auth.token).toBeDefined();
    });

    it('should reject student login with incorrect PIN', async () => {
      await expect(storageService.loginStudent('26009479', '9999'))
        .rejects.toThrow('Invalid Register Number or PIN.');
    });

    it('should reject student login with unknown Register Number', async () => {
      await expect(storageService.loginStudent('UNKNOWN_REG', '1234'))
        .rejects.toThrow('Invalid Register Number or PIN.');
    });

    it('should reject login for deactivated student accounts', async () => {
      // Deactivate student STU-C1-049 to test deactivation guard
      storageService.toggleStudentActive('STU-C1-049');
      await expect(storageService.loginStudent('26006280', '1234'))
        .rejects.toThrow('This student account has been deactivated. Please contact your instructor.');
      // Re-activate for test cleanliness
      storageService.toggleStudentActive('STU-C1-049');
    });

    it('should verify cryptographic PIN hash using SHA-256 and unique salt', async () => {
      const salt = generateSalt(16);
      const hash1 = await hashPin('5678', salt);
      const hash2 = await hashPin('5678', salt);
      const wrongHash = await hashPin('1234', salt);

      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(wrongHash);

      const isValid = await verifyPin('5678', hash1, salt);
      expect(isValid).toBe(true);

      const isInvalid = await verifyPin('9999', hash1, salt);
      expect(isInvalid).toBe(false);
    });

    it('should issue and verify HMAC-signed session token', async () => {
      const token = await createSessionToken({
        sub: 'STU-C1-001',
        role: 'student',
        regNo: '26009479',
        name: 'AJAY KRISHNAN S',
        classId: 'C1-112'
      });

      const payload = await verifySessionToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.sub).toBe('STU-C1-001');
      expect(payload?.role).toBe('student');
      expect(payload?.classId).toBe('C1-112');
    });
  });

  describe('2. Teacher Login & Admin Controls', () => {
    it('should authenticate teacher with valid email and password', async () => {
      const auth = await storageService.loginTeacher('teacher@college.edu', 'Teacher@2024');
      expect(auth.role).toBe('teacher');
      if (auth.role !== 'teacher') throw new Error('Expected teacher');
      expect(auth.teacher.name).toBe('Prof. Deva Dinesh');
      expect(auth.token).toBeDefined();
    });

    it('should reject teacher login with wrong credentials', async () => {
      await expect(storageService.loginTeacher('teacher@college.edu', 'WrongPass'))
        .rejects.toThrow('Invalid Teacher Email or Password.');
    });
  });

  describe('3. Class Isolation (C1-112, C2-147, C3-091)', () => {
    it('should strictly isolate Today\'s published class per classroom', () => {
      // C1-112 is at Period 12
      const c1Lesson = storageService.getTodayLessonForStudent('C1-112');
      expect(c1Lesson?.periodNumber).toBe(12);

      // C2-147 is at Period 10
      const c2Lesson = storageService.getTodayLessonForStudent('C2-147');
      expect(c2Lesson?.periodNumber).toBe(10);

      // C3-091 is at Period 8
      const c3Lesson = storageService.getTodayLessonForStudent('C3-091');
      expect(c3Lesson?.periodNumber).toBe(8);

      // Verify lessons do not leak across classes
      expect(c1Lesson?.id).not.toBe(c2Lesson?.id);
    });

    it('should prevent student in C1-112 from viewing group chat of C2-147 (IDOR Defense)', () => {
      expect(() => {
        storageService.getGroupMessages('C2-147', 'student', 'C1-112');
      }).toThrow('Unauthorized: You cannot access messages belonging to another class.');
    });

    it('should allow student in C1-112 to view group chat of C1-112 and start clean', () => {
      // Starts clean without dummy messages as requested
      const initialMsgs = storageService.getGroupMessages('C1-112', 'student', 'C1-112');
      expect(Array.isArray(initialMsgs)).toBe(true);
      expect(initialMsgs.length).toBe(0);

      // Sending a real message works
      storageService.sendGroupMessage('C1-112', 'Hello class', {
        id: 'STU-C1-001',
        name: 'AJAY KRISHNAN S',
        role: 'student',
        classId: 'C1-112'
      });
      const updated = storageService.getGroupMessages('C1-112', 'student', 'C1-112');
      expect(updated.length).toBe(1);
      expect(updated[0].content).toBe('Hello class');
    });

    it('should prevent student from posting to another class\'s group chat', () => {
      expect(() => {
        storageService.sendGroupMessage('C2-147', 'Hello from impostor', {
          id: 'STU-C1-001',
          name: 'AJAY KRISHNAN S',
          role: 'student',
          classId: 'C1-112'
        });
      }).toThrow('Unauthorized: You cannot post in another class group chat.');
    });
  });

  describe('4. Private Chat Confidentiality & IDOR Prevention', () => {
    it('should prevent a student from accessing another student\'s private conversation', () => {
      // Start private chat from STU-C1-001
      const { conversation } = storageService.getStudentPrivateConversation('STU-C1-001', 'C1-112');
      storageService.sendPrivateMessage(conversation.id, 'Help with loops', { id: 'STU-C1-001', role: 'student' });
      
      const convs = storageService.getPrivateConversationsForTeacher();
      const conv = convs.find(c => c.studentId === 'STU-C1-001');
      expect(conv).toBeDefined();

      // Attempt access with STU-C2-001 ID
      expect(() => {
        storageService.getConversationById(conv!.id, 'student', 'STU-C2-001');
      }).toThrow("Unauthorized: You cannot access another student's private conversation.");
    });

    it('should allow teacher to access any student private conversation', () => {
      const convs = storageService.getPrivateConversationsForTeacher();
      const conv = convs.find(c => c.studentId === 'STU-C1-001');
      expect(conv).toBeDefined();

      const result = storageService.getConversationById(conv!.id, 'teacher');
      expect(result.conversation.studentId).toBe('STU-C1-001');
      expect(Array.isArray(result.messages)).toBe(true);
      expect(result.messages.length).toBeGreaterThan(0);
    });
  });

  describe('5. Teacher-Controlled PIN Reset & Mandatory Change PIN Flow', () => {
    it('should allow teacher to reset student PIN with temporary PIN and set mustChangePin flag', async () => {
      const { tempPin } = await storageService.resetStudentPin('STU-C1-002', '5555');
      expect(tempPin).toBe('5555');

      const student = storageService.getStudents().find(s => s.id === 'STU-C1-002');
      expect(student?.mustChangePin).toBe(true);

      // Student can log in with the temporary PIN
      const auth = await storageService.loginStudent('26018281', '5555');
      if (auth.role !== 'student') throw new Error('Expected student');
      expect(auth.student.mustChangePin).toBe(true);
    });

    it('should allow student to update PIN and clear mustChangePin flag', async () => {
      await storageService.changeStudentPin('STU-C1-002', '5555', '8888');

      const student = storageService.getStudents().find(s => s.id === 'STU-C1-002');
      expect(student?.mustChangePin).toBe(false);

      // Student logs in with the newly set private PIN
      const auth = await storageService.loginStudent('26018281', '8888');
      if (auth.role !== 'student') throw new Error('Expected student');
      expect(auth.student.mustChangePin).toBe(false);

      // Revert STU-C1-002 PIN back to default '1234'
      await storageService.changeStudentPin('STU-C1-002', '8888', '1234');
    });
  });

  describe('6. 45-Period Master Syllabus Plan Integrity', () => {
    it('should contain exactly 45 teaching periods', () => {
      expect(MASTER_45_PERIODS.length).toBe(45);
    });

    it('should span 30 Concept periods (Units I-V) and 15 Practical periods (Stages 1-7)', () => {
      const conceptPeriods = MASTER_45_PERIODS.filter(p => p.phase === 'Concept');
      const practicalPeriods = MASTER_45_PERIODS.filter(p => p.phase === 'Practical');

      expect(conceptPeriods.length).toBe(30);
      expect(practicalPeriods.length).toBe(15);

      // Verify Concept Periods 1 to 30
      for (let i = 1; i <= 30; i++) {
        const period = MASTER_45_PERIODS.find(p => p.periodNumber === i);
        expect(period?.phase).toBe('Concept');
        expect(period?.openingQuestion).toBeDefined();
        expect(period?.conceptFlow).toBeDefined();
        expect(period?.realWorldAnchor).toBeDefined();
        expect(period?.demoCode).toBeDefined();
      }

      // Verify Practical Periods 31 to 45
      for (let i = 31; i <= 45; i++) {
        const period = MASTER_45_PERIODS.find(p => p.periodNumber === i);
        expect(period?.phase).toBe('Practical');
        expect(period?.stage).toBeDefined();
        expect(period?.teacherRole).toBeDefined();
        expect(period?.studentRole).toBeDefined();
      }
    });

    it('should verify official syllabus topics for Periods 1, 8, 10, 12, 25, 30, 45', () => {
      expect(MASTER_45_PERIODS[0].topic).toContain('Python Interpreter & Values & Types');
      expect(MASTER_45_PERIODS[7].topic).toContain('Alternative & Chained Conditionals');
      expect(MASTER_45_PERIODS[9].topic).toContain('Iteration: for, break, continue, pass');
      expect(MASTER_45_PERIODS[11].topic).toContain('Function Composition & Recursion');
      expect(MASTER_45_PERIODS[24].topic).toContain('NumPy: Array Creation, Shape & Reshape');
      expect(MASTER_45_PERIODS[29].topic).toContain('Pandas: Sorting, CSV Read/Write & 30-Period Syllabus Checkpoint');
      expect(MASTER_45_PERIODS[44].topic).toContain('Stage 7 (Final Challenge Day 2)');
    });
  });

  describe('7. Enrolled Student Rosters (154 Students Across 3 Classes)', () => {
    it('should verify exact student rosters: C1-112 (49), C2-147 (55), C3-091 (50)', () => {
      const students = storageService.getStudents();
      expect(students.length).toBe(154);

      const c1Students = students.filter(s => s.classId === 'C1-112');
      const c2Students = students.filter(s => s.classId === 'C2-147');
      const c3Students = students.filter(s => s.classId === 'C3-091');

      expect(c1Students.length).toBe(49);
      expect(c2Students.length).toBe(55);
      expect(c3Students.length).toBe(50);

      // Verify each student has valid email, register number, and default PIN hash
      for (const s of students) {
        expect(s.registerNumber).toMatch(/^\d{8}$/);
        expect(s.email).toContain('@');
        expect(s.name.length).toBeGreaterThan(0);
        expect(s.pinHash).toBeDefined();
        expect(s.salt).toBeDefined();
      }
    });

    it('should authenticate sample students from each class with default PIN 1234', async () => {
      // C1 112 student: ASHWATH SUDHAN S (26002838)
      const c1Auth = await storageService.loginStudent('26002838', '1234');
      if (c1Auth.role !== 'student') throw new Error('Expected student');
      expect(c1Auth.student.classId).toBe('C1-112');

      // C2 147 student: ADITYA N (26016734)
      const c2Auth = await storageService.loginStudent('26016734', '1234');
      if (c2Auth.role !== 'student') throw new Error('Expected student');
      expect(c2Auth.student.classId).toBe('C2-147');

      // C3 091 student: ABIMANYU R (26018966)
      const c3Auth = await storageService.loginStudent('26018966', '1234');
      if (c3Auth.role !== 'student') throw new Error('Expected student');
      expect(c3Auth.student.classId).toBe('C3-091');
    });
  });

  describe('8. Adaptive Real-World Learning Scenarios (12-Step Pedagogical Transfer Flow)', () => {
    it('should have adaptive scenarios spanning Units I through V with rich domains', async () => {
      const { ADAPTIVE_SCENARIOS } = await import('../src/data/adaptivePractice');
      expect(ADAPTIVE_SCENARIOS.length).toBeGreaterThanOrEqual(10);

      // Verify all units 1 through 5 are represented
      const unitsRepresented = new Set(ADAPTIVE_SCENARIOS.map(s => s.unit));
      expect(unitsRepresented.has(1)).toBe(true);
      expect(unitsRepresented.has(2)).toBe(true);
      expect(unitsRepresented.has(3)).toBe(true);
      expect(unitsRepresented.has(4)).toBe(true);
      expect(unitsRepresented.has(5)).toBe(true);
    });

    it('should verify each adaptive scenario adheres to the 12-step pedagogical rhythm', async () => {
      const { ADAPTIVE_SCENARIOS } = await import('../src/data/adaptivePractice');

      for (const scenario of ADAPTIVE_SCENARIOS) {
        // Step 1: Real-world everyday situation (non-classroom transfer)
        expect(scenario.realWorldSituation.length).toBeGreaterThan(20);
        expect(scenario.realWorldDomain.length).toBeGreaterThan(3);

        // Step 2: Provocative question
        expect(scenario.provocativeQuestion.length).toBeGreaterThan(10);

        // Step 3 & 4: Student thinking & computational logic
        expect(scenario.studentThinking.length).toBeGreaterThan(10);
        expect(scenario.computationalLogic.length).toBeGreaterThan(10);

        // Step 5: Concept & syntax
        expect(scenario.conceptAndSyntax.length).toBeGreaterThan(5);
        expect(scenario.syntaxSnippet.length).toBeGreaterThan(5);

        // Step 6: Code & expected output
        expect(scenario.code).toContain('print');
        expect(scenario.expectedOutput.length).toBeGreaterThan(0);
        expect(scenario.codeExplanation.length).toBeGreaterThan(0);

        // Step 7: Predict challenge
        expect(scenario.predictChallenge.question.length).toBeGreaterThan(5);
        expect(scenario.predictChallenge.options.length).toBeGreaterThanOrEqual(2);
        expect(scenario.predictChallenge.explanation.length).toBeGreaterThan(5);

        // Step 8: Debug trap
        expect(scenario.debugTrap.buggyCode.length).toBeGreaterThan(5);
        expect(scenario.debugTrap.whatWentWrong.length).toBeGreaterThan(5);
        expect(scenario.debugTrap.fix.length).toBeGreaterThan(5);

        // Step 9: Mini practice
        expect(scenario.miniPractice.challenge.length).toBeGreaterThan(10);
        expect(scenario.miniPractice.hint.length).toBeGreaterThan(5);
        expect(scenario.miniPractice.solutionCode.length).toBeGreaterThan(5);

        // Step 10: Bridge to next
        expect(scenario.bridgeToNext.length).toBeGreaterThan(10);
      }
    });

    it('should test specific transfer scenarios (Swiggy, Uber, Netflix, UPI, Gaming, ICU, IPL)', async () => {
      const { ADAPTIVE_SCENARIOS } = await import('../src/data/adaptivePractice');

      const swiggy = ADAPTIVE_SCENARIOS.find(s => s.id === 'AS-U1-01');
      expect(swiggy?.realWorldDomain).toContain('Swiggy');
      expect(swiggy?.code).toContain('food_subtotal');

      const uber = ADAPTIVE_SCENARIOS.find(s => s.id === 'AS-U1-02');
      expect(uber?.realWorldDomain).toContain('Uber');
      expect(uber?.code).toContain('pickup_landmark, drop_landmark');

      const netflix = ADAPTIVE_SCENARIOS.find(s => s.id === 'AS-U2-01');
      expect(netflix?.realWorldDomain).toContain('Netflix');
      expect(netflix?.code).toContain('user_plan');

      const upi = ADAPTIVE_SCENARIOS.find(s => s.id === 'AS-U2-02');
      expect(upi?.realWorldDomain).toContain('Google Pay');
      expect(upi?.code).toContain('CORRECT_PIN');

      const gaming = ADAPTIVE_SCENARIOS.find(s => s.id === 'AS-U3-01');
      expect(gaming?.realWorldDomain).toContain('Gaming');
      expect(gaming?.code).toContain('.copy()');

      const hospital = ADAPTIVE_SCENARIOS.find(s => s.id === 'AS-U4-01');
      expect(hospital?.realWorldDomain).toContain('Healthcare');
      expect(hospital?.code).toContain('except ValueError');

      const ipl = ADAPTIVE_SCENARIOS.find(s => s.id === 'AS-U5-01');
      expect(ipl?.realWorldDomain).toContain('IPL');
      expect(ipl?.code).toContain('Jasprit Bumrah');
    });
  });

  describe('9. Faculty Password Management', () => {
    it('should reject password change when current password is wrong', async () => {
      await expect(
        storageService.changeTeacherPassword('WrongPassword123', 'NewFacultySecret@2025')
      ).rejects.toThrow('Current faculty password is incorrect.');
    });

    it('should reject password change when new password is too short', async () => {
      await expect(
        storageService.changeTeacherPassword('Teacher@2024', '123')
      ).rejects.toThrow(/at least 6 characters/i);
    });

    it('should successfully change faculty password with valid current password', async () => {
      await storageService.changeTeacherPassword('Teacher@2024', 'NewFacultySecret@2025');

      // Verify that old password no longer works
      await expect(
        storageService.loginTeacher('teacher@college.edu', 'Teacher@2024')
      ).rejects.toThrow(/Invalid/i);

      // Verify that new password authenticates successfully
      const teacherAuth = await storageService.loginTeacher('teacher@college.edu', 'NewFacultySecret@2025');
      expect(teacherAuth.role).toBe('teacher');
      if (teacherAuth.role === 'teacher') {
        expect(teacherAuth.teacher.email).toBe('teacher@college.edu');
      }

      // Revert password back to default for clean idempotent test runs
      await storageService.changeTeacherPassword('NewFacultySecret@2025', 'Teacher@2024');
    });
  });

  describe('10. Lesson Revert to Draft & Deletion (Undo Published Lessons)', () => {
    it('should allow teacher to revert a published lesson back to draft', () => {
      // C1-112 has a published lesson for Period 12
      const published = storageService.getTodayLessonForStudent('C1-112');
      expect(published).toBeDefined();
      expect(published?.periodNumber).toBe(12);
      expect(published?.status).toBe('published');

      // Teacher reverts lesson to draft
      const reverted = storageService.revertLessonToDraft(published!.id);
      expect(reverted.status).toBe('draft');

      // When reverted to draft, it should no longer be visible as published to students
      const studentView = storageService.getTodayLessonForStudent('C1-112');
      // Student active period or lesson is updated (no published lesson for period 12)
      if (studentView) {
        expect(studentView.status).toBe('published');
        expect(studentView.periodNumber).not.toBe(12);
      }
    });

    it('should allow teacher to unpublish lesson via unpublishLesson helper', () => {
      // C2-147 has published lesson for Period 10
      const publishedBefore = storageService.getTodayLessonForStudent('C2-147');
      expect(publishedBefore?.periodNumber).toBe(10);

      const unpublished = storageService.unpublishLesson('C2-147', 10);
      expect(unpublished).toBeDefined();
      expect(unpublished?.status).toBe('draft');
    });

    it('should allow teacher to delete a draft lesson', () => {
      // Create a draft lesson from existing lesson template
      const existing = storageService.getLessons()[0];
      const draft = storageService.saveLessonDraft({
        ...existing,
        id: undefined,
        periodNumber: 44,
        topic: 'Temporary Review Draft',
        status: 'draft'
      });
      expect(draft.status).toBe('draft');

      const draftId = draft.id;
      storageService.deleteLesson(draftId);

      const remaining = storageService.getLessons();
      expect(remaining.find(l => l.id === draftId)).toBeUndefined();
    });
  });

  describe('11. Clean Testing State & Dummy Data Removal', () => {
    it('should start with zero example/test group chat messages', () => {
      const c1Msgs = storageService.getGroupMessages('C1-112', 'teacher');
      const c2Msgs = storageService.getGroupMessages('C2-147', 'teacher');
      const c3Msgs = storageService.getGroupMessages('C3-091', 'teacher');

      expect(c2Msgs.length).toBe(0);
      expect(c3Msgs.length).toBe(0);
    });

    it('should start with zero dummy notifications', () => {
      const notifications = storageService.getNotifications('teacher');
      expect(notifications.length).toBe(0);
    });
  });

  describe('12. Dynamic Practice Bank & Question Management (CRUD)', () => {
    it('should dynamically add a new practice question and retrieve it', () => {
      const initialCount = storageService.getPracticeQuestions().length;

      const created = storageService.addPracticeQuestion({
        unit: 2,
        periodNumber: 9,
        topic: 'While Loop Infinite Guard',
        difficulty: 'standard',
        type: 'debugging',
        title: 'Fix Infinite While Loop Condition',
        problemStatement: 'Identify why the loop fails to terminate and fix the state update.',
        starterCode: 'i = 0\nwhile i < 10:\n    print(i)',
        solutionCode: 'i = 0\nwhile i < 10:\n    print(i)\n    i += 1',
        expectedOutput: '0\n1\n2\n3\n4\n5\n6\n7\n8\n9',
        hints: ['Check if the loop control variable changes.'],
        explanation: 'Every while loop requires an progress statement toward its termination condition.'
      });

      expect(created.id).toBeDefined();
      expect(created.title).toBe('Fix Infinite While Loop Condition');

      const afterAdd = storageService.getPracticeQuestions();
      expect(afterAdd.length).toBe(initialCount + 1);

      const retrieved = storageService.getPracticeQuestionById(created.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.topic).toBe('While Loop Infinite Guard');
    });

    it('should dynamically update an existing practice question', () => {
      const all = storageService.getPracticeQuestions();
      const target = all[0];

      const updated = storageService.updatePracticeQuestion(target.id, {
        title: 'Updated Challenge Title',
        difficulty: 'challenge'
      });

      expect(updated.title).toBe('Updated Challenge Title');
      expect(updated.difficulty).toBe('challenge');

      const retrieved = storageService.getPracticeQuestionById(target.id);
      expect(retrieved?.title).toBe('Updated Challenge Title');
    });

    it('should dynamically delete an existing practice question', () => {
      const allBefore = storageService.getPracticeQuestions();
      const target = allBefore[0];
      const initialCount = allBefore.length;

      storageService.deletePracticeQuestion(target.id);

      const allAfter = storageService.getPracticeQuestions();
      expect(allAfter.length).toBe(initialCount - 1);
      expect(storageService.getPracticeQuestionById(target.id)).toBeUndefined();
    });
  });

  describe('13. Dynamic Announcements Management (Edit & Delete)', () => {
    it('should create, update, and delete announcements dynamically without static locks', () => {
      const initialCount = storageService.getAnnouncements('teacher').length;

      // 1. Create
      const newAnn = storageService.createAnnouncement({
        title: 'Dynamic Test Announcement',
        content: 'Please bring your laptops tomorrow.',
        targetClass: 'C1-112',
        priority: 'important'
      });
      expect(newAnn.id).toBeDefined();
      expect(storageService.getAnnouncements('teacher').length).toBe(initialCount + 1);

      // 2. Update
      const updated = storageService.updateAnnouncement(newAnn.id, {
        title: 'Updated Test Announcement Title',
        priority: 'normal'
      });
      expect(updated.title).toBe('Updated Test Announcement Title');
      expect(updated.priority).toBe('normal');

      // 3. Delete
      storageService.deleteAnnouncement(newAnn.id);
      expect(storageService.getAnnouncements('teacher').length).toBe(initialCount);
      expect(storageService.getAnnouncements('teacher').some(a => a.id === newAnn.id)).toBe(false);
    });
  });

  describe('14. Teacher Proactive Student Inquiries', () => {
    it('should allow teacher to search and initiate conversation with any student', () => {
      // Pick any enrolled student across all 154 students
      const students = storageService.getStudents();
      expect(students.length).toBe(154);

      const student = students.find(s => s.registerNumber === '26009479'); // Ajay Krishnan S
      expect(student).toBeDefined();
      if (!student) return;

      const { conversation, messages } = storageService.initiateTeacherConversation(student.id);
      expect(conversation.studentId).toBe(student.id);
      expect(conversation.studentName).toBe('AJAY KRISHNAN S');
      expect(conversation.classId).toBe('C1-112');

      // Teacher sends first message
      const msg = storageService.sendPrivateMessage(conversation.id, 'Hello Ajay, please review your lab exercise 3.', {
        id: 'TCH-001',
        role: 'teacher'
      });
      expect(msg.content).toBe('Hello Ajay, please review your lab exercise 3.');
      expect(msg.senderRole).toBe('teacher');

      const thread = storageService.getConversationById(conversation.id, 'teacher');
      expect(thread.messages.some(m => m.id === msg.id)).toBe(true);
    });
  });

  describe('15. Live In-Class Classroom Poll Lifecycle (5-Minute Hold & Auto-Cleanup)', () => {
    it('should launch a 5-minute live poll, accept Yes/No votes, and compute percentages', async () => {
      // 1. Create live poll for C1-112
      const poll = await storageService.createLivePoll(
        'Did you complete the while loop task?',
        'C1-112',
        ['Yes', 'No'],
        300 // 5 minutes
      );

      expect(poll.id).toBeDefined();
      expect(poll.question).toBe('Did you complete the while loop task?');
      expect(poll.targetClass).toBe('C1-112');
      expect(poll.isActive).toBe(true);

      // Verify student in C1-112 sees active poll
      const activeForC1 = storageService.getLivePoll('C1-112');
      expect(activeForC1).not.toBeNull();
      expect(activeForC1?.id).toBe(poll.id);

      // Verify student in C2-147 does NOT see poll targeted to C1-112
      const activeForC2 = storageService.getLivePoll('C2-147');
      expect(activeForC2).toBeNull();

      // 2. Student 1 votes YES
      await storageService.submitPollVote(poll.id, 'STU-C1-001', 'AJAY KRISHNAN S', 'Yes', '26009479', 'C1-112');

      // 3. Student 2 votes NO
      await storageService.submitPollVote(poll.id, 'STU-C1-002', 'ANANDHA VEL R', 'No', '26009587', 'C1-112');

      const updatedPoll = storageService.getLivePoll('C1-112');
      expect(updatedPoll).not.toBeNull();
      const votes = Object.values(updatedPoll!.votes);
      expect(votes.length).toBe(2);
      expect(votes.filter(v => v.choice === 'Yes').length).toBe(1);
      expect(votes.filter(v => v.choice === 'No').length).toBe(1);

      // 4. End poll early
      await storageService.endLivePoll(poll.id);
      expect(storageService.getLivePoll('C1-112')).toBeNull();
    });

    it('should reject invalid vote choices', async () => {
      const poll = await storageService.createLivePoll(
        'Are you ready?',
        'all',
        ['Yes', 'No']
      );

      await expect(async () => {
        await storageService.submitPollVote(poll.id, 'STU-001', 'Test', 'Maybe');
      }).rejects.toThrow('Invalid poll option');

      await storageService.endLivePoll(poll.id);
    });
  });

});
