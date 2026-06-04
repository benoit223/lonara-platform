// /lib/advancedScoring.ts

export type AdvancedScores = {
  biologicalCoherence: number
  neuralStability: number
  adaptiveCapacity: number
  inflammationBurden: number
  mitochondrialEfficiency: number
  longevityTrajectory: number
  recoveryReserve: number
  stressLoad: number
  physiologicalAgeFactor: number
}

type Inputs = {
  scores: Record<string, number>
  age: number
  sex: string
  weight: number
  height: number
  completionTime: number
}

function average(values: number[]) {
  return (
    values.reduce((a, b) => a + b, 0) /
    values.length
  )
}

export function generateAdvancedScores({
  scores,
  age,
  sex,
  weight,
  height,
  completionTime,
}: Inputs): AdvancedScores {
  const bmi =
    weight / ((height / 100) ** 2)

 const bmiPenalty =
  bmi > 30
    ? 8
    : bmi > 27
    ? 5
    : bmi > 25
    ? 2
    : bmi < 18.5
    ? 4
    : 0

const physiology =
  average([
    scores.inflammation,
    scores.metabolism,
    scores.cardiovascular,
    scores.immune,
    scores.recovery,
    scores.aging,
    scores.hormonal,
    scores.sexual,
    scores.skin,
  ])

const lifestyle =
  average([
    scores.exercise,
    scores.sleep,
    scores.circadian,
    scores.nutrition,
    scores.detox,
    scores.lifestyle,
    scores.mobility,
  ])

const mental =
  average([
    scores.stress,
    scores.emotional,
    scores.resilience,
    scores.cognition,
    scores.social,
    scores.purpose,
  ])

const environmentScore =
  average([
    scores.environment,
    scores.family,
  ])

let bmiScore = 72

if (bmi >= 18.5 && bmi <= 24.9) {
  bmiScore = 96
}

else if (bmi >= 25 && bmi <= 29.9) {
  bmiScore = 78
}

else if (bmi >= 30) {
  bmiScore = 58
}

const foundation =
  average([
    bmiScore,
  ])

  // =========================================
  // BIOLOGICAL COHERENCE
  // =========================================

  const biologicalCoherence = Math.max(
    38,
    Math.min(
      98,
      Math.round(
        scores.recovery * 0.18 +
          scores.sleep * 0.16 +
          scores.stress * 0.18 +
          scores.cognition * 0.12 +
          scores.mobility * 0.14 +
          scores.resilience * 0.12 +
          scores.emotional * 0.10 -
          bmiPenalty,
      ),
    ),
  )

  // =========================================
  // NEURAL STABILITY
  // =========================================

  const neuralStability = Math.max(
    28,
    Math.min(
      99,
      Math.round(
        scores.sleep * 0.24 +
          scores.stress * 0.28 +
          scores.emotional * 0.14 +
          scores.cognition * 0.16 +
          scores.social * 0.06 + 
          scores.purpose * 0.06 +
          scores.recovery * 0.10,
      ),
    ),
  )

  // =========================================
  // MITOCHONDRIAL EFFICIENCY
  // =========================================

  const mitochondrialEfficiency = Math.max(
    22,
    Math.min(
      98,
      Math.round(
        scores.energy * 0.42 +
          scores.metabolism * 0.24 +
          scores.exercise * 0.18 +
          scores.recovery * 0.16,
      ),
    ),
  )

  // =========================================
  // STRESS LOAD
  // =========================================

  const stressLoad = Math.max(
    8,
    Math.min(
      98,
      Math.round(
        100 -
          (
            scores.stress * 0.45 +
            scores.sleep * 0.20 +
            scores.recovery * 0.20 +
            scores.emotional * 0.15
          ),
      ),
    ),
  )

  // =========================================
  // ADAPTIVE CAPACITY
  // =========================================

  const adaptiveCapacity = Math.max(
    30,
    Math.min(
      99,
      Math.round(
        scores.recovery * 0.22 +
          scores.exercise * 0.18 +
          scores.nutrition * 0.18 +
          scores.sleep * 0.14 +
          scores.mobility * 0.14 +
          scores.resilience * 0.14,
      ),
    ),
  )

  // =========================================
  // INFLAMMATION BURDEN
  // =========================================

  const inflammationBurden = Math.max(
    10,
    Math.min(
      95,
      Math.round(
        100 -
          (
            scores.inflammation * 0.42 +
            scores.gut * 0.18 +
            scores.sleep * 0.14 +
            scores.recovery * 0.14 +
            scores.stress * 0.12
          ),
      ),
    ),
  )

  // =========================================
  // RECOVERY RESERVE
  // =========================================

  const recoveryReserve = Math.max(
    20,
    Math.min(
      99,
      Math.round(
        scores.recovery * 0.34 +
          scores.sleep * 0.26 +
          scores.exercise * 0.18 +
          scores.nutrition * 0.12 +
          scores.energy * 0.05 +
scores.mobility * 0.05,
      ),
    ),
  )

  // =========================================
  // LONGEVITY TRAJECTORY
  // =========================================

const rawLongevity =
(
  physiology * 0.27 +

  lifestyle * 0.32 +

  mental * 0.22 +

  environmentScore * 0.09 +

  scores.family * 0.05 +

  foundation * 0.05
)

const longevityTrajectory =
  Math.max(
    35,
    Math.min(
      99,
      Math.round(
        rawLongevity -
        bmiPenalty -
        age * 0.05
      ),
    ),
  )

  // =========================================
  // PHYSIOLOGICAL AGE FACTOR
  // =========================================

  let physiologicalAgeFactor = 0

  physiologicalAgeFactor +=
    (100 - scores.sleep) * 0.08

  physiologicalAgeFactor +=
    (100 - scores.recovery) * 0.12

  physiologicalAgeFactor +=
    (100 - scores.inflammation) * 0.10

  physiologicalAgeFactor +=
    (100 - scores.stress) * 0.08

  physiologicalAgeFactor += bmiPenalty

  if (completionTime < 240) {
    physiologicalAgeFactor += 4
  }

  physiologicalAgeFactor = Math.round(
    physiologicalAgeFactor,
  )

  // =========================================
  // SEX MODIFIERS
  // =========================================

  let adjustedRecoveryReserve =
    recoveryReserve

  let adjustedAdaptiveCapacity =
    adaptiveCapacity

  if (sex.toLowerCase() === 'male') {
    adjustedRecoveryReserve -= 1
  }

  if (sex.toLowerCase() === 'female') {
    adjustedAdaptiveCapacity += 1
  }

  return {
    biologicalCoherence,
    neuralStability,
    adaptiveCapacity:
      adjustedAdaptiveCapacity,
    inflammationBurden,
    mitochondrialEfficiency,
    longevityTrajectory,
    recoveryReserve:
      adjustedRecoveryReserve,
    stressLoad,
    physiologicalAgeFactor,
  }
}