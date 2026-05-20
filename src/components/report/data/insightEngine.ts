export function generateAIInsights(
  scores: Record<string, number>,
) {

  const insights = []

  if (scores.stress <= 65) {
    insights.push(
      'Elevated stress regulation demand detected across adaptive nervous system pathways.'
    )
  }

  if (scores.sleep <= 70) {
    insights.push(
      'Sleep architecture patterns may currently impair long-term recovery efficiency.'
    )
  }

  if (scores.recovery <= 70) {
    insights.push(
      'Systemic recovery capacity appears partially compromised under current biological load.'
    )
  }

  if (scores.longevity >= 85) {
    insights.push(
      'Favorable long-term resilience patterns detected across longevity biomarkers.'
    )
  }

  if (insights.length === 0) {
    insights.push(
      'Biological systems currently demonstrate relatively stable adaptive resilience.'
    )
  }

  return insights.slice(0, 3)
}