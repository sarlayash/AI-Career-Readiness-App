import React from 'react';
import { 
  Sparkles, 
  Clock, 
  Award, 
  Shield, 
  ChevronRight, 
  BookOpen, 
  Cpu, 
  Briefcase, 
  TrendingUp, 
  FolderGit2, 
  Calendar, 
  ExternalLink,
  CheckCircle2,
  Layers,
  ArrowRight,
  Zap,
  Star
} from 'lucide-react';
import { DIMENSIONS } from '../config/defaultConfigs';
import { AssessmentConfig, LearningConfig, WebinarConfig, WebinarRegistration } from '../types/assessment';
import { FeaturedWebinarBanner } from './FeaturedWebinarBanner';

interface LandingPageProps {
  config: AssessmentConfig;
  webinarConfig: WebinarConfig | null;
  learningConfig: LearningConfig | null;
  onStartAssessment: () => void;
  onNavigate: (route: string) => void;
  onOpenRegisterModal?: () => void;
  onOpenEmailHub?: () => void;
  userRegistration?: WebinarRegistration | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  config,
  webinarConfig,
  learningConfig,
  onStartAssessment,
  onNavigate,
  onOpenRegisterModal,
  onOpenEmailHub,
  userRegistration
}) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const dimensionIcons: Record<string, React.ReactNode> = {
    ai_literacy: <BookOpen className="w-5 h-5 text-blue-400" />,
    tool_fluency: <Cpu className="w-5 h-5 text-indigo-400" />,
    domain_application: <Briefcase className="w-5 h-5 text-sky-400" />,
    career_adaptability: <TrendingUp className="w-5 h-5 text-violet-400" />,
    evidence_of_work: <FolderGit2 className="w-5 h-5 text-emerald-400" />
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - FAANG / Fortune 500 Executive Styling */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/80 bg-[#070b14]">
        {/* Subtle geometric ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent rounded-[100%] blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Magnetic Executive Copy */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>Enterprise AI Benchmark Framework 2026</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.1] font-['Space_Grotesk']">
                AI is reconfiguring the workplace. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300">Where do you stand?</span>
              </h1>

              {/* Subheadline & description */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
                Benchmark your generative AI capabilities, operational workflow fluency, and career defensibility against frameworks calibrated by Fortune 500 technical leaders. Gain a concrete 30-day action plan in under 7 minutes.
              </p>

              {/* Primary Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  id="hero-start-assessment-btn"
                  onClick={onStartAssessment}
                  className="px-8 py-4 rounded-xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Start AI Readiness Assessment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {onOpenRegisterModal && (
                  <button
                    id="hero-register-webinar-btn"
                    onClick={onOpenRegisterModal}
                    className="px-6 py-4 rounded-xl text-sm sm:text-base font-semibold text-amber-300 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/5"
                  >
                    <Zap className="w-4 h-4 fill-amber-300" />
                    <span>1-Click Masterclass (Oct 15)</span>
                  </button>
                )}
              </div>

              {/* Live Cohort Micro-stats */}
              <div className="pt-3 flex flex-wrap items-center gap-5 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">KN</div>
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">AS</div>
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-emerald-600 text-[10px] font-bold text-white flex items-center justify-center">VR</div>
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-amber-600 text-[10px] font-bold text-white flex items-center justify-center">ML</div>
                  </div>
                  <span className="text-slate-200 font-semibold">1,840+ Evaluated</span>
                </div>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">5 Dimensions</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">26 Scenarios</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">Deterministic Radar</span>
              </div>
            </div>

            {/* Right Column: Interactive FAANG Scorecard Preview Card (Catches Attention Instantly) */}
            <div className="lg:col-span-5">
              <div className="bg-[#0e1628]/95 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-blue-950/40 relative overflow-hidden backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                        Executive Benchmark Sample
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Senior Professional • IT & Enterprise
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    84 / 100
                  </span>
                </div>

                {/* Dimension Breakdown Bars */}
                <div className="space-y-3.5 mb-5">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-slate-300">AI Literacy & Core Concepts</span>
                      <span className="text-blue-400 font-mono">88%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full w-[88%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-slate-300">Prompt Fluency & Tool Usage</span>
                      <span className="text-indigo-400 font-mono">82%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full w-[82%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-slate-300">Domain Workflow Integration</span>
                      <span className="text-sky-400 font-mono">90%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-400 h-full rounded-full w-[90%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-slate-300">Career & Cognitive Adaptability</span>
                      <span className="text-violet-400 font-mono">78%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-violet-400 h-full rounded-full w-[78%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-slate-300">Proof of Applied Work (Portfolio)</span>
                      <span className="text-emerald-400 font-mono">84%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full w-[84%]" />
                    </div>
                  </div>
                </div>

                {/* Key Insight Preview */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-left mb-4">
                  <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Key Competitive Advantage</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Strong capability in automating routine analytical tasks and integrating LLMs into existing engineering stacks with high accuracy.
                  </p>
                </div>

                <button
                  onClick={onStartAssessment}
                  className="w-full py-2.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Evaluate Your Own Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Fortune 500 / FAANG Trust Bar */}
          <div className="mt-14 pt-8 border-t border-slate-800/80 text-center">
            <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold mb-4">
              Calibrated Against Enterprise Competency Frameworks
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-semibold text-slate-300">
              <span className="px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 flex items-center gap-2 hover:border-slate-700 transition-colors">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Google AI & Cloud
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 flex items-center gap-2 hover:border-slate-700 transition-colors">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> OpenAI Enterprise
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 flex items-center gap-2 hover:border-slate-700 transition-colors">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Amazon AWS GenAI
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 flex items-center gap-2 hover:border-slate-700 transition-colors">
                <span className="w-2 h-2 rounded-full bg-cyan-500" /> Microsoft Azure AI
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 flex items-center gap-2 hover:border-slate-700 transition-colors">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Meta AI Platforms
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 flex items-center gap-2 hover:border-slate-700 transition-colors">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> NVIDIA Enterprise
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Masterclass Banner with 1-Click Registration, Live Push Notification & Reminders */}
      <FeaturedWebinarBanner
        webinarConfig={webinarConfig}
        onOpenRegisterModal={onOpenRegisterModal || (() => {})}
        onOpenEmailHub={onOpenEmailHub || (() => {})}
        userRegistration={userRegistration || null}
      />

      {/* 5 Dimensions Grid */}
      <section className="py-16 md:py-24 bg-[#090e1a] border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Five Essential Career Dimensions
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              True career readiness extends beyond prompting chatbots. We measure comprehensive, practical capabilities required in modern organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIMENSIONS.map((dim, idx) => (
              <div 
                key={dim.id}
                className={`bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 p-6 rounded-xl transition-all flex flex-col justify-between ${
                  idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-800/90 flex items-center justify-center">
                      {dimensionIcons[dim.id]}
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-500">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-100 mb-2">
                    {dim.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                    {dim.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/60">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                    Key Areas Evaluated
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {dim.focusAreas.map((area) => (
                      <span
                        key={area}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works-section" className="py-16 md:py-24 bg-[#0c1220] border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium mb-3">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Structured Evaluation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              How The Assessment Works
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              A transparent, deterministic path from personal reflection to actionable development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl relative">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">
                Google Authentication
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sign in securely with your Google account to safeguard and store your assessment history.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">
                Context & Domain Profile
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide your domain, experience tier, and career goal so recommendations match your real situation.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl relative">
              <div className="w-8 h-8 rounded-full bg-sky-600/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">
                Reflect & Scenarios
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Answer 26 curated questions evaluating practical workflows, ethics, prompting, and evidence of work.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl relative">
              <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm mb-4">
                4
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">
                Actionable 30-Day Plan
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive instant radar metrics, pinpoint strengths, growth bottlenecks, and a 4-week learning roadmap.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              id="how-it-works-start-cta"
              onClick={onStartAssessment}
              className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Begin Your Self-Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Recommended Learning CTA Banner */}
      {learningConfig && learningConfig.ctaEnabled && (
        <section className="py-12 bg-[#090d18] border-b border-slate-800/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h3 className="text-xl font-bold text-slate-200 mb-2">
              {learningConfig.title}
            </h3>
            <p className="text-sm text-slate-400 max-w-xl mx-auto mb-6">
              {learningConfig.description}
            </p>
            <a
              id="landing-learning-path-btn"
              href={learningConfig.learningUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <span>{learningConfig.ctaLabel || 'Explore Guided Curriculum'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      )}

      {/* Explicit Assessment Disclaimer Notice */}
      <section className="py-8 bg-[#070b14] text-xs text-slate-400">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 font-medium text-slate-300">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Transparency Notice</span>
          </div>
          <p className="leading-relaxed text-slate-400">
            This assessment is an indicative self-reflection platform designed to support structured learning decisions. It is not an employment exam, does not provide professional certifications, is not a scientific psychometric test, and does not guarantee job offers or workplace advancement.
          </p>
        </div>
      </section>
    </div>
  );
};
