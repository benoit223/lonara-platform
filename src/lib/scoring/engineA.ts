// lib/scoring/engineA.ts
// Main engine — integrates patterns.ts and profileVector.ts

import type {
  ScoreMap,
  Pillar,
  Flag,
  PillarScores,
  PillarAdjustments,
  EngineAResult,
} from './types'

import { analyzePatterns } from './patterns'
import { buildProfileVector } from './profileVector'

interface CategoryConfig {
  pillar: Pillar
  globalWeight: number
  ageAffected: boolean
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  energy:         { pillar: 'activate', globalWeight: 0.045, ageAffected: true  },
  cognition:      { pillar: 'activate', globalWeight: 0.040, ageAffected: true  },
  performance:    { pillar: 'activate', globalWeight: 0.030, ageAffected: false },
  exercise:       { pillar: 'activate', globalWeight: 0.035, ageAffected: true  },
  mobility:       { pillar: 'activate', globalWeight: 0.030, ageAffected: true  },
  metabolism:     { pillar: 'activate', globalWeight: 0.035, ageAffected: true  },
  nutrition:      { pillar: 'activate', globalWeight: 0.025, ageAffected: false },
  sexual:         { pillar: 'activate', globalWeight: 0.015, ageAffected: true  },

  stress:         { pillar: 'balance',  globalWeight: 0.045, ageAffected: false },
  sleep:          { pillar: 'balance',  globalWeight: 0.050, ageAffected: false },
  hormonal:       { pillar: 'balance',  globalWeight: 0.030, ageAffected: true  },
  emotional:      { pillar: 'balance',  globalWeight: 0.035, ageAffected: false },
  circadian:      { pillar: 'balance',  globalWeight: 0.025, ageAffected: false },
  social:         { pillar: 'balance',  globalWeight: 0.020, ageAffected: false },
  lifestyle:      { pillar: 'balance',  globalWeight: 0.020, ageAffected: false },

  inflammation:   { pillar: 'protect',  globalWeight: 0.045, ageAffected: true  },
  immune:         { pillar: 'protect',  globalWeight: 0.035, ageAffected: true  },
  cardiovascular: { pillar: 'protect',  globalWeight: 0.040, ageAffected: true  },
  gut:            { pillar: 'protect',  globalWeight: 0.030, ageAffected: false },
  detox:          { pillar: 'protect',  globalWeight: 0.025, ageAffected: false },
  environment:    { pillar: 'protect',  globalWeight: 0.015, ageAffected: false },
  family:         { pillar: 'protect',  globalWeight: 0.020, ageAffected: false },
  skin:           { pillar: 'protect',  globalWeight: 0.015, ageAffected: true  },

  recovery:       { pillar: 'restore',  globalWeight: 0.045, ageAffected: true  },
  resilience:     { pillar: 'restore',  globalWeight: 0.035, ageAffected: false },
  longevity:      { pillar: 'restore',  globalWeight: 0.030, ageAffected: false },
  aging:          { pillar: 'restore',  globalWeight: 0.035, ageAffected: true  },
  mindset:        { pillar: 'restore',  globalWeight: 0.025, ageAffected: false },
  purpose:        { pillar: 'restore',  globalWeight: 0.025, ageAffected: false },
  biohacking:     { pillar: 'restore',  globalWeight: 0.010, ageAffected: false },
  advanced:       { pillar: 'restore',  globalWeight: 0.010, ageAffected: false },
  wellness:       { pillar: 'restore',  globalWeight: 0.020, ageAffected: false },
}

interface QuestionMeta {
  question: string
  id: number
  category: string
  weight: number
  scale: string
}

function getAgeAdjustment(age: number, category: string): number {
  if (!CATEGORY_CONFIG[category]?.ageAffected) return 0
  if (age < 30) return -2
  if (age < 40) return 0
  if (age < 50) return 3
  if (age < 60) return 6
  return 8
}

function scoreCategoryNonLinear(
  questionValues: Array<{ value: number; weight: number }>,
  age: number,
  category: string,
): number {
  if (questionValues.length === 0) return 100

  const totalWeight = questionValues.reduce((s, q) => s + q.weight, 0)
  const weightedSum = questionValues.reduce((s, q) => s + ((4 - q.value) / 4) * q.weight, 0)
  const baseScore = (weightedSum / totalWeight) * 100

  const values = questionValues.map((q) => (4 - q.value) / 4)
  const mean = values.reduce((s, v) => s + v, 0) / values.length
  const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length
  const variancePenalty = Math.min(variance * 15, 8)

  let extremePenalty = 0
  for (const q of questionValues) {
    if (q.value === 4 && q.weight >= 3) extremePenalty += 5
    if (q.value === 4 && q.weight === 2) extremePenalty += 2
  }
  extremePenalty = Math.min(extremePenalty, 15)

  const ageBonus = getAgeAdjustment(age, category)

  return Math.max(0, Math.min(100,
    Math.round(baseScore - variancePenalty - extremePenalty + ageBonus)
  ))
}

function detectFlags(
  responses: Record<string, number>,
  questions: QuestionMeta[],
): Flag[] {
  const flags: Flag[] = []

  const avgForCategory = (category: string): number | null => {
    const vals = questions
      .filter((q) => q.category === category)
      .map((q) => responses[q.question] ?? responses[String(q.id)])
      .filter((v): v is number => v !== undefined)
    if (vals.length === 0) return null
    return vals.reduce((s, v) => s + v, 0) / vals.length
  }

  const sleep = avgForCategory('sleep')
  if (sleep !== null && sleep >= 3.2) {
    flags.push({
      category: 'sleep',
      message: 'flag_sleep_critical',
      severity: 'critical',
    })
  }

  const stress = avgForCategory('stress')
  const emotional = avgForCategory('emotional')
  if (stress !== null && emotional !== null && stress >= 3 && emotional >= 3) {
    flags.push({
      category: 'stress',
      message: 'flag_stress_critical',
      severity: 'critical',
    })
  }

  const inflammation = avgForCategory('inflammation')
  const gut = avgForCategory('gut')
  if (inflammation !== null && gut !== null && inflammation >= 2.8 && gut >= 2.8) {
    flags.push({
      category: 'inflammation',
      message: 'flag_inflammation_warning',
      severity: 'warning',
    })
  }

  const cardiovascular = avgForCategory('cardiovascular')
  const family = avgForCategory('family')
  if (cardiovascular !== null && family !== null && cardiovascular >= 2.8 && family >= 2.8) {
    flags.push({
      category: 'cardiovascular',
      message: 'flag_cardiovascular_warning',
      severity: 'warning',
    })
  }

  return flags
}

function computeCategoryScores(
  responses: Record<string, number>,
  questions: QuestionMeta[],
  age: number,
): ScoreMap {
  if (!responses || typeof responses !== 'object') return {}

  const byCategory: Record<string, Array<{ value: number; weight: number }>> = {}

  for (const q of questions) {
    const value = responses[q.question] ?? responses[String(q.id)]
    if (value === undefined) continue
    if (!byCategory[q.category]) byCategory[q.category] = []
    byCategory[q.category].push({ value, weight: q.weight })
  }

  const scores: ScoreMap = {}

  for (const [category, values] of Object.entries(byCategory)) {
    scores[category] = scoreCategoryNonLinear(values, age, category)
  }

  for (const category of Object.keys(CATEGORY_CONFIG)) {
    if (scores[category] === undefined) scores[category] = 100
  }

  return scores
}

function computeBasePillarScores(scores: ScoreMap): PillarScores {
  const pillars: Record<Pillar, { sum: number; weight: number }> = {
    activate: { sum: 0, weight: 0 },
    balance:  { sum: 0, weight: 0 },
    protect:  { sum: 0, weight: 0 },
    restore:  { sum: 0, weight: 0 },
  }

  for (const [category, config] of Object.entries(CATEGORY_CONFIG)) {
    const score = scores[category]
    if (score === undefined) continue
    pillars[config.pillar].sum += score * config.globalWeight
    pillars[config.pillar].weight += config.globalWeight
  }

  return {
    activate: pillars.activate.weight > 0 ? Math.round(pillars.activate.sum / pillars.activate.weight) : 50,
    balance:  pillars.balance.weight > 0  ? Math.round(pillars.balance.sum  / pillars.balance.weight)  : 50,
    protect:  pillars.protect.weight > 0  ? Math.round(pillars.protect.sum  / pillars.protect.weight)  : 50,
    restore:  pillars.restore.weight > 0  ? Math.round(pillars.restore.sum  / pillars.restore.weight)  : 50,
  }
}

function applyPillarAdjustments(
  base: PillarScores,
  adjustments: PillarAdjustments,
): PillarScores {
  return {
    activate: Math.max(10, Math.min(100, base.activate + adjustments.activate)),
    balance:  Math.max(10, Math.min(100, base.balance  + adjustments.balance)),
    protect:  Math.max(10, Math.min(100, base.protect  + adjustments.protect)),
    restore:  Math.max(10, Math.min(100, base.restore  + adjustments.restore)),
  }
}

function computeLongevityScore(pillarScores: PillarScores): number {
  const { activate, balance, protect, restore } = pillarScores
  const avg = (activate + balance + protect + restore) / 4
  const min = Math.min(activate, balance, protect, restore)
  const imbalancePenalty = Math.max(0, (avg - min) * 0.15)
  return Math.max(0, Math.min(100, Math.round(avg - imbalancePenalty)))
}

function estimateBiologicalAge(
  longevityScore: number,
  age: number,
  sex: string = 'male',
  bmi: number = 22,
  inflammationScore: number = 50,
  cardiovascularScore: number = 50,
): number {

  // Base delta — score global ±12 ans
  const baseDelta = ((50 - longevityScore) / 50) * 12

  // Facteur sexe — les femmes ont biologiquement ~2 ans de moins en moyenne
  const sexFactor = sex === 'female' ? -1.5 : 0

  // Facteur BMI
  // Optimal 18.5-24.9 → 0, surpoids → +1.5, obésité → +3, sous-poids → +1
  const bmiFactor =
    bmi < 18.5 ? 1.0
    : bmi < 25 ? 0
    : bmi < 30 ? 1.5
    : bmi < 35 ? 2.5
    : 3.5

  // Facteur inflammation — score bas = vieillissement accéléré
  // Score 0-40 → +3, 40-60 → +1, 60-80 → 0, 80-100 → -1
  const inflammationFactor =
    inflammationScore < 40 ? 3.0
    : inflammationScore < 60 ? 1.0
    : inflammationScore < 80 ? 0
    : -1.0

  // Facteur cardiovasculaire
  // Score bas = risque élevé = vieillissement accéléré
  const cardiovascularFactor =
    cardiovascularScore < 40 ? 2.0
    : cardiovascularScore < 60 ? 0.8
    : cardiovascularScore < 80 ? 0
    : -0.8

  const totalDelta =
    baseDelta +
    sexFactor +
    bmiFactor +
    inflammationFactor +
    cardiovascularFactor

  // Plafonner à ±15 ans max
  const clampedDelta = Math.max(-15, Math.min(15, totalDelta))

  return Math.round(age + clampedDelta)
}

function adjustForCoherence(
  longevityScore: number,
  reliability: number,
  contradictionLoad: number,
): number {
  const reliabilityPenalty = reliability < 50
    ? Math.round((50 - reliability) / 10)
    : 0

  const contradictionPenalty = contradictionLoad > 30
    ? Math.round((contradictionLoad - 30) / 20)
    : 0

  const totalPenalty = Math.min(5, reliabilityPenalty + contradictionPenalty)

  return Math.max(0, longevityScore - totalPenalty)
}


function computePercentile(longevityScore: number): number {
  const z = (longevityScore - 55) / 15
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const poly = t * (0.319381530 + t * (-0.356563782 +
    t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
  const phi = 1 - (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z) * poly
  return Math.round((z >= 0 ? phi : 1 - phi) * 100)
}

function extractStrengthsAndWeaknesses(scores: ScoreMap): {
  strengths: string[]
  weaknesses: string[]
} {
  const entries = Object.entries(scores)
    .filter(([cat]) => CATEGORY_CONFIG[cat] !== undefined)
    .sort((a, b) => b[1] - a[1])

  return {
    strengths: entries.filter(([, s]) => s >= 72).slice(0, 4).map(([c]) => c),
    weaknesses: entries.filter(([, s]) => s < 55).slice(-5).reverse().map(([c]) => c),
  }
}

function buildProfileSummary(
  longevityScore: number,
  strengths: string[],
  weaknesses: string[],
  flags: Flag[],
): string {
  const level =
    longevityScore >= 80 ? 'Optimized profile'
    : longevityScore >= 65 ? 'Solid profile with targeted improvement axes'
    : longevityScore >= 50 ? 'Moderate profile — several levers to activate'
    : 'Imbalanced profile — priority intervention recommended'

  const criticalFlags = flags.filter((f) => f.severity === 'critical')
  const flagNote = criticalFlags.length > 0
    ? ` ${criticalFlags.length} critical signal${criticalFlags.length > 1 ? 's' : ''} identified.`
    : ''
  const strengthNote = strengths.length > 0
    ? ` Strengths: ${strengths.slice(0, 2).join(', ')}.`
    : ''
  const weaknessNote = weaknesses.length > 0
    ? ` Priorities: ${weaknesses.slice(0, 2).join(', ')}.`
    : ''

  return `${level}.${flagNote}${strengthNote}${weaknessNote}`
}

export function calculateScoresV2(
  responses: Record<string, number>,
  questions: QuestionMeta[],
  age: number = 35,
  sex: string = 'unknown',
  bmi: number = 22,
  psychometric?: {
    coherence: number
    reliability: number
    stability: number
    contradictionLoad: number
  },
): EngineAResult {

  const scores = computeCategoryScores(responses, questions, age)
  const basePillarScores = computeBasePillarScores(scores)
  const { strengths, weaknesses } = extractStrengthsAndWeaknesses(scores)
  const patternResult = analyzePatterns(scores, basePillarScores, strengths)
  const pillarScores = applyPillarAdjustments(basePillarScores, patternResult.pillarAdjustments)
  const longevityScore = computeLongevityScore(pillarScores)

// Ajustement cohérence — si les réponses sont incohérentes,
// on réduit légèrement le score pour refléter l'incertitude
const coherenceAdjustedScore = psychometric
  ? adjustForCoherence(longevityScore, psychometric.reliability, psychometric.contradictionLoad)
  : longevityScore

const biologicalAge = estimateBiologicalAge(
  coherenceAdjustedScore,
  age,
  sex,
  bmi,
  scores.inflammation ?? 50,
  scores.cardiovascular ?? 50,
)
  const percentile = computePercentile(coherenceAdjustedScore)
  const flags = detectFlags(responses, questions)
  const profileSummary = buildProfileSummary(longevityScore, strengths, weaknesses, flags)
  const profileVector = buildProfileVector(scores, patternResult.pillarAdjustments)

  return {
    scores,
    pillarScores,
    longevityScore: coherenceAdjustedScore,
    biologicalAge,
    percentile,
    strengths,
    weaknesses,
    flags,
    profileSummary,
    patterns: patternResult.detected,
    dominantPillar: patternResult.dominantPillar,
    patternNarrative: patternResult.narrative,
    profileVector,
  }
}