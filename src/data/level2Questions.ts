import { Level2Question } from '../types/level2';

export const LEVEL2_QUESTIONS: Level2Question[] = [
  {
    id: 'l2_q1_rag_enterprise',
    category: 'governance_rag',
    useCase: 'enterprise_rag',
    title: 'Enterprise Knowledge Extraction & RAG Architecture',
    scenario: 'Your company has 8,000 confidential internal standard operating procedures, HR handbooks, and system architecture PDFs. The executive team wants employees to query these documents with zero hallucinations and strict source attribution.',
    difficulty: 'Specialist',
    toolFocus: ['Pinecone / Vector DBs', 'Claude 3.5 Sonnet', 'NotebookLM', 'Chunking & Hybrid Search'],
    options: [
      {
        id: 'a',
        text: 'Deploy a Retrieval-Augmented Generation (RAG) pipeline utilizing hybrid search (Dense embeddings + BM25 keyword matching) in a vector DB, injecting retrieved chunks into Claude 3.5 or Gemini with mandatory inline citation grounding.',
        score: 100,
        explanation: 'Best-in-class enterprise standard: Hybrid search handles specific product codes and semantic queries, while top frontier models format exact citations with minimal hallucination risk.',
        toolInsight: 'Tools: Pinecone/Weaviate + Claude 3.5 Sonnet / Gemini Context Caching + TruLens'
      },
      {
        id: 'b',
        text: 'Upload all 8,000 PDFs directly into a consumer ChatGPT Plus account and create a public Custom GPT for the company to share.',
        score: 15,
        explanation: 'Critical enterprise vulnerability: Exposes company confidential data to public training pipelines and exceeds token context limits, leading to truncation and hallucinated policies.',
        toolInsight: 'Security Risk: Never upload proprietary HR/IP data to public consumer tiers.'
      },
      {
        id: 'c',
        text: 'Use Google NotebookLM for departmental teams as an instant grounded research assistant, backed by enterprise RAG for organization-wide scale.',
        score: 85,
        explanation: 'Highly effective operational approach: NotebookLM provides instant, zero-setup document grounding for teams, while enterprise RAG handles global systems.',
        toolInsight: 'Tools: Google NotebookLM + Enterprise RAG'
      },
      {
        id: 'd',
        text: 'Fine-tune an open-source model directly on the raw text of the 8,000 documents without setting up any retrieval database.',
        score: 35,
        explanation: 'Fine-tuning teaches model style and task formats, but is notorious for memorization decay, inability to cite sources, high training costs, and stale data as documents update.',
        toolInsight: 'Concept: Fine-tuning ≠ Knowledge retrieval. Use RAG for dynamic internal knowledge.'
      }
    ]
  },
  {
    id: 'l2_q2_coding_cursor',
    category: 'coding_agents',
    useCase: 'solution_delivery',
    title: 'AI-Native Development & Spec-Driven Engineering',
    scenario: 'Your product team needs to build a new customer dashboard feature with authenticated API endpoints, database queries, and responsive UI components. How do you integrate modern coding AI tools into your daily workflow to maximize velocity while preventing regressions?',
    difficulty: 'Specialist',
    toolFocus: ['Cursor AI', 'Composer Multi-file Agent', 'GitHub Copilot Enterprise', 'Spec-Driven Dev'],
    options: [
      {
        id: 'a',
        text: 'Utilize Cursor with semantic codebase indexing (@codebase) and Spec-Driven Development: write a detailed technical specification and test contract first, then use Composer mode to orchestrate coordinated multi-file edits with unit test verification.',
        score: 100,
        explanation: 'Industry gold standard: Modern AI engineering relies on clear technical specs and tests as guardrails. Cursor Composer excels when guided by clear architectural constraints and tests.',
        toolInsight: 'Tools: Cursor AI (Composer) + GitHub Copilot Enterprise + Vitest/Jest'
      },
      {
        id: 'b',
        text: 'Ask a web-based chatbot for complete component code snippets, then copy-paste them manually into your IDE file by file, debugging errors by asking more questions.',
        score: 30,
        explanation: 'Slow, disjointed, and prone to import mismatches and subtle regressions because the web model has zero context on your project files and dependencies.',
        toolInsight: 'Shift: Transition from copy-paste web chats to IDE-integrated semantic coding agents.'
      },
      {
        id: 'c',
        text: 'Generate rapid frontend prototypes using v0.dev or Bolt.new to validate design with stakeholders, then import the modular React/Tailwind code into Cursor for backend wiring.',
        score: 90,
        explanation: 'Outstanding full-stack cadence: Combining generative UI builders (v0) for rapid design validation with IDE-native agents (Cursor) for production integration cuts sprint times in half.',
        toolInsight: 'Tools: v0.dev / Bolt.new + Cursor'
      },
      {
        id: 'd',
        text: 'Rely purely on inline autocomplete tab-completions without inspecting generated logic or running automated tests.',
        score: 25,
        explanation: 'Autocomplete increases typing speed but provides no multi-file cohesion and frequently introduces silent edge-case bugs and security vulnerabilities.',
        toolInsight: 'Rule: Always require automated tests and human review for AI-generated code.'
      }
    ]
  },
  {
    id: 'l2_q3_agentic_workflows',
    category: 'workflow_automation',
    useCase: 'agent_orchestration',
    title: 'Autonomous Multi-Agent Orchestration & Tool Execution',
    scenario: 'Your operations department receives 300 vendor invoices and contract renewals weekly via email. The process requires parsing PDF data, verifying contract terms against a database, notifying the account manager on Slack, and logging transactions into QuickBooks.',
    difficulty: 'Enterprise Architect',
    toolFocus: ['CrewAI', 'LangGraph', 'n8n AI', 'Zapier Central'],
    options: [
      {
        id: 'a',
        text: 'Orchestrate a multi-agent pipeline using LangGraph or CrewAI: specialized agents for PDF vision extraction, policy auditing, and API tool-calling, with human-in-the-loop approval thresholds for invoices exceeding $5,000.',
        score: 100,
        explanation: 'Exemplary enterprise agent design: Segregates duties between specialized agents, equips them with deterministic tools, and guarantees human approval on high-financial impact actions.',
        toolInsight: 'Tools: LangGraph / CrewAI + n8n webhook triggers + Human-in-the-loop'
      },
      {
        id: 'b',
        text: 'Build a visual automated agent workflow in n8n AI or Zapier Central connecting Gmail triggers, an LLM structured extraction node, and accounting API actions with Slack alert webhooks.',
        score: 95,
        explanation: 'Practical, high-ROI enterprise deployment: Visual workflow platforms like n8n and Zapier provide rapid implementation, visual debugging, and reliable error logging.',
        toolInsight: 'Tools: n8n AI / Zapier Central + OpenAI Structured Outputs'
      },
      {
        id: 'c',
        text: 'Write a single mega-prompt asking ChatGPT to handle the entire intake, accounting calculations, and vendor emails in one unverified response.',
        score: 20,
        explanation: 'Single-prompt monoliths fail on multi-step operational tasks: they cannot reliably maintain state across 300 files and have no live connection to accounting APIs.',
        toolInsight: 'Principle: Break complex workflows into discrete, tool-enabled agent steps.'
      },
      {
        id: 'd',
        text: 'Keep the process entirely manual because AI agents are too unreliable for any financial administrative tasks.',
        score: 15,
        explanation: 'Unnecessary operational overhead: Modern agents equipped with structured outputs and approval gates process routine administrative workloads with 99%+ accuracy.',
        toolInsight: 'Mindset: Use AI for 80% heavy lifting, human oversight for the final 20% validation.'
      }
    ]
  },
  {
    id: 'l2_q4_executive_synthesis',
    category: 'enterprise_productivity',
    useCase: 'executive_synthesis',
    title: 'High-Volume Research & Competitive Intelligence Synthesis',
    scenario: 'Before a board strategy retreat, you are tasked with analyzing 15 competitor earnings transcripts (each 40 pages), 5 market analyst industry reports, and regulatory filings to pinpoint strategic threats and market share shifts.',
    difficulty: 'Practitioner',
    toolFocus: ['Google NotebookLM', 'Perplexity Pro', 'Gemini 2.0 2M Context', 'Claude 3.5 Sonnet'],
    options: [
      {
        id: 'a',
        text: 'Load all 20 source PDFs into Google NotebookLM for grounded synthesis and cross-document thematic comparison, supplemented by Perplexity Pro for real-time market updates, and Gemini 2.0 for holistic cross-corpus querying.',
        score: 100,
        explanation: 'Optimal market tool stack: NotebookLM guarantees zero external hallucination on private reports, Perplexity injects live market data, and Gemini 2.0 effortlessly ingests millions of tokens at once.',
        toolInsight: 'Tools: NotebookLM + Perplexity Pro + Gemini 2.0 Pro'
      },
      {
        id: 'b',
        text: 'Feed each document individually into a general chat window, asking for 3 bullet points per document, then manually paste them into PowerPoint.',
        score: 35,
        explanation: 'Extremely labor-intensive, loses cross-document correlation, and fails to identify macro-trends or contradictions across competitors.',
        toolInsight: 'Advancement: Use multi-document grounding tools to synthesize across entire corpuses.'
      },
      {
        id: 'c',
        text: 'Ask ChatGPT without any file uploads: "Tell me what competitors did this quarter and what their strategies are."',
        score: 10,
        explanation: 'Generates generic, outdated, or hallucinated summaries because the model lacks access to the specific 15 earnings reports and analyst notes.',
        toolInsight: 'Rule: Never prompt for specific proprietary data without document grounding.'
      },
      {
        id: 'd',
        text: 'Read the executive summaries yourself and avoid AI tools entirely due to fear of biased data.',
        score: 25,
        explanation: 'Misses out on dramatic productivity leverage and deep pattern recognition that modern AI context windows deliver across thousands of pages.',
        toolInsight: 'Efficiency: AI document synthesis frees executive time for strategic decision-making.'
      }
    ]
  },
  {
    id: 'l2_q5_multimodal_pipeline',
    category: 'multimodal_creative',
    useCase: 'multimodal_pipeline',
    title: 'Cross-Modal Content & Brand Production Pipeline',
    scenario: 'Your marketing or product team needs to launch a global campaign across 5 regions. You need high-fidelity visual hero imagery, localized video walkthroughs with regional accents, and tailored promotional copy in 6 languages.',
    difficulty: 'Specialist',
    toolFocus: ['Midjourney v6.1 / Flux', 'ElevenLabs Voice AI', 'Runway Gen-3', 'Claude 3.5 Sonnet'],
    options: [
      {
        id: 'a',
        text: 'Establish an integrated multimodal pipeline: Claude 3.5 for localized cultural copy framing, Midjourney v6.1 / Flux with style-reference codes for consistent art direction, ElevenLabs for multilingual voice localization with regional cadences, and Runway Gen-3 for motion clips.',
        score: 100,
        explanation: 'State-of-the-art multimodal pipeline: Leverages best-of-breed specialized engines for each media modality while maintaining unified brand aesthetics.',
        toolInsight: 'Tools: Claude 3.5 + Midjourney/Flux.1 + ElevenLabs Dubbing + Runway Gen-3'
      },
      {
        id: 'b',
        text: 'Use standard generic stock image libraries and Google Translate for copy, avoiding AI generative media entirely.',
        score: 30,
        explanation: 'Significantly higher production cost and slower turnaround without the bespoke customization and brand consistency possible with modern generative media tools.',
        toolInsight: 'Opportunity: Modern AI enables studio-grade creative workflows for agile teams.'
      },
      {
        id: 'c',
        text: 'Rely on a single all-in-one low-tier AI tool to generate images, text, voice, and video simultaneously in one click.',
        score: 45,
        explanation: 'All-in-one monolithic tools currently lack the photorealism of Midjourney, the emotional cadence of ElevenLabs, and the reasoning depth of Claude 3.5.',
        toolInsight: 'Best Practice: Stack specialized category leaders rather than low-grade monoliths.'
      },
      {
        id: 'd',
        text: 'Generate visual assets on Midjourney without establishing any brand style references (--sref) or character consistency parameters.',
        score: 50,
        explanation: 'Generates disjointed visual styles across assets that look inconsistent to enterprise brand standards.',
        toolInsight: 'Skill: Master prompt parameters (--sref, --cref, seed control) for brand consistency.'
      }
    ]
  },
  {
    id: 'l2_q6_governance_security',
    category: 'governance_rag',
    useCase: 'governance_compliance',
    title: 'Enterprise AI Security, PII Protection & Model Privacy',
    scenario: 'Your company is adopting AI tools across customer support, engineering, and HR. Several team members are asking whether they can paste customer transaction records and proprietary code into public AI tools.',
    difficulty: 'Enterprise Architect',
    toolFocus: ['Enterprise Data Privacy', 'Zero Data Retention (ZDR)', 'Guardrails AI', 'TruLens'],
    options: [
      {
        id: 'a',
        text: 'Establish clear enterprise governance: require enterprise API tiers with Zero Data Retention (ZDR) agreements, implement automated PII masking middleware (Guardrails AI), disable consumer training toggles, and enforce SSO audit logs.',
        score: 100,
        explanation: 'Mandatory enterprise compliance posture: Protects intellectual property, meets GDPR/HIPAA/SOC2 requirements, and prevents sensitive company data from training public foundation models.',
        toolInsight: 'Tools: Guardrails AI + Enterprise Zero-Data Retention APIs + Azure OpenAI / Vertex AI'
      },
      {
        id: 'b',
        text: 'Allow employees to use personal free ChatGPT and Claude accounts as long as they promise not to paste customer names.',
        score: 15,
        explanation: 'Severe regulatory and compliance violation: Free consumer tiers default to training on user prompts, and honor-system policies routinely result in data leaks.',
        toolInsight: 'Risk: Consumer free tiers store and train on conversations by default.'
      },
      {
        id: 'c',
        text: 'Block all AI tools entirely across company network firewalls to eliminate all security risks.',
        score: 25,
        explanation: 'Causes "Shadow AI": employees will bypass firewalls using personal phones and personal devices, increasing security risks while drastically destroying company competitiveness.',
        toolInsight: 'Modern Reality: Provide secure, sanctioned enterprise AI paths instead of blanket bans.'
      },
      {
        id: 'd',
        text: 'Deploy an on-premises open-weights model (e.g., DeepSeek / Llama 3) in your private VPC for sensitive workloads, alongside enterprise-contracted frontier APIs.',
        score: 95,
        explanation: 'Excellent hybrid architecture: Keeps ultra-sensitive data on private VPC hardware while leveraging frontier cloud models for complex reasoning under enterprise agreements.',
        toolInsight: 'Architecture: Hybrid Private Cloud (Ollama/vLLM) + Enterprise Frontier APIs'
      }
    ]
  },
  {
    id: 'l2_q7_model_selection',
    category: 'frontier_llms',
    useCase: 'domain_automation',
    title: 'Precision Model Selection & Workload Matching',
    scenario: 'Your organization has different workloads: 1) Automated coding & refactoring, 2) Deep legal document contract analysis (1.5M tokens), 3) Cost-effective high-throughput classification of 500,000 customer tickets, 4) Real-time interactive voice agent.',
    difficulty: 'Specialist',
    toolFocus: ['Model Router', 'Claude 3.5 Sonnet', 'Gemini 2.0 Flash', 'DeepSeek R1', 'GPT-4o Mini'],
    options: [
      {
        id: 'a',
        text: 'Implement an intelligent model routing strategy: Claude 3.5 Sonnet for complex coding/logic; Gemini 2.0 Pro for 1.5M token contract analysis; lightweight fast models (GPT-4o mini / Gemini 2.0 Flash) for 500k ticket classification; and low-latency audio models for voice.',
        score: 100,
        explanation: 'Elite AI architecture: Matching workload characteristics to model specializations cuts inference costs by 70-85% while delivering superior quality and lower latency.',
        toolInsight: 'Concept: Multi-model orchestration & routing outperforms one-size-fits-all.'
      },
      {
        id: 'b',
        text: 'Route all 4 workloads through the most expensive frontier model available without batching or cost optimization.',
        score: 40,
        explanation: 'Results in massive budget blowouts ($10,000s in unnecessary API bills) for simple classification tasks that lightweight models handle identically.',
        toolInsight: 'Economics: GPT-4o mini or Gemini Flash cost 95% less than frontier models.'
      },
      {
        id: 'c',
        text: 'Use a single small local model running on an office laptop for all 4 workloads.',
        score: 20,
        explanation: 'Small local models lack the context window for 1.5M token legal contracts and the reasoning capacity for advanced software architecture.',
        toolInsight: 'Constraint: Recognize model scale and compute limitations.'
      },
      {
        id: 'd',
        text: 'Choose whatever model has the most viral social media buzz this week.',
        score: 10,
        explanation: 'Superficial and irresponsible engineering: Enterprise systems require empirical benchmark evaluations on specific tasks rather than social hype.',
        toolInsight: 'Benchmark: Evaluate accuracy, latency, cost per 1M tokens, and context window.'
      }
    ]
  },
  {
    id: 'l2_q8_workplace_copilots',
    category: 'enterprise_productivity',
    useCase: 'domain_automation',
    title: 'Enterprise Copilot Stacking & Spreadsheet/Document Workflows',
    scenario: 'A departmental team spends 12 hours every week compiling quarterly revenue projections in Excel/Sheets, drafting PowerPoint/Slides executive decks, and writing email updates to regional managers.',
    difficulty: 'Practitioner',
    toolFocus: ['Microsoft 365 Copilot', 'Google Workspace Gemini', 'Notion AI', 'Formula AI'],
    options: [
      {
        id: 'a',
        text: 'Stack workplace copilots: use Microsoft 365 Copilot / Gemini in Sheets for formula generation, scenario modeling, and anomaly detection; synthesize takeaways directly into presentation slides; and automate email draft templates using connected CRM context.',
        score: 100,
        explanation: 'Transforms 12 hours of repetitive clerical data entry into a 45-minute supervisory review, dramatically accelerating decision-making.',
        toolInsight: 'Tools: Microsoft 365 Copilot (Excel + PowerPoint) / Google Workspace Gemini + Notion AI'
      },
      {
        id: 'b',
        text: 'Export CSV data and paste raw numbers into a public chatbot to ask what formulas to use, then re-type them manually.',
        score: 40,
        explanation: 'Inefficient and risks leaking company financial figures to third-party consumer systems without native sheet formulas integration.',
        toolInsight: 'Upgrade: Use native in-app spreadsheet copilots with enterprise data protection.'
      },
      {
        id: 'c',
        text: 'Continue creating every spreadsheet formula and slide presentation from scratch manually to ensure total control.',
        score: 25,
        explanation: 'Leaves team members vulnerable to burnout on low-leverage repetitive tasks while competitors execute at 5x the speed.',
        toolInsight: 'Value: Focus human brainpower on strategic judgment, not boilerplate formatting.'
      },
      {
        id: 'd',
        text: 'Accept AI formula suggestions blindly without sanity-checking the math against raw accounting ledgers.',
        score: 30,
        explanation: 'Dangerous: Copilots can make subtle logic errors in nested formulas. Financial models always require human reconciliation against ground truth.',
        toolInsight: 'Golden Rule: Supervise and audit AI financial calculations.'
      }
    ]
  }
];

export const LEVEL2_SCORE_TIERS = [
  {
    min: 85,
    max: 100,
    label: 'Enterprise AI Architect & Pioneer',
    summary: 'You demonstrate world-class mastery across frontier models, agentic tool-calling, modern AI coding workflows, and enterprise governance. You are positioned to lead AI transformation across teams.',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  },
  {
    min: 70,
    max: 84,
    label: 'Applied AI Specialist & Power Integrator',
    summary: 'You possess strong practical expertise in deploying market tools (Claude, Cursor, RAG, Copilots) into real domain workflows. Your primary opportunity is scaling multi-agent automation and formalizing enterprise security.',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  {
    min: 50,
    max: 69,
    label: 'Operational AI Practitioner',
    summary: 'You actively use modern AI tools for day-to-day productivity and recognize key capabilities. Transitioning from standalone prompts to multi-tool pipelines and spec-driven workflows will significantly amplify your impact.',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
  },
  {
    min: 0,
    max: 49,
    label: 'Emerging Applied Explorer',
    summary: 'You are beginning to navigate the modern AI landscape. Establishing structured habits with frontier models and exploring IDE/automation tools will build your competitive edge quickly.',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
  }
];
