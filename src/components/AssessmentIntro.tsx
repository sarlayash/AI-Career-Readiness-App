import React, { useState, useEffect } from 'react';
import { 
  LogIn, 
  CheckSquare, 
  AlertCircle, 
  ArrowRight, 
  User, 
  Briefcase, 
  GraduationCap, 
  Target, 
  Layers, 
  FileText,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  CAREER_GOALS, 
  DOMAINS, 
  EDUCATION_LEVELS, 
  EXPERIENCE_LEVELS, 
  PARTICIPANT_CATEGORIES 
} from '../config/defaultConfigs';
import { AssessmentConfig, UserProfile } from '../types/assessment';

interface AssessmentIntroProps {
  config: AssessmentConfig;
  onProceedToQuestions: (profile: UserProfile, consent: boolean) => void;
  onViewExistingReport: () => void;
  onRetake: () => void;
}

export const AssessmentIntro: React.FC<AssessmentIntroProps> = ({
  config,
  onProceedToQuestions,
  onViewExistingReport,
  onRetake
}) => {
  const { user, hasCompletedAssessment, latestSubmission, signInWithGoogle, signInDirectLearner } = useAuth();

  const [fullName, setFullName] = useState(user?.displayName || '');
  const [participantCategory, setParticipantCategory] = useState(PARTICIPANT_CATEGORIES[4]); // Working professional default
  const [educationLevel, setEducationLevel] = useState(EDUCATION_LEVELS[2]); // Undergraduate default
  const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_LEVELS[2]); // 1-3 years default
  const [currentDomain, setCurrentDomain] = useState(DOMAINS[0]); // IT / Software default
  const [primaryCareerGoal, setPrimaryCareerGoal] = useState(CAREER_GOALS[1]); // Improve employability default
  const [consent, setConsent] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Direct 1-click registration state for any device/browser
  const [directName, setDirectName] = useState('');
  const [directEmail, setDirectEmail] = useState('');
  const [directSubmitting, setDirectSubmitting] = useState(false);
  const [directError, setDirectError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.displayName && !fullName) {
      setFullName(user.displayName);
    }
  }, [user]);

  // Already completed assessment check
  if (hasCompletedAssessment && latestSubmission) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            You have already completed this assessment.
          </h2>

          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            Your submission from {new Date(latestSubmission.submittedAt).toLocaleDateString()} scored{' '}
            <strong className="text-blue-400 font-semibold">{latestSubmission.overallScore}/100</strong> ({latestSubmission.readinessBand}).
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="view-completed-report-btn"
              onClick={onViewExistingReport}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>View My Report</span>
            </button>

            {config.retakesEnabled && (
              <button
                id="retake-assessment-btn"
                onClick={onRetake}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Assessment</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleDirectRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directName.trim() || !directEmail.trim()) {
      setDirectError('Please provide both your full name and valid email address.');
      return;
    }
    if (!directEmail.includes('@') || !directEmail.includes('.')) {
      setDirectError('Please provide a valid email format.');
      return;
    }

    setDirectSubmitting(true);
    setDirectError(null);
    try {
      await signInDirectLearner(directName.trim(), directEmail.trim());
    } catch (err: any) {
      setDirectError(err.message || 'Registration failed. Please try again.');
    } finally {
      setDirectSubmitting(false);
    }
  };

  // Not signed in with Google or direct account yet
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            AI Career Readiness Assessment
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
            Begin your confidential evaluation. You can log in from any phone, tablet, laptop, or desktop browser.
          </p>

          {/* Option A: 1-Click Google Sign-In */}
          <button
            id="intro-google-signin-btn"
            onClick={() => signInWithGoogle()}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all flex items-center justify-center gap-3 shadow-md"
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
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
              <span className="bg-slate-900 px-3 text-slate-500">
                OR 1-CLICK REGISTER ON ANY DEVICE
              </span>
            </div>
          </div>

          {/* Option B: 1-Click Direct Learner Register (Works on ANY device, mobile, safari, without popups) */}
          <form onSubmit={handleDirectRegister} className="space-y-3 text-left">
            {directError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{directError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Full Name
              </label>
              <input
                id="direct-register-name"
                type="text"
                value={directName}
                onChange={(e) => setDirectName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Email Address
              </label>
              <input
                id="direct-register-email"
                type="email"
                value={directEmail}
                onChange={(e) => setDirectEmail(e.target.value)}
                placeholder="e.g. sarah@company.com"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <button
              id="intro-direct-register-btn"
              type="submit"
              disabled={directSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 cursor-pointer"
            >
              <span>{directSubmitting ? 'Registering...' : '1-Click Start Assessment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center pt-1">
              <span>✓ Instant access</span>
              <span>•</span>
              <span>✓ All mobile & desktop browsers</span>
              <span>•</span>
              <span>✓ No popups required</span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setErrorMsg('Please confirm your consent before proceeding to the assessment.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name for your personalized report.');
      return;
    }

    const profile: UserProfile = {
      fullName: fullName.trim(),
      email: user.email || '',
      participantCategory,
      educationLevel,
      experienceLevel,
      currentDomain,
      primaryCareerGoal
    };

    onProceedToQuestions(profile, consent);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl">
        {/* Intro Header */}
        <div className="mb-8 border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assessment Briefing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Your AI Career Readiness Check
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            This assessment is designed to help you reflect on your familiarity with AI, your practical usage, your ability to apply it to your domain, and your readiness to keep learning.
          </p>

          {/* Guidelines Box */}
          <div className="mt-5 bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-slate-200">Assessment Guidelines:</div>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>There are no right or wrong answers in reflection questions.</li>
              <li>Honest answers produce a more accurate and useful report.</li>
              <li>Some scenario questions evaluate practical judgment and ethical boundary setting.</li>
              <li>The result is an indicative self-assessment.</li>
              <li>It is not a professional certification or scientific psychometric test.</li>
              <li>It is not a definitive measure of employability or intelligence.</li>
            </ul>
          </div>
        </div>

        {/* Profile Collection Form */}
        <form onSubmit={handleStart} className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-slate-200 mb-1 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              Participant Profile
            </h2>
            <p className="text-xs text-slate-400">
              This non-sensitive information tailors the recommendations to your career stage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="profile-fullName" className="block text-xs font-medium text-slate-300 mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                id="profile-fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name"
              />
            </div>

            {/* Email (Readonly from Google) */}
            <div>
              <label htmlFor="profile-email" className="block text-xs font-medium text-slate-300 mb-1">
                Authenticated Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={user.email || ''}
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/60 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>

            {/* Participant Category */}
            <div>
              <label htmlFor="profile-category" className="block text-xs font-medium text-slate-300 mb-1">
                Participant Category <span className="text-red-400">*</span>
              </label>
              <select
                id="profile-category"
                value={participantCategory}
                onChange={(e) => setParticipantCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PARTICIPANT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Education Level */}
            <div>
              <label htmlFor="profile-education" className="block text-xs font-medium text-slate-300 mb-1">
                Education Level <span className="text-red-400">*</span>
              </label>
              <select
                id="profile-education"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {EDUCATION_LEVELS.map((edu) => (
                  <option key={edu} value={edu}>{edu}</option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label htmlFor="profile-experience" className="block text-xs font-medium text-slate-300 mb-1">
                Experience Level <span className="text-red-400">*</span>
              </label>
              <select
                id="profile-experience"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {EXPERIENCE_LEVELS.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            {/* Current Domain */}
            <div>
              <label htmlFor="profile-domain" className="block text-xs font-medium text-slate-300 mb-1">
                Current Domain <span className="text-red-400">*</span>
              </label>
              <select
                id="profile-domain"
                value={currentDomain}
                onChange={(e) => setCurrentDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DOMAINS.map((dom) => (
                  <option key={dom} value={dom}>{dom}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary Career Goal */}
          <div>
            <label htmlFor="profile-career-goal" className="block text-xs font-medium text-slate-300 mb-1">
              Primary Career Goal <span className="text-red-400">*</span>
            </label>
            <select
              id="profile-career-goal"
              value={primaryCareerGoal}
              onChange={(e) => setPrimaryCareerGoal(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CAREER_GOALS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Mandatory Consent Checkbox */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id="consent-checkbox"
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (e.target.checked) setErrorMsg(null);
                }}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs text-slate-300 leading-normal">
                <strong className="text-slate-100">Mandatory Consent:</strong> I understand the purpose of this assessment and agree to submit my responses.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id="analytics-consent-checkbox"
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs text-slate-400 leading-normal">
                I agree to allow anonymized responses to support aggregate educational research and program improvements.
              </span>
            </label>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              id="start-questions-btn"
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Begin Assessment Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
