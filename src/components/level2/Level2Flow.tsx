import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  HelpCircle, 
  ShieldCheck, 
  Wrench, 
  Zap, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { LEVEL2_QUESTIONS } from '../../data/level2Questions';
import { TOOL_CATEGORIES_META } from '../../data/marketToolsData';
import { Level2Question, Level2Submission } from '../../types/level2';
import { AssessmentSubmission } from '../../types/assessment';
import { calculateLevel2ScoreAndJourney } from '../../services/level2Scoring';
import { saveLevel2Submission } from '../../services/firebase';

interface Level2FlowProps {
  profile: {
    fullName: string;
    email: string;
    domain: string;
    experienceLevel: string;
    primaryCareerGoal: string;
  };
  level1Submission: AssessmentSubmission | null;
  onComplete: (submission: Level2Submission) => void;
  onCancel: () => void;
}

export const Level2Flow: React.FC<Level2FlowProps> = ({
  profile,
  level1Submission,
  onComplete,
  onCancel
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const questions = LEVEL2_QUESTIONS;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const selectedOptionId = responses[currentQuestion.id];

  // Restore cached progress if available
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('portal_l2_flow_responses');
      if (cached) {
        setResponses(JSON.parse(cached));
      }
    } catch (e) {}
  }, []);

  const handleSelectOption = (optionId: string) => {
    const updated = {
      ...responses,
      [currentQuestion.id]: optionId
    };
    setResponses(updated);
    try {
      sessionStorage.setItem('portal_l2_flow_responses', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const submission = calculateLevel2ScoreAndJourney({
        responses,
        userUid: level1Submission?.uid || `learner_${Date.now()}`,
        userName: profile.fullName,
        userEmail: profile.email,
        domain: profile.domain,
        experienceLevel: profile.experienceLevel,
        primaryCareerGoal: profile.primaryCareerGoal,
        level1Submission
      });

      // Persist to Firestore
      await saveLevel2Submission(submission);

      // Clean session storage
      sessionStorage.removeItem('portal_l2_flow_responses');

      onComplete(submission);
    } catch (error) {
      console.error('Level 2 submission calculation error:', error);
      // Fallback
      const fallbackSubmission = calculateLevel2ScoreAndJourney({
        responses,
        userUid: level1Submission?.uid || `learner_${Date.now()}`,
        userName: profile.fullName,
        userEmail: profile.email,
        domain: profile.domain,
        experienceLevel: profile.experienceLevel,
        primaryCareerGoal: profile.primaryCareerGoal,
        level1Submission
      });
      onComplete(fallbackSubmission);
    } finally {
      setSubmitting(false);
    }
  };

  const categoryMeta = TOOL_CATEGORIES_META[currentQuestion.category];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Header & Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Exit to Intro
            </button>
            <span className="text-slate-600">•</span>
            <span className="text-blue-400 font-semibold">Level 2 Applied AI Benchmark</span>
          </div>
          <div className="font-mono font-medium text-slate-300">
            Scenario {currentIndex + 1} of {totalQuestions}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Category & Difficulty Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              {categoryMeta?.label || currentQuestion.category}
            </span>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              UseCase: {currentQuestion.useCase.replace(/_/g, ' ')}
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            {currentQuestion.difficulty}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
          {currentQuestion.title}
        </h2>

        {/* Enterprise Problem Scenario Callout */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 mb-6 text-sm text-slate-200 leading-relaxed">
          <p className="font-semibold text-xs text-blue-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            Enterprise Scenario
          </p>
          {currentQuestion.scenario}
        </div>

        {/* Market Tools Involved */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Wrench className="w-3 h-3 text-indigo-400" />
            Market Tools Evaluated:
          </span>
          {currentQuestion.toolFocus.map((tool) => (
            <span
              key={tool}
              className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700"
            >
              {tool}
            </span>
          ))}
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            const letter = String.fromCharCode(65 + idx);

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer select-none relative ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-slate-800/40 border-slate-700/80 text-slate-200 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {letter}
                  </div>
                  <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                    {option.text}
                  </div>
                </div>

                {/* If selected: reveal tool insight */}
                {isSelected && option.toolInsight && (
                  <div className="mt-3 pt-3 border-t border-blue-500/20 text-xs text-blue-300 flex items-center gap-1.5 pl-10">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{option.toolInsight}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              currentIndex === 0
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedOptionId || submitting}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              !selectedOptionId || submitting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 hover:scale-[1.02]'
            }`}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Compiling Journey...
              </span>
            ) : currentIndex === totalQuestions - 1 ? (
              <span className="flex items-center gap-1.5">
                Generate Customized Report & Journey
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Next Scenario
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
