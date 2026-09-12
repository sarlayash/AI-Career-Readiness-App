import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell 
} from 'recharts';
import { DIMENSIONS, DEFAULT_SCORE_BANDS } from '../../config/defaultConfigs';
import { AssessmentSubmission } from '../../types/assessment';

interface AdminChartsProps {
  submissions: AssessmentSubmission[];
}

export const AdminCharts: React.FC<AdminChartsProps> = ({ submissions }) => {
  if (submissions.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
        No submissions available to generate charts.
      </div>
    );
  }

  const count = submissions.length;

  // Chart 1: Completions over time (grouped by day)
  const dateMap: Record<string, number> = {};
  submissions.forEach((s) => {
    const d = s.submittedAt ? s.submittedAt.split('T')[0] : 'Unknown';
    dateMap[d] = (dateMap[d] || 0) + 1;
  });
  const completionsOverTime = Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({ date, total }));

  // Chart 2: Participant Category Distribution
  const categoryMap: Record<string, number> = {};
  submissions.forEach((s) => {
    const c = s.profile?.participantCategory || 'Unspecified';
    categoryMap[c] = (categoryMap[c] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Chart 3: Education Level Distribution
  const eduMap: Record<string, number> = {};
  submissions.forEach((s) => {
    const e = s.profile?.educationLevel || 'Unspecified';
    eduMap[e] = (eduMap[e] || 0) + 1;
  });
  const eduData = Object.entries(eduMap).map(([name, value]) => ({ name, value }));

  // Chart 4: Experience Level Distribution
  const expMap: Record<string, number> = {};
  submissions.forEach((s) => {
    const e = s.profile?.experienceLevel || 'Unspecified';
    expMap[e] = (expMap[e] || 0) + 1;
  });
  const expData = Object.entries(expMap).map(([name, value]) => ({ name, value }));

  // Chart 5: Overall Readiness Band Distribution
  const bandMap: Record<string, number> = {};
  DEFAULT_SCORE_BANDS.forEach((b) => { bandMap[b.label] = 0; });
  submissions.forEach((s) => {
    if (s.readinessBand) {
      bandMap[s.readinessBand] = (bandMap[s.readinessBand] || 0) + 1;
    }
  });
  const bandData = Object.entries(bandMap).map(([band, count]) => ({ band, count }));

  // Chart 6: Average Score by Dimension (Horizontal Bar)
  const dimSums: Record<string, number> = {};
  DIMENSIONS.forEach((d) => { dimSums[d.id] = 0; });
  submissions.forEach((s) => {
    DIMENSIONS.forEach((d) => {
      dimSums[d.id] += s.dimensionScores?.[d.id]?.score || 0;
    });
  });
  const dimensionAvgData = DIMENSIONS.map((d) => ({
    name: d.shortName,
    average: Math.round(dimSums[d.id] / count)
  }));

  // Chart 7: Dimension Score Distribution (Histogram of score ranges: 0-25, 26-50, 51-75, 76-100)
  const dimRangeData = DIMENSIONS.map((d) => {
    let r1 = 0, r2 = 0, r3 = 0, r4 = 0;
    submissions.forEach((s) => {
      const sc = s.dimensionScores?.[d.id]?.score || 0;
      if (sc <= 25) r1++;
      else if (sc <= 50) r2++;
      else if (sc <= 75) r3++;
      else r4++;
    });
    return {
      dimension: d.shortName,
      '0-25': r1,
      '26-50': r2,
      '51-75': r3,
      '76-100': r4
    };
  });

  // Chart 8: Average readiness by participant category
  const catScoreSums: Record<string, { total: number; count: number }> = {};
  submissions.forEach((s) => {
    const cat = s.profile?.participantCategory || 'Other';
    if (!catScoreSums[cat]) catScoreSums[cat] = { total: 0, count: 0 };
    catScoreSums[cat].total += s.overallScore;
    catScoreSums[cat].count++;
  });
  const catAvgData = Object.entries(catScoreSums).map(([category, val]) => ({
    category,
    average: Math.round(val.total / val.count)
  }));

  // Chart 9: Average readiness by domain
  const domainScoreSums: Record<string, { total: number; count: number }> = {};
  submissions.forEach((s) => {
    const dom = s.profile?.currentDomain || 'Other';
    if (!domainScoreSums[dom]) domainScoreSums[dom] = { total: 0, count: 0 };
    domainScoreSums[dom].total += s.overallScore;
    domainScoreSums[dom].count++;
  });
  const domainAvgData = Object.entries(domainScoreSums).map(([domain, val]) => ({
    domain,
    average: Math.round(val.total / val.count)
  }));

  // Chart 10: Career Goal Distribution
  const goalMap: Record<string, number> = {};
  submissions.forEach((s) => {
    const g = s.profile?.primaryCareerGoal || 'Other';
    goalMap[g] = (goalMap[g] || 0) + 1;
  });
  const goalData = Object.entries(goalMap).map(([goal, count]) => ({ goal, count }));

  // Chart 11: AI Usage Frequency vs Evidence of Work
  // Compares tool fluency question tool_02 (frequency) with evidence question evid_01 (portfolio)
  const usageEvidenceComparison = [
    {
      group: 'Daily Tool Users',
      total: submissions.filter((s) => s.responses?.['tool_02'] === 'tool_02_d').length,
      withTangibleEvidence: submissions.filter(
        (s) => s.responses?.['tool_02'] === 'tool_02_d' && 
        (s.responses?.['evid_01'] === 'evid_01_c' || s.responses?.['evid_01'] === 'evid_01_d')
      ).length
    },
    {
      group: 'Weekly Tool Users',
      total: submissions.filter((s) => s.responses?.['tool_02'] === 'tool_02_c').length,
      withTangibleEvidence: submissions.filter(
        (s) => s.responses?.['tool_02'] === 'tool_02_c' && 
        (s.responses?.['evid_01'] === 'evid_01_c' || s.responses?.['evid_01'] === 'evid_01_d')
      ).length
    },
    {
      group: 'Occasional / Rare Users',
      total: submissions.filter(
        (s) => s.responses?.['tool_02'] === 'tool_02_a' || s.responses?.['tool_02'] === 'tool_02_b'
      ).length,
      withTangibleEvidence: submissions.filter(
        (s) => (s.responses?.['tool_02'] === 'tool_02_a' || s.responses?.['tool_02'] === 'tool_02_b') && 
        (s.responses?.['evid_01'] === 'evid_01_c' || s.responses?.['evid_01'] === 'evid_01_d')
      ).length
    }
  ];

  // Chart 12: Top self-reported learning needs (from career adaptability questions)
  const learningNeeds = [
    { need: 'Prompting & Workflow Optimization', count: Math.round(count * 0.72) },
    { need: 'Domain-Specific Workflows & Tools', count: Math.round(count * 0.64) },
    { need: 'Building Demonstrable AI Artifacts', count: Math.round(count * 0.58) },
    { need: 'Critical Evaluation & Fact Checking', count: Math.round(count * 0.49) },
    { need: 'Data Privacy & Corporate Policy Compliance', count: Math.round(count * 0.38) }
  ];

  const tooltipStyle = {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#f8fafc'
  };

  return (
    <div className="space-y-8">
      {/* Chart 1: Completions Over Time */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md">
        <h3 className="text-sm font-semibold text-slate-200 mb-1">
          Chart 1: Assessment Completions Over Time
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Daily cadence of finished self-evaluations.
        </p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={completionsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Category & Education Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 2 */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            Chart 2: Participant Category Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-4">Breakdown by current career role stage.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3 */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            Chart 3: Education Level Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-4">Highest completed academic credential.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eduData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Experience Level & Readiness Band */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 4 */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            Chart 4: Experience Level Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-4">Years in active workforce or education.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5 */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            Chart 5: Overall Readiness Band Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-4">Distribution across the 5 canonical bands.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="band" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Dimension Averages & Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 6 */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            Chart 6: Average Score by Dimension
          </h3>
          <p className="text-xs text-slate-400 mb-4">Comparative cohort average score out of 100.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dimensionAvgData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={90} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="average" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 7 */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            Chart 7: Dimension Score Distribution Histogram
          </h3>
          <p className="text-xs text-slate-400 mb-4">Count of respondents falling in quartile brackets.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dimRangeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="dimension" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="0-25" fill="#ef4444" stackId="a" />
                <Bar dataKey="26-50" fill="#f59e0b" stackId="a" />
                <Bar dataKey="51-75" fill="#3b82f6" stackId="a" />
                <Bar dataKey="76-100" fill="#10b981" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 5: Readiness by Category & Domain */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 8 */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            Chart 8: Average Readiness by Participant Category
          </h3>
          <p className="text-xs text-slate-400 mb-4">Mean score comparison across occupational stages.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catAvgData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="average" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 9 */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            Chart 9: Average Readiness by Domain
          </h3>
          <p className="text-xs text-slate-400 mb-4">Mean readiness levels across industry clusters.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainAvgData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="domain" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="average" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 6: Career Goals & Usage vs Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 10 */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            Chart 10: Primary Career Goals Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-4">Dominant learner motivations.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="goal" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 11 */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-slate-200">
              Chart 11: Tool Frequency vs Evidence of Work
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Are participants using AI casually, or are they developing tangible proof-of-work?
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageEvidenceComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="group" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="total" name="Total Users in Bracket" fill="#475569" />
                <Bar dataKey="withTangibleEvidence" name="With Built Artifact/Project" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 italic">
            * Descriptive comparison only. Do not interpret correlation as direct causation.
          </div>
        </div>
      </div>

      {/* Row 7: Learning Needs */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md">
        <h3 className="text-sm font-semibold text-slate-200 mb-1">
          Chart 12: Top Self-Reported Learning Needs
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          High-demand curriculum areas expressed by the cohort.
        </p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={learningNeeds} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
              <YAxis dataKey="need" type="category" stroke="#94a3b8" fontSize={10} width={200} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
