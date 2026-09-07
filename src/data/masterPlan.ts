import { MasterPeriod } from '../types';

export const MASTER_45_PERIODS: MasterPeriod[] = [
  // =========================================================================
  // UNIT I — Data Types, Expressions, Statements (Periods 1–6)
  // =========================================================================
  {
    periodNumber: 1,
    unit: 1,
    unitName: "Data Types, Expressions, Statements",
    topic: "Python Interpreter & Values & Types (int, float, bool, str, list)",
    phase: 'Concept',
    learningObjective: "Understand the Python interactive interpreter and identify the 5 core primitive data types using type().",
    teachingFocus: "Every real value needs a 'kind' before the computer can work with it.",
    subtopics: [
      "Python interpreter & interactive mode",
      "Values and data types",
      "int, float, boolean, string, list",
      "type() inspection function"
    ],
    realWorldAnchor: "A college ID card holding a roll number (int), CGPA (float), name (string), hosteller? (boolean), and subjects (list).",
    openingQuestion: "If I tell you '20', is that an age, a price, or a phone number's last digits — does it matter to the computer?",
    conceptFlow: "Situation → 'computer must know what KIND of data it's holding' → introduce type().",
    coreSyntax: "type(20)         # <class 'int'>\ntype(20.5)       # <class 'float'>\ntype('Deva')     # <class 'str'>\ntype(True)       # <class 'bool'>\ntype([1, 2, 3])  # <class 'list'>",
    demoCode: `# Inspecting data types for a College ID card
roll_no = 101
cgpa = 8.75
name = "Deva"
is_hosteller = True
subjects = ["Python", "Maths", "Physics"]

print("roll_no type:", type(roll_no))
print("cgpa type:", type(cgpa))
print("name type:", type(name))
print("is_hosteller type:", type(is_hosteller))
print("subjects type:", type(subjects))`,
    predictQuestion: {
      question: "What will type(3/1) print in Python?",
      options: ["<class 'int'>", "<class 'float'>", "<class 'number'>", "Error"],
      correctAnswerIndex: 1,
      explanation: "Division in Python (/) always produces a float, even if there is no remainder. 3/1 is 3.0 (<class 'float'>). Use // for integer floor division."
    },
    debugExercise: {
      buggyCode: `age = "20"\nnext_year = age + 1\nprint(next_year)`,
      errorType: "TypeError: can only concatenate str (not 'int') to str",
      hint: "'20' in quotation marks is string text, not a numeric integer.",
      fix: `age = int("20")\nnext_year = age + 1\nprint(next_year)`
    },
    practicalActivity: "Classify 5 real values from an ID card into correct Python types and verify with type().",
    practice: "Check and print the data types of your college registration number, semester fees, attendance percentage, and name.",
    expectedOutcome: "Students can comfortably identify and check the 5 fundamental Python data types.",
    connectsBack: "Builds on informal intro-session print and arithmetic exposure.",
    connectsForward: "Types need containers → variables (Period 2).",
    leaveKnowing: "The 5 core data types and how to check any value with type()."
  },
  {
    periodNumber: 2,
    unit: 1,
    unitName: "Data Types, Expressions, Statements",
    topic: "Variables, Expressions, Statements, Comments",
    phase: 'Concept',
    learningObjective: "Define variables as named memory references, construct expressions, and document code with comments.",
    teachingFocus: "We must name and reuse values, not retype them each time a price or number changes.",
    subtopics: [
      "Variables as named bindings",
      "Expressions vs Statements",
      "Assignment operator (=)",
      "Single-line comments (#)"
    ],
    realWorldAnchor: "Canteen bill calculation: samosa = 15, tea = 10, bill = samosa + tea.",
    openingQuestion: "If your canteen bill has 3 items, do you want to recompute the total by hand each time a price changes?",
    conceptFlow: "Repeated raw values → 'give it a name' → variable → combine names → expression → a line doing work → statement.",
    coreSyntax: "variable_name = expression\n# Comments are ignored by Python interpreter\ntotal = price1 + price2",
    demoCode: `# Canteen bill calculation
samosa = 15
tea = 10
# Calculate the total bill expression
bill = samosa + tea
print("Total canteen bill:", bill)

# Update tea price
tea = 15
bill = samosa + tea
print("Updated canteen bill:", bill)`,
    predictQuestion: {
      question: "If samosa = 15 and tea = 10, bill = samosa + tea. Then tea = 20. What is bill without re-running bill = samosa + tea?",
      options: ["35", "25", "None", "NameError"],
      correctAnswerIndex: 1,
      explanation: "Variables store evaluated values at the time of assignment. Changing 'tea' does not retroactively change 'bill'."
    },
    debugExercise: {
      buggyCode: `total = price1 + price2\nprice1 = 50\nprice2 = 30\nprint(total)`,
      errorType: "NameError: name 'price1' is not defined",
      hint: "Python executes from top to bottom. Assign variables before referencing them in expressions.",
      fix: `price1 = 50\nprice2 = 30\ntotal = price1 + price2\nprint(total)`
    },
    practicalActivity: "Calculate total marks of 3 subjects using named variables and explanatory comments.",
    practice: "Write a script calculating your weekly canteen budget using variables for breakfast, lunch, and tea.",
    expectedOutcome: "Students write expressions with named variables without making NameError mistakes.",
    connectsBack: "Values from Period 1 now stored in memory.",
    connectsForward: "Multiple values assigned together → tuple assignment & precedence (Period 3).",
    leaveKnowing: "How to name values with variables, build expressions, and write clear comments."
  },
  {
    periodNumber: 3,
    unit: 1,
    unitName: "Data Types, Expressions, Statements",
    topic: "Tuple Assignment & Operator Precedence",
    phase: 'Concept',
    learningObjective: "Utilize Python tuple unpacking for simultaneous assignment and evaluate expressions with correct operator precedence.",
    teachingFocus: "Some real tasks need two things done at once (swap), and math order matters or bills go wrong.",
    subtopics: [
      "Simultaneous tuple assignment (a, b = b, a)",
      "Operator precedence hierarchy (PEMDAS)",
      "Grouping operations using parentheses ()"
    ],
    realWorldAnchor: "Swapping two tea cups without a third cup; mobile recharge total = base + tax * rate.",
    openingQuestion: "How do you swap tea in two cups without needing a third cup?",
    conceptFlow: "Manual swap needs temporary variable → Python's a,b = b,a does it directly → then: does + or * happen first?",
    coreSyntax: "a, b = b, a       # Simultaneous swap\nresult = (a + b) * c # Parentheses override precedence",
    demoCode: `# Swapping two students' seat numbers
seat_A, seat_B = 101, 205
print(f"Before swap: seat_A={seat_A}, seat_B={seat_B}")
seat_A, seat_B = seat_B, seat_A
print(f"After swap:  seat_A={seat_A}, seat_B={seat_B}")

# Precedence: Mobile recharge bill
base = 199
tax_rate = 0.18
cashback = 20
total_bill = (base + (base * tax_rate)) - cashback
print(f"Final recharge bill: ₹{total_bill:.2f}")`,
    predictQuestion: {
      question: "What is the result of 2 + 3 * 4 vs (2 + 3) * 4?",
      options: ["14 and 20", "20 and 14", "14 and 14", "20 and 20"],
      correctAnswerIndex: 0,
      explanation: "* has higher precedence than +, so 3 * 4 = 12, 12 + 2 = 14. In (2 + 3) * 4, parentheses force 5 * 4 = 20."
    },
    debugExercise: {
      buggyCode: `# Calculate average of 80 and 90\naverage = 80 + 90 / 2\nprint("Average marks:", average)`,
      errorType: "Logic Error: Outputs 125.0 instead of 85.0",
      hint: "Division / occurs before addition +. Group the sum in parentheses.",
      fix: `average = (80 + 90) / 2\nprint("Average marks:", average)`
    },
    practicalActivity: "Swap two variables without a temp variable, and compute a mobile recharge bill with base, tax, and discount.",
    practice: "Write an expression to convert Celsius to Fahrenheit: F = (C * 9/5) + 32, verifying correct precedence.",
    expectedOutcome: "Students can swap variables cleanly in one line and apply parentheses to prevent mathematical precedence bugs.",
    connectsBack: "Extends single variable assignment from Period 2.",
    connectsForward: "Repeated formulas → make them reusable → functions (Period 4).",
    leaveKnowing: "How to swap values cleanly with a,b=b,a and prevent precedence bugs."
  },
  {
    periodNumber: 4,
    unit: 1,
    unitName: "Data Types, Expressions, Statements",
    topic: "Modules & Functions: Definition and Use",
    phase: 'Concept',
    learningObjective: "Define reusable functions using def and return values to eliminate repeated calculations.",
    teachingFocus: "The fee-calculation formula shouldn't be retyped for every student in the college.",
    subtopics: [
      "Function definition with def",
      "Calling functions with arguments",
      "The return statement vs print()",
      "Standard modules preview"
    ],
    realWorldAnchor: "A shared calculate_fee(credits) formula used for all 50 students in the class.",
    openingQuestion: "If 50 students need the same fee formula, do you write it 50 times?",
    conceptFlow: "Repeated logic → 'wrap it once, reuse it' → def.",
    coreSyntax: "def function_name(param1, param2):\n    # indented statements\n    return result",
    demoCode: `# Reusable fee calculation function
def calculate_fee(credits, scholarship=0):
    rate = 1500
    base_fee = credits * rate
    final_fee = base_fee - scholarship
    return final_fee

# Reuse for multiple students
fee_ravi = calculate_fee(20, scholarship=3000)
fee_anu = calculate_fee(18)

print("Ravi's fee: ₹", fee_ravi)
print("Anu's fee:  ₹", fee_anu)`,
    predictQuestion: {
      question: "What does calculate_fee() return if it does print(final_fee) but has no return statement?",
      options: ["The fee amount", "None", "0", "TypeError"],
      correctAnswerIndex: 1,
      explanation: "In Python, any function without an explicit return statement returns None by default."
    },
    debugExercise: {
      buggyCode: `def get_bill(price, qty):\n    total = price * qty\n\nbill = get_bill(50, 3)\nprint(bill + 10)`,
      errorType: "TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'",
      hint: "The function calculates total but forgets to return it to the caller.",
      fix: `def get_bill(price, qty):\n    return price * qty\n\nbill = get_bill(50, 3)\nprint(bill + 10)`
    },
    practicalActivity: "Write a reusable function calculate_bmi(weight, height) that returns the Body Mass Index.",
    practice: "Write a function calculate_bus_fare(distance_km) that charges ₹10 base plus ₹2 per km.",
    expectedOutcome: "Students write def functions with proper parameters and return values.",
    connectsBack: "Packages expressions from Periods 2–3 into reusable units.",
    connectsForward: "How does Python know which value goes where when called? → parameters/arguments & flow (Period 5).",
    leaveKnowing: "How to define a function with def and return a calculated value."
  },
  {
    periodNumber: 5,
    unit: 1,
    unitName: "Data Types, Expressions, Statements",
    topic: "Flow of Execution, Parameters & Arguments",
    phase: 'Concept',
    learningObjective: "Trace program call flow step-by-step and distinguish between formal parameters and actual arguments.",
    teachingFocus: "Understanding order of execution prevents 'why did this run before that' confusion.",
    subtopics: [
      "Execution flow and call stack frames",
      "Formal parameters vs actual arguments",
      "Positional vs keyword arguments",
      "Argument count matching"
    ],
    realWorldAnchor: "An attendance-check function called once per student in an orderly roll call line.",
    openingQuestion: "When mark_attendance('Ravi') runs, what happens first — inside the function or after it?",
    conceptFlow: "Trace calls on paper first → match to actual run.",
    coreSyntax: "def func(param1, param2): # parameters\n    return param1 + param2\n\nfunc(10, 20)              # arguments",
    demoCode: `def format_name(first, last):
    print("  -> Inside format_name")
    return f"{last.upper()}, {first.capitalize()}"

def generate_id_card(first, last, roll_no):
    print("-> Inside generate_id_card")
    formatted = format_name(first, last)
    return f"Card #{roll_no}: {formatted}"

print("Step 1: Calling generate_id_card")
card = generate_id_card("deva", "dinesh", 101)
print("Step 2: Returned card:", card)`,
    predictQuestion: {
      question: "When format_name() is executing, where is the generate_id_card() execution waiting?",
      options: ["It has already finished", "On the call stack, paused until format_name returns", "It runs simultaneously in the background", "It is cancelled"],
      correctAnswerIndex: 1,
      explanation: "Python runs sequentially. When a function calls another, the caller pauses on the call stack until the callee returns."
    },
    debugExercise: {
      buggyCode: `def greet_student(name, roll_no):\n    return f"Welcome {name} (Roll: {roll_no})"\n\nprint(greet_student("Deva"))`,
      errorType: "TypeError: greet_student() missing 1 required positional argument: 'roll_no'",
      hint: "The function contract expects 2 arguments; only 1 was passed.",
      fix: `def greet_student(name, roll_no):\n    return f"Welcome {name} (Roll: {roll_no})"\n\nprint(greet_student("Deva", 101))`
    },
    practicalActivity: "Trace a 3-function call chain on paper, predict printed order, then execute in Python to verify.",
    practice: "Create a function compute_grade(marks, max_marks=100) and call it with positional and keyword arguments.",
    expectedOutcome: "Students can accurately trace the call stack and pass the right arguments to functions.",
    connectsBack: "Deepens function definition and usage from Period 4.",
    connectsForward: "Apply everything from Unit I to real illustrative syllabus problems (Period 6).",
    leaveKnowing: "The difference between parameters and arguments, and how execution moves across function calls."
  },
  {
    periodNumber: 6,
    unit: 1,
    unitName: "Data Types, Expressions, Statements",
    topic: "Unit I Illustrative Programs: Swap, Circulate N Variables, Distance Formula",
    phase: 'Concept',
    learningObjective: "Synthesize Unit I concepts to solve the official syllabus illustrative programs.",
    teachingFocus: "These are the official syllabus illustrative programs — a solid checkpoint before moving to control flow.",
    subtopics: [
      "Exchange values of two variables",
      "Circulate the values of n variables",
      "Distance between two points using math.sqrt",
      "Input-Process-Output methodology"
    ],
    realWorldAnchor: "Distance between two hostel blocks on a coordinate map; passing a token around n students in a circle.",
    openingQuestion: "How do you calculate the straight-line walking distance between two hostel buildings given their map coordinates?",
    conceptFlow: "INPUT → PROCESS → OUTPUT framing before coding each program.",
    coreSyntax: "import math\ndistance = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)\na, b, c = b, c, a  # Circulate 3 variables",
    demoCode: `import math

# 1. Exchange two variables
x, y = 10, 20
x, y = y, x
print(f"1. Exchanged: x={x}, y={y}")

# 2. Circulate values of n variables (3 variables)
a, b, c = 1, 2, 3
print(f"2. Original: a={a}, b={b}, c={c}")
a, b, c = b, c, a
print(f"   Circulated 1 step: a={a}, b={b}, c={c}")

# 3. Distance between two hostel blocks
x1, y1 = 3, 4
x2, y2 = 7, 7
dist = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
print(f"3. Straight-line distance: {dist:.2f} meters")`,
    predictQuestion: {
      question: "If a, b, c, d = 1, 2, 3, 4, what are their values after a, b, c, d = b, c, d, a?",
      options: ["2, 3, 4, 1", "1, 2, 3, 4", "4, 3, 2, 1", "2, 1, 4, 3"],
      correctAnswerIndex: 0,
      explanation: "Each variable shifts left by one position: a takes b (2), b takes c (3), c takes d (4), d takes a (1)."
    },
    debugExercise: {
      buggyCode: `# Circulating without simultaneous assignment\na, b, c = 1, 2, 3\na = b\nb = c\nc = a\nprint(a, b, c)`,
      errorType: "Logic Error: c receives 2 instead of 1 because a was overwritten on line 2",
      hint: "Assigning sequentially overwrites variable values before they are used. Use tuple circulation.",
      fix: `a, b, c = 1, 2, 3\na, b, c = b, c, a\nprint(a, b, c)`
    },
    practicalActivity: "Independently code the distance formula program with console inputs and format output to 2 decimal places.",
    practice: "Write a program to circulate 5 student roll numbers in a circle and print each iteration.",
    expectedOutcome: "Students confidently write variable, expression, and math-based programs; Unit I complete.",
    connectsBack: "Consolidates all Unit I concepts (Periods 1–5).",
    connectsForward: "Now the computer must start making decisions (Unit II, Period 7).",
    leaveKnowing: "How to solve the syllabus illustrative programs using clean Python syntax."
  },

  // =========================================================================
  // UNIT II — Control Flow, Functions (Periods 7–13)
  // =========================================================================
  {
    periodNumber: 7,
    unit: 2,
    unitName: "Control Flow, Functions",
    topic: "Boolean Values, Relational Operators & The if Statement",
    phase: 'Concept',
    learningObjective: "Evaluate boolean expressions and implement single-branch conditional decisions with if.",
    teachingFocus: "Programs must react differently to different situations rather than executing blindly.",
    subtopics: [
      "Boolean values: True and False",
      "Relational operators (==, !=, <, >, <=, >=)",
      "Logical operators (and, or, not)",
      "if statement syntax and indentation rules"
    ],
    realWorldAnchor: "Phone unlock screen: checking if the entered PIN matches the saved PIN.",
    openingQuestion: "How does your phone decide whether to 'unlock' or say 'try again'?",
    conceptFlow: "Human reasoning ('if correct, unlock') → Boolean condition → if statement.",
    coreSyntax: "if condition:\n    # indented block executed when condition is True",
    demoCode: `# Phone unlock PIN verification
saved_pin = "1234"
entered_pin = "1234"

if entered_pin == saved_pin:
    print("Access Granted: Phone unlocked!")

# Age voting eligibility
age = 19
if age >= 18:
    print(f"Age {age}: Eligible to vote in college election.")`,
    predictQuestion: {
      question: "What is the difference between = and == in Python?",
      options: [
        "= is for comparison, == is for assignment",
        "= is for assignment, == is for equality comparison",
        "They are completely interchangeable",
        "== creates a new variable"
      ],
      correctAnswerIndex: 1,
      explanation: "= assigns a value to a variable tag. == compares two values and returns a boolean (True or False)."
    },
    debugExercise: {
      buggyCode: `password = "secret"\nif password = "secret":\n    print("Welcome!")`,
      errorType: "SyntaxError: invalid syntax (cannot use assignment in condition)",
      hint: "Use the equality operator == inside if conditions, not single =.",
      fix: `password = "secret"\nif password == "secret":\n    print("Welcome!")`
    },
    practicalActivity: "Implement an age check 'Eligible for driving license' using relational operators.",
    practice: "Check if a student's marks are greater than or equal to 50 and print 'Qualified for Round 2'.",
    expectedOutcome: "Students write if statements with correct comparison operators and 4-space indentation.",
    connectsBack: "Connects to boolean data type learned in Period 1.",
    connectsForward: "What if the condition is false too? → else and chained elif (Period 8).",
    leaveKnowing: "How to formulate boolean tests and branch execution using if."
  },
  {
    periodNumber: 8,
    unit: 2,
    unitName: "Control Flow, Functions",
    topic: "Alternative & Chained Conditionals: if-else, if-elif-else",
    phase: 'Concept',
    learningObjective: "Structure multi-path branching using if-else and if-elif-else cascades for mutually exclusive cases.",
    teachingFocus: "Grading one student needs chained slabs; boundary values require strict comparison ordering.",
    subtopics: [
      "Two-way branching with if-else",
      "Multi-way branching with if-elif-else",
      "Boundary value conditions",
      "Order of elif conditions"
    ],
    realWorldAnchor: "College grade slabs (A/B/C/Fail) and movie ticket pricing by age group.",
    openingQuestion: "If a student scores exactly 90, does an A-grade condition (> 90 vs >= 90) include or exclude them?",
    conceptFlow: "Single decision → two-way decision → many-way chained decision.",
    coreSyntax: "if score >= 90:\n    grade = 'A'\nelif score >= 75:\n    grade = 'B'\nelif score >= 50:\n    grade = 'C'\nelse:\n    grade = 'F'",
    demoCode: `# Grade classification based on marks
marks = 85

if marks >= 90:
    grade = "A+"
elif marks >= 80:
    grade = "A"
elif marks >= 70:
    grade = "B"
elif marks >= 50:
    grade = "Pass"
else:
    grade = "Needs Improvement"

print(f"Marks: {marks} -> Grade: {grade}")`,
    predictQuestion: {
      question: "If the elif conditions are reversed (checking marks >= 50 before marks >= 90), what grade will a student with 95 get?",
      options: ["A+", "Pass", "Error", "None"],
      correctAnswerIndex: 1,
      explanation: "Python evaluates conditions top-to-bottom. The first True condition runs and skips all subsequent branches. If >= 50 is on top, 95 triggers 'Pass'!"
    },
    debugExercise: {
      buggyCode: `marks = 92\nif marks >= 50:\n    print("Pass")\nelif marks >= 90:\n    print("Topper")`,
      errorType: "Logic Error: 'Topper' will never be reached because >= 50 is always True first",
      hint: "Arrange chained conditions from the most restrictive (highest score) to least restrictive.",
      fix: `marks = 92\nif marks >= 90:\n    print("Topper")\nelif marks >= 50:\n    print("Pass")\nelse:\n    print("Fail")`
    },
    practicalActivity: "Build a ticket pricing program (Child: free, Student: ₹50, Adult: ₹120, Senior: ₹80) based on age.",
    practice: "Write an electricity bill slab calculator (first 100 units free, next 100 at ₹3, above 200 at ₹5).",
    expectedOutcome: "Students can construct correct multi-branch decision trees without ordering bugs.",
    connectsBack: "Expands single if from Period 7 into two-way and multi-way branching.",
    connectsForward: "Grading one student is easy — what about checking all students repeatedly? → iteration (Period 9).",
    leaveKnowing: "How to use if-elif-else for multi-way decisions and avoid boundary bugs."
  },
  {
    periodNumber: 9,
    unit: 2,
    unitName: "Control Flow, Functions",
    topic: "Iteration: State & The while Loop",
    phase: 'Concept',
    learningObjective: "Implement condition-controlled loops using while, managing state variables to avoid infinite loops.",
    teachingFocus: "The 3 non-negotiable pillars of a while loop: Initialization, Condition, and State Update.",
    subtopics: [
      "The while loop mechanism",
      "Loop state variable & accumulator pattern",
      "Infinite loops hazards and prevention",
      "Sentinel-controlled loops"
    ],
    realWorldAnchor: "ATM allows 3 PIN attempts before locking; bus conductor counting passengers until bus is full.",
    openingQuestion: "How does an ATM count your incorrect PIN attempts and stop exactly after 3 tries?",
    conceptFlow: "'Keep doing X until condition changes' → state variable + while loop.",
    coreSyntax: "state = initial_value\nwhile state_condition:\n    # loop statements\n    state = updated_value # Vital!",
    demoCode: `# ATM PIN retry counter simulation
max_attempts = 3
attempts_used = 0
correct_pin = "1234"
user_entries = ["0000", "1111", "1234"] # simulated inputs

while attempts_used < max_attempts:
    pin = user_entries[attempts_used]
    attempts_used += 1
    print(f"Attempt {attempts_used}: Entered {pin}")
    if pin == correct_pin:
        print("PIN Accepted! Welcome to your account.")
        break
    else:
        print(f"Incorrect PIN. Attempts left: {max_attempts - attempts_used}")`,
    predictQuestion: {
      question: "What happens if you forget to increment attempts_used inside the while loop?",
      options: [
        "The loop stops automatically after 3 runs",
        "An infinite loop occurs because attempts_used never reaches max_attempts",
        "Python throws an InfiniteLoopError",
        "The variable resets to 0"
      ],
      correctAnswerIndex: 1,
      explanation: "Without updating the state variable, the condition remains True forever, causing an infinite loop that freezes execution."
    },
    debugExercise: {
      buggyCode: `count = 1\nwhile count <= 5:\n    print("Processing student", count)\n    # Missing update step`,
      errorType: "Infinite Loop: count stays 1 forever",
      hint: "Always ensure a line inside the while loop moves the counter closer to termination.",
      fix: `count = 1\nwhile count <= 5:\n    print("Processing student", count)\n    count += 1`
    },
    practicalActivity: "Build a countdown timer from 10 to 1 followed by 'Liftoff!' using a while loop.",
    practice: "Write a while loop that calculates the sum of all digits of an integer (e.g. 1234 -> 10).",
    expectedOutcome: "Students can construct stable while loops without infinite loop bugs.",
    connectsBack: "Adds repetition to conditional decisions from Periods 7–8.",
    connectsForward: "When we already know how many items to process — is while the best tool? → for loop (Period 10).",
    leaveKnowing: "The 3 pillars of a while loop and how to prevent infinite loops."
  },
  {
    periodNumber: 10,
    unit: 2,
    unitName: "Control Flow, Functions",
    topic: "Iteration: for, break, continue, pass",
    phase: 'Concept',
    learningObjective: "Iterate over known sequences using for loops and control loop execution using break, continue, and pass.",
    teachingFocus: "Definite iteration over ranges and lists; using break for early exit and continue for skipping items.",
    subtopics: [
      "The for loop and range(start, stop, step)",
      "Loop early exit with break",
      "Skipping current iteration with continue",
      "Placeholder statement with pass"
    ],
    realWorldAnchor: "Scanning an attendance list (break when target found); skipping out-of-stock items in a food-ordering menu.",
    openingQuestion: "When checking a register for student #42, do you keep reading all 100 names after you find them?",
    conceptFlow: "Known-length repetition → for + range(); early exit → break; skip item → continue; placeholder → pass.",
    coreSyntax: "for item in sequence:\n    if condition_to_stop:\n        break\n    if condition_to_skip:\n        continue\n    # process item",
    demoCode: `# Attendance scanning with break and continue
class_roll = [101, 102, 103, 104, 105, 106]
absent_students = [103, 105]

print("--- Daily Roll Call ---")
for roll in class_roll:
    if roll in absent_students:
        print(f"Roll {roll}: ABSENT (Skipping mark entry)")
        continue # skip remaining lines for this student
    
    print(f"Roll {roll}: Present -> Marked attendance")
    
    if roll == 104:
        print("Target student 104 verified. Pausing scan.")
        break # stop entire loop`,
    predictQuestion: {
      question: "What does range(2, 10, 3) generate?",
      options: ["[2, 5, 8]", "[2, 3, 4, 5, 6, 7, 8, 9, 10]", "[2, 5, 8, 11]", "[3, 6, 9]"],
      correctAnswerIndex: 0,
      explanation: "range(start, stop, step) starts at 2, steps by +3: 2, 5, 8. 11 is >= stop (10), so it is excluded."
    },
    debugExercise: {
      buggyCode: `# Print only even numbers up to 10\nfor i in range(1, 11):\n    if i % 2 != 0:\n        break # Bug: stops everything on 1\n    print(i)`,
      errorType: "Logic Error: break terminates the entire loop on first odd number (1)",
      hint: "Use continue to skip to the next iteration instead of breaking the entire loop.",
      fix: `for i in range(1, 11):\n    if i % 2 != 0:\n        continue # Skips odd numbers\n    print(i)`
    },
    practicalActivity: "Loop through numbers 1 to 20; skip multiples of 3 with continue and stop at 16 with break.",
    practice: "Scan a list of student marks. If any student has marks < 0, report 'Data corrupted' and break.",
    expectedOutcome: "Students use for, range, break, and continue with precision.",
    connectsBack: "Contrasts with indefinite while loops from Period 9.",
    connectsForward: "Repeated decision logic should become reusable → fruitful functions (Period 11).",
    leaveKnowing: "How for loops navigate sequences and how break/continue control iteration flow."
  },
  {
    periodNumber: 11,
    unit: 2,
    unitName: "Control Flow, Functions",
    topic: "Fruitful Functions: Return Values, Parameters & Scope",
    phase: 'Concept',
    learningObjective: "Write fruitful functions that return computed values and analyze variable scope (local vs global).",
    teachingFocus: "Functions that return values (fruitful) vs void functions; preventing accidental global state corruption.",
    subtopics: [
      "Fruitful functions with return values",
      "Local vs Global variable scope",
      "The LEGB rule (Local, Enclosing, Global, Built-in)",
      "Void functions returning None"
    ],
    realWorldAnchor: "One shared calculate_gpa() function used by every college department without variable mix-ups.",
    openingQuestion: "Can a variable 'marks' inside calculate_gpa() overwrite a 'marks' variable in another professor's code?",
    conceptFlow: "Function that does something vs function that returns a usable value → local vs global scope.",
    coreSyntax: "def calculate_gpa(marks_list):\n    # marks_list and total are LOCAL variables\n    total = sum(marks_list)\n    return total / len(marks_list)",
    demoCode: `# Fruitful function with scope isolation
college_name = "Tech University" # Global variable

def compute_gpa(sem1_marks):
    # sem1_marks and total are LOCAL variables
    total = sum(sem1_marks)
    gpa = total / len(sem1_marks) / 10
    return gpa

student_marks = [85, 90, 78, 92]
result_gpa = compute_gpa(student_marks)
print(f"Student at {college_name} GPA: {result_gpa:.2f}")

# Attempting to access local variable outside will error:
# print(total) -> NameError: name 'total' is not defined`,
    predictQuestion: {
      question: "If a function modifies a variable 'x = 10' inside its body without 'global x', what happens to a global 'x = 50' outside?",
      options: [
        "Global x changes to 10",
        "Global x remains 50 because the function creates a local variable x",
        "Python throws an UnboundLocalError",
        "Both variables are deleted"
      ],
      correctAnswerIndex: 1,
      explanation: "By default, assignment inside a function creates a local variable that shadows any global variable with the same name."
    },
    debugExercise: {
      buggyCode: `def is_pass(marks):\n    if marks >= 50:\n        result = True\n    else:\n        result = False\n    # Forgot return statement!\n\nstatus = is_pass(72)\nif status == True:\n    print("Promoted")`,
      errorType: "Logic Error: status is None because is_pass has no return statement",
      hint: "Explicitly return result at the end of fruitful functions.",
      fix: `def is_pass(marks):\n    return marks >= 50\n\nstatus = is_pass(72)\nif status:\n    print("Promoted")`
    },
    practicalActivity: "Write an is_pass(marks) fruitful function returning True/False and use it to filter a class list.",
    practice: "Write a fruitful function calculate_discount(price, category) returning the discounted final price.",
    expectedOutcome: "Students write fruitful functions and explain why local variables are isolated from global scope.",
    connectsBack: "Deepens basic def concepts from Period 4.",
    connectsForward: "Can a function call itself to solve complex sub-problems? → recursion (Period 12).",
    leaveKnowing: "How fruitful functions return data and how local scope protects variables."
  },
  {
    periodNumber: 12,
    unit: 2,
    unitName: "Control Flow, Functions",
    topic: "Function Composition & Recursion",
    phase: 'Concept',
    learningObjective: "Compose functions and implement recursive algorithms with clear base cases.",
    teachingFocus: "Recursion breaks a big problem into 'same smaller problem' + a stopping point (base case).",
    subtopics: [
      "Function composition (f(g(x)))",
      "Recursive thinking & self-referential calls",
      "The mandatory Base Case",
      "GCD via Euclidean algorithm & exponentiation"
    ],
    realWorldAnchor: "GCD by repeatedly asking 'who divides whom' (Euclidean method); climbing stairs 1 or 2 steps at a time.",
    openingQuestion: "How do you solve a Russian nesting doll problem — what is the stopping condition when opening dolls?",
    conceptFlow: "Break big problem into 'same smaller problem' + a stopping point (base case).",
    coreSyntax: "def recursive_func(n):\n    if n <= 1:           # Base case (stopping rule)\n        return 1\n    return n * recursive_func(n - 1) # Recursive step",
    demoCode: `# 1. Recursive Factorial\ndef factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\n# 2. Recursive Greatest Common Divisor (GCD - official illustrative program)\ndef gcd(a, b):\n    if b == 0:\n        return a\n    return gcd(b, a % b)\n\n# 3. Recursive Exponentiation (official illustrative program)\ndef power(base, exp):\n    if exp == 0:\n        return 1\n    return base * power(base, exp - 1)\n\nprint("Factorial of 5:", factorial(5))\nprint("GCD of 48 and 18:", gcd(48, 18))\nprint("2 to the power 8:", power(2, 8))`,
    predictQuestion: {
      question: "What happens if a recursive function does NOT have a base case?",
      options: [
        "It returns 0",
        "It crashes with RecursionError: maximum recursion depth exceeded",
        "It compiles but runs in negative numbers forever",
        "The computer shuts down"
      ],
      correctAnswerIndex: 1,
      explanation: "Without a base case, Python continues creating stack frames until reaching its safety limit (~1000 frames) and raises RecursionError."
    },
    debugExercise: {
      buggyCode: `def countdown(n):\n    print(n)\n    countdown(n - 1) # Missing stopping condition!\n\ncountdown(5)`,
      errorType: "RecursionError: maximum recursion depth exceeded",
      hint: "Add a base case checking if n <= 0 before making the recursive call.",
      fix: `def countdown(n):\n    if n <= 0:\n        print("Done!")\n        return\n    print(n)\n    countdown(n - 1)\n\ncountdown(5)`
    },
    practicalActivity: "Trace recursive gcd(48, 18) call stack on paper, then write and run the recursive power function.",
    practice: "Implement recursive sum_of_n(n) which calculates 1 + 2 + ... + n.",
    expectedOutcome: "Students can identify the base case and recursive step in recursive functions.",
    connectsBack: "Builds on call stack knowledge from Period 5 and fruitful functions from Period 11.",
    connectsForward: "We've been using numbers — what about text data like names and passwords? → strings & arrays (Period 13).",
    leaveKnowing: "How recursion operates with base cases and call stacks to solve mathematical problems."
  },
  {
    periodNumber: 13,
    unit: 2,
    unitName: "Control Flow, Functions",
    topic: "Strings: Slices, Immutability & Methods + Lists as Arrays",
    phase: 'Concept',
    learningObjective: "Manipulate strings using slicing, methods, and understand immutability; treat lists as 1D arrays.",
    teachingFocus: "Text as a sequence; strings are immutable; lists used as fixed-type arrays (sum of array, Newton's method).",
    subtopics: [
      "String indexing and slicing [start:stop:step]",
      "String immutability",
      "Built-in string methods (.strip(), .title(), .split())",
      "Lists as arrays (sum an array of numbers)",
      "Square root using Newton's method"
    ],
    realWorldAnchor: "Validating a password's length and digits; cleaning messy student names with extra whitespace.",
    openingQuestion: "If student names are typed with messy spaces like '   dEvA diNeSh  ', how do we clean them in one line?",
    conceptFlow: "Text as a sequence → indexing/slicing → built-in string methods → lists used as fixed arrays.",
    coreSyntax: "text[start:stop:step] # Slicing\ncleaned = text.strip().title()\n# Lists as arrays: sum(marks_array)",
    demoCode: `# 1. String cleaning and slicing
raw_name = "   rAvI kUmAr   "
cleaned = raw_name.strip().title()
print(f"Cleaned: '{cleaned}'")
print(f"First 4 chars: '{cleaned[0:4]}'")

# 2. Sum an array of numbers (illustrative program)
marks_array = [78, 85, 92, 88, 64]
total_sum = sum(marks_array)
print(f"Array sum: {total_sum}, Average: {total_sum / len(marks_array)}")

# 3. Newton's method for square root (illustrative program)
def newton_sqrt(n, iterations=10):
    approx = 0.5 * n
    for _ in range(iterations):
        better = 0.5 * (approx + n / approx)
        approx = better
    return approx

print("Square root of 25 (Newton):", newton_sqrt(25))`,
    predictQuestion: {
      question: "If s = 'PYTHON', what does s[1:4] return?",
      options: ["'YTH'", "'PYT'", "'YTHO'", "'PYTHON'"],
      correctAnswerIndex: 0,
      explanation: "Slice [1:4] takes indices 1, 2, and 3 (index 4 is excluded): s[1]='Y', s[2]='T', s[3]='H'."
    },
    debugExercise: {
      buggyCode: `name = "Deva"\nname[0] = "R" # Attempting in-place mutation\nprint(name)`,
      errorType: "TypeError: 'str' object does not support item assignment",
      hint: "Strings are immutable. To change a string, create a new string slice or use .replace().",
      fix: `name = "Deva"\nname = "R" + name[1:]\nprint(name)`
    },
    practicalActivity: "Validate that a student password is at least 8 characters long and contains at least one digit.",
    practice: "Write a program to count vowels, consonants, and spaces in a given sentence.",
    expectedOutcome: "Students manipulate strings safely and compute on numeric lists as arrays; Unit II complete.",
    connectsBack: "Connects string data type from Period 1 with control flow from Periods 7–10.",
    connectsForward: "One list per marks-set is fine — managing many related records needs full list mastery → Unit III (Period 14).",
    leaveKnowing: "How string indexing and immutability work, and how lists serve as 1D arrays."
  },

  // =========================================================================
  // UNIT III — Lists, Tuples, Dictionaries (Periods 14–19)
  // =========================================================================
  {
    periodNumber: 14,
    unit: 3,
    unitName: "Lists, Tuples, Dictionaries",
    topic: "List Operations, Slices, Methods & Iteration",
    phase: 'Concept',
    learningObjective: "Perform fundamental operations on lists: slicing, appending, removing, sorting, and traversal.",
    teachingFocus: "Single values are not enough; a class of students requires ordered, mutable collections.",
    subtopics: [
      "List creation and indexing",
      "List slicing and concatenation (+, *)",
      "List methods (.append(), .remove(), .pop(), .sort())",
      "Iterating through lists with for"
    ],
    realWorldAnchor: "A class's marks list — adding new student marks, removing dropped students, sorting toppers.",
    openingQuestion: "If you have 50 students in your class, do you create 50 separate variables or one ordered list?",
    conceptFlow: "Single values → group of related values → list as a dynamic container.",
    coreSyntax: "marks = [85, 92, 78]\nmarks.append(95)      # Add to end\nmarks.sort(reverse=True) # Sort descending\nfor m in marks:\n    print(m)",
    demoCode: `# Managing class marks list
marks = [72, 88, 95, 60, 84]
print("Initial marks:", marks)

# Operations
marks.append(91) # new test result
marks.remove(60) # drop lowest mark
print("After append & remove:", marks)

# Slicing top 3
marks.sort(reverse=True)
print("Sorted marks:", marks)
print("Top 3 marks in class:", marks[:3])`,
    predictQuestion: {
      question: "What is the difference between marks.sort() and sorted(marks)?",
      options: [
        "marks.sort() modifies the list in place; sorted(marks) returns a new sorted list",
        "sorted(marks) modifies the list in place; marks.sort() returns a new list",
        "They are completely identical",
        "marks.sort() works only for strings"
      ],
      correctAnswerIndex: 0,
      explanation: "marks.sort() modifies the original list in-place and returns None. sorted(marks) leaves the original list untouched and returns a new sorted copy."
    },
    debugExercise: {
      buggyCode: `marks = [80, 90, 75]\nprint(marks[3]) # Accessing 4th element`,
      errorType: "IndexError: list index out of range",
      hint: "Python lists are 0-indexed. A list with 3 elements has indices 0, 1, and 2.",
      fix: `marks = [80, 90, 75]\nprint(marks[2]) # Accesses 75`
    },
    practicalActivity: "Add 5 student marks to an empty list from input, remove the lowest, and print the sorted class rank.",
    practice: "Write a program that takes a list of numbers and computes the average, minimum, and maximum without using min()/max().",
    expectedOutcome: "Students can manipulate lists using methods and slices without IndexError.",
    connectsBack: "Extends lists as arrays from Period 13.",
    connectsForward: "If two variables point to the same list — what happens? → aliasing & cloning (Period 15).",
    leaveKnowing: "How to create, slice, modify, and iterate through lists."
  },
  {
    periodNumber: 15,
    unit: 3,
    unitName: "Lists, Tuples, Dictionaries",
    topic: "Mutability, Aliasing, Cloning & List Parameters",
    phase: 'Concept',
    learningObjective: "Distinguish between list aliasing (shared reference) and cloning (independent copy), and understand list mutation in functions.",
    teachingFocus: "The shared-list bug: modifying an aliased list changes the original because they share the same memory address.",
    subtopics: [
      "Mutability of lists",
      "Memory aliasing (list2 = list1)",
      "Cloning with .copy() or [:]",
      "Passing lists as mutable function arguments"
    ],
    realWorldAnchor: "Two class monitors editing 'the same' attendance sheet unknowingly — one's change alters the other's record.",
    openingQuestion: "If monitor A writes on a photocopy of the attendance sheet, does monitor B's original sheet change?",
    conceptFlow: "Show the bug live → explain why (same object in memory) → fix with .copy().",
    coreSyntax: "list2 = list1        # ALIASING: changes to list2 mutate list1!\nlist2 = list1.copy() # CLONING: independent duplicate",
    demoCode: `# Demonstration of Aliasing vs Cloning
original_marks = [85, 90, 78]

# 1. Aliasing trap (Shared reference)
alias_marks = original_marks
alias_marks[0] = 99
print("After modifying alias, original is changed:", original_marks)

# 2. Cloning fix (Independent copy)
real_copy = original_marks.copy()
real_copy[0] = 50
print("After modifying clone, original is preserved:", original_marks)
print("Clone list:", real_copy)`,
    predictQuestion: {
      question: "If a function receives a list and calls .append(100), does the caller's list outside the function change?",
      options: [
        "Yes, because lists are mutable and passed by reference",
        "No, because functions cannot affect variables outside",
        "Only if the function returns the list",
        "Python throws an error"
      ],
      correctAnswerIndex: 0,
      explanation: "In Python, lists are passed by object reference. In-place mutating operations like .append() affect the original list directly."
    },
    debugExercise: {
      buggyCode: `def reset_scores(scores):\n    # Teacher wants to work on a draft\n    draft = scores\n    draft.clear()\n    return draft\n\nmarks = [80, 90, 85]\nreset_scores(marks)\nprint("Original marks:", marks) # Oops! marks is empty!`,
      errorType: "Logic Defect: Aliasing cleared the caller's list",
      hint: "Create an explicit clone with scores.copy() before modifying draft.",
      fix: `def reset_scores(scores):\n    draft = scores.copy()\n    draft.clear()\n    return draft\n\nmarks = [80, 90, 85]\nreset_scores(marks)\nprint("Original marks:", marks) # Preserved!`
    },
    practicalActivity: "Demonstrate live in the IDE how modifying an aliased list changes both, then fix using .copy().",
    practice: "Write a function double_elements(lst) that returns a new doubled list without altering the original list.",
    expectedOutcome: "Students can explain memory reference vs copying and prevent aliasing bugs.",
    connectsBack: "Deepens list operations from Period 14.",
    connectsForward: "Sometimes we want a collection that CANNOT be changed accidentally → tuples (Period 16).",
    leaveKnowing: "Why list2 = list1 creates an alias and how to safely clone with .copy()."
  },
  {
    periodNumber: 16,
    unit: 3,
    unitName: "Lists, Tuples, Dictionaries",
    topic: "Tuples: Assignment, Immutability & Return Values",
    phase: 'Concept',
    learningObjective: "Utilize tuples for immutable records, multiple assignment unpacking, and returning multi-value results.",
    teachingFocus: "Lists change; sometimes we want a record that shouldn't change (coordinates, min/max pair).",
    subtopics: [
      "Tuple syntax and immutability",
      "Tuples as return values from functions",
      "Tuple unpacking",
      "Single-element tuple syntax (x,)"
    ],
    realWorldAnchor: "A function returning (min_mark, max_mark) in one shot; GPS coordinates as a fixed pair.",
    openingQuestion: "Can a function return two different answers (like lowest and highest marks) simultaneously?",
    conceptFlow: "Lists change; sometimes we want a value that shouldn't change → tuple.",
    coreSyntax: "coords = (13.0827, 80.2707) # Immutable GPS pair\ndef min_max(lst):\n    return min(lst), max(lst) # Returns a tuple\nlo, hi = min_max(marks)       # Unpacking",
    demoCode: `# Function returning multiple values via tuple
def get_class_stats(marks_list):
    lowest = min(marks_list)
    highest = max(marks_list)
    average = sum(marks_list) / len(marks_list)
    return lowest, highest, average # Returns a 3-tuple

test_scores = [65, 88, 92, 74, 99, 81]
low, high, avg = get_class_stats(test_scores)

print(f"Stats -> Lowest: {low}, Highest: {high}, Class Average: {avg:.1f}")`,
    predictQuestion: {
      question: "What happens if you execute: t = (10, 20); t[0] = 99?",
      options: [
        "t becomes (99, 20)",
        "TypeError: 'tuple' object does not support item assignment",
        "It converts into a list automatically",
        "None"
      ],
      correctAnswerIndex: 1,
      explanation: "Tuples are immutable. Once created, their elements cannot be reassigned or deleted."
    },
    debugExercise: {
      buggyCode: `# Creating a single element tuple\nsingle = (42)\nprint(type(single)) # Expected tuple, gets int!`,
      errorType: "Type Pitfall: (42) is treated as an integer in parentheses, not a tuple",
      hint: "In Python, a single-element tuple requires a trailing comma: (42,).",
      fix: `single = (42,)\nprint(type(single)) # <class 'tuple'>`
    },
    practicalActivity: "Write a function that accepts student marks and returns a tuple of (name, total, grade).",
    practice: "Create a list of tuples representing student records (roll, name, marks) and sort by marks.",
    expectedOutcome: "Students use tuples for multi-value returns and record integrity.",
    connectsBack: "Connects to tuple assignment introduced in Period 3.",
    connectsForward: "Roll numbers as list indices are clumsy — what if we could look up by a meaningful key? → dictionaries (Period 17).",
    leaveKnowing: "How to use tuples for immutable pairs and returning multiple values from functions."
  },
  {
    periodNumber: 17,
    unit: 3,
    unitName: "Lists, Tuples, Dictionaries",
    topic: "Dictionaries: Operations & Methods",
    phase: 'Concept',
    learningObjective: "Store and retrieve data using key-value mappings with Python dictionaries.",
    teachingFocus: "Index-based lookup is unnatural for real records; key-based lookup enables instant search by roll number or name.",
    subtopics: [
      "Key-Value mapping concept",
      "Dictionary creation and lookup",
      ".keys(), .values(), .items() methods",
      "Safe access using .get(key, default)"
    ],
    realWorldAnchor: "Roll number → student record lookup; phone contacts app (name → phone number).",
    openingQuestion: "In a class of 100 students, how do you instantly find 'Anu's' marks without checking every student one-by-one?",
    conceptFlow: "Index-based lookup is unnatural for real records → key-based lookup → dict.",
    coreSyntax: "student_records = {'101': 'Ravi', '102': 'Anu'}\nname = student_records.get('105', 'Not Found') # Safe!\nfor roll, name in student_records.items():\n    print(roll, name)",
    demoCode: `# Student marks directory using dictionary
students = {
    "26009479": {"name": "Aadhil", "marks": 88},
    "26016734": {"name": "Balaji", "marks": 92},
    "26018966": {"name": "Harish", "marks": 79}
}

# Fast key-based lookup
query_reg = "26016734"
if query_reg in students:
    print(f"Found: {students[query_reg]['name']} scored {students[query_reg]['marks']}")

# Safe access with .get()
unknown = students.get("99999999", {"name": "Unknown", "marks": 0})
print("Lookup missing key safely:", unknown["name"])`,
    predictQuestion: {
      question: "What is the result of students['99999999'] if the key does not exist?",
      options: ["None", "KeyError: '99999999'", "False", "0"],
      correctAnswerIndex: 1,
      explanation: "Accessing a missing key via square brackets raises a KeyError. Use .get() to provide a fallback default."
    },
    debugExercise: {
      buggyCode: `d = {"apple": 100, "mango": 120}\nprint("Orange price:", d["orange"])`,
      errorType: "KeyError: 'orange'",
      hint: "Use d.get('orange', 'Not in stock') to prevent crashes when a key might be missing.",
      fix: `d = {"apple": 100, "mango": 120}\nprint("Orange price:", d.get("orange", "Not in stock"))`
    },
    practicalActivity: "Build a roll-number → marks dictionary and look up multiple students interactively.",
    practice: "Write a word frequency counter that counts occurrences of each word in a paragraph using a dictionary.",
    expectedOutcome: "Students can construct dictionaries, iterate with .items(), and retrieve values safely with .get().",
    connectsBack: "Complements lists and tuples from Periods 14–16.",
    connectsForward: "Can we build filtered lists and mappings in a clean, one-line pattern? → list comprehension (Period 18).",
    leaveKnowing: "How dictionary key-value pairs enable instant lookup and safe access with .get()."
  },
  {
    periodNumber: 18,
    unit: 3,
    unitName: "Lists, Tuples, Dictionaries",
    topic: "List Comprehension",
    phase: 'Concept',
    learningObjective: "Construct concise, expressive, and efficient lists using list comprehension syntax.",
    teachingFocus: "Compressing boilerplate for-loops with append into clean, readable single-line transformations.",
    subtopics: [
      "List comprehension syntax: [expr for item in iterable]",
      "Conditional filtering: [expr for item in iterable if condition]",
      "Transforming numbers and strings",
      "Readability guidelines"
    ],
    realWorldAnchor: "Quickly extracting only 'pass' students (marks >= 50) from an entire semester marks list.",
    openingQuestion: "Why write 4 lines of loop-and-append code when Python allows you to express the same idea in one readable sentence?",
    conceptFlow: "Show equivalent for-loop-with-append first → compress it → comprehension syntax.",
    coreSyntax: "pass_list = [m for m in marks if m >= 50]\nsquares = [x**2 for x in range(1, 6)]",
    demoCode: `# Comparing traditional loop vs List Comprehension
all_marks = [35, 88, 42, 95, 76, 49, 91]

# Traditional approach
pass_students_loop = []
for m in all_marks:
    if m >= 50:
        pass_students_loop.append(m)

# List comprehension approach (1 line)
pass_students_comp = [m for m in all_marks if m >= 50]
print("Pass marks (Comprehension):", pass_students_comp)

# Applying bonus marks to everyone
bonus_marks = [m + 5 for m in all_marks]
print("With 5 grace marks:", bonus_marks)`,
    predictQuestion: {
      question: "What does [x * 2 for x in range(4) if x % 2 == 0] produce?",
      options: ["[0, 4]", "[0, 2, 4, 6]", "[2, 4]", "[0, 1, 2, 3]"],
      correctAnswerIndex: 0,
      explanation: "range(4) is [0, 1, 2, 3]. The filter x % 2 == 0 keeps 0 and 2. The expression x * 2 doubles them: 0 * 2 = 0, 2 * 2 = 4 -> [0, 4]."
    },
    debugExercise: {
      buggyCode: `# Student wants to filter pass marks\nmarks = [45, 80, 30, 90]\npassed = [m for m in marks if m = 50]`,
      errorType: "SyntaxError: invalid syntax (used assignment = instead of comparison >= or ==)",
      hint: "The if clause inside a comprehension must be a boolean comparison expression.",
      fix: `marks = [45, 80, 30, 90]\npassed = [m for m in marks if m >= 50]`
    },
    practicalActivity: "Convert a list of student Celsius temperatures to Fahrenheit in a single comprehension line.",
    practice: "Given a list of words, create a new list containing only words longer than 4 characters in uppercase.",
    expectedOutcome: "Students write clean list comprehensions with expressions and filtering conditions.",
    connectsBack: "Combines for loops (Period 10) and lists (Period 14).",
    connectsForward: "Now apply lists and collections to real algorithmic problems — searching and sorting (Period 19).",
    leaveKnowing: "How to write list comprehensions with filters [expr for item in iterable if condition]."
  },
  {
    periodNumber: 19,
    unit: 3,
    unitName: "Lists, Tuples, Dictionaries",
    topic: "Unit III Illustrative Programs: Max of List, Search (Linear/Binary), Sort (Selection/Insertion)",
    phase: 'Concept',
    learningObjective: "Implement fundamental search and sort algorithms on lists as required by the official syllabus.",
    teachingFocus: "Ranking toppers with sorting; comparing linear search vs binary search on sorted data.",
    subtopics: [
      "Find maximum/minimum of a list",
      "Linear search algorithm",
      "Binary search algorithm (iterative)",
      "Selection sort & Insertion sort",
      "Histogram generation"
    ],
    realWorldAnchor: "Ranking toppers in an exam (sorting); finding a student register number quickly in a sorted book.",
    openingQuestion: "If you have 1,000 sorted exam papers, why is opening in the middle (binary search) faster than checking one-by-one?",
    conceptFlow: "INPUT → PROCESS → OUTPUT framing for each algorithm, then live implementation.",
    coreSyntax: "# Binary search midpoint rule\nmid = (low + high) // 2\n# Selection sort minimum swap\nmin_idx = i",
    demoCode: `# 1. Binary Search on a sorted list
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

# 2. Selection Sort
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

sample_marks = [64, 25, 12, 22, 11]
sorted_marks = selection_sort(sample_marks.copy())
print("Sorted marks:", sorted_marks)
pos = binary_search(sorted_marks, 22)
print("Position of 22 in sorted list:", pos)`,
    predictQuestion: {
      question: "How many comparisons does binary search need in the worst case for 16 elements?",
      options: ["16", "4", "8", "2"],
      correctAnswerIndex: 1,
      explanation: "Binary search cuts the search space in half each step: log2(16) = 4 comparisons."
    },
    debugExercise: {
      buggyCode: `def binary_search(arr, x):\n    low, high = 0, len(arr)\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == x: return mid\n        # Bug: index out of range when high == len(arr)`,
      errorType: "IndexError: list index out of range",
      hint: "high must be initialized to len(arr) - 1, not len(arr).",
      fix: `def binary_search(arr, x):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == x: return mid\n        elif arr[mid] < x: low = mid + 1\n        else: high = mid - 1\n    return -1`
    },
    practicalActivity: "Implement insertion sort independently and count the number of comparisons made.",
    practice: "Build a histogram frequency dictionary from a list of student marks in grade bands (0-49, 50-74, 75-100).",
    expectedOutcome: "Students can implement linear/binary search and basic sorting algorithms; Unit III complete.",
    connectsBack: "Consolidates all Unit III list, tuple, and dictionary tools.",
    connectsForward: "Everything so far disappears when the program ends — how do we save data permanently? → files (Unit IV, Period 20).",
    leaveKnowing: "How binary search and selection sort operate and how to find max/histogram."
  },

  // =========================================================================
  // UNIT IV — Files, Modules, Packages (Periods 20–24)
  // =========================================================================
  {
    periodNumber: 20,
    unit: 4,
    unitName: "Files, Modules, Packages",
    topic: "Files: Text Files, Reading/Writing & Format Operator",
    phase: 'Concept',
    learningObjective: "Read and write data permanently to text files using context managers (with open) and formatting operators.",
    teachingFocus: "Persistent disk storage vs volatile RAM; avoiding resource leaks with context managers.",
    subtopics: [
      "File modes ('r', 'w', 'a')",
      "Context manager: with open(...) as f",
      "Reading: .read(), .readline(), .readlines()",
      "String format operators (% and .format() and f-strings)"
    ],
    realWorldAnchor: "Saving today's attendance record permanently to a file so it isn't lost when the computer restarts.",
    openingQuestion: "Where does your list of attendance go after you close the Python terminal? How do we keep it forever?",
    conceptFlow: "'Where did my list go after program ended?' → files persist data permanently to disk.",
    coreSyntax: "with open('attendance.txt', 'w') as f:\n    f.write('Roll 101: Present\\n')\n\nwith open('attendance.txt', 'r') as f:\n    content = f.read()",
    demoCode: `# Writing and Reading student attendance file
filename = "daily_attendance.txt"

# 1. Write attendance records
with open(filename, "w") as f:
    f.write("Roll,Status,Score\\n")
    f.write("%d,%s,%.1f\\n" % (101, "Present", 85.5))
    f.write("%d,%s,%.1f\\n" % (102, "Present", 92.0))

print("Attendance saved to disk successfully.")

# 2. Read back records
print("--- Reading File Content ---")
with open(filename, "r") as f:
    for line in f:
        print("Line:", line.strip())`,
    predictQuestion: {
      question: "What happens if you open a file in 'w' mode when that file already contains text?",
      options: [
        "New text is added to the end",
        "The existing file is completely overwritten and erased",
        "Python throws a FileExistsError",
        "The file becomes read-only"
      ],
      correctAnswerIndex: 1,
      explanation: "'w' mode creates a new file or overwrites an existing file from byte zero. To preserve and add text, use 'a' (append) mode."
    },
    debugExercise: {
      buggyCode: `f = open("data.txt", "w")\nf.write("Hello Python")\n# Forgot f.close()! If program crashes, data is lost in buffer`,
      errorType: "Resource Leak / Data Loss Hazard",
      hint: "Always use the 'with open(...) as f' statement, which automatically flushes and closes files.",
      fix: `with open("data.txt", "w") as f:\n    f.write("Hello Python")`
    },
    practicalActivity: "Write a program that saves a list of 5 student names to students.txt, then reads and numbers them on screen.",
    practice: "Create a program that counts the number of lines, words, and characters in any given text file.",
    expectedOutcome: "Students can read, write, and append to files cleanly using with open().",
    connectsBack: "Takes data structures from Unit III and writes them to persistent storage.",
    connectsForward: "What if the file doesn't exist, or the user enters bad input? → errors & exceptions (Period 21).",
    leaveKnowing: "How to safely read and write persistent files using with open()."
  },
  {
    periodNumber: 21,
    unit: 4,
    unitName: "Files, Modules, Packages",
    topic: "Command-Line Arguments, Errors & Exception Handling",
    phase: 'Concept',
    learningObjective: "Handle runtime exceptions gracefully using try-except blocks and parse CLI arguments with sys.argv.",
    teachingFocus: "Programs should not crash unexpectedly on user error; defensive programming with specific exceptions.",
    subtopics: [
      "Syntax errors vs runtime exceptions",
      "try-except-else-finally blocks",
      "Catching specific exceptions (ValueError, FileNotFoundError, ZeroDivisionError)",
      "sys.argv command line arguments"
    ],
    realWorldAnchor: "ATM rejecting a withdrawal that exceeds balance or invalid input without crashing the machine.",
    openingQuestion: "When you type letters into an ATM that asks for money amount, should the ATM screen freeze blue or show a polite error?",
    conceptFlow: "Show unhandled crash live → 'the program shouldn't just die' → try/except handling.",
    coreSyntax: "import sys\ntry:\n    val = int(input())\nexcept ValueError:\n    print('Invalid integer entered!')\n\n# CLI arguments\nargs = sys.argv",
    demoCode: `import sys

# 1. Handling input errors gracefully
def withdraw(balance, amount_str):
    try:
        amount = float(amount_str)
        if amount <= 0:
            return "Amount must be positive."
        if amount > balance:
            return "Insufficient funds!"
        balance -= amount
        return f"Success! New balance: ₹{balance:.2f}"
    except ValueError:
        return "Error: Please enter a valid numeric amount."

print(withdraw(5000, "1500"))
print(withdraw(5000, "abc")) # Does not crash!

# 2. Demonstrating sys.argv
print("CLI Arguments passed:", sys.argv)`,
    predictQuestion: {
      question: "What is wrong with writing a bare 'except:' without specifying the error type?",
      options: [
        "It is invalid Python syntax",
        "It catches everything, including KeyboardInterrupt (Ctrl+C) and hidden bugs, masking real defects",
        "It runs slower than if-else",
        "Nothing, it is best practice"
      ],
      correctAnswerIndex: 1,
      explanation: "A bare except catches all exceptions including system exit calls and syntax bugs, making debugging extremely difficult. Always catch specific exceptions."
    },
    debugExercise: {
      buggyCode: `total = 100\ncount = int("0")\naverage = total / count # Will crash with ZeroDivisionError`,
      errorType: "ZeroDivisionError: division by zero",
      hint: "Wrap division in a try-except ZeroDivisionError block or check if count == 0.",
      fix: `total = 100\ncount = 0\ntry:\n    average = total / count\nexcept ZeroDivisionError:\n    print("Cannot calculate average: count is zero.")`
    },
    practicalActivity: "Safely open and read a user-specified file name using try-except FileNotFoundError.",
    practice: "Build a safe command-line calculator taking operation and two numbers from sys.argv.",
    expectedOutcome: "Students write resilient programs that handle bad inputs and file errors without crashing.",
    connectsBack: "Protects file operations from Period 20 from crashing when files are missing.",
    connectsForward: "Programs are growing — how do we organize reusable code across multiple files? → modules & packages (Period 22).",
    leaveKnowing: "How to catch specific exceptions with try/except and access sys.argv."
  },
  {
    periodNumber: 22,
    unit: 4,
    unitName: "Files, Modules, Packages",
    topic: "Modules & Packages",
    phase: 'Concept',
    learningObjective: "Modularize code into custom Python modules, create packages with __init__.py, and import standard libraries.",
    teachingFocus: "Code organization: moving shared utility functions into separate files that can be imported across an entire system.",
    subtopics: [
      "Importing standard modules (math, random, datetime)",
      "Creating custom .py modules",
      "The __name__ == '__main__' guard",
      "Python packages and folder structures"
    ],
    realWorldAnchor: "Reusing Python's math/random modules; organizing a college result calculation engine into a shared class_utils.py file.",
    openingQuestion: "When 4 teachers build different parts of the LMS, how do they share code without copying and pasting functions?",
    conceptFlow: "Function reuse inside one file (Unit I) → now reuse across files with import.",
    coreSyntax: "# In utils.py: def calculate_grade(marks): ...\n# In main.py:  import utils\n# or:          from utils import calculate_grade\nif __name__ == '__main__':\n    # Test code only run when file is executed directly",
    demoCode: `import math
import random

# Standard library module usage
print("Square root of 144:", math.sqrt(144))
print("Random roll number chosen:", random.randint(101, 150))

# Modular organization pattern
def sanitize_name(name):
    return name.strip().title()

if __name__ == "__main__":
    # This block executes only when running this file directly
    print("Self-test: sanitize_name ->", sanitize_name("  deva dinesh  "))`,
    predictQuestion: {
      question: "Why do we place test code inside if __name__ == '__main__'?",
      options: [
        "To make the code run faster",
        "So that the test code runs only when the file is run directly, not when imported by another file",
        "It is required by the Python compiler",
        "It prevents syntax errors"
      ],
      correctAnswerIndex: 1,
      explanation: "When a file is imported, its top-level code runs. Checking __name__ == '__main__' ensures demo/test statements do not pollute the importing file."
    },
    debugExercise: {
      buggyCode: `# File named math.py created in project folder\nimport math\nprint(math.sqrt(16)) # Crashes!`,
      errorType: "AttributeError or circular import: local math.py shadows Python's built-in math module",
      hint: "Never name your own script files after standard library modules (like math.py, random.py, test.py).",
      fix: `# Rename file to college_math.py\nimport math\nprint(math.sqrt(16))`
    },
    practicalActivity: "Create a custom student_tools.py module with 2 functions and import it into a main.py script.",
    practice: "Build a dice rolling simulator module with functions for single roll, double roll, and statistics.",
    expectedOutcome: "Students can structure multi-file projects and import custom functions cleanly.",
    connectsBack: "Expands single-file functions from Unit I into multi-file architectures.",
    connectsForward: "We keep passing student data around loosely (name, marks, id) — can we bundle it as one real-world 'thing'? → classes & objects (Period 23).",
    leaveKnowing: "How to create, import, and guard custom modules with __name__ == '__main__'."
  },
  {
    periodNumber: 23,
    unit: 4,
    unitName: "Files, Modules, Packages",
    topic: "Classes & Objects (Introductory)",
    phase: 'Concept',
    learningObjective: "Bundle data attributes and associated behaviors into cohesive Object-Oriented classes using __init__.",
    teachingFocus: "Scattered loose variables (name, roll, marks) vs bundling them into one real-world Student object.",
    subtopics: [
      "Classes as blueprints and Objects as instances",
      "The __init__ constructor method",
      "The self reference parameter",
      "Instance attributes and instance methods"
    ],
    realWorldAnchor: "A 'Student' bundling roll number, name, and marks together instead of three separate scattered variables.",
    openingQuestion: "When a college has 1,000 students, is it easier to manage 3,000 separate variables or 1,000 Student objects?",
    conceptFlow: "Scattered related variables → bundle as one real-world object → class blueprint.",
    coreSyntax: "class Student:\n    def __init__(self, name, marks):\n        self.name = name\n        self.marks = marks\n    def is_pass(self):\n        return self.marks >= 50",
    demoCode: `# Defining a Student blueprint class
class Student:
    def __init__(self, roll_no, name, marks):
        self.roll_no = roll_no
        self.name = name
        self.marks = marks

    def get_result(self):
        return "PASS" if self.marks >= 50 else "RE-APPEAR"

    def display_details(self):
        return f"Roll: {self.roll_no} | {self.name} | Marks: {self.marks} ({self.get_result()})"

# Creating student object instances
s1 = Student(101, "Deva", 88)
s2 = Student(102, "Anu", 45)

print(s1.display_details())
print(s2.display_details())`,
    predictQuestion: {
      question: "What is the purpose of the 'self' parameter in class methods?",
      options: [
        "It refers to the specific instance object calling the method",
        "It creates a global variable",
        "It imports the class from standard library",
        "It is an optional comment"
      ],
      correctAnswerIndex: 0,
      explanation: "self represents the particular instance calling the method, allowing Python to access and update that specific object's attributes."
    },
    debugExercise: {
      buggyCode: `class Student:\n    def __init__(self, name):\n        name = name # Bug: didn't attach to self!\n\ns = Student("Ravi")\nprint(s.name)`,
      errorType: "AttributeError: 'Student' object has no attribute 'name'",
      hint: "Assign attributes to self (self.name = name) so they persist on the object instance.",
      fix: `class Student:\n    def __init__(self, name):\n        self.name = name\n\ns = Student("Ravi")\nprint(s.name)`
    },
    practicalActivity: "Create a BankAccount class with deposit, withdraw, and check_balance methods.",
    practice: "Add a method add_grade_bonus(points) to the Student class and test on multiple student instances.",
    expectedOutcome: "Students can define a class with __init__ and call instance methods on objects.",
    connectsBack: "Brings functions and dictionaries together into object-oriented models.",
    connectsForward: "Apply files + modules + exceptions together in real illustrative programs (Period 24).",
    leaveKnowing: "How to define classes, initialize objects with __init__, and use methods."
  },
  {
    periodNumber: 24,
    unit: 4,
    unitName: "Files, Modules, Packages",
    topic: "Unit IV Illustrative Programs: Word Count, Copy File, CLI Word-Count",
    phase: 'Concept',
    learningObjective: "Implement official syllabus file programs: counting words in a file, copying file contents, and CLI arguments.",
    teachingFocus: "Connecting file streams, string manipulation, and command-line execution into working utilities.",
    subtopics: [
      "Word count from a file",
      "Copying file contents to another file",
      "Command-line argument word-count utility",
      "Input-Process-Output file processing"
    ],
    realWorldAnchor: "Counting words in an assignment submission text file and generating an automated plagiarism word report.",
    openingQuestion: "How does Microsoft Word or Google Docs count the exact number of words and lines in a 50-page document?",
    conceptFlow: "INPUT → PROCESS → OUTPUT for each file program before coding.",
    coreSyntax: "# Word count logic\nwords = content.split()\nword_count = len(words)\n# Copy file logic\nwith open(src, 'r') as f_in, open(dst, 'w') as f_out:\n    f_out.write(f_in.read())",
    demoCode: `# 1. Word count program
sample_text = "Python is powerful and fast.\\nFirst-year students love coding."
with open("sample_doc.txt", "w") as f:
    f.write(sample_text)

# Count words, lines, characters
with open("sample_doc.txt", "r") as f:
    lines = f.readlines()
    num_lines = len(lines)
    num_words = sum(len(line.split()) for line in lines)
    num_chars = sum(len(line) for line in lines)

print(f"File Analysis -> Lines: {num_lines}, Words: {num_words}, Characters: {num_chars}")

# 2. File copy program
with open("sample_doc.txt", "r") as src, open("backup_doc.txt", "w") as dst:
    dst.write(src.read())
print("File successfully duplicated to backup_doc.txt")`,
    predictQuestion: {
      question: "Why does line.split() accurately count words even if there are multiple spaces between words?",
      options: [
        "Because split() with no arguments treats consecutive whitespace as a single delimiter",
        "It only splits by single space",
        "It removes all punctuation automatically",
        "It counts each character"
      ],
      correctAnswerIndex: 0,
      explanation: "Calling .split() with no arguments splits on any whitespace sequence (spaces, tabs, newlines) and discards empty strings."
    },
    debugExercise: {
      buggyCode: `with open("input.txt", "r") as f:\n    words = f.read().split(" ") # Splits strictly on single spaces\n# If double space exists, empty strings '' are counted as words!`,
      errorType: "Logic Error: Inflated word count due to empty string elements",
      hint: "Use f.read().split() without arguments to collapse consecutive spaces.",
      fix: `with open("input.txt", "r") as f:\n    words = f.read().split()\n    print("True word count:", len(words))`
    },
    practicalActivity: "Implement a Python script that copies only non-empty lines from a source file to a destination file.",
    practice: "Build a CLI word frequency counter that accepts a file name via sys.argv and prints the top 3 most common words.",
    expectedOutcome: "Students comfortably write file processing utilities with error safety; Unit IV complete.",
    connectsBack: "Consolidates all Unit IV file, CLI, and exception concepts.",
    connectsForward: "Handling 30 students' marks with plain lists is slow for numerical analysis → NumPy (Unit V, Period 25).",
    leaveKnowing: "How to build file analysis, copy, and CLI utilities in Python."
  },

  // =========================================================================
  // UNIT V — NumPy, Data Frame (Periods 25–30)
  // =========================================================================
  {
    periodNumber: 25,
    unit: 5,
    unitName: "NumPy, Data Frame",
    topic: "NumPy: Array Creation, Shape & Reshape",
    phase: 'Concept',
    learningObjective: "Create high-performance multi-dimensional NumPy arrays and manipulate array shapes with reshape().",
    teachingFocus: "Plain Python lists of lists cannot do fast bulk mathematics; NumPy arrays store homogeneous data for vector operations.",
    subtopics: [
      "Introduction to NumPy and ndarray",
      "Creating 1D and 2D arrays with np.array()",
      "Array attributes: .shape, .ndim, .dtype",
      "Reshaping arrays with .reshape()"
    ],
    realWorldAnchor: "30 students' marks across 5 subjects stored as one fast 2D numerical grid (30 x 5).",
    openingQuestion: "If you have 10,000 sensor numbers, why does NumPy compute their average 50 times faster than a Python for loop?",
    conceptFlow: "'Plain lists cannot do fast bulk math' → introduce contiguous memory ndarrays.",
    coreSyntax: "import numpy as np\narr = np.array([1, 2, 3, 4, 5, 6])\nmatrix = arr.reshape(2, 3) # 2 rows, 3 columns\nprint(matrix.shape)",
    demoCode: `import numpy as np

# Creating 1D array of marks
marks = np.array([75, 82, 90, 68, 94, 88])
print("1D Array:", marks)
print("Shape:", marks.shape, "| Data Type:", marks.dtype)

# Reshaping 6 marks into a 2x3 matrix (2 students, 3 subjects)
matrix_marks = marks.reshape(2, 3)
print("--- 2x3 Reshaped Marks Grid ---")
print(matrix_marks)
print("New Shape:", matrix_marks.shape)`,
    predictQuestion: {
      question: "Can an array of 10 elements be reshaped into shape (3, 4)?",
      options: [
        "Yes, NumPy pads the missing 2 elements with zeros",
        "No, ValueError: cannot reshape array of size 10 into shape (3, 4)",
        "Yes, it truncates the array",
        "It converts into a 1D array"
      ],
      correctAnswerIndex: 1,
      explanation: "The total number of elements must remain identical: 3 * 4 = 12 elements, but the array only has 10 elements, so NumPy raises a ValueError."
    },
    debugExercise: {
      buggyCode: `import numpy as np\narr = np.array([1, 2, 3, 4, 5])\nmatrix = arr.reshape(2, 3)`,
      errorType: "ValueError: cannot reshape array of size 5 into shape (2, 3)",
      hint: "2 * 3 = 6 elements required, but the input array only has 5. Dimensions must match element count.",
      fix: `import numpy as np\narr = np.array([1, 2, 3, 4, 5, 6])\nmatrix = arr.reshape(2, 3)`
    },
    practicalActivity: "Create a 1D NumPy array of 12 numbers and reshape it into (3, 4) and (4, 3) grids.",
    practice: "Generate a 5x5 identity matrix using np.eye() and inspect its shape and dtype.",
    expectedOutcome: "Students can create NumPy arrays and perform dimension reshaping without dimension mismatches.",
    connectsBack: "Transitions from plain Python lists (Unit III) to high-speed numerical arrays.",
    connectsForward: "How do we pull out one subject's column or one student's row? → indexing & slicing (Period 26).",
    leaveKnowing: "How to initialize NumPy arrays and reshape them with .reshape()."
  },
  {
    periodNumber: 26,
    unit: 5,
    unitName: "NumPy, Data Frame",
    topic: "NumPy: Indexing & Slicing",
    phase: 'Concept',
    learningObjective: "Extract rows, columns, sub-matrices, and apply boolean filtering on NumPy arrays.",
    teachingFocus: "Extracting specific subsets (e.g. all marks for Subject 2, or students scoring > 90) in single-expression syntax.",
    subtopics: [
      "2D array indexing: arr[row, col]",
      "2D array slicing: arr[row_start:row_stop, col_start:col_stop]",
      "Selecting entire columns (arr[:, col_idx])",
      "Boolean mask filtering (arr[arr > 80])"
    ],
    realWorldAnchor: "Extracting the top scorer's entire row, or isolating one subject's exam column across all 50 students.",
    openingQuestion: "How do you select only column #2 (e.g. Physics marks) for all 50 students in a single line of code?",
    conceptFlow: "Single index → 2D row/col coordinate → slice ranges → boolean mask filtering.",
    coreSyntax: "matrix[0, :]        # First row (all columns)\nmatrix[:, 2]        # Third column (all rows)\nmatrix[matrix > 90] # Boolean filter for toppers",
    demoCode: `import numpy as np

# 4 students (rows) across 3 subjects: Maths, Physics, CS (columns)
marks_table = np.array([
    [85, 78, 92],  # Student 0
    [90, 88, 95],  # Student 1
    [65, 70, 72],  # Student 2
    [98, 94, 99]   # Student 3
])

# Extract all students' CS marks (column index 2)
cs_marks = marks_table[:, 2]
print("CS Marks for all students:", cs_marks)

# Extract Student 1's full scorecard (row index 1)
student_1 = marks_table[1, :]
print("Student 1 full scores:", student_1)

# Boolean filtering: scores >= 90
toppers = marks_table[marks_table >= 90]
print("All individual marks >= 90:", toppers)`,
    predictQuestion: {
      question: "What does marks_table[1:3, 0:2] return?",
      options: [
        "Rows 1 and 2, Columns 0 and 1 (a 2x2 sub-matrix)",
        "Rows 1, 2, and 3, Columns 0, 1, and 2 (a 3x3 matrix)",
        "Row 1 Column 3 and Row 0 Column 2",
        "A 1D array"
      ],
      correctAnswerIndex: 0,
      explanation: "Slice ranges are upper-bound exclusive. Rows 1:3 selects rows 1 and 2; columns 0:2 selects columns 0 and 1, producing a 2x2 sub-matrix."
    },
    debugExercise: {
      buggyCode: `import numpy as np\narr = np.array([[10, 20], [30, 40]])\n# Trying to get column 1 using list syntax\ncol = arr[:][1] # Wrong! In NumPy this returns row 1!`,
      errorType: "Logic Pitfall: Chained slicing arr[:][1] does not select column 1 in NumPy",
      hint: "Use 2D comma indexing arr[:, 1] to select column 1 across all rows.",
      fix: `col = arr[:, 1] # Correct column 1 slice [20, 40]`
    },
    practicalActivity: "Extract Subject 3 marks for all students from a 5x4 marks matrix and compute the subject mean.",
    practice: "Use boolean filtering to find all students whose total score across 3 subjects exceeds 250.",
    expectedOutcome: "Students slice 2D NumPy matrices by row and column and filter with boolean masks.",
    connectsBack: "Builds on NumPy array creation from Period 25.",
    connectsForward: "Now that we can select data — how do we perform bulk mathematical and matrix calculations? → Period 27.",
    leaveKnowing: "How to slice 2D arrays with arr[rows, cols] and filter with boolean masks."
  },
  {
    periodNumber: 27,
    unit: 5,
    unitName: "NumPy, Data Frame",
    topic: "NumPy: Arithmetic Operations & Matrix Multiplication/Inverse",
    phase: 'Concept',
    learningObjective: "Perform vectorized arithmetic, dot products, and matrix inversion using np.dot and np.linalg.inv.",
    teachingFocus: "Contrasting element-wise multiplication (*) with linear algebra matrix multiplication (np.dot / @).",
    subtopics: [
      "Vectorized arithmetic (+, -, *, /)",
      "Broadcasting scalars across arrays",
      "Matrix multiplication: np.dot(A, B) and A @ B",
      "Matrix inverse: np.linalg.inv() (illustrative program)"
    ],
    realWorldAnchor: "Giving every student a 5% bonus instantly across an entire array; verifying matrix inverse A * A^-1 = I.",
    openingQuestion: "How do you give every student in the college a 5% marks bonus without writing a single loop?",
    conceptFlow: "Scalar broadcasting (marks * 1.05) → element-wise operations → matrix multiplication (dot) → matrix inverse.",
    coreSyntax: "scaled = marks * 1.05       # Vectorized bonus\nC = np.dot(A, B)            # Matrix multiplication\ninv_A = np.linalg.inv(A)    # Matrix inverse (illustrative)",
    demoCode: `import numpy as np

# 1. Vectorized scaling: 5% bonus marks
raw_marks = np.array([80.0, 90.0, 75.0, 60.0])
bonus_marks = raw_marks * 1.05
print("With 5% bonus:", bonus_marks)

# 2. Matrix multiplication (dot product)
A = np.array([[1, 2], [3, 4]])
B = np.array([[2, 0], [1, 2]])
C = np.dot(A, B)
print("Matrix Product A @ B:\\n", C)

# 3. Matrix inverse and verification (official illustrative program)
inv_A = np.linalg.inv(A)
identity_check = np.dot(A, inv_A)
print("Inverse of A:\\n", inv_A)
print("Verification (A @ A^-1 ~= Identity):\\n", np.round(identity_check))`,
    predictQuestion: {
      question: "What does A * B do in NumPy when A and B are 2x2 matrices?",
      options: [
        "Linear algebra matrix multiplication (row x column)",
        "Element-wise multiplication (A[i,j] * B[i,j])",
        "Matrix transpose",
        "Calculates the determinant"
      ],
      correctAnswerIndex: 1,
      explanation: "* in NumPy is element-wise multiplication. For linear algebra matrix multiplication, use np.dot(A, B) or the @ operator."
    },
    debugExercise: {
      buggyCode: `import numpy as np\nA = np.array([[1, 2, 3], [4, 5, 6]]) # Shape (2, 3)\nB = np.array([[1, 2], [3, 4]])        # Shape (2, 2)\nC = np.dot(A, B)`,
      errorType: "ValueError: shapes (2,3) and (2,2) not aligned: 3 (dim 1) != 2 (dim 0)",
      hint: "For matrix multiplication, inner dimensions must match: (m, k) @ (k, n). Transpose or check matrix dimensions.",
      fix: `import numpy as np\nA = np.array([[1, 2, 3], [4, 5, 6]]) # Shape (2, 3)\nB = np.array([[1, 2], [3, 4], [5, 6]]) # Shape (3, 2)\nC = np.dot(A, B) # Produces (2, 2)`
    },
    practicalActivity: "Multiply two 2x2 matrices and verify that multiplying a matrix by its inverse produces the identity matrix.",
    practice: "Compute the column-wise mean and standard deviation of a 4x4 matrix using np.mean(axis=0) and np.std(axis=0).",
    expectedOutcome: "Students perform vector arithmetic and compute matrix inverses with NumPy.",
    connectsBack: "Extends 2D array manipulation from Periods 25–26.",
    connectsForward: "Numbers alone aren't enough — real student records have names, IDs, and mixed types → Pandas (Period 28).",
    leaveKnowing: "How to do element-wise operations, matrix multiplication with np.dot, and matrix inversion."
  },
  {
    periodNumber: 28,
    unit: 5,
    unitName: "NumPy, Data Frame",
    topic: "Pandas: Series, DataFrame, Selection & Indexing",
    phase: 'Concept',
    learningObjective: "Structure tabular data with Pandas Series and DataFrames and access records using .loc and .iloc.",
    teachingFocus: "The student-records system becomes a real spreadsheet with column headers, row labels, and mixed types.",
    subtopics: [
      "Pandas Series (1D labeled array)",
      "Pandas DataFrame (2D labeled tabular grid)",
      "Label-based indexing with .loc",
      "Position-based indexing with .iloc"
    ],
    realWorldAnchor: "The student database represented as a real Excel-like spreadsheet table with Register No, Name, and Marks.",
    openingQuestion: "Why is a spreadsheet easier to read than a raw matrix of numbers? What does labeling columns give us?",
    conceptFlow: "Raw numbers (NumPy) → add column names and row labels → Pandas Series and DataFrame.",
    coreSyntax: "import pandas as pd\ndf = pd.DataFrame(data_dict)\ndf.loc[0, 'Name']  # Label-based\ndf.iloc[0, 1]      # Integer position-based",
    demoCode: `import pandas as pd

# Creating a student database DataFrame
data = {
    "Register_No": ["26009479", "26016734", "26018966"],
    "Name": ["Aadhil", "Balaji", "Harish"],
    "Python_Marks": [88, 92, 79],
    "Attendance_Pct": [94.0, 98.5, 88.0]
}

df = pd.DataFrame(data)
print("--- Student DataFrame ---")
print(df)

# Accessing columns
print("\\nNames column:\\n", df["Name"])

# Accessing rows: .iloc[0] (first row) vs .loc
print("\\nFirst Student Record (iloc[0]):\\n", df.iloc[0])`,
    predictQuestion: {
      question: "What is the key difference between df.loc[2] and df.iloc[2]?",
      options: [
        ".loc selects by index label; .iloc selects by integer position (0-based)",
        ".loc is for columns; .iloc is for rows",
        "They are completely identical in all situations",
        ".iloc works only for text data"
      ],
      correctAnswerIndex: 0,
      explanation: ".loc looks for the row whose index label is 2 (which could be a custom ID). .iloc looks at the physical 3rd row (index 2 in 0-based counting)."
    },
    debugExercise: {
      buggyCode: `import pandas as pd\ndf = pd.DataFrame({"A": [1, 2], "B": [3, 4]})\n# Accessing column with dot notation when column name has spaces\n# e.g. df.Student Name -> SyntaxError!`,
      errorType: "SyntaxError or KeyError when column names have spaces or match reserved words",
      hint: "Always prefer bracket notation df['Column Name'] for robust column access.",
      fix: `import pandas as pd\ndf = pd.DataFrame({"Student Name": ["Deva", "Anu"]})\nprint(df["Student Name"])`
    },
    practicalActivity: "Build a 5-student DataFrame with Roll, Name, Marks, and City; select rows where Marks > 80.",
    practice: "Add a new calculated column 'Result' to a DataFrame that labels 'PASS' if Marks >= 50 else 'FAIL'.",
    expectedOutcome: "Students can construct DataFrames and retrieve columns and rows with .loc/.iloc.",
    connectsBack: "Evolves NumPy arrays (Periods 25–27) into tabular datasets with named fields.",
    connectsForward: "Real data is messy — missing values, separate sheets to combine → Pandas cleaning (Period 29).",
    leaveKnowing: "How to create Pandas DataFrames and query records using .loc and .iloc."
  },
  {
    periodNumber: 29,
    unit: 5,
    unitName: "NumPy, Data Frame",
    topic: "Pandas: Missing Data, Merge/Join, Groupby & Apply",
    phase: 'Concept',
    learningObjective: "Clean missing values, combine DataFrames with pd.merge, and compute group statistics with groupby and apply.",
    teachingFocus: "Handling messy real-world datasets: missing marks, combining attendance + marks sheets, section-wise averages.",
    subtopics: [
      "Detecting and handling missing data (.isna(), .dropna(), .fillna())",
      "Merging DataFrames on keys with pd.merge()",
      "Group operations with .groupby()",
      "Applying custom functions with .apply()"
    ],
    realWorldAnchor: "Combining the exam marks sheet and the attendance sheet by roll number; handling absent students with missing marks.",
    openingQuestion: "If a student was absent for an exam, how do we handle the missing blank cell without crashing our class average calculation?",
    conceptFlow: "Dirty data with NaNs → clean with fillna() → combine multiple tables with merge() → aggregate with groupby().",
    coreSyntax: "df.fillna(0)                             # Replace NaN with 0\nmerged = pd.merge(df1, df2, on='Roll_No') # Combine tables\ndf.groupby('Class')['Marks'].mean()      # Group aggregation",
    demoCode: `import pandas as pd
import numpy as np

# 1. Marks sheet with a missing score (NaN)
marks_df = pd.DataFrame({
    "Roll": [101, 102, 103],
    "Class": ["C1", "C1", "C2"],
    "Marks": [85.0, np.nan, 90.0]
})

print("Original with NaN:\\n", marks_df)
# Clean missing values: replace NaN with 0
clean_df = marks_df.fillna({"Marks": 0})
print("\\nAfter fillna(0):\\n", clean_df)

# 2. Groupby class mean
class_avg = clean_df.groupby("Class")["Marks"].mean()
print("\\nAverage marks by class:\\n", class_avg)

# 3. Custom apply function: Add grade band
clean_df["Grade"] = clean_df["Marks"].apply(lambda m: "PASS" if m >= 50 else "FAIL")
print("\\nWith Grade column:\\n", clean_df)`,
    predictQuestion: {
      question: "What happens if you merge two DataFrames on 'Roll' and student 105 only exists in one of the tables in an inner merge?",
      options: [
        "Student 105 is kept with NaN for missing columns",
        "Student 105 is dropped from the result because inner join requires keys to exist in both tables",
        "Python raises a MergeKeyError",
        "The merge fails"
      ],
      correctAnswerIndex: 1,
      explanation: "A default pd.merge() performs an 'inner' join. Rows whose keys do not match in both DataFrames are dropped. Use how='left' or how='outer' to retain them."
    },
    debugExercise: {
      buggyCode: `import pandas as pd\ndf1 = pd.DataFrame({"ID": [1, 2], "Marks": [80, 90]})\ndf2 = pd.DataFrame({"Roll": [1, 2], "Attendance": [95, 98]})\nmerged = pd.merge(df1, df2, on="ID") # Bug: df2 does not have column 'ID'!`,
      errorType: "KeyError: 'ID'",
      hint: "When column names differ between tables, specify left_on='ID' and right_on='Roll'.",
      fix: `merged = pd.merge(df1, df2, left_on="ID", right_on="Roll")`
    },
    practicalActivity: "Merge a student details table and a marks table on Roll number and fill missing marks with 0.",
    practice: "Compute the highest and average marks per department using df.groupby('Dept')['Marks'].agg(['max', 'mean']).",
    expectedOutcome: "Students handle missing values, merge tables, and run groupby summaries.",
    connectsBack: "Deepens DataFrame operations from Period 28.",
    connectsForward: "We need to rank students and permanently save our combined dataset to disk → CSV I/O (Period 30).",
    leaveKnowing: "How to clean missing data with fillna, combine tables with merge, and aggregate with groupby."
  },
  {
    periodNumber: 30,
    unit: 5,
    unitName: "NumPy, Data Frame",
    topic: "Pandas: Sorting, CSV Read/Write & 30-Period Syllabus Checkpoint",
    phase: 'Concept',
    learningObjective: "Read and export real CSV datasets with Pandas, rank records with .sort_values(), and review the complete conceptual syllabus.",
    teachingFocus: "Reading a real CSV of student results and ranking by total marks (official illustrative program); comprehensive Unit I–V checkpoint recap.",
    subtopics: [
      "Reading CSV files with pd.read_csv()",
      "Sorting DataFrames with .sort_values()",
      "Exporting clean results with df.to_csv()",
      "Comprehensive syllabus completion recap (Units I - V)"
    ],
    realWorldAnchor: "Reading an official CSV exam results sheet, sorting students by total rank, and exporting the topper list.",
    openingQuestion: "How do universities process 10,000 entrance exam CSV files and generate the official merit list in seconds?",
    conceptFlow: "Load real CSV file → clean data → sort by rank → write out official results CSV.",
    coreSyntax: "df = pd.read_csv('students.csv')\nranked = df.sort_values(by='Marks', ascending=False)\nranked.to_csv('ranked_results.csv', index=False)",
    demoCode: `import pandas as pd

# 1. Create and save a sample CSV results file
raw_csv = """Register_No,Name,Total_Marks
26009479,Aadhil,445
26016734,Balaji,482
26018966,Harish,390
26021105,Divya,468"""

with open("results.csv", "w") as f:
    f.write(raw_csv.strip())

# 2. Read, process, and rank (official illustrative program)
df = pd.read_csv("results.csv")
ranked_df = df.sort_values(by="Total_Marks", ascending=False)
ranked_df["Rank"] = range(1, len(ranked_df) + 1)

print("--- Official Ranked Merit List ---")
print(ranked_df)

# 3. Export to final CSV
ranked_df.to_csv("final_ranked_merit_list.csv", index=False)
print("\\nExported to final_ranked_merit_list.csv successfully.")`,
    predictQuestion: {
      question: "Why should we specify index=False when calling df.to_csv('filename.csv', index=False)?",
      options: [
        "To prevent Pandas from writing an unnamed column containing row index numbers 0, 1, 2...",
        "It makes the CSV read-only",
        "It reverses the rows",
        "It compresses the file"
      ],
      correctAnswerIndex: 0,
      explanation: "Without index=False, Pandas writes the DataFrame's numeric index as the first column, which clutters the exported CSV."
    },
    debugExercise: {
      buggyCode: `import pandas as pd\ndf = pd.DataFrame({"Name": ["A", "B"], "Score": [90, 80]})\nranked = df.sort_values(by="score") # Column name is capital 'Score'`,
      errorType: "KeyError: 'score'",
      hint: "Pandas column names are case-sensitive. Verify exact column casing.",
      fix: `ranked = df.sort_values(by="Score", ascending=False)`
    },
    practicalActivity: "Read results.csv, calculate student percentage, sort descending, and export final_rank.csv.",
    practice: "Review the 5-unit syllabus checkpoint checklist and summarize key strengths in each domain.",
    expectedOutcome: "Students can read, process, rank, and export CSV tabular data; ENTIRE CONCEPTUAL SYLLABUS COMPLETE.",
    connectsBack: "Caps off Unit V and integrates file I/O from Unit IV.",
    connectsForward: "Every conceptual topic is now complete. From Period 31, focus shifts 100% to hands-on coding and debugging!",
    leaveKnowing: "How to read, rank, and export CSV data with Pandas, and confident across all 5 conceptual syllabus units."
  },

  // =========================================================================
  // PERIODS 31–45 — PRACTICAL EXECUTION PLAN (Stages 1–7)
  // =========================================================================
  
  // Stage 1 — Guided Coding (Periods 31–32)
  {
    periodNumber: 31,
    unit: 1,
    unitName: "Practical Execution",
    topic: "Stage 1 (Guided Coding): Single-Student Report Card Generator",
    phase: 'Practical',
    stage: "Stage 1 — Guided Coding",
    teacherRole: "Demonstrates line-by-line; pauses before each code block for prediction.",
    studentRole: "Follow, replicate on own machines, predict output before each run.",
    learningObjective: "Integrate Units I and II to construct a formatted single-student terminal report card from inputs.",
    teachingFocus: "Reinforce variables, data types, if-elif grade slabs, and formatted output. Teacher types, students replicate.",
    subtopics: [
      "Input gathering and type conversion",
      "Multi-subject marks validation",
      "Grade determination using if-elif-else",
      "ASCII-formatted report card output"
    ],
    realWorldAnchor: "Generating an official printed semester report card for one student from entered subject marks.",
    openingQuestion: "How do we take 5 raw numbers from the keyboard and turn them into an elegant, formatted college grade sheet?",
    conceptFlow: "Input marks → validate scores (0-100) → compute total & percentage → assign letter grade → print clean ASCII card.",
    coreSyntax: "name = input('Name: ')\ntotal = sum(marks)\npct = total / len(marks)\ngrade = compute_grade(pct)",
    demoCode: `# Guided Coding: Single-Student Report Card Generator
def generate_report_card(name, roll_no, marks_dict):
    total = sum(marks_dict.values())
    percentage = total / len(marks_dict)
    
    if percentage >= 90:   grade = "A+"
    elif percentage >= 80: grade = "A"
    elif percentage >= 70: grade = "B"
    elif percentage >= 50: grade = "Pass"
    else:                  grade = "Fail"
    
    print("=" * 45)
    print(f"      COLLEGE ACADEMIC REPORT CARD")
    print("=" * 45)
    print(f"Student Name: {name:<20} Roll: {roll_no}")
    print("-" * 45)
    for subj, score in marks_dict.items():
        print(f"  {subj:<25} : {score:>3} / 100")
    print("-" * 45)
    print(f"Total: {total:>3} | Percentage: {percentage:.1f}% | Grade: {grade}")
    print("=" * 45)

sample_scores = {"Python": 92, "Data Structures": 85, "Mathematics": 88}
generate_report_card("Aadhil", "26009479", sample_scores)`,
    practicalActivity: "Code along with the instructor, then modify the script to add a Pass/Fail status per individual subject.",
    practice: "Add a GPA calculation formula where each subject is weighted by credits (e.g., Python: 4 credits, Maths: 3 credits).",
    expectedOutcome: "Students can construct a full console report generator integrating input, calculation, and formatting.",
    expectedAbility: "Applies Unit I–II concepts seamlessly to build clean console tools."
  },
  {
    periodNumber: 32,
    unit: 2,
    unitName: "Practical Execution",
    topic: "Stage 1 (Guided Coding): Class-Average & Grade Distribution Tool",
    phase: 'Practical',
    stage: "Stage 1 — Guided Coding",
    teacherRole: "Demonstrates batch processing architecture; guides students through data structuring.",
    studentRole: "Code along, predict batch aggregations, trace loop counters.",
    learningObjective: "Extend single-student logic to a whole class using lists of dictionaries and compute grade distributions.",
    teachingFocus: "Transition from one record to batch processing: loop over class records, compute mean and frequency counts.",
    subtopics: [
      "List of student dictionaries",
      "Accumulator loop for class metrics",
      "Grade frequency distribution dictionary",
      "Identifying class topper and students needing support"
    ],
    realWorldAnchor: "Processing semester marks for an entire section to find the class average, topper, and grade distribution.",
    openingQuestion: "How do you scale a single report card script to process 50 students and summarize class performance?",
    conceptFlow: "Class list of student records → loop through each → aggregate scores → tally grade counts → print summary dashboard.",
    coreSyntax: "for s in student_list:\n    total_marks += s['total']\n    grade_dist[grade] = grade_dist.get(grade, 0) + 1",
    demoCode: `# Class-Average & Grade Distribution Tool
class_records = [
    {"roll": 101, "name": "Aadhil", "marks": 92},
    {"roll": 102, "name": "Balaji", "marks": 85},
    {"roll": 103, "name": "Harish", "marks": 68},
    {"roll": 104, "name": "Divya",  "marks": 95},
    {"roll": 105, "name": "Ezhil",  "marks": 45}
]

total_class_marks = 0
distribution = {"A": 0, "B": 0, "Pass": 0, "Fail": 0}
topper = class_records[0]

for s in class_records:
    m = s["marks"]
    total_class_marks += m
    if m > topper["marks"]:
        topper = s
    if m >= 90:   distribution["A"] += 1
    elif m >= 75: distribution["B"] += 1
    elif m >= 50: distribution["Pass"] += 1
    else:         distribution["Fail"] += 1

avg_marks = total_class_marks / len(class_records)
print(f"Class Size: {len(class_records)} | Average Marks: {avg_marks:.1f}")
print(f"Class Topper: {topper['name']} with {topper['marks']} marks")
print("Grade Distribution:", distribution)`,
    practicalActivity: "Implement the distribution aggregator and plot a text-based ASCII bar chart for each grade band.",
    practice: "Add a feature to list all students whose marks are below the class average for remedial coaching.",
    expectedOutcome: "Students can loop over structured student records and compute aggregated analytics.",
    expectedAbility: "Mastery over lists of dictionaries, loop accumulators, and class-level summary metrics."
  },

  // Stage 2 — Partially Guided Coding (Periods 33–34)
  {
    periodNumber: 33,
    unit: 3,
    unitName: "Practical Execution",
    topic: "Stage 2 (Partially Guided): Multi-Day Attendance Tracker",
    phase: 'Practical',
    stage: "Stage 2 — Partially Guided",
    teacherRole: "Provides problem constraints and required data structures; lets students design code.",
    studentRole: "Design dictionary structures, write weekly attendance calculation logic.",
    learningObjective: "Store weekly attendance as a dictionary of boolean lists and compute attendance percentage per student.",
    teachingFocus: "Teacher gives required concepts (dict of lists, loops); students structure the implementation.",
    subtopics: [
      "Dictionary of lists: {student_id: [P, P, A, P, P]}",
      "Calculating percentage: (present_count / total_days) * 100",
      "Flagging students with attendance < 75%",
      "Interactive daily mark entry"
    ],
    realWorldAnchor: "Marking daily present/absent for N students across a 5-day week and detecting shortage of attendance.",
    openingQuestion: "How does the college ERP track attendance across Mon-Fri and automatically flag anyone below 75%?",
    conceptFlow: "Dict mapping roll -> list of 5 days → count 'P's → calculate percentage → report eligibility for semester exams.",
    coreSyntax: "attendance = {'101': ['P', 'P', 'A', 'P', 'P']}\npresent_days = attendance['101'].count('P')\npct = (present_days / len(attendance['101'])) * 100",
    demoCode: `# Attendance Tracker (Dictionary of Lists)
weekly_attendance = {
    "26009479": ["P", "P", "P", "P", "P"], # Aadhil
    "26016734": ["P", "A", "P", "P", "A"], # Balaji
    "26018966": ["P", "P", "A", "P", "P"]  # Harish
}

print("--- WEEKLY ATTENDANCE AUDIT ---")
for reg, days in weekly_attendance.items():
    present_count = days.count("P")
    total_days = len(days)
    pct = (present_count / total_days) * 100
    status = "ELIGIBLE" if pct >= 75 else "SHORTAGE WARNING"
    print(f"Reg: {reg} | Present: {present_count}/{total_days} ({pct:5.1f}%) | {status}")`,
    practicalActivity: "Implement an interactive loop allowing the user to mark attendance for today and update the list.",
    practice: "Add a method to export all students with attendance below 75% to a detention_list.txt file.",
    expectedOutcome: "Students independently structure dictionary-of-lists solutions for tracking repetitive state.",
    expectedAbility: "Designs multi-level data collections and executes nested counting logic."
  },
  {
    periodNumber: 34,
    unit: 3,
    unitName: "Practical Execution",
    topic: "Stage 2 (Partially Guided): Expense & Shopping Cart Tracker",
    phase: 'Practical',
    stage: "Stage 2 — Partially Guided",
    teacherRole: "Circulates around lab, prompts with edge-case questions, assists debugging.",
    studentRole: "Builds cart logic independently, manages item additions and discount calculations.",
    learningObjective: "Develop a shopping cart system calculating subtotal, discounts, taxes, and itemized invoice output.",
    teachingFocus: "Named concepts (list of dicts, functions, discount rules); students build the solution.",
    subtopics: [
      "Item catalog: list of dicts with price and quantity",
      "Dynamic item addition and removal",
      "Conditional discount tiers (e.g. 10% off above ₹1000)",
      "Itemized receipt printing"
    ],
    realWorldAnchor: "E-commerce or college bookstore cart: adding books, calculating GST, applying student discount coupons.",
    openingQuestion: "How do shopping apps calculate cart totals with different GST rates and promo code discounts?",
    conceptFlow: "Cart list of items → add item (name, price, qty) → compute line totals → apply discount rule → print receipt.",
    coreSyntax: "item_total = item['price'] * item['qty']\nsubtotal += item_total\nif subtotal > 1000: discount = subtotal * 0.10",
    demoCode: `# Shopping Cart / Expense Tracker
cart = []

def add_item(name, price, qty):
    cart.append({"name": name, "price": price, "qty": qty})

def checkout(discount_code=""):
    subtotal = sum(item["price"] * item["qty"] for item in cart)
    discount = subtotal * 0.10 if discount_code == "STUDENT10" else 0.0
    tax = (subtotal - discount) * 0.05
    final_bill = (subtotal - discount) + tax
    
    print("--- INVOICE ---")
    for item in cart:
        line_total = item["price"] * item["qty"]
        print(f"  {item['name']:<15} x {item['qty']} @ ₹{item['price']} = ₹{line_total}")
    print(f"Subtotal: ₹{subtotal:.2f} | Discount: ₹{discount:.2f} | Tax (5%): ₹{tax:.2f}")
    print(f"Total Payable: ₹{final_bill:.2f}")

add_item("Python Textbook", 450, 1)
add_item("Notebooks", 60, 4)
checkout("STUDENT10")`,
    practicalActivity: "Implement an item removal function and validate that user quantity cannot be negative or zero.",
    practice: "Add persistent cart saving so items remain in cart.json between program runs.",
    expectedOutcome: "Students can model commercial transactions using lists of dictionaries and validation logic.",
    expectedAbility: "Translates business requirements into robust procedural algorithms."
  },

  // Stage 3 — Independent Problem Solving (Periods 35–36)
  {
    periodNumber: 35,
    unit: 2,
    unitName: "Practical Execution",
    topic: "Stage 3 (Independent): Number-Guessing & Quiz Game",
    phase: 'Practical',
    stage: "Stage 3 — Independent",
    teacherRole: "Gives problem statement and constraints only; does not provide concept hints.",
    studentRole: "Designs and codes the game architecture completely independently.",
    learningObjective: "Implement an interactive game loop with state management, score tracking, and limited attempts.",
    teachingFocus: "Problem statement and constraints only: random target, max 5 attempts, 'Too high'/'Too low' hints, score tally.",
    subtopics: [
      "Random number generation with random.randint()",
      "Interactive game loop with attempt limiting",
      "Feedback logic: Too High / Too Low / Correct",
      "Score multiplier based on remaining attempts"
    ],
    realWorldAnchor: "Interactive terminal quiz and guessing game with lives counter and final score multiplier.",
    openingQuestion: "How do you design a game where the computer secretly picks a number and gives intelligent clues without leaking the answer?",
    conceptFlow: "Secret target → while attempts_left > 0 → get guess → compare & hint → score calculation.",
    coreSyntax: "secret = random.randint(1, 100)\nwhile attempts > 0:\n    # compare and decrement attempts",
    demoCode: `import random

def play_guessing_game():
    target = random.randint(1, 50)
    attempts_left = 5
    score = 0
    print("Welcome! Guess the secret number between 1 and 50.")
    
    # Simulated runs
    guesses = [25, 40, 32, target]
    for guess in guesses:
        attempts_left -= 1
        print(f"User guessed: {guess}")
        if guess == target:
            score = attempts_left * 20 + 20
            print(f"CORRECT! You won with a score of {score} points!")
            return
        elif guess < target:
            print("Hint: Too LOW!")
        else:
            print("Hint: Too HIGH!")
    print(f"Game Over! The number was {target}.")

play_guessing_game()`,
    practicalActivity: "Build the complete interactive game with replay option ('Do you want to play again? Y/N').",
    practice: "Extend into a 5-question Python technical quiz game where questions and answers are stored in a dictionary.",
    expectedOutcome: "Students can design and implement interactive loop-driven applications unaided.",
    expectedAbility: "Autonomous algorithmic problem-solving with minimal guidance."
  },
  {
    periodNumber: 36,
    unit: 3,
    unitName: "Practical Execution",
    topic: "Stage 3 (Independent): Library & Inventory Lookup System",
    phase: 'Practical',
    stage: "Stage 3 — Independent",
    teacherRole: "Observes student design choices; evaluates modularity and code clarity.",
    studentRole: "Architects dictionary schema and builds menu-driven CRUD interface alone.",
    learningObjective: "Build a complete CRUD (Create, Read, Update, Delete) inventory/library lookup system using dictionaries.",
    teachingFocus: "Independent implementation of book lookup, issuance status, adding new titles, and inventory counts.",
    subtopics: [
      "Nested dictionary inventory schema",
      "Search by book ID or author",
      "Issuing and returning books (updating status)",
      "Console menu loop (1. Add, 2. Search, 3. Issue, 4. Exit)"
    ],
    realWorldAnchor: "College library management kiosk: checking book availability, issuing to roll numbers, updating copies.",
    openingQuestion: "How does a library software keep track of which books are available on the shelf and which are borrowed?",
    conceptFlow: "Menu loop → choice 1: add book → choice 2: search title → choice 3: issue book → choice 4: exit.",
    coreSyntax: "library[book_id] = {'title': ..., 'author': ..., 'available': True}",
    demoCode: `# Library Inventory Lookup System
library = {
    "B101": {"title": "Python Programming", "author": "Guido", "available": True},
    "B102": {"title": "Data Structures", "author": "Mark", "available": False},
    "B103": {"title": "Machine Learning", "author": "Andrew", "available": True}
}

def issue_book(book_id, student_roll):
    if book_id not in library:
        return "Book ID not found."
    if not library[book_id]["available"]:
        return "Sorry, book is currently issued to another student."
    library[book_id]["available"] = False
    library[book_id]["borrower"] = student_roll
    return f"Success: '{library[book_id]['title']}' issued to {student_roll}."

print(issue_book("B101", "26009479"))
print(issue_book("B102", "26016734")) # Already issued`,
    practicalActivity: "Implement book return and book search by author keyword.",
    practice: "Add an automatic overdue fine calculator (₹2/day for books kept over 14 days).",
    expectedOutcome: "Students independently create complete CRUD applications with dictionary state.",
    expectedAbility: "Can independently structure, search, and update complex real-world data models."
  },

  // Stage 4 — Debugging & Improvement (Periods 37–38)
  {
    periodNumber: 37,
    unit: 2,
    unitName: "Practical Execution",
    topic: "Stage 4 (Debugging Set 1): Syntax & Logic Errors",
    phase: 'Practical',
    stage: "Stage 4 — Debugging & Improvement",
    teacherRole: "Hands out deliberately broken programs; demands verbal explanation before fixing.",
    studentRole: "Diagnose errors from tracebacks, explain root causes verbally, apply correct fixes.",
    learningObjective: "Diagnose and fix syntax errors, inverted elif chains, off-by-one loop conditions, and scope bugs.",
    teachingFocus: "Trace root causes using tracebacks and logic reasoning instead of random trial-and-error guessing.",
    subtopics: [
      "Reading Python tracebacks from the bottom line up",
      "Diagnosing wrong elif condition order",
      "Off-by-one loop errors in range()",
      "Local vs global variable scope collisions"
    ],
    realWorldAnchor: "'Why does my grading program give an A to a student with 45 marks?' Root-cause defect diagnosis.",
    openingQuestion: "When Python prints a 10-line red error message, which line tells you the exact problem?",
    conceptFlow: "Broken code provided → read traceback → student explains defect in words → fix applied → verified with tests.",
    coreSyntax: "# Fixing inverted elif bug\nif score >= 90: ...\nelif score >= 50: ...\n# NOT: if score >= 50 first!",
    demoCode: `# Buggy program set 1 for student diagnosis:
# Bug 1: Wrong elif order
def buggy_grade(score):
    if score >= 50:    # BUG! Catches all scores >= 50 including 95!
        return "Pass"
    elif score >= 90:
        return "Topper"
    return "Fail"

# Fixed version:
def fixed_grade(score):
    if score >= 90:
        return "Topper"
    elif score >= 50:
        return "Pass"
    return "Fail"

print("Buggy on 95:", buggy_grade(95)) # Prints Pass (Wrong!)
print("Fixed on 95:", fixed_grade(95)) # Prints Topper (Correct!)`,
    practicalActivity: "Inspect 3 broken code snippets, write the defect diagnosis on paper, and submit the corrected code.",
    practice: "Debug a student's prime number testing program that incorrectly flags 1 as prime and misses 2.",
    expectedOutcome: "Students can systematically trace and repair syntax, logic, and scope bugs without guessing.",
    expectedAbility: "Reads error traces, isolates defects, and reasons mathematically about boundaries."
  },
  {
    periodNumber: 38,
    unit: 4,
    unitName: "Practical Execution",
    topic: "Stage 4 (Debugging Set 2): Mutable Aliasing & File Handling Errors",
    phase: 'Practical',
    stage: "Stage 4 — Debugging & Improvement",
    teacherRole: "Provides complex multi-component bugs; challenges students to find memory leaks.",
    studentRole: "Trace memory references with id(), debug unclosed files, and verify buffer flushing.",
    learningObjective: "Identify and resolve subtle aliasing mutations, unhandled file open modes, and resource leaks.",
    teachingFocus: "Advanced debugging: unexpected side-effects from passing lists into functions and unclosed file handles.",
    subtopics: [
      "List aliasing side-effects in helper functions",
      "Unclosed files leaving unwritten buffers",
      "File mode confusion ('w' overwriting vs 'a' appending)",
      "Using id() and with statements to verify memory and file state"
    ],
    realWorldAnchor: "'My marks list was cleared when I passed it to a print function!' Diagnosing subtle memory defects.",
    openingQuestion: "Why did a teacher's master student records disappear when another function cleared its own temporary list?",
    conceptFlow: "Identify accidental shared memory reference → trace with id() → replace with .copy() → replace open() with with.",
    coreSyntax: "# Fixing aliasing\nlocal_copy = passed_list.copy()\n# Fixing file leak\nwith open(path, 'a') as f: ...",
    demoCode: `# Buggy Code Set 2: Aliasing side-effect
def sanitize_records(records):
    # Programmer intended to remove low scores from a local view
    # But modified the caller's list directly!
    for r in records[:]:
        if r < 50:
            records.remove(r)
    return records

original = [80, 40, 95, 30, 88]
print("Before sanitize:", original)
# Fix: Pass a copy or create a comprehension
clean_copy = [r for r in original if r >= 50]
print("After clean copy:", clean_copy)
print("Original preserved:", original)`,
    practicalActivity: "Debug a program where writing to a file leaves an empty 0-byte file due to missing flush/close.",
    practice: "Fix a nested dictionary bug where updating one student's subject list updates all students due to shallow default sharing.",
    expectedOutcome: "Students master memory cloning and context managers to write leak-free Python programs.",
    expectedAbility: "Identifies non-obvious memory reference defects and file lifecycle hazards."
  },

  // Stage 5 — Integrated Programming (Periods 39–41)
  {
    periodNumber: 39,
    unit: 4,
    unitName: "Practical Execution",
    topic: "Stage 5 (Integrated): Marks-File Processor with Exception Handling",
    phase: 'Practical',
    stage: "Stage 5 — Integrated Programming",
    teacherRole: "Provides realistic corrupt CSV files with missing columns and bad numbers; sets integration standards.",
    studentRole: "Combines file I/O, string parsing, and try-except error recovery into one robust pipeline.",
    learningObjective: "Process real-world CSV files of student scores, compute grades, and skip malformed rows without crashing.",
    teachingFocus: "Multiple syllabus concepts combined: Files (Unit IV), try/except (Unit IV), dictionaries (Unit III), and conditionals (Unit II).",
    subtopics: [
      "Reading CSV lines and splitting fields",
      "Type conversion wrapped in try/except ValueError",
      "Logging malformed lines to an error log file",
      "Writing clean processed student averages to an output file"
    ],
    realWorldAnchor: "An exam cell receiving an unverified CSV from an external center with corrupt rows, negative numbers, and letters.",
    openingQuestion: "If a 10,000-student CSV file has 3 corrupt rows with letters in the marks column, should the entire program crash?",
    conceptFlow: "Open CSV → read line by line → try converting marks → catch ValueError & log bad row → write valid rows to clean CSV.",
    coreSyntax: "try:\n    score = float(parts[2])\nexcept ValueError:\n    log_error(line)\n    continue",
    demoCode: `# Integrated: Marks File Processor with Exception Handling
raw_data = """Roll,Name,Marks
101,Aadhil,88
102,CorruptRow,N/A
103,Balaji,92
104,BadNumber,ninety
105,Divya,78"""

valid_records = []
corrupt_count = 0

for line in raw_data.strip().split("\\n")[1:]:
    parts = line.split(",")
    roll, name, mark_str = parts[0], parts[1], parts[2]
    try:
        score = float(mark_str)
        valid_records.append({"roll": roll, "name": name, "score": score})
    except ValueError:
        corrupt_count += 1
        print(f"WARNING: Skipped malformed row for {name} ('{mark_str}')")

print(f"Successfully processed: {len(valid_records)} rows. Corrupt rows skipped: {corrupt_count}.")`,
    practicalActivity: "Read a raw text file containing marks, skip invalid rows, and write valid averages to processed_results.txt.",
    practice: "Add validation that marks must be within 0 to 100; raise and catch custom OutOfRangeError.",
    expectedOutcome: "Students build fault-tolerant data pipelines that survive corrupt inputs.",
    expectedAbility: "Seamless integration of file I/O, string methods, exception handling, and collections."
  },
  {
    periodNumber: 40,
    unit: 4,
    unitName: "Practical Execution",
    topic: "Stage 5 (Integrated): Student Class with File Persistence",
    phase: 'Practical',
    stage: "Stage 5 — Integrated Programming",
    teacherRole: "Facilitates object-oriented modeling and file serialization patterns.",
    studentRole: "Implements Student class methods to serialize to string and reconstruct from disk records.",
    learningObjective: "Encapsulate student records in a Python class and persist object state to and from disk files.",
    teachingFocus: "Combining Object-Oriented Programming (Unit IV) with File Persistence (Unit IV) and collection iteration (Unit III).",
    subtopics: [
      "Student class with encapsulation",
      "to_csv() serialization method on class",
      "from_csv() class factory constructor",
      "Saving and reloading lists of Student objects"
    ],
    realWorldAnchor: "An ERP system where student profile objects are saved to disk at the end of the day and reloaded on startup.",
    openingQuestion: "How do you save a complex Student object with methods and attributes into a text file so it can be restored tomorrow?",
    conceptFlow: "Instantiate Student objects → call s.to_csv() → write to file → on next run, read file → reconstruct Student objects.",
    coreSyntax: "class Student:\n    def to_line(self):\n        return f'{self.roll},{self.name},{self.marks}\\n'\n    @classmethod\n    def from_line(cls, line): ...",
    demoCode: `# Integrated: Student Class with File Persistence
class Student:
    def __init__(self, roll, name, marks):
        self.roll = int(roll)
        self.name = name
        self.marks = float(marks)

    def to_csv_line(self):
        return f"{self.roll},{self.name},{self.marks}\\n"

    @classmethod
    def from_csv_line(cls, line):
        parts = line.strip().split(",")
        return cls(parts[0], parts[1], parts[2])

# Create objects and save
students = [Student(101, "Aadhil", 88), Student(102, "Balaji", 92)]
with open("persisted_students.csv", "w") as f:
    for s in students:
        f.write(s.to_csv_line())

# Reload from file into new objects
reloaded = []
with open("persisted_students.csv", "r") as f:
    for line in f:
        reloaded.append(Student.from_csv_line(line))

print(f"Reloaded {len(reloaded)} Student objects from disk.")
print("First student name:", reloaded[0].name)`,
    practicalActivity: "Implement a save_all() and load_all() function that stores 10 Student objects in a CSV file.",
    practice: "Add an update_marks() method to the Student class and rewrite the file with updated values.",
    expectedOutcome: "Students can model entities with classes and persist object state to disk files.",
    expectedAbility: "Fluent in OOP constructors, serialization, and disk storage architectures."
  },
  {
    periodNumber: 41,
    unit: 3,
    unitName: "Practical Execution",
    topic: "Stage 5 (Integrated): Recursion Applied to a Dataset",
    phase: 'Practical',
    stage: "Stage 5 — Integrated Programming",
    teacherRole: "Presents hierarchical and nested data problems suited for recursive traversal.",
    studentRole: "Traces recursive stack depth and implements recursive search/sum over datasets.",
    learningObjective: "Apply recursive algorithms to process nested lists, hierarchical records, or calculate recursive sums.",
    teachingFocus: "Synthesizing Unit II (Recursion) with Unit III (Lists and Collections): recursive sum, recursive binary search.",
    subtopics: [
      "Recursive sum over a list of numbers",
      "Recursive search over a sorted student marks dataset",
      "Recursive flattening of nested category lists",
      "Comparing loop performance vs recursive elegance"
    ],
    realWorldAnchor: "Searching through nested college departmental folder hierarchies or summing scores recursively.",
    openingQuestion: "If a marks list contains nested sub-lists for different semesters, how does recursion explore every score automatically?",
    conceptFlow: "Base case (empty list or single element) → recursive call on slice lst[1:] → combine results.",
    coreSyntax: "def rec_sum(lst):\n    if not lst: return 0\n    return lst[0] + rec_sum(lst[1:])",
    demoCode: `# Integrated: Recursive Search and Sum over a Dataset
def recursive_sum(marks_list):
    if len(marks_list) == 0:
        return 0
    return marks_list[0] + recursive_sum(marks_list[1:])

def recursive_max(marks_list):
    if len(marks_list) == 1:
        return marks_list[0]
    sub_max = recursive_max(marks_list[1:])
    return marks_list[0] if marks_list[0] > sub_max else sub_max

scores = [78, 92, 85, 96, 64, 89]
print("Recursive Sum of Marks:", recursive_sum(scores))
print("Recursive Max Score:", recursive_max(scores))`,
    practicalActivity: "Implement a recursive function to count how many students scored >= 80 in a dataset.",
    practice: "Implement recursive binary search on a sorted list of student register numbers.",
    expectedOutcome: "Students can apply recursive thinking to practical dataset processing problems.",
    expectedAbility: "Decomposes list processing problems into recursive base cases and inductive steps."
  },

  // Stage 6 — Mini-Project / Application (Periods 42–43)
  {
    periodNumber: 42,
    unit: 4,
    unitName: "Practical Execution",
    topic: "Stage 6 (Mini-Project Day 1): Student Result Management System — Design & Build",
    phase: 'Practical',
    stage: "Stage 6 — Mini-Project",
    teacherRole: "Facilitates architecture reviews; approves data models and modular project outlines.",
    studentRole: "Designs data structures, function contracts, file persistence schemas, and starts coding.",
    learningObjective: "Architect a comprehensive Student Result Management System integrating data structures, functions, and file I/O.",
    teachingFocus: "Mini-project design phase: decide schema, define function signatures, build input gathering and validation.",
    subtopics: [
      "System requirements and architecture design",
      "Data structure selection (dictionary of Student records)",
      "Core modules: entry, validation, file persistence",
      "Building the command-line menu interface"
    ],
    realWorldAnchor: "Building the full departmental Student Result Management System from scratch across two dedicated sessions.",
    openingQuestion: "Before writing line 1 of code, how do you map out which functions, data models, and files your project needs?",
    conceptFlow: "Requirements specification → data model design → function contracts → file storage layout → milestone 1 coding.",
    coreSyntax: "# Modular mini-project architecture\n# models.py, storage.py, calculations.py, main.py",
    demoCode: `# Student Result Management System (Day 1 Blueprint)
class ResultSystem:
    def __init__(self, filename="results_db.txt"):
        self.filename = filename
        self.students = {} # reg_no -> {'name': ..., 'marks': [...]}

    def add_student(self, reg_no, name, marks):
        if reg_no in self.students:
            return False, "Student already registered."
        self.students[reg_no] = {"name": name, "marks": marks}
        return True, "Student added successfully."

    def display_all(self):
        for reg, data in self.students.items():
            print(f"Reg: {reg} | Name: {data['name']:<15} | Marks: {data['marks']}")

system = ResultSystem()
system.add_student("26009479", "Aadhil", [85, 90, 92])
system.add_student("26016734", "Balaji", [78, 88, 84])
system.display_all()`,
    practicalActivity: "Draft your system architecture on paper, create the project files, and implement student entry and validation.",
    practice: "Add data validation ensuring register numbers are unique and marks are within 0 to 100.",
    expectedOutcome: "Students successfully architect and implement Day 1 of their capstone Student Result Management System.",
    expectedAbility: "Designs modular multi-component systems with clear data contracts."
  },
  {
    periodNumber: 43,
    unit: 5,
    unitName: "Practical Execution",
    topic: "Stage 6 (Mini-Project Day 2): Complete, Test, Rank & Present",
    phase: 'Practical',
    stage: "Stage 6 — Mini-Project",
    teacherRole: "Reviews completed systems; evaluates test suite coverage and live student demonstrations.",
    studentRole: "Completes sorting/ranking, exports final CSV reports, tests sample datasets, and presents system.",
    learningObjective: "Complete the Student Result Management System with sorting, CSV export, test cases, and project presentation.",
    teachingFocus: "Finalize ranking algorithms, persist to CSV, add optional Pandas/NumPy summary analytics, and present live.",
    subtopics: [
      "Ranking algorithms: sorting students by total marks",
      "Exporting official merit list to CSV",
      "Summary statistics (class average, highest, lowest)",
      "System testing with edge-case datasets and peer demonstration"
    ],
    realWorldAnchor: "Completing, testing, and demonstrating the operational Student Result Management System to the class.",
    openingQuestion: "How do you verify your result system doesn't crash when handed an empty database or tied marks?",
    conceptFlow: "Complete ranking → implement CSV export → run edge-case tests (ties, zero marks) → live presentation.",
    coreSyntax: "sorted_students = sorted(self.students.items(), key=lambda x: sum(x[1]['marks']), reverse=True)",
    demoCode: `# Mini-Project Day 2: Ranking, Export & Summary Analytics
import csv

def generate_merit_list(student_dict, export_filename="merit_list.csv"):
    ranked = sorted(student_dict.items(), key=lambda item: sum(item[1]["marks"]), reverse=True)
    
    with open(export_filename, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Rank", "Reg_No", "Name", "Total_Marks", "Percentage", "Result"])
        for rank, (reg, data) in enumerate(ranked, 1):
            total = sum(data["marks"])
            pct = total / len(data["marks"])
            result = "PASS" if pct >= 50 else "FAIL"
            writer.writerow([rank, reg, data["name"], total, f"{pct:.1f}%", result])
            print(f"Rank {rank}: {data['name']:<15} Total: {total} ({pct:.1f}%)")

print("Merit list exported and verified successfully.")`,
    practicalActivity: "Run sample data through your complete system, verify the generated CSV in Excel, and explain code to instructor.",
    practice: "Integrate optional NumPy/Pandas analysis to compute subject-wise standard deviations.",
    expectedOutcome: "Students present a fully working, robust Student Result Management System; Stage 6 complete.",
    expectedAbility: "Delivers an end-to-end Python software solution meeting all engineering requirements."
  },

  // Stage 7 — Final Independent Coding Challenge (Periods 44–45)
  {
    periodNumber: 44,
    unit: 5,
    unitName: "Practical Execution",
    topic: "Stage 7 (Final Challenge Day 1): Open Unseen Problem — Design + Code",
    phase: 'Practical',
    stage: "Stage 7 — Final Challenge",
    teacherRole: "Issues unseen problem specification with strict constraints; observes without assisting.",
    studentRole: "Analyzes problem, outlines INPUT -> PROCESS -> OUTPUT, designs data models, writes code unaided.",
    learningObjective: "Independently design and code a solution for a novel, unseen problem with strict constraints under timed conditions.",
    teachingFocus: "Final competency test: students go through the complete software cycle (I-P-O, data models, algorithm) completely unaided.",
    subtopics: [
      "Analyzing unseen requirements and constraints",
      "Structuring INPUT -> PROCESS -> OUTPUT architecture",
      "Independent data structure selection",
      "Day 1 core coding and edge-case handling"
    ],
    realWorldAnchor: "Technical coding interview challenge: given an unseen dataset, produce clean, error-free analysis under constraints.",
    openingQuestion: "When handed an unfamiliar real-world problem statement, what are the first 3 steps you take before typing code?",
    conceptFlow: "Read constraints → identify INPUT, PROCESS, OUTPUT → choose data structures → implement core logic unaided.",
    coreSyntax: "# Fully independent problem solving\n# Problem: 'Process an unseen CSV of exam results, rank students, flag improvements, save report'",
    demoCode: `# Final Challenge: Unseen Problem Framing (Teacher Specification)
# Problem Statement:
# "Process an unverified CSV containing student exam records:
#  1. Filter out students with incomplete records.
#  2. Compute weighted composite score (Lab 40%, Theory 60%).
#  3. Rank students and identify the top 5% merit scholars.
#  4. Flag students scoring below 40% in either component.
#  5. Export an executive summary report to summary_report.txt."

print("Final Challenge Day 1: Problem statement delivered. Students coding unaided.")`,
    practicalActivity: "Deconstruct the unseen challenge problem into algorithmic steps, select data models, and implement Day 1 code.",
    practice: "Write unit tests verifying edge cases: negative marks, missing lab marks, tied composite scores.",
    expectedOutcome: "Students independently structure and begin coding a complex unseen problem from scratch.",
    expectedAbility: "Autonomous problem decomposition and translation of constraints into working Python code."
  },
  {
    periodNumber: 45,
    unit: 5,
    unitName: "Practical Execution",
    topic: "Stage 7 (Final Challenge Day 2): Execute, Debug, Explain & Defend",
    phase: 'Practical',
    stage: "Stage 7 — Final Challenge",
    teacherRole: "Conducts individual viva voce defense; questions students on logic choices, time complexity, and design.",
    studentRole: "Finishes coding, runs automated tests, debugs defects, and verbally defends architectural choices.",
    learningObjective: "Deliver, debug, and verbally defend the completed final challenge program, demonstrating full course competency.",
    teachingFocus: "The final competency demonstration: running, debugging, and explaining design choices and complexity to the teacher.",
    subtopics: [
      "Final integration and automated verification",
      "Debugging runtime and boundary anomalies",
      "Code quality and PEP8 polish",
      "Verbal viva voce defense of design and algorithmic decisions"
    ],
    realWorldAnchor: "Software engineering defense: presenting your code to technical leaders, justifying design choices, and answering viva questions.",
    openingQuestion: "Why did you choose this data structure over alternatives, and what is the time complexity of your solution?",
    conceptFlow: "Run with test suite → eliminate bugs → verify output → verbal defense and competency checklist sign-off.",
    coreSyntax: "# Complete verified solution with clean documentation and defensible architecture",
    demoCode: `# Final Competency Checklist Sign-off (Course Completion)
CHECKLIST = [
    "Choose correct data structure (variable, list, tuple, dict, array, DataFrame)",
    "Write conditional and loop-based logic without hesitation",
    "Write fruitful functions and recursive solutions",
    "Work confidently with lists, tuples, dicts and explain aliasing",
    "Read/write files and handle bad input/exceptions defensively",
    "Describe what a class/object is and use one appropriately",
    "Perform NumPy and Pandas tabular data operations and CSV processing",
    "Predict output of short unfamiliar programs before running",
    "Debug broken programs by reasoning about the error, not guessing",
    "Take unseen problem statement, plan I-P-O, build and defend solution"
]

print("=" * 60)
print("PYTHON PROGRAMMING (19AI301/CS3301) — COURSE COMPLETE")
print("=" * 60)
for idx, item in enumerate(CHECKLIST, 1):
    print(f"[{idx:2d}] [x] {item}")
print("=" * 60)
print("All 45 Teaching Periods Successfully Mastered!")`,
    practicalActivity: "Run your finished program on the hidden test dataset and defend your design choices in viva voce with the instructor.",
    practice: "Review the complete course repository and build a personal portfolio showcasing your mini-project and challenge code.",
    expectedOutcome: "Students successfully defend their solution and demonstrate complete mastery of all 10 competency checklist items.",
    expectedAbility: "Full First-Year Python Programming competency: autonomous coding, debugging, and verbal technical defense."
  }
];
