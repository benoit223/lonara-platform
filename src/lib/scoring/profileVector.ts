// lib/scoring/profileVector.ts
// Module 3 v2 — Dynamic archetypes + unique signature
// Imports only from types.ts

import type {
  ScoreMap,
  PillarAdjustments,
  Pillar,
  ProfileAxis,
  ProfileVector,
  Archetype,
} from './types'

// ─────────────────────────────────────────
// 8 AXES — 2 per pillar
// ─────────────────────────────────────────

interface AxisDefinition {
  id: string
  label: string
  pillar: Pillar
  categories: string[]
  weights: number[]
}

const AXIS_DEFINITIONS: AxisDefinition[] = [
  {
    id: 'vitality',
    label: 'Vitality',
    pillar: 'activate',
    categories: ['energy', 'performance', 'exercise'],
    weights: [0.45, 0.30, 0.25],
  },
  {
    id: 'cognition_meta',
    label: 'Mental Acuity',
    pillar: 'activate',
    categories: ['cognition', 'metabolism', 'hormonal'],
    weights: [0.50, 0.30, 0.20],
  },
  {
    id: 'nervous_regulation',
    label: 'Nervous Regulation',
    pillar: 'balance',
    categories: ['stress', 'emotional', 'circadian'],
    weights: [0.45, 0.35, 0.20],
  },
  {
    id: 'social_anchor',
    label: 'Social Anchor',
    pillar: 'balance',
    categories: ['social', 'purpose', 'mindset'],
    weights: [0.40, 0.35, 0.25],
  },
  {
    id: 'cellular_defense',
    label: 'Cellular Defense',
    pillar: 'protect',
    categories: ['immune', 'inflammation', 'cardiovascular'],
    weights: [0.35, 0.40, 0.25],
  },
  {
    id: 'environmental_load',
    label: 'Environmental Load',
    pillar: 'protect',
    categories: ['gut', 'detox', 'environment'],
    weights: [0.45, 0.35, 0.20],
  },
  {
    id: 'regeneration',
    label: 'Regeneration',
    pillar: 'restore',
    categories: ['recovery', 'sleep', 'resilience'],
    weights: [0.40, 0.40, 0.20],
  },
  {
    id: 'longevity_trajectory',
    label: 'Longevity Trajectory',
    pillar: 'restore',
    categories: ['longevity', 'aging', 'wellness'],
    weights: [0.40, 0.35, 0.25],
  },
]

// ─────────────────────────────────────────
// COMPUTE AXES
// ─────────────────────────────────────────

function computeAxes(
  scores: ScoreMap,
  pillarAdjustments: PillarAdjustments,
): ProfileAxis[] {
  return AXIS_DEFINITIONS.map((def) => {
    let weightedSum = 0
    let totalWeight = 0

    for (let i = 0; i < def.categories.length; i++) {
      const score = scores[def.categories[i]]
      if (score === undefined) continue
      weightedSum += score * def.weights[i]
      totalWeight += def.weights[i]
    }

    const baseValue = totalWeight > 0 ? weightedSum / totalWeight : 50
    const pillarAdj = pillarAdjustments[def.pillar] * 0.5
    const finalValue = Math.max(0, Math.min(100, Math.round(baseValue + pillarAdj)))

    return { id: def.id, label: def.label, pillar: def.pillar, value: finalValue }
  })
}

// ─────────────────────────────────────────
// SIGNATURE CODE
// Format : A3-B2-P4-R2
// ─────────────────────────────────────────

function buildSignatureCode(axes: ProfileAxis[]): string {
  const pillarValues: Record<Pillar, number[]> = {
    activate: [], balance: [], protect: [], restore: [],
  }

  for (const axis of axes) pillarValues[axis.pillar].push(axis.value)

  const toLevel = (values: number[]): number => {
    if (values.length === 0) return 3
    const mean = values.reduce((s, v) => s + v, 0) / values.length
    if (mean >= 82) return 5
    if (mean >= 68) return 4
    if (mean >= 52) return 3
    if (mean >= 36) return 2
    return 1
  }

  return `A${toLevel(pillarValues.activate)}-B${toLevel(pillarValues.balance)}-P${toLevel(pillarValues.protect)}-R${toLevel(pillarValues.restore)}`
}

// ─────────────────────────────────────────
// DYNAMIC ARCHETYPE BUILDER
// Construit un archétype unique à partir
// de 3 dimensions : niveau dominant,
// axe le plus fort, axe le plus faible
// ─────────────────────────────────────────

// Descripteurs par niveau de pilier (1-5)
const PILLAR_LEVEL_DESCRIPTORS: Record<Pillar, Record<number, { strong: string; weak: string }>> = {
  activate: {
    5: { strong: 'Peak Performer',       weak: 'Energy Depleted'       },
    4: { strong: 'High Vitality',         weak: 'Moderate Fatigue'      },
    3: { strong: 'Stable Energy',         weak: 'Variable Energy'       },
    2: { strong: 'Low Activation',        weak: 'Chronic Fatigue'       },
    1: { strong: 'Critical Depletion',    weak: 'Severe Energy Deficit' },
  },
  balance: {
    5: { strong: 'Deeply Balanced',       weak: 'Nervous Tension'       },
    4: { strong: 'Well Regulated',        weak: 'Mild Stress Load'      },
    3: { strong: 'Moderately Balanced',   weak: 'Stress Sensitive'      },
    2: { strong: 'Under Pressure',        weak: 'Nervous Overload'      },
    1: { strong: 'System Dysregulated',   weak: 'Autonomic Collapse'    },
  },
  protect: {
    5: { strong: 'Highly Protected',      weak: 'Minor Inflammation'    },
    4: { strong: 'Strong Immunity',       weak: 'Low Inflammation'      },
    3: { strong: 'Moderate Defense',      weak: 'Emerging Inflammation' },
    2: { strong: 'Compromised Defense',   weak: 'Chronic Inflammation'  },
    1: { strong: 'Critical Vulnerability','weak': 'Severe Inflammation' },
  },
  restore: {
    5: { strong: 'Exceptional Recovery',  weak: 'Mild Fatigue'          },
    4: { strong: 'Strong Regeneration',   weak: 'Moderate Recovery Gap' },
    3: { strong: 'Moderate Recovery',     weak: 'Inconsistent Recovery' },
    2: { strong: 'Poor Regeneration',     weak: 'Regeneration Deficit'  },
    1: { strong: 'Critical Recovery Gap', weak: 'Biological Exhaustion' },
  },
}

// Qualificateurs basés sur la combinaison des piliers
const COMBINATION_QUALIFIERS: Array<{
  condition: (levels: Record<Pillar, number>) => boolean
  qualifier: string
  description: string
}> = [
  {
    condition: (l) => l.activate >= 4 && l.balance >= 4 && l.protect >= 4 && l.restore >= 4,
    qualifier: 'archetype_longevity_optimized',
  description: 'archetype_longevity_optimized_desc',
  },
  {
    condition: (l) => l.activate >= 4 && l.balance <= 2,
   qualifier: 'archetype_high_performer_nervous',
    description: 'archetype_high_performer_nervous_desc',
  },
  {
    condition: (l) => l.activate <= 2 && l.restore <= 2,
    qualifier: 'archetype_exhausted_under_regenerating',
    description: 'archetype_exhausted_under_regenerating_desc',
  },
  {
    condition: (l) => l.balance <= 2 && l.restore <= 2,
    qualifier: 'archetype_neuro_regenerative_collapse',
    description: 'archetype_neuro_regenerative_collapse_desc',
  },
  {
    condition: (l) => l.protect <= 2 && l.activate >= 3,
    qualifier: 'archetype_performing_through_inflammation',
    description: 'archetype_performing_through_inflammation_desc',
  },
  {
    condition: (l) => l.protect <= 2 && l.restore <= 2,
    qualifier: 'archetype_biologically_vulnerable',
    description: 'archetype_biologically_vulnerable_desc',
  },
  {
    condition: (l) => Math.min(l.activate, l.balance, l.protect, l.restore) <= 1,
    qualifier: 'archetype_critical_biological_state',
    description: 'archetype_critical_biological_state_desc',
  },
  {
    condition: (l) => l.activate >= 3 && l.balance >= 3 && l.protect <= 2,
    qualifier: 'archetype_resilient_but_inflamed',
    description: 'archetype_resilient_but_inflamed_desc',
  },
  {
    condition: (l) => l.restore >= 4 && l.activate <= 2,
    qualifier: 'archetype_strong_recovery_low_output',
    description: 'archetype_strong_recovery_low_output_desc',
  },
  {
    condition: (l) => Math.min(l.activate, l.balance, l.protect, l.restore) >= 3,
    qualifier: 'archetype_balanced_optimizer',
    description: 'archetype_balanced_optimizer_desc',
  },
]

function buildDynamicArchetype(
  signatureCode: string,
  axes: ProfileAxis[],
): Archetype {
  // Parser le code de signature
  const parts = signatureCode.split('-')
  const levels: Record<Pillar, number> = {
    activate: parseInt(parts[0]?.replace('A', '') ?? '3', 10),
    balance:  parseInt(parts[1]?.replace('B', '') ?? '3', 10),
    protect:  parseInt(parts[2]?.replace('P', '') ?? '3', 10),
    restore:  parseInt(parts[3]?.replace('R', '') ?? '3', 10),
  }

  // Trouver le qualifier qui correspond
  const qualifier = COMBINATION_QUALIFIERS.find(q => q.condition(levels))

  // Axe dominant et axe le plus faible
  const sortedAxes = [...axes].sort((a, b) => b.value - a.value)
  const strongestAxis = sortedAxes[0]
  const weakestAxis = sortedAxes[sortedAxes.length - 1]

  // Pilier dominant (le plus bas)
  const pillarEntries = Object.entries(levels) as Array<[Pillar, number]>
  const dominantPillar = pillarEntries.reduce((min, curr) =>
    curr[1] < min[1] ? curr : min
  )[0]

  // Descripteur du pilier dominant
  const dominantLevel = levels[dominantPillar]
  const dominantDescriptor = PILLAR_LEVEL_DESCRIPTORS[dominantPillar][dominantLevel]

  // Construire le nom dynamique
  const archetypeName = qualifier
    ? qualifier.qualifier
    : `${dominantDescriptor.weak} / ${PILLAR_LEVEL_DESCRIPTORS[
        pillarEntries.reduce((max, curr) => curr[1] > max[1] ? curr : max)[0]
      ][pillarEntries.reduce((max, curr) => curr[1] > max[1] ? curr : max)[1]]?.strong ?? 'Adaptive'}`

  // Construire la description dynamique
  const archetypeDescription = qualifier
    ? qualifier.description
    : `Your biological profile is defined by ${dominantDescriptor.weak.toLowerCase()} in the ${dominantPillar} system, offset by ${strongestAxis?.label.toLowerCase() ?? 'relative strength'} in your strongest domain. Targeted ${dominantPillar} optimization will create the most significant improvement in your overall longevity trajectory.`

  // Pilier primaire = pilier avec le plus de potentiel d'amélioration
  const primaryPillar = dominantPillar

  return {
    id: `dynamic_${signatureCode.replace(/-/g, '_').toLowerCase()}`,
    name: archetypeName,
    description: archetypeDescription,
    primaryPillar,
  }
}

// ─────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────

export function buildProfileVector(
  scores: ScoreMap,
  pillarAdjustments: PillarAdjustments,
): ProfileVector {
  const axes = computeAxes(scores, pillarAdjustments)
  const signatureCode = buildSignatureCode(axes)
  const archetype = buildDynamicArchetype(signatureCode, axes)

  const sorted = [...axes].sort((a, b) => b.value - a.value)
  const dominantAxis = sorted[0]?.label ?? ''
  const weakestAxis = sorted[sorted.length - 1]?.label ?? ''
  const signatureLabel = `${archetype.name} — ${weakestAxis}`

  return {
    axes,
    signatureLabel,
    signatureCode,
    archetype,
    dominantAxis,
    weakestAxis,
  }
}