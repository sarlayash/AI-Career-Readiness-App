import { DIMENSIONS } from '../config/defaultConfigs';
import { DimensionId, PersonalizedActionPlan, UserProfile } from '../types/assessment';
import { ScoringResult } from './scoring';

/**
 * Generates deterministic, practical recommendations and a 30-day action plan
 * adhering strictly to the non-presumptuous, encouraging guidance mandated in the spec.
 */
export function generatePersonalizedActionPlan(
  scoring: ScoringResult,
  profile?: UserProfile
): PersonalizedActionPlan {
  const lowestDim = scoring.lowestDimension;
  const highestDim = scoring.highestDimension;
  const dimMeta = DIMENSIONS.find((d) => d.id === lowestDim) || DIMENSIONS[0];
  const domain = profile?.currentDomain || 'your field';
  const goal = profile?.primaryCareerGoal || 'career growth';

  // 1. Determine Strengths (Top scoring dimension(s))
  const strengths: string[] = [];
  const topDim = DIMENSIONS.find((d) => d.id === highestDim);
  if (topDim) {
    strengths.push(
      `Solid foundation in ${topDim.name} (${scoring.dimensionScores[highestDim].score}/100), reflecting healthy awareness of core principles.`
    );
  }
  if (scoring.overallScore >= 50) {
    strengths.push(
      `Demonstrated familiarity with applying generative tools to everyday inquiry and drafting tasks.`
    );
  } else {
    strengths.push(
      `Openness to honest reflection and identifying technical baselines before committing to professional workflows.`
    );
  }
  strengths.push(
    `Proactive alignment with your objective to ${goal.toLowerCase()} within ${domain}.`
  );

  // 2. Determine Development Opportunities (Lowest scoring dimension)
  const developmentGaps: string[] = [];
  switch (lowestDim) {
    case 'ai_literacy':
      developmentGaps.push('Deepening mental models around probabilistic vs deterministic capabilities.');
      developmentGaps.push('Institutionalizing systematic fact-checking and hallucination detection.');
      developmentGaps.push('Establishing clear privacy safeguards for proprietary data and PII.');
      break;
    case 'tool_fluency':
      developmentGaps.push('Moving beyond single-shot casual prompts toward structured multi-turn framing.');
      developmentGaps.push('Integrating explicit negative constraints, role context, and few-shot examples.');
      developmentGaps.push('Building a personal library of reusable prompt templates for repeated tasks.');
      break;
    case 'domain_application':
      developmentGaps.push(`Pinpointing 2-3 specific friction points in ${domain} that can be augmented safely.`);
      developmentGaps.push('Designing human-in-the-loop validation checkpoints before deliverables reach stakeholders.');
      developmentGaps.push('Documenting team-facing guidelines for AI-assisted collaboration.');
      break;
    case 'career_adaptability':
      developmentGaps.push('Forming a structured, weekly 90-minute routine to test unfamiliar AI tools.');
      developmentGaps.push('Cultivating agility when new foundation models render previous prompting patterns obsolete.');
      developmentGaps.push('Focusing on human differentiator skills like ethical judgment and cross-functional synthesis.');
      break;
    case 'evidence_of_work':
      developmentGaps.push('Packaging AI-assisted tasks into tangible, demonstrable portfolio artifacts.');
      developmentGaps.push('Clearly explaining your architectural contribution vs the model’s drafting output.');
      developmentGaps.push('Publishing a case study or workflow walkthrough that showcases real-world problem solving.');
      break;
  }

  // 3. Recommended Immediate Next Step
  let recommendedNextStep = '';
  switch (lowestDim) {
    case 'ai_literacy':
      recommendedNextStep = 'Review foundational LLM mechanics, study hallucination mitigation strategies, and establish a strict source-verification checklist for all AI-assisted notes.';
      break;
    case 'tool_fluency':
      recommendedNextStep = 'Upgrade your prompt structure: incorporate persona, concrete context, explicit boundaries, and sample input/output pairs in your next three projects.';
      break;
    case 'domain_application':
      recommendedNextStep = `Map out three routine tasks in ${domain}, identify where draft latency can be cut, and test human-in-the-loop workflows on low-risk iterations.`;
      break;
    case 'career_adaptability':
      recommendedNextStep = 'Block a dedicated 60-minute weekly learning slot on your calendar to explore release documentation and experiment with emerging tool capabilities.';
      break;
    case 'evidence_of_work':
      recommendedNextStep = 'Select one recent AI-assisted outcome and write a 1-page case study detailing the problem, prompt pipeline, human verification steps, and final impact.';
      break;
  }

  // 4. Personalized 30-Day Action Plan (4 Weeks)
  const weeklyPlan = getWeeklyPlanForDimension(lowestDim, domain);

  const guidanceText = `Your responses suggest that you have begun exploring AI and are developing confidence in using it. Your next opportunity is to move from occasional experimentation toward repeatable, domain-specific workflows, with particular focus on ${dimMeta.name}.`;

  return {
    primaryFocusDimension: lowestDim,
    dimensionName: dimMeta.name,
    guidanceText,
    strengths,
    developmentGaps,
    recommendedNextStep,
    weeklyPlan
  };
}

function getWeeklyPlanForDimension(dim: DimensionId, domain: string) {
  switch (dim) {
    case 'ai_literacy':
      return [
        {
          weekNumber: 1,
          theme: 'Mental Models & Hallucination Awareness',
          objective: 'Learn why LLMs hallucinate and how to spot ungrounded claims.',
          tasks: [
            'Read an overview on transformer token prediction vs knowledge retrieval.',
            'Prompt a model on an obscure topic and audit every single citation against Google Scholar or official documentation.',
            'Create a personal 3-step fact verification checklist.'
          ],
          suggestedArtifact: 'Fact-checking audit sheet comparing AI outputs against primary sources.'
        },
        {
          weekNumber: 2,
          theme: 'Data Privacy & Enterprise Boundaries',
          objective: 'Establish firm security protocols for handling personal and corporate data.',
          tasks: [
            'Review terms of service on data retention for the AI platforms you utilize.',
            'Practice anonymizing sample datasets by replacing PII with synthetic mock variables.',
            'Identify which data classes in your organization are strictly prohibited from public model prompts.'
          ],
          suggestedArtifact: 'Data anonymization cheat sheet for daily reference.'
        },
        {
          weekNumber: 3,
          theme: 'Ethical Accountability & Bias Auditing',
          objective: 'Analyze how biases and copyright impact generated outputs in your field.',
          tasks: [
            'Run identical prompts asking for occupational recommendations and note subtle demographic skews.',
            'Research relevant copyright policies and attribution requirements for AI-assisted works in your country.',
            'Formulate your personal pledge of professional accountability for AI-assisted decisions.'
          ],
          suggestedArtifact: 'Written personal code of ethics for AI usage in professional work.'
        },
        {
          weekNumber: 4,
          theme: 'Responsible AI Synthesis',
          objective: 'Combine verification, privacy, and ethics into an integrated workflow.',
          tasks: [
            'Produce a 500-word research summary using AI as a research partner, documenting every verified citation.',
            'Present your verification methodology to a colleague or peer group.',
            'Retake the assessment to measure confidence growth.'
          ],
          suggestedArtifact: 'Fully verified, annotated research deliverable with attribution disclosure.'
        }
      ];

    case 'tool_fluency':
      return [
        {
          weekNumber: 1,
          theme: 'Structured Prompt Architecture',
          objective: 'Master the Role-Context-Constraint-Format framework.',
          tasks: [
            'Stop using one-line prompts. Reframe all prompts with clear Persona, Background, Task, and Constraints.',
            'Incorporate explicit negative constraints (e.g., "Do not use bullet points", "Keep tone under 200 words").',
            'Test few-shot prompting by supplying two examples of ideal past work in your prompt.'
          ],
          suggestedArtifact: 'Structured prompt library containing 5 reusable template patterns.'
        },
        {
          weekNumber: 2,
          theme: 'Iterative Refinement & Error Correction',
          objective: 'Refine draft quality through multi-turn coaching rather than restarting.',
          tasks: [
            'Practice 4-turn dialogues where you guide the model to refine tone, tighten logic, and fix edge cases.',
            'Use role-playing prompts to pressure-test arguments (e.g., "Act as a critical reviewer pointing out 3 flaws").',
            'Experiment with chain-of-thought directives ("Think step by step before answering").'
          ],
          suggestedArtifact: 'A documented transcript of an iterative refinement session achieving 90%+ target fidelity.'
        },
        {
          weekNumber: 3,
          theme: 'Multimodal Tooling & Data Analysis',
          objective: 'Expand beyond text into charts, document parsing, and vision inspection.',
          tasks: [
            'Upload a complex PDF or balance sheet and prompt for tabular extraction and anomalies.',
            'Test code execution features to generate dynamic charts from raw CSV data.',
            'Evaluate multimodal vision tools on diagrams, UI mockups, or physical document scans.'
          ],
          suggestedArtifact: 'A data visualizer chart generated from a raw spreadsheet via code interpreter.'
        },
        {
          weekNumber: 4,
          theme: 'Automated Shortcuts & System Prompts',
          objective: 'Embed custom instructions and repeatable macros.',
          tasks: [
            'Configure custom instructions in your primary AI interface reflecting your background and preferred formats.',
            'Create keyboard shortcuts (text expansion) for common prompt preambles.',
            'Benchmark prompt variations to determine highest-yield configurations.'
          ],
          suggestedArtifact: 'Configured custom instructions profile tailored to your role.'
        }
      ];

    case 'domain_application':
      return [
        {
          weekNumber: 1,
          theme: `Friction Audit in ${domain}`,
          objective: 'Audit weekly tasks and identify prime automation targets.',
          tasks: [
            `Keep a log of all repetitive writing, formatting, and summarizing tasks in ${domain} for one week.`,
            'Classify tasks by risk: Low (internal brainstorming), Medium (drafting), High (final client deliverables).',
            'Select the top 2 low-risk friction tasks for pilot AI integration.'
          ],
          suggestedArtifact: 'Domain Task Matrix categorizing tasks by automation feasibility and risk.'
        },
        {
          weekNumber: 2,
          theme: 'Human-in-the-Loop Pipeline Design',
          objective: 'Create a safe workflow where AI handles drafting and human handles judgment.',
          tasks: [
            'Draft standard operating procedure (SOP) with explicit human review checkpoints.',
            'Measure time taken for manual baseline vs AI-augmented draft + human edit.',
            'Ensure domain-specific nuances, jargon, and compliance rules are verified.'
          ],
          suggestedArtifact: 'Documented SOP flow diagram for an augmented domain deliverable.'
        },
        {
          weekNumber: 3,
          theme: 'Cross-Functional Translation',
          objective: 'Use AI to bridge domain gaps with adjacent teams.',
          tasks: [
            'Use AI to simplify a technical document for executive stakeholders or clients.',
            'Translate business requirements into structured functional specifications.',
            'Seek feedback from a colleague in an adjacent department on the clarity of the deliverable.'
          ],
          suggestedArtifact: 'Executive brief translating complex domain findings into strategic recommendations.'
        },
        {
          weekNumber: 4,
          theme: 'Team Knowledge Sharing',
          objective: 'Scale your domain discoveries across your peers.',
          tasks: [
            'Host a 20-minute informal demo or lunch-and-learn showcasing your workflow.',
            'Collate team questions and safety considerations into a team FAQ.',
            'Calculate estimated hours saved across the team per month.'
          ],
          suggestedArtifact: 'Team AI Integration Playbook with sample inputs and verified outputs.'
        }
      ];

    case 'career_adaptability':
      return [
        {
          weekNumber: 1,
          theme: 'Weekly Learning Ritual',
          objective: 'Establish a sustainable, non-overwhelming routine for continuous upskilling.',
          tasks: [
            'Designate a recurring 60-90 minute calendar block dedicated exclusively to learning emerging tools.',
            'Subscribe to 2 curated, engineering/business-grounded AI newsletters (skip hype channels).',
            'Conduct a personal skill-gap self-audit to determine future role requirements.'
          ],
          suggestedArtifact: 'Personalized 90-day learning curriculum and calendar schedule.'
        },
        {
          weekNumber: 2,
          theme: 'Testing Unfamiliar Tools',
          objective: 'Break out of your tool comfort zone by adopting a new interface.',
          tasks: [
            'Explore an AI tool you have never used before (e.g. specialized coding assistant, audio transcriber, or canvas planner).',
            'Build a small experiment within 45 minutes using only the new tool documentation.',
            'Log key takeaways on what makes the interface intuitive or frustrating.'
          ],
          suggestedArtifact: 'Comparison matrix of 3 competitive AI tools in your niche.'
        },
        {
          weekNumber: 3,
          theme: 'Pivoting Value to Strategic Judgment',
          objective: 'Identify which of your unique human skills are heightened by AI automation.',
          tasks: [
            'List the soft skills, ethical sensitivities, and client relationships where human empathy is non-negotiable.',
            'Practice framing problems strategically rather than executing rote tasks.',
            'Interview a senior mentor on how technology waves have reshaped their career trajectories.'
          ],
          suggestedArtifact: 'Personal Value Proposition statement highlighting human orchestration skills.'
        },
        {
          weekNumber: 4,
          theme: 'Experimentation Journal',
          objective: 'Consolidate habits into long-term career resilience.',
          tasks: [
            'Review all experiments logged over the past month.',
            'Set 3 quarterly learning goals aligned with upcoming technological milestones.',
            'Share an encouraging review of your learning journey with a peer.'
          ],
          suggestedArtifact: 'Completed 30-Day Tech Adaptability Reflection Journal.'
        }
      ];

    case 'evidence_of_work':
    default:
      return [
        {
          weekNumber: 1,
          theme: 'Project Ideation & Problem Definition',
          objective: 'Select a real-world project that solves a genuine challenge.',
          tasks: [
            'Identify a concrete problem (e.g. automating a report, designing a dashboard, conducting market research).',
            'Write a 1-page project brief with target audience, problem statement, and success criteria.',
            'Define how AI will assist (drafting, coding, summarizing) and where your human oversight directs the outcome.'
          ],
          suggestedArtifact: 'Approved Project Proposal Brief defining scope and deliverables.'
        },
        {
          weekNumber: 2,
          theme: 'Building & Workflow Lineage',
          objective: 'Execute the project while capturing full prompt and iteration logs.',
          tasks: [
            'Build the core prototype or deliverable using AI tools collaboratively.',
            'Record the exact prompts used, challenges faced, and how hallucinations or errors were caught.',
            'Save side-by-side versions of raw AI drafts vs your finalized human-refined version.'
          ],
          suggestedArtifact: 'Working prototype or draft accompanied by raw prompt lineage documentation.'
        },
        {
          weekNumber: 3,
          theme: 'Case Study & Attribution Crafting',
          objective: 'Synthesize the project into a compelling, transparent professional narrative.',
          tasks: [
            'Write a case study following the STAR framework (Situation, Task, Action, Result).',
            'Explicitly detail your attribution: "AI contributed X, human verified and engineered Y".',
            'Include measurable outcomes (e.g. "reduced preparation time from 6 hours to 45 minutes").'
          ],
          suggestedArtifact: 'A polished, professional 2-page Case Study PDF or presentation deck.'
        },
        {
          weekNumber: 4,
          theme: 'Public Demonstration & Peer Review',
          objective: 'Publish and showcase your proof-of-work to peers or professional networks.',
          tasks: [
            'Publish your project to GitHub, LinkedIn, portfolio website, or present it to your team.',
            'Invite constructive peer feedback on the technical clarity and documentation.',
            'Add the link to your resume or LinkedIn featured section as verifiable proof of modern capability.'
          ],
          suggestedArtifact: 'Live public portfolio link showcasing the verified, AI-augmented project.'
        }
      ];
  }
}
