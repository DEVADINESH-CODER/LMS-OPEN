import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { storageService } from '../../lib/storage-provider';
import { ClassId, Student } from '../../types';
import { 
  Users, 
  UserPlus, 
  Upload, 
  Download, 
  Search, 
  KeyRound, 
  Power, 
  Edit2, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  X,
  FileSpreadsheet
} from 'lucide-react';

export const StudentManagementView: React.FC = () => {
  const { classes, activeClassId } = useClass();
  const [selectedClassFilter, setSelectedClassFilter] = useState<ClassId | 'all'>(activeClassId);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [resetPinResult, setResetPinResult] = useState<{ student: Student; tempPin: string } | null>(null);

  // Add student form state
  const [newRegNo, setNewRegNo] = useState('');
  const [newName, setNewName] = useState('');
  const [newClassId, setNewClassId] = useState<ClassId>(activeClassId);
  const [newInitialPin, setNewInitialPin] = useState('1234');
  const [addError, setAddError] = useState<string | null>(null);

  // CSV Import state
  const [csvText, setCsvText] = useState('');
  const [csvResult, setCsvResult] = useState<{ imported: number; skipped: number; errors: string[] } | null>(null);

  const [students, setStudents] = useState<Student[]>(storageService.getStudents());

  const refreshList = () => {
    setStudents(storageService.getStudents());
  };

  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.registerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (s.email ? s.email.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
                         s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesQuery;
  });

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    try {
      await storageService.addStudent({
        registerNumber: newRegNo,
        name: newName,
        classId: newClassId,
        initialPin: newInitialPin
      });
      setNewRegNo('');
      setNewName('');
      setShowAddModal(false);
      refreshList();
    } catch (err: any) {
      setAddError(err.message);
    }
  };

  const handleResetPin = async (student: Student) => {
    if (confirm(`Reset PIN for ${student.name} (${student.registerNumber})? A temporary PIN will be generated and they will be forced to change it on their next login.`)) {
      const tempPin = Math.floor(1000 + Math.random() * 9000).toString();
      await storageService.resetStudentPin(student.id, tempPin);
      setResetPinResult({ student, tempPin });
      refreshList();
    }
  };

  const handleToggleActive = (student: Student) => {
    const action = student.isActive ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} ${student.name}? ${student.isActive ? 'They will immediately be locked out from logging in.' : 'They will regain access.'}`)) {
      storageService.toggleStudentActive(student.id);
      refreshList();
    }
  };

  const handleExportCsv = () => {
    const csvData = storageService.exportStudentsCsv(selectedClassFilter === 'all' ? undefined : selectedClassFilter);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `students_${selectedClassFilter}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCsv = async () => {
    if (!csvText.trim()) return;
    const res = await storageService.importStudentsCsv(csvText);
    setCsvResult(res);
    refreshList();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fadeIn">
      
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Student Identity Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage student enrollments, PIN resets, and access controls for C1 112, C2 147, and C3 091.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-sky-600/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>

          <button
            onClick={() => setShowCsvModal(true)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50"
          >
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Class Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedClassFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedClassFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Classes ({students.length})
          </button>
          {classes.map(c => {
            const count = students.filter(s => s.classId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedClassFilter(c.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedClassFilter === c.id
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {c.id} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search name, reg no, internal ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-sky-500 focus:outline-none"
          />
        </div>

      </div>

      {/* Reset PIN Notice Banner */}
      {resetPinResult && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start justify-between gap-3 animate-fadeIn">
          <div>
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Temporary PIN Generated for {resetPinResult.student.name} ({resetPinResult.student.registerNumber})</span>
            </div>
            <p className="mt-1">
              Temporary PIN: <span className="font-mono font-bold text-sm bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded text-emerald-950 dark:text-emerald-100">{resetPinResult.tempPin}</span>. 
              The student will be prompted to create a new personal PIN upon entering this temporary PIN.
            </p>
          </div>
          <button onClick={() => setResetPinResult(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Students Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Register Number</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4">Internal ID</th>
                <th className="py-3.5 px-4">PIN Status</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                    No student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {s.registerNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{s.name}</div>
                      {s.email && (
                        <div className="text-[11px] text-slate-400 font-normal">{s.email}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                        {s.classId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {s.id}
                    </td>

                    <td className="py-3.5 px-4">
                      {s.mustChangePin ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                          Must Change
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono">
                          Hashed (SHA-256)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.isActive 
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}>
                        {s.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleResetPin(s)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-amber-600 hover:bg-slate-100 dark:text-slate-400"
                          title="Reset PIN (Temporary PIN)"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleActive(s)}
                          className={`p-1.5 rounded-lg border ${
                            s.isActive
                              ? 'border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900'
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900'
                          }`}
                          title={s.isActive ? 'Deactivate Student' : 'Activate Student'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Enroll New Student
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs">{addError}</div>
            )}

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Register Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 717823P106"
                  value={newRegNo}
                  onChange={(e) => setNewRegNo(e.target.value.toUpperCase())}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assign Classroom</label>
                <select
                  value={newClassId}
                  onChange={(e) => setNewClassId(e.target.value as ClassId)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-sky-600"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.id} ({c.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Initial PIN</label>
                <input
                  type="password"
                  maxLength={8}
                  value={newInitialPin}
                  onChange={(e) => setNewInitialPin(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
                <div className="text-[10px] text-slate-400 mt-1">Student will be required to change this PIN on first login.</div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold"
                >
                  Add Student Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-sky-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Bulk CSV Import
                </h3>
              </div>
              <button onClick={() => setShowCsvModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Format: <span className="font-mono font-bold">RegisterNumber, Name, ClassId</span> (one per line).<br />
              Example: <code className="text-sky-600">717823P107, Rahul Varma, C1-112</code>
            </div>

            <textarea
              rows={6}
              placeholder={`RegisterNumber, Name, ClassId\n717823P107, Rahul Varma, C1-112\n717823P205, Sneha Reddy, C2-147`}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
            />

            {csvResult && (
              <div className="p-3 bg-sky-50 dark:bg-sky-950 text-xs rounded-xl space-y-1">
                <div className="font-bold text-sky-900 dark:text-sky-200">
                  Import Summary: {csvResult.imported} added, {csvResult.skipped} skipped.
                </div>
                {csvResult.errors.map((err, i) => (
                  <div key={i} className="text-rose-600 text-[11px]">{err}</div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCsvModal(false)}
                className="px-3 py-2 rounded-xl text-slate-500 text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleImportCsv}
                className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs"
              >
                Process CSV Import
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
