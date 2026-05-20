export function generateRiskModel(
  scores: Record<string, number>,
) {

  const risks = []

  if (scores.stress <= 65) {
    risks.push({
      label: 'Neuroadaptive Stress Load',
      severity: 'Elevated',
    })
  }

  if (scores.sleep <= 70) {
    risks.push({
      label: 'Circadian Recovery Instability',
      severity: 'Moderate',
    })
  }

  if (scores.inflammation <= 65) {
    risks.push({
      label: 'Inflammatory Acceleration',
      severity: 'Elevated',
    })
  }

  if (scores.longevity <= 70) {
    risks.push({
      label: 'Longevity Resilience Decline',
      severity: 'Moderate',
    })
  }

  if (risks.length === 0) {
    risks.push({
      label: 'No major resilience instability detected',
      severity: 'Low',
    })
  }

  return risks.slice(0, 4)
}