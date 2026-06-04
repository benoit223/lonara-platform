import {
  STRESS_RISK_THRESHOLD,
  RECOVERY_RISK_THRESHOLD,
  SLEEP_RISK_THRESHOLD,
  COGNITION_RISK_THRESHOLD,
  INFLAMMATION_RISK_THRESHOLD,
  SCORE_THRESHOLD_GOOD,
} from '@/lib/scoreThresholds'

export function generateBiologicalCorrelations(
  scores: Record<string, number>,
) {

  const correlations = []

  // STRESS + RECOVERY
  if (
    scores.stress <= STRESS_RISK_THRESHOLD &&
    scores.recovery <= RECOVERY_RISK_THRESHOLD
  ) {
    correlations.push({
      title: 'Stress-Recovery Interaction',
      text:
        'Elevated sympathetic activation appears to reduce overnight recovery efficiency and adaptive restoration capacity.',
    })
  }

  // SLEEP + COGNITION
  if (
    scores.sleep <= SLEEP_RISK_THRESHOLD &&
    scores.cognition <= COGNITION_RISK_THRESHOLD
  ) {
    correlations.push({
      title: 'Sleep-Cognition Relationship',
      text:
        'Suboptimal sleep architecture may currently impair cognitive resilience and neural restoration efficiency.',
    })
  }

  // INFLAMMATION + RECOVERY
  if (
    scores.inflammation <= INFLAMMATION_RISK_THRESHOLD &&
    scores.recovery <= RECOVERY_RISK_THRESHOLD
  ) {
    correlations.push({
      title: 'Inflammatory Load Dynamics',
      text:
        'Elevated inflammatory burden may contribute to prolonged systemic recovery demand and reduced biological resilience.',
    })
  }

  // PERFORMANCE + LONGEVITY
  if (
    scores.performance >= SCORE_THRESHOLD_GOOD &&
    scores.longevity >= SCORE_THRESHOLD_GOOD
  ) {
    correlations.push({
      title: 'Longevity Performance Stability',
      text:
        'Current biological adaptation patterns demonstrate favorable long-term resilience and performance sustainability.',
    })
  }
// Purpose & recovery
if (
  scores.purpose <= SLEEP_RISK_THRESHOLD &&
  scores.recovery <= RECOVERY_RISK_THRESHOLD
) {
  correlations.push({
    title: 'Purpose-Recovery Dynamics',
    text:
      'Reduced psychological purpose signaling may impair neuroendocrine restoration efficiency and adaptive recovery resilience.',
  })
}
// social & stress
if (
  scores.social <= STRESS_RISK_THRESHOLD &&
  scores.stress <= STRESS_RISK_THRESHOLD
) {
  correlations.push({
    title: 'Psychosocial Stress Interaction',
    text:
      'Reduced psychosocial resilience may amplify chronic stress signaling and autonomic nervous system load.',
  })
}
// mobility & longevity
if (
  scores.mobility <= RECOVERY_RISK_THRESHOLD &&
  scores.longevity <= SCORE_THRESHOLD_GOOD
) {
  correlations.push({
    title: 'Mobility-Longevity Association',
    text:
      'Reduced mobility efficiency may negatively influence long-term physiological resilience and healthy aging dynamics.',
  })
}
// family & inflammation
if (
  scores.family <= INFLAMMATION_RISK_THRESHOLD &&
  scores.inflammation <= INFLAMMATION_RISK_THRESHOLD
) {
  correlations.push({
    title: 'Familial Inflammatory Risk',
    text:
      'Familial predisposition patterns may contribute to elevated inflammatory vulnerability and long-term systemic risk.',
  })
}


  // DEFAULT
  if (correlations.length === 0) {
    correlations.push({
      title: 'Systemic Stability',
      text:
        'Biological systems currently demonstrate relatively stable adaptive interaction patterns.',
    })
  }

  return correlations.slice(0, 3)
}