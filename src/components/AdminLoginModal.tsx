import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, X, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { loginAdminCredentials } = useAuth();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const ok = await loginAdminCredentials(adminId, password);
      if (ok) {
        setAdminId('');
        setPassword('');
        onSuccess();
        onClose();
      } else {
        setError('Invalid administrative credentials. Access denied.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          id="close-admin-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">
            Administrative Access
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Restricted area for authorized program administrators and researchers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="admin-id-input"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Administrator ID
            </label>
            <input
              id="admin-id-input"
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
              placeholder="Enter Admin ID"
            />
          </div>

          <div>
            <label 
              htmlFor="admin-password-input"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Security Key / Password
            </label>
            <input
              id="admin-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
              placeholder="••••••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              id="admin-auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'Verifying...' : 'Unlock Admin Portal'}</span>
            </button>
          </div>
        </form>

        <div className="mt-5 text-center">
          <p className="text-[11px] text-slate-500">
            All administrative access sessions and data exports are logged for compliance.
          </p>
        </div>
      </div>
    </div>
  );
};
