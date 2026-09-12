import React, { useState } from 'react';
import { Sparkles, ShieldCheck, ArrowRight, UserCheck, LogOut, AlertCircle, Smartphone, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onStartAssessment: () => void;
  onViewReport: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onStartAssessment,
  onViewReport
}) => {
  const { user, account, signInWithGoogle, signInDirectLearner, logout, hasCompletedAssessment, latestSubmission, loading } = useAuth();
  const [directName, setDirectName] = useState('');
  const [directEmail, setDirectEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directName.trim() || !directEmail.trim()) {
      setErrorMsg('Please enter both your name and email address.');
      return;
    }
    if (!directEmail.includes('@') || !directEmail.includes('.')) {
      setErrorMsg('Please enter a valid email format.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      await signInDirectLearner(directName.trim(), directEmail.trim());
    } catch (e: any) {
      setErrorMsg(e?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          {user ? 'Account Authenticated' : 'Learner Portal Login'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
          {user
            ? 'Your account is linked to the AI Career Readiness Self-Assessment portal across your devices.'
            : 'Sign in to access your assessment, track your readiness scores, and claim your Masterclass pass.'}
        </p>

        {user ? (
          <div className="space-y-5">
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl text-left space-y-2">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full border border-slate-700" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm font-bold">
                    {(user.displayName || 'U').charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-slate-100">
                    {user.displayName || 'Participant'}
                  </div>
                  <div className="text-xs text-slate-400 truncate max-w-[200px]">
                    {user.email}
                  </div>
                </div>
              </div>

              {account?.deviceDescription && (
                <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="text-slate-500">Device:</span>
                  <span className="text-slate-300 font-medium">{account.deviceDescription}</span>
                </div>
              )}

              {hasCompletedAssessment && latestSubmission && (
                <div className="pt-2 border-t border-slate-700/60 text-xs text-slate-300 flex justify-between items-center">
                  <span>Latest Readiness Score:</span>
                  <span className="font-bold text-blue-400">{latestSubmission.overallScore}/100 ({latestSubmission.readinessBand})</span>
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              {hasCompletedAssessment ? (
                <button
                  id="account-view-report-btn"
                  onClick={onViewReport}
                  className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>View Latest Report</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="account-start-assessment-btn"
                  onClick={onStartAssessment}
                  className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Start Self-Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={logout}
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 text-left">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Google Login Option */}
            <button
              id="google-login-btn"
              onClick={() => signInWithGoogle()}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-3 shadow-md cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-semibold">
                <span className="bg-slate-900 px-3 text-slate-500">
                  OR DIRECT LOGIN (ANY DEVICE & BROWSER)
                </span>
              </div>
            </div>

            {/* Direct 1-Click Form */}
            <form onSubmit={handleDirectSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={directName}
                  onChange={(e) => setDirectName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={directEmail}
                  onChange={(e) => setDirectEmail(e.target.value)}
                  placeholder="e.g. alex@company.com"
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <span>{submitting ? 'Connecting...' : '1-Click Direct Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Works seamlessly across iOS Safari, Android, Chrome & Edge</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
