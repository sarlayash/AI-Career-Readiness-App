import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface PrivacyNoticeProps {
  onBack: () => void;
}

export const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Previous Screen</span>
      </button>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Governance & Privacy Notice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Privacy and Assessment Transparency Notice
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Last updated: September 2026 • AI Career Readiness Self-Assessment Platform
          </p>
        </div>

        {/* Section 1: What information is collected */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" />
            1. What Information We Collect
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            We adhere strictly to data minimization principles and only gather non-sensitive attributes directly required for report generation and aggregated learning analytics:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300">
            <li><strong>Identity Details:</strong> Full name and verified email address via Google Sign-In. We never see or store your Google password.</li>
            <li><strong>Contextual Categorization:</strong> Participant category, highest education level, experience bracket, occupational domain, and primary career goal.</li>
            <li><strong>Assessment Responses:</strong> Your selected answers across the 26 structured reflection and scenario questions.</li>
            <li><strong>Technical Timestamps:</strong> Submission timestamp and assessment version for scoring reproducibility.</li>
          </ul>
          <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 text-xs text-slate-400">
            <strong>Exclusion Guarantee:</strong> We do NOT collect location coordinates, caste, religion, political affiliation, biometric data, financial accounts, or unnecessary sensitive data.
          </div>
        </section>

        {/* Section 2: Why it is collected */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-400" />
            2. Why It Is Collected & How Responses Are Used
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Your data serves two distinct purposes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
              <h3 className="text-xs font-semibold text-slate-200">Individual Benefit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                To calculate your deterministic dimension scores and generate your personalized 30-day learning roadmap and radar chart.
              </p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
              <h3 className="text-xs font-semibold text-slate-200">Program Improvement</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                To evaluate aggregate audience skill gaps, identify prevalent misconceptions, and design relevant curriculum without exposing personal names or emails.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Indicative self-assessment status */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            3. Indicative Self-Assessment Declaration
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            This platform is an indicative self-reflection instrument. The resultant readiness bands and scores:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-300">
            <li>Are <strong>NOT</strong> an employment ranking or recruitment filter.</li>
            <li>Are <strong>NOT</strong> a scientific psychometric test.</li>
            <li>Are <strong>NOT</strong> a professional certification or diploma.</li>
            <li>Do not guarantee job placements, salary increases, or immediate career outcomes.</li>
          </ul>
        </section>

        {/* Section 4: Security & Access Control */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            4. Access Control & Security
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            All records are stored within Google Cloud Firestore protected by hardened Firestore Security Rules. Participants can only read and write their own submissions. Administrative access requires verified administrative role credentials and logs an append-only audit trail.
          </p>
        </section>

        {/* Section 5: Program Team Contact */}
        <section className="space-y-3 pt-4 border-t border-slate-800">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            5. Contacting the Program Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            For questions regarding this assessment, dataset correction, or deletion requests, contact the program coordinator:
          </p>
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 text-xs text-slate-300">
            <div>Program Lead: <strong>Kapil Narula</strong></div>
            <div>Support Email: <a href="mailto:kapilnarula27july@gmail.com" className="text-blue-400 hover:underline">kapilnarula27july@gmail.com</a></div>
            <div className="text-[11px] text-slate-500 mt-1">AI Career Readiness Self-Assessment Initiative</div>
          </div>
        </section>
      </div>
    </div>
  );
};
