import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const image    = formData.get('image') as File | null
    const mealTime = formData.get('mealTime') as string || 'lunch'
const locale   = formData.get('locale') as string || 'en'
    const note     = formData.get('note') as string || ''
    const sprintId = formData.get('sprintId') as string || null
    const userId   = formData.get('userId') as string

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Résoudre le sprint actif si non fourni
    let resolvedSprintId = sprintId || null
    if (!resolvedSprintId) {
      const { data: activeSprint } = await supabase
        .from('fuel_sprints')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle()
      resolvedSprintId = activeSprint?.id ?? null
    }

    // ── Vérification des limites par tier ─────────────────────────────────
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, member_tier')
      .eq('id', userId)
      .single()

    const tier = profile?.member_tier ?? 'member'

    if (tier !== 'executive') {
      const since = new Date()
      since.setDate(since.getDate() - 7)

      const { data: recentLogs } = await supabase
        .from('fuel_logs')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: true })

      if (recentLogs) {
        if (tier === 'premium') {
          if (recentLogs.length >= 24) {
            return NextResponse.json({ error: 'LIMIT_REACHED', tier }, { status: 429 })
          }
        }

        if (tier === 'member') {
          const today = new Date().toISOString().split('T')[0]
          const todayLogs = recentLogs.filter(l => l.created_at.startsWith(today))
          if (todayLogs.length >= 3) {
            return NextResponse.json({ error: 'LIMIT_REACHED', tier }, { status: 429 })
          }
          const activeDays = new Set(recentLogs.map(l => l.created_at.split('T')[0]))
          const todayIsNewDay = !activeDays.has(today)
          if (todayIsNewDay && activeDays.size >= 3) {
            return NextResponse.json({ error: 'LIMIT_REACHED', tier }, { status: 429 })
          }
        }
      }
    }

    // ── Charger le contexte Lonara du membre ──────────────────────────────

    const { data: assessment } = await supabase
      .from('assessments')
      .select('biological_age, longevity_score, recovery_index, stress_load, biomarkers, scores, pillar_activate, pillar_balance, pillar_protect, pillar_restore')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const { data: conditions } = await supabase
      .from('health_conditions')
      .select('category, condition, severity')
      .eq('user_id', userId)

    // ── Déterminer le moment de la journée ────────────────────────────────
    const hour = new Date().getHours()
    const timeOfDay = hour >= 5 && hour < 10 ? 'matin'
      : hour >= 10 && hour < 17 ? 'jour'
      : hour >= 17 && hour < 21 ? 'soir'
      : 'nuit'

    const mealContext = {
      breakfast: 'morning meal — focus on hydration, energy activation, anti-inflammatory start',
      lunch: 'midday meal — focus on sustained energy, cognitive performance, protein balance',
      dinner: 'evening meal — focus on recovery, anti-inflammatory, sleep preparation, light digestion',
      snack: 'snack — focus on blood sugar stability, avoiding spikes',
    }[mealTime] || ''

    // ── Construire le contexte Engine A ───────────────────────────────────
    const engineAContext = assessment ? `
MEMBER LONGEVITY PROFILE (Engine A — last report):
- Biological age: ${assessment.biological_age ?? 'unknown'}
- Longevity score: ${assessment.longevity_score ?? 'unknown'}/100
- Recovery index: ${assessment.recovery_index ?? 'unknown'}%
- Stress load: ${assessment.stress_load ?? 'unknown'}/100
- Pillar Activate: ${assessment.pillar_activate ?? 'unknown'}/100
- Pillar Balance: ${assessment.pillar_balance ?? 'unknown'}/100
- Pillar Protect: ${assessment.pillar_protect ?? 'unknown'}/100
- Pillar Restore: ${assessment.pillar_restore ?? 'unknown'}/100
` : 'No assessment data available.'

    const conditionsContext = conditions && conditions.length > 0
      ? `DECLARED HEALTH CONDITIONS:\n${conditions.map(c => `- ${c.category}: ${c.condition} (${c.severity})`).join('\n')}`
      : 'No health conditions declared.'

    // ── Convertir l'image en base64 ───────────────────────────────────────
    let imageBase64: string | null = null
    let imageUrl: string | null = null

    if (image) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      imageBase64 = buffer.toString('base64')
// Upload vers Supabase Storage
const fileName = `fuel/${userId}/${Date.now()}.jpg`

const { data: upload, error: uploadError } = await supabase.storage
  .from('fuel-images')
  .upload(fileName, buffer, {
    contentType: image.type || 'image/jpeg',
    upsert: false,
  })

if (upload) {
  imageUrl = fileName
}
    }

    // ── Prompt GPT-4o Vision ──────────────────────────────────────────────
    const systemPrompt = `You are Fuel, the nutritional intelligence engine of Lonara Labs — a premium longevity platform. Your role is to analyze meal photos and provide personalized nutritional feedback based on the member's complete longevity profile.

You think like a precision medicine nutritionist who understands biomarkers, inflammation, metabolic health, and longevity science. You are direct, precise, and warm — never generic.

You must respond ONLY with a valid JSON object. No preamble, no markdown, no explanation outside the JSON.`

    const userPrompt = `Analyze this meal photo and provide a complete longevity-oriented nutritional assessment.

MEAL CONTEXT:
- Meal time: ${mealTime} — ${mealContext}
- Time of day: ${timeOfDay}
- Member note: ${note || 'none'}

${engineAContext}

${conditionsContext}

Respond with this exact JSON structure:
{
  "identified_foods": ["food1", "food2"],
  "macros": {
    "protein": <number in grams, range estimate as midpoint>,
    "carbs": <number in grams>,
    "fat": <number in grams>,
    "kcal": <number>
  },
  "quality_flags": {
    "ultra_processed": <boolean>,
    "high_sugar": <boolean>,
    "high_sodium": <boolean>,
    "anti_inflammatory": <boolean>,
    "fiber_rich": <boolean>
  },
  "score_rationale": "<2 sentences explaining the nutritional quality of this meal>",
  "alerts": [
    { "type": "warning|info|danger", "message": "<short alert, max 8 words>" }
  ],
  "recommendations": [
    { "text": "<concrete substitution or addition, max 12 words>" }
  ],
  "ai_narrative": "<2-3 sentences, Lonara voice, personalized to this member's profile, referencing their biomarkers or conditions if relevant. Warm but precise.>"
}


ALERTS: Only flag real issues — inflammatory ingredients conflicting with conditions, blood sugar risks given glucose markers, sodium issues given cardiovascular profile, etc. Max 3 alerts.
RECOMMENDATIONS: Max 2, concrete and actionable. Reference the member's specific goals or conditions when possible.

Respond in this language: ${locale}`


    const messages: any[] = [
      {
        role: 'user',
        content: imageBase64 ? [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
              detail: 'high',
            },
          },
          { type: 'text', text: userPrompt },
        ] : [{ type: 'text', text: userPrompt + '\n\n[No image provided — analyze based on meal time and context only]' }],
      },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 800,
      temperature: 0.3,
    })

   const rawContent = completion.choices[0]?.message?.content ?? '{}'
const clean = rawContent.replace(/```json|```/g, '').trim()
const parsed = JSON.parse(clean)

// ── Récupérer les cibles macro du sprint actif, si disponible ─────────
let macroTargets: { protein_g: { min: number; max: number }; carbs_g: { min: number; max: number }; fat_g: { min: number; max: number }; kcal: { min: number; max: number } } | null = null
if (resolvedSprintId) {
  const { data: sprintData } = await supabase
    .from('fuel_sprints')
    .select('macro_targets')
    .eq('id', resolvedSprintId)
    .maybeSingle()
  macroTargets = sprintData?.macro_targets ?? null
}

// ── Calcul déterministe du fuel_score ──────────────────────────────────
function computeFuelScore(macros: any, flags: any, targets: typeof macroTargets, alerts: any[]): number {
  let score = 70 // base neutre

  const protein = macros?.protein ?? 0
  const carbs   = macros?.carbs ?? 0
  const fat     = macros?.fat ?? 0
  const kcal    = macros?.kcal ?? 0

  // Alignement avec les cibles du sprint (si dispo) — cette portion du repas
  // est jugée par sa proportion de macros plutôt que par un absolu journalier
  if (targets) {
    const proteinRatio = protein / Math.max(targets.protein_g.max / 3, 1) // ~1/3 des cibles jour par repas
    const carbsRatio   = carbs   / Math.max(targets.carbs_g.max / 3, 1)
    const fatRatio     = fat     / Math.max(targets.fat_g.max / 3, 1)

    if (proteinRatio >= 0.6 && proteinRatio <= 1.4) score += 8
    else if (proteinRatio < 0.3) score -= 6

    if (carbsRatio > 1.6) score -= 8
    if (fatRatio > 1.6) score -= 6
  }

  // Qualité intrinsèque
  if (flags?.ultra_processed)     score -= 15
  if (flags?.high_sugar)          score -= 10
  if (flags?.high_sodium)         score -= 6
  if (flags?.anti_inflammatory)   score += 8
  if (flags?.fiber_rich)          score += 6

  // Pénalité par alerte générée (danger > warning > info)
  for (const a of alerts ?? []) {
    if (a.type === 'danger')  score -= 10
    else if (a.type === 'warning') score -= 5
    else score -= 2
  }

  // Variation fine anti-répétition — dérivée du ratio kcal/macros réel du repas
  // (évite les valeurs "rondes" tout en restant déterministe et reproductible)
  const microVariation = Math.round(((protein * 4 + carbs * 4 + fat * 9) % 7) - 3)
  score += microVariation

  return Math.max(0, Math.min(100, Math.round(score)))
}

const computedScore = computeFuelScore(parsed.macros, parsed.quality_flags, macroTargets, parsed.alerts)

// ── Sauvegarder dans fuel_logs ────────────────────────────────────────
const { data: log, error: logError } = await supabase
  .from('fuel_logs')
  .insert({
    user_id:          userId,
    sprint_id:        resolvedSprintId,
    meal_time:        mealTime,
    time_of_day:      timeOfDay,
    image_url:        imageUrl,
    note:             note || null,
    macros:           parsed.macros ?? null,
    fuel_score:       computedScore,
    alerts:           parsed.alerts ?? null,
    recommendations:  parsed.recommendations ?? null,
    ai_narrative:     parsed.ai_narrative ?? null,
    identified_foods: parsed.identified_foods ?? null,
    score_rationale:  parsed.score_rationale ?? null,
  })
  .select()
  .single()

    if (logError) {
      console.error('fuel_logs insert error:', logError)
      return NextResponse.json({ error: 'Failed to save log' }, { status: 500 })
    }

    // ── Plate of the Month ────────────────────────────────────────────────
    if (parsed.fuel_score && imageUrl) {
      const currentMonth = new Date().toISOString().slice(0, 7)

      const { data: existing } = await supabase
        .from('fuel_best_meals')
        .select('fuel_score')
        .eq('user_id', userId)
        .eq('meal_time', mealTime)
        .eq('month', currentMonth)
        .maybeSingle()

      if (!existing || parsed.fuel_score > existing.fuel_score) {
        await supabase
          .from('fuel_best_meals')
          .upsert({
            user_id:    userId,
            meal_time:  mealTime,
            fuel_score: parsed.fuel_score,
            image_url:  imageUrl,
            log_id:     log.id,
            month:      currentMonth,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,meal_time,month' })
      }
    }

    return NextResponse.json({ log, analysis: parsed })

  } catch (err) {
    console.error('fuel-analyze error:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}