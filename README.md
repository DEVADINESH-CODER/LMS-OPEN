# Python Class LMS (C1 112 • C2 147 • C3 091)

> **Private Classroom Learning Management System for First-Year Python Teaching**  
> *Built for Cloudflare Pages (Frontend + Edge API Functions) and Appwrite Cloud (Database, Auth, Storage, Realtime).*  
> *Free-tier first, deployment-ready for GitHub Student Developer Pack.*

---

## 🎯 System Overview & Philosophy

**Python Class LMS** is not a generic college ERP or social network. It is a purpose-built, private classroom learning platform engineered specifically for beginner programming education across three isolated classroom cohorts:
- **Class 1**: `C1 112` (`C1-112`)
- **Class 2**: `C2 147` (`C2-147`)
- **Class 3**: `C3 091` (`C3-091`)

### The Core Pedagogical Engine
First-year programming students require intuition before formal abstraction:
$$\text{Real-Life Situation} \longrightarrow \text{Problem} \longrightarrow \text{Student Thinking} \longrightarrow \text{Logic} \longrightarrow \text{Python Concept} \longrightarrow \text{Code} \longrightarrow \text{Output} \longrightarrow \text{Explanation} \longrightarrow \text{Modification} \longrightarrow \text{Practice} \longrightarrow \text{Application}$$

- **Explain WHY before HOW**: Real-world mental anchors (ATMs, traffic lights, luggage tags) before syntax.
- **Predict → Run → Explain**: Train mental models before touching execution.
- **Debug This**: Learn through diagnosing authentic beginner blunders (IndentationError, `=` vs `==`, infinite loop counters).
- **Viva Voce Flashcards**: Instant oral exam readiness directly attached to each lecture.

---

## 🔒 Security & Zero-Trust Identity Guarantees

1. **No Student Self-Registration**: Only the teacher/admin enrolls students or imports CSVs.
2. **Register Number + Personal PIN Entry**:
   - Students authenticate using their college Register Number (e.g. `717823P101`) and a 4-8 digit numeric PIN.
   - PINs are cryptographically hashed using **SHA-256 with unique per-student random cryptographic salts**.
   - No paid SMS, third-party authenticators, or approved-device locks. Any device works.
3. **Backend-Derived Session State**:
   - The frontend never trusts user-supplied `student_id`, `class_id`, or `name`.
   - Every API request authenticates an HMAC-SHA256 signed session token. Identity and class enrollment are derived strictly from the backend database.
4. **Strict Classroom Isolation (Anti-IDOR)**:
   - **Class Group Chat**: A student in C1 112 can never access or read messages in C2 147 or C3 091.
   - **Published Lessons**: Lessons published to C1 112 appear only on C1 112's Today/Revision feeds.
   - **Private Chat**: Students can message **only the teacher**. Student-to-student private messaging is strictly blocked by API design.
5. **Teacher-Controlled PIN Reset & Mandatory Reset Flow**:
   - If a student forgets their PIN, the teacher generates a temporary PIN with one click.
   - The student's account is flagged with `mustChangePin: true`.
   - On the next login, the student is forced into a private PIN change screen before any classroom material can be viewed.
6. **Instant Account Deactivation**:
   - Inactive accounts are barred at both session generation and verification levels.

---

## 🗺️ 45-Period Master Syllabus Plan

The semester is structured into exactly **45 teaching periods** spanning 5 units:
- **Unit 1 (Periods 1 - 9)**: Computational Thinking, Algorithms, Flowcharts, Tokens, Dynamic Typing, Primitive Types, I/O, Operators.
- **Unit 2 (Periods 10 - 19)**: Decision Making (`if`, `if-elif-else`), Loops (`while`, `for`, `range`), Break/Continue, Pattern Printing, Sequence Algorithms (Factorial, Fibonacci, Primes).
- **Unit 3 (Periods 20 - 27)**: Modular Programming (`def`, arguments, `return`), LEGB Scope, Recursion, Lambda, Built-in Modules, Custom Modules with `__name__` guard.
- **Unit 4 (Periods 28 - 37)**: Strings, Lists, Mutability, List Comprehensions, Tuples, Dictionaries, Sets, Data Structure Selection Matrix.
- **Unit 5 (Periods 38 - 45)**: File I/O (`with open`), CSV Processing, Exceptions (`try-except-finally`), Custom Errors, Mini-Project Capstone, Semester Viva Voce Review.

> **Class Independence**: The 45-period master curriculum is common, but C1 112, C2 147, and C3 091 move at their own speeds. The teacher manually publishes the appropriate period for each class.

---

## 🚀 Quick Start (Local Development)

The application includes an integrated **Zero-Config Local Provider** pre-seeded with all classes, students, the complete 45-period curriculum, published lessons, and chat history. You can run and test the complete system immediately:

```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite (verifying auth, IDOR, PIN reset, class isolation)
npm test

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Default Test Credentials

| Role | Identifier / Email | Credential | Details |
| :--- | :--- | :--- | :--- |
| **Faculty / Teacher** | `teacher@college.edu` | `Teacher@2024` (or `1234`) | Full Administrative Access over C1, C2, C3 |
| **Student (C1 112)** | `26009479` (AJAY KRISHNAN S) | `1234` | Period 12 active, C1 112 Group Chat (49 total students) |
| **Student (C2 147)** | `26016734` (ADITYA N) | `1234` | Period 10 active, C2 147 Group Chat (55 total students) |
| **Student (C3 091)** | `26018966` (ABIMANYU R) | `1234` | Period 8 active, C3 091 Group Chat (50 total students) |

---

## ☁️ Appwrite Cloud Setup (1-Click Automated Script)

Use your **GitHub Student Developer Pack** benefit to create a free project on [Appwrite Cloud](https://cloud.appwrite.io).

1. In your Appwrite Cloud console, create a project named `Python Class LMS`.
2. Generate an **API Key** with full permissions (Databases, Collections, Documents, Storage).
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your Appwrite project keys:
   ```env
   VITE_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
   VITE_APPWRITE_PROJECT_ID="your_project_id"
   VITE_APPWRITE_DATABASE_ID="python_class_lms"
   VITE_APPWRITE_STORAGE_BUCKET_ID="course_materials"
   APPWRITE_API_KEY="your_secret_server_api_key"
   SESSION_SECRET="your_custom_hmac_secret"
   ```
5. Run the automated provisioning script:
   ```bash
   npm run setup:appwrite
   ```
   This turnkey script automatically:
   - Creates the `python_class_lms` database.
   - Creates all 13 collections (`classes`, `students`, `master_plan`, `syllabus`, `lessons`, `class_progress`, `practice_questions`, `announcements`, `group_messages`, `private_conversations`, `private_messages`, `notifications`, `audit_logs`).
   - Creates the `course_materials` storage bucket with allowed file formats (PDF, PY, CSV, PNG, JPG).
   - Pre-seeds all 45 teaching periods and initial classes into Appwrite Cloud.

---

## 🌐 Cloudflare Pages Deployment

Deploying frontend and edge functions to Cloudflare Pages is completely free with GitHub:

### Option A: Via GitHub Integration (Recommended)
1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Python Class LMS"
   git branch -M main
   git remote add origin https://github.com/your-username/python-class-lms.git
   git push -u origin main
   ```
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com), go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select your repository:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_APPWRITE_ENDPOINT`
   - `VITE_APPWRITE_PROJECT_ID`
   - `VITE_APPWRITE_DATABASE_ID`
   - `VITE_APPWRITE_STORAGE_BUCKET_ID`
   - `SESSION_SECRET`
5. Click **Save and Deploy**. Cloudflare Pages automatically detects `/functions` and deploys your secure edge API alongside your static assets!

### Option B: Via Cloudflare Wrangler CLI
```bash
npx wrangler pages deploy dist --project-name python-class-lms
```

---

## 🧑‍🏫 Daily Teacher Workflow

1. **Login as Teacher**: Use `teacher@college.edu` with your secure password.
2. **Select Classroom**: Click `C1 112`, `C2 147`, or `C3 091` on the header switcher.
3. **Publish Today's Class**:
   - Click **Publish Today's Class**.
   - Select the curriculum period (1 to 45). The system pre-fills the objective, real-life analogy, syntax, and starter code from the master plan.
   - Customize what was taught and save as draft or click **Publish Immediately to Class**.
   - The lesson instantly appears on that class's **Today's Class** page and revision library.
4. **Duplicate to Another Class**:
   - When appropriate, duplicate the published lesson to another class as a draft (requires explicit confirmation).
5. **Class Progress & Pedagogy Log**:
   - Open **Progress Tracking** to log concepts understood, student difficulties, questions asked, and teacher notes.
6. **Moderate Discussions**:
   - Review class group chat, pin important formulas or code reminders to the top, and delete any inappropriate messages.
7. **Answer Private Inquiries**:
   - Open **Private Inquiries** to review student questions organized by student name and register number.
8. **Student Management**:
   - Enroll new students individually or paste a CSV list (`RegisterNumber, Name, ClassId`).
   - If a student forgets their PIN, click **Reset PIN** to generate a temporary 4-digit code.

---

## 🧪 Automated Testing

Run the Vitest test suite to verify core security requirements:
```bash
npm test
```

Tests verify:
- Register number + PIN hashing with per-student salt.
- Inactive student login rejection.
- Zero-trust IDOR defense: cross-class group chat blockage.
- Private chat confidentiality: student-to-student private message prevention.
- Teacher temporary PIN reset and forced student PIN change.
- Complete 45-period master plan data integrity.

---

## 📄 License
Educational Private Classroom License. Built for collegiate computer science instruction.
