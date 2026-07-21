import { SupabaseClient } from '@supabase/supabase-js'

export interface VisualSignals {
  fatigue_signs?: string
  vascularity_load_percent?: number
  texture_score?: number
  glogau_stage?: string
  adiposity_distribution?: string
  waist_hip_ratio_estimate?: number | null
  sarcopenia_indicators?: string
  muscle_tone?: { arms: string; core: string; legs: string }
}

export interface FuelSignals {
  inflammatoryAlertCount: number
  highSugarRatio: number
  glycemicAlertCount: number
  highSodiumRatio: number
  proteinBelowTargetRatio: number
  eveningMisalignedCount: number
  totalLogsConsidered: number
}

export interface CorrelationResult {
  domain: string
  assessmentSignal: boolean
  visualSignal: boolean
  fuelSignal: boolean
  confirmed: boolean
  reason: string
}

const MUSCLE_LOW = new Set(['low'])
const FATIGUE_SIGNIFICANT = new Set(['moderate', 'pronounced'])
const GLOGAU_ADVANCED = new Set(['III', 'IV'])
const SARCOPENIA_SIGNIFICANT = new Set(['moderate', 'pronounced'])

function isMuscleToneLow(tone?: { arms: string; core: string; legs: string }): boolean {
  if (!tone) return false
  const values = [tone.arms, tone.core, tone.legs]
  return values.filter(v => MUSCLE_LOW.has(v)).length >= 2
}

function isWaistHipElevated(ratio: number | null | undefined, sex: string): boolean {
  if (ratio == null) return false
  return sex === 'female' ? ratio > 0.85 : ratio > 0.90
}

export function correlateDomains(
  weaknesses: string[],
  visual: VisualSignals | null,
  fuel: FuelSignals | null,
  sex: string,
): CorrelationResult[] {
  const results: CorrelationResult[] = []

  {
    const assessmentSignal = weaknesses.includes('inflammation')
    const visualSignal = !!visual && (
      (visual.vascularity_load_percent ?? 0) >= 30 ||
      FATIGUE_SIGNIFICANT.has(visual.fatigue_signs ?? '')
    )
    const fuelSignal = !!fuel && fuel.inflammatoryAlertCount >= 2
    results.push({
      domain: 'inflammation',
      assessmentSignal, visualSignal, fuelSignal,
      confirmed: assessmentSignal && visualSignal && fuelSignal,
      reason: 'vascularity/fatigue signals + recurring inflammatory meal alerts',
    })
  }

  {
    const assessmentSignal = weaknesses.includes('skin') || weaknesses.includes('aging')
    const visualSignal = !!visual && (
      GLOGAU_ADVANCED.has(visual.glogau_stage ?? '') ||
      (visual.texture_score ?? 0) >= 6
    )
    const fuelSignal = !!fuel && fuel.highSugarRatio >= 0.4
    results.push({
      domain: 'skin_aging',
      assessmentSignal, visualSignal, fuelSignal,
      confirmed: assessmentSignal && visualSignal && fuelSignal,
      reason: 'Glogau/texture signals + high sugar intake frequency',
    })
  }

  {
    const assessmentSignal = weaknesses.includes('metabolism')
    const visualSignal = !!visual && (
      visual.adiposity_distribution === 'android' ||
      isWaistHipElevated(visual.waist_hip_ratio_estimate, sex)
    )
    const fuelSignal = !!fuel && fuel.glycemicAlertCount >= 2
    results.push({
      domain: 'metabolism',
      assessmentSignal, visualSignal, fuelSignal,
      confirmed: assessmentSignal && visualSignal && fuelSignal,
      reason: 'android adiposity/elevated waist-hip ratio + glycemic alerts',
    })
  }

  {
    const assessmentSignal = weaknesses.includes('recovery') || weaknesses.includes('sleep')
    const visualSignal = !!visual && FATIGUE_SIGNIFICANT.has(visual.fatigue_signs ?? '')
    const fuelSignal = !!fuel && fuel.eveningMisalignedCount >= 2
    results.push({
      domain: 'recovery_sleep',
      assessmentSignal, visualSignal, fuelSignal,
      confirmed: assessmentSignal && visualSignal && fuelSignal,
      reason: 'visible fatigue signs + misaligned evening meal patterns',
    })
  }

  {
    const assessmentSignal = weaknesses.includes('exercise') || weaknesses.includes('mobility')
    const visualSignal = !!visual && (
      SARCOPENIA_SIGNIFICANT.has(visual.sarcopenia_indicators ?? '') ||
      isMuscleToneLow(visual.muscle_tone)
    )
    const fuelSignal = !!fuel && fuel.proteinBelowTargetRatio >= 0.5
    results.push({
      domain: 'exercise_mobility',
      assessmentSignal, visualSignal, fuelSignal,
      confirmed: assessmentSignal && visualSignal && fuelSignal,
      reason: 'sarcopenia indicators/low muscle tone + insufficient protein intake',
    })
  }

  {
    const assessmentSignal = weaknesses.includes('cardiovascular')
    const visualSignal = !!visual && isWaistHipElevated(visual.waist_hip_ratio_estimate, sex)
    const fuelSignal = !!fuel && fuel.highSodiumRatio >= 0.4
    results.push({
      domain: 'cardiovascular',
      assessmentSignal, visualSignal, fuelSignal,
      confirmed: assessmentSignal && visualSignal && fuelSignal,
      reason: 'elevated waist-hip ratio + frequent high-sodium intake',
    })
  }

  return results
}

export function getConfirmedDomains(results: CorrelationResult[]): string[] {
  return results.filter(r => r.confirmed).map(r => r.domain)
}

export async function aggregateFuelSignals(
  supabase: SupabaseClient,
  userId: string,
): Promise<FuelSignals | null> {
  const since = new Date()
  since.setDate(since.getDate() - 30)

  const { data: logs } = await supabase
    .from('fuel_logs')
    .select('alerts, macros, meal_time, time_of_day, created_at, identified_foods')
    .eq('user_id', userId)
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: false })
    .limit(60)

  if (!logs || logs.length === 0) return null

  const { data: activeSprint } = await supabase
    .from('fuel_sprints')
    .select('macro_targets')
    .eq('user_id', userId)
    .eq('is_active', true)
    .maybeSingle()

  const proteinTarget = activeSprint?.macro_targets?.protein_g?.max ?? null

  let inflammatoryAlertCount = 0
  let glycemicAlertCount = 0
  let highSodiumCount = 0
  let highSugarCount = 0
  let proteinBelowCount = 0
  let eveningMisalignedCount = 0
  let macroLogsConsidered = 0

  for (const log of logs) {
    const alerts: { type: string; message: string }[] = log.alerts ?? []
    for (const a of alerts) {
      const msg = (a.message ?? '').toLowerCase()
      if (msg.includes('inflam')) inflammatoryAlertCount++
      if (msg.includes('sugar') || msg.includes('glyc') || msg.includes('blood sugar')) glycemicAlertCount++
      if (msg.includes('sodium') || msg.includes('salt')) highSodiumCount++
    }

    const macros = log.macros as { protein: number; carbs: number; fat: number; kcal: number } | null
    if (macros) {
      macroLogsConsidered++
      const carbCalRatio = macros.kcal > 0 ? (macros.carbs * 4) / macros.kcal : 0
      if (carbCalRatio > 0.55) highSugarCount++

      if (proteinTarget && macros.protein < proteinTarget * 0.7 / 3) {
        proteinBelowCount++
      }
    }

    if (log.meal_time === 'dinner' && log.time_of_day === 'nuit') {
      eveningMisalignedCount++
    }
  }

  return {
    inflammatoryAlertCount,
    highSugarRatio: macroLogsConsidered > 0 ? highSugarCount / macroLogsConsidered : 0,
    glycemicAlertCount,
    highSodiumRatio: logs.length > 0 ? highSodiumCount / logs.length : 0,
    proteinBelowTargetRatio: macroLogsConsidered > 0 ? proteinBelowCount / macroLogsConsidered : 0,
    eveningMisalignedCount,
    totalLogsConsidered: logs.length,
  }
}

export async function getLatestVisualSignals(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ signals: VisualSignals | null; latestAnalysisAt: string | null }> {
  const { data: analyses } = await supabase
    .from('visual_analyses')
    .select('capture_type, analysis, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (!analyses || analyses.length === 0) return { signals: null, latestAnalysisAt: null }

  const latestFace = analyses.find(a => a.capture_type === 'face')
  const latestBody = analyses.find(a => a.capture_type === 'body')

  const faceAnalysis = latestFace?.analysis as any
  const bodyAnalysis = latestBody?.analysis as any

  const signals: VisualSignals = {
    fatigue_signs: faceAnalysis?.fatigue_signs,
    vascularity_load_percent: faceAnalysis?.vascularity_load_percent,
    texture_score: faceAnalysis?.texture_score,
    glogau_stage: faceAnalysis?.glogau_stage,
    adiposity_distribution: bodyAnalysis?.adiposity_distribution,
    waist_hip_ratio_estimate: bodyAnalysis?.waist_hip_ratio_estimate,
    sarcopenia_indicators: bodyAnalysis?.sarcopenia_indicators,
    muscle_tone: bodyAnalysis?.muscle_tone,
  }

  const latestAnalysisAt = analyses[0]?.created_at ?? null

  return { signals, latestAnalysisAt }
}