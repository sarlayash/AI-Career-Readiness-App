import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, getUserSubmissions, loginWithGoogle, logAdminAction, logoutUser, syncUserProfile, testFirestoreConnection } from '../services/firebase';
import { AssessmentSubmission, UserAccount } from '../types/assessment';

interface AuthContextType {
  user: FirebaseUser | null;
  account: UserAccount | null;
  loading: boolean;
  isAdmin: boolean;
  adminSessionActive: boolean;
  firebaseConnected: boolean;
  hasCompletedAssessment: boolean;
  latestSubmission: AssessmentSubmission | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loginAdminCredentials: (adminId: string, pass: string) => Promise<boolean>;
  logoutAdminSession: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
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
      setUser(currentUser);

      if (currentUser) {
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
      } else {
        setAccount(null);
        setHasCompletedAssessment(false);
        setLatestSubmission(null);
      }
      setLoading(false);
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

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
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
