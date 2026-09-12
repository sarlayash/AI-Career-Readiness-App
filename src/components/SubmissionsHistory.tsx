import React, { useEffect, useState } from 'react';
import { 
  History, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Award, 
  ChevronRight, 
  RotateCcw,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserSubmissions } from '../services/firebase';
import { AssessmentSubmission } from '../types/assessment';

interface SubmissionsHistoryProps {
  onSelectSubmission: (submission: AssessmentSubmission) => void;
  onRetake: () => void;
}

export const SubmissionsHistory: React.FC<SubmissionsHistoryProps> = ({
  onSelectSubmission,
  onRetake
}) => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserSubmissions(user.uid)
      .then((data) => setSubmissions(data))
      .catch((err) => console.error('Error fetching user submissions:', err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3" />
        <p className="text-xs text-slate-400">Loading your submission records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Submission Records</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            My Assessment History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review past evaluations and observe your AI readiness progression over time.
          </p>
        </div>

        <button
          id="history-retake-btn"
          onClick={onRetake}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Take New Assessment</span>
        </button>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <Clock className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No submissions found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            You have not completed any AI career readiness self-assessments yet.
          </p>
          <button
            onClick={onRetake}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Your First Assessment</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const dateStr = sub.submittedAt 
              ? new Date(sub.submittedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Unknown date';

            return (
              <div
                key={sub.submissionId}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/90 rounded-xl p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl font-bold font-['Space_Grotesk'] text-slate-100">
                      {sub.overallScore} / 100
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {sub.readinessBand}
                    </span>
                    <span className="text-xs text-slate-400">
                      v{sub.assessmentVersion}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {dateStr}
                    </span>
                    <span>•</span>
                    <span>Domain: {sub.profile?.currentDomain || 'General'}</span>
                    <span>•</span>
                    <span>Goal: {sub.profile?.primaryCareerGoal}</span>
                  </div>
                </div>

                <button
                  id={`view-sub-${sub.submissionId}-btn`}
                  onClick={() => onSelectSubmission(sub)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer shrink-0"
                >
                  <span>View Full Report</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
