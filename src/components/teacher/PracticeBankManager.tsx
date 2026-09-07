import React, { useState, useMemo } from 'react';
import { storageService } from '../../lib/storage-provider';
import { PracticeQuestion } from '../../types';
import { CodeRunner } from '../common/CodeRunner';
import { 
  Code2, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  X, 
  Terminal, 
  Bug, 
  BrainCircuit, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Sparkles, 
  AlertCircle,
  BookOpen,
  ArrowRight,
  Layers
} from 'lucide-react';

interface PracticeBankManagerProps {
  onPreviewStudentMode?: () => void;
}

export const PracticeBankManager: React.FC<PracticeBankManagerProps> = ({ onPreviewStudentMode }) => {
  // Data state
  const [questions, setQuestions] = useState<PracticeQuestion[]>(() => storageService.getPracticeQuestions());
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // Card Expansion state
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<PracticeQuestion | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form input state
  const [formUnit, setFormUnit] = useState<number>(1);
  const [formTopic, setFormTopic] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'basic' | 'standard' | 'challenge'>('basic');
  const [formType, setFormType] = useState<PracticeQuestion['type']>('coding');
  const [formTitle, setFormTitle] = useState('');
  const [formStatement, setFormStatement] = useState('');
  const [formStarterCode, setFormStarterCode] = useState('');
  const [formSolutionCode, setFormSolutionCode] = useState('');
  const [formExpectedOutput, setFormExpectedOutput] = useState('');
  const [formHints, setFormHints] = useState<string[]>(['']);
  const [formExplanation, setFormExplanation] = useState('');
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Reload questions helper
  const reloadQuestions = () => {
    setQuestions(storageService.getPracticeQuestions());
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Open modal for new question
  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setFormUnit(1);
    setFormTopic('');
    setFormDifficulty('basic');
    setFormType('coding');
    setFormTitle('');
    setFormStatement('');
    setFormStarterCode('');
    setFormSolutionCode('');
    setFormExpectedOutput('');
    setFormHints(['']);
    setFormExplanation('');
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Open modal for editing question
  const handleOpenEditModal = (q: PracticeQuestion) => {
    setEditingQuestion(q);
    setFormUnit(q.unit);
    setFormTopic(q.topic);
    setFormDifficulty(q.difficulty);
    setFormType(q.type);
    setFormTitle(q.title);
    setFormStatement(q.problemStatement);
    setFormStarterCode(q.starterCode || '');
    setFormSolutionCode(q.solutionCode || '');
    setFormExpectedOutput(q.expectedOutput || '');
    setFormHints(q.hints && q.hints.length > 0 ? [...q.hints] : ['']);
    setFormExplanation(q.explanation || '');
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Duplicate question as a new template
  const handleDuplicate = (q: PracticeQuestion) => {
    setEditingQuestion(null);
    setFormUnit(q.unit);
    setFormTopic(`${q.topic} (Copy)`);
    setFormDifficulty(q.difficulty);
    setFormType(q.type);
    setFormTitle(`${q.title} (Copy)`);
    setFormStatement(q.problemStatement);
    setFormStarterCode(q.starterCode || '');
    setFormSolutionCode(q.solutionCode || '');
    setFormExpectedOutput(q.expectedOutput || '');
    setFormHints(q.hints && q.hints.length > 0 ? [...q.hints] : ['']);
    setFormExplanation(q.explanation || '');
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Delete question
  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    try {
      storageService.deletePracticeQuestion(deleteConfirmId);
      reloadQuestions();
      setDeleteConfirmId(null);
      showToast('Practice question deleted successfully.');
    } catch (err: any) {
      alert(err.message || 'Error deleting question.');
    }
  };

  // Save question (Create or Update)
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Question title is required.');
      return;
    }
    if (!formStatement.trim()) {
      setFormError('Problem statement is required.');
      return;
    }
    if (!formTopic.trim()) {
      setFormError('Topic is required.');
      return;
    }

    const cleanHints = formHints.map(h => h.trim()).filter(Boolean);

    try {
      if (editingQuestion) {
        // Update
        storageService.updatePracticeQuestion(editingQuestion.id, {
          unit: formUnit,
          topic: formTopic.trim(),
          difficulty: formDifficulty,
          type: formType,
          title: formTitle.trim(),
          problemStatement: formStatement.trim(),
          starterCode: formStarterCode.trim() || undefined,
          solutionCode: formSolutionCode.trim() || undefined,
          expectedOutput: formExpectedOutput.trim() || undefined,
          hints: cleanHints.length > 0 ? cleanHints : ['Think through the logic step-by-step.'],
          explanation: formExplanation.trim() || 'Review the core language syntax and logic rules.'
        });
        showToast(`Updated "${formTitle.trim()}" successfully.`);
      } else {
        // Create new
        storageService.addPracticeQuestion({
          unit: formUnit,
          periodNumber: 1,
          topic: formTopic.trim(),
          difficulty: formDifficulty,
          type: formType,
          title: formTitle.trim(),
          problemStatement: formStatement.trim(),
          starterCode: formStarterCode.trim() || undefined,
          solutionCode: formSolutionCode.trim() || undefined,
          expectedOutput: formExpectedOutput.trim() || undefined,
          hints: cleanHints.length > 0 ? cleanHints : ['Trace each variable value step by step.'],
          explanation: formExplanation.trim() || 'Fundamental Python programming principle.'
        });
        showToast(`Created new practice question "${formTitle.trim()}" successfully.`);
      }

      reloadQuestions();
      setIsFormModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Error saving question.');
    }
  };

  // Add hint input line
  const handleAddHintField = () => {
    setFormHints(prev => [...prev, '']);
  };

  // Remove hint input line
  const handleRemoveHintField = (index: number) => {
    setFormHints(prev => prev.filter((_, i) => i !== index));
  };

  // Update specific hint
  const handleUpdateHint = (index: number, val: string) => {
    setFormHints(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  // Filtered list of questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchUnit = selectedUnit === 'all' || q.unit === selectedUnit;
      const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      const matchType = selectedType === 'all' || q.type === selectedType;
      
      const qLower = searchQuery.toLowerCase().trim();
      const matchSearch = !qLower || 
        q.title.toLowerCase().includes(qLower) || 
        q.problemStatement.toLowerCase().includes(qLower) ||
        q.topic.toLowerCase().includes(qLower) ||
        q.id.toLowerCase().includes(qLower);

      return matchUnit && matchDiff && matchType && matchSearch;
    });
  }, [questions, selectedUnit, selectedDifficulty, selectedType, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = questions.length;
    const byUnit = {
      1: questions.filter(q => q.unit === 1).length,
      2: questions.filter(q => q.unit === 2).length,
      3: questions.filter(q => q.unit === 3).length,
      4: questions.filter(q => q.unit === 4).length,
      5: questions.filter(q => q.unit === 5).length,
    };
    const basic = questions.filter(q => q.difficulty === 'basic').length;
    const standard = questions.filter(q => q.difficulty === 'standard').length;
    const challenge = questions.filter(q => q.difficulty === 'challenge').length;
    return { total, byUnit, basic, standard, challenge };
  }, [questions]);

  const getTypeBadge = (type: PracticeQuestion['type']) => {
    switch (type) {
      case 'output_prediction':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Terminal className="w-3 h-3" />
            <span>Output Prediction</span>
          </span>
        );
      case 'debugging':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <Bug className="w-3 h-3" />
            <span>Debugging</span>
          </span>
        );
      case 'logic_building':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
            <BrainCircuit className="w-3 h-3" />
            <span>Logic Building</span>
          </span>
        );
      case 'coding':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <Code2 className="w-3 h-3" />
            <span>Coding Challenge</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-fadeIn">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-slate-800 text-white p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Dynamic Problem Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Python Practice Bank Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Fully dynamic question repository. Add new coding problems, output drills, and debugging challenges, or modify and delete existing problems in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onPreviewStudentMode && (
              <button
                onClick={onPreviewStudentMode}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 border border-slate-700"
              >
                <Eye className="w-4 h-4 text-sky-400" />
                <span>Student Preview</span>
              </button>
            )}

            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-extrabold transition-all shadow-lg shadow-sky-500/25 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Practice Problem</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-lg font-black text-sky-400">{stats.total}</div>
            <div className="text-[10px] text-slate-400 font-medium">Total Problems</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-lg font-black text-amber-400">{stats.byUnit[1]}</div>
            <div className="text-[10px] text-slate-400 font-medium">Unit 1 Problems</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-lg font-black text-purple-400">{stats.byUnit[2]}</div>
            <div className="text-[10px] text-slate-400 font-medium">Unit 2 Problems</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-lg font-black text-emerald-400">{stats.byUnit[3]}</div>
            <div className="text-[10px] text-slate-400 font-medium">Unit 3 Problems</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-lg font-black text-teal-400">{stats.byUnit[4]}</div>
            <div className="text-[10px] text-slate-400 font-medium">Unit 4 Problems</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-lg font-black text-rose-400">{stats.byUnit[5]}</div>
            <div className="text-[10px] text-slate-400 font-medium">Unit 5 Problems</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problems by title, topic, statement, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Unit Filter */}
          <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {(['all', 1, 2, 3, 4, 5] as const).map((u) => (
              <button
                key={u}
                onClick={() => setSelectedUnit(u)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedUnit === u
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {u === 'all' ? 'All Units' : `Unit ${u}`}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters: Difficulty & Type */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-semibold">Difficulty:</span>
            {(['all', 'basic', 'standard', 'challenge'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  selectedDifficulty === d
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-semibold">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Types</option>
              <option value="output_prediction">Output Prediction</option>
              <option value="debugging">Debugging</option>
              <option value="logic_building">Logic Building</option>
              <option value="coding">Coding Challenge</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problems Counter Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>Showing <strong>{filteredQuestions.length}</strong> of {questions.length} practice problems</span>
        {(selectedUnit !== 'all' || selectedDifficulty !== 'all' || selectedType !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedUnit('all');
              setSelectedDifficulty('all');
              setSelectedType('all');
              setSearchQuery('');
            }}
            className="text-sky-600 dark:text-sky-400 hover:underline font-bold"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
            <Code2 className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No practice questions found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No questions matched your current filter criteria. You can create a new problem using the button below.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Problem</span>
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;

            return (
              <div
                key={q.id}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all overflow-hidden"
              >
                {/* Card Main Row */}
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {q.id}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                        Unit {q.unit}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        q.difficulty === 'basic'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : q.difficulty === 'standard'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}>
                        {q.difficulty}
                      </span>
                      {getTypeBadge(q.type)}
                      <span className="text-xs text-slate-400 font-medium">
                        • {q.topic}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 truncate">
                      {q.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {q.problemStatement}
                    </p>
                  </div>

                  {/* Actions Button Group */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenEditModal(q)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                      title="Edit Question"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-sky-500" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDuplicate(q)}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      title="Duplicate as Template"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(q.id)}
                      className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 text-xs font-bold flex items-center gap-1 hover:bg-sky-100 transition-colors"
                    >
                      <span>{isExpanded ? 'Collapse' : 'Preview'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Question Preview Deck */}
                {isExpanded && (
                  <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4 animate-fadeIn text-xs">
                    {/* Problem Statement Full */}
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-1">
                        Full Problem Description:
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {q.problemStatement}
                      </p>
                    </div>

                    {/* Starter Code if exists */}
                    {q.starterCode && (
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-1 flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-sky-500" />
                          <span>Student Starter Code:</span>
                        </div>
                        <pre className="p-3.5 rounded-2xl bg-slate-900 text-sky-300 font-mono text-xs overflow-x-auto">
                          {q.starterCode}
                        </pre>
                      </div>
                    )}

                    {/* Solution Code */}
                    {q.solutionCode && (
                      <div>
                        <div className="font-bold text-emerald-900 dark:text-emerald-300 text-xs mb-1 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Reference Model Solution:</span>
                        </div>
                        <pre className="p-3.5 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto">
                          {q.solutionCode}
                        </pre>
                      </div>
                    )}

                    {/* Expected Output */}
                    {q.expectedOutput && (
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-1 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-amber-500" />
                          <span>Expected Execution Output:</span>
                        </div>
                        <pre className="p-2.5 rounded-xl bg-slate-800 text-amber-200 font-mono text-xs overflow-x-auto">
                          {q.expectedOutput}
                        </pre>
                      </div>
                    )}

                    {/* Hints */}
                    {q.hints && q.hints.length > 0 && (
                      <div>
                        <div className="font-bold text-amber-800 dark:text-amber-300 text-xs mb-1 flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          <span>Scaffolded Hints:</span>
                        </div>
                        <ul className="space-y-1">
                          {q.hints.map((hint, hIdx) => (
                            <li key={hIdx} className="text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                              <span className="text-amber-500 font-bold">•</span>
                              <span>{hint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-slate-700 dark:text-slate-300">
                        <strong className="text-sky-700 dark:text-sky-300">Pedagogical Concept Note: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT PRACTICE QUESTION                                    */}
      {/* ========================================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  {editingQuestion ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {editingQuestion ? 'Edit Practice Problem' : 'Create New Practice Problem'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingQuestion ? `Editing ID: ${editingQuestion.id}` : 'This problem will immediately appear in the student Practice Center.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveQuestion} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Unit, Difficulty, Type Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Unit */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Syllabus Unit *
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    <option value={1}>Unit 1: Data Types & Statements</option>
                    <option value={2}>Unit 2: Control Flow & Functions</option>
                    <option value={3}>Unit 3: Lists, Tuples, Dicts</option>
                    <option value={4}>Unit 4: Files & Modules</option>
                    <option value={5}>Unit 5: NumPy & Pandas</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Difficulty Level *
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold capitalize"
                  >
                    <option value="basic">Basic (Foundational)</option>
                    <option value="standard">Standard (Classroom Level)</option>
                    <option value="challenge">Challenge (Advanced)</option>
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Problem Type *
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    <option value="coding">Coding Challenge</option>
                    <option value="output_prediction">Output Prediction</option>
                    <option value="debugging">Debugging Defect</option>
                    <option value="logic_building">Logic Building</option>
                  </select>
                </div>
              </div>

              {/* Title & Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swapping Without Temporary Variable"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Concept / Topic Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tuple Assignment & Memory"
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Problem Statement */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Problem Statement / Challenge Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Clearly describe the objective, input specifications, and requirements..."
                  value={formStatement}
                  onChange={(e) => setFormStatement(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 leading-relaxed font-sans"
                />
              </div>

              {/* Starter Code (Optional) */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 flex items-center justify-between">
                  <span>Starter Code for Students (Optional):</span>
                  <span className="text-[10px] text-slate-400 font-normal">Pre-filled in code editor</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="# Write initial scaffolding or buggy code here..."
                  value={formStarterCode}
                  onChange={(e) => setFormStarterCode(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 text-sky-300 font-mono text-xs leading-relaxed"
                />
              </div>

              {/* Reference Solution Code */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 flex items-center justify-between">
                  <span>Model Solution Code:</span>
                  <span className="text-[10px] text-slate-400 font-normal">Visible after student attempts or checks solution</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="def solve():&#10;    # Write clean reference Python code..."
                  value={formSolutionCode}
                  onChange={(e) => setFormSolutionCode(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs leading-relaxed"
                />
              </div>

              {/* Expected Output */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Expected Execution Output (Console text):
                </label>
                <input
                  type="text"
                  placeholder="e.g. a = 20, b = 10"
                  value={formExpectedOutput}
                  onChange={(e) => setFormExpectedOutput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              {/* Scaffolded Hints */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">
                    Scaffolded Hints:
                  </label>
                  <button
                    type="button"
                    onClick={handleAddHintField}
                    className="text-sky-600 dark:text-sky-400 hover:underline text-[11px] font-bold"
                  >
                    + Add Another Hint
                  </button>
                </div>
                {formHints.map((hint, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Hint #${idx + 1}`}
                      value={hint}
                      onChange={(e) => handleUpdateHint(idx, e.target.value)}
                      className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                    {formHints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveHintField(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Concept Takeaway / Explanation:
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why this solution works and what common mistake to avoid..."
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-md shadow-sky-600/25"
                >
                  {editingQuestion ? 'Save Changes' : 'Publish Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CONFIRMATION DIALOG                                         */}
      {/* ========================================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-300 dark:border-rose-900/60 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950/60">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold">Delete Practice Problem?</h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete problem <strong>{deleteConfirmId}</strong>? It will be immediately removed from the Practice Bank and will no longer appear in student practice centers.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200"
              >
                Keep Problem
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
