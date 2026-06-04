export type ProductCategory =
  | 'longevity'
  | 'energy'
  | 'cognition'
  | 'sleep'
  | 'gut'
  | 'immunity'
  | 'recovery'
  | 'topical'

export interface ProductIngredient {
  name: string
  dosage: string
}

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  category: ProductCategory
  format: string
  description: string
  benefits: string[]
  systems: string[]
  ingredients: ProductIngredient[]
  usage: string
  timing: 'morning' | 'midday' | 'evening'
priority:
  | 'foundation'
  | 'optimization'
  | 'targeted'

biologicalTargets: string[]

stackCompatibility: string[]
  scoreTargets: string[]
}

export const products: Product[] = [
  {
    id: 'longevity-core',
    slug: 'longevity-core',
    name: 'Longevity Core',
    tagline: 'The foundation of longevity.',
    category: 'longevity',
    format: 'Capsules',
    description:
      'Daily foundational longevity support for cellular resilience and vitality.',
    benefits: [
      'Cellular support',
      'Energy balance',
      'Antioxidant protection',
    ],
    systems: ['longevity', 'energy', 'recovery'],
    scoreTargets: ['performance', 'recovery', 'longevity'],
    usage: '2 capsules daily',
timing: 'morning',

priority: 'foundation',

biologicalTargets: [
  'Cellular resilience',
  'Mitochondrial function',
  'Longevity support',
],

stackCompatibility: [
  'Neuro Balance',
],

    ingredients: [
      {
        name: 'Panax Ginseng',
        dosage: '300mg',
      },
      {
        name: 'Shilajit',
        dosage: '250mg',
      },
    ],
  },

  {
    id: 'neuro-balance',
    slug: 'neuro-balance',
    name: 'Neuro Balance',
    tagline: 'Focus. Calm. Clarity.',
    category: 'cognition',
    format: 'Capsules',
    description:
      'Cognitive optimization and stress regulation support.',
    benefits: [
      'Mental clarity',
      'Stress reduction',
      'Sleep support',
    ],
    systems: ['cognition', 'stress', 'sleep'],
    scoreTargets: ['stress', 'cognition', 'recovery'],
    usage: '2 capsules daily',
    timing: 'evening',

priority: 'targeted',

biologicalTargets: [
  'Stress regulation',
  'Cognitive resilience',
  'Sleep optimization',
],

stackCompatibility: [
  'Longevity Core',
],
    ingredients: [
      {
        name: 'Lion’s Mane',
        dosage: '250mg',
      },
      {
        name: 'L-Theanine',
        dosage: '200mg',
      },
    ],
  },
]