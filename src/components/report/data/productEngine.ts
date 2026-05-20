export function generateProductRecommendations(
  scores: Record<string, number>,
) {

  const products = []

  // STRESS
  if (scores.stress <= 65) {
    products.push({
      title: 'Neuro Recovery Complex™',
      category: 'Stress Regulation',
      dosage: '2 capsules evening',
    })
  }

  // SLEEP
  if (scores.sleep <= 70) {
    products.push({
      title: 'Deep Sleep Matrix™',
      category: 'Sleep Optimization',
      dosage: '1 serving before sleep',
    })
  }

  // RECOVERY
  if (scores.recovery <= 70) {
    products.push({
      title: 'Mito Recovery Support™',
      category: 'Recovery Enhancement',
      dosage: '1 serving post-activity',
    })
  }

  // INFLAMMATION
  if (scores.inflammation <= 65) {
    products.push({
      title: 'Inflammation Defense™',
      category: 'Cellular Protection',
      dosage: '2 capsules daily',
    })
  }

  // LONGEVITY
  if (scores.longevity <= 70) {
    products.push({
      title: 'Longevity Foundation™',
      category: 'Healthy Aging Support',
      dosage: 'Daily foundational protocol',
    })
  }

  return products.slice(0, 4)
}