import { DEFAULT_SCORE_BANDS, DIMENSIONS } from '../config/defaultConfigs';
import { ASSESSMENT_QUESTIONS } from '../config/questions';
import { AssessmentConfig, AssessmentQuestion, DimensionId, DimensionScore, ScoreBand } from '../types/assessment';

export interface ScoringResult {
  dimensionScores: Record<DimensionId, DimensionScore>;
  overallScore: number;
  readinessBand: string;
  bandMeta: ScoreBand;
  scoringVersion: string;
  assessmentVersion: string;
  highestDimension: DimensionId;
  lowestDimension: DimensionId;
}

/**
 * Deterministically computes normalized dimension scores and weighted overall score.
 */
export function calculateAssessmentScore(
  responses: Record<string, string | number>,
  config: AssessmentConfig,
  questions: AssessmentQuestion[] = ASSESSMENT_QUESTIONS
): ScoringResult {
  const dimensionGroups: Record<DimensionId, { totalWeightedPoints: number; totalWeight: number }> = {
    ai_literacy: { totalWeightedPoints: 0, totalWeight: 0 },
    tool_fluency: { totalWeightedPoints: 0, totalWeight: 0 },
    domain_application: { totalWeightedPoints: 0, totalWeight: 0 },
    career_adaptability: { totalWeightedPoints: 0, totalWeight: 0 },
    evidence_of_work: { totalWeightedPoints: 0, totalWeight: 0 }
  };

  questions.forEach((q) => {
    if (!q.active) return;
    const answerId = responses[q.id];
    let selectedScore = 0;

    if (answerId !== undefined && answerId !== null) {
      const option = q.options.find((opt) => opt.id === String(answerId));
      if (option) {
        selectedScore = option.score;
      } else if (typeof answerId === 'number') {
        selectedScore = Math.min(100, Math.max(0, answerId));
      }
    }

    const weight = q.weight || 1.0;
    if (dimensionGroups[q.dimension]) {
      dimensionGroups[q.dimension].totalWeightedPoints += selectedScore * weight;
      dimensionGroups[q.dimension].totalWeight += 100 * weight;
    }
  });

  const dimensionScores = {} as Record<DimensionId, DimensionScore>;

  DIMENSIONS.forEach((dim) => {
    const group = dimensionGroups[dim.id];
    const normalizedScore = group.totalWeight > 0 
      ? Math.round((group.totalWeightedPoints / group.totalWeight) * 100)
      : 0;
    
    const band = getBandForScore(normalizedScore, config.scoreBands);

    dimensionScores[dim.id] = {
      dimensionId: dim.id,
      dimensionName: dim.name,
      score: normalizedScore,
      rawScore: Math.round(group.totalWeightedPoints),
      maxScore: Math.round(group.totalWeight),
      band: band.label
    };
  });

  // Calculate overall weighted score
  const weights = config.dimensionWeights;
  let totalWeightedScore = 0;
  let sumOfWeights = 0;

  (Object.keys(dimensionScores) as DimensionId[]).forEach((dimId) => {
    const dimWeight = weights[dimId] ?? 0.20;
    totalWeightedScore += dimensionScores[dimId].score * dimWeight;
    sumOfWeights += dimWeight;
  });

  const overallScore = sumOfWeights > 0 
    ? Math.round(totalWeightedScore / sumOfWeights)
    : 0;

  const overallBand = getBandForScore(overallScore, config.scoreBands);

  // Find lowest and highest dimensions
  let highestDimension: DimensionId = 'ai_literacy';
  let lowestDimension: DimensionId = 'ai_literacy';
  let maxVal = -1;
  let minVal = 999;

  (Object.keys(dimensionScores) as DimensionId[]).forEach((dimId) => {
    const s = dimensionScores[dimId].score;
    if (s > maxVal) {
      maxVal = s;
      highestDimension = dimId;
    }
    if (s < minVal) {
      minVal = s;
      lowestDimension = dimId;
    }
  });

  return {
    dimensionScores,
    overallScore,
    readinessBand: overallBand.label,
    bandMeta: overallBand,
    scoringVersion: config.scoringVersion || 'score-v1.0',
    assessmentVersion: config.assessmentVersion || 'v1.0.0',
    highestDimension,
    lowestDimension
  };
}

export function getBandForScore(score: number, bands: ScoreBand[] = DEFAULT_SCORE_BANDS): ScoreBand {
  const matched = bands.find((b) => score >= b.min && score <= b.max);
  if (matched) return matched;
  return bands[bands.length - 1] || {
    min: 0,
    max: 100,
    label: 'Standard',
    summary: 'Assessment complete.',
    badgeColor: 'bg-slate-700 text-slate-200'
  };
}
