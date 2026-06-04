import { SCORE_THRESHOLD_EXCELLENT } from '@/lib/scoreThresholds'

export function generateTrajectory(
  scores: Record<string, number>,
) {

  const longevity =
    scores.longevity || 75


const compositeTrajectory =
  Math.round(
    (
      longevity +
      (scores.mobility || 0) +
      (scores.social || 0) +
      (scores.purpose || 0) +
      (scores.family || 0)
    ) / 5
  )


  let trajectory = 'Stable'

  let optimizedGain =
    '+4.6 Healthy Years'

  let risk =
    'Moderate'

  if (compositeTrajectory >= SCORE_THRESHOLD_EXCELLENT) {
    trajectory = 'Optimized'

    optimizedGain =
      '+8.4 Healthy Years'

    risk = 'Low'
  }

  else if (compositeTrajectory <= 60) {
    trajectory = 'Compromised'

    optimizedGain =
      '+2.1 Healthy Years'

    risk = 'Elevated'
  }

  return {
    trajectory,
    optimizedGain,
    risk,
  }
}