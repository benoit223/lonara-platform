export function getBiologicalStatus(
  score: number,
) {

  if (score >= 85) {
    return {
      label: 'Optimized',
      color: 'text-emerald-400',
    }
  }

  if (score >= 70) {
    return {
      label: 'Stable',
      color: 'text-cyan-300',
    }
  }

  if (score >= 55) {
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