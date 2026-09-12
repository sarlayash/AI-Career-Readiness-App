import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  ShieldCheck, 
  BookOpen, 
  Cpu, 
  Briefcase, 
  TrendingUp, 
  FolderGit2,
  FileCheck2
} from 'lucide-react';
import { ASSESSMENT_QUESTIONS } from '../config/questions';
import { DIMENSIONS } from '../config/defaultConfigs';
import { 
  AssessmentConfig, 
  AssessmentQuestion, 
  AssessmentSubmission, 
  UserProfile 
} from '../types/assessment';
import { calculateAssessmentScore } from '../services/scoring';
import { generatePersonalizedActionPlan } from '../services/actionPlan';
import { saveAssessmentSubmission } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

interface AssessmentFlowProps {
  config: AssessmentConfig;
  profile: UserProfile;
  consent: boolean;
  onSubmissionComplete: (submission: AssessmentSubmission) => void;
  onCancel: () => void;
}

export const AssessmentFlow: React.FC<AssessmentFlowProps> = ({
  config,
  profile,
  consent,
  onSubmissionComplete,
  onCancel
}) => {
  const { user, refreshUserData } = useAuth();
  const questions = ASSESSMENT_QUESTIONS.filter((q) => q.active);
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const saved = sessionStorage.getItem('portal_assessment_current_index');
    return saved ? Math.min(parseInt(saved, 10), totalQuestions) : 0;
  });

  const [responses, setResponses] = useState<Record<string, string | number>>(() => {
    const saved = sessionStorage.getItem('portal_assessment_responses');
    return saved ? JSON.parse(saved) : {};
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionStepText, setSubmissionStepText] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Autosave responses to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('portal_assessment_responses', JSON.stringify(responses));
    sessionStorage.setItem('portal_assessment_current_index', String(currentIndex));
  }, [responses, currentIndex]);

  const currentQuestion = questions[currentIndex];
  const isReviewScreen = currentIndex >= totalQuestions;
  const progressPercent = Math.round(((currentIndex) / totalQuestions) * 100);

  const dimensionIcons: Record<string, React.ReactNode> = {
    ai_literacy: <BookOpen className="w-4 h-4 text-blue-400" />,
    tool_fluency: <Cpu className="w-4 h-4 text-indigo-400" />,
    domain_application: <Briefcase className="w-4 h-4 text-sky-400" />,
    career_adaptability: <TrendingUp className="w-4 h-4 text-violet-400" />,
    evidence_of_work: <FolderGit2 className="w-4 h-4 text-emerald-400" />
  };

  const currentDimMeta = currentQuestion 
    ? DIMENSIONS.find((d) => d.id === currentQuestion.dimension) 
    : null;

  const handleSelectOption = (optionId: string) => {
    setValidationError(null);
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  const handleNext = () => {
    if (!isReviewScreen && currentQuestion.required) {
      if (!responses[currentQuestion.id]) {
        setValidationError('Please select an answer to continue.');
        return;
      }
    }
    setValidationError(null);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      onCancel();
    }
  };

  // Submission handler
  const handleGenerateReport = async () => {
    if (!user) {
      setSubmitError('Authentication session expired. Please sign in again.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      setSubmissionStepText('Calculating deterministic dimension scores...');
      const scoringResult = calculateAssessmentScore(responses, config, questions);

      setSubmissionStepText('Formulating personalized 30-day action plan...');
      const actionPlan = generatePersonalizedActionPlan(scoringResult, profile);

      // Attempt server narrative enrichment via /api/narrative (with deterministic fallback)
      try {
        const narrativeRes = await fetch('/api/narrative', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            overallScore: scoringResult.overallScore,
            readinessBand: scoringResult.readinessBand,
            lowestDimension: scoringResult.lowestDimension,
            highestDimension: scoringResult.highestDimension,
            domain: profile.currentDomain,
            careerGoal: profile.primaryCareerGoal
          })
        });
        if (narrativeRes.ok) {
          const json = await narrativeRes.json();
          if (json?.narrativeSummary) {
            actionPlan.narrativeSummary = json.narrativeSummary;
          }
        }
      } catch (err) {
        // Safe silent fallback: actionPlan already has deterministic guidanceText
        console.log('AI Narrative enrichment used deterministic fallback:', err);
      }

      setSubmissionStepText('Writing submission to secure Firestore database...');
      const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const submissionRecord: AssessmentSubmission = {
        submissionId,
        uid: user.uid,
        userEmail: user.email || profile.email,
        userName: profile.fullName || user.displayName || 'Participant',
        assessmentVersion: config.assessmentVersion,
        scoringVersion: config.scoringVersion,
        submittedAt: new Date().toISOString(),
        profile,
        responses,
        dimensionScores: scoringResult.dimensionScores,
        overallScore: scoringResult.overallScore,
        readinessBand: scoringResult.readinessBand,
        generatedInsights: actionPlan,
        consent,
        source: 'web_portal_v1',
        status: 'completed'
      };

      await saveAssessmentSubmission(submissionRecord);

      // Clean up session storage
      sessionStorage.removeItem('portal_assessment_responses');
      sessionStorage.removeItem('portal_assessment_current_index');

      await refreshUserData();
      onSubmissionComplete(submissionRecord);
    } catch (error: any) {
      console.error('Submission error:', error);
      setSubmitError(
        error?.message || 'Failed to submit assessment to database. Please check your network connection and retry.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Keyboard navigation listener (1-4 for options, Enter for Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isReviewScreen || submitting) return;
      if (['1', '2', '3', '4'].includes(e.key) && currentQuestion?.options) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentQuestion.options[idx]) {
          handleSelectOption(currentQuestion.options[idx].id);
        }
      } else if (e.key === 'Enter') {
        if (responses[currentQuestion?.id]) {
          handleNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, responses, isReviewScreen, submitting]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Top Header & Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <button
            id="assessment-back-nav"
            onClick={handleBack}
            className="flex items-center gap-1.5 hover:text-slate-200 transition-colors text-xs font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{currentIndex === 0 ? 'Exit Assessment' : 'Previous Question'}</span>
          </button>

          {!isReviewScreen ? (
            <span className="font-mono font-medium text-slate-300">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
          ) : (
            <span className="font-medium text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Review Stage
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      {!isReviewScreen ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* Dimension Tag */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300">
              {dimensionIcons[currentQuestion.dimension]}
              <span>{currentDimMeta?.name || 'Career Readiness'}</span>
            </span>
            <span className="text-xs text-slate-400">
              Type: {currentQuestion.questionType.replace('_', ' ')}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-semibold text-slate-100 leading-snug mb-6">
            {currentQuestion.questionText}
          </h2>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = responses[currentQuestion.id] === option.id;
              return (
                <button
                  key={option.id}
                  id={`q-${currentQuestion.id}-opt-${option.id}`}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500/50 text-slate-100 shadow-md'
                      : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/70 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <div className="flex-1 text-sm leading-relaxed">
                    {option.text}
                  </div>
                </button>
              );
            })}
          </div>

          {validationError && (
            <div className="mt-4 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                currentIndex === 0
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Back
            </button>

            <button
              id="assessment-next-btn"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>{currentIndex === totalQuestions - 1 ? 'Review Responses' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Review and Final Submission Screen */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <FileCheck2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Your responses are ready.
          </h2>

          <p className="text-sm text-slate-400 max-w-md mx-auto mb-8">
            You have completed all {totalQuestions} assessment questions across all five dimensions. Click below to generate your personalized report and action plan.
          </p>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 max-w-md mx-auto text-left text-xs text-slate-300 mb-8 space-y-2.5">
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Participant:</span>
              <span className="font-semibold text-slate-200">{profile.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Domain & Category:</span>
              <span className="text-slate-200">{profile.currentDomain} ({profile.participantCategory})</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Questions Answered:</span>
              <span className="text-emerald-400 font-semibold">{Object.keys(responses).length} of {totalQuestions}</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-slate-400">Scoring Engine:</span>
              <span className="text-slate-300">Deterministic v1.0 (Equal weights)</span>
            </div>
          </div>

          {submitError && (
            <div className="mb-6 max-w-md mx-auto p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {submitting ? (
            <div className="py-6 space-y-3">
              <div className="flex items-center justify-center gap-3 text-blue-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm font-medium text-slate-200">
                  {submissionStepText || 'Processing assessment...'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Writing your results securely to the database. Please do not close the window.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                id="generate-report-btn"
                onClick={handleGenerateReport}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>Generate My AI Readiness Report</span>
              </button>

              <div>
                <button
                  onClick={() => setCurrentIndex(0)}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Review or change individual answers
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
