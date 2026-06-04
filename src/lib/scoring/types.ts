// lib/scoring/types.ts
// Types partagés — aucune logique, aucun import

export type ScoreMap = Record<string, number>

export type Pillar = 'activate' | 'balance' | 'protect' | 'restore'

export interface Flag {
  category: string
  message: string
  severity: 'info' | 'warning' | 'critical'
}

export interface PillarAdjustments {
  activate: number
  balance: number
  protect: number
  restore: number
}

export interface PillarScores {
  activate: number
  balance: number
  protect: number
  restore: number
}

export interface Pattern {
  id: string
  label: string
  description: string
  pillar: Pillar
  severity: 'optimal' | 'moderate' | 'critical'
  affectedCategories: string[]
  pillarImpact: Partial<PillarAdjustments>
}

export interface PatternResult {
  detected: Pattern[]
  pillarAdjustments: PillarAdjustments
  narrative: string
  dominantPillar: Pillar
}

export interface ProfileAxis {
  id: string
  label: string
  pillar: Pillar
  value: number
}

export interface Archetype {
  id: string
  name: string
  description: string
  primaryPillar: Pillar
}

export interface ProfileVector {
  axes: ProfileAxis[]
  signatureLabel: string
  signatureCode: string
  archetype: Archetype
  dominantAxis: string
  weakestAxis: string
}

export interface EngineAResult {
  scores: ScoreMap
  pillarScores: PillarScores
  longevityScore: number
  biologicalAge: number
  percentile: number
  strengths: string[]
  weaknesses: string[]
  flags: Flag[]
  profileSummary: string
  patterns: Pattern[]
  dominantPillar: Pillar
  patternNarrative: string
  profileVector: ProfileVector
}