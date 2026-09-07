import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, ShieldAlert, Check, X, Lock } from 'lucide-react';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMandatory?: boolean;
}

export const ChangePinModal: React.FC<ChangePinModalProps> = ({ isOpen, onClose, isMandatory = false }) => {
  const { changePin } = useAuth();

  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPin !== confirmPin) {
      setError('New PIN and Confirm PIN do not match.');
      return;
    }

    if (newPin.length < 4 || newPin.length > 8 || !/^\d+$/.test(newPin)) {
      setError('PIN must be 4 to 8 numeric digits.');
      return;
    }

    setIsLoading(true);
    try {
      await changePin(currentPin, newPin);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to change PIN. Verify your current PIN.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className={`p-6 text-white ${isMandatory ? 'bg-amber-600' : 'bg-sky-600'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5" />
              <h3 className="font-bold text-base">
                {isMandatory ? 'Mandatory PIN Reset' : 'Change Personal PIN'}
              </h3>
            </div>
            {!isMandatory && (
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 text-white">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="text-xs text-white/90 mt-1.5 leading-relaxed">
            {isMandatory 
              ? 'Your instructor recently reset your temporary credentials. You must create a new private PIN before accessing classroom lessons.'
              : 'Choose a secure 4 to 8 digit numeric PIN. Never share your PIN with other students.'}
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="py-8 text-center text-emerald-600 dark:text-emerald-400 font-bold text-sm flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <span>Your new private PIN has been updated successfully!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Current / Temporary PIN
                </label>
                <input
                  type="password"
                  required
                  maxLength={8}
                  placeholder="Enter current PIN"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  New Private PIN
                </label>
                <input
                  type="password"
                  required
                  maxLength={8}
                  placeholder="4 to 8 digits"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Confirm New PIN
                </label>
                <input
                  type="password"
                  required
                  maxLength={8}
                  placeholder="Re-type new PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Updating PIN Hash...' : 'Save New Security PIN'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
