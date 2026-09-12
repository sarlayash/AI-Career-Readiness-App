import React, { useState } from 'react';
import { Database, AlertTriangle, Trash2, PlusCircle, X, CheckCircle2, Loader2 } from 'lucide-react';
import { 
  CAREER_GOALS, 
  DOMAINS, 
  EDUCATION_LEVELS, 
  EXPERIENCE_LEVELS, 
  PARTICIPANT_CATEGORIES 
} from '../../config/defaultConfigs';
import { ASSESSMENT_QUESTIONS } from '../../config/questions';
import { AssessmentConfig, AssessmentSubmission, DimensionId, UserProfile } from '../../types/assessment';
import { calculateAssessmentScore } from '../../services/scoring';
import { generatePersonalizedActionPlan } from '../../services/actionPlan';
import { logAdminAction, saveAssessmentSubmission } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';

interface SampleDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AssessmentConfig;
  onRefreshData: () => void;
  sampleCount: number;
}

export const SampleDataModal: React.FC<SampleDataModalProps> = ({
  isOpen,
  onClose,
  config,
  onRefreshData,
  sampleCount
}) => {
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [purging, setPurging] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleNames = [
    'Aditi Sharma', 'Rahul Verma', 'Priya Nair', 'Vikram Patel', 'Ananya Gupta',
    'Rohan Kulkarni', 'Sneha Iyer', 'Arjun Mehta', 'Kavita Das', 'Manish Reddy',
    'Neha Joshi', 'Deepak Chopra', 'Pooja Agarwal', 'Siddharth Sen', 'Meera Rao'
  ];

  const handleGenerateSamples = async () => {
    setGenerating(true);
    setStatusMessage('Generating 15 diverse sample assessment records...');

    try {
      for (let i = 0; i < sampleNames.length; i++) {
        const name = sampleNames[i];
        const category = PARTICIPANT_CATEGORIES[i % PARTICIPANT_CATEGORIES.length];
        const domain = DOMAINS[i % DOMAINS.length];
        const edu = EDUCATION_LEVELS[i % EDUCATION_LEVELS.length];
        const exp = EXPERIENCE_LEVELS[i % EXPERIENCE_LEVELS.length];
        const goal = CAREER_GOALS[i % CAREER_GOALS.length];

        const profile: UserProfile = {
          fullName: name,
          email: `sample.${name.toLowerCase().replace(' ', '.')}@example.dev`,
          participantCategory: category,
          educationLevel: edu,
          experienceLevel: exp,
          currentDomain: domain,
          primaryCareerGoal: goal
        };

        // Synthesize varied responses
        const responses: Record<string, string | number> = {};
        ASSESSMENT_QUESTIONS.forEach((q, qIndex) => {
          // Add deterministic spread across options based on index
          const optIdx = (i + qIndex) % q.options.length;
          responses[q.id] = q.options[optIdx].id;
        });

        const scoring = calculateAssessmentScore(responses, config, ASSESSMENT_QUESTIONS);
        const insights = generatePersonalizedActionPlan(scoring, profile);

        // Stagger submission times across the last 5 days
        const pastDays = i % 5;
        const subDate = new Date(Date.now() - pastDays * 24 * 60 * 60 * 1000 - (i * 3600000)).toISOString();

        const submissionRecord: AssessmentSubmission = {
          submissionId: `sample_${Date.now()}_${i}`,
          uid: `sample_user_${i}`,
          userEmail: profile.email,
          userName: profile.fullName,
          assessmentVersion: config.assessmentVersion,
          scoringVersion: config.scoringVersion,
          submittedAt: subDate,
          profile,
          responses,
          dimensionScores: scoring.dimensionScores,
          overallScore: scoring.overallScore,
          readinessBand: scoring.readinessBand,
          generatedInsights: insights,
          consent: true,
          source: 'dev_generator_sample',
          status: 'completed',
          isSampleData: true
        };

        await saveAssessmentSubmission(submissionRecord);
      }

      await logAdminAction(
        user?.uid || 'KAPILADMIN',
        user?.email || 'admin@portal.internal',
        'GENERATE_DEV_SAMPLE_DATA',
        { count: sampleNames.length }
      );

      setStatusMessage('15 sample records successfully injected into Firestore.');
      onRefreshData();
    } catch (err: any) {
      console.error('Error creating samples:', err);
      setStatusMessage(`Error: ${err?.message}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 mb-1">
              Development Tooling Only
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              Sample Data Generator
            </h3>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300 mb-6">
          <p className="leading-relaxed">
            Populate Firestore with 15 realistically modeled self-assessment records across all 5 dimensions, domains, categories, and readiness bands to test the 13 analytics charts and filters.
          </p>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50 space-y-1.5 text-[11px] text-slate-400">
            <div>• All generated records are stamped with <code className="text-amber-400">isSampleData: true</code>.</div>
            <div>• Filters allow viewing production data only or sample data only.</div>
            <div>• Current sample records in database: <strong className="text-amber-300">{sampleCount}</strong>.</div>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 mb-5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleGenerateSamples}
            disabled={generating}
            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Injecting records into Firestore...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Generate 15 Diverse Sample Submissions</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
