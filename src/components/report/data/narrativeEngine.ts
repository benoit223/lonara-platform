export function generateNarrativeTone(
  signature: string,
) {

  switch (signature) {

    case 'The Adaptive Strategist':
      return {
        tone:
          'High-performance resilience profile with advanced optimization potential.',
      }

    case 'The Recovery-Depleted Executive':
      return {
        tone:
          'Systemic recovery demand currently exceeds adaptive restoration capacity.',
      }

    case 'The Balanced Optimizer':
      return {
        tone:
          'Stable biological equilibrium with favorable longevity adaptation dynamics.',
      }

    default:
      return {
        tone:
          'Adaptive biological systems demonstrate moderate resilience stability.',
      }
  }
}