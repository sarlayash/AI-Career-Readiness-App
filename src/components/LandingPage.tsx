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
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-800/80 bg-gradient-to-b from-[#0b101e] via-[#0d1424] to-[#090e1a]">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Readiness Framework 1.0</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.15] max-w-4xl mx-auto uppercase font-['Space_Grotesk']">
            AI is changing the workplace.
          </h1>

          {/* Subheadline */}
          <h2 className="mt-4 text-xl sm:text-2xl font-medium text-slate-200 max-w-2xl mx-auto leading-snug">
            How ready are you to learn, adapt, and create value in the intelligent workplace?
          </h2>

          {/* Description */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            This self-assessment benchmarks your AI competencies across 5 core dimensions against enterprise standards from leading tech companies. An executive blueprint for career acceleration.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-start-assessment-btn"
              onClick={onStartAssessment}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Start My AI Readiness Assessment</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {onOpenRegisterModal && (
              <button
                id="hero-register-webinar-btn"
                onClick={onOpenRegisterModal}
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg text-base font-semibold text-yellow-300 bg-slate-900/90 hover:bg-slate-800 border border-yellow-500/40 hover:border-yellow-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-yellow-500/5"
              >
                <Zap className="w-4 h-4 fill-yellow-300" />
                <span>1-Click Masterclass (Oct 15)</span>
              </button>
            )}

            <button
              id="hero-how-it-works-btn"
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg text-base font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>How It Works</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Fortune 500 Benchmark Cohort Ticker */}
          <div className="mt-10 pt-6 border-t border-slate-800/60">
            <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold mb-3">
              Benchmarked Against Enterprise Frameworks & Industry Leaders
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-300">
              <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Google DeepMind AI
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> OpenAI Enterprise
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> AWS GenAI / Bedrock
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Microsoft Azure AI
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" /> Meta AI Research
              </span>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/60">
              <div className="w-9 h-9 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Free self-assessment</h3>
                <p className="text-xs text-slate-400">Open to all students & professionals</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/60">
              <div className="w-9 h-9 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Approximately 5–7 minutes</h3>
                <p className="text-xs text-slate-400">26 reflective & scenario questions</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/60">
              <div className="w-9 h-9 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Personalized readiness report</h3>
                <p className="text-xs text-slate-400">30-day action plan & radar metrics</p>
              </div>
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
