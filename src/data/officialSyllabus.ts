import { OfficialSyllabusUnit } from '../types';

export const OFFICIAL_SYLLABUS: OfficialSyllabusUnit[] = [
  {
    unitNumber: 1,
    title: "Data Types, Expressions, Statements",
    hours: 6,
    description: "Foundations of Python execution, the interactive interpreter, values, dynamic data types (int, float, boolean, string, list), variables, expressions, statements, tuple assignment, operator precedence, functions, flow of execution, parameters/arguments, and foundational illustrative programs.",
    topics: [
      {
        topicName: "Python Interpreter & Primitive Values",
        subtopics: ["Interactive interpreter vs script execution", "Values & types: int, float, boolean, string, list", "type() inspection function"],
        importance: "Fundamental"
      },
      {
        topicName: "Variables, Expressions & Statements",
        subtopics: ["Variables as dynamic memory bindings", "Expressions and statements", "Single-line comments (#)", "Arithmetic and assignment operators"],
        importance: "Core"
      },
      {
        topicName: "Tuple Assignment & Operator Precedence",
        subtopics: ["Simultaneous tuple assignment (a, b = b, a)", "Operator precedence rules (PEMDAS)", "Grouping with parentheses"],
        importance: "Core"
      },
      {
        topicName: "Functions, Parameters & Execution Flow",
        subtopics: ["def statement & function definition/use", "Flow of execution & call stack", "Parameters vs Arguments", "The return statement"],
        importance: "Core"
      },
      {
        topicName: "Unit I Illustrative Programs",
        subtopics: ["Exchange values of two variables", "Circulate values of n variables", "Distance between two points using math.sqrt"],
        importance: "Applied"
      }
    ],
    outcomes: [
      "Navigate the Python interpreter and identify the 5 fundamental primitive data types.",
      "Construct expressions and assign variables cleanly without precedence or NameError traps.",
      "Define reusable functions, trace the call stack, and solve the syllabus illustrative programs."
    ]
  },
  {
    unitNumber: 2,
    title: "Control Flow, Functions",
    hours: 7,
    description: "Algorithmic decision making and iteration: boolean logic, if, if-else, if-elif-else chaining, condition-controlled while loops, sequence-controlled for loops with break/continue/pass, fruitful functions with return values and scope isolation, function composition, recursion, strings, and lists as arrays.",
    topics: [
      {
        topicName: "Conditionals & Branching Logic",
        subtopics: ["Boolean values & relational operators (==, !=, <, >, <=, >=)", "Conditional (if)", "Alternative (if-else)", "Chained conditional (if-elif-else)"],
        importance: "Core"
      },
      {
        topicName: "Iteration & Loop Control Mechanics",
        subtopics: ["Iteration: state variables & while loop", "Definite iteration: for loop & range()", "Loop controls: break, continue, pass", "Infinite loop prevention"],
        importance: "Core"
      },
      {
        topicName: "Fruitful Functions & Variable Scope",
        subtopics: ["Fruitful functions returning values", "Parameters & arguments", "Local vs Global scope (LEGB rule)"],
        importance: "Core"
      },
      {
        topicName: "Function Composition & Recursion",
        subtopics: ["Function composition (f(g(x)))", "Recursive thinking & call stack frames", "Base case stopping condition", "Euclidean GCD & exponentiation"],
        importance: "Core"
      },
      {
        topicName: "Strings & Lists as Arrays",
        subtopics: ["String slicing [start:stop:step] & immutability", "String methods (.strip(), .title(), .split())", "Lists as arrays", "Newton's method for square root", "Sum an array of numbers"],
        importance: "Applied"
      }
    ],
    outcomes: [
      "Implement multi-path decision structures avoiding boundary and ordering defects.",
      "Choose appropriately between while and for loops and use break/continue effectively.",
      "Write fruitful and recursive functions, manipulate strings, and treat lists as arrays."
    ]
  },
  {
    unitNumber: 3,
    title: "Lists, Tuples, Dictionaries",
    hours: 6,
    description: "In-depth mastery of Python compound data structures: list operations, slicing, methods, iteration, memory mutability, aliasing vs cloning (.copy()), immutable tuples, dictionary key-value mapping, list comprehensions, and classical search/sort algorithms.",
    topics: [
      {
        topicName: "Lists: Operations, Slices & Iteration",
        subtopics: ["List creation, indexing & slicing", "List methods: .append(), .remove(), .pop(), .sort()", "Iterating through lists with for loops"],
        importance: "Core"
      },
      {
        topicName: "Memory Mutability, Aliasing & Cloning",
        subtopics: ["Mutable vs Immutable object behavior", "Memory aliasing pitfalls (list2 = list1)", "Cloning lists with .copy() or [:]", "Passing mutable lists as function parameters"],
        importance: "Core"
      },
      {
        topicName: "Tuples & Immutability",
        subtopics: ["Tuple assignment & immutability guarantees", "Tuples as multi-value function returns", "Tuple unpacking (lo, hi = min_max())", "Single-element tuple syntax (x,)"],
        importance: "Core"
      },
      {
        topicName: "Dictionaries & Key-Value Mappings",
        subtopics: ["Key-Value mapping architecture", "Dictionary operations and methods", ".keys(), .values(), .items()", "Safe access using .get(key, default)"],
        importance: "Core"
      },
      {
        topicName: "List Comprehension",
        subtopics: ["One-line list construction: [expr for item in iterable]", "Conditional filtering: [expr for item in iterable if condition]", "Readability and performance"],
        importance: "Applied"
      },
      {
        topicName: "Unit III Illustrative Programs: Search & Sort",
        subtopics: ["Maximum and minimum of a list", "Linear search algorithm", "Binary search algorithm (iterative)", "Selection sort & Insertion sort", "Histogram generation"],
        importance: "Applied"
      }
    ],
    outcomes: [
      "Select optimal data structures (list, tuple, dict) according to mutability and access requirements.",
      "Diagnose and eliminate list aliasing bugs using explicit cloning.",
      "Write concise list comprehensions and implement binary search and selection/insertion sort."
    ]
  },
  {
    unitNumber: 4,
    title: "Files, Modules, Packages",
    hours: 5,
    description: "Persistent storage, modular system architecture, exception safety, introductory Object-Oriented Programming, and file processing utilities: reading and writing text files, formatting operators, command-line arguments (sys.argv), try-except defensive programming, custom modules, packages, and introductory classes.",
    topics: [
      {
        topicName: "Text Files & Format Operator",
        subtopics: ["File access modes ('r', 'w', 'a')", "Context manager: with open(...) as f", "Reading with .read(), .readline(), .readlines()", "String formatting (% and .format() and f-strings)"],
        importance: "Core"
      },
      {
        topicName: "Command-Line Arguments & Exception Handling",
        subtopics: ["CLI arguments with sys.argv", "Errors vs runtime exceptions", "try-except-else-finally blocks", "Handling specific exceptions (ValueError, FileNotFoundError)"],
        importance: "Core"
      },
      {
        topicName: "Modules & Packages",
        subtopics: ["Standard library modules: math, random, sys", "Creating custom reusable .py modules", "The __name__ == '__main__' execution guard", "Package folder structures with __init__.py"],
        importance: "Core"
      },
      {
        topicName: "Classes & Objects (Introductory)",
        subtopics: ["Class as blueprint, Object as instance", "The __init__ constructor method", "The self parameter", "Instance attributes and methods (e.g. Student class)"],
        importance: "Core"
      },
      {
        topicName: "Unit IV Illustrative Programs",
        subtopics: ["Word count from a file", "Copying file contents safely", "Command-line argument word count utility"],
        importance: "Applied"
      }
    ],
    outcomes: [
      "Read from and write to disk files safely without resource leaks using with open().",
      "Write resilient programs that catch specific exceptions instead of crashing unexpectedly.",
      "Organize multi-file applications with modules and construct introductory classes."
    ]
  },
  {
    unitNumber: 5,
    title: "NumPy, Data Frame",
    hours: 6,
    description: "High-performance numeric computing with NumPy arrays and tabular data analysis with Pandas DataFrames: array creation, shape, reshape, multi-dimensional slicing, boolean filtering, vector arithmetic, matrix multiplication and inversion, Pandas Series and DataFrames, missing data handling (.dropna, .fillna), merging, groupby aggregation, CSV read/write, and comprehensive syllabus checkpoint.",
    topics: [
      {
        topicName: "NumPy: Array Creation & Shape Reshaping",
        subtopics: ["Homogeneous contiguous memory ndarrays", "Creating arrays with np.array()", "Array attributes: .shape, .ndim, .dtype", "Reshaping arrays with .reshape()"],
        importance: "Core"
      },
      {
        topicName: "NumPy: Indexing, Slicing & Matrix Operations",
        subtopics: ["2D coordinate slicing: arr[rows, cols]", "Boolean mask filtering (arr[arr > 80])", "Vectorized arithmetic & scalar broadcasting", "Matrix multiplication with np.dot() and @", "Matrix inverse with np.linalg.inv() (illustrative)"],
        importance: "Core"
      },
      {
        topicName: "Pandas: Series, DataFrame & Selection",
        subtopics: ["Pandas Series (1D labeled) & DataFrame (2D tabular)", "Label-based indexing (.loc)", "Integer position indexing (.iloc)", "Column selection and creation"],
        importance: "Core"
      },
      {
        topicName: "Pandas: Data Cleaning & Aggregation",
        subtopics: ["Handling missing values: .isna(), .dropna(), .fillna()", "Merging DataFrames with pd.merge()", "Group aggregation with .groupby()", "Custom transformations with .apply()"],
        importance: "Applied"
      },
      {
        topicName: "Pandas: CSV Processing & Syllabus Checkpoint",
        subtopics: ["Reading CSV files with pd.read_csv()", "Sorting records with .sort_values()", "Exporting clean results with df.to_csv()", "Official illustrative: read/process CSV", "Comprehensive Unit I–V syllabus checkpoint recap"],
        importance: "Applied"
      }
    ],
    outcomes: [
      "Create, reshape, slice, and perform matrix operations with NumPy ndarrays.",
      "Load, clean, merge, and group tabular student datasets using Pandas DataFrames.",
      "Complete the entire conceptual syllabus (Units I–V) ready for independent practical execution."
    ]
  }
];

export const COURSE_SPECIFICATIONS = {
  courseCode: "19AI301 / CS3301",
  courseTitle: "Problem Solving and Python Programming",
  credits: "3 Credits (L: 3, T: 0, P: 0)",
  regulation: "Anna University / Autonomous Regulations",
  objectives: [
    "To understand the basics of algorithmic problem solving and computational thinking.",
    "To develop clean, idiomatic Python programs using expressions, statements, conditionals, and loops.",
    "To decompose problems into modular functions and understand recursion and variable scope.",
    "To structure and manipulate data collections using lists, tuples, and dictionaries.",
    "To perform input/output operations with files and write defensive code with exception handling.",
    "To explore scientific numerical computing and tabular data analysis with NumPy and Pandas."
  ],
  outcomes: [
    { co: "CO1", text: "Develop algorithmic solutions and construct Python programs with basic primitive types and expressions." },
    { co: "CO2", text: "Apply conditional execution, looping constructs, and modular fruitful functions." },
    { co: "CO3", text: "Structure complex data using lists, tuples, and dictionaries for real-world applications." },
    { co: "CO4", text: "Implement persistent file storage, defensive exception handling, and modular packages." },
    { co: "CO5", text: "Perform multidimensional matrix operations with NumPy and tabular analysis using Pandas DataFrames." }
  ],
  labExperiments: [
    { id: "EXP-01", title: "Expressions & Statements", desc: "Arithmetic expressions, operator precedence, discount calculation, and Euclidean distance computation." },
    { id: "EXP-02", title: "Variable Swapping & Circulation", desc: "Exchange values of two variables and circulate values of n variables using simultaneous tuple assignment." },
    { id: "EXP-03", title: "Conditionals & Decision Slabs", desc: "Electricity slab billing, student grade calculation, and leap year validation using chained if-elif-else." },
    { id: "EXP-04", title: "Iterative Problem Solving", desc: "ATM PIN verification with limited attempts, Fibonacci sequence, Armstrong numbers, and prime validation." },
    { id: "EXP-05", title: "Fruitful Functions & Recursion", desc: "Greatest Common Divisor (GCD) using Euclidean recursion, factorial calculation, and exponentiation." },
    { id: "EXP-06", title: "String Processing & Immutability", desc: "String slicing, palindrome checking, character frequency counting, and string method transformations." },
    { id: "EXP-07", title: "List Search & Sorting Algorithms", desc: "Linear search, binary search on sorted array, selection sort, and insertion sort." },
    { id: "EXP-08", title: "Tuples & Dictionaries", desc: "Student grade card mapping, word frequency histogram, and tuple multi-value returns." },
    { id: "EXP-09", title: "File Operations & Word Count", desc: "Read and write text files safely using context managers (with open) and count characters, words, and lines." },
    { id: "EXP-10", title: "Defensive Exception Handling & CLI", desc: "Handle ValueError and FileNotFoundError gracefully and parse command-line arguments using sys.argv." },
    { id: "EXP-11", title: "NumPy Multidimensional Computing", desc: "Create 2D matrices, transpose, perform scalar broadcasting, matrix multiplication, and boolean masking." },
    { id: "EXP-12", title: "Pandas DataFrame Tabular Exploration", desc: "Read student exam dataset from CSV, clean missing values (.fillna), filter records, and compute aggregate metrics." }
  ],
  textbooks: [
    { title: "Think Python: How to Think Like a Computer Scientist", author: "Allen B. Downey", edition: "2nd Edition, O'Reilly Media", year: "2016" },
    { title: "Python Programming using Problem Solving Approach", author: "Reema Thareja", edition: "Oxford University Press", year: "2017" }
  ],
  references: [
    { title: "Python for Data Analysis: Data Wrangling with Pandas, NumPy, and IPython", author: "Wes McKinney", edition: "2nd Edition, O'Reilly Media", year: "2017" },
    { title: "Introduction to Computer Science Using Python: A Computational Problem-Solving Focus", author: "Charles Dierbach", edition: "Wiley India Edition", year: "2013" }
  ]
};
