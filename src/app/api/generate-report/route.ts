import { NextResponse } from 'next/server'

import {
  calculateLongevityScores,
  calculateBiologicalAge,
  calculatePercentile,
  recommendProducts,
} from '@/lib/longevityEngine'

import { generateLongevityReport } from '@/components/report/data/scoringEngine'
import { generateAdvancedScores } from '@/lib/advancedScoring'
import { generateAINarrative } from '@/lib/report/generateAINarrative'

const ARCHETYPE_NAMES_EN: Record<string, string> = {
  'archetype_longevity_optimized': 'Longevity Optimized',
  'archetype_high_performer_nervous': 'High Performer Under Nervous Pressure',
  'archetype_exhausted_under_regenerating': 'Exhausted and Under-Regenerating',
  'archetype_neuro_regenerative_collapse': 'Neuro-Regenerative Collapse',
  'archetype_performing_through_inflammation': 'Performing Through Inflammation',
  'archetype_biologically_vulnerable': 'Biologically Vulnerable',
  'archetype_critical_biological_state': 'Critical Biological State',
  'archetype_resilient_but_inflamed': 'Resilient but Inflamed',
  'archetype_strong_recovery_low_output': 'Strong Recovery, Low Output',
  'archetype_balanced_optimizer': 'Balanced Optimizer',
}
const ARCHETYPE_NAMES_FR: Record<string, string> = {
  'archetype_longevity_optimized': 'Longévité Optimisée',
  'archetype_high_performer_nervous': 'Haute Performance Sous Pression Nerveuse',
  'archetype_exhausted_under_regenerating': 'Épuisé et Sous-Régénéré',
  'archetype_neuro_regenerative_collapse': 'Effondrement Neuro-Régénératif',
  'archetype_performing_through_inflammation': 'Performance Malgré l\'Inflammation',
  'archetype_biologically_vulnerable': 'Biologiquement Vulnérable',
  'archetype_critical_biological_state': 'État Biologique Critique',
  'archetype_resilient_but_inflamed': 'Résilient mais Enflammé',
  'archetype_strong_recovery_low_output': 'Forte Récupération, Faible Rendement',
  'archetype_balanced_optimizer': 'Optimiseur Équilibré',
}

const ARCHETYPE_NAMES_ES: Record<string, string> = {
  'archetype_longevity_optimized': 'Longevidad Optimizada',
  'archetype_high_performer_nervous': 'Alto Rendimiento Bajo Presión Nerviosa',
  'archetype_exhausted_under_regenerating': 'Agotado y Sub-Regenerado',
  'archetype_neuro_regenerative_collapse': 'Colapso Neuro-Regenerativo',
  'archetype_performing_through_inflammation': 'Rendimiento a Pesar de la Inflamación',
  'archetype_biologically_vulnerable': 'Biológicamente Vulnerable',
  'archetype_critical_biological_state': 'Estado Biológico Crítico',
  'archetype_resilient_but_inflamed': 'Resiliente pero Inflamado',
  'archetype_strong_recovery_low_output': 'Fuerte Recuperación, Bajo Rendimiento',
  'archetype_balanced_optimizer': 'Optimizador Equilibrado',
}

const ARCHETYPE_DESCS_EN: Record<string, string> = {
  'archetype_longevity_optimized_desc': 'All four biological pillars operating at high efficiency. You represent the top tier of biological optimization.',
  'archetype_high_performer_nervous_desc': 'Strong physical output but autonomic system overloaded. Performance is sustainable only with immediate nervous system support.',
  'archetype_exhausted_under_regenerating_desc': 'Both energy generation and recovery are critically compromised. The body is in a depletion spiral that requires urgent intervention.',
  'archetype_neuro_regenerative_collapse_desc': 'Nervous system dysregulation is preventing adequate recovery. Sleep, stress and regeneration form a destructive feedback loop.',
  'archetype_performing_through_inflammation_desc': 'Maintaining output despite significant inflammatory burden. Cellular damage is accumulating silently beneath the performance.',
  'archetype_biologically_vulnerable_desc': 'Both protection and regeneration are compromised. The body lacks both the defenses and the recovery capacity to maintain long-term health.',
  'archetype_critical_biological_state_desc': 'At least one pillar has reached a critical threshold. Immediate structured intervention is essential to prevent further biological decline.',
  'archetype_resilient_but_inflamed_desc': 'Good energy and mental balance, but inflammatory burden is the hidden threat to long-term vitality and biological age.',
  'archetype_strong_recovery_low_output_desc': 'Excellent regenerative capacity but energy generation is underperforming. Recovery potential is there — activation is the missing key.',
  'archetype_balanced_optimizer_desc': 'No critical deficits across any pillar. A well-rounded biological profile with clear pathways for targeted optimization.',
}

const ARCHETYPE_DESCS_FR: Record<string, string> = {
  'archetype_longevity_optimized_desc': 'Les quatre piliers biologiques fonctionnent à haute efficacité. Vous représentez le niveau supérieur de l\'optimisation biologique.',
  'archetype_high_performer_nervous_desc': 'Fort rendement physique mais système autonome surchargé. La performance n\'est durable qu\'avec un soutien immédiat du système nerveux.',
  'archetype_exhausted_under_regenerating_desc': 'La génération d\'énergie et la récupération sont toutes deux critiquement compromises. Le corps est dans une spirale d\'épuisement qui nécessite une intervention urgente.',
  'archetype_neuro_regenerative_collapse_desc': 'La dérégulation du système nerveux empêche une récupération adéquate. Sommeil, stress et régénération forment une boucle de rétroaction destructrice.',
  'archetype_performing_through_inflammation_desc': 'Maintien des performances malgré une charge inflammatoire significative. Les dommages cellulaires s\'accumulent silencieusement sous la performance.',
  'archetype_biologically_vulnerable_desc': 'La protection et la régénération sont toutes deux compromises. Le corps manque à la fois des défenses et de la capacité de récupération pour maintenir une santé à long terme.',
  'archetype_critical_biological_state_desc': 'Au moins un pilier a atteint un seuil critique. Une intervention structurée immédiate est essentielle pour prévenir un déclin biologique supplémentaire.',
  'archetype_resilient_but_inflamed_desc': 'Bonne énergie et équilibre mental, mais la charge inflammatoire est la menace cachée pour la vitalité à long terme et l\'âge biologique.',
  'archetype_strong_recovery_low_output_desc': 'Excellente capacité régénérative mais la génération d\'énergie est sous-performante. Le potentiel de récupération est là — l\'activation est la clé manquante.',
  'archetype_balanced_optimizer_desc': 'Aucun déficit critique dans aucun pilier. Un profil biologique équilibré avec des voies claires pour une optimisation ciblée.',
}

const ARCHETYPE_DESCS_ES: Record<string, string> = {
  'archetype_longevity_optimized_desc': 'Los cuatro pilares biológicos funcionan con alta eficiencia. Representa el nivel superior de optimización biológica.',
  'archetype_high_performer_nervous_desc': 'Fuerte rendimiento físico pero sistema autónomo sobrecargado. El rendimiento solo es sostenible con soporte inmediato del sistema nervioso.',
  'archetype_exhausted_under_regenerating_desc': 'La generación de energía y la recuperación están críticamente comprometidas. El cuerpo está en una espiral de agotamiento que requiere intervención urgente.',
  'archetype_neuro_regenerative_collapse_desc': 'La desregulación del sistema nervioso impide una recuperación adecuada. Sueño, estrés y regeneración forman un bucle de retroalimentación destructivo.',
  'archetype_performing_through_inflammation_desc': 'Mantenimiento del rendimiento a pesar de una carga inflamatoria significativa. El daño celular se acumula silenciosamente bajo el rendimiento.',
  'archetype_biologically_vulnerable_desc': 'Tanto la protección como la regeneración están comprometidas. El cuerpo carece de defensas y capacidad de recuperación para mantener la salud a largo plazo.',
  'archetype_critical_biological_state_desc': 'Al menos un pilar ha alcanzado un umbral crítico. La intervención estructurada inmediata es esencial para prevenir un mayor declive biológico.',
  'archetype_resilient_but_inflamed_desc': 'Buena energía y equilibrio mental, pero la carga inflamatoria es la amenaza oculta para la vitalidad a largo plazo y la edad biológica.',
  'archetype_strong_recovery_low_output_desc': 'Excelente capacidad regenerativa pero la generación de energía está por debajo. El potencial de recuperación está ahí — la activación es la clave que falta.',
  'archetype_balanced_optimizer_desc': 'Sin déficits críticos en ningún pilar. Un perfil biológico equilibrado con caminos claros para una optimización específica.',
}

export async function POST(req: Request) {

  const body = await req.json()

  // ── ENGINE A — source de vérité unique ───────────────────────────────────
  const engineA = body.engineA ?? null

  // ── SCORES — Engine A est la source de vérité ────────────────────────────
  const sourceScores = engineA
    ? { ...body.scores, ...engineA.scores }
    : body.scores

  // ── CALCUL MINIMAL pour recommendProducts (nécessite LongevityScores type) 
  const calculatedScores = calculateLongevityScores({
    sleep:         sourceScores.sleep         ?? 50,
    stress:        sourceScores.stress        ?? 50,
    cognition:     sourceScores.cognition     ?? 50,
    exercise:      sourceScores.exercise      ?? 50,
    recovery:      sourceScores.recovery      ?? 50,
    nutrition:     sourceScores.nutrition     ?? 50,
    energy:        sourceScores.energy        ?? 50,
    inflammation:  sourceScores.inflammation  ?? 50,
    skin:          sourceScores.skin          ?? 50,
    mobility:      sourceScores.mobility      ?? 50,
    social:        sourceScores.social        ?? 50,
    family:        sourceScores.family        ?? 50,
    purpose:       sourceScores.purpose       ?? 50,
  })

  const advancedScores = generateAdvancedScores({
    scores: sourceScores,
    age: body.age,
    sex: body.sex,
    weight: body.weight,
    height: body.height,
    completionTime: body.completionTime || 600,
  })

  // ── SCORES GLOBAUX — Engine A uniquement ─────────────────────────────────
  const longevityScore = engineA?.longevityScore
    ?? calculatedScores.longevity
    ?? 50

  const biologicalAge = engineA?.biologicalAge
    ?? calculateBiologicalAge(body.age, calculatedScores, body.weight, body.height)

  const percentile = engineA?.percentile
    ?? calculatePercentile(calculatedScores.longevity)

  // ── PILIERS — Engine A uniquement ────────────────────────────────────────
  const pillarScores = engineA?.pillarScores ?? {
    activate: Math.round(((sourceScores.energy ?? 50) + (sourceScores.cognition ?? 50) + (sourceScores.exercise ?? 50)) / 3),
    balance:  Math.round(((sourceScores.stress ?? 50) + (sourceScores.sleep ?? 50) + (sourceScores.emotional ?? 50)) / 3),
    protect:  Math.round(((sourceScores.inflammation ?? 50) + (sourceScores.immune ?? 50) + (sourceScores.cardiovascular ?? 50)) / 3),
    restore:  Math.round(((sourceScores.recovery ?? 50) + (sourceScores.longevity ?? 50) + (sourceScores.resilience ?? 50)) / 3),
  }

  // ── PRIORITIES — 100% Engine A ───────────────────────────────────────────
  // Construites depuis les flags + weaknesses Engine A
  // L'ancien generatePriorities est supprimé de la chaîne principale
  const priorities = engineA
    ? [
        // Flags critiques en tête
        ...(engineA.flags ?? [])
          .filter((f: any) => f.severity === 'critical')
          .slice(0, 3)
          .map((f: any) => ({
            title: f.message,
            impact: 'impact_immediate',
            severity: 'critical',
          })),
        // Weaknesses Engine A comme priorities supplémentaires
        ...(engineA.weaknesses ?? [])
          .slice(0, 3)
          .map((w: string) => ({
            title: `priority_${w}`,
            impact: (sourceScores[w] ?? 50) < 45
              ? 'impact_immediate'
              : (sourceScores[w] ?? 50) < 70
              ? 'impact_optimization'
              : 'impact_stable',
            severity: (sourceScores[w] ?? 50) < 45
              ? 'critical'
              : (sourceScores[w] ?? 50) < 70
              ? 'moderate'
              : 'low',
          })),
      ]
        // Dédupliquer et limiter à 5
        .filter((p, i, arr) => arr.findIndex(x => x.title === p.title) === i)
        .slice(0, 5)
    : []

  // ── RISKS — 100% Engine A ────────────────────────────────────────────────
  const risks = engineA
    ? (engineA.flags ?? [])
        .map((f: any) => ({
          label: f.message,
          severity: f.severity === 'critical' ? 'Elevated'
            : f.severity === 'warning' ? 'Moderate'
            : 'Low',
        }))
    : []

  // ── PRODUITS ──────────────────────────────────────────────────────────────
  const weaknessBoosts: Record<string, any> = {}
  if (engineA?.weaknesses) {
    const w = engineA.weaknesses
    if (w.includes('sleep') || w.includes('stress') || w.includes('circadian')) {
      weaknessBoosts.sleep = Math.min((sourceScores.sleep ?? 50) - 20, 10)
      weaknessBoosts.stress = Math.min((sourceScores.stress ?? 50) - 20, 10)
    }
    if (w.includes('energy') || w.includes('cognition') || w.includes('performance')) {
      weaknessBoosts.energy = Math.min((sourceScores.energy ?? 50) - 20, 10)
      weaknessBoosts.cognition = Math.min((sourceScores.cognition ?? 50) - 20, 10)
    }
    if (w.includes('gut') || w.includes('inflammation') || w.includes('immune')) {
      weaknessBoosts.inflammation = Math.min((sourceScores.inflammation ?? 50) - 20, 10)
    }
    if (w.includes('recovery') || w.includes('resilience')) {
      weaknessBoosts.recovery = Math.min((sourceScores.recovery ?? 50) - 20, 10)
    }
  }

  const productScores = {
    ...sourceScores,
    ...weaknessBoosts,
    ...(engineA && { [`${engineA.dominantPillar}_priority`]: 100 }),
  }

  const engineWeaknesses = engineA?.weaknesses ?? []
  const { protocolProducts, lifestyleProducts } = engineWeaknesses.length > 0
    ? await recommendProducts(productScores, engineWeaknesses)
    : { protocolProducts: [], lifestyleProducts: [] }

  // ── INGREDIENT OVERLAPS ───────────────────────────────────────────────────
  const ingredientMap = new Map()
  const productsForOverlap = [
    ...protocolProducts,
    ...lifestyleProducts.filter((alt: any) =>
      !protocolProducts.some((core: any) => core.name === alt.alternative_to)
    ),
  ]

  productsForOverlap.forEach((product: any) => {
    product.product_ingredients?.forEach((ingredient: any) => {
      if (!ingredient?.ingredients) return
      const key = ingredient.ingredients.name
      const dosage = parseFloat(ingredient.dosage || '0')
      if (ingredientMap.has(key)) {
        ingredientMap.get(key).total += dosage
        ingredientMap.get(key).count += 1
      } else {
        ingredientMap.set(key, {
          name:    ingredient.ingredients.name,
          total:   dosage,
          optimal: ingredient.ingredients.recommended_daily_optimal,
          upper:   ingredient.ingredients.recommended_daily_upper,
          unit:    ingredient.ingredients.recommended_unit,
          count:   1,
        })
      }
    })
  })

  const ingredientOverlaps = Array.from(ingredientMap.values())
    .filter((item: any) => item.count > 1)
    .map((item: any) => {
      const ratio = item.optimal ? item.total / item.optimal : 0
      let color = '#7EE2A8'
      if (ratio > 1.6) color = '#D97C7C'
      else if (ratio > 1.2) color = '#D6C27A'
      const exceedsUpper = item.upper && item.total > item.upper
      if (exceedsUpper) color = '#FF3B30'
      return { ...item, color, exceedsUpper }
    })

  // ── ALTERNATIVE OVERLAPS ──────────────────────────────────────────────────
  const alternativeIngredientMap = new Map()
  lifestyleProducts.forEach((alt: any) => {
    const productsWithAlt = [
      ...protocolProducts.filter((core: any) => core.name !== alt.alternative_to),
      alt,
    ]
    productsWithAlt.forEach((product: any) => {
      product.product_ingredients?.forEach((ingredient: any) => {
        if (!ingredient?.ingredients) return
        const key = ingredient.ingredients.name
        const dosage = parseFloat(ingredient.dosage || '0')
        if (alternativeIngredientMap.has(key)) {
          alternativeIngredientMap.get(key).total += dosage
          alternativeIngredientMap.get(key).count += 1
        } else {
          alternativeIngredientMap.set(key, {
            name:    ingredient.ingredients.name,
            total:   dosage,
            optimal: ingredient.ingredients.recommended_daily_optimal,
            upper:   ingredient.ingredients.recommended_daily_upper,
            unit:    ingredient.ingredients.recommended_unit,
            count:   1,
          })
        }
      })
    })
  })

  const alternativeOverlaps = Array.from(alternativeIngredientMap.values())
    .filter((item: any) => item.count > 1)
    .map((item: any) => {
      const ratio = item.optimal ? item.total / item.optimal : 0
      let color = '#7EE2A8'
      if (ratio > 1.6) color = '#D97C7C'
      else if (ratio > 1.2) color = '#D6C27A'
      const exceedsUpper = item.upper && item.total > item.upper
      if (exceedsUpper) color = '#FF3B30'
      return { ...item, color, exceedsUpper }
    })

  const memberType = body.memberType || 'guest'

  // ── NARRATIVES IA ─────────────────────────────────────────────────────────
  const aiNarratives = engineA
    ? await generateAINarrative({
        age:            body.age,
        sex:            body.sex,
        biologicalAge,
        longevityScore,
        percentile,
        pillarScores,
        dominantPillar: engineA.dominantPillar,
        strengths:      engineA.strengths   ?? [],
        weaknesses:     engineA.weaknesses  ?? [],
        patterns:       engineA.patterns    ?? [],
        flags:          engineA.flags       ?? [],
        archetype: engineA.profileVector?.archetype
          ? {
              name: (body.locale === 'fr' ? ARCHETYPE_NAMES_FR : body.locale === 'es' ? ARCHETYPE_NAMES_ES : ARCHETYPE_NAMES_EN)[engineA.profileVector.archetype.name] ?? engineA.profileVector.archetype.name,
description: (body.locale === 'fr' ? ARCHETYPE_DESCS_FR : body.locale === 'es' ? ARCHETYPE_DESCS_ES : ARCHETYPE_DESCS_EN)[engineA.profileVector.archetype.description] ?? engineA.profileVector.archetype.description,
            }
          : null,
        signatureCode:  engineA.profileVector?.signatureCode ?? null,
        profileSummary: engineA.profileSummary ?? '',
        country:        body.country        ?? '',
        socioeconomic:  body.socioeconomic  ?? '',
        locale:         body.locale         ?? 'en',
      })
    : null

  // ── RAPPORT WRAPPER (structure de base pour les pages) ───────────────────
  // generateLongevityReport sert uniquement de structure — 
  // toutes ses valeurs seront écrasées par Engine A dans enrichedReport
  const report = generateLongevityReport({
    advancedScores,
    user: {
      memberType,
      name:       body.fullName,
      email:      body.email,
      age:        body.age,
      sex:        body.sex,
      weight:     body.weight,
      height:     body.height,
      unitSystem: body.unitSystem,
    },
    scores:            calculatedScores,
    protocols:         body.protocols,
    biologicalAge,
    percentile,
    priorities,
    risks,
    protocolProducts,
    lifestyleProducts,
    ingredientOverlaps,
    psychometric:      body.psychometric,
  })

  // ── RAPPORT FINAL — Engine A écrase tout ─────────────────────────────────
  const enrichedReport = {
    ...report,

    // Scores — Engine A source de vérité
    scores: sourceScores,

    // Métriques globales — Engine A
    longevityScore,
    biologicalAge,
    percentile,

    // Piliers — Engine A
    pillarScores,

    // Priorities & Risks — Engine A
    priorities,
    risks,

    // Produits
    alternativeOverlaps,

    // Données Engine A complètes
    ...(engineA && {
      strengths:        engineA.strengths,
      weaknesses:       engineA.weaknesses,
      flags:            engineA.flags,
      profileSummary:   engineA.profileSummary,
      patterns:         engineA.patterns,
      dominantPillar:   engineA.dominantPillar,
      patternNarrative: engineA.patternNarrative,
      profileVector:    engineA.profileVector,
      signalIntegrity:  body.psychometric?.coherence ?? null,

      // Narratives IA
      ...(aiNarratives && {
        aiNarrative:     aiNarratives.aiNarrative,
        aiKeyInsight:    aiNarratives.aiKeyInsight,
        aiSynthesis:     aiNarratives.aiSynthesis,
        aiProtocolIntro: aiNarratives.aiProtocolIntro,
      }),
    }),
  }

  return NextResponse.json(enrichedReport)
}