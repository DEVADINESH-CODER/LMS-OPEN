import React, { useState, useEffect } from 'react';
import { useClass } from '../../context/ClassContext';
import { storageService } from '../../lib/storage-provider';
import { ClassProgress, ClassId } from '../../types';
import { 
  TrendingUp, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  FileText, 
  Calendar, 
  Plus, 
  Trash2,
  Sparkles
} from 'lucide-react';

export const ProgressTrackingView: React.FC = () => {
  const { classes, activeClassId, setActiveClassId } = useClass();
  const [progress, setProgress] = useState<ClassProgress>(storageService.getClassProgress(activeClassId));
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [currentPeriod, setCurrentPeriod] = useState(progress.currentPeriod);
  const [currentUnit, setCurrentUnit] = useState(progress.currentUnit);
  const [currentTopic, setCurrentTopic] = useState(progress.currentTopic);
  const [studentDifficulties, setStudentDifficulties] = useState(progress.studentDifficulties);
  const [practiceGiven, setPracticeGiven] = useState(progress.practiceGiven);
  const [homework, setHomework] = useState(progress.homework);
  const [teacherObservations, setTeacherObservations] = useState(progress.teacherObservations);
  const [nextRecommendedPeriod, setNextRecommendedPeriod] = useState(progress.nextRecommendedPeriod);

  // List states
  const [understoodList, setUnderstoodList] = useState<string[]>(progress.conceptsUnderstood);
  const [newUnderstood, setNewUnderstood] = useState('');

  const [reinforceList, setReinforceList] = useState<string[]>(progress.conceptsRequiringReinforcement);
  const [newReinforce, setNewReinforce] = useState('');

  const [questionsList, setQuestionsList] = useState<string[]>(progress.questionsAsked);
  const [newQuestion, setNewQuestion] = useState('');

  // Reload whenever activeClassId changes
  useEffect(() => {
    const fresh = storageService.getClassProgress(activeClassId);
    setProgress(fresh);
    setCurrentPeriod(fresh.currentPeriod);
    setCurrentUnit(fresh.currentUnit);
    setCurrentTopic(fresh.currentTopic);
    setStudentDifficulties(fresh.studentDifficulties);
    setPracticeGiven(fresh.practiceGiven);
    setHomework(fresh.homework);
    setTeacherObservations(fresh.teacherObservations);
    setNextRecommendedPeriod(fresh.nextRecommendedPeriod);
    setUnderstoodList(fresh.conceptsUnderstood);
    setReinforceList(fresh.conceptsRequiringReinforcement);
    setQuestionsList(fresh.questionsAsked);
    setSavedSuccess(false);
  }, [activeClassId]);

  const handleAddUnderstood = () => {
    if (!newUnderstood.trim()) return;
    setUnderstoodList([...understoodList, newUnderstood.trim()]);
    setNewUnderstood('');
  };

  const handleRemoveUnderstood = (idx: number) => {
    setUnderstoodList(understoodList.filter((_, i) => i !== idx));
  };

  const handleAddReinforce = () => {
    if (!newReinforce.trim()) return;
    setReinforceList([...reinforceList, newReinforce.trim()]);
    setNewReinforce('');
  };

  const handleRemoveReinforce = (idx: number) => {
    setReinforceList(reinforceList.filter((_, i) => i !== idx));
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    setQuestionsList([...questionsList, newQuestion.trim()]);
    setNewQuestion('');
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestionsList(questionsList.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated = storageService.updateClassProgress(activeClassId, {
      currentPeriod: Number(currentPeriod),
      currentUnit: Number(currentUnit),
      currentTopic,
      conceptsUnderstood: understoodList,
      conceptsRequiringReinforcement: reinforceList,
      studentDifficulties,
      questionsAsked: questionsList,
      practiceGiven,
      homework,
      teacherObservations,
      nextRecommendedPeriod: Number(nextRecommendedPeriod)
    });

    setProgress(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fadeIn">
      
      {/* Header & Class Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Independent Progress Tracker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log pedagogy observations, student difficulties, and concepts needing reinforcement.
          </p>
        </div>

        {/* Class Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold self-start sm:self-auto">
          {classes.map(c => {
            const isActive = c.id === activeClassId;
            return (
              <button
                key={c.id}
                onClick={() => setActiveClassId(c.id)}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {c.id}
              </button>
            );
          })}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-fadeIn font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Progress records for Class {activeClassId} updated successfully!</span>
        </div>
      )}

      {/* Main Progress Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs sm:text-sm">
        
        {/* Curricular Milestones */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-sm">
            <TrendingUp className="w-4 h-4 text-sky-500" />
            <span>Classroom Curriculum Milestones</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Current Active Period
              </label>
              <input
                type="number"
                min={1}
                max={45}
                value={currentPeriod}
                onChange={(e) => setCurrentPeriod(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-sky-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Current Unit (1 to 5)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={currentUnit}
                onChange={(e) => setCurrentUnit(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Next Recommended Period
              </label>
              <input
                type="number"
                min={1}
                max={45}
                value={nextRecommendedPeriod}
                onChange={(e) => setNextRecommendedPeriod(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              Current In-Progress Topic
            </label>
            <input
              type="text"
              value={currentTopic}
              onChange={(e) => setCurrentTopic(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
            />
          </div>
        </div>

        {/* Dynamic Concept Lists: Understood vs Needing Reinforcement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Concepts Understood */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Concepts Firmly Understood</span>
            </div>

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Add understood concept..."
                value={newUnderstood}
                onChange={(e) => setNewUnderstood(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUnderstood(); } }}
                className="flex-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
              <button
                type="button"
                onClick={handleAddUnderstood}
                className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 pt-2">
              {understoodList.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 text-xs text-slate-800 dark:text-slate-200">
                  <span>• {item}</span>
                  <button type="button" onClick={() => handleRemoveUnderstood(idx)} className="text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Concepts Requiring Reinforcement */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Concepts Requiring Reinforcement</span>
            </div>

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Add concept to reinforce..."
                value={newReinforce}
                onChange={(e) => setNewReinforce(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddReinforce(); } }}
                className="flex-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
              <button
                type="button"
                onClick={handleAddReinforce}
                className="p-2 rounded-xl bg-amber-600 text-white hover:bg-amber-500"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 pt-2">
              {reinforceList.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 text-xs text-slate-800 dark:text-slate-200">
                  <span>• {item}</span>
                  <button type="button" onClick={() => handleRemoveReinforce(idx)} className="text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Student Difficulties & Teacher Observations */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Observed Student Difficulties & Pitfalls
              </label>
              <textarea
                rows={4}
                value={studentDifficulties}
                onChange={(e) => setStudentDifficulties(e.target.value)}
                placeholder="e.g. Students confused loop condition termination; forgot increment step in while loop..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Faculty Pedagogical Observations
              </label>
              <textarea
                rows={4}
                value={teacherObservations}
                onChange={(e) => setTeacherObservations(e.target.value)}
                placeholder="e.g. Pace was adequate. Need to conduct a 5-minute board spot quiz at beginning of next session..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Practice Sheets Given to {activeClassId}
              </label>
              <input
                type="text"
                value={practiceGiven}
                onChange={(e) => setPracticeGiven(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Homework Assigned
              </label>
              <input
                type="text"
                value={homework}
                onChange={(e) => setHomework(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Progress for {activeClassId}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
