import { AssessmentQuestion } from '../types/assessment';

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // ==========================================
  // DIMENSION 1: AI AWARENESS & LITERACY (5 Questions)
  // ==========================================
  {
    id: 'lit_01',
    assessmentVersion: 'v1.0.0',
    dimension: 'ai_literacy',
    questionText: 'When an AI tool produces a convincing, authoritative summary of a business or research report, what is your standard operating procedure before relying on the conclusions?',
    questionType: 'scenario',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Responsible AI literacy demands independent verification of generated claims against primary sources.',
    options: [
      { id: 'lit_01_a', text: 'Trust the AI output directly because modern models are trained on billions of verified data points.', score: 10 },
      { id: 'lit_01_b', text: 'Skim the output quickly and only verify if a sentence sounds awkward or grammatically questionable.', score: 40 },
      { id: 'lit_01_c', text: 'Ask the same AI model a second time "Are you sure this is 100% accurate?" and accept its confirmation.', score: 55 },
      { id: 'lit_01_d', text: 'Cross-check core statistics, citations, and critical claims against the original source documents before professional use.', score: 100 }
    ]
  },
  {
    id: 'lit_02',
    assessmentVersion: 'v1.0.0',
    dimension: 'ai_literacy',
    questionText: 'How would you describe your practical understanding of "hallucinations" in Large Language Models (LLMs)?',
    questionType: 'single_choice',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'LLMs are probabilistic pattern engines predicting likely next tokens, not relational knowledge bases.',
    options: [
      { id: 'lit_02_a', text: 'I am not sure what hallucination means in the context of AI tools.', score: 15 },
      { id: 'lit_02_b', text: 'It means the AI had a temporary internet connection bug or server crash.', score: 25 },
      { id: 'lit_02_c', text: 'It means the AI generates plausibly sounding facts, citations, or data that are factually false or ungrounded.', score: 100 },
      { id: 'lit_02_d', text: 'Hallucinations only happen in outdated or free models, never in modern paid versions.', score: 35 }
    ]
  },
  {
    id: 'lit_03',
    assessmentVersion: 'v1.0.0',
    dimension: 'ai_literacy',
    questionText: 'Your teammate wants to paste an unreleased financial spreadsheet and customer email list into a public cloud AI chat tool to generate charts. What is the most appropriate action?',
    questionType: 'scenario',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Enterprise data security and privacy governance require anonymizing sensitive PII and respecting terms of service.',
    options: [
      { id: 'lit_03_a', text: 'Encourage them to do so because cloud AI terms always guarantee total public secrecy by default.', score: 10 },
      { id: 'lit_03_b', text: 'Stop and ensure sensitive customer PII and confidential business data are redacted or handled via enterprise-approved private tiers.', score: 100 },
      { id: 'lit_03_c', text: 'Allow it as long as they delete the chat thread history immediately afterward.', score: 40 },
      { id: 'lit_03_d', text: 'Ask the AI model in the prompt: "Please promise not to remember this confidential data".', score: 30 }
    ]
  },
  {
    id: 'lit_04',
    assessmentVersion: 'v1.0.0',
    dimension: 'ai_literacy',
    questionText: 'How confident are you in discerning tasks where Generative AI excels versus tasks where rule-based or human-supervised methods are essential?',
    questionType: 'scale',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Knowing when NOT to use AI is just as vital as knowing how to use it.',
    options: [
      { id: 'lit_04_1', text: '1 - Low: I often struggle to know which tasks are suitable for AI.', score: 20 },
      { id: 'lit_04_2', text: '2 - Emerging: I use AI indiscriminately or hesitate out of uncertainty.', score: 40 },
      { id: 'lit_04_3', text: '3 - Moderate: I know AI is better for drafting and brainstorming than for exact calculations.', score: 70 },
      { id: 'lit_04_4', text: '4 - High: I clearly delineate probabilistic drafting vs deterministic computing and high-stakes ethical review.', score: 100 }
    ]
  },
  {
    id: 'lit_05',
    assessmentVersion: 'v1.0.0',
    dimension: 'ai_literacy',
    questionText: 'When an AI-generated recommendation conflicts with established industry regulations or ethical standards, who bears ultimate professional accountability?',
    questionType: 'single_choice',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Human practitioners retain full professional responsibility for all submitted work and decisions.',
    options: [
      { id: 'lit_05_a', text: 'The AI vendor company that created the model.', score: 20 },
      { id: 'lit_05_b', text: 'No one, because AI decisions are considered force majeure technology events.', score: 10 },
      { id: 'lit_05_c', text: 'The human professional who accepted, approved, or acted upon the AI recommendation.', score: 100 },
      { id: 'lit_05_d', text: 'The IT department that provisioned the user account.', score: 30 }
    ]
  },

  // ==========================================
  // DIMENSION 2: AI TOOL FLUENCY (5 Questions)
  // ==========================================
  {
    id: 'tool_01',
    assessmentVersion: 'v1.0.0',
    dimension: 'tool_fluency',
    questionText: 'When prompting an AI to draft a strategic proposal, which technique best reflects your prompt engineering approach?',
    questionType: 'scenario',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Structured framing with role, objective, context, explicit constraints, and formatting yields high-quality outputs.',
    options: [
      { id: 'tool_01_a', text: 'Single short sentence (e.g., "Write me a proposal for a new client project").', score: 25 },
      { id: 'tool_01_b', text: 'A few paragraphs describing my thoughts with no specific format instructions.', score: 55 },
      { id: 'tool_01_c', text: 'Structured prompt defining target persona, audience context, step-by-step goals, explicit negative constraints, and output format.', score: 100 },
      { id: 'tool_01_d', text: 'Copying a 5-page generic template prompt from social media without customizing context.', score: 45 }
    ]
  },
  {
    id: 'tool_02',
    assessmentVersion: 'v1.0.0',
    dimension: 'tool_fluency',
    questionText: 'If the initial output from an AI model is too generic or misses key context, what is your next step?',
    questionType: 'single_choice',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Iterative dialogue with concrete counter-examples and boundary refinements improves results.',
    options: [
      { id: 'tool_02_a', text: 'Abandon the AI tool and conclude it cannot handle complex requests.', score: 15 },
      { id: 'tool_02_b', text: 'Repeat the exact same prompt in a fresh chat window hoping for a better random seed.', score: 25 },
      { id: 'tool_02_c', text: 'Provide targeted corrective feedback, clarifying what was missing and providing concrete few-shot examples.', score: 100 },
      { id: 'tool_02_d', text: 'Accept the generic output and manually rewrite 95% of it from scratch without coaching the prompt.', score: 50 }
    ]
  },
  {
    id: 'tool_03',
    assessmentVersion: 'v1.0.0',
    dimension: 'tool_fluency',
    questionText: 'How regularly do you use system instructions, custom instructions, or saved reusable prompt templates for recurrent tasks?',
    questionType: 'scale',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Repeatable prompt templates and system directives distinguish fluent operators from casual chatters.',
    options: [
      { id: 'tool_03_1', text: '1 - Never: I start every session with a blank slate and retype basic context each time.', score: 20 },
      { id: 'tool_03_2', text: '2 - Rarely: I sometimes copy an old prompt if I can find it in my chat history.', score: 45 },
      { id: 'tool_03_3', text: '3 - Occasionally: I have a few notepad templates or customized prompt settings.', score: 75 },
      { id: 'tool_03_4', text: '4 - Consistently: I maintain structured prompt libraries, custom instructions, or automated workflow shortcuts.', score: 100 }
    ]
  },
  {
    id: 'tool_04',
    assessmentVersion: 'v1.0.0',
    dimension: 'tool_fluency',
    questionText: 'Which variety of AI modalities have you actively used for work, study, or creative problem solving?',
    questionType: 'single_choice',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Fluency across multimodal tools (text, code, image, audio, data analysis) enhances cross-functional capability.',
    options: [
      { id: 'tool_04_a', text: 'Text chat only for basic Q&A.', score: 35 },
      { id: 'tool_04_b', text: 'Text chat and occasionally generating an image for fun.', score: 55 },
      { id: 'tool_04_c', text: 'Text, document analysis (PDF uploads), and basic tabular/code analysis.', score: 80 },
      { id: 'tool_04_d', text: 'Multimodal workflows combining text reasoning, vision inspection, code execution, and data visualization tools.', score: 100 }
    ]
  },
  {
    id: 'tool_05',
    assessmentVersion: 'v1.0.0',
    dimension: 'tool_fluency',
    questionText: 'When an AI model produces code, formulas, or financial calculations, how do you validate operational integrity?',
    questionType: 'scenario',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Evaluating outputs via isolated sandbox testing and edge-case validation is mandatory for technical fluency.',
    options: [
      { id: 'tool_05_a', text: 'Assume it runs correctly if there are no red squiggly lines or syntax errors.', score: 20 },
      { id: 'tool_05_b', text: 'Run it directly in production or real files to see if anything breaks.', score: 25 },
      { id: 'tool_05_c', text: 'Execute in a sandbox with sample edge cases, boundary inputs, and verify math manually against test data.', score: 100 },
      { id: 'tool_05_d', text: 'Ask the model "Does this code have bugs?" and trust its "No bugs found" response.', score: 40 }
    ]
  },

  // ==========================================
  // DIMENSION 3: DOMAIN APPLICATION (5 Questions)
  // ==========================================
  {
    id: 'dom_01',
    assessmentVersion: 'v1.0.0',
    dimension: 'domain_application',
    questionText: 'In your current field (software, healthcare, education, marketing, finance, etc.), how clearly can you identify 3 high-impact workflows where AI creates genuine leverage?',
    questionType: 'scale',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Domain application starts with pinpointing high-friction, repetitive, or analytical bottleneck tasks.',
    options: [
      { id: 'dom_01_1', text: '1 - Unclear: I am not sure where AI realistically fits into my discipline.', score: 20 },
      { id: 'dom_01_2', text: '2 - Vague: I know people talk about it, but haven\'t mapped specific tasks yet.', score: 40 },
      { id: 'dom_01_3', text: '3 - Identified: I have identified 2-3 concrete tasks (e.g. drafting emails, summarizing notes, initial research).', score: 75 },
      { id: 'dom_01_4', text: '4 - Established: I have deeply mapped specific domain pipelines with human checkpoints and quantifiable time savings.', score: 100 }
    ]
  },
  {
    id: 'dom_02',
    assessmentVersion: 'v1.0.0',
    dimension: 'domain_application',
    questionText: 'How do you structure human oversight when integrating AI into day-to-day domain deliverables?',
    questionType: 'scenario',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Human-in-the-loop oversight maintains brand alignment, domain nuances, and quality control.',
    options: [
      { id: 'dom_02_a', text: 'Zero oversight: I automate the output directly to stakeholders to maximize speed.', score: 15 },
      { id: 'dom_02_b', text: 'Human-in-the-loop: AI produces the 70% first draft, then I review domain nuances, tone, and strategic intent.', score: 100 },
      { id: 'dom_02_c', text: 'Minimal oversight: I only check if my name is spelled correctly on the cover sheet.', score: 30 },
      { id: 'dom_02_d', text: 'I avoid using AI for any real work because human oversight takes more effort than manual creation.', score: 40 }
    ]
  },
  {
    id: 'dom_03',
    assessmentVersion: 'v1.0.0',
    dimension: 'domain_application',
    questionText: 'Have you mapped how AI impacts standard operating procedures or team handoffs in your workplace or academic environment?',
    questionType: 'single_choice',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Integrating AI into team collaboration requires clear interface guidelines and shared expectations.',
    options: [
      { id: 'dom_03_a', text: 'No, I only use AI quietly on my own without sharing workflows or discussing standards.', score: 35 },
      { id: 'dom_03_b', text: 'I have shared a few useful prompt tips with colleagues or peers informally.', score: 65 },
      { id: 'dom_03_c', text: 'I have documented or proposed clear SOPs for how team members can use AI while preserving accountability.', score: 100 },
      { id: 'dom_03_d', text: 'My organization strictly forbids any AI exploration so I cannot consider it.', score: 40 }
    ]
  },
  {
    id: 'dom_04',
    assessmentVersion: 'v1.0.0',
    dimension: 'domain_application',
    questionText: 'How frequently do you leverage AI tools to synthesize cross-disciplinary information (e.g. interpreting legal/technical specs for a business proposal)?',
    questionType: 'scale',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Cross-functional synthesis is one of the highest leverage applications for knowledge workers.',
    options: [
      { id: 'dom_04_1', text: '1 - Never: I only ask questions within my immediate comfort zone.', score: 25 },
      { id: 'dom_04_2', text: '2 - Rarely: Once or twice when completely stuck on unfamiliar jargon.', score: 50 },
      { id: 'dom_04_3', text: '3 - Frequently: I regularly use AI to translate complex concepts between adjacent domains.', score: 85 },
      { id: 'dom_04_4', text: '4 - Systematically: It is a core part of my competitive strategy to ramp up in unfamiliar domains rapidly.', score: 100 }
    ]
  },
  {
    id: 'dom_05',
    assessmentVersion: 'v1.0.0',
    dimension: 'domain_application',
    questionText: 'When evaluating whether to adopt an AI solution for a repetitive business or academic workflow, what is your primary decision criterion?',
    questionType: 'single_choice',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Pragmatic evaluation balances tangible efficiency gains against compliance and verification overhead.',
    options: [
      { id: 'dom_05_a', text: 'Whether it uses the newest, trendiest model on social media.', score: 20 },
      { id: 'dom_05_b', text: 'Measurable time saved and error reduction weighed against verification and security costs.', score: 100 },
      { id: 'dom_05_c', text: 'Whether the AI can do the entire job with zero human involvement.', score: 35 },
      { id: 'dom_05_d', text: 'Whether it is 100% free with no enterprise features.', score: 40 }
    ]
  },

  // ==========================================
  // DIMENSION 4: CAREER ADAPTABILITY (5 Questions)
  // ==========================================
  {
    id: 'adapt_01',
    assessmentVersion: 'v1.0.0',
    dimension: 'career_adaptability',
    questionText: 'How do you emotionally and professionally react when an AI tool demonstrates capability that automates an aspect of your previous specialty?',
    questionType: 'scenario',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Adaptability focuses on shifting up the value stack from rote execution to strategic orchestration.',
    options: [
      { id: 'adapt_01_a', text: 'Defensive denial: I argue the tool is useless and refuse to acknowledge its efficiency.', score: 15 },
      { id: 'adapt_01_b', text: 'Anxiety & paralysis: I worry about obsolescence but avoid exploring how to harness the shift.', score: 30 },
      { id: 'adapt_01_c', text: 'Curiosity & recalibration: I test the tool to understand its ceiling and pivot my focus toward higher-level judgment and orchestration.', score: 100 },
      { id: 'adapt_01_d', text: 'Passive acceptance: I wait for my employer or teachers to tell me what course to take.', score: 50 }
    ]
  },
  {
    id: 'adapt_02',
    assessmentVersion: 'v1.0.0',
    dimension: 'career_adaptability',
    questionText: 'What does your self-directed routine for learning and experimenting with emerging technology look like?',
    questionType: 'single_choice',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Consistent micro-learning routines build sustainable career resilience.',
    options: [
      { id: 'adapt_02_a', text: 'I don\'t have a routine; I only hear about updates through viral social media posts.', score: 25 },
      { id: 'adapt_02_b', text: 'I occasionally read tech news articles when I have free time.', score: 50 },
      { id: 'adapt_02_c', text: 'I dedicate 1-2 hours each week to test new tools, read release notes, or take practical tutorials.', score: 100 },
      { id: 'adapt_02_d', text: 'I register for many courses but rarely complete any or apply them hands-on.', score: 45 }
    ]
  },
  {
    id: 'adapt_03',
    assessmentVersion: 'v1.0.0',
    dimension: 'career_adaptability',
    questionText: 'How comfortable are you learning an unfamiliar software interface, API, or AI tool without formal classroom instruction?',
    questionType: 'scale',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Autonomous learning agility is essential in rapidly evolving technical ecosystems.',
    options: [
      { id: 'adapt_03_1', text: '1 - Uncomfortable: I need step-by-step human tutoring to get started.', score: 25 },
      { id: 'adapt_03_2', text: '2 - Hesitant: I can follow video walkthroughs but get stuck when errors appear.', score: 50 },
      { id: 'adapt_03_3', text: '3 - Comfortable: I read documentation, test prompts, and troubleshoot my way through.', score: 85 },
      { id: 'adapt_03_4', text: '4 - Highly Confident: I thrive in ambiguous spaces and rapidly reverse-engineer new tools.', score: 100 }
    ]
  },
  {
    id: 'adapt_04',
    assessmentVersion: 'v1.0.0',
    dimension: 'career_adaptability',
    questionText: 'When a new model release (e.g. reasoning models, agentic frameworks) fundamentally changes best prompt practices, how quickly do you adjust?',
    questionType: 'single_choice',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Unlearning obsolete assumptions is a hallmark of an adaptive professional.',
    options: [
      { id: 'adapt_04_a', text: 'I keep using my old prompts forever regardless of how the underlying architecture changes.', score: 20 },
      { id: 'adapt_04_b', text: 'I usually wait several months until the new pattern becomes universally standard.', score: 55 },
      { id: 'adapt_04_c', text: 'I proactively experiment with the new paradigm within days to benchmark differences.', score: 100 },
      { id: 'adapt_04_d', text: 'I find frequent updates annoying and prefer not to pay attention.', score: 30 }
    ]
  },
  {
    id: 'adapt_05',
    assessmentVersion: 'v1.0.0',
    dimension: 'career_adaptability',
    questionText: 'How do you view the relationship between your core human expertise (domain intuition, empathy, ethics) and AI capabilities over the next 3 years?',
    questionType: 'single_choice',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Viewing AI as a capability multiplier alongside human wisdom provides a sustainable career foundation.',
    options: [
      { id: 'adapt_05_a', text: 'AI will render human judgment completely irrelevant.', score: 25 },
      { id: 'adapt_05_b', text: 'AI is a temporary fad that will fade out of enterprise importance.', score: 20 },
      { id: 'adapt_05_c', text: 'AI serves as a force multiplier; human expertise, ethical judgment, and client empathy become more decisive differentiators.', score: 100 },
      { id: 'adapt_05_d', text: 'Only computer science majors need to worry about the relationship.', score: 30 }
    ]
  },

  // ==========================================
  // DIMENSION 5: EVIDENCE OF WORK & PROFESSIONAL READINESS (6 Questions)
  // ==========================================
  {
    id: 'evid_01',
    assessmentVersion: 'v1.0.0',
    dimension: 'evidence_of_work',
    questionText: 'Which of the following best describes your portfolio or track record of building tangible outcomes with AI assistance?',
    questionType: 'single_choice',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Demonstrable projects provide undeniable proof of capability to employers and clients.',
    options: [
      { id: 'evid_01_a', text: 'I have not built or created any deliverables using AI.', score: 15 },
      { id: 'evid_01_b', text: 'I have generated isolated text snippets or casual personal images, but nothing packaged as a project.', score: 40 },
      { id: 'evid_01_c', text: 'I have delivered at least 1-2 practical artifacts (e.g. research report, web prototype, automated spreadsheet, campaign draft) with AI.', score: 80 },
      { id: 'evid_01_d', text: 'I have built and published multiple end-to-end projects with documented AI-human workflows in a public or professional portfolio.', score: 100 }
    ]
  },
  {
    id: 'evid_02',
    assessmentVersion: 'v1.0.0',
    dimension: 'evidence_of_work',
    questionText: 'Can you clearly articulate to an interviewer or manager the exact role AI played in a completed project versus your own contributions?',
    questionType: 'scenario',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Transparent communication about AI attribution highlights professional maturity and integrity.',
    options: [
      { id: 'evid_02_a', text: 'I would try to hide that AI was involved so they think I did 100% of it manually.', score: 15 },
      { id: 'evid_02_b', text: 'I would say "AI did it all for me with one click".', score: 25 },
      { id: 'evid_02_c', text: 'I can explain the architecture: AI accelerated research and draft iterations, while I directed problem definition, verified facts, and governed quality.', score: 100 },
      { id: 'evid_02_d', text: 'I am not sure how to describe the division of labor.', score: 45 }
    ]
  },
  {
    id: 'evid_03',
    assessmentVersion: 'v1.0.0',
    dimension: 'evidence_of_work',
    questionText: 'How thoroughly do you document your workflows, prompts, and version iterations when working on high-stakes tasks?',
    questionType: 'scale',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Reproducible documentation guarantees compliance, team knowledge transfer, and auditing.',
    options: [
      { id: 'evid_03_1', text: '1 - No documentation: My chats are ephemeral and I rarely save prompts.', score: 20 },
      { id: 'evid_03_2', text: '2 - Minimal: I bookmark chat links if I remember to.', score: 45 },
      { id: 'evid_03_3', text: '3 - Structured: I record key prompts and final edits in project notes or repositories.', score: 80 },
      { id: 'evid_03_4', text: '4 - Comprehensive: I log full prompt lineages, baseline benchmarks, and validation logs.', score: 100 }
    ]
  },
  {
    id: 'evid_04',
    assessmentVersion: 'v1.0.0',
    dimension: 'evidence_of_work',
    questionText: 'Have you solved a real business, operational, or academic bottleneck using an AI-augmented solution within the last 6 months?',
    questionType: 'single_choice',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Applying AI to unblock tangible bottlenecks demonstrates high commercial readiness.',
    options: [
      { id: 'evid_04_a', text: 'No, I have not encountered a situation to try this.', score: 20 },
      { id: 'evid_04_b', text: 'I thought about it, but did not execute or finish.', score: 45 },
      { id: 'evid_04_c', text: 'Yes, I successfully reduced turnaround time or solved a concrete blocker using AI.', score: 90 },
      { id: 'evid_04_d', text: 'Yes, and I measured quantifiable improvements in time, cost, or output quality.', score: 100 }
    ]
  },
  {
    id: 'evid_05',
    assessmentVersion: 'v1.0.0',
    dimension: 'evidence_of_work',
    questionText: 'How prepared are you to teach or mentor a colleague on how to safely integrate AI tools into their everyday tasks?',
    questionType: 'scale',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'The ability to mentor others demonstrates mastery and leadership readiness.',
    options: [
      { id: 'evid_05_1', text: '1 - Unprepared: I am still trying to figure things out for myself.', score: 25 },
      { id: 'evid_05_2', text: '2 - Hesitant: I can show someone what buttons to click, but not deep concepts.', score: 50 },
      { id: 'evid_05_3', text: '3 - Competent: I can guide someone through effective prompt structures and safety verification.', score: 85 },
      { id: 'evid_05_4', text: '4 - Leadership: I can host workshops, author guidelines, and coach cross-functional peers.', score: 100 }
    ]
  },
  {
    id: 'evid_06',
    assessmentVersion: 'v1.0.0',
    dimension: 'evidence_of_work',
    questionText: 'What is your current progress toward having a publicly accessible proof-of-work (GitHub repo, Behance, case study, blog, or LinkedIn post) highlighting an AI-driven project?',
    questionType: 'single_choice',
    weight: 1.0,
    required: true,
    active: true,
    explanation: 'Public artifacts create inbound career opportunities and validate authentic skills.',
    options: [
      { id: 'evid_06_a', text: 'Nothing published or planned.', score: 15 },
      { id: 'evid_06_b', text: 'I have drafts or code saved locally on my laptop.', score: 50 },
      { id: 'evid_06_c', text: 'I have shared at least one public post, article, or repository showcasing an AI outcome.', score: 85 },
      { id: 'evid_06_d', text: 'I have an active portfolio with multiple documented case studies highlighting AI workflows.', score: 100 }
    ]
  }
];
