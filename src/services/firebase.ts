import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  AdminAuditLog,
  AssessmentConfig,
  AssessmentSubmission,
  LearningConfig,
  UserAccount,
  WebinarConfig
} from '../types/assessment';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without firebaseConfig.firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Configure local persistence for auth
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Auth persistence initialization warning:', err);
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ==========================================
// Mandatory Error Handling (Pillar from Skill)
// ==========================================
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ==========================================
// Mandatory Connection Test on initial boot
// ==========================================
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return false;
    }
    // Non-existent document is a successful connection to server
    return true;
  }
}

// ==========================================
// Auth Service Methods
// ==========================================
export async function loginWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// ==========================================
// User Profile Service
// ==========================================
export async function syncUserProfile(user: FirebaseUser): Promise<UserAccount> {
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    const existing = await getDoc(userRef);

    const now = new Date().toISOString();
    const isGoogleAdmin = user.email?.toLowerCase() === 'kapilnarula27july@gmail.com';

    let role: 'participant' | 'admin' = isGoogleAdmin ? 'admin' : 'participant';

    if (existing.exists()) {
      const data = existing.data() as UserAccount;
      // Preserve existing role if already admin
      if (data.role === 'admin' || isGoogleAdmin) {
        role = 'admin';
      }
      await updateDoc(userRef, {
        displayName: user.displayName || data.displayName,
        photoURL: user.photoURL || data.photoURL,
        lastLoginAt: now
      });
      return {
        ...data,
        displayName: user.displayName || data.displayName,
        photoURL: user.photoURL || data.photoURL,
        lastLoginAt: now,
        role
      };
    } else {
      const newAccount: UserAccount = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role,
        createdAt: now,
        lastLoginAt: now
      };
      await setDoc(userRef, newAccount);
      return newAccount;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ==========================================
// Assessment Submissions Service
// ==========================================
export async function saveAssessmentSubmission(
  submission: AssessmentSubmission
): Promise<string> {
  const path = `assessmentSubmissions/${submission.submissionId}`;
  try {
    const docRef = doc(db, 'assessmentSubmissions', submission.submissionId);
    await setDoc(docRef, submission);
    return submission.submissionId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserSubmissions(uid: string): Promise<AssessmentSubmission[]> {
  const path = 'assessmentSubmissions';
  try {
    const q = query(
      collection(db, 'assessmentSubmissions'),
      where('uid', '==', uid)
    );
    const snap = await getDocs(q);
    const submissions: AssessmentSubmission[] = [];
    snap.forEach((docSnap) => {
      submissions.push(docSnap.data() as AssessmentSubmission);
    });
    // Client sort to avoid composite index requirements
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return submissions;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function getSubmissionById(submissionId: string): Promise<AssessmentSubmission | null> {
  const path = `assessmentSubmissions/${submissionId}`;
  try {
    const docRef = doc(db, 'assessmentSubmissions', submissionId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as AssessmentSubmission;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// ==========================================
// Admin Operations
// ==========================================
export async function getAllSubmissions(): Promise<AssessmentSubmission[]> {
  const path = 'assessmentSubmissions';
  try {
    const snap = await getDocs(collection(db, 'assessmentSubmissions'));
    const submissions: AssessmentSubmission[] = [];
    snap.forEach((docSnap) => {
      submissions.push(docSnap.data() as AssessmentSubmission);
    });
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return submissions;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function logAdminAction(
  adminUid: string,
  adminEmail: string,
  action: string,
  metadata?: Record<string, any>
): Promise<void> {
  const path = 'adminAuditLogs';
  try {
    await addDoc(collection(db, 'adminAuditLogs'), {
      adminUid,
      adminEmail,
      action,
      timestamp: new Date().toISOString(),
      metadata: metadata || {}
    });
  } catch (error) {
    console.warn('Audit log write error (non-fatal):', error);
  }
}

export async function getAdminAuditLogs(): Promise<AdminAuditLog[]> {
  const path = 'adminAuditLogs';
  try {
    const snap = await getDocs(query(collection(db, 'adminAuditLogs'), limit(100)));
    const logs: AdminAuditLog[] = [];
    snap.forEach((d) => {
      logs.push({ id: d.id, ...(d.data() as AdminAuditLog) });
    });
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return logs;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveAssessmentConfig(config: AssessmentConfig): Promise<void> {
  const path = `assessmentConfigs/${config.assessmentVersion}`;
  try {
    await setDoc(doc(db, 'assessmentConfigs', config.assessmentVersion), config);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getAssessmentConfig(): Promise<AssessmentConfig | null> {
  const path = 'assessmentConfigs/v1.0.0';
  try {
    const snap = await getDoc(doc(db, 'assessmentConfigs', 'v1.0.0'));
    if (!snap.exists()) return null;
    return snap.data() as AssessmentConfig;
  } catch (error) {
    console.warn('Config fetch returned default fallback:', error);
    return null;
  }
}

export async function saveWebinarConfig(config: WebinarConfig): Promise<void> {
  const path = 'webinarConfig/default';
  try {
    await setDoc(doc(db, 'webinarConfig', 'default'), config);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getWebinarConfig(): Promise<WebinarConfig | null> {
  const path = 'webinarConfig/default';
  try {
    const snap = await getDoc(doc(db, 'webinarConfig', 'default'));
    if (!snap.exists()) return null;
    return snap.data() as WebinarConfig;
  } catch (error) {
    return null;
  }
}

export async function saveLearningConfig(config: LearningConfig): Promise<void> {
  const path = 'learningConfig/default';
  try {
    await setDoc(doc(db, 'learningConfig', 'default'), config);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export const updateAssessmentConfig = saveAssessmentConfig;
export const updateWebinarConfig = saveWebinarConfig;
export const updateLearningConfig = saveLearningConfig;

export async function getLearningConfig(): Promise<LearningConfig | null> {
  const path = 'learningConfig/default';
  try {
    const snap = await getDoc(doc(db, 'learningConfig', 'default'));
    if (!snap.exists()) return null;
    return snap.data() as LearningConfig;
  } catch (error) {
    return null;
  }
}
