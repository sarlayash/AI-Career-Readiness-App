import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { AssessmentIntro } from './components/AssessmentIntro';
import { AssessmentFlow } from './components/AssessmentFlow';
import { ReportView } from './components/ReportView';
import { SubmissionsHistory } from './components/SubmissionsHistory';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { PrivacyNotice } from './components/PrivacyNotice';
import { LoginPage } from './components/LoginPage';
import { DEFAULT_ASSESSMENT_CONFIG, DEFAULT_LEARNING_CONFIG, DEFAULT_WEBINAR_CONFIG } from './config/defaultConfigs';
import { AssessmentConfig, AssessmentSubmission, LearningConfig, UserProfile, WebinarConfig, WebinarRegistration } from './types/assessment';
import { Level2Submission } from './types/level2';
import { getAssessmentConfig, getLearningConfig, getWebinarConfig, getUserWebinarRegistration, getUserLatestLevel2Submission } from './services/firebase';
import { OneClickRegisterModal } from './components/OneClickRegisterModal';
import { EmailRemindersModal } from './components/EmailRemindersModal';
import { Level2Intro } from './components/level2/Level2Intro';
import { Level2Flow } from './components/level2/Level2Flow';
import { Level2ReportView } from './components/level2/Level2ReportView';

const AppContent: React.FC = () => {
  const { user, latestSubmission, hasCompletedAssessment } = useAuth();

  // Routing state
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash ? `/${hash}` : '/';
  });

  // Active configurations loaded from Firestore with local defaults
  const [config, setConfig] = useState<AssessmentConfig>(DEFAULT_ASSESSMENT_CONFIG);
  const [webinarConfig, setWebinarConfig] = useState<WebinarConfig | null>(DEFAULT_WEBINAR_CONFIG);
  const [learningConfig, setLearningConfig] = useState<LearningConfig | null>(DEFAULT_LEARNING_CONFIG);

  // Assessment runtime flow state
  const [assessmentStage, setAssessmentStage] = useState<'intro' | 'flow'>('intro');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [consent, setConsent] = useState<boolean>(false);
  const [viewingSubmission, setViewingSubmission] = useState<AssessmentSubmission | null>(null);

  // Admin login modal toggle
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // 1-Click Masterclass & Email Reminders state
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [emailRemindersModalOpen, setEmailRemindersModalOpen] = useState(false);
  const [userRegistration, setUserRegistration] = useState<WebinarRegistration | null>(null);

  // Level 2 Applied AI Benchmark state
  const [level2Stage, setLevel2Stage] = useState<'intro' | 'flow'>('intro');
  const [level2Profile, setLevel2Profile] = useState<{
    fullName: string;
    email: string;
    domain: string;
    experienceLevel: string;
    primaryCareerGoal: string;
  } | null>(null);
  const [latestLevel2Submission, setLatestLevel2Submission] = useState<Level2Submission | null>(null);

  // Check user registration on mount or user switch
  useEffect(() => {
    const checkReg = async () => {
      const email = user?.email || localStorage.getItem('portal_user_email');
      if (email) {
        const reg = await getUserWebinarRegistration(email);
        if (reg) {
          setUserRegistration(reg);
        }
      }
    };
    checkReg();

    // Fetch Level 2 submission
    const fetchL2 = async () => {
      const idOrEmail = user?.uid || user?.email || localStorage.getItem('portal_user_email');
      if (idOrEmail) {
        const l2 = await getUserLatestLevel2Submission(idOrEmail);
        if (l2) {
          setLatestLevel2Submission(l2);
        }
      }
    };
    fetchL2();

    // Listen for cross-component registration updates
    const handleRegUpdate = (e: any) => {
      if (e.detail) {
        setUserRegistration(e.detail);
      }
    };
    window.addEventListener('portal_user_registered', handleRegUpdate);
    return () => window.removeEventListener('portal_user_registered', handleRegUpdate);
  }, [user]);

  // Load configs on mount
  const loadConfigs = async () => {
    try {
      const [remoteConfig, remoteWebinar, remoteLearning] = await Promise.allSettled([
        getAssessmentConfig(),
        getWebinarConfig(),
        getLearningConfig()
      ]);

      if (remoteConfig.status === 'fulfilled' && remoteConfig.value) {
        setConfig(remoteConfig.value);
      }
      if (remoteWebinar.status === 'fulfilled' && remoteWebinar.value) {
        setWebinarConfig(remoteWebinar.value);
      }
      if (remoteLearning.status === 'fulfilled' && remoteLearning.value) {
        setLearningConfig(remoteLearning.value);
      }
    } catch (e) {
      console.warn('Config load fallback to defaults:', e);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  // Listen to browser hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentRoute(hash ? `/${hash}` : '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route === '/' ? '' : route.replace('/', '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAssessment = () => {
    setAssessmentStage('intro');
    navigateTo('/assessment');
  };

  const handleProceedToQuestions = (profile: UserProfile, hasConsent: boolean) => {
    setUserProfile(profile);
    setConsent(hasConsent);
    setAssessmentStage('flow');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmissionComplete = (submission: AssessmentSubmission) => {
    setViewingSubmission(submission);
    setAssessmentStage('intro');
    navigateTo('/report');
  };

  const handleRetake = () => {
    setViewingSubmission(null);
    setAssessmentStage('intro');
    sessionStorage.removeItem('portal_assessment_responses');
    sessionStorage.removeItem('portal_assessment_current_index');
    navigateTo('/assessment');
  };

  // Determine active report to show
  const activeReportSubmission = viewingSubmission || latestSubmission;

  return (
    <div className="min-h-screen bg-[#090e1a] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onOpenAdminLogin={() => setAdminModalOpen(true)}
        onOpenRegisterModal={() => setRegisterModalOpen(true)}
        onOpenEmailReminders={() => setEmailRemindersModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {/* Route: Landing Home */}
        {currentRoute === '/' && (
          <LandingPage
            config={config}
            webinarConfig={webinarConfig}
            learningConfig={learningConfig}
            onStartAssessment={handleStartAssessment}
            onStartLevel2={() => {
              setLevel2Stage('intro');
              navigateTo('/level2');
            }}
            onNavigate={navigateTo}
            onOpenRegisterModal={() => setRegisterModalOpen(true)}
            onOpenEmailHub={() => setEmailRemindersModalOpen(true)}
            userRegistration={userRegistration}
          />
        )}

        {/* Route: Take Assessment */}
        {currentRoute === '/assessment' && (
          <div>
            {assessmentStage === 'intro' ? (
              <AssessmentIntro
                config={config}
                onProceedToQuestions={handleProceedToQuestions}
                onViewExistingReport={() => {
                  setViewingSubmission(latestSubmission);
                  navigateTo('/report');
                }}
                onRetake={handleRetake}
              />
            ) : (
              <AssessmentFlow
                config={config}
                profile={
                  userProfile || {
                    fullName: user?.displayName || 'Participant',
                    email: user?.email || '',
                    participantCategory: 'Working professional',
                    educationLevel: 'Undergraduate Degree',
                    experienceLevel: '1-3 years',
                    currentDomain: 'IT / Software',
                    primaryCareerGoal: 'Improve employability'
                  }
                }
                consent={consent}
                onSubmissionComplete={handleSubmissionComplete}
                onCancel={() => setAssessmentStage('intro')}
              />
            )}
          </div>
        )}

        {/* Route: Personal Report */}
        {currentRoute === '/report' && (
          <div>
            {activeReportSubmission ? (
              <ReportView
                submission={activeReportSubmission}
                onRetake={config.retakesEnabled ? handleRetake : undefined}
                onViewAll={() => navigateTo('/my-submissions')}
                onStartLevel2={() => {
                  setLevel2Stage('intro');
                  navigateTo('/level2');
                }}
              />
            ) : (
              <div className="max-w-md mx-auto px-4 py-16 text-center">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-4">
                  <h3 className="text-lg font-bold text-slate-100">
                    No Report Available
                  </h3>
                  <p className="text-xs text-slate-400">
                    You haven't completed an assessment yet. Take the 5-7 minute self-assessment to generate your report.
                  </p>
                  <button
                    onClick={handleStartAssessment}
                    className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                  >
                    Start Assessment Now
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Route: Level 2 Applied AI Benchmark */}
        {currentRoute === '/level2' && (
          <div>
            {level2Stage === 'intro' ? (
              <Level2Intro
                level1Submission={activeReportSubmission}
                onStartLevel2={(p) => {
                  setLevel2Profile(p);
                  setLevel2Stage('flow');
                }}
                onViewLevel1Report={() => navigateTo('/report')}
                onTakeLevel1First={handleStartAssessment}
              />
            ) : (
              <Level2Flow
                profile={
                  level2Profile || {
                    fullName: user?.displayName || 'Learner',
                    email: user?.email || '',
                    domain: activeReportSubmission?.profile?.currentDomain || 'IT / Software',
                    experienceLevel: activeReportSubmission?.profile?.experienceLevel || '1–3 years',
                    primaryCareerGoal: activeReportSubmission?.profile?.primaryCareerGoal || 'Upskill in applied AI'
                  }
                }
                level1Submission={activeReportSubmission}
                onComplete={(sub) => {
                  setLatestLevel2Submission(sub);
                  setLevel2Stage('intro');
                  navigateTo('/level2/report');
                }}
                onCancel={() => setLevel2Stage('intro')}
              />
            )}
          </div>
        )}

        {/* Route: Level 2 Customized Journey & Report */}
        {currentRoute === '/level2/report' && (
          <div>
            {latestLevel2Submission ? (
              <Level2ReportView
                submission={latestLevel2Submission}
                onRetake={() => {
                  setLevel2Stage('intro');
                  navigateTo('/level2');
                }}
                onViewLevel1Report={() => navigateTo('/report')}
                onViewAll={() => navigateTo('/my-submissions')}
              />
            ) : (
              <div className="max-w-md mx-auto px-4 py-16 text-center">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-4">
                  <h3 className="text-lg font-bold text-slate-100">
                    No Level 2 Report Available
                  </h3>
                  <p className="text-xs text-slate-400">
                    You haven't completed the Level 2 Applied AI Benchmark yet. Take the 6-8 minute assessment to evaluate live tools and generate your customized 90-day transformation roadmap.
                  </p>
                  <button
                    onClick={() => {
                      setLevel2Stage('intro');
                      navigateTo('/level2');
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Start Level 2 Assessment Now
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Route: Submission History */}
        {currentRoute === '/my-submissions' && (
          <SubmissionsHistory
            onSelectSubmission={(sub) => {
              setViewingSubmission(sub);
              navigateTo('/report');
            }}
            onRetake={handleRetake}
          />
        )}

        {/* Route: Admin Executive Portal */}
        {currentRoute.startsWith('/admin') && (
          <AdminDashboard
            onOpenAdminLogin={() => setAdminModalOpen(true)}
            config={config}
            webinarConfig={webinarConfig}
            learningConfig={learningConfig}
            onRefreshConfig={loadConfigs}
            onOpenEmailHub={() => setEmailRemindersModalOpen(true)}
          />
        )}

        {/* Route: Privacy Notice */}
        {currentRoute === '/privacy' && (
          <PrivacyNotice onBack={() => navigateTo('/')} />
        )}

        {/* Route: Login & Account */}
        {currentRoute === '/login' && (
          <LoginPage
            onStartAssessment={handleStartAssessment}
            onViewReport={() => navigateTo('/report')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenAdminLogin={() => setAdminModalOpen(true)}
      />

      {/* 1-Click Webinar Masterclass Registration Modal */}
      <OneClickRegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        webinarConfig={webinarConfig}
        onSuccess={(reg) => {
          setUserRegistration(reg);
        }}
        onOpenEmailHub={() => setEmailRemindersModalOpen(true)}
      />

      {/* Professional Email & Weekly Reminders Hub Modal */}
      <EmailRemindersModal
        isOpen={emailRemindersModalOpen}
        onClose={() => setEmailRemindersModalOpen(false)}
        userEmail={user?.email || userRegistration?.email}
        userName={user?.displayName || userRegistration?.fullName}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onSuccess={() => {
          navigateTo('/admin');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
