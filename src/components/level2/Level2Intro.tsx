import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Bot, 
  Code, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Zap, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { AssessmentSubmission } from '../../types/assessment';
import { DOMAINS, EXPERIENCE_LEVELS, CAREER_GOALS } from '../../config/defaultConfigs';

interface Level2IntroProps {
  level1Submission: AssessmentSubmission | null;
  onStartLevel2: (profile: {
    domain: string;
    experienceLevel: string;
    primaryCareerGoal: string;
    fullName: string;
    email: string;
  }) => void;
  onViewLevel1Report?: () => void;
  onTakeLevel1First?: () => void;
}

export const Level2Intro: React.FC<Level2IntroProps> = ({
  level1Submission,
  onStartLevel2,
  onViewLevel1Report,
  onTakeLevel1First
}) => {
  const [domain, setDomain] = useState(
    level1Submission?.profile?.currentDomain || 'IT / Software'
  );
  const [experienceLevel, setExperienceLevel] = useState(
    level1Submission?.profile?.experienceLevel || '1–3 years'
  );
  const [primaryCareerGoal, setPrimaryCareerGoal] = useState(
    level1Submission?.profile?.primaryCareerGoal || 'Become more productive at work'
  );
  const [fullName, setFullName] = useState(
    level1Submission?.userName || level1Submission?.profile?.fullName || 'Learner'
  );
  const [email, setEmail] = useState(
    level1Submission?.userEmail || level1Submission?.profile?.email || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartLevel2({
      domain,
      experienceLevel,
      primaryCareerGoal,
      fullName: fullName.trim() || 'Learner',
      email: email.trim()
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Header Badge */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          Level 2 Advanced Benchmark
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          Real Use Cases & Market AI Tools
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Applied Capability Assessment
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          Evaluate your tactical proficiency across today’s cutting-edge AI ecosystem—Claude 3.5, Cursor, GPT-4o, CrewAI, NotebookLM, and RAG architectures—tailored to your Level 1 benchmark and domain profile.
        </p>
      </div>

      {/* Level 1 Ingestion Status Card */}
      {level1Submission ? (
        <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900/80 border border-blue-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Level 1 Diagnostic Synchronized
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    {level1Submission.overallScore}/100 • {level1Submission.readinessBand}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  Baseline Profile: {level1Submission.userName || 'Learner'} ({level1Submission.profile?.currentDomain || domain})
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Primary growth opportunity identified in Level 1: <strong className="text-blue-300 font-semibold">{level1Submission.generatedInsights?.dimensionName || 'Applied Practice'}</strong>. Level 2 will directly calibrate practical market scenarios to strengthen this dimension!
                </p>
              </div>
            </div>

            {onViewLevel1Report && (
              <button
                type="button"
                onClick={onViewLevel1Report}
                className="shrink-0 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                Inspect Level 1 Report
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-10 p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-300">Level 1 Not Detected</h4>
              <p className="text-xs text-amber-200/80 mt-0.5">
                For optimal customized guidance, completing Level 1 first is recommended, but you can calibrate your profile below and take Level 2 directly right now!
              </p>
            </div>
          </div>
          {onTakeLevel1First && (
            <button
              type="button"
              onClick={onTakeLevel1First}
              className="shrink-0 px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition-colors cursor-pointer"
            >
              Take Level 1 First
            </button>
          )}
        </div>
      )}

      {/* Grid: 3 Pillars of Level 2 Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Modern Frontier Models</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Benchmarking when and how to deploy Claude 3.5 Sonnet, GPT-4o, Gemini 2.0 2M context, and DeepSeek R1 for reasoning, multi-modal synthesis, and cost-efficient routing.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Claude 3.5</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">GPT-4o</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Gemini 2.0</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">DeepSeek R1</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Agents, Dev & Automation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hands-on evaluation of IDE-native agents (Cursor AI, Copilot), multi-agent delegation (CrewAI, LangGraph), and zero-code workflow automators (n8n AI, Zapier).
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Cursor AI</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">CrewAI</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">v0.dev</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">n8n AI</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">RAG & Enterprise Safety</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Practical knowledge of vector database retrieval (Pinecone), document grounding (NotebookLM), PII masking (Guardrails AI), and Zero-Data Retention security standards.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Pinecone</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">NotebookLM</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Guardrails AI</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">TruLens</span>
          </div>
        </div>
      </div>

      {/* Profile Calibration Form */}
      <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Calibrate Your Profile & Target Domain</h2>
            <p className="text-xs text-slate-400">
              The questions, scenarios, and resulting 90-day transformation roadmap are customized to this selection.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d} className="bg-slate-900 text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Experience Tier
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {EXPERIENCE_LEVELS.map((exp) => (
                  <option key={exp} value={exp} className="bg-slate-900 text-white">
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Primary Career Goal
              </label>
              <select
                value={primaryCareerGoal}
                onChange={(e) => setPrimaryCareerGoal(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {CAREER_GOALS.map((goal) => (
                  <option key={goal} value={goal} className="bg-slate-900 text-white">
                    {goal}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Estimated duration: <strong>6-8 minutes</strong> • 8 scenario challenges</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              Start Level 2 Assessment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
