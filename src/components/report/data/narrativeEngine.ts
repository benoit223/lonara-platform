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

case 'The Purpose-Driven Optimizer':
  return {
    tone:
      'Strong psychological alignment and adaptive behavioral resilience support favorable long-term longevity dynamics.',
  }

  case 'The Socially Resilient Profile':
  return {
    tone:
      'Psychosocial resilience patterns demonstrate strong adaptive stability and favorable neuroendocrine regulation.',
  }

  case 'The Mobility-Compromised Profile':
  return {
    tone:
      'Functional mobility constraints may currently reduce systemic resilience and healthy aging efficiency.',
  }

  case 'The Inflammatory High-Risk Profile':
  return {
    tone:
      'Elevated inflammatory burden patterns suggest increased long-term systemic vulnerability and recovery demand.',
  }

  case 'The Longevity Elite':
  return {
    tone:
      'Exceptional adaptive resilience patterns support advanced longevity optimization and sustainable biological performance.',
  }



    default:
      return {
        tone:
          'Adaptive biological systems demonstrate moderate resilience stability.',
      }
  }
}