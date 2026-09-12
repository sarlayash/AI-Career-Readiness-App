import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  ShieldCheck, 
  FileText, 
  LogOut, 
  LogIn, 
  History, 
  Menu, 
  X, 
  Sparkles,
  Lock,
  Zap,
  Mail
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenAdminLogin: () => void;
  onOpenRegisterModal?: () => void;
  onOpenEmailReminders?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentRoute, 
  onNavigate, 
  onOpenAdminLogin,
  onOpenRegisterModal,
  onOpenEmailReminders
}) => {
  const { user, isAdmin, hasCompletedAssessment, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0c1222]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            id="brand-logo-container"
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <span className="font-semibold text-slate-100 text-base tracking-tight flex items-center gap-1.5">
                AI Career Readiness
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  v1.0
                </span>
              </span>
              <p className="text-[11px] text-slate-400 -mt-0.5 font-normal">
                Self-Assessment Portal
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              id="nav-home-btn"
              onClick={() => handleNav('/')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentRoute === '/' 
                  ? 'text-white bg-slate-800/80' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Home
            </button>

            <button
              id="nav-assessment-btn"
              onClick={() => handleNav('/assessment')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentRoute === '/assessment' 
                  ? 'text-white bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Level 1
            </button>

            <button
              id="nav-level2-btn"
              onClick={() => handleNav('/level2')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentRoute.startsWith('/level2')
                  ? 'text-white bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' 
                  : 'text-indigo-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Level 2: Applied AI</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                NEW
              </span>
            </button>

            {/* Featured Masterclass 1-Click Quick CTA in Header */}
            {onOpenRegisterModal && (
              <button
                id="nav-webinar-quick-register-btn"
                onClick={onOpenRegisterModal}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:border-blue-400"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span>Oct 15 Masterclass (1-Click)</span>
              </button>
            )}

            {hasCompletedAssessment && (
              <>
                <button
                  id="nav-report-btn"
                  onClick={() => handleNav('/report')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentRoute === '/report' 
                      ? 'text-white bg-slate-800/80' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  My Report
                </button>
                <button
                  id="nav-history-btn"
                  onClick={() => handleNav('/my-submissions')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentRoute === '/my-submissions' 
                      ? 'text-white bg-slate-800/80' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  History
                </button>
              </>
            )}

            <button
              id="nav-privacy-btn"
              onClick={() => handleNav('/privacy')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentRoute === '/privacy' 
                  ? 'text-white bg-slate-800/80' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Privacy
            </button>

            {/* Admin Dashboard Link */}
            <button
              id="nav-admin-btn"
              onClick={() => handleNav('/admin')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentRoute.startsWith('/admin')
                  ? 'text-indigo-300 bg-indigo-950/60 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800/40'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Admin Portal
            </button>
          </div>

          {/* Desktop Right Side / Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Notification Center */}
            <NotificationCenter 
              onOpenEmailReminders={onOpenEmailReminders}
              onNavigate={handleNav}
            />

            {!isAdmin && (
              <button
                id="admin-access-lock-btn"
                onClick={onOpenAdminLogin}
                title="Admin Staff Login"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors text-xs flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[11px]">Staff Access</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-7 h-7 rounded-full border border-slate-700"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-medium text-slate-200 truncate max-w-[120px]">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    {isAdmin && (
                      <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-wider">
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                <button
                  id="user-logout-btn"
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded-md transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={() => handleNav('/login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <NotificationCenter 
              onOpenEmailReminders={onOpenEmailReminders}
              onNavigate={handleNav}
            />

            {user && (
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                {(user.displayName || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-md focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e1628] border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {onOpenRegisterModal && (
            <button
              id="mobile-nav-webinar-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegisterModal();
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold text-yellow-300 bg-blue-950/70 border border-blue-500/40 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-yellow-300" />
              <span>Oct 15 Masterclass (1-Click Register)</span>
            </button>
          )}

          <button
            id="mobile-nav-home"
            onClick={() => handleNav('/')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </button>
          <button
            id="mobile-nav-assessment"
            onClick={() => handleNav('/assessment')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-blue-400 hover:bg-slate-800 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Level 1 Assessment</span>
          </button>
          <button
            id="mobile-nav-level2"
            onClick={() => handleNav('/level2')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-indigo-300 hover:bg-slate-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Level 2: Applied AI</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              NEW
            </span>
          </button>
          {hasCompletedAssessment && (
            <>
              <button
                id="mobile-nav-report"
                onClick={() => handleNav('/report')}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                My Report
              </button>
              <button
                id="mobile-nav-history"
                onClick={() => handleNav('/my-submissions')}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Submission History
              </button>
            </>
          )}

          {onOpenEmailReminders && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEmailReminders();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-blue-400 hover:bg-slate-800 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email & Weekly Reminders Hub</span>
            </button>
          )}

          <button
            id="mobile-nav-admin"
            onClick={() => handleNav('/admin')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-indigo-400 hover:bg-slate-800 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Dashboard
          </button>
          <button
            id="mobile-nav-privacy"
            onClick={() => handleNav('/privacy')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-slate-800"
          >
            Privacy Notice
          </button>

          <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between">
            {!isAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminLogin();
                }}
                className="text-xs text-slate-400 flex items-center gap-1 hover:text-slate-200"
              >
                <Lock className="w-3.5 h-3.5" /> Staff Access
              </button>
            )}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-red-400 flex items-center gap-1 hover:text-red-300"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            ) : (
              <button
                onClick={() => handleNav('/login')}
                className="text-xs text-blue-400 font-semibold flex items-center gap-1 hover:text-blue-300"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
