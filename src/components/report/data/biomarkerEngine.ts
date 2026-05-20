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
    | 'Low'
    | 'Moderate'
    | 'High'
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