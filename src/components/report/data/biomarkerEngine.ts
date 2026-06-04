import {
  SCORE_THRESHOLD_GOOD,
  SCORE_THRESHOLD_LOW,
} from '@/lib/scoreThresholds'

export type Biomarker = {
  id: string

  label: string

  value: number

  unit: string

  optimalMin: number

  optimalMax: number

  category:
    | 'Inflammation'
    | 'Metabolic'
    | 'Hormonal'
    | 'Longevity'
    | 'Cardiovascular'

 impact:
  | 'Stable'
  | 'Optimization Needed'
  | 'Immediate Attention'
}
export function generateDynamicBiomarkers(
  scores: Record<string, number>,
) {

  const biomarkers: Biomarker[] = [

    {
      id: 'crp',

      label: 'hs-CRP',

      value:
        scores.inflammation >= SCORE_THRESHOLD_GOOD
          ? 0.8
          : scores.inflammation >= SCORE_THRESHOLD_LOW
          ? 1.6
          : 3.2,

      unit: 'mg/L',

      optimalMin: 0,

      optimalMax: 1,

      category: 'Inflammation',

      impact: 'Immediate Attention',
    },

    {
      id: 'hba1c',

      label: 'HbA1c',

      value:
        scores.longevity >= SCORE_THRESHOLD_GOOD
          ? 5.1
          : scores.longevity >= SCORE_THRESHOLD_LOW
          ? 5.5
          : 5.9,

      unit: '%',

      optimalMin: 4.8,

      optimalMax: 5.3,

      category: 'Metabolic',

      impact: 'Optimization Needed',
    },

    {
      id: 'vitd',

      label: 'Vitamin D',

      value:
        scores.recovery >= SCORE_THRESHOLD_GOOD
          ? 52
          : scores.recovery >= SCORE_THRESHOLD_LOW
          ? 38
          : 24,

      unit: 'ng/mL',

      optimalMin: 40,

      optimalMax: 70,

      category: 'Longevity',

      impact: 'Optimization Needed',
    },

    {
      id: 'hrv',

      label: 'HRV',

      value:
        scores.stress >= SCORE_THRESHOLD_GOOD
          ? 72
          : scores.stress >= SCORE_THRESHOLD_LOW
          ? 54
          : 38,

      unit: 'ms',

      optimalMin: 55,

      optimalMax: 90,

      category: 'Cardiovascular',

      impact: 'Optimization Needed',
    },

    {
      id: 'cortisol',

      label: 'Morning Cortisol',

      value:
        scores.stress >= SCORE_THRESHOLD_GOOD
          ? 14
          : scores.stress >= SCORE_THRESHOLD_LOW
          ? 18
          : 26,

      unit: 'µg/dL',

      optimalMin: 10,

      optimalMax: 18,

      category: 'Hormonal',

      impact: 'Immediate Attention',
    },
  ]

  return biomarkers
}

export function analyzeBiomarkers(
  biomarkers: Biomarker[],
) {

  const findings: {
  label: string
  category: string
  status: string
  impact: string
}[] = []

  biomarkers.forEach((marker) => {

    const below =
      marker.value < marker.optimalMin

    const above =
      marker.value > marker.optimalMax

    if (below || above) {

      findings.push({
        label: marker.label,

        category: marker.category,

        status: below
          ? 'Below Optimal'
          : 'Above Optimal',

        impact: marker.impact,
      })
    }
  })

  return findings
}