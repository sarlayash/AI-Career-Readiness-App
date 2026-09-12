import { MarketTool } from '../types/level2';

export const MARKET_TOOLS: MarketTool[] = [
  // Frontier LLMs
  {
    id: 'claude_35_sonnet',
    name: 'Claude 3.5 Sonnet',
    category: 'frontier_llms',
    vendor: 'Anthropic',
    description: 'Industry-leading model for code generation, nuanced reasoning, long-context document synthesis (200k), and visual artifact inspection.',
    keyStrengths: ['Complex Logic & Code', 'Artifacts Visual Sandbox', 'Low Hallucination Rate', 'Spec-Driven Reasoning'],
    bestForDomains: ['IT / Software', 'Data / Analytics', 'Finance / Accounting', 'Education / Training'],
    enterpriseReadiness: 'Production Standard',
    accessUrl: 'https://claude.ai',
    freeTierOrTrial: true
  },
  {
    id: 'gpt_4o',
    name: 'GPT-4o (Omni)',
    category: 'frontier_llms',
    vendor: 'OpenAI',
    description: 'Flagship multimodal frontier model with native vision, audio, deep web browsing, custom GPTs, and real-time structured outputs.',
    keyStrengths: ['Multimodal Fluidity', 'Custom GPT Ecosystem', 'JSON Structured Outputs', 'Broad Ecosystem API Support'],
    bestForDomains: ['Sales / Marketing', 'Operations / Administration', 'IT / Software', 'Entrepreneurship'],
    enterpriseReadiness: 'Production Standard',
    accessUrl: 'https://chatgpt.com',
    freeTierOrTrial: true
  },
  {
    id: 'gemini_2_pro',
    name: 'Google Gemini 2.0 / 1.5 Pro',
    category: 'frontier_llms',
    vendor: 'Google DeepMind',
    description: 'Massive 2-Million token context window capable of ingesting entire enterprise codebases, hours of audio/video, and extensive PDF archives.',
    keyStrengths: ['2M Context Ingestion', 'Audio/Video Native Parsing', 'Google Workspace Integration', 'Context Caching Efficiency'],
    bestForDomains: ['Data / Analytics', 'Education / Training', 'Healthcare', 'Operations / Administration'],
    enterpriseReadiness: 'Enterprise Leader',
    accessUrl: 'https://aistudio.google.com',
    freeTierOrTrial: true
  },
  {
    id: 'perplexity_pro',
    name: 'Perplexity Pro',
    category: 'frontier_llms',
    vendor: 'Perplexity AI',
    description: 'Real-time conversational answer engine with verified academic/web source grounding, multi-file synthesis, and citation-backed research.',
    keyStrengths: ['Real-Time Web Grounding', 'Academic Citations', 'Competitive Intel Distillation', 'Multi-Source Synthesis'],
    bestForDomains: ['Sales / Marketing', 'Finance / Accounting', 'HR / Recruitment', 'Education / Training'],
    enterpriseReadiness: 'Production Standard',
    accessUrl: 'https://perplexity.ai',
    freeTierOrTrial: true
  },
  {
    id: 'deepseek_r1',
    name: 'DeepSeek R1 / V3',
    category: 'frontier_llms',
    vendor: 'DeepSeek',
    description: 'High-performance open-weights reasoning model specializing in mathematical decomposition, logic chains, and transparent step-by-step thinking.',
    keyStrengths: ['Deep Mathematical Proofs', 'Cost Efficiency', 'Chain-of-Thought Visibility', 'On-Premises Deployment'],
    bestForDomains: ['IT / Software', 'Data / Analytics', 'Finance / Accounting'],
    enterpriseReadiness: 'High Growth',
    accessUrl: 'https://chat.deepseek.com',
    freeTierOrTrial: true
  },

  // Coding & Dev Workflows
  {
    id: 'cursor_ai',
    name: 'Cursor AI',
    category: 'coding_agents',
    vendor: 'Anysphere',
    description: 'AI-first code editor fork of VS Code with full codebase semantic indexing, multi-file editing agents, Composer mode, and inline diffs.',
    keyStrengths: ['Multi-file Editing Agent', 'Semantic Codebase Indexing', 'Composer Architecture', 'Terminal Auto-Debugging'],
    bestForDomains: ['IT / Software', 'Data / Analytics', 'Entrepreneurship'],
    enterpriseReadiness: 'Production Standard',
    accessUrl: 'https://cursor.com',
    freeTierOrTrial: true
  },
  {
    id: 'github_copilot',
    name: 'GitHub Copilot Enterprise',
    category: 'coding_agents',
    vendor: 'GitHub / Microsoft',
    description: 'Enterprise code completion and chat assistant integrated with GitHub pull requests, security vulnerability scanning, and repository search.',
    keyStrengths: ['PR Summarization', 'IDE Autocomplete', 'Enterprise Compliance', 'Repo-wide Chat'],
    bestForDomains: ['IT / Software', 'Data / Analytics'],
    enterpriseReadiness: 'Enterprise Leader',
    accessUrl: 'https://github.com/features/copilot',
    freeTierOrTrial: true
  },
  {
    id: 'v0_dev',
    name: 'v0.dev / Bolt.new',
    category: 'coding_agents',
    vendor: 'Vercel / StackBlitz',
    description: 'Generative UI and full-stack rapid prototyping engines that convert text prompts and mockups into responsive, production-ready React components.',
    keyStrengths: ['Instant UI Generation', 'Tailwind & React Integration', 'Live In-Browser Sandbox', 'Design-to-Code Velocity'],
    bestForDomains: ['IT / Software', 'Sales / Marketing', 'Entrepreneurship'],
    enterpriseReadiness: 'Production Standard',
    accessUrl: 'https://v0.dev',
    freeTierOrTrial: true
  },

  // Workflow Automation & Agents
  {
    id: 'crewai_langgraph',
    name: 'CrewAI / LangGraph',
    category: 'workflow_automation',
    vendor: 'Open Source Community',
    description: 'Multi-agent orchestration frameworks where specialized autonomous agents collaborate with role-playing, memory, and custom tool executions.',
    keyStrengths: ['Multi-Agent Delegation', 'Stateful Graph Workflows', 'Custom Python/Node Tools', 'Deterministic Error Handling'],
    bestForDomains: ['IT / Software', 'Operations / Administration', 'Finance / Accounting', 'Data / Analytics'],
    enterpriseReadiness: 'Production Standard',
    accessUrl: 'https://crewai.com',
    freeTierOrTrial: true
  },
  {
    id: 'n8n_ai',
    name: 'n8n AI & Advanced Agents',
    category: 'workflow_automation',
    vendor: 'n8n',
    description: 'Self-hostable visual workflow automation platform connecting 400+ business APIs with LangChain agents and local vector stores.',
    keyStrengths: ['Visual Pipeline Builder', 'Self-Hosted Privacy', 'Webhook & API Orchestration', 'Cost-Free Unlimited Runs'],
    bestForDomains: ['Operations / Administration', 'IT / Software', 'Sales / Marketing', 'HR / Recruitment'],
    enterpriseReadiness: 'Production Standard',
    accessUrl: 'https://n8n.io',
    freeTierOrTrial: true
  },
  {
    id: 'zapier_central',
    name: 'Zapier Central / AI Actions',
    category: 'workflow_automation',
    vendor: 'Zapier',
    description: 'No-code agent workspace that executes live actions across 6,000+ business applications (Gmail, Slack, HubSpot, Jira, Sheets) via natural language.',
    keyStrengths: ['Zero-Code Setup', '6000+ App Connectors', 'Trigger-Based Bots', 'Instant Enterprise Integration'],
    bestForDomains: ['Sales / Marketing', 'HR / Recruitment', 'Operations / Administration', 'Finance / Accounting'],
    enterpriseReadiness: 'Enterprise Leader',
    accessUrl: 'https://zapier.com/central',
    freeTierOrTrial: true
  },

  // Enterprise Productivity & Knowledge
  {
    id: 'notebooklm',
    name: 'NotebookLM',
    category: 'enterprise_productivity',
    vendor: 'Google',
    description: 'Grounded personalized AI research collaborator that strictly restricts responses to your uploaded documents, with audio podcast discussions.',
    keyStrengths: ['Zero Hallucination Grounding', 'Audio Overview Podcast', 'Source Inline Citations', 'Multi-PDF Comparison'],
    bestForDomains: ['Education / Training', 'Finance / Accounting', 'Healthcare', 'Operations / Administration', 'HR / Recruitment'],
    enterpriseReadiness: 'Production Standard',
    accessUrl: 'https://notebooklm.google',
    freeTierOrTrial: true
  },
  {
    id: 'ms_copilot_365',
    name: 'Microsoft 365 Copilot',
    category: 'enterprise_productivity',
    vendor: 'Microsoft',
    description: 'Native workplace copilot embedded into Word, Excel (data modeling & formulas), PowerPoint, Teams meetings transcripts, and Outlook.',
    keyStrengths: ['Excel Formula Generation', 'Teams Meeting Summaries', 'Enterprise Graph Security', 'Document Formatting'],
    bestForDomains: ['Finance / Accounting', 'Operations / Administration', 'Sales / Marketing', 'HR / Recruitment'],
    enterpriseReadiness: 'Enterprise Leader',
    accessUrl: 'https://copilot.microsoft.com',
    freeTierOrTrial: false
  },
  {
    id: 'notion_ai',
    name: 'Notion AI Workspaces',
    category: 'enterprise_productivity',
    vendor: 'Notion',
    description: 'Connected workplace AI that searches and synthesizes team wikis, project databases, meeting notes, and automates status updates.',
    keyStrengths: ['Cross-Page Knowledge Search', 'Automated Table Summaries', 'Action Item Extraction', 'Collaborative Notes'],
    bestForDomains: ['Operations / Administration', 'IT / Software', 'HR / Recruitment', 'Sales / Marketing'],
    enterpriseReadiness: 'Production Standard',
    accessUrl: 'https://notion.so/product/ai',
    freeTierOrTrial: true
  },

  // Multimodal & Creative Production
  {
    id: 'midjourney_v6',
    name: 'Midjourney v6.1 / Flux.1',
    category: 'multimodal_creative',
    vendor: 'Midjourney / Black Forest Labs',
    description: 'State-of-the-art visual generation engines providing photorealistic product shots, marketing hero banners, and brand concept art.',
    keyStrengths: ['Photorealistic Quality', 'Consistent Art Direction', 'Style Tuning & Pan/Zoom', 'Enterprise Graphic Assets'],
    bestForDomains: ['Sales / Marketing', 'Entrepreneurship', 'Education / Training'],
    enterpriseReadiness: 'Production Standard',
    accessUrl: 'https://midjourney.com',
    freeTierOrTrial: false
  },
  {
    id: 'elevenlabs_voice',
    name: 'ElevenLabs Voice & Audio AI',
    category: 'multimodal_creative',
    vendor: 'ElevenLabs',
    description: 'Enterprise voice synthesis and audio localization platform offering human-indistinguishable narration, voice cloning, and dubbing in 32+ languages.',
    keyStrengths: ['Emotional Nuance & Inflection', 'Multilingual Dubbing', 'Instant Voice Cloning', 'API Latency for Agents'],
    bestForDomains: ['Sales / Marketing', 'Education / Training', 'Operations / Administration'],
    enterpriseReadiness: 'Enterprise Leader',
    accessUrl: 'https://elevenlabs.io',
    freeTierOrTrial: true
  },
  {
    id: 'runway_gen3',
    name: 'Runway Gen-3 Alpha',
    category: 'multimodal_creative',
    vendor: 'Runway',
    description: 'Cinematic video generation and motion control platform creating promotional videos, conceptual b-roll, and visual storytelling.',
    keyStrengths: ['Cinematic Motion Control', 'Text-to-Video / Image-to-Video', 'Camera Angle Direction', 'Creative Campaign Prototyping'],
    bestForDomains: ['Sales / Marketing', 'Entrepreneurship'],
    enterpriseReadiness: 'High Growth',
    accessUrl: 'https://runwayml.com',
    freeTierOrTrial: true
  },

  // Governance & RAG
  {
    id: 'pinecone_rag',
    name: 'Pinecone / Vector DBs',
    category: 'governance_rag',
    vendor: 'Pinecone Systems',
    description: 'Serverless vector database designed for high-scale enterprise similarity search, hybrid search (BM25 + Dense), and low-latency RAG.',
    keyStrengths: ['Serverless Vector Indexing', 'Metadata Filtering', 'Sub-50ms Query Latency', 'SOC2 Type II Compliance'],
    bestForDomains: ['IT / Software', 'Data / Analytics', 'Finance / Accounting'],
    enterpriseReadiness: 'Enterprise Leader',
    accessUrl: 'https://pinecone.io',
    freeTierOrTrial: true
  },
  {
    id: 'guardrails_ai',
    name: 'Guardrails AI & TruLens',
    category: 'governance_rag',
    vendor: 'Open Source Community',
    description: 'Frameworks for validating LLM outputs, enforcing schema compliance, intercepting PII leaks, and measuring hallucination and toxic outputs.',
    keyStrengths: ['PII & Secret Interception', 'Hallucination Benchmarking', 'Triad Metrics (Relevance, Groundedness)', 'Enterprise Red-Teaming'],
    bestForDomains: ['IT / Software', 'Healthcare', 'Finance / Accounting', 'Operations / Administration'],
    enterpriseReadiness: 'Production Standard',
    accessUrl: 'https://guardrailsai.com',
    freeTierOrTrial: true
  }
];

export const TOOL_CATEGORIES_META: Record<string, { label: string; description: string; iconName: string }> = {
  frontier_llms: {
    label: 'Frontier Models & Reasoning',
    description: 'Claude 3.5 Sonnet, GPT-4o, Gemini 2.0, DeepSeek R1 & Perplexity',
    iconName: 'Cpu'
  },
  coding_agents: {
    label: 'AI Coding & Dev Agents',
    description: 'Cursor AI, GitHub Copilot, Windsurf & v0.dev rapid builders',
    iconName: 'Code'
  },
  workflow_automation: {
    label: 'Agent Frameworks & Automation',
    description: 'CrewAI, LangGraph, n8n AI & Zapier Central orchestrators',
    iconName: 'Bot'
  },
  enterprise_productivity: {
    label: 'Enterprise Copilots & Knowledge',
    description: 'NotebookLM, Microsoft 365 Copilot, Google Workspace & Notion AI',
    iconName: 'Layers'
  },
  multimodal_creative: {
    label: 'Multimodal Media Production',
    description: 'Midjourney v6, ElevenLabs Audio, Runway Gen-3 & Sora',
    iconName: 'Palette'
  },
  governance_rag: {
    label: 'RAG Architecture & Governance',
    description: 'Pinecone Vector DBs, TruLens evaluation, PII safeguards & Guardrails',
    iconName: 'ShieldCheck'
  }
};
