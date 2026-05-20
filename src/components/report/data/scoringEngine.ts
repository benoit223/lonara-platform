import { generateAIInsights } from './insightEngine'
import { generatePriorityFocus } from './priorityEngine'
import { generateBiologicalCorrelations } from './correlationEngine'
import { generateTrajectory } from './trajectoryEngine'
import { generateProductRecommendations } from './productEngine'
import { generateNarrativeTone } from './narrativeEngine'
import { generateExecutiveSynthesis } from './synthesisEngine'
import { analyzeBiomarkers } from './biomarkerEngine'
import { determineOptimizationPhase } from './adaptiveProtocolEngine'
import { generateRiskModel } from './riskEngine'
import {
  calculateBiologicalAge,
  calculatePercentile,
  generatePriorities,
  generateRisks,
  recommendProducts,
} from '@/lib/longevityEngine'


export function generateLongevityReport(data: any) {

  const categoryScores =
    Object.values(data.scores)

  const averageScore =
    categoryScores.reduce(
      (acc: number, val: any) => acc + val,
      0,
    ) / categoryScores.length

  const longevityScore =
    Math.round(
      averageScore * 0.92 +
      resilienceBonus(data),
    )

const biologicalAge =
  calculateBiologicalAge(
    data.user.age,
    {
      longevity: longevityScore,

      performance:
        data.scores.performance,

      stress:
        data.scores.stress,

      cognition:
        data.scores.cognition,

      recovery:
        data.scores.recovery,

      inflammation:
        data.scores.inflammation,
    },
  )

const percentile =
  calculatePercentile(
    longevityScore,
  )

  const signature =
    determineBiologicalSignature(
      data.scores,
    )
const insights =
  generateAIInsights(data.scores)

const priorities =
  generatePriorities({
    longevity: longevityScore,

    performance:
      data.scores.performance,

    stress:
      data.scores.stress,

    cognition:
      data.scores.cognition,

    recovery:
      data.scores.recovery,

    inflammation:
      data.scores.inflammation,
  })

const correlations =
  generateBiologicalCorrelations(
    data.scores,
  )
const trajectory =
  generateTrajectory(data.scores)

const products =
  recommendProducts({
    longevity: longevityScore,

    performance:
      data.scores.performance,

    stress:
      data.scores.stress,

    cognition:
      data.scores.cognition,

    recovery:
      data.scores.recovery,

    inflammation:
      data.scores.inflammation,
  })
const narrative =
  generateNarrativeTone(
    signature.title,
  )
const synthesis =
  generateExecutiveSynthesis({
    signature,
    trajectory,
    priorities,
    longevityScore,
  })

  const biomarkers =
  analyzeBiomarkers(
    [
      {
        id: 'crp',
        label: 'hs-CRP',
        value: 2.4,
        unit: 'mg/L',
        optimalMin: 0,
        optimalMax: 1,
        category: 'Inflammation',
        impact: 'High',
      },

      {
        id: 'hba1c',
        label: 'HbA1c',
        value: 5.7,
        unit: '%',
        optimalMin: 4.8,
        optimalMax: 5.3,
        category: 'Metabolic',
        impact: 'Moderate',
      },

      {
        id: 'vitd',
        label: 'Vitamin D',
        value: 28,
        unit: 'ng/mL',
        optimalMin: 40,
        optimalMax: 70,
        category: 'Longevity',
        impact: 'Moderate',
      },
    ],
  )
  const adaptivePhase =
  determineOptimizationPhase(
    data.scores,
  )
const risks =
  generateRisks({
    longevity: longevityScore,

    performance:
      data.scores.performance,

    stress:
      data.scores.stress,

    cognition:
      data.scores.cognition,

    recovery:
      data.scores.recovery,

    inflammation:
      data.scores.inflammation,
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
  products,
user: data.user,

  scores: data.scores,
  protocols: data.protocols,
  

demographics: {
  age: data.user?.age,
  sex: data.user?.sex,
  weight: data.user?.weight,
  height: data.user?.height,
},
}
}

function resilienceBonus(data: any) {

  let bonus = 0

  if (data.scores.sleep >= 80)
    bonus += 4

  if (data.scores.recovery >= 80)
    bonus += 5

  if (data.scores.stress >= 75)
    bonus += 4

  if (data.scores.longevity >= 85)
    bonus += 6

  return bonus
}



function determineBiologicalSignature(
  scores: Record<string, number>,
) {

  if (
    scores.performance >= 80 &&
    scores.recovery >= 75 &&
    scores.stress >= 70
  ) {
    return {
      title: 'The Adaptive Strategist',
      description:
        'Strong adaptive resilience with favorable recovery dynamics and elevated cognitive stability.',
    }
  }

  if (
    scores.stress <= 55 &&
    scores.sleep <= 60
  ) {
    return {
      title:
        'The Recovery-Depleted Executive',
      description:
        'Chronic recovery load accumulation with partial autonomic imbalance patterns.',
    }
  }

  if (
    scores.longevity >= 85 &&
    scores.wellness >= 80
  ) {
    return {
      title: 'The Balanced Optimizer',
      description:
        'Stable systemic balance with favorable long-term longevity adaptation potential.',
    }
  }

  return {
    title: 'The Resilient Performer',
    description:
      'High-performance biological profile with elevated stress compensation capacity.',
  }
}