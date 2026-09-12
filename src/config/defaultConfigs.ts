import { AssessmentConfig, DimensionId, DimensionMeta, LearningConfig, ScoreBand, WebinarConfig } from '../types/assessment';

export const DIMENSIONS: DimensionMeta[] = [
  {
    id: 'ai_literacy',
    name: 'AI Awareness & Literacy',
    shortName: 'AI Literacy',
    description: 'Understanding GenAI mechanisms, capabilities, limitations, hallucinations, data privacy, and ethical judgment.',
    focusAreas: ['Core Concepts', 'Hallucinations & Fact-Checking', 'Privacy & Data Security', 'Responsible AI Practices']
  },
  {
    id: 'tool_fluency',
    name: 'AI Tool Fluency',
    shortName: 'Tool Fluency',
    description: 'Practical prompt engineering, context injection, negative constraints, iterative refinement, and evaluating outputs.',
    focusAreas: ['Prompt Framing', 'Iterative Prompting', 'Setting Constraints', 'Output Verification']
  },
  {
    id: 'domain_application',
    name: 'Domain Application',
    shortName: 'Domain Application',
    description: 'Identifying high-leverage AI use cases in your domain, mapping tasks, and establishing human-in-the-loop workflows.',
    focusAreas: ['Workflow Integration', 'Domain Task Mapping', 'Human Oversight', 'Efficiency Bottlenecks']
  },
  {
    id: 'career_adaptability',
    name: 'Career Adaptability',
    shortName: 'Adaptability',
    description: 'Willingness to learn, agility in shifting workflows, tracking technology shifts, and continuous habit formation.',
    focusAreas: ['Growth Mindset', 'Habitual Upskilling', 'Navigating Disruption', 'Curiosity & Experimentation']
  },
  {
    id: 'evidence_of_work',
    name: 'Evidence of Work & Professional Readiness',
    shortName: 'Evidence of Work',
    description: 'Building demonstrable projects, documenting AI-augmented workflows, ownership, and communicating professional outcomes.',
    focusAreas: ['Tangible Artifacts', 'Workflow Documentation', 'Communicating AI Impact', 'Professional Responsibility']
  }
];

export const DEFAULT_SCORE_BANDS: ScoreBand[] = [
  {
    min: 0,
    max: 29,
    label: 'Early Explorer',
    summary: 'You are at the starting gates of your AI journey. You recognize the presence of AI tools, and your highest priority is demystifying fundamentals and safe exploration.',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  },
  {
    min: 30,
    max: 49,
    label: 'Curious Beginner',
    summary: 'You have experimented with AI tools casually. Moving beyond general chat toward structured prompts and verification habits will unlock substantial value.',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  {
    min: 50,
    max: 69,
    label: 'Developing Practitioner',
    summary: 'You regularly employ AI for common tasks and understand standard constraints. You are ready to design repeatable domain workflows and build tangible artifacts.',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
  },
  {
    min: 70,
    max: 84,
    label: 'Applied AI Learner',
    summary: 'You demonstrate strong prompt proficiency, critical evaluation, and domain application. Your next edge is portfolio evidence and leadership in workflow automation.',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    min: 85,
    max: 100,
    label: 'AI-Ready Growth Mindset',
    summary: 'You exhibit outstanding technical discernment, rigorous oversight, deep domain mapping, and demonstrable work artifacts with continuous adaptability.',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  }
];

export const DEFAULT_ASSESSMENT_CONFIG: AssessmentConfig = {
  assessmentVersion: 'v1.0.0',
  scoringVersion: 'score-v1.0',
  title: 'AI Career Readiness Self-Assessment',
  description: 'A structured evaluation measuring your practical readiness across five core pillars required for the intelligent workplace.',
  estimatedMinutes: 6,
  dimensionWeights: {
    ai_literacy: 0.20,
    tool_fluency: 0.20,
    domain_application: 0.20,
    career_adaptability: 0.20,
    evidence_of_work: 0.20
  },
  scoreBands: DEFAULT_SCORE_BANDS,
  retakesEnabled: true,
  active: true,
  createdAt: '2026-01-15T00:00:00.000Z'
};

export const DEFAULT_WEBINAR_CONFIG: WebinarConfig = {
  title: 'AI In Action: From Casual Prompting to Career Advancement',
  date: 'October 15, 2026',
  time: '6:00 PM - 7:30 PM IST / 8:30 AM EST',
  description: 'Join industry mentors and AI practitioners to unpack hands-on frameworks for integrating generative tools safely into real workflows.',
  registrationUrl: 'https://workshops.example.com/ai-career-readiness-masterclass',
  speaker: 'Dr. Evelyn Carter & Kapil Narula',
  partner: 'AI Career Innovation Council',
  ctaEnabled: true
};

export const DEFAULT_LEARNING_CONFIG: LearningConfig = {
  title: 'Recommended Free Learning Pathways',
  description: 'Curated self-paced modules to systematically address your lowest scoring dimensions.',
  learningUrl: 'https://learn.example.com/paths/ai-professional-pathways',
  ctaLabel: 'Explore Guided Curriculum',
  ctaEnabled: true
};

export const PARTICIPANT_CATEGORIES = [
  'School student',
  'College student',
  'Recent graduate',
  'Job seeker',
  'Working professional',
  'Educator / Faculty',
  'Entrepreneur / Business owner',
  'Career switcher',
  'Other'
];

export const EDUCATION_LEVELS = [
  'School',
  'Diploma',
  'Undergraduate',
  'Postgraduate',
  'Doctoral',
  'Working professional / not currently studying',
  'Other'
];

export const EXPERIENCE_LEVELS = [
  'No experience',
  '0–1 years',
  '1–3 years',
  '3–5 years',
  '5–10 years',
  '10+ years'
];

export const DOMAINS = [
  'IT / Software',
  'Data / Analytics',
  'HR / Recruitment',
  'Sales / Marketing',
  'Finance / Accounting',
  'Operations / Administration',
  'Education / Training',
  'Healthcare',
  'Manufacturing',
  'Entrepreneurship',
  'Student / Exploring',
  'Other'
];

export const CAREER_GOALS = [
  'Get my first job',
  'Improve employability',
  'Become more productive at work',
  'Switch careers',
  'Build a business',
  'Improve teaching / learning',
  'Start using AI confidently',
  'Explore future opportunities',
  'Other'
];
