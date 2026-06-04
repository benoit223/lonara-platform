import {
  getRecommendedProducts,
} from './productEngine'

export interface QuizAnswers {
  sleep: number
  stress: number
  cognition: number
  exercise: number
  recovery: number
  nutrition: number
  energy: number
  inflammation: number
  skin: number

  mobility: number
social: number
family: number
purpose: number
}

export interface LongevityScores {
  performance: number
  stress: number
  exercise: number
  cognition: number
  recovery: number
  inflammation: number
  longevity: number
  skin: number
  sleep: number
energy: number
nutrition: number
  mobility: number
  social: number
  family: number
  purpose: number
}

function clamp(
  value: number,
  min = 0,
  max = 100,
) {
  return Math.max(
    min,
    Math.min(max, value),
  )
}

export function calculateLongevityScores(
  answers: QuizAnswers,
): LongevityScores {
  const performance = clamp(
    answers.exercise * 0.35 +
      answers.energy * 0.4 +
      answers.nutrition * 0.25,
  )

  const stress = clamp(
    100 -
      answers.stress * 0.6 +
      answers.sleep * 0.2,
  )

  const cognition = clamp(
    answers.cognition * 0.5 +
      answers.sleep * 0.2 +
      answers.energy * 0.3,
  )

const recovery =
  Math.min(
    92,
    clamp(
      answers.sleep * 0.45 +
      answers.recovery * 0.35 +
      answers.nutrition * 0.2,
    ),
  )

  const inflammation = clamp(
    100 -
      answers.inflammation * 0.8 +
      answers.nutrition * 0.2,
  )
const skin = clamp(
  answers.skin,
)

const sleep =
  clamp(
    answers.sleep
  )

const mobility =
  clamp(
    (
      answers.exercise * 0.6 +
      answers.recovery * 0.4
    )
  )

const social =
  clamp(
    answers.social
  )

 const longevity = clamp(

  performance * 0.18 +

  stress * 0.16 +

  cognition * 0.16 +

  recovery * 0.18 +

  inflammation * 0.18 +

  mobility * 0.08 +

  social * 0.04 +

  (answers.purpose) * 0.02,
)
return {
  performance:
    Math.round(performance),

  stress:
    Math.round(stress),

  exercise:
    Math.round(
      answers.exercise
    ),

  cognition:
    Math.round(cognition),

  recovery:
    Math.round(recovery),

  inflammation:
    Math.round(inflammation),

  longevity:
    Math.round(longevity),

  skin:
    Math.round(skin),

  sleep:
    Math.round(sleep),

energy:
  Math.round(
    answers.energy
  ),

nutrition:
  Math.round(
    answers.nutrition
  ),
  mobility:
    Math.round(mobility),

  social:
    Math.round(social),

  family:
    Math.round(
      answers.family
    ),

  purpose:
    Math.round(
      answers.purpose
    ),
}
}


export function calculateBiologicalAge(
  chronologicalAge: number | null | undefined,
  scores: any,
  weight?: number | null,
  height?: number | null,
) {

  if (!Number.isFinite(chronologicalAge ?? NaN)) {
    return null
  }

  const longevityDelta =
    (scores.longevity - 50) / 10

  const recoveryDelta =
    (scores.recovery - 50) / 20

  const inflammationDelta =
    (scores.inflammation - 50) / 14

  const sleepDelta =
    (scores.sleep - 50) / 18

  const stressDelta =
    (scores.stress - 50) / 18

  const mobilityDelta =
    (scores.mobility - 50) / 22

  const socialDelta =
    (scores.social - 50) / 28

    const familyDelta =
  ((scores.family) - 50) / 30

const purposeDelta =
  ((scores.purpose) - 50) / 26

  const bmi =
    Number.isFinite(weight ?? NaN) &&
    Number.isFinite(height ?? NaN) &&
    height! > 0
      ? (weight! / ((height! / 100) ** 2))
      : null

  let bmiPenalty = 0

  if (bmi != null) {
    if (bmi >= 30) {
      bmiPenalty = 7
    } else if (bmi >= 27) {
      bmiPenalty = 4
    } else if (bmi >= 25) {
      bmiPenalty = 2
    }
  }

  const biologicalAge =
    chronologicalAge! -
    longevityDelta -
    recoveryDelta -
    inflammationDelta -
    sleepDelta -
    stressDelta -
    mobilityDelta -
    socialDelta -
familyDelta -
purposeDelta +
bmiPenalty

  const clampedAge =
    Math.max(
      chronologicalAge! - 4,
      Math.min(
        chronologicalAge! + 12,
        biologicalAge,
      ),
    )

  return (
    Math.round(
      clampedAge * 10,
    ) / 10
  )
}



export function calculatePercentile(
  score: number,
) {

  if (score >= 95) {
    return 99
  }

  if (score >= 90) {
    return 97
  }

  if (score >= 85) {
    return 93
  }

  if (score >= 80) {
    return 86
  }

  if (score >= 75) {
    return 74
  }

  if (score >= 70) {
    return 60
  }

  if (score >= 65) {
    return 45
  }

  if (score >= 60) {
    return 30
  }

  if (score >= 55) {
    return 18
  }

  if (score >= 50) {
    return 10
  }

  return 5
}

export function generatePriorities(
  scores: LongevityScores,
) {
  const systems = [
    {
      key: 'stress',
      value: scores.stress,
      title: 'priority_stress',
    },
    {
      key: 'recovery',
      value: scores.recovery,
      title: 'priority_recovery',
    },
    {
      key: 'inflammation',
      value: scores.inflammation,
      title: 'priority_inflammation',
    },
    {
      key: 'cognition',
      value: scores.cognition,
      title: 'priority_cognition',
    },
    {
      key: 'mobility',
      value: scores.mobility,
      title: 'priority_mobility',
    },
    {
      key: 'social',
      value: scores.social,
      title: 'priority_social',
    },
  ]

  return systems
    .sort((a, b) => a.value - b.value)
    .slice(0, 3)
    .map((system) => ({
      title: system.title,
      impact:
        system.value < 45
          ? 'impact_immediate'
          : system.value < 70
          ? 'impact_optimization'
          : 'impact_stable',
      severity:
        system.value < 45
          ? 'critical'
          : system.value < 70
          ? 'moderate'
          : 'low',
    }))
}
export function generateRisks(
  scores: LongevityScores,
) {
  const risks = []

  if (scores.stress < 55) {
    risks.push({
      label: 'risk_stress',
      severity: 'Elevated',
    })
  }

  if (scores.recovery < 55) {
    risks.push({
      label: 'risk_recovery',
      severity: 'Moderate',
    })
  }

  if (scores.inflammation < 55) {
    risks.push({
      label: 'risk_inflammation',
      severity: 'Elevated',
    })
  }

  if (scores.mobility < 55) {
    risks.push({
      label: 'risk_mobility',
      severity: 'Moderate',
    })
  }

  if (scores.social < 55) {
    risks.push({
      label: 'risk_social',
      severity: 'Elevated',
    })
  }

  if (scores.family < 45) {
    risks.push({
      label: 'risk_family',
      severity: 'Elevated',
    })
  }

  return risks
}

// Mapping ingrédient → catégories biologiques qu'il supporte
const INGREDIENT_CATEGORY_MAP: Record<string, string[]> = {
  // Sleep / Stress / Balance
  'melatonin':              ['sleep', 'circadian'],
  'glycine':                ['sleep', 'recovery'],
  'ashwagandha':            ['stress', 'sleep', 'hormonal', 'emotional'],
  'l-theanine':             ['stress', 'sleep', 'cognition', 'emotional'],
  'magnesium':              ['sleep', 'stress', 'recovery', 'circadian'],
  'magnesium bisglycinate': ['sleep', 'stress', 'recovery'],
  'phosphatidylserine':     ['stress', 'cognition', 'emotional'],
  'rhodiola':               ['stress', 'energy', 'cognition', 'emotional'],
  'rhodiola rosea':         ['stress', 'energy', 'cognition'],
  'lemon balm':             ['stress', 'sleep', 'emotional'],
  'passionflower':          ['sleep', 'stress'],
  'ashwagandha extract':    ['stress', 'sleep', 'hormonal'],
  'vitamin b6':             ['cognition', 'stress', 'emotional'],

  // Energy / Activate
  'coenzyme q10':           ['energy', 'cardiovascular', 'aging'],
  'creatine monohydrate':   ['energy', 'performance', 'recovery'],
  'acetyl l-carnitine':     ['energy', 'cognition'],
  'alpha lipoic acid':      ['energy', 'inflammation', 'aging', 'metabolism'],
  'pqq':                    ['energy', 'aging'],
  'd-ribose':               ['energy', 'recovery'],
  'taurine':                ['energy', 'cardiovascular'],
  'natural caffeine':       ['energy', 'cognition', 'performance'],
  'vitamin b complex':      ['energy', 'cognition'],
  'ginseng':                ['energy', 'immune', 'hormonal'],
  'panax ginseng':          ['energy', 'immune'],
  'shilajit':               ['energy', 'hormonal', 'aging'],
  'cordyceps':              ['energy', 'immune', 'performance'],

  // Cognition
  "lion's mane":            ['cognition', 'aging'],
  "lion's mane extract":    ['cognition', 'aging'],

  // Gut / Protect
  'lactobacillus':          ['gut', 'immune'],
  'bifidobacterium':        ['gut', 'immune'],
  'inulin':                 ['gut', 'immune'],
  'l-glutamine':            ['gut', 'recovery'],
  'ginger':                 ['gut', 'inflammation'],
  'ginger extract':         ['gut', 'inflammation'],
  'turmeric':               ['gut', 'inflammation'],
  'turmeric extract':       ['gut', 'inflammation'],
  'peppermint':             ['gut'],
  'licorice':               ['gut'],
  'zinc':                   ['immune', 'gut', 'hormonal', 'skin'],
  'zinc bisglycinate':      ['immune', 'gut', 'hormonal'],

  // Inflammation / Protect
  'nac':                    ['inflammation', 'immune', 'aging', 'detox'],
  'n-acetyl l-cysteine':    ['inflammation', 'immune', 'aging'],
  'resveratrol':            ['inflammation', 'aging', 'cardiovascular'],
  'quercetin':              ['inflammation', 'immune', 'aging'],
  'astaxanthin':            ['inflammation', 'aging', 'skin'],
  'selenium':               ['inflammation', 'immune', 'aging'],
  'pterostilbene':          ['inflammation', 'aging'],
  'boswellia':              ['inflammation'],
  'curcumin':               ['inflammation', 'gut'],

  // Immune
  'vitamin c':              ['immune', 'skin', 'inflammation'],
  'vitamin d3':             ['immune', 'hormonal', 'inflammation'],
  'elderberry':             ['immune'],
  'echinacea':              ['immune'],
  'astragalus':             ['immune', 'aging'],
  'reishi':                 ['immune', 'stress'],
  'beta-glucans':           ['immune'],

  // Cardiovascular
  'omega-3':                ['cardiovascular', 'inflammation', 'cognition'],
  'nattokinase':            ['cardiovascular'],
  'garlic':                 ['cardiovascular', 'immune'],

  // Aging / Longevity
  'nad+':                   ['aging', 'energy', 'longevity'],
  'nmn':                    ['aging', 'energy', 'longevity'],
  'fisetin':                ['aging', 'inflammation'],
  'spermidine':             ['aging', 'longevity'],

  // Hormonal
  'tongkat ali':            ['hormonal', 'energy'],
  'maca':                   ['hormonal', 'energy'],
  'dhea':                   ['hormonal', 'aging'],

  // Skin
  'collagen':               ['skin', 'recovery', 'mobility'],
  'vitamin e':              ['skin', 'inflammation'],
  'hyaluronic acid':        ['skin'],
  'rosehip':                ['skin', 'inflammation'],
  'pracaxi':                ['skin'],
  'shea butter':            ['skin'],

  // Recovery
  'tart cherry':            ['recovery', 'sleep', 'inflammation'],
  'magnesium glycinate':    ['recovery', 'sleep', 'stress'],
}

function scoreProduct(
  product: any,
  scores: any,
  weaknesses: string[] = [],
   coveredIngredients: Set<string> = new Set(),
): number {
  let total = 0

  // ── SCORE DE BASE — phase principale ─────────────────────────────────────
  const phaseScoreMap: Record<string, number> = {
    activate: (100 - (scores.energy ?? 50)) * 1.2 + (100 - (scores.cognition ?? 50)) * 1.1,
    balance:  (100 - (scores.stress ?? 50)) * 1.2 + (100 - (scores.sleep ?? 50)) * 1.0,
    protect:  (100 - (scores.inflammation ?? 50)) * 1.5 + (100 - (scores.immune ?? 50)) * 1.3 + (100 - (scores.aging ?? 50)) * 0.8,
    restore:  (100 - (scores.sleep ?? 50)) * 1.2 + (100 - (scores.recovery ?? 50)) * 1.2,
  }
  total += phaseScoreMap[product.protocol_phase] ?? 0

  // ── SCORE INGRÉDIENTS vs WEAKNESSES ──────────────────────────────────────
  // Pour chaque ingrédient du produit, on vérifie s'il supporte une weakness
  const productIngredients = product.product_ingredients ?? []

  for (const ingredientEntry of productIngredients) {
    const ingredientName = ingredientEntry.ingredients?.name?.toLowerCase() ?? ''

    // Chercher une correspondance dans le map
    for (const [mapKey, categories] of Object.entries(INGREDIENT_CATEGORY_MAP)) {
      if (ingredientName.includes(mapKey) || mapKey.includes(ingredientName)) {
        // Pour chaque catégorie que cet ingrédient supporte
        for (const category of categories) {
          const weaknessIndex = weaknesses.indexOf(category)
          if (weaknessIndex !== -1) {
            // Plus la weakness est haute dans la liste (index bas = plus critique), plus le boost est fort
            const boost = 40 - (weaknessIndex * 8)
            total += boost
          }
        }
        break
      }
    }
  }

  // ── BOOST PILIER DOMINANT ENGINE A ───────────────────────────────────────
  if ((scores as any)[`${product.protocol_phase}_priority`] === 100) {
    total += 60
  }
// Pénalité overlap — si les ingrédients sont déjà couverts
  for (const ingredientEntry of productIngredients) {
    const ingredientName = ingredientEntry.ingredients?.name?.toLowerCase() ?? ''
    if (coveredIngredients.has(ingredientName)) {
      total -= 20
    }
  }
  return total
}

export async function recommendProducts(
  scores: LongevityScores,
  weaknesses: string[] = [],
) {

const protocolAxes = {


  
  activate: false,

  balance: false,

  protect: false,

  restore: false,
}

// ======================
// ACTIVATE
// ======================
// Utilise le pilier dominant Engine A pour prioriser
const s = scores as any
const dominantPillar = s['balance_priority'] === 100 ? 'balance'
  : s['activate_priority'] === 100 ? 'activate'
  : s['protect_priority'] === 100 ? 'protect'
  : s['restore_priority'] === 100 ? 'restore'
  : null

// Active toujours la phase dominante Engine A
if (dominantPillar === 'activate' || scores.energy < 60 || scores.cognition < 60) {
  protocolAxes.activate = true
}
if (dominantPillar === 'balance' || scores.stress < 60 || scores.inflammation < 60) {
  protocolAxes.balance = true
}
if (dominantPillar === 'protect' || scores.longevity < 60 || scores.inflammation < 60) {
  protocolAxes.protect = true
}
if (dominantPillar === 'restore' || scores.sleep < 60 || scores.recovery < 60) {
  protocolAxes.restore = true
}

 const products =
  await getRecommendedProducts()

const protocolOnly =
  products.filter(
    (product: any) =>

      product.protocol_phase !==
      'optional' &&

      product.protocol_phase !==
      'topical',
  )
// ======================
// ACTIVATE
// ======================
// Sélection globale — top produits tous phases confondus selon score Engine A
const scoredProducts = protocolOnly
  .map((product: any) => ({
    product,
    score: scoreProduct(product, scores, weaknesses),
  }))
  .sort((a: any, b: any) => b.score - a.score)

const seenPhases = new Set<string>()
const coveredIngredients = new Set<string>()
const recommendations: any[] = []

// 1er produit
for (const { product } of scoredProducts) {
  if (!seenPhases.has(product.protocol_phase)) {
    seenPhases.add(product.protocol_phase)
    recommendations.push(product)
    // Enregistrer les ingrédients couverts
    product.product_ingredients?.forEach((i: any) => {
      if (i.ingredients?.name) coveredIngredients.add(i.ingredients.name.toLowerCase())
    })
    break
  }
}

// Re-scorer avec overlap pour les suivants
const rescoredProducts = protocolOnly
  .filter((p: any) => !seenPhases.has(p.protocol_phase))
  .map((product: any) => ({
    product,
    score: scoreProduct(product, scores, weaknesses, coveredIngredients),
  }))
  .sort((a: any, b: any) => b.score - a.score)

// 2e produit
for (const { product } of rescoredProducts) {
  if (!seenPhases.has(product.protocol_phase)) {
    seenPhases.add(product.protocol_phase)
    recommendations.push(product)
    product.product_ingredients?.forEach((i: any) => {
      if (i.ingredients?.name) coveredIngredients.add(i.ingredients.name.toLowerCase())
    })
    break
  }
}

// Re-scorer à nouveau pour le 3e
const finalScoredProducts = protocolOnly
  .filter((p: any) => !seenPhases.has(p.protocol_phase))
  .map((product: any) => ({
    product,
    score: scoreProduct(product, scores, weaknesses, coveredIngredients),
  }))
  .sort((a: any, b: any) => b.score - a.score)

// 3e produit — forcer protect si absent
const hasProtect = recommendations.some((p: any) => p.protocol_phase === 'protect')
if (!hasProtect) {
  const bestProtect = finalScoredProducts.find(({ product }: any) => product.protocol_phase === 'protect')
  if (bestProtect) recommendations.push(bestProtect.product)
} else {
  for (const { product } of finalScoredProducts) {
    if (!seenPhases.has(product.protocol_phase)) {
      seenPhases.add(product.protocol_phase)
      recommendations.push(product)
      break
    }
  }
}
const protocolProducts =
  recommendations.filter(
    (product: any) =>

      product.protocol_phase !==
      'optional' &&

      product.protocol_phase !==
      'topical',
  )

const lifestyleProducts: any[] = []

// ======================
// ALTERNATIVE PRODUCTS
// ======================

protocolProducts.forEach(
  (protocol: any) => {

    const alternative =

      products

        .filter(
          (product: any) =>

            product.alternative_to ===
            protocol.name,
        )

        .sort(
          (
            a: any,
            b: any,
          ) =>

            scoreProduct(
              b,
              scores,
            ) -

            scoreProduct(
              a,
              scores,
            ),
        )

        [0]

    if (
      alternative
    ) {

      if (
        scoreProduct(
          alternative,
          scores,
        ) < 40
      ) {
        return
      }

      lifestyleProducts.push(
        alternative,
      )
    }
  },
)

// ======================
// SKIN / TOPICAL
// ======================

if (
  scores.skin < 45
) {

  const topical =
    products.find(
      (product: any) =>

        product.category ===
        'topical',
    )

  if (
    topical &&
    !lifestyleProducts.some(
      (item: any) =>
        item.id === topical.id,
    )
  ) {

    lifestyleProducts.push(
      topical,
    )
  }
}


return {

  
  protocolProducts,
  lifestyleProducts,
}


}