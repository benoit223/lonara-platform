import {
  STRESS_RISK_THRESHOLD,
  SLEEP_RISK_THRESHOLD,
  RECOVERY_RISK_THRESHOLD,
  SCORE_THRESHOLD_EXCELLENT,
} from '@/lib/scoreThresholds'

export function generateAIInsights(
  scores: Record<string, number>,
) {

  const insights = []

  if (scores.stress <= STRESS_RISK_THRESHOLD) {
    insights.push(
      'Elevated stress regulation demand detected across adaptive nervous system pathways.'
    )
  }

  if (scores.sleep <= SLEEP_RISK_THRESHOLD) {
    insights.push(
      'Sleep architecture patterns may currently impair long-term recovery efficiency.'
    )
  }

  if (scores.recovery <= RECOVERY_RISK_THRESHOLD) {
    insights.push(
      'Systemic recovery capacity appears partially compromised under current biological load.'
    )
  }

  if (scores.longevity >= SCORE_THRESHOLD_EXCELLENT) {
    insights.push(
      'Favorable long-term resilience patterns detected across longevity biomarkers.'
    )
  }

if (scores.mobility <= RECOVERY_RISK_THRESHOLD) {
  insights.push(
    'Functional mobility patterns may currently reduce physiological resilience and healthy aging efficiency.'
  )
}

if (scores.social <= STRESS_RISK_THRESHOLD) {
  insights.push(
    'Reduced psychosocial resilience may contribute to elevated autonomic stress load and reduced adaptive stability.'
  )
}

if (scores.purpose <= SLEEP_RISK_THRESHOLD) {
  insights.push(
    'Reduced purpose-driven behavioral alignment may impair neuroendocrine recovery efficiency and long-term resilience.'
  )
}

if (scores.family <= RECOVERY_RISK_THRESHOLD) {
  insights.push(
    'Familial longevity predisposition patterns suggest elevated long-term systemic vulnerability requiring proactive optimization.'
  )
}
if (
  scores.mobility >= SCORE_THRESHOLD_EXCELLENT &&
  scores.social >= SCORE_THRESHOLD_EXCELLENT &&
  scores.purpose >= SCORE_THRESHOLD_EXCELLENT
) {
  insights.push(
    'Strong psychosocial and functional resilience patterns support favorable long-term healthy aging dynamics.'
  )
}


  if (insights.length === 0) {
    insights.push(
      'Biological systems currently demonstrate relatively stable adaptive resilience.'
    )
  }

  return insights.slice(0, 3)
}