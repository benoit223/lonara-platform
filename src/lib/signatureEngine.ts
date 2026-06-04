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
// PURPOSE-DRIVEN RESILIENCE
// =====================================

if (
  scores.purpose > 82 &&
  scores.social > 78 &&
  scores.longevity > 75
) {
  return {
    title:
      'Purpose-Driven Resilience Profile',

    description:
      'Strong psychosocial alignment and behavioral resilience patterns support favorable neuroendocrine stability and long-term healthy aging dynamics.',

    risk:
      'Low psychosocial degeneration exposure.',

    color:
      'from-violet-400 to-fuchsia-500',
  }
}

// =====================================
// MOBILITY COMPROMISED
// =====================================

if (
  scores.mobility < 55 &&
  scores.recovery < 60
) {
  return {
    title:
      'Mobility-Compromised Longevity Profile',

    description:
      'Reduced functional mobility efficiency combined with impaired recovery capacity may negatively influence long-term physiological resilience.',

    risk:
      'Accelerated functional aging exposure.',

    color:
      'from-amber-500 to-orange-600',
  }
}
// =====================================
// SOCIAL RESILIENCE
// =====================================

if (
  scores.social > 80 &&
  scores.stress > 72 &&
  scores.sleep > 72
) {
  return {
    title:
      'Socially Resilient Adaptive Profile',

    description:
      'Strong psychosocial resilience and adaptive nervous system stability support favorable systemic longevity regulation.',

    risk:
      'Low neuroadaptive instability exposure.',

    color:
      'from-cyan-400 to-indigo-500',
  }
}
// =====================================
// FAMILIAL LONGEVITY RISK
// =====================================

if (
  scores.family < 50 &&
  scores.inflammation < 60
) {
  return {
    title:
      'Familial Longevity Vulnerability Profile',

    description:
      'Familial predisposition patterns combined with inflammatory instability may elevate long-term biological vulnerability.',

    risk:
      'Elevated age-related disease exposure.',

    color:
      'from-rose-500 to-red-600',
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