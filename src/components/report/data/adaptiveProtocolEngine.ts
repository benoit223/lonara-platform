export function determineOptimizationPhase(
  scores: Record<string, number>,
) {

  const average =
    (
      scores.recovery +
      scores.sleep +
      scores.stress +
      scores.longevity
    ) / 4

  if (average >= 85) {
    return {
      phase: 'Advanced Performance',
      focus:
        'Longevity expansion and elite resilience optimization.',
    }
  }

  if (average >= 70) {
    return {
      phase: 'Optimization',
      focus:
        'Recovery enhancement and systemic resilience stabilization.',
    }
  }

  return {
    phase: 'Recovery Priority',
    focus:
      'System restoration and biological stress reduction required.',
  }
}