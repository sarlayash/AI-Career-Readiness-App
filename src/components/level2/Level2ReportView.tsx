import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  FileText, 
  Layers, 
  Printer, 
  RotateCcw, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Cpu, 
  Bot, 
  Code, 
  Palette, 
  Zap, 
  ArrowRight,
  Clock,
  Briefcase
} from 'lucide-react';
import { Level2Submission, Level2ToolCategory } from '../../types/level2';
import { TOOL_CATEGORIES_META } from '../../data/marketToolsData';

interface Level2ReportViewProps {
  submission: Level2Submission;
  onRetake: () => void;
  onViewLevel1Report?: () => void;
  onViewAll?: () => void;
}

export const Level2ReportView: React.FC<Level2ReportViewProps> = ({
  submission,
  onRetake,
  onViewLevel1Report,
  onViewAll
}) => {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  const {
    userName,
    userEmail,
    submittedAt,
    domain,
    experienceLevel,
    primaryCareerGoal,
    level1OverallScore,
    level1ReadinessBand,
    level1FocusDimension,
    categoryScores,
    useCaseScores,
    overallScore,
    tierLabel,
    customizedJourney
  } = submission;

  const formattedDate = submittedAt 
    ? new Date(submittedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Recent';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-purple-400';
    if (score >= 70) return 'text-emerald-400';
    if (score >= 50) return 'text-indigo-400';
    return 'text-blue-400';
  };

  const getProgressBg = (score: number) => {
    if (score >= 85) return 'bg-purple-500';
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 50) return 'bg-indigo-500';
    return 'bg-blue-500';
  };

  const getCategoryIcon = (cat: Level2ToolCategory) => {
    switch (cat) {
      case 'frontier_llms': return <Cpu className="w-4 h-4 text-blue-400" />;
      case 'coding_agents': return <Code className="w-4 h-4 text-emerald-400" />;
      case 'workflow_automation': return <Bot className="w-4 h-4 text-indigo-400" />;
      case 'enterprise_productivity': return <Layers className="w-4 h-4 text-amber-400" />;
      case 'multimodal_creative': return <Palette className="w-4 h-4 text-pink-400" />;
      case 'governance_rag': return <ShieldCheck className="w-4 h-4 text-purple-400" />;
    }
  };

  const activePhase = customizedJourney.ninetyDayRoadmap[activePhaseIndex] || customizedJourney.ninetyDayRoadmap[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Level 2 Executive Report
          </span>
          <span className="text-xs text-slate-500">ID: {submission.submissionId.slice(0, 16)}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCertModal(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            Executive Certificate
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            {copiedLink ? 'Copied Link!' : 'Share'}
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            Print / PDF
          </button>

          <button
            onClick={onRetake}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Retake
          </button>
        </div>
      </div>

      {/* Hero Scorecard Card (FAANG / Fortune 500 Executive Aesthetic) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-[#0d1527] to-slate-950 border border-slate-800 p-8 sm:p-10 shadow-2xl mb-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Metadata & Narrative */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${customizedJourney.tierBadgeColor}`}>
                {tierLabel}
              </span>
              <span className="text-xs text-slate-400">
                Completed on {formattedDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {userName}'s Applied AI Capability Report
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              {customizedJourney.executiveSummary}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>Domain: <strong className="text-slate-200">{domain}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Experience: <strong className="text-slate-200">{experienceLevel}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Goal: <strong className="text-slate-200">{primaryCareerGoal}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Score Ring & Level 1 Comparison */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Level 2 Applied AI Index
            </span>
            <div className="flex items-baseline gap-1 my-1">
              <span className={`text-6xl sm:text-7xl font-black tracking-tight ${getScoreColor(overallScore)}`}>
                {overallScore}
              </span>
              <span className="text-xl text-slate-500 font-bold">/ 100</span>
            </div>
            <p className="text-xs font-semibold text-slate-300 text-center mb-4">
              Real Use Cases & Market Tools Proficiency
            </p>

            {/* Level 1 Comparison Bridge */}
            {level1OverallScore !== undefined && (
              <div className="w-full pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 uppercase block">Level 1 Baseline</span>
                  <span className="font-bold text-slate-200">
                    {level1OverallScore}/100 • {level1ReadinessBand}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    {overallScore >= level1OverallScore 
                      ? `+${overallScore - level1OverallScore}% Practical Growth`
                      : 'Benchmarked'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Tool Category Mastery Matrix */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Market AI Tool Category Mastery</h2>
            <p className="text-xs text-slate-400">
              Evaluated across modern frontier reasoning models, coding agents, workflow automation, and enterprise governance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(Object.keys(categoryScores) as Level2ToolCategory[]).map((cat) => {
            const score = categoryScores[cat] ?? 0;
            const meta = TOOL_CATEGORIES_META[cat];

            return (
              <div 
                key={cat}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                      {getCategoryIcon(cat)}
                    </div>
                    <span className="text-xs font-bold text-white">
                      {meta?.label || cat}
                    </span>
                  </div>
                  <span className={`text-sm font-black ${getScoreColor(score)}`}>
                    {score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressBg(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {meta?.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Section: 90-Day Customized AI Career Transformation Journey */}
      <div className="mb-14 p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-2">
              <Sparkles className="w-3 h-3" />
              Tailored to Your Level 1 & Level 2 Diagnostic
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Your Customized 90-Day AI Transformation Journey
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Step-by-step milestone execution plan bridging your foundational Level 1 gaps with practical Level 2 market tools in <strong className="text-blue-300">{domain}</strong>.
            </p>
          </div>

          {/* Phase Selector Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800/80 border border-slate-700 shrink-0">
            {customizedJourney.ninetyDayRoadmap.map((phase, idx) => (
              <button
                key={phase.phaseNumber}
                onClick={() => setActivePhaseIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activePhaseIndex === idx
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Phase {phase.phaseNumber} ({phase.duration})
              </button>
            ))}
          </div>
        </div>

        {/* Active Phase Card */}
        {activePhase && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  Phase {activePhase.phaseNumber}: {activePhase.duration}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {activePhase.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activePhase.objective}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 shrink-0">
                {activePhase.focusTools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-200 border border-slate-700"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Weekly Deliverables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePhase.weeklyDeliverables.map((deliv) => (
                <div
                  key={deliv.week}
                  className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-blue-400">Week {deliv.week}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {deliv.toolApplied}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2.5">
                      {deliv.title}
                    </h4>
                    <ul className="space-y-1.5 mb-4">
                      {deliv.tasks.map((task, tidx) => (
                        <li key={tidx} className="text-xs text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 text-xs text-indigo-300 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Deliverable:</span>
                    <span className="font-semibold text-right">{deliv.expectedArtifact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommended Market AI Tools for Your Domain */}
      <div className="mb-14">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Recommended AI Tool Stack for {domain}
          </h2>
          <p className="text-xs text-slate-400">
            Current market-leading tools verified for enterprise deployment and high personal leverage in your role.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {customizedJourney.domainToolStack.map((tool) => (
            <div
              key={tool.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-base font-bold text-white">
                    {tool.name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                    {tool.vendor}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>

                <div className="space-y-1 mb-4">
                  {tool.keyStrengths.slice(0, 2).map((str: string, i: number) => (
                    <div key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-emerald-400">
                  {tool.freeTierOrTrial ? 'Free Tier / Trial' : 'Enterprise'}
                </span>

                <a
                  href={tool.accessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  Explore Tool
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Immediate Quick Wins & Enterprise Governance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-sm">
            <Zap className="w-4 h-4" />
            <span>Immediate 7-Day Quick Wins</span>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            {customizedJourney.quickWinsImmediateAction.map((win, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  {idx + 1}
                </div>
                <span className="leading-relaxed">{win}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-purple-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Enterprise Safety & Privacy Rules</span>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            {customizedJourney.governanceChecklist.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  ✓
                </div>
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Executive Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-gradient-to-br from-slate-900 via-[#0d1424] to-slate-950 border-2 border-indigo-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
            <button
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 cursor-pointer"
            >
              Close
            </button>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">
                  Executive Certificate of Applied Competency
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  Level 2: Applied AI Specialist
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Real-World Use Cases & Market AI Tools Benchmark
                </p>
              </div>

              <div className="my-6 p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 max-w-md mx-auto">
                <p className="text-xs text-slate-400">Awarded to</p>
                <h4 className="text-xl font-bold text-white">{userName}</h4>
                <p className="text-xs text-indigo-300 mt-1">
                  {tierLabel} • Score: {overallScore}/100
                </p>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">
                  Domain: {domain} • Verified on {formattedDate}
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handlePrint}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 cursor-pointer flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Official Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
