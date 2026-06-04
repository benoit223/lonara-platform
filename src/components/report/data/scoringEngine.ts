import { generateAIInsights } from './insightEngine'
import { generatePriorityFocus } from './priorityEngine'
import { generateBiologicalCorrelations } from './correlationEngine'
import { generateTrajectory } from './trajectoryEngine'

import { generateNarrativeTone } from './narrativeEngine'
import { generateExecutiveSynthesis } from './synthesisEngine'
import {
  analyzeBiomarkers,
  generateDynamicBiomarkers,
} from './biomarkerEngine'
import { determineOptimizationPhase } from './adaptiveProtocolEngine'
import { generateRiskModel } from './riskEngine'
import {
  SCORE_THRESHOLD_GOOD,
  SCORE_THRESHOLD_EXCELLENT,
  SCORE_THRESHOLD_MODERATE,
  SCORE_THRESHOLD_COMPROMISED,
} from '@/lib/scoreThresholds'
import {
  calculateBiologicalAge,
  calculatePercentile,
  generatePriorities,
  generateRisks,
} from '@/lib/longevityEngine'

export function generateLongevityReport(data: any) {
 const longevityScore =
  data.advancedScores
    ?.longevityTrajectory
  ?? data.scores.longevity

  const biologicalAge =
    calculateBiologicalAge(
      data.user.age,
      {
        longevity: longevityScore,
        performance: data.scores.performance,
        stress: data.scores.stress,
        cognition: data.scores.cognition,
        recovery: data.scores.recovery,
        inflammation: data.scores.inflammation,
        skin: data.scores.skin,
        sleep: data.scores.sleep,
        family:
  data.scores.family,

purpose:
  data.scores.purpose,
mobility: data.scores.mobility,
social: data.scores.social,
      },
 data.user.weight,
  data.user.height,

    )

 const basePercentile =
  calculatePercentile(
    longevityScore
  )

const integrityFactor =
  (
    data.psychometric
      ?.coherence ?? 100
  ) / 100

const percentile =
  Math.round(
    basePercentile *
    integrityFactor
  )

  const signature =
  determineBiologicalSignature({
    ...data.scores,
    ...data.advancedScores,
  })

  const insights =
  generateAIInsights({
    ...data.scores,
    ...data.advancedScores,
  })

  const priorities = data.priorities?.length
    ? data.priorities
    : generatePriorities({
  longevity: longevityScore,

  performance:
    data.scores.performance,

  stress:
    data.scores.stress,

exercise:
  data.scores.exercise,

  cognition:
    data.scores.cognition,

  recovery:
    data.scores.recovery,

  inflammation:
    data.scores.inflammation,

  skin:
    data.scores.skin,

  sleep:
    data.scores.sleep,

  mobility:
    data.scores.mobility,

  social:
    data.scores.social,

  family:
    data.scores.family,

  purpose:
    data.scores.purpose,

    energy:
  data.scores.energy,

nutrition:
  data.scores.nutrition,

})

 const correlations =
  generateBiologicalCorrelations({
    ...data.scores,
    ...data.advancedScores,
  })
  const trajectory =
  generateTrajectory({
    ...data.scores,
    ...data.advancedScores,
  })

  const narrative =
    generateNarrativeTone(signature.title)

  const synthesis =
    generateExecutiveSynthesis({
      signature,
      trajectory,
      priorities,
      longevityScore,
      scores: {
  ...data.scores,
  ...data.advancedScores,
},
    })

  const biomarkerData =
    generateDynamicBiomarkers(data.scores)

  const biomarkers =
    analyzeBiomarkers(biomarkerData)

const adaptivePhase =
  determineOptimizationPhase({
    ...data.scores,
    ...data.advancedScores,
  })

  const risks = data.risks?.length
    ? data.risks
    : generateRisks({
        longevity: longevityScore,
        performance: data.scores.performance,
        stress: data.scores.stress,
        exercise: data.scores.exercise,
        cognition: data.scores.cognition,
        recovery: data.scores.recovery,
        inflammation: data.scores.inflammation,
        skin: data.scores.skin,
        sleep: data.scores.sleep,
        purpose: data.scores.purpose,
        energy: data.scores.energy,
        nutrition: data.scores.nutrition,
        family: data.scores.family,
        social: data.scores.social,
        mobility: data.scores.mobility,
      })

  return {
    longevityScore,
    biologicalAge,
    percentile,
    signature,
    narrative,
    synthesis,
    biomarkers,
    adaptivePhase,
    risks,
    insights,
    priorities,
    correlations,
    trajectory,
   products: data.recommendations || [],

protocolProducts:
  data.protocolProducts || [],

lifestyleProducts:
  data.lifestyleProducts || [],

ingredientOverlaps:
  data.ingredientOverlaps,
    psychometric: data.psychometric,
    signalIntegrity: data.psychometric?.coherence ?? null,
    user: data.user,
   memberType:
  data.user?.memberType || 'guest',
    scores: {
  ...data.scores,
  ...data.advancedScores,
},
    protocols: data.protocols,
    demographics: {
      age: data.user?.age,
      sex: data.user?.sex,
      weight: data.user?.weight,
      height: data.user?.height,
    },
  }
}

function resilienceBonus(
  data: any,
  longevityScore: number,
) {
  let bonus = 0

  if (data.scores.sleep >= SCORE_THRESHOLD_GOOD)
    bonus += 4

  if (data.scores.recovery >= SCORE_THRESHOLD_GOOD)
    bonus += 5

  if (data.scores.stress >= 75)
    bonus += 4

  if (longevityScore >= SCORE_THRESHOLD_EXCELLENT)
    bonus += 6

  return bonus
}

function determineBiologicalSignature(
  scores: Record<string, number>,
) {
  if (
    scores.performance >= SCORE_THRESHOLD_GOOD &&
    scores.recovery >= 75 &&
    scores.stress >= SCORE_THRESHOLD_MODERATE
  ) {
    return {
      title: 'The Adaptive Strategist',
      description:
        'Strong adaptive resilience with favorable recovery dynamics and elevated cognitive stability.',
    }
  }

  if (
    scores.stress <= SCORE_THRESHOLD_COMPROMISED &&
    scores.sleep <= 60
  ) {
    return {
      title: 'The Recovery-Depleted Executive',
      description:
        'Chronic recovery load accumulation with partial autonomic imbalance patterns.',
    }
  }

  if (
    scores.longevity >= SCORE_THRESHOLD_EXCELLENT &&
    scores.wellness >= SCORE_THRESHOLD_GOOD
  ) {
    return {
      title: 'The Balanced Optimizer',
      description:
        'Stable systemic balance with favorable long-term longevity adaptation potential.',
    }
  }
if (
  scores.purpose >= 82 &&
  scores.social >= 78 &&
  scores.longevity >= 75
) {
  return {
    title:
      'The Purpose-Driven Optimizer',

    description:
      'Strong psychosocial alignment and adaptive behavioral resilience support favorable long-term healthy aging dynamics.',
  }
}

if (
  scores.mobility <= 55 &&
  scores.recovery <= 60
) {
  return {
    title:
      'The Mobility-Compromised Profile',

    description:
      'Reduced functional mobility efficiency combined with impaired recovery capacity may negatively influence long-term physiological resilience.',
  }
}

if (
  scores.social >= 80 &&
  scores.sleep >= 72 &&
  scores.stress >= 72
) {
  return {
    title:
      'The Socially Resilient Profile',

    description:
      'Strong psychosocial resilience and adaptive nervous system stability support favorable systemic longevity regulation.',
  }
}

if (
  scores.family <= 50 &&
  scores.inflammation <= 60
) {
  return {
    title:
      'The Familial Longevity Risk Profile',

    description:
      'Familial predisposition patterns combined with inflammatory instability may elevate long-term biological vulnerability.',
  }
}


  return {
    title: 'The Resilient Performer',
    description:
      'High-performance biological profile with elevated stress compensation capacity.',
  }
}
