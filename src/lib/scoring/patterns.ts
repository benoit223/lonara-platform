// lib/scoring/patterns.ts
// Module 2 v2 — 42 patterns cross-domain
// Imports only from types.ts

import type {
  ScoreMap,
  Pattern,
  PatternResult,
  PillarAdjustments,
  Pillar,
  PillarScores,
} from './types'

interface PatternDefinition {
  id: string
  label: string
  description: string
  pillar: Pillar
  categories: string[]
  thresholds: { moderate: number; critical: number }
  pillarImpact: Partial<PillarAdjustments>
  isPositive: boolean
}

const PATTERN_DEFINITIONS: PatternDefinition[] = [

  // ── ACTIVATE — 8 patterns ─────────────
  {
    id: 'metabolic_burnout',
    label: 'Metabolic Burnout',
    description: 'Energy, cognition and metabolism simultaneously low — cellular energy production is underperforming across all systems.',
    pillar: 'activate',
    categories: ['energy', 'cognition', 'metabolism'],
    thresholds: { moderate: 58, critical: 42 },
    pillarImpact: { activate: -12, restore: -5 },
    isPositive: false,
  },
  {
    id: 'physical_decline',
    label: 'Progressive Physical Decline',
    description: 'Mobility, exercise and recovery degraded together — signal of accelerated physical aging.',
    pillar: 'activate',
    categories: ['mobility', 'exercise', 'recovery'],
    thresholds: { moderate: 55, critical: 40 },
    pillarImpact: { activate: -10, restore: -8 },
    isPositive: false,
  },
  {
    id: 'hormonal_energy_disruption',
    label: 'Hormonal-Energy Disruption',
    description: 'Hormonal and energy systems both compromised — often linked to cortisol or thyroid imbalance.',
    pillar: 'activate',
    categories: ['hormonal', 'energy', 'metabolism'],
    thresholds: { moderate: 55, critical: 40 },
    pillarImpact: { activate: -8, balance: -6 },
    isPositive: false,
  },
  {
    id: 'cognitive_metabolic_fog',
    label: 'Cognitive-Metabolic Fog',
    description: 'Cognition and metabolism both impaired — brain fuel delivery is compromised, creating persistent mental fog.',
    pillar: 'activate',
    categories: ['cognition', 'metabolism', 'nutrition'],
    thresholds: { moderate: 55, critical: 38 },
    pillarImpact: { activate: -10, balance: -5 },
    isPositive: false,
  },
  {
    id: 'performance_collapse',
    label: 'Performance Collapse',
    description: 'Performance, exercise and energy all critically low — systemic physical depletion requiring immediate intervention.',
    pillar: 'activate',
    categories: ['performance', 'exercise', 'energy', 'mobility'],
    thresholds: { moderate: 52, critical: 36 },
    pillarImpact: { activate: -14, restore: -6 },
    isPositive: false,
  },
  {
    id: 'sexual_hormonal_depletion',
    label: 'Hormonal-Sexual Depletion',
    description: 'Sexual health and hormonal balance both compromised — anabolic hormone levels likely suboptimal.',
    pillar: 'activate',
    categories: ['sexual', 'hormonal', 'energy'],
    thresholds: { moderate: 52, critical: 38 },
    pillarImpact: { activate: -7, balance: -5 },
    isPositive: false,
  },
  {
    id: 'nutritional_deficit',
    label: 'Nutritional-Metabolic Deficit',
    description: 'Nutrition and metabolism misaligned — dietary quality is directly limiting biological performance.',
    pillar: 'activate',
    categories: ['nutrition', 'metabolism', 'energy'],
    thresholds: { moderate: 55, critical: 40 },
    pillarImpact: { activate: -8, protect: -4 },
    isPositive: false,
  },
  {
    id: 'physical_excellence',
    label: 'Physical Excellence',
    description: 'Exercise, mobility and recovery all performing — exceptional physical capital.',
    pillar: 'activate',
    categories: ['exercise', 'mobility', 'recovery'],
    thresholds: { moderate: 72, critical: 85 },
    pillarImpact: { activate: 8, restore: 6 },
    isPositive: true,
  },

  // ── BALANCE — 10 patterns ─────────────
  {
    id: 'neuro_vagal_triad',
    label: 'Neuro-Vagal Triad',
    description: 'Sleep, stress and gut simultaneously disrupted — the autonomic nervous system is in chronic overload.',
    pillar: 'balance',
    categories: ['sleep', 'stress', 'gut'],
    thresholds: { moderate: 55, critical: 38 },
    pillarImpact: { balance: -15, restore: -8, activate: -5 },
    isPositive: false,
  },
  {
    id: 'emotional_overload',
    label: 'Emotional Overload',
    description: 'Stress, emotional health and social connection all compromised — combined isolation and psychological exhaustion.',
    pillar: 'balance',
    categories: ['stress', 'emotional', 'social'],
    thresholds: { moderate: 52, critical: 38 },
    pillarImpact: { balance: -12, restore: -6 },
    isPositive: false,
  },
  {
    id: 'circadian_disruption',
    label: 'Circadian Disruption',
    description: 'Sleep and circadian rhythm misaligned — systemic impact across all biological functions.',
    pillar: 'balance',
    categories: ['sleep', 'circadian'],
    thresholds: { moderate: 50, critical: 35 },
    pillarImpact: { balance: -10, activate: -6, restore: -6 },
    isPositive: false,
  },
  {
    id: 'purpose_resilience_gap',
    label: 'Purpose-Resilience Gap',
    description: 'Purpose and resilience both low — lack of motivational anchoring that undermines any intervention.',
    pillar: 'balance',
    categories: ['purpose', 'resilience', 'mindset'],
    thresholds: { moderate: 55, critical: 40 },
    pillarImpact: { balance: -8, restore: -7 },
    isPositive: false,
  },
  {
    id: 'stress_hormonal_cascade',
    label: 'Stress-Hormonal Cascade',
    description: 'Chronic stress driving hormonal dysregulation — cortisol dominance disrupting the entire endocrine system.',
    pillar: 'balance',
    categories: ['stress', 'hormonal', 'sleep'],
    thresholds: { moderate: 52, critical: 38 },
    pillarImpact: { balance: -12, activate: -7 },
    isPositive: false,
  },
  {
    id: 'social_isolation_syndrome',
    label: 'Social Isolation Syndrome',
    description: 'Social connection, purpose and emotional health all depleted — loneliness has measurable biological consequences.',
    pillar: 'balance',
    categories: ['social', 'purpose', 'emotional'],
    thresholds: { moderate: 50, critical: 35 },
    pillarImpact: { balance: -10, restore: -6 },
    isPositive: false,
  },
  {
    id: 'lifestyle_circadian_misalignment',
    label: 'Lifestyle-Circadian Misalignment',
    description: 'Lifestyle patterns and circadian biology are out of sync — daily habits are working against biological rhythms.',
    pillar: 'balance',
    categories: ['lifestyle', 'circadian', 'sleep'],
    thresholds: { moderate: 52, critical: 38 },
    pillarImpact: { balance: -9, restore: -5 },
    isPositive: false,
  },
  {
    id: 'total_nervous_collapse',
    label: 'Total Nervous System Collapse',
    description: 'Stress, sleep, emotional health and circadian rhythm all critically compromised — full autonomic system failure pattern.',
    pillar: 'balance',
    categories: ['stress', 'sleep', 'emotional', 'circadian'],
    thresholds: { moderate: 50, critical: 35 },
    pillarImpact: { balance: -18, restore: -10, activate: -8 },
    isPositive: false,
  },
  {
    id: 'mindset_performance_alignment',
    label: 'Mindset-Performance Alignment',
    description: 'Strong mindset, purpose and resilience creating a powerful psychological foundation for optimization.',
    pillar: 'balance',
    categories: ['mindset', 'purpose', 'resilience'],
    thresholds: { moderate: 72, critical: 85 },
    pillarImpact: { balance: 7, restore: 6 },
    isPositive: true,
  },
  {
    id: 'resilience_anchor',
    label: 'Resilience Anchor',
    description: 'Resilience, mindset and purpose all high — solid psychological foundation that amplifies every intervention.',
    pillar: 'restore',
    categories: ['resilience', 'mindset', 'purpose'],
    thresholds: { moderate: 72, critical: 85 },
    pillarImpact: { restore: 8, balance: 5 },
    isPositive: true,
  },

  // ── PROTECT — 12 patterns ─────────────
  {
    id: 'systemic_inflammation',
    label: 'Systemic Inflammation',
    description: 'Inflammation, gut and immune systems simultaneously degraded — gut-immunity axis under chronic pressure.',
    pillar: 'protect',
    categories: ['inflammation', 'gut', 'immune'],
    thresholds: { moderate: 55, critical: 40 },
    pillarImpact: { protect: -14, restore: -6 },
    isPositive: false,
  },
  {
    id: 'cardiovascular_risk_cluster',
    label: 'Cardiovascular Risk Cluster',
    description: 'Cardiovascular, inflammation and metabolism combined — risk profile requiring active monitoring.',
    pillar: 'protect',
    categories: ['cardiovascular', 'inflammation', 'metabolism'],
    thresholds: { moderate: 55, critical: 38 },
    pillarImpact: { protect: -12, activate: -5 },
    isPositive: false,
  },
  {
    id: 'toxic_load',
    label: 'Elevated Toxic Load',
    description: 'Detox, environment and inflammation negatively aligned — elimination capacity saturated.',
    pillar: 'protect',
    categories: ['detox', 'environment', 'inflammation'],
    thresholds: { moderate: 52, critical: 38 },
    pillarImpact: { protect: -10, restore: -5 },
    isPositive: false,
  },
  {
    id: 'immune_inflammatory_collapse',
    label: 'Immune-Inflammatory Collapse',
    description: 'Immune system and inflammation both critical — the body is losing its defensive capacity.',
    pillar: 'protect',
    categories: ['immune', 'inflammation', 'gut', 'family'],
    thresholds: { moderate: 50, critical: 35 },
    pillarImpact: { protect: -16, restore: -8 },
    isPositive: false,
  },
  {
    id: 'gut_barrier_breakdown',
    label: 'Gut Barrier Breakdown',
    description: 'Gut health and immune function critically compromised — intestinal permeability likely affecting systemic health.',
    pillar: 'protect',
    categories: ['gut', 'immune', 'inflammation'],
    thresholds: { moderate: 52, critical: 38 },
    pillarImpact: { protect: -13, balance: -5 },
    isPositive: false,
  },
  {
    id: 'environmental_cellular_stress',
    label: 'Environmental-Cellular Stress',
    description: 'Environmental toxin exposure combined with poor detoxification — cellular oxidative stress is accumulating.',
    pillar: 'protect',
    categories: ['environment', 'detox', 'skin'],
    thresholds: { moderate: 52, critical: 38 },
    pillarImpact: { protect: -9, restore: -4 },
    isPositive: false,
  },
  {
    id: 'genetic_cardiovascular_risk',
    label: 'Genetic-Cardiovascular Risk',
    description: 'Family history combined with active cardiovascular stress — genetic predisposition being expressed.',
    pillar: 'protect',
    categories: ['family', 'cardiovascular', 'inflammation'],
    thresholds: { moderate: 50, critical: 36 },
    pillarImpact: { protect: -12, restore: -5 },
    isPositive: false,
  },
  {
    id: 'skin_aging_acceleration',
    label: 'Skin-Aging Acceleration',
    description: 'Skin health and aging markers both declining — visible aging is outpacing chronological age.',
    pillar: 'protect',
    categories: ['skin', 'aging', 'inflammation'],
    thresholds: { moderate: 52, critical: 38 },
    pillarImpact: { protect: -7, restore: -6 },
    isPositive: false,
  },
  {
    id: 'full_protection_collapse',
    label: 'Full Protection Collapse',
    description: 'Cardiovascular, immune, inflammation and gut all critically compromised — complete protective barrier failure.',
    pillar: 'protect',
    categories: ['cardiovascular', 'immune', 'inflammation', 'gut'],
    thresholds: { moderate: 48, critical: 33 },
    pillarImpact: { protect: -18, restore: -10, activate: -6 },
    isPositive: false,
  },
  {
    id: 'immune_excellence',
    label: 'Immune Resilience',
    description: 'Strong immune function and low inflammation — exceptional cellular defense capacity.',
    pillar: 'protect',
    categories: ['immune', 'inflammation', 'gut'],
    thresholds: { moderate: 72, critical: 85 },
    pillarImpact: { protect: 8, restore: 4 },
    isPositive: true,
  },
  {
    id: 'cardiovascular_excellence',
    label: 'Cardiovascular Strength',
    description: 'Strong cardiovascular and metabolic health — heart and circulation operating at high efficiency.',
    pillar: 'protect',
    categories: ['cardiovascular', 'exercise', 'metabolism'],
    thresholds: { moderate: 72, critical: 85 },
    pillarImpact: { protect: 7, activate: 5 },
    isPositive: true,
  },
  {
    id: 'clean_biology',
    label: 'Clean Biology',
    description: 'Low toxic load, strong detoxification and healthy environment — cellular environment is optimized.',
    pillar: 'protect',
    categories: ['detox', 'environment', 'gut'],
    thresholds: { moderate: 72, critical: 85 },
    pillarImpact: { protect: 6, restore: 4 },
    isPositive: true,
  },

  // ── RESTORE — 12 patterns ─────────────
  {
    id: 'regeneration_deficit',
    label: 'Regeneration Deficit',
    description: 'Recovery, sleep and longevity all low — the body is no longer regenerating sufficiently between cycles.',
    pillar: 'restore',
    categories: ['recovery', 'sleep', 'longevity'],
    thresholds: { moderate: 55, critical: 40 },
    pillarImpact: { restore: -14, activate: -6 },
    isPositive: false,
  },
  {
    id: 'accelerated_aging',
    label: 'Accelerated Aging',
    description: 'Aging, skin and resilience degraded together — biological aging above chronological age.',
    pillar: 'restore',
    categories: ['aging', 'skin', 'resilience'],
    thresholds: { moderate: 55, critical: 40 },
    pillarImpact: { restore: -10, protect: -6 },
    isPositive: false,
  },
  {
    id: 'longevity_engagement_gap',
    label: 'Longevity Engagement Gap',
    description: 'Low longevity scores despite biohacking awareness — knowledge exists but implementation is blocked.',
    pillar: 'restore',
    categories: ['longevity', 'mindset', 'biohacking'],
    thresholds: { moderate: 55, critical: 40 },
    pillarImpact: { restore: -6, balance: -4 },
    isPositive: false,
  },
  {
    id: 'deep_recovery_failure',
    label: 'Deep Recovery Failure',
    description: 'Recovery, sleep, resilience and longevity all compromised — the body has lost its capacity for deep regeneration.',
    pillar: 'restore',
    categories: ['recovery', 'sleep', 'resilience', 'longevity'],
    thresholds: { moderate: 50, critical: 35 },
    pillarImpact: { restore: -18, activate: -8, balance: -6 },
    isPositive: false,
  },
  {
    id: 'aging_acceleration_syndrome',
    label: 'Aging Acceleration Syndrome',
    description: 'Aging, wellness and longevity all critically low — biological clock running significantly faster than expected.',
    pillar: 'restore',
    categories: ['aging', 'wellness', 'longevity', 'resilience'],
    thresholds: { moderate: 50, critical: 35 },
    pillarImpact: { restore: -16, protect: -8 },
    isPositive: false,
  },
  {
    id: 'purpose_vitality_disconnect',
    label: 'Purpose-Vitality Disconnect',
    description: 'Purpose and wellness both low — lack of meaning is directly impacting biological vitality.',
    pillar: 'restore',
    categories: ['purpose', 'wellness', 'emotional'],
    thresholds: { moderate: 52, critical: 38 },
    pillarImpact: { restore: -8, balance: -7 },
    isPositive: false,
  },
  {
    id: 'mindset_aging_resistance',
    label: 'Mindset-Aging Resistance',
    description: 'Poor mindset and aging resilience — psychological aging is accelerating biological decline.',
    pillar: 'restore',
    categories: ['mindset', 'aging', 'resilience'],
    thresholds: { moderate: 52, critical: 38 },
    pillarImpact: { restore: -9, balance: -6 },
    isPositive: false,
  },
  {
    id: 'biohacking_optimization_gap',
    label: 'Biohacking Optimization Gap',
    description: 'Advanced optimization and biohacking both low — significant untapped potential for biological enhancement.',
    pillar: 'restore',
    categories: ['biohacking', 'advanced', 'longevity'],
    thresholds: { moderate: 45, critical: 30 },
    pillarImpact: { restore: -5 },
    isPositive: false,
  },
  {
    id: 'longevity_excellence',
    label: 'Longevity Excellence',
    description: 'Recovery, longevity and resilience all optimized — exceptional regenerative capacity and biological age resistance.',
    pillar: 'restore',
    categories: ['recovery', 'longevity', 'resilience'],
    thresholds: { moderate: 72, critical: 85 },
    pillarImpact: { restore: 10, activate: 5 },
    isPositive: true,
  },
  {
    id: 'deep_sleep_excellence',
    label: 'Deep Sleep Excellence',
    description: 'Sleep quality and recovery both optimized — the body is regenerating at peak capacity.',
    pillar: 'restore',
    categories: ['sleep', 'recovery', 'circadian'],
    thresholds: { moderate: 72, critical: 85 },
    pillarImpact: { restore: 9, balance: 6 },
    isPositive: true,
  },
  {
    id: 'longevity_mindset_strength',
    label: 'Longevity Mindset Strength',
    description: 'Strong aging resilience and wellness scores — excellent biological foundation for long-term healthspan.',
    pillar: 'restore',
    categories: ['aging', 'wellness', 'mindset'],
    thresholds: { moderate: 72, critical: 85 },
    pillarImpact: { restore: 7, balance: 4 },
    isPositive: true,
  },
  {
    id: 'full_restoration_excellence',
    label: 'Full Restoration Excellence',
    description: 'Sleep, recovery, resilience and longevity all optimized — complete regenerative system at peak performance.',
    pillar: 'restore',
    categories: ['sleep', 'recovery', 'resilience', 'longevity'],
    thresholds: { moderate: 75, critical: 88 },
    pillarImpact: { restore: 14, activate: 6, balance: 5 },
    isPositive: true,
  },
]

// ─────────────────────────────────────────
// DETECTION
// ─────────────────────────────────────────

function detectPatterns(scores: ScoreMap): Pattern[] {
  const detected: Pattern[] = []

  for (const def of PATTERN_DEFINITIONS) {
    const categoryScores = def.categories
      .map((cat) => scores[cat])
      .filter((s): s is number => s !== undefined)

    if (categoryScores.length < Math.min(def.categories.length, 3)) continue

    const avg = categoryScores.reduce((s, v) => s + v, 0) / categoryScores.length
    let severity: Pattern['severity'] | null = null

    if (def.isPositive) {
      if (avg >= def.thresholds.critical) severity = 'optimal'
      else if (avg >= def.thresholds.moderate) severity = 'moderate'
    } else {
      if (avg <= def.thresholds.critical) severity = 'critical'
      else if (avg <= def.thresholds.moderate) severity = 'moderate'
    }

    if (severity === null) continue

    detected.push({
      id: def.id,
      label: def.label,
      description: def.description,
      pillar: def.pillar,
      severity,
      affectedCategories: def.categories,
      pillarImpact: def.pillarImpact,
    })
  }

  // Limiter à 8 patterns max affichés — les plus sévères en premier
  return detected
    .sort((a, b) => {
      const order = { critical: 0, moderate: 1, optimal: 2 }
      return order[a.severity] - order[b.severity]
    })
    .slice(0, 8)
}

// ─────────────────────────────────────────
// PILLAR ADJUSTMENTS
// ─────────────────────────────────────────

function computePillarAdjustments(patterns: Pattern[]): PillarAdjustments {
  const adj: PillarAdjustments = { activate: 0, balance: 0, protect: 0, restore: 0 }

  for (const pattern of patterns) {
    const keys = Object.keys(pattern.pillarImpact) as Array<keyof PillarAdjustments>
    for (const pillar of keys) {
      const delta = pattern.pillarImpact[pillar]
      if (typeof delta === 'number') adj[pillar] += delta
    }
  }

  const pillars = Object.keys(adj) as Array<keyof PillarAdjustments>
  for (const key of pillars) {
    adj[key] = Math.max(-20, Math.min(20, adj[key]))
  }

  return adj
}

// ─────────────────────────────────────────
// DOMINANT PILLAR
// ─────────────────────────────────────────

function findDominantPillar(
  adjustments: PillarAdjustments,
  basePillarScores: PillarScores,
): Pillar {
  const pillars: Pillar[] = ['activate', 'balance', 'protect', 'restore']
  let lowest = Infinity
  let dominant: Pillar = 'balance'

  for (const pillar of pillars) {
    const finalScore = (basePillarScores[pillar] ?? 50) + adjustments[pillar]
    if (finalScore < lowest) {
      lowest = finalScore
      dominant = pillar
    }
  }

  return dominant
}

// ─────────────────────────────────────────
// NARRATIVE
// ─────────────────────────────────────────

const PILLAR_NARRATIVES: Record<Pillar, string> = {
  activate: 'Your capacity to generate and sustain energy is the primary lever. The body has the resources — they need to be unlocked.',
  balance:  'Autonomic nervous system regulation is the central limiting factor. Without nervous balance, other interventions remain partially ineffective.',
  protect:  'Your cellular and inflammatory protection capacity is the critical axis. Reducing inflammatory load unlocks the other systems.',
  restore:  'Regeneration is compromised. Rebuilding recovery and sleep quality is the foundation upon which everything else rests.',
}

function buildNarrative(
  patterns: Pattern[],
  dominantPillar: Pillar,
  strengths: string[],
): string {
  const safeStrengths = Array.isArray(strengths) ? strengths : []
  const criticalPatterns = patterns.filter((p) => p.severity === 'critical')
  const optimalPatterns = patterns.filter((p) => p.severity === 'optimal')

  let narrative = PILLAR_NARRATIVES[dominantPillar]

  if (criticalPatterns.length > 0) {
    narrative += ` Critical patterns detected: ${criticalPatterns.map((p) => p.label).join(', ')}.`
  }
  if (optimalPatterns.length > 0) {
    narrative += ` Confirmed strengths: ${optimalPatterns.map((p) => p.label).join(', ')}.`
  }
  if (safeStrengths.length > 0) {
    narrative += ` Your highest scores: ${safeStrengths.slice(0, 3).join(', ')}.`
  }

  return narrative
}

// ─────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────

export function analyzePatterns(
  scores: ScoreMap,
  basePillarScores: PillarScores,
  strengths: string[],
): PatternResult {
  const safeStrengths = Array.isArray(strengths) ? strengths : []
  const detected = detectPatterns(scores)
  const pillarAdjustments = computePillarAdjustments(detected)
  const dominantPillar = findDominantPillar(pillarAdjustments, basePillarScores)
  const narrative = buildNarrative(detected, dominantPillar, safeStrengths)

  return { detected, pillarAdjustments, narrative, dominantPillar }
}