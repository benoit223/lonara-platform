import {
  SCORE_THRESHOLD_EXCELLENT,
  SCORE_THRESHOLD_MODERATE,
  SCORE_THRESHOLD_COMPROMISED,
} from '@/lib/scoreThresholds'

export function getBiologicalStatus(
  score: number,
) {

  if (score >= SCORE_THRESHOLD_EXCELLENT) {
    return {
      label: 'Optimized',
      color: 'text-emerald-400',
    }
  }

  if (score >= SCORE_THRESHOLD_MODERATE) {
    return {
      label: 'Stable',
      color: 'text-cyan-300',
    }
  }

  if (score >= SCORE_THRESHOLD_COMPROMISED) {
    return {
      label: 'Elevated',
      color: 'text-amber-300',
    }
  }

  return {
    label: 'Compromised',
    color: 'text-red-300',
  }
}