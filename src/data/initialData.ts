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
    activePeriod: 12,
    totalStudents: 49,
    academicYear: '2024-2025'
  },
  {
    id: 'C2-147',
    name: 'C2 147',
    activePeriod: 10,
    totalStudents: 55,
    academicYear: '2024-2025'
  },
  {
    id: 'C3-091',
    name: 'C3 091',
    activePeriod: 8,
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

// Rich pedagogical lessons pre-seeded for C1, C2, and C3
export const INITIAL_LESSONS: LessonContent[] = [
  // --- C1-112 Lesson (Period 12: Function Composition & Recursion) ---
  {
    id: 'LES-C1-P12',
    classId: 'C1-112',
    periodNumber: 12,
    unit: 2,
    topic: 'Function Composition & Recursion',
    status: 'published',
    publishedAt: '2024-09-02T10:00:00Z',
    createdAt: '2024-09-02T08:30:00Z',
    updatedAt: '2024-09-02T10:00:00Z',
    whatYouWillLearn: 'Master how to compose functions (calling one inside another) and solve self-similar problems recursively with a strict base case.',
    whatWasTaught: 'We studied the call stack mechanics of recursion, the non-negotiable base case stopping condition, how to trace recursive call frames on paper, and implemented GCD and Exponentiation.',
    realLifeSituation: {
      title: 'Mutual Division in GCD & Russian Matryoshka Nesting Dolls',
      scenario: 'Imagine opening Russian nesting dolls. Each doll holds an identical smaller doll inside. If you open forever without finding the smallest solid doll (the base case), you would be stuck in an infinite loop. The Euclidean algorithm finds the GCD of two numbers by repeatedly asking "who divides whom" until the remainder becomes 0.',
      connectionToCode: 'In Python, a recursive function calls itself with a reduced argument: `return n * factorial(n - 1)`. The computer remembers paused calls on the call stack until the base case (`if n <= 1: return 1`) returns.'
    },
    conceptExplanation: 'Recursion requires TWO MANDATORY COMPONENTS:\n1. **Base Case**: The simplest terminating condition that returns a direct value without further recursive calls (e.g. `if b == 0: return a`).\n2. **Recursive Step**: The call to the function itself with arguments moving strictly closer to the base case (e.g. `return gcd(b, a % b)`).\n\nIf the base case is missing or unreachable, Python raises `RecursionError: maximum recursion depth exceeded`.',
    terminology: [
      { term: 'Function Composition', definition: 'The process of passing the return value of one function directly as an argument into another function (e.g. f(g(x))).' },
      { term: 'Base Case', definition: 'The stopping condition in a recursive function that halts further recursion without making another self-call.' },
      { term: 'RecursionError', definition: 'A runtime error raised by Python when the call stack exceeds the safety threshold (~1000 frames) due to missing base cases.' }
    ],
    syntax: `# Recursive Function Template
def recursive_solve(n):
    if n <= 1:           # Mandatory Base Case
        return 1
    return n * recursive_solve(n - 1) # Recursive Step closer to base`,
    examples: [
      {
        title: 'Example 1: Very Simple — Recursive Countdown',
        level: 'very_simple',
        code: `def countdown(n):
    if n <= 0:
        print("Liftoff!")
        return
    print(n)
    countdown(n - 1)

countdown(3)`,
        output: `3\n2\n1\nLiftoff!`,
        explanation: 'countdown(3) prints 3 and calls countdown(2). Each call decreases n until n == 0 hits the base case, stopping further recursion.'
      },
      {
        title: 'Example 2: Slightly Advanced — Recursive Exponentiation (Official Syllabus Program)',
        level: 'slightly_advanced',
        code: `def power(base, exp):
    if exp == 0:
        return 1
    return base * power(base, exp - 1)

print("2 to the power of 5 is:", power(2, 5))
print("3 to the power of 3 is:", power(3, 3))`,
        output: `2 to the power of 5 is: 32\n3 to the power of 3 is: 27`,
        explanation: 'power(2, 5) breaks down into 2 * power(2, 4) -> 2 * 2 * power(2, 3) until exp == 0 returns 1, multiplying back up.'
      },
      {
        title: 'Example 3: Practical — Greatest Common Divisor (GCD Euclidean Method)',
        level: 'practical',
        code: `def gcd(a, b):
    # Base case: remainder is zero
    if b == 0:
        return a
    # Recursive step: mutual division
    return gcd(b, a % b)

print("GCD of 48 and 18:", gcd(48, 18))
print("GCD of 105 and 25:", gcd(105, 25))`,
        output: `GCD of 48 and 18: 6\nGCD of 105 and 25: 5`,
        explanation: 'gcd(48, 18) calls gcd(18, 12) -> gcd(12, 6) -> gcd(6, 0). When b == 0, base case returns 6.'
      }
    ],
    code: `def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

def power(base, exp):
    if exp == 0:
        return 1
    return base * power(base, exp - 1)

num1, num2 = 48, 18
print(f"Euclidean GCD of {num1} and {num2} is: {gcd(num1, num2)}")
print(f"2^8 (Exponentiation): {power(2, 8)}")`,
    expectedOutput: `Euclidean GCD of 48 and 18 is: 6\n2^8 (Exponentiation): 256`,
    stepByStepExplanation: [
      'Line 1: def gcd(a, b): creates the recursive function header.',
      'Line 2: The base case test `if b == 0:` is evaluated. When b hits 0, division terminates.',
      'Line 3: Returns the final non-zero remainder as the GCD.',
      'Line 4: Recursive step `gcd(b, a % b)` passes the divisor as new dividend and remainder as new divisor.',
      'Line 6: def power(base, exp): implements mathematical exponentiation.',
      'Line 7: Base case `exp == 0` returns 1 (since x^0 = 1).',
      'Line 8: Recursive step multiplies base by power(base, exp - 1).',
      'Lines 10-12: Executes both functions with real parameters and prints the result.'
    ],
    predictTheOutput: {
      snippet: `def mystery(n):
    if n == 1:
        return 1
    return n + mystery(n - 1)

print(mystery(4))`,
      options: ['10', '24', '4', 'RecursionError'],
      correctAnswerIndex: 0,
      explanation: 'mystery(4) = 4 + mystery(3) = 4 + 3 + mystery(2) = 4 + 3 + 2 + mystery(1) = 4 + 3 + 2 + 1 = 10 (Sum of first 4 integers).'
    },
    modifyTheCodeChallenge: {
      originalGoal: 'Calculate 2^8 using recursion.',
      newGoal: 'Modify power(base, exp) to handle negative exponents cleanly (e.g. power(2, -2) returning 0.25).',
      hint: 'If exp < 0, return 1 / power(base, -exp).'
    },
    debugThis: {
      buggyCode: `def countdown(n):
    print(n)
    countdown(n - 1) # Missing stopping condition!

countdown(5)`,
      commonMistakeWhy: 'Beginners write the recursive call without a base case check. Because n decreases into negative numbers forever, Python hits the maximum stack depth and crashes.',
      fixedCode: `def countdown(n):
    if n <= 0:
        print("Done!")
        return
    print(n)
    countdown(n - 1)

countdown(5)`,
      explanation: 'Always verify before running: "Is there an if check that halts the recursion when the boundary is reached?"'
    },
    practiceQuestions: [
      {
        question: 'Write a recursive function fibonacci(n) that returns the n-th Fibonacci number.',
        type: 'basic',
        solutionHint: 'Base cases: if n <= 0 return 0, if n == 1 return 1. Recursive: return fibonacci(n-1) + fibonacci(n-2).'
      },
      {
        question: 'Implement sum of digits of an integer recursively (e.g. sum_digits(123) -> 6).',
        type: 'standard',
        solutionHint: 'Base case: n == 0 return 0. Recursive: return (n % 10) + sum_digits(n // 10).'
      },
      {
        question: 'Write a recursive function to reverse a string (e.g. rev("deva") -> "aved").',
        type: 'challenge',
        solutionHint: 'Base case: len(s) <= 1 return s. Recursive: return s[-1] + rev(s[:-1]).'
      }
    ],
    miniChallenge: 'Create a recursive function count_ways(stairs) that computes the number of ways to climb N stairs taking 1 or 2 steps at a time.',
    homework: 'Implement the official syllabus illustrative programs: recursive GCD and recursive Exponentiation, and trace the call stack for gcd(54, 24) on paper.',
    importantPoints: [
      'Every recursive function MUST have at least one base case that returns without recursion.',
      'Each recursive call must move strictly closer to the base case.',
      'Recursion uses system memory on the call stack; Python limit is approximately 1000 calls.'
    ],
    keyTakeaways: [
      'Recursion divides a complex problem into smaller sub-problems of the identical structure.',
      'Euclidean GCD and Exponentiation are foundational algorithmic examples in Unit II.'
    ],
    vivaQuestions: [
      {
        question: 'What is the base case in a recursive function and what happens if it is omitted?',
        expectedAnswer: 'The base case is the terminating condition that stops further recursive calls. If omitted, infinite recursion occurs until Python raises RecursionError.'
      },
      {
        question: 'How does Euclidean GCD work in terms of recursion?',
        expectedAnswer: 'Euclidean GCD uses the identity gcd(a, b) = gcd(b, a % b). The base case is reached when remainder b becomes 0, returning a.'
      }
    ],
    teacherNotes: {
      teachingStrategy: 'Start with the Russian matryoshka dolls physical analogy or paper folding. Trace gcd(48, 18) step-by-step on the blackboard with stack boxes.',
      openingQuestion: 'How do you solve a Russian nesting doll problem — what is the stopping condition when opening dolls?',
      conceptFlow: 'Break big problem into "same smaller problem" + a stopping point (base case).',
      connectsBack: 'Builds on call stack knowledge from Period 5 and fruitful functions from Period 11.',
      connectsForward: "We've been using numbers — what about text data like names/passwords? → strings & lists as arrays (Period 13).",
      teacherRole: 'Demonstrates stack tracing, checks for base case completeness.',
      studentRole: 'Draws call stack frames on paper, predicts return values.',
      questionsToAskStudents: [
        'What will happen if we write return gcd(a, b) instead of gcd(b, a % b)?',
        'Can recursion always be rewritten as a while loop? (Yes, any recursion can be expressed iteratively).',
        'What is the maximum recursion depth in Python?'
      ],
      expectedMisconceptions: [
        'Thinking recursion runs in parallel (it runs sequentially, stacking frames).',
        'Forgetting that the function must return the recursive call result back up the stack.'
      ],
      suggestedBoardFlow: `[BOARD FLOW]
Left: Euclidean GCD algorithm concept: gcd(48, 18) -> gcd(18, 12) -> gcd(12, 6) -> gcd(6, 0) -> 6
Center: Recursive code structure (Base Case vs Recursive Step)
Right: Call stack diagram showing activation records pushed and popped`,
      classroomActivity: '5-Minute Stack Trace: Give students power(2, 4) and have them draw stack boxes being pushed and popped.',
      difficultyLevel: 'Intermediate',
      prerequisites: ['Function definition and return values (Period 4, 11)', 'Modulus operator % and integer division //']
    }
  },

  // --- C2-147 Lesson (Period 10: Iteration with for, break, continue, pass) ---
  {
    id: 'LES-C2-P10',
    classId: 'C2-147',
    periodNumber: 10,
    unit: 2,
    topic: 'Iteration: for, break, continue, pass',
    status: 'published',
    publishedAt: '2024-09-02T11:30:00Z',
    createdAt: '2024-09-02T08:30:00Z',
    updatedAt: '2024-09-02T11:30:00Z',
    whatYouWillLearn: 'Master definite repetition with for loops and sequence generators, and control flow using break, continue, and pass.',
    whatWasTaught: 'We compared definite iteration (for) against condition loops (while), mastered range(start, stop, step), used break for early exits, continue for skipping items, and pass as a syntactical placeholder.',
    realLifeSituation: {
      title: 'Scanning College Attendance Register & Skipping Out-of-Stock Menu Items',
      scenario: 'Imagine a teacher calling roll numbers 1 to 50. If student #25 was already granted leave, the teacher skips calling them (continue). If an urgent notification arrives requesting student #12, the teacher finds them and stops the roll call early to attend to the principal (break).',
      connectionToCode: 'In Python, `for` navigates an ordered sequence. `break` instantly terminates the loop, while `continue` aborts only the current cycle and jumps directly to the next item.'
    },
    conceptExplanation: 'The `for` loop iterates over items of any sequence:\n- `range(stop)` generates `0` to `stop - 1`.\n- `range(start, stop, step)` generates integers with custom step sizes.\n- `break` exits the nearest enclosing loop immediately.\n- `continue` skips the rest of the current iteration and begins the next.\n- `pass` is a null statement used as a placeholder where syntax requires a block.',
    terminology: [
      { term: 'Definite Iteration', definition: 'A loop structure where the number of iterations is known before execution begins (e.g. for loop).' },
      { term: 'break Statement', definition: 'Terminates the loop prematurely and transfers execution to the first statement following the loop.' },
      { term: 'continue Statement', definition: 'Skips the remaining statements in the current iteration and resumes at the next loop cycle.' },
      { term: 'pass Statement', definition: 'A no-op placeholder used when code is required syntactically but no action is needed.' }
    ],
    syntax: `# for loop with range and control statements
for item in sequence:
    if condition_to_stop:
        break
    if condition_to_skip:
        continue
    # Process valid item`,
    examples: [
      {
        title: 'Example 1: Basic range() traversal',
        level: 'very_simple',
        code: `print("Counting by 2s:")
for i in range(2, 11, 2):
    print(i, end=" ")
print("\nDone!")`,
        output: `Counting by 2s:\n2 4 6 8 10 \nDone!`,
        explanation: 'range(2, 11, 2) starts at 2, stops before 11, incrementing by 2.'
      },
      {
        title: 'Example 2: Skipping Absent Students with continue',
        level: 'slightly_advanced',
        code: `absent_rolls = [103, 105]
for roll in range(101, 107):
    if roll in absent_rolls:
        print(f"Roll {roll}: ABSENT (Skipping)")
        continue
    print(f"Roll {roll}: Present -> Mark recorded")`,
        output: `Roll 101: Present -> Mark recorded\nRoll 102: Present -> Mark recorded\nRoll 103: ABSENT (Skipping)\nRoll 104: Present -> Mark recorded\nRoll 105: ABSENT (Skipping)\nRoll 106: Present -> Mark recorded`,
        explanation: 'When roll is 103 or 105, continue skips the "Present" print and proceeds to the next roll.'
      },
      {
        title: 'Example 3: Early Search Exit with break',
        level: 'practical',
        code: `registered_students = ["Aadhil", "Balaji", "Harish", "Divya", "Ezhil"]
target = "Harish"

for index, student in enumerate(registered_students):
    print(f"Checking desk {index}: {student}")
    if student == target:
        print(f"FOUND {target} at desk #{index}! Stopping scan.")
        break`,
        output: `Checking desk 0: Aadhil\nChecking desk 1: Balaji\nChecking desk 2: Harish\nFOUND Harish at desk #2! Stopping scan.`,
        explanation: 'After finding Harish, break prevents unnecessary scanning of Divya and Ezhil.'
      }
    ],
    code: `attendance_list = [101, 102, 103, 104, 105, 106]
absent = [103]
target_to_find = 105

print("--- Daily Attendance Check ---")
for roll in attendance_list:
    if roll in absent:
        print(f"Roll {roll}: Marked ABSENT (continue)")
        continue
    print(f"Roll {roll}: Marked PRESENT")
    if roll == target_to_find:
        print(f"Target student {target_to_find} confirmed present. Early break!")
        break`,
    expectedOutput: `--- Daily Attendance Check ---\nRoll 101: Marked PRESENT\nRoll 102: Marked PRESENT\nRoll 103: Marked ABSENT (continue)\nRoll 104: Marked PRESENT\nRoll 105: Marked PRESENT\nTarget student 105 confirmed present. Early break!`,
    stepByStepExplanation: [
      'Line 1: Defines class roll numbers as a list of integers.',
      'Line 2: Absent list contains roll 103.',
      'Line 5: `for roll in attendance_list:` iterates sequentially through each roll number.',
      'Line 6: Checks if current roll is in absent list.',
      'Line 8: `continue` immediately skips the rest of the loop body for roll 103.',
      'Line 9: Prints PRESENT for attending students.',
      'Line 10: Checks if current roll is target_to_find (105).',
      'Line 12: `break` exits the loop immediately, skipping roll 106.'
    ],
    predictTheOutput: {
      snippet: `for i in range(1, 6):
    if i == 3:
        continue
    if i == 5:
        break
    print(i, end=" ")`,
      options: ['1 2 4', '1 2 3 4', '1 2', '1 2 4 5'],
      correctAnswerIndex: 0,
      explanation: 'i=1: prints 1. i=2: prints 2. i=3: continue skips printing. i=4: prints 4. i=5: break terminates loop. Output is "1 2 4".'
    },
    modifyTheCodeChallenge: {
      originalGoal: 'Print roll numbers up to 105.',
      newGoal: 'Modify the loop to process in reverse order from 106 down to 101 using negative step in range().',
      hint: 'Use range(106, 100, -1).'
    },
    debugThis: {
      buggyCode: `# Print even numbers between 1 and 10\nfor i in range(1, 11):\n    if i % 2 != 0:\n        break # Student used break instead of continue!\n    print(i)`,
      commonMistakeWhy: 'Beginners frequently confuse break and continue. Using break on odd numbers causes the loop to exit on the very first number (1) without printing anything!',
      fixedCode: `for i in range(1, 11):\n    if i % 2 != 0:\n        continue # Skips odd numbers without stopping loop\n    print(i)`,
      explanation: 'Use continue to skip an individual turn; use break to abandon the entire loop.'
    },
    practiceQuestions: [
      {
        question: 'Print all numbers from 1 to 50 that are divisible by both 3 and 5 using a for loop.',
        type: 'basic',
        solutionHint: 'Use if i % 15 == 0: print(i).'
      },
      {
        question: 'Write a program to find the first prime number greater than 100 using a for loop and break.',
        type: 'standard',
        solutionHint: 'Loop from 101 upwards. Check divisibility; if prime, print and break.'
      },
      {
        question: 'Create a multiplication table generator from 1 to 10, skipping row 5 using continue.',
        type: 'challenge',
        solutionHint: 'Nested for loops; outer loop checks if row == 5: continue.'
      }
    ],
    miniChallenge: 'Simulate a login system that allows at most 3 incorrect attempts using a for loop with an else clause.',
    homework: 'Write a program that takes a sentence and counts words, stopping immediately if the word "STOP" is encountered.',
    importantPoints: [
      'range(stop) is exclusive of the upper limit (range(5) goes 0 to 4).',
      'break terminates the innermost enclosing loop.',
      'continue jumps straight to the next iteration update step.'
    ],
    keyTakeaways: [
      'for loops are designed for definite iteration over sequences.',
      'break, continue, and pass provide fine-grained execution steering.'
    ],
    vivaQuestions: [
      {
        question: 'What is the difference between break and continue in Python?',
        expectedAnswer: 'break terminates the entire loop immediately, while continue skips only the remainder of the current iteration and proceeds to the next.'
      },
      {
        question: 'What is the purpose of the pass statement?',
        expectedAnswer: 'pass is a null operation. It serves as a placeholder where Python syntax demands a code block but no action is required.'
      }
    ],
    teacherNotes: {
      teachingStrategy: 'Demonstrate attendance scanning with students. Call 3 student names, skip an absent student (continue), and pause upon finding target (break).',
      openingQuestion: 'When scanning an attendance list for student #42, do you keep reading all 100 names after you find them?',
      conceptFlow: 'Known-length repetition → for + range(); early exit → break; skip → continue; placeholder → pass.',
      connectsBack: 'Contrasts with indefinite condition-controlled while loops from Period 9.',
      connectsForward: 'Repeated decision logic should become reusable → fruitful functions (Period 11).',
      teacherRole: 'Demonstrates break vs continue traps; monitors trace accuracy.',
      studentRole: 'Predicts loop termination points; writes sequence algorithms.',
      questionsToAskStudents: [
        'What will range(0, 10, 2) generate?',
        'Does continue terminate the loop? (No, only current iteration).',
        'Can pass cause a syntax error? (No, it prevents EmptyBlock syntax errors).'
      ],
      expectedMisconceptions: [
        'Expecting range(1, 5) to include 5 (it stops at 4).',
        'Using continue where break was intended or vice-versa.'
      ],
      suggestedBoardFlow: `[BOARD FLOW]
Left: range(start, stop, step) visualized on a number line
Center: Comparison table: while vs for loops
Right: Flowchart of loop body showing break (exit) vs continue (loop back)`,
      classroomActivity: 'Predict-the-Print: Give students 3 loops with interleaved break/continue and collect answers on mini-whiteboards.',
      difficultyLevel: 'Beginner',
      prerequisites: ['while loop mechanics (Period 9)', 'Conditional branching with if (Periods 7-8)']
    }
  },

  // --- C3-091 Lesson (Period 8: Alternative & Chained Conditionals: if-else, if-elif-else) ---
  {
    id: 'LES-C3-P8',
    classId: 'C3-091',
    periodNumber: 8,
    unit: 2,
    topic: 'Alternative & Chained Conditionals: if-else, if-elif-else',
    status: 'published',
    publishedAt: '2024-09-02T14:30:00Z',
    createdAt: '2024-09-02T08:30:00Z',
    updatedAt: '2024-09-02T14:30:00Z',
    whatYouWillLearn: 'Master multi-way decision trees using if-else and if-elif-else chains, avoiding boundary and ordering pitfalls.',
    whatWasTaught: 'We progressed from single conditions to mutually exclusive two-way branches (if-else) and multi-way cascades (if-elif-else), examined boundary value traps (>= vs >), and classified student grades.',
    realLifeSituation: {
      title: 'College Grade Slabs (A/B/C/Fail) & Movie Ticket Pricing by Age',
      scenario: 'A movie theater charges ticket prices based on customer age: Children under 12 pay ₹50, Students 12-21 pay ₹100, Adults pay ₹150, and Seniors 60+ pay ₹80. Each person falls into exactly ONE category.',
      connectionToCode: 'When decisions are mutually exclusive, chaining conditions with if-elif-else ensures that as soon as the first matching condition evaluates to True, all subsequent branches are skipped.'
    },
    conceptExplanation: 'Rules of Chained Conditionals:\n1. Execution is top-down: Python tests each condition in sequential order.\n2. The first True condition runs its block; all subsequent elif/else blocks are skipped.\n3. The final else is a catch-all that runs if none of the above conditions were True.\n4. Boundary conditions (e.g. exactly 60 or 90) must use >= or <= correctly.',
    terminology: [
      { term: 'Two-Way Branching', definition: 'A decision structure with exactly two mutually exclusive paths: if (True) and else (False).' },
      { term: 'Chained Conditional', definition: 'A series of conditional branches checked in sequence using elif (short for else if).' },
      { term: 'Catch-All Else', definition: 'The default final fallback block that executes when none of the preceding conditions were satisfied.' }
    ],
    syntax: `# Chained Conditional Syntax
if condition_1:
    # Runs if condition_1 is True
elif condition_2:
    # Runs if condition_1 is False AND condition_2 is True
else:
    # Catch-all: Runs if all above are False`,
    examples: [
      {
        title: 'Example 1: Two-Way Pass/Fail Decision',
        level: 'very_simple',
        code: `marks = 68
if marks >= 50:
    print("Result: PASS")
else:
    print("Result: RE-APPEAR")`,
        output: `Result: PASS`,
        explanation: 'Since 68 >= 50 is True, the first branch executes; else is skipped.'
      },
      {
        title: 'Example 2: Movie Ticket Pricing by Age',
        level: 'slightly_advanced',
        code: `age = 19
if age < 12:
    price = 50
elif age < 22:
    price = 100 # Student rate
elif age < 60:
    price = 150 # Adult rate
else:
    price = 80  # Senior discount

print(f"Age {age}: Ticket Price = ₹{price}")`,
        output: `Age 19: Ticket Price = ₹100`,
        explanation: '19 < 12 is False. Next, 19 < 22 is True, so price = 100 is assigned and remaining branches are skipped.'
      },
      {
        title: 'Example 3: Academic Grade Slabs with Boundaries',
        level: 'practical',
        code: `score = 85

if score >= 90:
    grade = "A+ (Outstanding)"
elif score >= 80:
    grade = "A (Very Good)"
elif score >= 70:
    grade = "B (Good)"
elif score >= 50:
    grade = "C (Pass)"
else:
    grade = "F (Re-appear)"

print(f"Score: {score} -> Official Grade: {grade}")`,
        output: `Score: 85 -> Official Grade: A (Very Good)`,
        explanation: 'Checking from highest to lowest score ensures 85 lands correctly in grade A.'
      }
    ],
    code: `marks = 90

print("--- Academic Result Evaluation ---")
if marks >= 90:
    grade = "O (Outstanding)"
elif marks >= 80:
    grade = "A+ (Excellent)"
elif marks >= 70:
    grade = "A (Very Good)"
elif marks >= 50:
    grade = "B (Pass)"
else:
    grade = "RA (Re-Appear)"

print(f"Marks: {marks}/100 -> Grade Awarded: {grade}")`,
    expectedOutput: `--- Academic Result Evaluation ---\nMarks: 90/100 -> Grade Awarded: O (Outstanding)`,
    stepByStepExplanation: [
      'Line 1: marks = 90 initializes the student test score.',
      'Line 4: Evaluates marks >= 90. Since 90 >= 90 is True, grade is assigned "O (Outstanding)".',
      'Lines 6-13: Because the first condition was True, all subsequent elif and else branches are skipped instantly.',
      'Line 15: Prints the final grade awarded.'
    ],
    predictTheOutput: {
      snippet: `score = 95
if score >= 50:
    print("Pass")
elif score >= 90:
    print("Topper")
else:
    print("Fail")`,
      options: ['Pass', 'Topper', 'Pass and Topper', 'Fail'],
      correctAnswerIndex: 0,
      explanation: 'Conditions execute top-down. Since 95 >= 50 is True, "Pass" prints and Python exits the entire if-elif chain without ever checking >= 90!'
    },
    modifyTheCodeChallenge: {
      originalGoal: 'Classify grades for marks 0 to 100.',
      newGoal: 'Add validation to reject invalid scores: if score < 0 or score > 100, print "Invalid Marks Entered".',
      hint: 'Place if score < 0 or score > 100: at the very top of the conditional chain.'
    },
    debugThis: {
      buggyCode: `marks = 85\nif marks > 90:\n    grade = "A"\nelif marks > 80:\n    grade = "B"\nelif marks > 50:\n    grade = "C"\n# Student with exactly 80 marks gets grade C! Why?`,
      commonMistakeWhy: 'Using strict greater than (>) instead of greater than or equal to (>=) drops boundary values like 80 into the lower tier.',
      fixedCode: `marks = 85\nif marks >= 90:\n    grade = "A"\nelif marks >= 80:\n    grade = "B"\nelif marks >= 50:\n    grade = "C"\nelse:\n    grade = "F"`,
      explanation: 'Use >= to ensure boundary scores (e.g. 90, 80, 50) belong to the correct upper tier.'
    },
    practiceQuestions: [
      {
        question: 'Write a program to determine if a given year is a leap year using if-elif-else.',
        type: 'basic',
        solutionHint: 'A year is leap if divisible by 400, or divisible by 4 and not 100.'
      },
      {
        question: 'Write an electricity bill calculator with slabs: 1-100 units @ ₹1.5, 101-200 @ ₹3.0, above 200 @ ₹5.0.',
        type: 'standard',
        solutionHint: 'Calculate tier-by-tier using if-elif-else.'
      },
      {
        question: 'Determine the quadrant (1, 2, 3, 4, or Axis) of a 2D coordinate point (x, y).',
        type: 'challenge',
        solutionHint: 'Check signs of x and y with chained conditionals.'
      }
    ],
    miniChallenge: 'Create a rock-paper-scissors game outcome evaluator that accepts user choice and computer choice and reports Win, Lose, or Tie.',
    homework: 'Build a comprehensive college admission eligibility checker with criteria for 10th %, 12th %, and entrance rank.',
    importantPoints: [
      'Order of conditions is critical: always test the most restrictive condition first.',
      'Only one branch of an if-elif-else chain will ever execute.',
      'Watch out for boundary comparisons: use >= rather than > where inclusive slabs apply.'
    ],
    keyTakeaways: [
      'if-elif-else is the standard pattern for mutually exclusive multi-category logic.',
      'Always test edge cases and boundary values during testing.'
    ],
    vivaQuestions: [
      {
        question: 'Can multiple branches in an if-elif-else chain execute in a single run?',
        expectedAnswer: 'No. Python exits the entire chain as soon as the first True condition executes its block.'
      },
      {
        question: 'What happens if none of the if or elif conditions are True and there is no else clause?',
        expectedAnswer: 'Nothing executes inside the block; program execution continues with the next statement outside the conditional block.'
      }
    ],
    teacherNotes: {
      teachingStrategy: 'Write marks slabs on the blackboard. Intentionally write the conditions in reverse order (checking >= 50 first) and ask a student with 95 marks what grade they received.',
      openingQuestion: 'If a student scores exactly 90, does an A-grade condition (> 90 vs >= 90) include or exclude them?',
      conceptFlow: 'Single decision → two-way decision → many-way chained decision.',
      connectsBack: 'Expands single if statement from Period 7.',
      connectsForward: 'Grading one student is easy — what about checking all students repeatedly? → iteration (Period 9).',
      teacherRole: 'Guides boundary analysis, highlights elif ordering traps.',
      studentRole: 'Evaluates edge values, builds chained grading trees.',
      questionsToAskStudents: [
        'Why does elif score >= 90 after score >= 50 never execute?',
        'What is the difference between writing 3 separate if statements vs 1 if-elif-else chain?',
        'Is the else clause strictly mandatory in Python?'
      ],
      expectedMisconceptions: [
        'Confusing chained elif with multiple independent if statements (multiple ifs can all execute; elif executes at most one).',
        'Off-by-one boundary bugs with > vs >=.'
      ],
      suggestedBoardFlow: `[BOARD FLOW]
Left: Grade slab table (90+ -> O, 80-89 -> A+, 70-79 -> A, 50-69 -> B, <50 -> RA)
Center: Inverted elif bug trap (WHY >= 50 on top breaks everything)
Right: Correct cascading if-elif-else code structure with >=`,
      classroomActivity: 'Boundary Blitz: Shout out scores (90, 89.9, 50, 49) and have students flash their grade cards.',
      difficultyLevel: 'Beginner',
      prerequisites: ['Boolean operators and if statement (Period 7)', 'Indentation rules']
    }
  }
];

export const INITIAL_PROGRESS: Record<string, ClassProgress> = {
  'C1-112': {
    classId: 'C1-112',
    currentPeriod: 12,
    currentUnit: 2,
    currentTopic: 'Function Composition & Recursion',
    completedTopics: [
      'Period 1: Python Interpreter, Values & Types (int, float, bool, str, list)',
      'Period 2: Variables, Expressions, Statements, Comments',
      'Period 3: Tuple Assignment & Operator Precedence',
      'Period 4: Modules & Functions: Definition and Use',
      'Period 5: Flow of Execution, Parameters & Arguments',
      'Period 6: Unit I Illustrative Programs (Swap, Circulate, Distance)',
      'Period 7: Boolean Values, Operators & if',
      'Period 8: if-else, if-elif-else Architecture',
      'Period 9: while and Loop State',
      'Period 10: for, break, continue, pass',
      'Period 11: Fruitful Functions: Return, Parameters, Scope'
    ],
    partiallyCompletedTopics: ['Function Composition & Recursion (GCD, Exponentiation)'],
    pendingTopics: [
      'Period 13: Strings & Lists as Arrays',
      'Period 14-19: Unit III (Lists, Tuples, Dictionaries, Search & Sort)',
      'Period 20-24: Unit IV (Files, Modules, Packages, Classes)',
      'Period 25-30: Unit V (NumPy, Data Frame, CSV Processing)',
      'Period 31-45: Practical Skill Progression (Stages 1-7)'
    ],
    conceptsUnderstood: [
      'Call stack mechanics and variable scope isolation',
      'Base cases in recursive termination',
      'Euclidean algorithm for greatest common divisor'
    ],
    conceptsRequiringReinforcement: [
      'Tracing multi-level recursive stack frames on paper',
      'Preventing RecursionError when base case edge conditions occur'
    ],
    studentDifficulties: 'A few students struggled with trusting the recursive return value and attempted manual loops inside recursive bodies.',
    questionsAsked: [
      'Can we solve all recursive problems with while loops?',
      'How does Python store paused function calls in memory?'
    ],
    feedback: 'Class was engaged during the Russian nesting doll visual and paper stack trace exercise.',
    practiceGiven: 'Implement recursive power and GCD on paper with stack trace.',
    homework: 'Write a recursive function to compute the sum of digits of a number.',
    teacherObservations: 'Overall pace is solid. C1 is ready for Strings and Lists as Arrays in Period 13.',
    nextRecommendedPeriod: 13,
    lastUpdated: '2024-09-02T10:30:00Z'
  },
  'C2-147': {
    classId: 'C2-147',
    currentPeriod: 10,
    currentUnit: 2,
    currentTopic: 'Iteration: for, break, continue, pass',
    completedTopics: [
      'Period 1: Python Interpreter, Values & Types',
      'Period 2: Variables, Expressions, Statements, Comments',
      'Period 3: Tuple Assignment & Operator Precedence',
      'Period 4: Modules & Functions: Definition and Use',
      'Period 5: Flow of Execution, Parameters & Arguments',
      'Period 6: Unit I Illustrative Programs',
      'Period 7: Boolean Values, Operators & if',
      'Period 8: if-else, if-elif-else Architecture',
      'Period 9: while and Loop State'
    ],
    partiallyCompletedTopics: ['Iteration: for, break, continue, pass'],
    pendingTopics: [
      'Period 11: Fruitful Functions & Scope',
      'Period 12: Function Composition & Recursion',
      'Period 13: Strings & Lists as Arrays',
      'Units III, IV, V (Periods 14-30)',
      'Practical Stages 1-7 (Periods 31-45)'
    ],
    conceptsUnderstood: [
      'range(start, stop, step) generation',
      'Difference between break (exit) and continue (skip)',
      'pass as a non-breaking syntactic placeholder'
    ],
    conceptsRequiringReinforcement: [
      'Remembering that range(stop) excludes the stop value',
      'Avoiding break where continue was intended'
    ],
    studentDifficulties: 'Some students used break inside odd-number filters, accidentally quitting the loop on the first number.',
    questionsAsked: [
      'Why does range(5) stop at 4?',
      'Can a for loop have an else block in Python?'
    ],
    feedback: 'Roll call attendance simulation was very effective for explaining continue.',
    practiceGiven: '10 range() and loop control problems in lab workbook.',
    homework: 'Write a program to scan and find the first prime number > 100 using break.',
    teacherObservations: 'Batch is active. Next period will cover Fruitful Functions and Scope.',
    nextRecommendedPeriod: 11,
    lastUpdated: '2024-09-02T12:00:00Z'
  },
  'C3-091': {
    classId: 'C3-091',
    currentPeriod: 8,
    currentUnit: 2,
    currentTopic: 'Alternative & Chained Conditionals: if-else, if-elif-else',
    completedTopics: [
      'Period 1: Python Interpreter, Values & Types',
      'Period 2: Variables, Expressions, Statements, Comments',
      'Period 3: Tuple Assignment & Operator Precedence',
      'Period 4: Modules & Functions: Definition and Use',
      'Period 5: Flow of Execution, Parameters & Arguments',
      'Period 6: Unit I Illustrative Programs',
      'Period 7: Boolean Values, Operators & if'
    ],
    partiallyCompletedTopics: ['if-else, if-elif-else Architecture & Slabs'],
    pendingTopics: [
      'Period 9: while and Loop State',
      'Period 10: for, break, continue, pass',
      'Period 11: Fruitful Functions & Scope',
      'Period 12: Recursion',
      'Units III, IV, V (Periods 13-30)',
      'Practical Stages 1-7 (Periods 31-45)'
    ],
    conceptsUnderstood: [
      'Mutually exclusive branching with if-elif-else',
      'Importance of checking highest boundary condition first',
      'Catch-all fallback with final else'
    ],
    conceptsRequiringReinforcement: [
      'Boundary inclusion using >= instead of strict >',
      'Avoiding unnecessary nested if blocks when elif can chain'
    ],
    studentDifficulties: 'Handling the exact boundary score 80 vs 81 with relational operators.',
    questionsAsked: [
      'Does Python test the other elif conditions after finding a True one?',
      'Can we have an elif without an else?'
    ],
    feedback: 'Movie ticket age and canteen bill examples helped students grasp multi-way branching quickly.',
    practiceGiven: 'Grade slab calculation worksheet.',
    homework: 'Write student grade evaluator program (O, A+, A, B, RA).',
    teacherObservations: 'Batch needs practice on boundary operators before moving to while loops in Period 9.',
    nextRecommendedPeriod: 9,
    lastUpdated: '2024-09-02T15:00:00Z'
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

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANN-001',
    targetClass: 'all',
    title: 'Python Programming Course (19AI301/CS3301) Portal Live',
    content: 'Welcome students of C1 112, C2 147, and C3 091. Access your daily lecture notes, runnable code examples, and practice challenges here.',
    priority: 'important',
    createdAt: new Date().toISOString(),
    authorName: 'Prof. Deva Dinesh'
  }
];

// Clean chats: all test/dummy messages completely removed as requested
export const INITIAL_GROUP_MESSAGES: GroupMessage[] = [];

export const INITIAL_PRIVATE_CONVERSATIONS: PrivateConversation[] = [];

export const INITIAL_PRIVATE_MESSAGES: PrivateMessage[] = [];

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [];

