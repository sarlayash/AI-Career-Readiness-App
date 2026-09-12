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
  deleteDoc,
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
  PortalNotification,
  UserAccount,
  WebinarConfig,
  WebinarRegistration
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

// ==========================================
// Webinar Registrations Service
// ==========================================
export async function registerForWebinar(registration: WebinarRegistration): Promise<WebinarRegistration> {
  const path = `webinarRegistrations/${registration.registrationId}`;
  try {
    const docRef = doc(db, 'webinarRegistrations', registration.registrationId);
    await setDoc(docRef, registration);

    // Save to local cache as fallback
    try {
      const stored = JSON.parse(localStorage.getItem('portal_webinar_registrations') || '[]');
      stored.unshift(registration);
      localStorage.setItem('portal_webinar_registrations', JSON.stringify(stored.slice(0, 100)));
    } catch (e) {
      // ignore localStorage quota
    }

    return registration;
  } catch (error) {
    // If Firestore write fails, persist locally
    console.warn('Firestore webinar write fallback to localStorage:', error);
    try {
      const stored = JSON.parse(localStorage.getItem('portal_webinar_registrations') || '[]');
      stored.unshift(registration);
      localStorage.setItem('portal_webinar_registrations', JSON.stringify(stored.slice(0, 100)));
    } catch (e) {
      // ignore
    }
    return registration;
  }
}

export async function getAllWebinarRegistrations(): Promise<WebinarRegistration[]> {
  try {
    const snap = await getDocs(collection(db, 'webinarRegistrations'));
    const list: WebinarRegistration[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as WebinarRegistration);
    });
    
    // Merge with local storage if any
    try {
      const stored: WebinarRegistration[] = JSON.parse(localStorage.getItem('portal_webinar_registrations') || '[]');
      for (const item of stored) {
        if (!list.some(r => r.registrationId === item.registrationId || r.email === item.email)) {
          list.push(item);
        }
      }
    } catch (e) {
      // ignore
    }

    list.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
    return list;
  } catch (error) {
    console.warn('Failed to fetch webinar registrations from Firestore, using local fallback:', error);
    try {
      const stored: WebinarRegistration[] = JSON.parse(localStorage.getItem('portal_webinar_registrations') || '[]');
      return stored;
    } catch (e) {
      return [];
    }
  }
}

export async function getUserWebinarRegistration(emailOrUid: string): Promise<WebinarRegistration | null> {
  if (!emailOrUid) return null;
  try {
    const all = await getAllWebinarRegistrations();
    const found = all.find(r => r.email.toLowerCase() === emailOrUid.toLowerCase() || r.uid === emailOrUid);
    return found || null;
  } catch (e) {
    return null;
  }
}

// ==========================================
// Portal Notifications Service
// ==========================================
export async function createPortalNotification(notification: PortalNotification): Promise<PortalNotification> {
  const path = `portalNotifications/${notification.notificationId}`;
  try {
    const docRef = doc(db, 'portalNotifications', notification.notificationId);
    await setDoc(docRef, notification);

    // Save to local cache
    try {
      const stored = JSON.parse(localStorage.getItem('portal_notifications') || '[]');
      stored.unshift(notification);
      localStorage.setItem('portal_notifications', JSON.stringify(stored.slice(0, 100)));
    } catch (e) {
      // ignore
    }
    return notification;
  } catch (error) {
    console.warn('Notification write fallback to local storage:', error);
    try {
      const stored = JSON.parse(localStorage.getItem('portal_notifications') || '[]');
      stored.unshift(notification);
      localStorage.setItem('portal_notifications', JSON.stringify(stored.slice(0, 100)));
    } catch (e) {
      // ignore
    }
    return notification;
  }
}

export async function getNotificationsForUser(uid?: string, email?: string, isAdmin: boolean = false): Promise<PortalNotification[]> {
  try {
    const snap = await getDocs(collection(db, 'portalNotifications'));
    const list: PortalNotification[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as PortalNotification);
    });

    // Merge with local notifications
    try {
      const stored: PortalNotification[] = JSON.parse(localStorage.getItem('portal_notifications') || '[]');
      for (const item of stored) {
        if (!list.some(n => n.notificationId === item.notificationId)) {
          list.push(item);
        }
      }
    } catch (e) {
      // ignore
    }

    // Filter relevant notifications
    const filtered = list.filter(n => {
      if (n.cleared) return false;
      if (isAdmin) return true; // Admins can see all notifications
      if (n.recipientType === 'all') return true;
      if (uid && n.recipientUid === uid) return true;
      if (email && n.metadata?.attendeeEmail && n.metadata.attendeeEmail.toLowerCase() === email.toLowerCase()) return true;
      return false;
    });

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return filtered;
  } catch (error) {
    console.warn('Failed to load notifications from Firestore, using local cache:', error);
    try {
      const stored: PortalNotification[] = JSON.parse(localStorage.getItem('portal_notifications') || '[]');
      return stored.filter(n => !n.cleared);
    } catch (e) {
      return [];
    }
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const docRef = doc(db, 'portalNotifications', notificationId);
    await updateDoc(docRef, { read: true });
  } catch (e) {
    // ignore
  }

  try {
    const stored: PortalNotification[] = JSON.parse(localStorage.getItem('portal_notifications') || '[]');
    const updated = stored.map(n => n.notificationId === notificationId ? { ...n, read: true } : n);
    localStorage.setItem('portal_notifications', JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
}

export async function clearPortalNotification(notificationId: string): Promise<void> {
  try {
    const docRef = doc(db, 'portalNotifications', notificationId);
    await updateDoc(docRef, { cleared: true });
  } catch (e) {
    // ignore
  }

  try {
    const stored: PortalNotification[] = JSON.parse(localStorage.getItem('portal_notifications') || '[]');
    const updated = stored.map(n => n.notificationId === notificationId ? { ...n, cleared: true } : n);
    localStorage.setItem('portal_notifications', JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
}

export async function clearAllNotifications(isAdmin: boolean = false, uid?: string): Promise<void> {
  try {
    const notifications = await getNotificationsForUser(uid, undefined, isAdmin);
    const updatePromises = notifications.map(n => {
      const docRef = doc(db, 'portalNotifications', n.notificationId);
      return updateDoc(docRef, { cleared: true }).catch(() => {});
    });
    await Promise.allSettled(updatePromises);
  } catch (e) {
    // ignore
  }

  try {
    const stored: PortalNotification[] = JSON.parse(localStorage.getItem('portal_notifications') || '[]');
    const updated = stored.map(n => {
      if (isAdmin || n.recipientUid === uid || n.recipientType === 'all') {
        return { ...n, cleared: true };
      }
      return n;
    });
    localStorage.setItem('portal_notifications', JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
}

// Dispatches a simulated weekly reminder event, creating learner & admin notifications
export async function dispatchWeeklyReminder(weekLabel: string, topic: string, adminEmail: string = 'kapilnarula27july@gmail.com'): Promise<number> {
  const registrations = await getAllWebinarRegistrations();
  const now = new Date().toISOString();
  let count = 0;

  for (const reg of registrations) {
    count++;
    const notifId = `remind_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const learnerNotif: PortalNotification = {
      notificationId: notifId,
      recipientType: 'learner',
      recipientUid: reg.uid,
      title: `📅 ${weekLabel}: AI In Action Masterclass`,
      message: `Upcoming event reminder: ${topic}. Scheduled for Oct 15, 2026. Check your calendar!`,
      type: 'reminder',
      createdAt: now,
      read: false,
      cleared: false,
      metadata: {
        weekLabel,
        attendeeEmail: reg.email,
        webinarDate: reg.webinarDate
      }
    };
    await createPortalNotification(learnerNotif);
  }

  // Also create an admin notification recording the dispatch
  const adminNotifId = `admin_remind_${Date.now()}`;
  await createPortalNotification({
    notificationId: adminNotifId,
    recipientType: 'admin',
    title: `📢 Weekly Reminder Dispatched: ${weekLabel}`,
    message: `Weekly reminder "${topic}" was sent to ${registrations.length} registered attendee(s).`,
    type: 'reminder',
    createdAt: now,
    read: false,
    cleared: false,
    metadata: {
      recipientCount: registrations.length,
      dispatchedBy: adminEmail
    }
  });

  return registrations.length;
}

