export function generateTrajectory(
  scores: Record<string, number>,
) {

  const longevity =
    scores.longevity || 75

  let trajectory = 'Stable'

  let optimizedGain =
    '+3.8 Healthy Years'

  let risk =
    'Moderate'

  if (longevity >= 85) {
    trajectory = 'Optimized'

    optimizedGain =
      '+7.2 Healthy Years'

    risk = 'Low'
  }

  else if (longevity <= 60) {
    trajectory = 'Compromised'

    optimizedGain =
      '+1.9 Healthy Years'

    risk = 'Elevated'
  }

  return {
    trajectory,
    optimizedGain,
    risk,
  }
}