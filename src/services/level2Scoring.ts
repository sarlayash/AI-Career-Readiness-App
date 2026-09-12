import { LEVEL2_QUESTIONS, LEVEL2_SCORE_TIERS } from '../data/level2Questions';
import { MARKET_TOOLS } from '../data/marketToolsData';
import { AssessmentSubmission, DimensionId } from '../types/assessment';
import { 
  Level2CustomizedJourney, 
  Level2JourneyPhase, 
  Level2Submission, 
  Level2ToolCategory, 
  Level2UseCaseDomain 
} from '../types/level2';

export interface Level2ScoringInput {
  responses: Record<string, string>;
  userUid: string;
  userName: string;
  userEmail: string;
  domain: string;
  experienceLevel: string;
  primaryCareerGoal: string;
  level1Submission?: AssessmentSubmission | null;
}

export function calculateLevel2ScoreAndJourney(input: Level2ScoringInput): Level2Submission {
  const {
    responses,
    userUid,
    userName,
    userEmail,
    domain,
    experienceLevel,
    primaryCareerGoal,
    level1Submission
  } = input;

  // Initialize category trackers
  const categoryPoints: Record<Level2ToolCategory, { earned: number; total: number }> = {
    frontier_llms: { earned: 0, total: 0 },
    coding_agents: { earned: 0, total: 0 },
    workflow_automation: { earned: 0, total: 0 },
    enterprise_productivity: { earned: 0, total: 0 },
    multimodal_creative: { earned: 0, total: 0 },
    governance_rag: { earned: 0, total: 0 }
  };

  const useCasePoints: Record<Level2UseCaseDomain, { earned: number; total: number }> = {
    enterprise_rag: { earned: 0, total: 0 },
    agent_orchestration: { earned: 0, total: 0 },
    solution_delivery: { earned: 0, total: 0 },
    executive_synthesis: { earned: 0, total: 0 },
    multimodal_pipeline: { earned: 0, total: 0 },
    governance_compliance: { earned: 0, total: 0 },
    domain_automation: { earned: 0, total: 0 }
  };

  let totalScoreSum = 0;
  let totalQuestionsCount = 0;

  LEVEL2_QUESTIONS.forEach((q) => {
    const selectedOptionId = responses[q.id];
    let optionScore = 0;
    if (selectedOptionId) {
      const opt = q.options.find((o) => o.id === selectedOptionId);
      if (opt) {
        optionScore = opt.score;
      }
    }

    categoryPoints[q.category].earned += optionScore;
    categoryPoints[q.category].total += 100;

    useCasePoints[q.useCase].earned += optionScore;
    useCasePoints[q.useCase].total += 100;

    totalScoreSum += optionScore;
    totalQuestionsCount += 1;
  });

  const overallScore = totalQuestionsCount > 0 
    ? Math.round(totalScoreSum / totalQuestionsCount) 
    : 0;

  // Compute percentage scores for categories
  const categoryScores = {} as Record<Level2ToolCategory, number>;
  (Object.keys(categoryPoints) as Level2ToolCategory[]).forEach((cat) => {
    const p = categoryPoints[cat];
    categoryScores[cat] = p.total > 0 ? Math.round((p.earned / p.total) * 100) : 0;
  });

  // Compute percentage scores for use cases
  const useCaseScores = {} as Record<Level2UseCaseDomain, number>;
  (Object.keys(useCasePoints) as Level2UseCaseDomain[]).forEach((uc) => {
    const p = useCasePoints[uc];
    useCaseScores[uc] = p.total > 0 ? Math.round((p.earned / p.total) * 100) : 0;
  });

  // Determine Tier
  const tier = LEVEL2_SCORE_TIERS.find((t) => overallScore >= t.min && overallScore <= t.max) || LEVEL2_SCORE_TIERS[LEVEL2_SCORE_TIERS.length - 1];

  // Level 1 Ingestion Data
  const l1Score = level1Submission?.overallScore;
  const l1Band = level1Submission?.readinessBand;
  const l1LowestDim = level1Submission?.generatedInsights?.primaryFocusDimension;

  // Domain Filtered Tools
  const domainTools = MARKET_TOOLS.filter((t) => 
    t.bestForDomains.includes(domain) || t.bestForDomains.includes('IT / Software')
  ).slice(0, 8);

  // Generate 90-Day Customized Journey
  const customizedJourney: Level2CustomizedJourney = generateCustomizedJourney({
    overallScore,
    tierLabel: tier.label,
    tierBadgeColor: tier.badgeColor,
    domain,
    experienceLevel,
    primaryCareerGoal,
    l1Score,
    l1Band,
    l1LowestDim,
    categoryScores,
    useCaseScores,
    domainTools
  });

  const submissionId = `L2-SUB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    submissionId,
    uid: userUid,
    userName,
    userEmail,
    submittedAt: new Date().toISOString(),
    domain,
    experienceLevel,
    primaryCareerGoal,
    level1SubmissionId: level1Submission?.submissionId,
    level1OverallScore: l1Score,
    level1ReadinessBand: l1Band,
    level1FocusDimension: l1LowestDim,
    responses,
    categoryScores,
    useCaseScores,
    overallScore,
    tierLabel: tier.label,
    customizedJourney,
    status: 'completed'
  };
}

interface JourneyGenParams {
  overallScore: number;
  tierLabel: string;
  tierBadgeColor: string;
  domain: string;
  experienceLevel: string;
  primaryCareerGoal: string;
  l1Score?: number;
  l1Band?: string;
  l1LowestDim?: DimensionId | string;
  categoryScores: Record<Level2ToolCategory, number>;
  useCaseScores: Record<Level2UseCaseDomain, number>;
  domainTools: any[];
}

function generateCustomizedJourney(params: JourneyGenParams): Level2CustomizedJourney {
  const {
    overallScore,
    tierLabel,
    tierBadgeColor,
    domain,
    experienceLevel,
    primaryCareerGoal,
    l1Score,
    l1Band,
    l1LowestDim,
    categoryScores,
    domainTools
  } = params;

  // Determine critical tool gaps (lowest categories)
  const sortedCategories = (Object.keys(categoryScores) as Level2ToolCategory[])
    .sort((a, b) => categoryScores[a] - categoryScores[b]);
  
  const lowestCat = sortedCategories[0];
  const secondLowestCat = sortedCategories[1];
  const topCat = sortedCategories[sortedCategories.length - 1];

  // Core Strengths
  const coreStrengths: string[] = [
    `Strong technical acumen in ${formatCategoryName(topCat)} (${categoryScores[topCat]}%), reflecting readiness for enterprise deployment.`,
    `High awareness of modern workflow optimization and applied AI capabilities within ${domain}.`,
    `Strategic alignment with your objective to ${primaryCareerGoal.toLowerCase()}.`
  ];

  // Critical Tool Gaps
  const criticalToolGaps: string[] = [
    `Development needed in ${formatCategoryName(lowestCat)} (${categoryScores[lowestCat]}%): establish structured tool-chain routines rather than ad-hoc prompting.`,
    `Operational scaling in ${formatCategoryName(secondLowestCat)} (${categoryScores[secondLowestCat]}%): formalize automated verification and schema guardrails.`
  ];

  if (l1LowestDim) {
    criticalToolGaps.push(
      `Bridging Level 1 Diagnostic: Your foundational gap in "${formatDimensionName(l1LowestDim)}" should be targeted through tangible production projects in Month 2.`
    );
  }

  // Executive Summary Narrative
  let executiveSummary = `As a ${experienceLevel} professional in ${domain}, your Level 2 Applied AI Index of ${overallScore}/100 establishes you in the "${tierLabel}" tier. `;
  if (l1Score) {
    executiveSummary += `Building on your Level 1 baseline (${l1Score}/100 • ${l1Band}), this Level 2 assessment proves your tactical capability to deploy market-leading frontier models, coding copilots, and multi-agent systems into production workflows.`;
  } else {
    executiveSummary += `This assessment benchmarks your hands-on ability to orchestrate leading market tools (Claude 3.5, Cursor, CrewAI, NotebookLM) to execute complex enterprise use cases with high accuracy and data security.`;
  }

  // 90-Day Roadmap (Phase 1, 2, 3)
  const ninetyDayRoadmap: Level2JourneyPhase[] = [
    {
      phaseNumber: 1,
      title: 'Foundation & High-Leverage Tool Adoption',
      duration: 'Days 1–30',
      objective: `Master the top 3 AI tools standard in ${domain} and eliminate 5+ hours of repetitive manual toil weekly.`,
      focusTools: ['Claude 3.5 Sonnet', 'NotebookLM', 'Cursor AI or Workplace Copilot'],
      weeklyDeliverables: [
        {
          week: 1,
          title: 'Daily AI Copilot Stacking & Setup',
          tasks: [
            'Configure enterprise-tier or zero-data retention accounts on Claude and NotebookLM',
            'Set up personal prompt library with structured role context and few-shot examples',
            'Conduct audit of weekly tasks to identify top 3 administrative friction points'
          ],
          toolApplied: 'Claude 3.5 + NotebookLM',
          expectedArtifact: 'Personalized Prompt & Task Automation Index'
        },
        {
          week: 2,
          title: 'Document & Knowledge Grounding Pipeline',
          tasks: [
            `Ingest team manuals and industry guidelines into NotebookLM for grounded query synthesis`,
            'Compare responses across 5 complex internal questions to verify zero hallucination',
            'Share synthesized executive brief with a senior colleague for feedback'
          ],
          toolApplied: 'Google NotebookLM',
          expectedArtifact: 'Grounded Team Knowledge Synthesis Brief'
        },
        {
          week: 3,
          title: 'IDE or Workflow Automation Integration',
          tasks: [
            'Set up Cursor AI with codebase semantic indexing or n8n AI webhook automation',
            'Draft technical specification and unit tests before executing multi-file edits',
            'Verify code or workflow outputs through deterministic test suite'
          ],
          toolApplied: 'Cursor AI / Composer / n8n',
          expectedArtifact: 'Spec-Driven Automation Script with Tests'
        },
        {
          week: 4,
          title: 'Month 1 Milestone & Security Audit',
          tasks: [
            'Review prompt history to verify zero proprietary PII or credentials were leaked',
            'Calculate hours saved across the month (target: minimum 15 hours)',
            'Refine workflow templates for Phase 2 production project'
          ],
          toolApplied: 'Enterprise Guardrails Checklist',
          expectedArtifact: 'Month 1 Productivity ROI & Security Audit'
        }
      ]
    },
    {
      phaseNumber: 2,
      title: 'Applied Real-World Production Projects',
      duration: 'Days 31–60',
      objective: `Build a tangible, demonstrable AI-augmented production artifact solving a genuine bottleneck in ${domain}. Directly overcomes Level 1 "${l1LowestDim ? formatDimensionName(l1LowestDim) : 'Evidence of Work'}" gap.`,
      focusTools: ['LangGraph / CrewAI', 'v0.dev', 'Pinecone / Vector DBs', 'ElevenLabs'],
      weeklyDeliverables: [
        {
          week: 5,
          title: 'Problem Framing & Architecture Design',
          tasks: [
            `Identify a recurring multi-step operational or client challenge in ${domain}`,
            'Map the data flow: inputs, retrieval triggers, agent reasoning, and output destinations',
            'Select the optimal tool combination (e.g. RAG retrieval + agent action)'
          ],
          toolApplied: 'System Architecture Diagramming',
          expectedArtifact: 'End-to-End AI Solution Design Spec'
        },
        {
          week: 6,
          title: 'Prototype & UI/API Assembly',
          tasks: [
            'Use v0.dev or Bolt.new to rapidly construct the user interface or API schema',
            'Wire structured outputs with strict JSON validation and error fallback branches',
            'Test with sample edge cases and adversarial inputs'
          ],
          toolApplied: 'v0.dev + Structured Outputs',
          expectedArtifact: 'Working Interactive Prototype'
        },
        {
          week: 7,
          title: 'Multi-Agent or RAG Pipeline Connection',
          tasks: [
            'Integrate vector embeddings (Pinecone/Weaviate) or multi-agent delegation (CrewAI)',
            'Add human-in-the-loop approval gates for destructive or high-value decisions',
            'Benchmark latency and token inference costs'
          ],
          toolApplied: 'CrewAI / LangGraph / Pinecone',
          expectedArtifact: 'Production-Grade Automated Pipeline'
        },
        {
          week: 8,
          title: 'Documentation & Public Portfolio Artifact',
          tasks: [
            'Record a 3-minute video walkthrough demonstrating problem, AI architecture, and ROI',
            'Publish public GitHub repository or executive case study PDF with measurable outcomes',
            'Present results to departmental peers or leadership'
          ],
          toolApplied: 'Loom / GitHub / Markdown',
          expectedArtifact: 'Verifiable Applied AI Portfolio Case Study'
        }
      ]
    },
    {
      phaseNumber: 3,
      title: 'Enterprise Scaling & AI Leadership',
      duration: 'Days 61–90',
      objective: `Scale AI best practices across your organization, establish governance guardrails, and lead strategic AI adoption to accelerate career advancement.`,
      focusTools: ['Enterprise Model Routing', 'Guardrails AI', 'TruLens', 'Microsoft 365 / Gemini'],
      weeklyDeliverables: [
        {
          week: 9,
          title: 'Team Workshop & Knowledge Transfer',
          tasks: [
            `Host a 45-minute lunch-and-learn for colleagues in ${domain} demonstrating high-ROI tools`,
            'Distribute curated prompt templates and NotebookLM research notebooks',
            'Collect team feedback on high-friction collaborative workflows'
          ],
          toolApplied: 'Team Demonstration Session',
          expectedArtifact: 'Departmental AI Playbook & Template Pack'
        },
        {
          week: 10,
          title: 'Model Routing & Cost Optimization',
          tasks: [
            'Implement multi-model routing (Claude for logic, Gemini Flash for classification)',
            'Adopt context caching for repetitive long-context enterprise prompts to cut costs 80%',
            'Measure latency reduction and accuracy parity'
          ],
          toolApplied: 'Context Caching & Model Routers',
          expectedArtifact: 'Enterprise Inference Cost Reduction Report'
        },
        {
          week: 11,
          title: 'Governance & Hallucination Guardrails',
          tasks: [
            'Establish automated output evaluation using TruLens or Guardrails AI rules',
            'Draft company policy on confidential IP handling and allowed AI tool tiers',
            'Setup automated monitoring for model hallucination drift'
          ],
          toolApplied: 'Guardrails AI & TruLens',
          expectedArtifact: 'Enterprise AI Safety & Compliance Framework'
        },
        {
          week: 12,
          title: 'Executive Career Presentation & Next Tier',
          tasks: [
            'Synthesize 90-day outcomes: hours saved, projects delivered, team adoption rate',
            'Schedule performance review or career advancement discussion showcasing your Applied AI leadership',
            'Plan next quarter advanced specialization (fine-tuning, autonomous agents, or AI PM)'
          ],
          toolApplied: 'Executive ROI Deck',
          expectedArtifact: 'Strategic AI Leadership Career Portfolio'
        }
      ]
    }
  ];

  // Quick Wins (Immediate 7-Day Actions)
  const quickWinsImmediateAction = [
    `Set up Google NotebookLM with 3-5 of your most dense reference PDFs in ${domain} for instantaneous grounded research.`,
    `Replace copy-paste coding with Cursor AI or GitHub Copilot in your next technical task to experience Composer multi-file editing.`,
    `Experiment with Perplexity Pro for competitor and market research to get verified inline source citations instead of unchecked chats.`,
    `Enforce the "Spec-First" rule: always write 5 bullets of requirements and constraints before asking an AI model to generate a complex deliverable.`
  ];

  // Governance Checklist
  const governanceChecklist = [
    'Always verify whether the AI tool vendor has Zero Data Retention (ZDR) or trains on your prompt data.',
    'Never input unencrypted customer PII, corporate passwords, or proprietary API keys into public web chats.',
    'Implement human-in-the-loop checkpoints for all legal, financial, and external customer-facing outputs.',
    'Audit model outputs for hallucinated citations, broken URLs, and incorrect mathematical totals.'
  ];

  return {
    baselineLevel1Score: l1Score,
    baselineLevel1Band: l1Band,
    identifiedGrowthDimension: l1LowestDim,
    targetDomain: domain,
    experienceTier: experienceLevel,
    level2Score: overallScore,
    level2Tier: tierLabel,
    tierBadgeColor,
    executiveSummary,
    coreStrengths,
    criticalToolGaps,
    domainToolStack: domainTools,
    ninetyDayRoadmap,
    quickWinsImmediateAction,
    governanceChecklist
  };
}

function formatCategoryName(cat: Level2ToolCategory): string {
  const map: Record<Level2ToolCategory, string> = {
    frontier_llms: 'Frontier Models & Deep Reasoning',
    coding_agents: 'AI Coding & Development Agents',
    workflow_automation: 'Autonomous Workflows & Multi-Agent Systems',
    enterprise_productivity: 'Enterprise Copilots & Knowledge Ingestion',
    multimodal_creative: 'Cross-Modal Media Production',
    governance_rag: 'Enterprise RAG & Security Governance'
  };
  return map[cat] || cat;
}

function formatDimensionName(dim: string): string {
  const map: Record<string, string> = {
    ai_literacy: 'AI Awareness & Literacy',
    tool_fluency: 'AI Tool Fluency',
    domain_application: 'Domain Application',
    career_adaptability: 'Career Adaptability',
    evidence_of_work: 'Evidence of Work & Portfolio'
  };
  return map[dim] || dim;
}
