import { products } from './products'

export interface QuizAnswers {
  sleep: number
  stress: number
  cognition: number
  exercise: number
  recovery: number
  nutrition: number
  energy: number
  inflammation: number
}

export interface LongevityScores {
  performance: number
  stress: number
  cognition: number
  recovery: number
  inflammation: number
  longevity: number
}

function clamp(
  value: number,
  min = 0,
  max = 100,
) {
  return Math.max(
    min,
    Math.min(max, value),
  )
}

export function calculateLongevityScores(
  answers: QuizAnswers,
): LongevityScores {
  const performance = clamp(
    answers.exercise * 0.35 +
      answers.energy * 0.4 +
      answers.nutrition * 0.25,
  )

  const stress = clamp(
    100 -
      answers.stress * 0.6 +
      answers.sleep * 0.2,
  )

  const cognition = clamp(
    answers.cognition * 0.5 +
      answers.sleep * 0.2 +
      answers.energy * 0.3,
  )

  const recovery = clamp(
    answers.sleep * 0.45 +
      answers.recovery * 0.35 +
      answers.nutrition * 0.2,
  )

  const inflammation = clamp(
    100 -
      answers.inflammation * 0.7 +
      answers.nutrition * 0.2,
  )

  const longevity = clamp(
    performance * 0.2 +
      stress * 0.2 +
      cognition * 0.2 +
      recovery * 0.2 +
      inflammation * 0.2,
  )

  return {
    performance: Math.round(performance),
    stress: Math.round(stress),
    cognition: Math.round(cognition),
    recovery: Math.round(recovery),
    inflammation: Math.round(inflammation),
    longevity: Math.round(longevity),
  }
}

export function calculateBiologicalAge(
  chronologicalAge: number,
  scores: LongevityScores,
) {
  const longevityDelta =
    (scores.longevity - 50) / 12

  const recoveryDelta =
    (scores.recovery - 50) / 18

  const inflammationDelta =
    (50 - scores.inflammation) / 10

  const biologicalAge =
    chronologicalAge -
    longevityDelta -
    recoveryDelta +
    inflammationDelta

  return (
    Math.round(biologicalAge * 10) / 10
  )
}

export function calculatePercentile(
  score: number,
) {
  return clamp(
    Math.round((score / 100) * 100),
  )
}

export function generatePriorities(
  scores: LongevityScores,
) {
  const systems = [
    {
      key: 'stress',
      value: scores.stress,
      title: 'Stress Regulation',
    },

    {
      key: 'recovery',
      value: scores.recovery,
      title: 'Recovery Capacity',
    },

    {
      key: 'inflammation',
      value: scores.inflammation,
      title: 'Inflammation Load',
    },

    {
      key: 'cognition',
      value: scores.cognition,
      title: 'Cognitive Performance',
    },
  ]

  return systems
    .sort((a, b) => a.value - b.value)
    .slice(0, 3)
    .map((system) => ({
      title: system.title,

      impact:
        system.value < 45
          ? 'High'
          : system.value < 70
          ? 'Moderate'
          : 'Low',

      severity:
        system.value < 45
          ? 'critical'
          : system.value < 70
          ? 'moderate'
          : 'low',
    }))
}

export function generateRisks(
  scores: LongevityScores,
) {
  const risks = []

  if (scores.stress < 55) {
    risks.push({
      label:
        'Autonomic Stress Accumulation',
      severity: 'Elevated',
    })
  }

  if (scores.recovery < 55) {
    risks.push({
      label:
        'Suboptimal Recovery Capacity',
      severity: 'Moderate',
    })
  }

  if (scores.inflammation < 60) {
    risks.push({
      label:
        'Inflammatory Load Elevation',
      severity: 'Elevated',
    })
  }

  return risks
}

export function recommendProducts(
  scores: LongevityScores,
) {
  return products.filter((product) => {
    return product.scoreTargets.some(
      (target) => {
        const value =
          scores[
            target as keyof LongevityScores
          ]

        return value < 70
      },
    )
  })
}