import {
  SCORE_THRESHOLD_EXCELLENT,
  SCORE_THRESHOLD_MODERATE,
} from '@/lib/scoreThresholds'

type AdaptivePhaseResult = {
  phase: string
  subtitle: string
  focus: string
  directive: string
  priorities: string[]
  biomarkers: string[]
}

export function determineOptimizationPhase(
  scores: Record<string, number>,
): AdaptivePhaseResult {

  const recovery =
    scores.recovery || 0

  const sleep =
    scores.sleep || 0

  const stress =
    scores.stress || 0

  const longevity =
    scores.longevity || 0

  /**
   * BIOLOGICAL RESILIENCE INDEX
   *
   * Recovery weighted highest because:
   * - strongest indicator of adaptive reserve
   * - foundational to longevity optimization
   * - influences systemic resilience capacity
   */

  const resilienceIndex =
    (
      recovery * 0.36 +
      sleep * 0.24 +
      longevity * 0.24 +
      stress * 0.16
    )

  /**
   * RECOVERY DEFICIT
   */

  const recoveryDeficit =
    100 - recovery

  /**
   * SYSTEMIC LOAD
   */

  const systemicLoad =
    (
      (100 - stress) * 0.45 +
      (100 - sleep) * 0.30 +
      (100 - recovery) * 0.25
    )

  /**
   * HIGH RESILIENCE PROFILE
   */

  if (
    resilienceIndex >=
    SCORE_THRESHOLD_EXCELLENT
  ) {

    return {

      phase:
        'Adaptive Systems Core',

      subtitle:
        'High Adaptive Resilience Profile',

      focus:
        'Current biomarker patterns indicate strong adaptive recovery efficiency, stable systemic resilience capacity, and elevated metabolic adaptability. Physiological recovery systems appear responsive, circadian regulation remains stable, and cellular energy dynamics support sustained cognitive and physical performance optimization. Current biological conditions favor long-term resilience expansion, performance preservation, and advanced longevity optimization strategies.',

      directive:
        'Maintain systemic recovery efficiency while progressively expanding resilience and longevity capacity.',

      priorities: [

        'Advanced mitochondrial resilience support',

        'Performance preservation and recovery efficiency maintenance',

        'Circadian synchronization optimization',

        'Long-term cognitive resilience amplification',
      ],

      biomarkers: [

        'Strong adaptive recovery profile',

        'Stable systemic stress regulation',

        'Elevated metabolic resilience',

        'Optimized recovery-to-stress ratio',
      ],
    }
  }

  /**
   * MODERATE RESILIENCE PROFILE
   */

  if (
    resilienceIndex >=
    SCORE_THRESHOLD_MODERATE
  ) {

    return {

      phase:
        'Adaptive Systems Core',

      subtitle:
        'Recovery-Dominant Biological Pattern',

      focus:
        'Current biological patterns indicate moderate adaptive stress accumulation, reduced recovery efficiency, and elevated systemic recovery demand. Biomarker distribution suggests partial circadian disruption, reduced resilience reserve capacity, and increased mitochondrial recovery requirements. While foundational recovery systems remain functional, current adaptive capacity appears moderately constrained under cumulative physiological stress exposure. Optimization priorities should emphasize systemic stabilization before introducing advanced performance amplification protocols.',

      directive:
        'Restore adaptive recovery capacity before increasing metabolic and cognitive performance demand.',

      priorities: [

        'Recovery stabilization and resilience restoration',

        'Sleep architecture optimization',

        'Mitochondrial recovery support',

        'Stress-load reduction and autonomic regulation',
      ],

      biomarkers: [

        'Moderate adaptive recovery deficit',

        'Elevated cumulative stress load',

        'Reduced resilience reserve capacity',

        'Suboptimal circadian recovery efficiency',
      ],
    }
  }

  /**
   * RESTORATION PROFILE
   */

  return {

    phase:
      'Adaptive Systems Core',

    subtitle:
      'Systemic Restoration State',

    focus:
      'Biological resilience markers indicate elevated systemic stress burden, impaired adaptive recovery efficiency, and reduced physiological reserve capacity. Current biomarker distribution suggests sustained recovery deficit, increased inflammatory recovery demand, and compromised resilience stabilization. Recovery architecture appears insufficient to fully compensate for cumulative biological stress exposure, increasing the need for systemic restoration protocols focused on sleep recovery, inflammatory regulation, metabolic stabilization, and cellular repair support.',

    directive:
      'Prioritize biological restoration and recovery stabilization before introducing performance amplification strategies.',

    priorities: [

      'Systemic recovery restoration',

      'Inflammatory and stress-load reduction',

      'Circadian recovery stabilization',

      'Cellular recovery and mitochondrial support',
    ],

    biomarkers: [

      'Elevated systemic recovery demand',

      'Reduced adaptive resilience capacity',

      'High cumulative biological stress load',

      'Compromised recovery-to-stress equilibrium',
    ],
  }
}