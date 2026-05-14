import { questions } from '../data/questions'

export function calculateScores(
  responses: Record<string, number>,
) {
  const categoryTotals: Record<string, number> = {}

  const categoryMaximums: Record<string, number> = {}

questions.forEach((question) => {
  const response =
    responses[question.question]

  // Ignore les questions non répondues
  if (response === undefined) {
    return
  }

  const weightedValue =
    response * question.weight

  if (!categoryTotals[question.category]) {
    categoryTotals[question.category] = 0
  }

  if (
    !categoryMaximums[question.category]
  ) {
    categoryMaximums[question.category] = 0
  }

  categoryTotals[question.category] +=
    weightedValue

  categoryMaximums[question.category] +=
    4 * question.weight
})

  const normalizedScores: Record<
  string,
  number
> = {}

// INITIALISE TOUT À 100
questions.forEach((question) => {
  normalizedScores[
    question.category
  ] = 100
})

// MET À JOUR LES CATÉGORIES RÉPONDUES
Object.keys(categoryTotals).forEach(
  (category) => {
    const score =
      100 -
      Math.round(
        (categoryTotals[category] /
          categoryMaximums[
            category
          ]) *
          100,
      )

    normalizedScores[category] =
      score
  },
)

return normalizedScores
}

export function generateInsights(
  scores: Record<string, number>,
) {
  const insights: string[] = []

  if (scores.energy < 60) {
    insights.push(
      'Mitochondrial energy deficits detected.',
    )
  }

  if (scores.stress < 60) {
    insights.push(
      'Elevated nervous system stress patterns identified.',
    )
  }

  if (scores.sleep < 60) {
    insights.push(
      'Circadian recovery optimization recommended.',
    )
  }

  if (scores.recovery < 60) {
    insights.push(
      'Biological recovery capacity appears compromised.',
    )
  }

  if (insights.length === 0) {
    insights.push(
      'Biological profile appears well optimized overall.',
    )
  }

  return insights
}