export function generateProtocols(
  scores: Record<string, number>,
) {
  const protocols = []

  // ENERGY
  if (scores.energy < 65) {
    protocols.push({
      title: 'Mitochondrial Energy Protocol',
      priority: 'High',
      description:
        'Focused on ATP production, mitochondrial resilience and cellular energy optimization.',
      recommendations: [
        'CoQ10',
        'PQQ',
        'NAD+ Support',
        'Magnesium Glycinate',
      ],
    })
  }

  // STRESS
  if (scores.stress < 65) {
    protocols.push({
      title: 'Neuro Recovery Protocol',
      priority: 'High',
      description:
        'Designed to regulate nervous system overload and optimize stress adaptation.',
      recommendations: [
        'Ashwagandha',
        'L-Theanine',
        'Magnesium',
        'Apigenin',
      ],
    })
  }

  // SLEEP
  if (scores.sleep < 65) {
    protocols.push({
      title: 'Sleep Optimization Protocol',
      priority: 'High',
      description:
        'Improves circadian rhythm alignment and deep recovery quality.',
      recommendations: [
        'Magnesium Threonate',
        'Glycine',
        'Apigenin',
        'Melatonin Support',
      ],
    })
  }

  // INFLAMMATION
  if (scores.inflammation < 65) {
    protocols.push({
      title: 'Inflammation Reduction Protocol',
      priority: 'Medium',
      description:
        'Targets systemic inflammation and recovery optimization.',
      recommendations: [
        'Omega-3',
        'Curcumin',
        'Resveratrol',
        'Green Tea Extract',
      ],
    })
  }

  // GUT
  if (scores.gut < 65) {
    protocols.push({
      title: 'Gut Health Optimization Protocol',
      priority: 'Medium',
      description:
        'Supports microbiome resilience and digestive performance.',
      recommendations: [
        'Probiotics',
        'Digestive Enzymes',
        'Glutamine',
        'Prebiotic Fiber',
      ],
    })
  }

  // COGNITION
  if (scores.cognition < 65) {
    protocols.push({
      title: 'Cognitive Performance Protocol',
      priority: 'Medium',
      description:
        'Enhances focus, neuroprotection and cognitive resilience.',
      recommendations: [
        'Lion’s Mane',
        'Alpha-GPC',
        'Citicoline',
        'Omega-3',
      ],
    })
  }

  // RECOVERY
  if (scores.recovery < 65) {
    protocols.push({
      title: 'Recovery Optimization Protocol',
      priority: 'Medium',
      description:
        'Supports physical recovery and biological regeneration.',
      recommendations: [
        'Electrolytes',
        'Creatine',
        'Protein Optimization',
        'Magnesium',
      ],
    })
  }

  // LONGEVITY
  if (scores.longevity < 70) {
    protocols.push({
      title: 'Longevity Foundation Protocol',
      priority: 'Low',
      description:
        'General healthy aging and long-term vitality optimization.',
      recommendations: [
        'Vitamin D3 + K2',
        'Omega-3',
        'NAC',
        'Polyphenols',
      ],
    })
  }

  // DEFAULT
  if (protocols.length === 0) {
    protocols.push({
      title: 'Foundational Longevity Stack',
      priority: 'Baseline',
      description:
        'Your biological profile appears relatively optimized. Focus on maintenance and long-term resilience.',
      recommendations: [
        'Omega-3',
        'Magnesium',
        'Vitamin D3',
        'Polyphenols',
      ],
    })
  }

  return protocols
}