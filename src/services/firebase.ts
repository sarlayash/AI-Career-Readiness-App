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
  PortalUser,
  UserAccount,
  WebinarConfig,
  WebinarRegistration,
  Level2Submission
} from '../types/assessment';
import { detectDeviceAndBrowser } from '../utils/deviceInfo';

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
export async function syncUserProfile(
  user: FirebaseUser | PortalUser | { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null; isDirect?: boolean }
): Promise<UserAccount> {
  const path = `users/${user.uid}`;
  const device = detectDeviceAndBrowser();
  const now = new Date().toISOString();
  const safeEmail = user.email ? user.email.trim() : `learner_${user.uid.slice(0, 8)}@portal.internal`;
  const isGoogleAdmin = safeEmail.toLowerCase() === 'kapilnarula27july@gmail.com';
  const role: 'participant' | 'admin' = isGoogleAdmin ? 'admin' : 'participant';
  const authProvider = (user as any).isDirect ? 'direct' : 'google';

  try {
    const userRef = doc(db, 'users', user.uid);
    const existing = await getDoc(userRef);

    let finalAccount: UserAccount;

    if (existing.exists()) {
      const data = existing.data() as UserAccount;
      const effectiveRole = data.role === 'admin' || isGoogleAdmin ? 'admin' : 'participant';

      finalAccount = {
        ...data,
        displayName: user.displayName || data.displayName || 'Learner',
        email: safeEmail,
        photoURL: user.photoURL || data.photoURL || null,
        lastLoginAt: now,
        role: effectiveRole,
        authProvider: authProvider,
        deviceType: device.deviceType,
        browserName: device.browserName,
        deviceDescription: device.fullDescription
      };

      await updateDoc(userRef, {
        displayName: finalAccount.displayName,
        email: finalAccount.email,
        photoURL: finalAccount.photoURL,
        lastLoginAt: now,
        authProvider: finalAccount.authProvider,
        deviceType: finalAccount.deviceType,
        browserName: finalAccount.browserName,
        deviceDescription: finalAccount.deviceDescription
      });
    } else {
      finalAccount = {
        uid: user.uid,
        displayName: user.displayName || 'Learner',
        email: safeEmail,
        photoURL: user.photoURL || null,
        role,
        createdAt: now,
        lastLoginAt: now,
        authProvider: authProvider,
        deviceType: device.deviceType,
        browserName: device.browserName,
        deviceDescription: device.fullDescription,
        assessmentStatus: 'not_started'
      };

      await setDoc(userRef, finalAccount);

      // Create admin notification about new learner login from device/browser
      if (!isGoogleAdmin) {
        createPortalNotification({
          notificationId: `user_joined_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          recipientType: 'admin',
          title: `👤 New Learner Joined: ${finalAccount.displayName}`,
          message: `${finalAccount.displayName} (${finalAccount.email}) joined via ${authProvider === 'google' ? 'Google' : 'Direct Email'} on ${device.fullDescription}.`,
          type: 'registration',
          createdAt: now,
          read: false,
          cleared: false,
          metadata: {
            uid: finalAccount.uid,
            email: finalAccount.email,
            device: device.fullDescription
          }
        }).catch(() => {});
      }
    }

    // Cache user to local storage
    try {
      localStorage.setItem('portal_current_user_profile', JSON.stringify(finalAccount));
    } catch (e) {
      // ignore
    }

    return finalAccount;
  } catch (error) {
    console.warn('Firestore user sync fallback to local cache:', error);
    const fallbackAccount: UserAccount = {
      uid: user.uid,
      displayName: user.displayName || 'Learner',
      email: safeEmail,
      photoURL: user.photoURL || null,
      role,
      createdAt: now,
      lastLoginAt: now,
      authProvider,
      deviceType: device.deviceType,
      browserName: device.browserName,
      deviceDescription: device.fullDescription,
      assessmentStatus: 'not_started'
    };
    try {
      localStorage.setItem('portal_current_user_profile', JSON.stringify(fallbackAccount));
    } catch (e) {
      // ignore
    }
    return fallbackAccount;
  }
}

// ==========================================
// Comprehensive Learner & User Directory (Admin)
// ==========================================
export async function getAllUsers(): Promise<UserAccount[]> {
  const learnersMap = new Map<string, UserAccount>();

  // 1. Fetch from Firestore users collection
  try {
    const snap = await getDocs(collection(db, 'users'));
    snap.forEach((docSnap) => {
      const u = docSnap.data() as UserAccount;
      if (u && u.uid) {
        learnersMap.set(u.uid, u);
      }
    });
  } catch (error) {
    console.warn('Direct users collection list fallback:', error);
  }

  // 2. Cross-reference with assessmentSubmissions to ensure ANY learner who submitted an assessment is included
  try {
    const submissionsSnap = await getDocs(collection(db, 'assessmentSubmissions'));
    submissionsSnap.forEach((docSnap) => {
      const sub = docSnap.data() as AssessmentSubmission;
      if (sub && sub.uid) {
        const existing = learnersMap.get(sub.uid);
        if (existing) {
          existing.assessmentStatus = 'completed';
          existing.latestScore = sub.overallScore;
          existing.latestBand = sub.readinessBand;
          if (sub.profile?.participantCategory && !existing.participantCategory) {
            existing.participantCategory = sub.profile.participantCategory;
          }
          if (sub.profile?.currentDomain && !existing.domain) {
            existing.domain = sub.profile.currentDomain;
          }
        } else {
          // Synthesize user entry
          learnersMap.set(sub.uid, {
            uid: sub.uid,
            displayName: sub.userName || sub.profile?.fullName || 'Learner',
            email: sub.userEmail || sub.profile?.email || '',
            photoURL: null,
            role: 'participant',
            createdAt: sub.submittedAt || new Date().toISOString(),
            lastLoginAt: sub.submittedAt || new Date().toISOString(),
            authProvider: 'google',
            deviceType: 'Desktop',
            browserName: 'Web Browser',
            deviceDescription: 'Web Browser',
            assessmentStatus: 'completed',
            latestScore: sub.overallScore,
            latestBand: sub.readinessBand,
            participantCategory: sub.profile?.participantCategory,
            domain: sub.profile?.currentDomain
          });
        }
      }
    });
  } catch (e) {
    // ignore
  }

  // 3. Cross-reference with level2Submissions
  try {
    const l2Snap = await getDocs(collection(db, 'level2Submissions'));
    l2Snap.forEach((docSnap) => {
      const l2 = docSnap.data() as Level2Submission;
      if (l2 && l2.uid) {
        const existing = learnersMap.get(l2.uid);
        if (existing) {
          existing.level2Status = 'completed';
          existing.level2Score = l2.overallScore;
          existing.level2Tier = l2.tierLabel;
          existing.level2SubmittedAt = l2.submittedAt;
        } else {
          learnersMap.set(l2.uid, {
            uid: l2.uid,
            displayName: l2.userName || 'Learner',
            email: l2.userEmail || '',
            photoURL: null,
            role: 'participant',
            createdAt: l2.submittedAt || new Date().toISOString(),
            lastLoginAt: l2.submittedAt || new Date().toISOString(),
            authProvider: 'google',
            deviceType: 'Desktop',
            browserName: 'Web Browser',
            deviceDescription: 'Web Browser',
            assessmentStatus: 'not_started',
            level2Status: 'completed',
            level2Score: l2.overallScore,
            level2Tier: l2.tierLabel,
            level2SubmittedAt: l2.submittedAt,
            domain: l2.domain
          });
        }
      }
    });
  } catch (e) {
    // ignore
  }

  // 4. Cross-reference with webinar registrations
  try {
    const regsSnap = await getDocs(collection(db, 'webinarRegistrations'));
    regsSnap.forEach((docSnap) => {
      const reg = docSnap.data() as WebinarRegistration;
      if (reg) {
        const key = reg.uid || reg.email;
        let matched = Array.from(learnersMap.values()).find(
          (u) => (reg.uid && u.uid === reg.uid) || (reg.email && u.email?.toLowerCase() === reg.email.toLowerCase())
        );

        if (matched) {
          matched.isMasterclassRegistered = true;
          if (reg.participantCategory && !matched.participantCategory) {
            matched.participantCategory = reg.participantCategory;
          }
        } else if (reg.email) {
          const synthUid = reg.uid || `reg_${reg.registrationId}`;
          learnersMap.set(synthUid, {
            uid: synthUid,
            displayName: reg.fullName || 'Webinar Attendee',
            email: reg.email,
            photoURL: null,
            role: 'participant',
            createdAt: reg.registeredAt || new Date().toISOString(),
            lastLoginAt: reg.registeredAt || new Date().toISOString(),
            authProvider: 'direct',
            deviceType: 'Desktop',
            browserName: 'Web Browser',
            deviceDescription: 'Web Browser',
            assessmentStatus: 'not_started',
            isMasterclassRegistered: true,
            participantCategory: reg.participantCategory,
            domain: reg.domain
          });
        }
      }
    });
  } catch (e) {
    // ignore
  }

  // 4. Merge cached users from localStorage (if any local accounts exist)
  try {
    const localUserJson = localStorage.getItem('portal_current_user_profile');
    if (localUserJson) {
      const localUser = JSON.parse(localUserJson) as UserAccount;
      if (localUser && localUser.uid && !learnersMap.has(localUser.uid)) {
        learnersMap.set(localUser.uid, localUser);
      }
    }
  } catch (e) {
    // ignore
  }

  const result = Array.from(learnersMap.values());
  // Sort by last active / created descending
  result.sort((a, b) => {
    const timeA = new Date(a.lastLoginAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.lastLoginAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  // Save cache
  try {
    localStorage.setItem('portal_all_learners_cache', JSON.stringify(result));
  } catch (e) {
    // ignore
  }

  return result;
}

// Export Learners Directory to CSV
export function exportLearnersCsv(users: UserAccount[]): void {
  const headers = [
    'User ID',
    'Full Name',
    'Email Address',
    'Role',
    'Auth Method',
    'Device Type',
    'Browser / OS',
    'Assessment Status',
    'Readiness Score',
    'Readiness Band',
    'Level 2 Status',
    'Level 2 Score',
    'Level 2 Tier',
    'Masterclass RSVP',
    'Category',
    'Domain',
    'Joined Date',
    'Last Active'
  ];

  const rows = users.map((u) => [
    `"${u.uid || ''}"`,
    `"${(u.displayName || 'Learner').replace(/"/g, '""')}"`,
    `"${(u.email || '').replace(/"/g, '""')}"`,
    `"${u.role || 'participant'}"`,
    `"${u.authProvider || 'google'}"`,
    `"${u.deviceType || 'Desktop'}"`,
    `"${(u.deviceDescription || u.browserName || '').replace(/"/g, '""')}"`,
    `"${u.assessmentStatus || 'not_started'}"`,
    `"${u.latestScore !== undefined ? u.latestScore : 'N/A'}"`,
    `"${u.latestBand || 'N/A'}"`,
    `"${u.level2Status || 'not_started'}"`,
    `"${u.level2Score !== undefined ? u.level2Score : 'N/A'}"`,
    `"${(u.level2Tier || 'N/A').replace(/"/g, '""')}"`,
    `"${u.isMasterclassRegistered ? 'Yes (Confirmed)' : 'No'}"`,
    `"${(u.participantCategory || '').replace(/"/g, '""')}"`,
    `"${(u.domain || '').replace(/"/g, '""')}"`,
    `"${u.createdAt ? new Date(u.createdAt).toLocaleString() : ''}"`,
    `"${u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Learners_Directory_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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

    // Synchronize to users/{uid}
    if (submission.uid) {
      try {
        const userRef = doc(db, 'users', submission.uid);
        await updateDoc(userRef, {
          assessmentStatus: 'completed',
          latestScore: submission.overallScore,
          latestBand: submission.readinessBand,
          participantCategory: submission.profile?.participantCategory || 'Working professional',
          domain: submission.profile?.currentDomain || 'General',
          lastLoginAt: submission.submittedAt
        }).catch(() => {});
      } catch (e) {
        // ignore
      }
    }

    // Trigger Admin Notification
    try {
      createPortalNotification({
        notificationId: `sub_done_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        recipientType: 'admin',
        title: `🎯 Assessment Completed: ${submission.userName || 'Learner'}`,
        message: `${submission.userName} (${submission.userEmail}) scored ${submission.overallScore}/100 (${submission.readinessBand}).`,
        type: 'assessment',
        createdAt: submission.submittedAt,
        read: false,
        cleared: false,
        metadata: {
          submissionId: submission.submissionId,
          score: submission.overallScore,
          band: submission.readinessBand,
          email: submission.userEmail
        }
      }).catch(() => {});
    } catch (e) {
      // ignore
    }

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

// ==========================================
// Level 2 Applied AI Submissions Service
// ==========================================
export async function saveLevel2Submission(
  submission: Level2Submission
): Promise<string> {
  const path = `level2Submissions/${submission.submissionId}`;
  try {
    const docRef = doc(db, 'level2Submissions', submission.submissionId);
    await setDoc(docRef, submission);

    // Synchronize to users/{uid}
    if (submission.uid) {
      try {
        const userRef = doc(db, 'users', submission.uid);
        await updateDoc(userRef, {
          level2Status: 'completed',
          level2Score: submission.overallScore,
          level2Tier: submission.tierLabel,
          level2SubmittedAt: submission.submittedAt,
          domain: submission.domain,
          lastLoginAt: submission.submittedAt
        }).catch(() => {});
      } catch (e) {
        // ignore
      }
    }

    // Cache latest submission locally
    try {
      localStorage.setItem('portal_latest_level2_submission', JSON.stringify(submission));
      localStorage.setItem(`portal_l2_${submission.uid}`, JSON.stringify(submission));
    } catch (e) {
      // ignore
    }

    // Trigger Admin Notification
    try {
      createPortalNotification({
        notificationId: `l2_done_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        recipientType: 'admin',
        title: `🚀 Level 2 Applied AI Completed: ${submission.userName || 'Learner'}`,
        message: `${submission.userName} (${submission.userEmail}) scored ${submission.overallScore}/100 (${submission.tierLabel}) in ${submission.domain}.`,
        type: 'assessment',
        createdAt: submission.submittedAt,
        read: false,
        cleared: false,
        metadata: {
          submissionId: submission.submissionId,
          score: submission.overallScore,
          tier: submission.tierLabel,
          email: submission.userEmail,
          domain: submission.domain
        }
      }).catch(() => {});
    } catch (e) {
      // ignore
    }

    return submission.submissionId;
  } catch (error) {
    console.warn('Level 2 submission write fallback:', error);
    try {
      localStorage.setItem('portal_latest_level2_submission', JSON.stringify(submission));
      localStorage.setItem(`portal_l2_${submission.uid}`, JSON.stringify(submission));
    } catch (e) {}
    return submission.submissionId;
  }
}

export async function getUserLevel2Submissions(uid: string): Promise<Level2Submission[]> {
  const path = 'level2Submissions';
  try {
    const q = query(
      collection(db, 'level2Submissions'),
      where('uid', '==', uid)
    );
    const snap = await getDocs(q);
    const submissions: Level2Submission[] = [];
    snap.forEach((docSnap) => {
      submissions.push(docSnap.data() as Level2Submission);
    });
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return submissions;
  } catch (error) {
    console.warn('Level 2 user submissions query fallback to local cache:', error);
    try {
      const local = localStorage.getItem(`portal_l2_${uid}`) || localStorage.getItem('portal_latest_level2_submission');
      if (local) return [JSON.parse(local)];
    } catch (e) {}
    return [];
  }
}

export async function getUserLatestLevel2Submission(uidOrEmail: string): Promise<Level2Submission | null> {
  try {
    const list = await getUserLevel2Submissions(uidOrEmail);
    if (list && list.length > 0) return list[0];
    
    // Check by email if uid query returned nothing
    if (uidOrEmail.includes('@')) {
      const qEmail = query(
        collection(db, 'level2Submissions'),
        where('userEmail', '==', uidOrEmail)
      );
      const snap = await getDocs(qEmail);
      const subs: Level2Submission[] = [];
      snap.forEach((d) => subs.push(d.data() as Level2Submission));
      if (subs.length > 0) {
        subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        return subs[0];
      }
    }
  } catch (e) {
    console.warn('getUserLatestLevel2Submission fallback:', e);
  }

  // Fallback to local cache
  try {
    const cached = localStorage.getItem('portal_latest_level2_submission');
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  return null;
}

export async function getAllLevel2Submissions(): Promise<Level2Submission[]> {
  const path = 'level2Submissions';
  try {
    const snap = await getDocs(collection(db, 'level2Submissions'));
    const submissions: Level2Submission[] = [];
    snap.forEach((docSnap) => {
      submissions.push(docSnap.data() as Level2Submission);
    });
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return submissions;
  } catch (error) {
    console.warn('All Level 2 submissions fetch fallback:', error);
    return [];
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

    // Update user record with masterclass registration status
    if (registration.uid) {
      try {
        const userRef = doc(db, 'users', registration.uid);
        await updateDoc(userRef, {
          isMasterclassRegistered: true,
          participantCategory: registration.participantCategory || 'Working professional',
          domain: registration.domain || 'General',
          lastLoginAt: registration.registeredAt
        }).catch(() => {});
      } catch (e) {
        // ignore
      }
    }

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

