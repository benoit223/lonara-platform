export function generateBiologicalCorrelations(
  scores: Record<string, number>,
) {

  const correlations = []

  // STRESS + RECOVERY
  if (
    scores.stress <= 65 &&
    scores.recovery <= 70
  ) {
    correlations.push({
      title: 'Stress-Recovery Interaction',
      text:
        'Elevated sympathetic activation appears to reduce overnight recovery efficiency and adaptive restoration capacity.',
    })
  }

  // SLEEP + COGNITION
  if (
    scores.sleep <= 70 &&
    scores.cognition <= 70
  ) {
    correlations.push({
      title: 'Sleep-Cognition Relationship',
      text:
        'Suboptimal sleep architecture may currently impair cognitive resilience and neural restoration efficiency.',
    })
  }

  // INFLAMMATION + RECOVERY
  if (
    scores.inflammation <= 65 &&
    scores.recovery <= 70
  ) {
    correlations.push({
      title: 'Inflammatory Load Dynamics',
      text:
        'Elevated inflammatory burden may contribute to prolonged systemic recovery demand and reduced biological resilience.',
    })
  }

  // PERFORMANCE + LONGEVITY
  if (
    scores.performance >= 80 &&
    scores.longevity >= 80
  ) {
    correlations.push({
      title: 'Longevity Performance Stability',
      text:
        'Current biological adaptation patterns demonstrate favorable long-term resilience and performance sustainability.',
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