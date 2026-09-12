/**
 * AI Career Readiness Self-Assessment Types
 */

export type DimensionId = 
  | 'ai_literacy'
  | 'tool_fluency'
  | 'domain_application'
  | 'career_adaptability'
  | 'evidence_of_work';

export interface DimensionMeta {
  id: DimensionId;
  name: string;
  shortName: string;
  description: string;
  focusAreas: string[];
}

export type QuestionType = 'single_choice' | 'scale' | 'scenario' | 'multi_select';

export interface QuestionOption {
  id: string;
  text: string;
  score: number; // 0 to 100 or weighted score
  tag?: string;
}

export interface AssessmentQuestion {
  id: string;
  assessmentVersion: string;
  dimension: DimensionId;
  questionText: string;
  questionType: QuestionType;
  options: QuestionOption[];
  scoringMap?: Record<string, number>;
  explanation?: string;
  weight: number;
  required: boolean;
  active: boolean;
}

export interface UserProfile {
  fullName: string;
  email: string;
  participantCategory: string;
  educationLevel: string;
  experienceLevel: string;
  currentDomain: string;
  primaryCareerGoal: string;
}

export interface DimensionScore {
  dimensionId: DimensionId;
  dimensionName: string;
  score: number; // 0 - 100
  rawScore: number;
  maxScore: number;
  band: string;
}

export interface ScoreBand {
  min: number;
  max: number;
  label: string;
  summary: string;
  badgeColor: string;
}

export interface ActionPlanWeek {
  weekNumber: number;
  theme: string;
  objective: string;
  tasks: string[];
  suggestedArtifact: string;
}

export interface PersonalizedActionPlan {
  primaryFocusDimension: DimensionId;
  dimensionName: string;
  guidanceText: string;
  strengths: string[];
  developmentGaps: string[];
  recommendedNextStep: string;
  weeklyPlan: ActionPlanWeek[];
  narrativeSummary?: string;
}

export interface AssessmentSubmission {
  submissionId: string;
  uid: string;
  userEmail: string;
  userName: string;
  assessmentVersion: string;
  scoringVersion: string;
  submittedAt: string;
  profile: UserProfile;
  responses: Record<string, any>; // questionId -> optionId or value
  dimensionScores: Record<DimensionId, DimensionScore>;
  overallScore: number; // 0 - 100
  readinessBand: string;
  generatedInsights: PersonalizedActionPlan;
  consent: boolean;
  source: string;
  status: 'completed' | 'in_progress';
  isSampleData?: boolean;
}

export interface AssessmentConfig {
  assessmentVersion: string;
  scoringVersion: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  dimensionWeights: Record<DimensionId, number>;
  scoreBands: ScoreBand[];
  retakesEnabled: boolean;
  active: boolean;
  createdAt: string;
}

export interface WebinarConfig {
  title: string;
  date: string;
  time: string;
  description: string;
  registrationUrl: string;
  speaker: string;
  partner: string;
  ctaEnabled: boolean;
}

export interface LearningConfig {
  title: string;
  description: string;
  learningUrl: string;
  ctaLabel: string;
  ctaEnabled: boolean;
}

export interface AdminAuditLog {
  id?: string;
  adminUid: string;
  adminEmail: string;
  action: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PortalUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isDirect?: boolean;
}

export interface UserAccount {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: 'participant' | 'admin';
  createdAt: string;
  lastLoginAt: string;
  authProvider?: 'google' | 'direct' | 'guest';
  deviceType?: 'Mobile' | 'Tablet' | 'Desktop';
  browserName?: string;
  deviceDescription?: string;
  assessmentStatus?: 'completed' | 'in_progress' | 'not_started';
  latestScore?: number;
  latestBand?: string;
  participantCategory?: string;
  domain?: string;
  isMasterclassRegistered?: boolean;
  level2Status?: 'completed' | 'in_progress' | 'not_started';
  level2Score?: number;
  level2Tier?: string;
  level2SubmittedAt?: string;
}

export * from './level2';

export interface WebinarRegistration {
  registrationId: string;
  uid?: string;
  fullName: string;
  email: string;
  participantCategory?: string;
  domain?: string;
  webinarTitle: string;
  webinarDate: string;
  registeredAt: string;
  calendarAdded?: boolean;
  remindersEnabled?: boolean;
  remindersSent?: number;
  status: 'confirmed' | 'cancelled';
}

export interface PortalNotification {
  notificationId: string;
  recipientType: 'admin' | 'learner' | 'all';
  recipientUid?: string;
  title: string;
  message: string;
  type: 'registration' | 'reminder' | 'assessment' | 'system';
  createdAt: string;
  read: boolean;
  cleared?: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

