import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { correlateDomains, getConfirmedDomains, aggregateFuelSignals, getLatestVisualSignals } from '@/lib/summaryCorrelation'
import { recommendProducts } from '@/lib/longevityEngine'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { userId, locale } = await req.json()
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    // ── 1. Dernier assessment avec données Engine A ─────────────────────
    const { data: assessment } = await supabase
      .from('assessments')
      .select('id, biological_age, longevity_score, weaknesses, strengths, flags, dominant_pillar, engine_a_scores, sex, age, pillar_activate, pillar_balance, pillar_protect, pillar_restore')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!assessment || !assessment.weaknesses) {
      return NextResponse.json({ error: 'NO_ENGINE_A_DATA' }, { status: 404 })
    }

    const baseWeaknesses: string[] = assessment.weaknesses ?? []
    const sex = assessment.sex ?? 'unknown'

    // ── 2. Signaux My Visual + My Fuel ──────────────────────────────────
    const { signals: visualSignals, latestAnalysisAt } = await getLatestVisualSignals(supabase, userId)
    const fuelSignals = await aggregateFuelSignals(supabase, userId)

    // ── 3. Corrélation croisée ───────────────────────────────────────────
    const correlations = correlateDomains(baseWeaknesses, visualSignals, fuelSignals, sex)
    const confirmedDomains = getConfirmedDomains(correlations)

    // ── 4. Indicateurs de cohérence (calculés en code, pas par IA) ───────
    let ageGap: number | null = null
    if (visualSignals) {
      const { data: latestFaceAnalysis } = await supabase
        .from('visual_analyses')
        .select('analysis')
        .eq('user_id', userId)
        .eq('capture_type', 'face')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      const perceivedRange = (latestFaceAnalysis?.analysis as any)?.perceived_age_range
      if (Array.isArray(perceivedRange) && assessment.biological_age != null) {
        const perceivedMid = (perceivedRange[0] + perceivedRange[1]) / 2
        ageGap = Math.round(perceivedMid - assessment.biological_age)
      }
    }

    const fuelTrendScore = fuelSignals
      ? Math.round(
          100
          - fuelSignals.inflammatoryAlertCount * 5
          - fuelSignals.glycemicAlertCount * 5
          - fuelSignals.highSugarRatio * 20
          - fuelSignals.highSodiumRatio * 15
          - fuelSignals.proteinBelowTargetRatio * 15
        )
      : null

    const coherenceLevel = confirmedDomains.length === 0
      ? 'low'
      : confirmedDomains.length <= 2
      ? 'moderate'
      : 'attention'

    // ── 5. Enrichir les weaknesses avec les domaines confirmés ──────────
    // Les domaines confirmés remontent en tête de liste (priorité accrue),
    // sans dupliquer, et mappés vers les noms de catégories Engine A réels
    const domainToCategory: Record<string, string[]> = {
      inflammation: ['inflammation'],
      skin_aging: ['skin', 'aging'],
      metabolism: ['metabolism'],
      recovery_sleep: ['recovery', 'sleep'],
      exercise_mobility: ['exercise', 'mobility'],
      cardiovascular: ['cardiovascular'],
    }
    const reinforcedCategories = confirmedDomains.flatMap(d => domainToCategory[d] ?? [])
    const enrichedWeaknesses = [
      ...new Set([...reinforcedCategories, ...baseWeaknesses]),
    ]

    // ── 6. Recommandation produit — même moteur que le rapport principal ─
    const pillarScores = {
      activate: assessment.pillar_activate ?? 50,
      balance: assessment.pillar_balance ?? 50,
      protect: assessment.pillar_protect ?? 50,
      restore: assessment.pillar_restore ?? 50,
    }
    const engineScores = assessment.engine_a_scores ?? {}
    const { protocolProducts } = enrichedWeaknesses.length > 0
      ? await recommendProducts(
          { ...engineScores, [`${assessment.dominant_pillar}_priority`]: 100 } as any,
          enrichedWeaknesses,
        )
      : { protocolProducts: [] }

    // ── 7. Narratif IA — synthèse uniquement, pas de calcul de score ─────
    const narrative = await generateSummaryNarrative({
      confirmedDomains,
      correlations,
      ageGap,
      fuelTrendScore,
      dominantPillar: assessment.dominant_pillar,
      locale: locale ?? 'en',
    })

    // ── 8. Sauvegarder ────────────────────────────────────────────────────
    const { data: saved } = await supabase
      .from('summary_reports')
      .insert({
        user_id: userId,
        source_assessment_id: assessment.id,
        source_visual_analysis_at: latestAnalysisAt,
        source_fuel_log_count: fuelSignals?.totalLogsConsidered ?? 0,
        age_gap: ageGap,
        fuel_trend_score: fuelTrendScore,
        coherence_level: coherenceLevel,
        narrative: narrative.text,
        recommendation: narrative.recommendation,
      })
      .select()
      .single()

    return NextResponse.json({
      summary: saved,
      correlations,
      confirmedDomains,
      recommendedProducts: protocolProducts,
    })
  } catch (e) {
    console.error('summary-generate error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

async function generateSummaryNarrative({
  confirmedDomains,
  correlations,
  ageGap,
  fuelTrendScore,
  dominantPillar,
  locale,
}: {
  confirmedDomains: string[]
  correlations: any[]
  ageGap: number | null
  fuelTrendScore: number | null
  dominantPillar: string | null
  locale: string
}): Promise<{ text: string; recommendation: string }> {
  if (confirmedDomains.length === 0) {
    const langMap: Record<string, { text: string; rec: string }> = {
      fr: {
        text: "Vos trois sources de données — évaluation biologique, suivi visuel et nutrition — ne montrent pas de recoupement significatif à ce jour. Continuez le suivi régulier pour affiner cette lecture.",
        rec: "Poursuivez vos captures My Visual et vos scans My Fuel pour enrichir cette synthèse.",
      },
      en: {
        text: "Your three data sources — biological assessment, visual tracking, and nutrition — show no significant overlap at this time. Continue regular tracking to refine this reading.",
        rec: "Keep up your My Visual captures and My Fuel scans to enrich this synthesis.",
      },
      es: {
        text: "Sus tres fuentes de datos — evaluación biológica, seguimiento visual y nutrición — no muestran una coincidencia significativa por el momento. Continúe el seguimiento regular para perfeccionar esta lectura.",
        rec: "Continúe con sus capturas de My Visual y sus escaneos de My Fuel para enriquecer esta síntesis.",
      },
    }
    const m = langMap[locale] ?? langMap.en
    return { text: m.text, recommendation: m.rec }
  }

  const relevantDetails = correlations
    .filter(c => c.confirmed)
    .map(c => `${c.domain}: ${c.reason}`)
    .join('; ')

  const langInstruction = locale === 'fr' ? 'Respond entirely in French.'
    : locale === 'es' ? 'Respond entirely in Spanish.'
    : 'Respond entirely in English.'

  const prompt = `You are Engine A, the longevity intelligence of Lonara Labs. Based on the following CONFIRMED cross-source correlations (already validated mathematically — do not invent additional ones), write a warm, precise 3-4 sentence synthesis for the member, followed by one concrete recommendation (max 20 words).

Confirmed correlations: ${relevantDetails}
Dominant biological pillar: ${dominantPillar ?? 'balance'}
${ageGap != null ? `Perceived vs biological age gap: ${ageGap > 0 ? '+' : ''}${ageGap} years` : ''}
${fuelTrendScore != null ? `Recent nutritional coherence trend: ${fuelTrendScore}/100` : ''}

${langInstruction}

Respond with plain text only, no JSON. First the synthesis paragraph, then on a new line starting with "RECOMMENDATION:", the single recommendation.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 300,
        temperature: 0.4,
        messages: [
          { role: 'system', content: `You are Engine A, Lonara Labs' longevity intelligence. Precise, warm, evidence-based. ${langInstruction}` },
          { role: 'user', content: prompt },
        ],
      }),
    })
    const data = await response.json()
    const raw: string = data.choices?.[0]?.message?.content?.trim() ?? ''
    const [textPart, recPart] = raw.split(/RECOMMENDATION:/i)
    return {
      text: textPart?.trim() ?? '',
      recommendation: recPart?.trim() ?? '',
    }
  } catch {
    return { text: relevantDetails, recommendation: '' }
  }
}