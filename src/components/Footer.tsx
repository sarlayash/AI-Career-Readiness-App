import React from 'react';
import { Compass, ShieldCheck, FileCheck2, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdminLogin }) => {
  return (
    <footer className="bg-[#080d19] border-t border-slate-800/80 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-100 text-base">
                AI Career Readiness Self-Assessment
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              An initiative designed to help learners understand, adapt, and grow in the intelligent workplace.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Deterministic scoring • Evidence-based dimensions • Strict privacy governance
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Assessment
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  id="footer-nav-start"
                  onClick={() => onNavigate('/assessment')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Start Assessment
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-report"
                  onClick={() => onNavigate('/report')}
                  className="hover:text-blue-400 transition-colors"
                >
                  My Readiness Report
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-history"
                  onClick={() => onNavigate('/my-submissions')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Submission History
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-privacy"
                  onClick={() => onNavigate('/privacy')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy & Data Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Administrative & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Program Operations
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  id="footer-nav-admin"
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Admin Dashboard
                </button>
              </li>
              <li>
                <button
                  id="footer-staff-login"
                  onClick={onOpenAdminLogin}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Authorized Staff Access
                </button>
              </li>
              <li>
                <span className="text-xs text-slate-500 block pt-1">
                  Indicative self-assessment tool. Not an employment ranking or psychometric evaluation.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} AI Career Readiness Self-Assessment Portal. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('/privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              Consent & Methodology
            </button>
            <span>•</span>
            <span className="text-slate-500">
              Built with Firebase Firestore & AI Studio
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
