import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  Award, 
  Sparkles, 
  Lightbulb, 
  AlertCircle,
  FileText,
  BarChart3
} from 'lucide-react';
import { DIMENSIONS } from '../../config/defaultConfigs';
import { AssessmentSubmission, DimensionId, UserAccount } from '../../types/assessment';
import { Smartphone, Monitor } from 'lucide-react';

interface AdminOverviewProps {
  submissions: AssessmentSubmission[];
  allSubmissionsCount: number;
  users?: UserAccount[];
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  submissions,
  allSubmissionsCount,
  users = []
}) => {
  const usersCount = users.length;
  const mobileCount = users.filter((u) => u.deviceType === 'Mobile').length;
  const desktopCount = users.filter((u) => u.deviceType === 'Desktop' || !u.deviceType).length;

  if (submissions.length === 0 && usersCount === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center my-6">
        <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-200">No submissions or learners yet</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          No participant records matched your active filters or the database is currently empty.
        </p>
      </div>
    );
  }

  const count = submissions.length;

  // Assessments completed today and last 7 days
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;

  const completedToday = submissions.filter((s) => {
    return new Date(s.submittedAt).getTime() >= startOfToday;
  }).length;

  const completedLast7Days = submissions.filter((s) => {
    return new Date(s.submittedAt).getTime() >= sevenDaysAgo;
  }).length;

  // Scores calculation (average & median)
  const scores = submissions.map((s) => s.overallScore).sort((a, b) => a - b);
  const totalScore = scores.reduce((sum, v) => sum + v, 0);
  const avgScore = Math.round(totalScore / count);
  const medianScore = count % 2 === 0
    ? Math.round((scores[count / 2 - 1] + scores[count / 2]) / 2)
    : scores[Math.floor(count / 2)];

  // Dimension averages
  const dimensionSums: Record<DimensionId, number> = {
    ai_literacy: 0,
    tool_fluency: 0,
    domain_application: 0,
    career_adaptability: 0,
    evidence_of_work: 0
  };

  submissions.forEach((s) => {
    if (s.dimensionScores) {
      DIMENSIONS.forEach((d) => {
        dimensionSums[d.id] += s.dimensionScores[d.id]?.score || 0;
      });
    }
  });

  const dimensionAverages = DIMENSIONS.map((d) => ({
    id: d.id,
    name: d.name,
    shortName: d.shortName,
    avg: Math.round(dimensionSums[d.id] / count)
  })).sort((a, b) => b.avg - a.avg);

  const highestDimension = dimensionAverages[0];
  const lowestDimension = dimensionAverages[dimensionAverages.length - 1];

  // ==========================================
  // REAL AUDIENCE INTELLIGENCE CALCULATIONS
  // ==========================================
  // 1. Working professionals percentage
  const workingProfCount = submissions.filter((s) => 
    s.profile?.participantCategory === 'Working professional'
  ).length;
  const workingProfPercent = Math.round((workingProfCount / count) * 100);

  // 2. Most selected career goal
  const goalCounts: Record<string, number> = {};
  submissions.forEach((s) => {
    const g = s.profile?.primaryCareerGoal || 'Other';
    goalCounts[g] = (goalCounts[g] || 0) + 1;
  });
  let topGoal = 'Improve employability';
  let topGoalCount = 0;
  Object.entries(goalCounts).forEach(([goal, c]) => {
    if (c > topGoalCount) {
      topGoalCount = c;
      topGoal = goal;
    }
  });

  // 3. Casual usage vs evidence of work comparison
  // Checking question evid_01 response
  const demonstrativeWorkCount = submissions.filter((s) => {
    const ans = s.responses?.['evid_01'];
    return ans === 'evid_01_c' || ans === 'evid_01_d';
  }).length;

  return (
    <div className="space-y-8">
      {/* Top Cross-Platform Learner Base Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 border border-blue-500/20 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Total User Base</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Any Device & Any Browser
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-100 mt-0.5">
              {usersCount > 0 ? usersCount : allSubmissionsCount} Registered Learners & Accounts
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {submissions.length} assessments completed • {mobileCount} mobile users • {desktopCount} desktop users
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-300 font-medium">{mobileCount} Mobile</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
            <Monitor className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-300 font-medium">{desktopCount} Desktop</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Completed */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Filtered Submissions</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold font-['Space_Grotesk'] text-slate-100">
            {count}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            of {allSubmissionsCount} total recorded in database
          </div>
        </div>

        {/* Avg Readiness Score */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Readiness</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-['Space_Grotesk'] text-slate-100">
            {avgScore} <span className="text-sm font-normal text-slate-500">/100</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Median score: <strong>{medianScore} / 100</strong>
          </div>
        </div>

        {/* Completed Today & Last 7 Days */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Recent Activity</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold font-['Space_Grotesk'] text-slate-100">
            {completedToday}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            today • <strong>{completedLast7Days}</strong> in last 7 days
          </div>
        </div>

        {/* Dimension Spread */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Dimension Outliers</span>
            <Award className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-xs space-y-1 mt-1">
            <div className="flex justify-between">
              <span className="text-emerald-400 font-medium truncate max-w-[130px]" title={highestDimension.name}>
                Top: {highestDimension.shortName}
              </span>
              <span className="font-mono text-emerald-400 font-bold">{highestDimension.avg}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-400 font-medium truncate max-w-[130px]" title={lowestDimension.name}>
                Low: {lowestDimension.shortName}
              </span>
              <span className="font-mono text-amber-400 font-bold">{lowestDimension.avg}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 17: REAL AUDIENCE INTELLIGENCE */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-[#0e1628] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Real Audience Intelligence
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic patterns and actual observations calculated directly from current database records.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {/* Observation 1: Lowest dimension */}
          <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
              Competency Growth Gap
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Among {count} completed assessments, <strong className="text-amber-300">{lowestDimension.name}</strong> has the lowest average score ({lowestDimension.avg}/100).
            </p>
            <p className="text-[11px] text-slate-400">
              Indicates the primary curricular target for future webinars and training modules.
            </p>
          </div>

          {/* Observation 2: Working professionals representation */}
          <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
              Audience Composition
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Working professionals represent <strong className="text-blue-300">{workingProfPercent}%</strong> of completed assessments ({workingProfCount} of {count} respondents).
            </p>
            <p className="text-[11px] text-slate-400">
              High concentration of active workforce participants validating adult upskilling demand.
            </p>
          </div>

          {/* Observation 3: Career goals */}
          <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
              Primary Aspiration
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              <strong className="text-indigo-300">{topGoalCount} of {count} respondents</strong> selected '{topGoal}' as their primary career goal.
            </p>
            <p className="text-[11px] text-slate-400">
              Demonstrates practical employment motivation over theoretical exploration.
            </p>
          </div>

          {/* Observation 4: Practical Evidence vs Casual usage */}
          <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              Evidence of Practical Work
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              <strong className="text-emerald-300">{demonstrativeWorkCount} of {count} respondents ({Math.round((demonstrativeWorkCount / count) * 100)}%)</strong> report having built a demonstrable AI-assisted artifact or public project.
            </p>
            <p className="text-[11px] text-slate-400">
              Highlights the transition opportunity from casual prompting to portfolio proof-of-work.
            </p>
          </div>
        </div>

        {/* Mandatory Visible Note (Section 17 & 20) */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-400">
          <AlertCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong>Methodology Note:</strong> These insights describe this assessment sample and should not be treated as a representative study of the entire population.
          </span>
        </div>
      </div>
    </div>
  );
};
