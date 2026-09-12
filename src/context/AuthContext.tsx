import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, getUserSubmissions, loginWithGoogle, logAdminAction, logoutUser, syncUserProfile, testFirestoreConnection } from '../services/firebase';
import { AssessmentSubmission, PortalUser, UserAccount } from '../types/assessment';

interface AuthContextType {
  user: (FirebaseUser | PortalUser) | null;
  account: UserAccount | null;
  loading: boolean;
  isAdmin: boolean;
  adminSessionActive: boolean;
  firebaseConnected: boolean;
  hasCompletedAssessment: boolean;
  latestSubmission: AssessmentSubmission | null;
  signInWithGoogle: () => Promise<void>;
  signInDirectLearner: (name: string, email: string, category?: string, domain?: string) => Promise<UserAccount>;
  logout: () => Promise<void>;
  loginAdminCredentials: (adminId: string, pass: string) => Promise<boolean>;
  logoutAdminSession: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(FirebaseUser | PortalUser) | null>(null);
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(true);
  const [adminSessionActive, setAdminSessionActive] = useState<boolean>(() => {
    return sessionStorage.getItem('portal_admin_session') === 'true';
  });
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [latestSubmission, setLatestSubmission] = useState<AssessmentSubmission | null>(null);

  // Initialize test connection and auth listener
  useEffect(() => {
    let mounted = true;

    testFirestoreConnection().then((connected) => {
      if (mounted) setFirebaseConnected(connected);
    });

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!mounted) return;

      if (currentUser) {
        setUser(currentUser);
        try {
          const synced = await syncUserProfile(currentUser);
          if (mounted) setAccount(synced);

          // Check if user has already completed an assessment
          const subs = await getUserSubmissions(currentUser.uid);
          if (mounted) {
            if (subs.length > 0) {
              setHasCompletedAssessment(true);
              setLatestSubmission(subs[0]);
            } else {
              setHasCompletedAssessment(false);
              setLatestSubmission(null);
            }
          }
        } catch (e) {
          console.error('Error syncing profile/submissions on auth state:', e);
        }
        setLoading(false);
      } else {
        // Check if there is a saved direct learner session in localStorage (for all devices / mobile browsers)
        try {
          const savedDirectUser = localStorage.getItem('portal_direct_user');
          if (savedDirectUser) {
            const parsed = JSON.parse(savedDirectUser) as PortalUser;
            if (parsed && parsed.uid && parsed.email) {
              setUser(parsed);
              const synced = await syncUserProfile(parsed);
              if (mounted) setAccount(synced);

              const subs = await getUserSubmissions(parsed.uid);
              if (mounted) {
                if (subs.length > 0) {
                  setHasCompletedAssessment(true);
                  setLatestSubmission(subs[0]);
                } else {
                  setHasCompletedAssessment(false);
                  setLatestSubmission(null);
                }
              }
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn('Error reading stored direct learner:', e);
        }

        setUser(null);
        setAccount(null);
        setHasCompletedAssessment(false);
        setLatestSubmission(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const refreshUserData = async () => {
    if (!user) return;
    try {
      const subs = await getUserSubmissions(user.uid);
      if (subs.length > 0) {
        setHasCompletedAssessment(true);
        setLatestSubmission(subs[0]);
      } else {
        setHasCompletedAssessment(false);
        setLatestSubmission(null);
      }
    } catch (e) {
      console.warn('Submissions refresh failed:', e);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const loggedUser = await loginWithGoogle();
      setUser(loggedUser);
      const synced = await syncUserProfile(loggedUser);
      setAccount(synced);
      const subs = await getUserSubmissions(loggedUser.uid);
      if (subs.length > 0) {
        setHasCompletedAssessment(true);
        setLatestSubmission(subs[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Direct Learner Sign-in: Works on ANY device, mobile Safari, Android, or embedded browsers
  const signInDirectLearner = async (
    name: string,
    email: string,
    category?: string,
    domain?: string
  ): Promise<UserAccount> => {
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();
      // Deterministic UID based on email string to prevent duplicate accounts for same email
      const safeId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
      const uid = `learner_${safeId}`;

      const portalUser: PortalUser = {
        uid,
        displayName: cleanName,
        email: cleanEmail,
        photoURL: null,
        isDirect: true
      };

      setUser(portalUser);
      localStorage.setItem('portal_direct_user', JSON.stringify(portalUser));

      const synced = await syncUserProfile({
        ...portalUser,
        ...(category ? { participantCategory: category } : {}),
        ...(domain ? { domain } : {})
      } as any);

      setAccount(synced);

      // Check existing submissions
      try {
        const subs = await getUserSubmissions(uid);
        if (subs.length > 0) {
          setHasCompletedAssessment(true);
          setLatestSubmission(subs[0]);
        }
      } catch (e) {
        // ignore
      }

      return synced;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      localStorage.removeItem('portal_direct_user');
      localStorage.removeItem('portal_current_user_profile');
      setUser(null);
      setAccount(null);
      setHasCompletedAssessment(false);
      setLatestSubmission(null);
    } finally {
      setLoading(false);
    }
  };

  // Hardcoded Admin ID: KAPILADMIN / Password: ADMIN123 as requested in specification
  const loginAdminCredentials = async (adminId: string, pass: string): Promise<boolean> => {
    const trimmedId = adminId.trim();
    const trimmedPass = pass.trim();

    if (trimmedId === 'KAPILADMIN' && trimmedPass === 'ADMIN123') {
      setAdminSessionActive(true);
      sessionStorage.setItem('portal_admin_session', 'true');
      sessionStorage.setItem('portal_admin_user', trimmedId);

      // Audit log
      logAdminAction(
        user?.uid || 'KAPILADMIN-SESSION',
        user?.email || 'admin@portal.internal',
        'ADMIN_CREDENTIAL_LOGIN',
        { timestamp: new Date().toISOString() }
      );

      return true;
    }
    return false;
  };

  const logoutAdminSession = () => {
    setAdminSessionActive(false);
    sessionStorage.removeItem('portal_admin_session');
    sessionStorage.removeItem('portal_admin_user');
  };

  // Role calculation:
  // User is admin if hardcoded admin session is active OR Google email is kapilnarula27july@gmail.com OR role in database is admin
  const isGoogleAdmin = user?.email?.toLowerCase() === 'kapilnarula27july@gmail.com';
  const isDatabaseAdmin = account?.role === 'admin';
  const isAdmin = adminSessionActive || isGoogleAdmin || isDatabaseAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        account,
        loading,
        isAdmin,
        adminSessionActive,
        firebaseConnected,
        hasCompletedAssessment,
        latestSubmission,
        signInWithGoogle: handleGoogleSignIn,
        signInDirectLearner,
        logout: handleLogout,
        loginAdminCredentials,
        logoutAdminSession,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
