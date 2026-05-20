// /lib/signatureEngine.ts

export function generateBiologicalSignature(
  scores: Record<string, number>,
) {

  // =====================================
  // ELITE RECOVERY
  // =====================================

  if (
    scores.recovery > 82 &&
    scores.sleep > 80 &&
    scores.longevity > 78
  ) {
    return {
      title:
        'Elite Adaptive Recovery Profile',

      description:
        'Exceptional regenerative resilience and optimized recovery architecture detected across multiple physiological systems.',

      risk:
        'Low systemic degeneration exposure.',

      color:
        'from-emerald-400 to-cyan-400',
    }
  }

  // =====================================
  // HIGH PERFORMANCE DYSREGULATION
  // =====================================

  if (
    scores.energy > 80 &&
    scores.exercise > 75 &&
    scores.stress < 55
  ) {
    return {
      title:
        'High Performance Dysregulation Pattern',

      description:
        'Elevated performance output combined with early nervous system overload signatures and incomplete regenerative compensation.',

      risk:
        'Elevated burnout exposure risk.',

      color:
        'from-orange-400 to-red-400',
    }
  }

  // =====================================
  // NEURO INFLAMMATORY
  // =====================================

  if (
    scores.inflammation < 55 &&
    scores.cognition < 60 &&
    scores.recovery < 60
  ) {
    return {
      title:
        'Neuro-Inflammatory Signature',

      description:
        'Patterns indicate elevated inflammatory burden associated with cognitive fatigue and impaired systemic recovery.',

      risk:
        'Accelerated physiological aging exposure.',

      color:
        'from-red-500 to-pink-500',
    }
  }

  // =====================================
  // CHRONIC STRESS
  // =====================================

  if (
    scores.stress < 50 &&
    scores.sleep < 55
  ) {
    return {
      title:
        'Chronic Stress Compensation Profile',

      description:
        'Persistent sympathetic nervous system activation detected with impaired circadian restoration capacity.',

      risk:
        'Long-term nervous system dysregulation.',

      color:
        'from-amber-400 to-orange-500',
    }
  }

  // =====================================
  // DEFAULT
  // =====================================

  return {
    title:
      'Adaptive Biological Profile',

    description:
      'Stable systemic resilience with moderate optimization potential and adaptive recovery capacity.',

    risk:
      'Moderate physiological optimization opportunity.',

    color:
      'from-cyan-400 to-blue-500',
  }
}