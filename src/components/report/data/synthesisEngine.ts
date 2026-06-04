import {
  SCORE_THRESHOLD_EXCELLENT,
  SCORE_THRESHOLD_MODERATE,
} from '@/lib/scoreThresholds'

export function generateExecutiveSynthesis(
  data: {
    signature: any
    trajectory: any
    priorities: any[]
    longevityScore: number
    scores: Record<string, number>
  },
) {

  const topPriority =
    data.priorities?.[0]?.title ||
    'Advanced Optimization'

const lowMobility =
  data.scores.mobility < 60

const lowPurpose =
  data.scores.purpose < 60

const lowSocial =
  data.scores.social < 60

const highResilience =
  data.scores.mobility > 80 &&
  data.scores.social > 80 &&
  data.scores.purpose > 80

if (highResilience) {
  return `
Your biological profile demonstrates exceptional adaptive resilience across physical, cognitive, and psychosocial longevity domains.

Current patterns suggest highly favorable long-term healthy aging dynamics supported by strong mobility efficiency, behavioral alignment, and social resilience.

Primary strategic focus:
${topPriority}.
`
}


  if (data.longevityScore >= SCORE_THRESHOLD_EXCELLENT) {
    return `
Your biological profile demonstrates advanced adaptive resilience and highly favorable longevity dynamics.

Current optimization opportunities remain primarily focused on sustaining adaptive recovery efficiency, mobility resilience, and long-term neurocognitive stability.

Primary strategic focus:
${topPriority}.
`
  }

  if (data.longevityScore >= SCORE_THRESHOLD_MODERATE) {
    return `
Your biological systems currently demonstrate stable adaptive capacity with moderate optimization potential.

Targeted intervention strategies may substantially improve adaptive resilience, psychosocial stability, mobility efficiency, and long-term biological sustainability.

Primary strategic focus:
${topPriority}.
`
  }

  return `
Current biological patterns suggest elevated systemic recovery demand, reduced adaptive resilience, and increased long-term physiological vulnerability.

Targeted longevity interventions may significantly improve mobility resilience, neuroendocrine recovery capacity, psychosocial stability, and long-term biological sustainability.

Primary strategic focus:
${topPriority}.
`
}