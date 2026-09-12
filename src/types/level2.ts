import { DimensionId } from './assessment';

export type Level2ToolCategory = 
  | 'frontier_llms'
  | 'coding_agents'
  | 'workflow_automation'
  | 'enterprise_productivity'
  | 'multimodal_creative'
  | 'governance_rag';

export type Level2UseCaseDomain = 
  | 'enterprise_rag'
  | 'agent_orchestration'
  | 'solution_delivery'
  | 'executive_synthesis'
  | 'multimodal_pipeline'
  | 'governance_compliance'
  | 'domain_automation';

export interface MarketTool {
  id: string;
  name: string;
  category: Level2ToolCategory;
  vendor: string;
  description: string;
  keyStrengths: string[];
  bestForDomains: string[];
  enterpriseReadiness: 'Production Standard' | 'High Growth' | 'Enterprise Leader';
  accessUrl: string;
  freeTierOrTrial: boolean;
}

export interface Level2QuestionOption {
  id: string;
  text: string;
  score: number; // 0 to 100
  explanation: string;
  toolInsight?: string;
}

export interface Level2Question {
  id: string;
  category: Level2ToolCategory;
  useCase: Level2UseCaseDomain;
  title: string;
  scenario: string;
  difficulty: 'Practitioner' | 'Specialist' | 'Enterprise Architect';
  toolFocus: string[];
  options: Level2QuestionOption[];
}

export interface Level2WeeklyDeliverable {
  week: number;
  title: string;
  tasks: string[];
  toolApplied: string;
  expectedArtifact: string;
}

export interface Level2JourneyPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  objective: string;
  focusTools: string[];
  weeklyDeliverables: Level2WeeklyDeliverable[];
}

export interface Level2CustomizedJourney {
  baselineLevel1Score?: number;
  baselineLevel1Band?: string;
  identifiedGrowthDimension?: DimensionId | string;
  targetDomain: string;
  experienceTier: string;
  level2Score: number;
  level2Tier: string;
  tierBadgeColor: string;
  executiveSummary: string;
  coreStrengths: string[];
  criticalToolGaps: string[];
  domainToolStack: MarketTool[];
  ninetyDayRoadmap: Level2JourneyPhase[];
  quickWinsImmediateAction: string[];
  governanceChecklist: string[];
}

export interface Level2Submission {
  submissionId: string;
  uid: string;
  userName: string;
  userEmail: string;
  submittedAt: string;
  domain: string;
  experienceLevel: string;
  primaryCareerGoal: string;
  level1SubmissionId?: string;
  level1OverallScore?: number;
  level1ReadinessBand?: string;
  level1FocusDimension?: string;
  responses: Record<string, string>;
  categoryScores: Record<Level2ToolCategory, number>;
  useCaseScores: Record<Level2UseCaseDomain, number>;
  overallScore: number;
  tierLabel: string;
  customizedJourney: Level2CustomizedJourney;
  status: 'completed' | 'in_progress';
}
