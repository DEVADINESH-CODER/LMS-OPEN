import React, { useState, useEffect } from 'react';
import { useClass } from '../../context/ClassContext';
import { storageService } from '../../lib/storage-provider';
import { MASTER_45_PERIODS } from '../../data/masterPlan';
import { ClassId, LessonContent } from '../../types';
import { 
  X, 
  Send, 
  Save, 
  Copy, 
  Sparkles, 
  BookOpen, 
  Compass, 
  Code, 
  Lightbulb, 
  Target, 
  FileCheck, 
  AlertTriangle,
  HelpCircle,
  FileCode,
  RotateCcw,
  Trash2
} from 'lucide-react';

interface PublishLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLesson?: LessonContent | null;
  initialPeriodNumber?: number;
}

export const PublishLessonModal: React.FC<PublishLessonModalProps> = ({ 
  isOpen, 
  onClose, 
  initialLesson,
  initialPeriodNumber 
}) => {
  const { classes, activeClassId } = useClass();

  const [targetClass, setTargetClass] = useState<ClassId>(activeClassId);
  const [periodNumber, setPeriodNumber] = useState<number>(initialPeriodNumber || 1);
  const [unit, setUnit] = useState<number>(1);
  const [topic, setTopic] = useState('');
  const [whatYouWillLearn, setWhatYouWillLearn] = useState('');
  const [whatWasTaught, setWhatWasTaught] = useState('');

  // Real life situation
  const [scenarioTitle, setScenarioTitle] = useState('');
  const [scenarioText, setScenarioText] = useState('');
  const [connectionToCode, setConnectionToCode] = useState('');

  // Concept & code
  const [conceptExplanation, setConceptExplanation] = useState('');
  const [syntax, setSyntax] = useState('');
  const [code, setCode] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [homework, setHomework] = useState('');
  const [miniChallenge, setMiniChallenge] = useState('');

  // Predict the output
  const [predictSnippet, setPredictSnippet] = useState('');
  const [predictOptionA, setPredictOptionA] = useState('');
  const [predictOptionB, setPredictOptionB] = useState('');
  const [predictOptionC, setPredictOptionC] = useState('');
  const [predictOptionD, setPredictOptionD] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0);
  const [predictExplanation, setPredictExplanation] = useState('');

  // Debug this
  const [buggyCode, setBuggyCode] = useState('');
  const [commonMistakeWhy, setCommonMistakeWhy] = useState('');
  const [fixedCode, setFixedCode] = useState('');
  const [debugExplanation, setDebugExplanation] = useState('');

  // Teacher notes
  const [teachingStrategy, setTeachingStrategy] = useState('');
  const [suggestedBoardFlow, setSuggestedBoardFlow] = useState('');

  // Target class for duplication
  const [duplicateTargetClass, setDuplicateTargetClass] = useState<ClassId>('C2-147');
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);

  // Sync state when modal opens or period changes
  useEffect(() => {
    if (initialLesson) {
      setTargetClass(initialLesson.classId);
      setPeriodNumber(initialLesson.periodNumber);
      setUnit(initialLesson.unit);
      setTopic(initialLesson.topic);
      setWhatYouWillLearn(initialLesson.whatYouWillLearn);
      setWhatWasTaught(initialLesson.whatWasTaught);
      setScenarioTitle(initialLesson.realLifeSituation.title);
      setScenarioText(initialLesson.realLifeSituation.scenario);
      setConnectionToCode(initialLesson.realLifeSituation.connectionToCode);
      setConceptExplanation(initialLesson.conceptExplanation);
      setSyntax(initialLesson.syntax);
      setCode(initialLesson.code);
      setExpectedOutput(initialLesson.expectedOutput);
      setHomework(initialLesson.homework);
      setMiniChallenge(initialLesson.miniChallenge);
      if (initialLesson.predictTheOutput) {
        setPredictSnippet(initialLesson.predictTheOutput.snippet);
        setPredictOptionA(initialLesson.predictTheOutput.options[0] || '');
        setPredictOptionB(initialLesson.predictTheOutput.options[1] || '');
        setPredictOptionC(initialLesson.predictTheOutput.options[2] || '');
        setPredictOptionD(initialLesson.predictTheOutput.options[3] || '');
        setCorrectIndex(initialLesson.predictTheOutput.correctAnswerIndex);
        setPredictExplanation(initialLesson.predictTheOutput.explanation);
      }
      if (initialLesson.debugThis) {
        setBuggyCode(initialLesson.debugThis.buggyCode);
        setCommonMistakeWhy(initialLesson.debugThis.commonMistakeWhy);
        setFixedCode(initialLesson.debugThis.fixedCode);
        setDebugExplanation(initialLesson.debugThis.explanation);
      }
      if (initialLesson.teacherNotes) {
        setTeachingStrategy(initialLesson.teacherNotes.teachingStrategy);
        setSuggestedBoardFlow(initialLesson.teacherNotes.suggestedBoardFlow);
      }
    } else {
      loadMasterPlanPeriod(periodNumber);
    }
  }, [isOpen, initialLesson]);

  const loadMasterPlanPeriod = (num: number) => {
    const period = MASTER_45_PERIODS.find(p => p.periodNumber === num);
    if (period) {
      setPeriodNumber(period.periodNumber);
      setUnit(period.unit);
      setTopic(period.topic);
      setWhatYouWillLearn(period.learningObjective);
      setWhatWasTaught(period.leaveKnowing || period.teachingFocus);
      setScenarioTitle(period.realWorldAnchor ? `Real-World Anchor: ${period.realWorldAnchor.split(';')[0]}` : `Context for ${period.topic}`);
      setScenarioText(period.realWorldAnchor || period.practicalActivity);
      setConnectionToCode(period.conceptFlow || `In Python, we implement this using the concepts covered in Unit ${period.unit}.`);
      setConceptExplanation(period.conceptFlow ? `Classroom Rhythm: ${period.conceptFlow}\n\nCore Understanding: ${period.leaveKnowing || period.learningObjective}` : `Concept overview for ${period.topic}.`);
      setSyntax(period.coreSyntax || `# Python syntax for ${period.topic}`);
      setCode(period.demoCode || `# Classroom demonstration for ${period.topic}\nprint("Executed ${period.topic}")`);
      setExpectedOutput(`Demonstration code for ${period.topic}`);
      setHomework(period.practice);
      setMiniChallenge(period.practicalActivity || `Extend the example to handle edge cases.`);
      setTeachingStrategy(`Opening Question: ${period.openingQuestion || 'None'}\nClassroom Flow: ${period.conceptFlow || 'None'}\nTeacher Role: ${period.teacherRole || 'Demonstrates'}`);
      setSuggestedBoardFlow(`[Board Layout]\nLeft: Problem Context (${period.realWorldAnchor?.slice(0, 40) || 'Anchor'})\nCenter: Python Syntax & Demo Code\nRight: Execution Output Trace`);
      
      if (period.predictQuestion) {
        setPredictSnippet(period.demoCode || '');
        setPredictOptionA(period.predictQuestion.options[0] || '');
        setPredictOptionB(period.predictQuestion.options[1] || '');
        setPredictOptionC(period.predictQuestion.options[2] || '');
        setPredictOptionD(period.predictQuestion.options[3] || '');
        setCorrectIndex(period.predictQuestion.correctAnswerIndex);
        setPredictExplanation(period.predictQuestion.explanation);
      }
      if (period.debugExercise) {
        setBuggyCode(period.debugExercise.buggyCode);
        setCommonMistakeWhy(period.debugExercise.errorType);
        setFixedCode(period.debugExercise.fix);
        setDebugExplanation(period.debugExercise.hint);
      }
    }
  };

  if (!isOpen) return null;

  const buildLessonPayload = () => {
    const period = MASTER_45_PERIODS.find(p => p.periodNumber === Number(periodNumber));
    return {
      classId: targetClass,
      periodNumber: Number(periodNumber),
      unit: Number(unit),
      topic,
      status: 'published' as const,
      whatYouWillLearn,
      whatWasTaught,
      realLifeSituation: {
        title: scenarioTitle,
        scenario: scenarioText,
        connectionToCode
      },
      conceptExplanation,
      terminology: [
        { term: 'Core Concept', definition: topic },
        { term: 'Real-World Anchor', definition: scenarioTitle }
      ],
      syntax,
      examples: [
        {
          title: 'Example 1: Classroom Demonstration',
          level: 'very_simple' as const,
          code: code,
          output: expectedOutput,
          explanation: 'Demonstrates the standard syntax and core operation.'
        }
      ],
      code,
      expectedOutput,
      stepByStepExplanation: [
        'Step 1: Evaluate inputs and initialize variables.',
        'Step 2: Execute algorithmic logic and process condition or loop.',
        'Step 3: Format output cleanly to standard terminal.'
      ],
      predictTheOutput: {
        snippet: predictSnippet || `x = 5\nprint(x * 2)`,
        options: [predictOptionA || '10', predictOptionB || '52', predictOptionC || '5', predictOptionD || 'Error'],
        correctAnswerIndex: correctIndex,
        explanation: predictExplanation || 'Standard execution trace.'
      },
      modifyTheCodeChallenge: {
        originalGoal: topic,
        newGoal: 'Modify the code to handle negative numbers or empty collections.',
        hint: 'Use defensive conditional checks.'
      },
      debugThis: {
        buggyCode: buggyCode || `# Buggy snippet\nscore = "80"\nif score > 50:\n    print("Pass")`,
        commonMistakeWhy: commonMistakeWhy || 'Type mismatch or indentation error.',
        fixedCode: fixedCode || `score = 80\nif score > 50:\n    print("Pass")`,
        explanation: debugExplanation || 'Convert types before comparing and verify indentation.'
      },
      practiceQuestions: [
        {
          question: homework || `Write a program applying ${topic} to student data.`,
          type: 'basic' as const,
          solutionHint: 'Follow the classroom demonstration structure.'
        }
      ],
      miniChallenge,
      homework,
      importantPoints: [
        'Follow PEP8 indentation strictly with 4 spaces.',
        'Always check boundary conditions in logical decisions.',
        'Trace execution order before running.'
      ],
      keyTakeaways: [
        `${topic} is a core competency in Unit ${unit}.`,
        period?.leaveKnowing || 'Mastered the standard syntax and practical usage.'
      ],
      vivaQuestions: [
        {
          question: `What is the real-world application of ${topic}?`,
          expectedAnswer: period?.realWorldAnchor || `It enables modular, resilient, and performant data processing.`
        }
      ],
      teacherNotes: {
        teachingStrategy,
        openingQuestion: period?.openingQuestion,
        conceptFlow: period?.conceptFlow,
        connectsBack: period?.connectsBack,
        connectsForward: period?.connectsForward,
        teacherRole: period?.teacherRole,
        studentRole: period?.studentRole,
        questionsToAskStudents: [
          period?.openingQuestion || `What does ${topic} do?`,
          'Can we solve this problem using fewer operations?'
        ],
        expectedMisconceptions: [
          period?.debugExercise?.errorType || 'Boundary or syntax confusion'
        ],
        suggestedBoardFlow,
        classroomActivity: period?.practicalActivity || scenarioText,
        difficultyLevel: (period?.phase === 'Practical' ? 'Intermediate' : 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced',
        prerequisites: [period?.connectsBack || 'Prior unit concepts']
      }
    };
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildLessonPayload();
    storageService.publishLesson({
      ...payload,
      id: initialLesson?.id
    });
    alert(`Successfully published Period ${periodNumber} to Class ${targetClass}!`);
    onClose();
  };

  const handleSaveDraft = () => {
    const payload = buildLessonPayload();
    storageService.saveLessonDraft({
      ...payload,
      id: initialLesson?.id
    });
    alert(`Draft saved for Class ${targetClass}.`);
    onClose();
  };

  const handleDuplicate = () => {
    if (duplicateTargetClass === targetClass) {
      alert('Target class cannot be the same as current class.');
      return;
    }
    const payload = buildLessonPayload();
    const published = storageService.publishLesson(payload);
    storageService.duplicateLessonToClass(published.id, duplicateTargetClass);
    alert(`Lesson duplicated to Class ${duplicateTargetClass} as draft! You can review and publish it whenever Class ${duplicateTargetClass} reaches this period.`);
    setShowDuplicateConfirm(false);
  };

  const handleRevertToDraft = () => {
    if (!initialLesson?.id) {
      alert('This lesson is not yet saved/published.');
      return;
    }
    if (window.confirm(`Are you sure you want to REVERT Period ${periodNumber} to Draft?\n\nStudents in Class ${targetClass} will no longer see this as today's active published lesson.`)) {
      storageService.revertLessonToDraft(initialLesson.id);
      alert(`Period ${periodNumber} reverted to draft.`);
      onClose();
    }
  };

  const handleDeleteLesson = () => {
    if (!initialLesson?.id) {
      onClose();
      return;
    }
    if (window.confirm(`Permanently DELETE Period ${periodNumber} for Class ${targetClass}?\n\nThis cannot be undone.`)) {
      storageService.deleteLesson(initialLesson.id);
      alert(`Period ${periodNumber} deleted.`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-fadeIn max-h-[90vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-sky-600 to-indigo-700 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-200">
              <Sparkles className="w-4 h-4" />
              <span>Teacher Workflow</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Publish Latest Class
            </h2>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handlePublish} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
          
          {/* 1. Target Class & Period Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Target Classroom
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value as ClassId)}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-sky-600 dark:text-sky-400"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.id} - {c.name}</option>
                ))}
              </select>
              <div className="text-[10px] text-slate-400 mt-1">
                Only Class {targetClass} will see this lesson.
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Curriculum Period (1 to 45)
              </label>
              <select
                value={periodNumber}
                onChange={(e) => loadMasterPlanPeriod(Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
              >
                {MASTER_45_PERIODS.map(p => (
                  <option key={p.periodNumber} value={p.periodNumber}>
                    Period {p.periodNumber}: {p.topic.slice(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Syllabus Unit (1-5)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={unit}
                onChange={(e) => setUnit(Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
              />
            </div>
          </div>

          {/* 2. Topic Title & Objectives */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Class Topic Title
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  What You Will Learn (Objective)
                </label>
                <textarea
                  rows={2}
                  value={whatYouWillLearn}
                  onChange={(e) => setWhatYouWillLearn(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  What Was Taught (Summary)
                </label>
                <textarea
                  rows={2}
                  value={whatWasTaught}
                  onChange={(e) => setWhatWasTaught(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>
          </div>

          {/* 3. Real-life Situation */}
          <div className="p-4 rounded-2xl border border-sky-200 dark:border-sky-900 bg-sky-50/40 dark:bg-sky-950/20 space-y-3">
            <div className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Pedagogy Step 1: Real-life Situation & Connection</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Real-World Scenario Title
              </label>
              <input
                type="text"
                value={scenarioTitle}
                onChange={(e) => setScenarioTitle(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Everyday Scenario Description (Explain WHY before HOW)
              </label>
              <textarea
                rows={2}
                value={scenarioText}
                onChange={(e) => setScenarioText(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Connection to Python Code
              </label>
              <input
                type="text"
                value={connectionToCode}
                onChange={(e) => setConnectionToCode(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          {/* 4. Python Code & Output */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-sky-500" />
              <span>Core Python Code & Output</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Python Code (.py)
                </label>
                <textarea
                  rows={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-sky-300 font-mono text-xs"
                  spellCheck={false}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Expected Console Output
                </label>
                <textarea
                  rows={6}
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-emerald-300 font-mono text-xs"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          {/* 5. Homework & Mini Challenge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Homework Assignment
              </label>
              <textarea
                rows={2}
                value={homework}
                onChange={(e) => setHomework(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mini Challenge
              </label>
              <textarea
                rows={2}
                value={miniChallenge}
                onChange={(e) => setMiniChallenge(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          {/* 6. Teacher-Facing Notes (Board Flow & Strategy) */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3">
            <div className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
              Teacher Lesson Plan Deck (Visible only to Teacher)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Teaching Strategy & Questions to Ask
                </label>
                <textarea
                  rows={3}
                  value={teachingStrategy}
                  onChange={(e) => setTeachingStrategy(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Suggested Board Flow
                </label>
                <textarea
                  rows={3}
                  value={suggestedBoardFlow}
                  onChange={(e) => setSuggestedBoardFlow(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Duplicate to Another Class Option */}
          <div className="p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-indigo-900 dark:text-indigo-200 text-xs flex items-center gap-1.5">
                <Copy className="w-4 h-4 text-indigo-500" />
                <span>Duplicate Lesson to Another Class</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Duplicate this content as a draft for another class (requires explicit confirmation).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={duplicateTargetClass}
                onChange={(e) => setDuplicateTargetClass(e.target.value as ClassId)}
                className="p-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-xs font-semibold"
              >
                {classes.filter(c => c.id !== targetClass).map(c => (
                  <option key={c.id} value={c.id}>{c.id}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setShowDuplicateConfirm(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Duplicate...
              </button>
            </div>
          </div>

          {showDuplicateConfirm && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Explicit Confirmation Required</span>
              </div>
              <p>
                Are you sure you want to duplicate this lesson to <strong>Class {duplicateTargetClass}</strong>? It will be saved as a DRAFT under {duplicateTargetClass} and will not be visible to {duplicateTargetClass} students until you review and publish it.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="px-3 py-1 bg-amber-600 text-white rounded font-bold hover:bg-amber-700"
                >
                  Yes, Duplicate as Draft
                </button>
                <button
                  type="button"
                  onClick={() => setShowDuplicateConfirm(false)}
                  className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 text-xs flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save as Draft</span>
              </button>

              {initialLesson?.status === 'published' && (
                <>
                  <button
                    type="button"
                    onClick={handleRevertToDraft}
                    className="px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    title="Unpublish this lesson and revert to draft"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Revert to Draft</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteLesson}
                    className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-300/80 dark:border-rose-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    title="Delete this lesson completely"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{initialLesson?.status === 'published' ? `Update Published Lesson (${targetClass})` : `Publish Immediately to ${targetClass}`}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
