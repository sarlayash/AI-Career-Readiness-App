import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip 
} from 'recharts';
import { 
  Award, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Download, 
  ExternalLink, 
  FileText, 
  Lightbulb, 
  Printer, 
  RotateCcw, 
  Share2, 
  ShieldAlert, 
  Sparkles, 
  Target, 
  TrendingUp, 
  User 
} from 'lucide-react';
import { AssessmentSubmission } from '../types/assessment';
import { DIMENSIONS } from '../config/defaultConfigs';

interface ReportViewProps {
  submission: AssessmentSubmission;
  onRetake?: () => void;
  onViewAll?: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  submission,
  onRetake,
  onViewAll
}) => {
  const [activeWeek, setActiveWeek] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const {
    userName,
    submittedAt,
    overallScore,
    readinessBand,
    dimensionScores,
    generatedInsights,
    profile
  } = submission;

  // Radar chart data mapping
  const radarData = DIMENSIONS.map((dim) => {
    const scoreObj = dimensionScores?.[dim.id];
    return {
      dimension: dim.shortName,
      score: scoreObj?.score ?? 0,
      fullMark: 100
    };
  });

  const formattedDate = submittedAt 
    ? new Date(submittedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Recent';

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-purple-400';
    if (score >= 70) return 'text-emerald-400';
    if (score >= 50) return 'text-indigo-400';
    if (score >= 30) return 'text-blue-400';
    return 'text-amber-400';
  };

  const getProgressBg = (score: number) => {
    if (score >= 85) return 'bg-purple-500';
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 50) return 'bg-indigo-500';
    if (score >= 30) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 space-y-10">
      {/* Header Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Evaluation Record</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Your AI Career Readiness Report
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generated on {formattedDate} • Ref: {submission.submissionId}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="print-report-btn"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>

          <button
            id="share-report-btn"
            onClick={handleShare}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          {onRetake && (
            <button
              id="report-retake-btn"
              onClick={onRetake}
              className="px-3.5 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-medium transition-colors flex items-center gap-1.5 border border-blue-500/30 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Profile & Score Overview Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Col 1 & 2: Participant & Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg">
                {(userName || 'P').charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  {userName || 'Participant'}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span>{profile?.currentDomain || 'Professional'}</span>
                  <span>•</span>
                  <span>{profile?.participantCategory || 'Working professional'}</span>
                  <span>•</span>
                  <span>{profile?.experienceLevel || 'Experience'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
              <p>
                {generatedInsights.narrativeSummary || generatedInsights.guidanceText}
              </p>
              <div className="text-xs text-slate-400 pt-1 border-t border-slate-700/40 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-400" />
                <span>Primary Goal: <strong>{profile?.primaryCareerGoal}</strong></span>
              </div>
            </div>
          </div>

          {/* Col 3: Overall Score Gauge */}
          <div className="bg-[#0b101c] border border-slate-800 p-6 rounded-xl text-center flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Overall AI Readiness
            </span>
            <div className={`text-5xl sm:text-6xl font-black font-['Space_Grotesk'] tracking-tight ${getScoreColor(overallScore)}`}>
              {overallScore}
              <span className="text-xl font-normal text-slate-500">/100</span>
            </div>

            <div className="mt-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {readinessBand}
            </div>

            <span className="text-[11px] text-slate-500 mt-2">
              Deterministic Scoring Engine v1.0
            </span>
          </div>
        </div>
      </div>

      {/* Visualizations: Radar Chart & Dimension Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between">
          <div className="w-full text-left mb-2">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Dimension Balance Radar
            </h3>
            <p className="text-xs text-slate-400">
              Visualizes relative strength across the 5 core dimensions.
            </p>
          </div>

          <div className="w-full h-72 sm:h-80 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis 
                  dataKey="dimension" 
                  tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 500 }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={{ fill: '#64748b', fontSize: 10 }} 
                />
                <Radar
                  name="Readiness Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
            Scores reflect normalized percentage (0–100) per dimension.
          </div>
        </div>

        {/* Dimension Score Progress Bars */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              Dimension Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Granular performance across each competencies.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {DIMENSIONS.map((dim) => {
              const scoreObj = dimensionScores?.[dim.id];
              const score = scoreObj?.score ?? 0;
              return (
                <div key={dim.id} className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-200">
                      {dim.name}
                    </span>
                    <span className={`text-xs font-bold font-mono ${getScoreColor(score)}`}>
                      {score} / 100
                    </span>
                  </div>

                  <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressBg(score)}`}
                      style={{ width: `${Math.max(4, score)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>{scoreObj?.band || 'Evaluated'}</span>
                    <span>Weight: 20%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Qualitative Insights: Strengths, Gaps & Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              A. What You Are Doing Well
            </h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            {generatedInsights.strengths.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Development Opportunities */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4 text-amber-400">
            <Lightbulb className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              B. Where You Can Grow
            </h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            {generatedInsights.developmentGaps.map((g, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Immediate Next Step */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Target className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              C. Recommended Next Step
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {generatedInsights.recommendedNextStep}
          </p>
          <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            Focus Pillar: <strong>{generatedInsights.dimensionName}</strong>
          </div>
        </div>
      </div>

      {/* Section D: Personalized 30-Day Action Plan */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Section D</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Personalized 30-Day Action Plan
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Structured week-by-week blueprint targeting your greatest growth opportunity: <strong>{generatedInsights.dimensionName}</strong>.
          </p>
        </div>

        {/* Week Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
          {generatedInsights.weeklyPlan.map((week) => (
            <button
              key={week.weekNumber}
              id={`action-plan-week-${week.weekNumber}-btn`}
              onClick={() => setActiveWeek(week.weekNumber)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeWeek === week.weekNumber
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Week {week.weekNumber}: {week.theme}
            </button>
          ))}
        </div>

        {/* Active Week Details */}
        {(() => {
          const currentWeek = generatedInsights.weeklyPlan.find((w) => w.weekNumber === activeWeek) || generatedInsights.weeklyPlan[0];
          if (!currentWeek) return null;

          return (
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-4">
                <div>
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    Week {currentWeek.weekNumber} Focus
                  </span>
                  <h4 className="text-lg font-bold text-slate-100 mt-0.5">
                    {currentWeek.theme}
                  </h4>
                </div>
                <div className="text-xs text-slate-300 max-w-sm sm:text-right">
                  <strong>Objective:</strong> {currentWeek.objective}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Practical Action Tasks
                </h5>
                <ul className="space-y-2.5">
                  {currentWeek.tasks.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs sm:text-sm text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <div className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-xl flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h6 className="text-xs font-semibold text-indigo-200">
                      Suggested Tangible Artifact to Build
                    </h6>
                    <p className="text-xs text-indigo-300/90 mt-0.5 leading-relaxed">
                      {currentWeek.suggestedArtifact}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 text-xs text-slate-400 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Transparency Notice:</strong> This report is an indicative self-assessment based on your responses. It is intended to support learning decisions and should not be treated as a definitive measure of employability or professional capability.
        </p>
      </div>
    </div>
  );
};
