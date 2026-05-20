export function generateExecutiveSynthesis(
  data: {
    signature: any
    trajectory: any
    priorities: any[]
    longevityScore: number
  },
) {

  const topPriority =
    data.priorities?.[0]?.title ||
    'Advanced Optimization'

  if (data.longevityScore >= 85) {
    return `
Your biological profile demonstrates advanced adaptive resilience and highly favorable longevity dynamics.

Current optimization opportunities remain primarily focused on sustaining systemic recovery efficiency and long-term neurological resilience.

Primary strategic focus:
${topPriority}.
`
  }

  if (data.longevityScore >= 70) {
    return `
Your biological systems currently demonstrate stable adaptive capacity with moderate optimization potential.

Targeted intervention strategies may substantially improve long-term resilience, recovery efficiency, and biological sustainability.

Primary strategic focus:
${topPriority}.
`
  }

  return `
Current biological patterns suggest elevated systemic recovery demand and partial resilience impairment.

Targeted longevity interventions may significantly improve adaptive recovery capacity and long-term biological stability.

Primary strategic focus:
${topPriority}.
`
}