export function generateProtocols(
  scores: Record<string, number>,
) {

  const protocols = []

  // MORNING

  protocols.push({
    title: 'Morning Activation Protocol',

    period: 'Morning',

    objective:
      scores.energy < 65
        ? 'Restore mitochondrial activation and stabilize morning energy output.'
        : 'Maintain cognitive activation and metabolic stability.',

    recommendations: [
      ...(scores.energy < 65
        ? [
            'CoQ10',
            'PQQ',
            'NAD+ Support',
          ]
        : []),

      ...(scores.cognition < 65
        ? [
            'Lion’s Mane',
            'Citicoline',
          ]
        : []),

      'Morning Sunlight',
      'Hydration Protocol',
    ],
  })

  // MIDDAY

  protocols.push({
    title: 'Midday Stress Regulation',

    period: 'Midday',

    objective:
      scores.stress < 65
        ? 'Reduce sympathetic overload and stabilize adaptive resilience.'
        : 'Support sustained autonomic balance and cognitive performance.',

    recommendations: [
      ...(scores.stress < 65
        ? [
            'L-Theanine',
            'Ashwagandha',
          ]
        : []),

      ...(scores.inflammation < 65
        ? [
            'Curcumin',
            'Omega-3',
          ]
        : []),

      'Breathwork Reset',
      'Circadian Walk',
    ],
  })

  // EVENING

  protocols.push({
    title: 'Evening Recovery Protocol',

    period: 'Evening',

    objective:
      scores.recovery < 65
        ? 'Deepen parasympathetic recovery and regenerative efficiency.'
        : 'Maintain restorative sleep architecture and recovery capacity.',

    recommendations: [
      ...(scores.sleep < 65
        ? [
            'Apigenin',
            'Magnesium Glycinate',
            'Glycine',
          ]
        : []),

      ...(scores.recovery < 65
        ? [
            'Electrolytes',
            'Protein Recovery',
          ]
        : []),

      'Blue Light Reduction',
      'Sleep Optimization',
    ],
  })

  return protocols
}
