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
      ? 12
      : bmi > 27
      ? 7
      : bmi < 18.5
      ? 5
      : 0

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
          scores.longevity * 0.14 +
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
          scores.emotional * 0.22 +
          scores.cognition * 0.16 +
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
          scores.longevity * 0.14 +
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
          scores.energy * 0.10,
      ),
    ),
  )

  // =========================================
  // LONGEVITY TRAJECTORY
  // =========================================

  const longevityTrajectory = Math.max(
    18,
    Math.min(
      99,
      Math.round(
        scores.longevity * 0.24 +
          scores.metabolism * 0.16 +
          scores.exercise * 0.14 +
          scores.recovery * 0.14 +
          scores.sleep * 0.12 +
          scores.stress * 0.10 +
          scores.inflammation * 0.10 -
          age * 0.12 -
          bmiPenalty,
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