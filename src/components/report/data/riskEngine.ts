import {
  STRESS_RISK_THRESHOLD,
  SLEEP_RISK_THRESHOLD,
  INFLAMMATION_RISK_THRESHOLD,
  LONGEVITY_RISK_THRESHOLD,
} from '@/lib/scoreThresholds'

export function generateRiskModel(
  scores: Record<string, number>,
) {

  const risks = []

  if (scores.stress <= STRESS_RISK_THRESHOLD) {
    risks.push({
      label: 'Neuroadaptive Stress Load',
      severity: 'Elevated',
    })
  }

  if (scores.sleep <= SLEEP_RISK_THRESHOLD) {
    risks.push({
      label: 'Circadian Recovery Instability',
      severity: 'Moderate',
    })
  }

  if (scores.inflammation <= INFLAMMATION_RISK_THRESHOLD) {
    risks.push({
      label: 'Inflammatory Acceleration',
      severity: 'Elevated',
    })
  }

  if (scores.longevity <= LONGEVITY_RISK_THRESHOLD) {
    risks.push({
      label: 'Longevity Resilience Decline',
      severity: 'Moderate',
    })
  }

if (scores.mobility <= SLEEP_RISK_THRESHOLD) {
  risks.push({
    label: 'Mobility Decline Vulnerability',
    severity: 'Moderate',
  })
}
if (scores.social <= STRESS_RISK_THRESHOLD) {
  risks.push({
    label: 'Psychosocial Resilience Instability',
    severity: 'Moderate',
  })
}
if (scores.purpose <= SLEEP_RISK_THRESHOLD) {
  risks.push({
    label: 'Neuroendocrine Motivation Decline',
    severity: 'Moderate',
  })
}
if (scores.family <= INFLAMMATION_RISK_THRESHOLD) {
  risks.push({
    label: 'Familial Longevity Vulnerability',
    severity: 'Elevated',
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