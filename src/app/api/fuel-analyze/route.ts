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

    // ── Charger le contexte Lonara du membre ──────────────────────────────
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, member_tier')
      .eq('id', userId)
      .single()

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

console.log('==============================')
console.log('STORAGE UPLOAD')
console.log('File:', fileName)
console.log('Upload Data:', upload)
console.log('Upload Error:', uploadError)
console.log('==============================')

if (upload) {
  imageUrl = fileName

  console.log('Image Path:', imageUrl)
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
  "fuel_score": <integer 0-100, longevity coherence score>,
  "score_rationale": "<2 sentences explaining the score>",
  "alerts": [
    { "type": "warning|info|danger", "message": "<short alert, max 8 words>" }
  ],
  "recommendations": [
    { "text": "<concrete substitution or addition, max 12 words>" }
  ],
  "ai_narrative": "<2-3 sentences, Lonara voice, personalized to this member's profile, referencing their biomarkers or conditions if relevant. Warm but precise.>"
}



SCORING GUIDE:
- 85-100: Exceptional longevity alignment
- 70-84: Good, minor optimizations possible  
- 50-69: Moderate, notable gaps
- 30-49: Poor alignment, significant issues
- 0-29: Highly problematic for longevity

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

    // ── Sauvegarder dans fuel_logs ────────────────────────────────────────
    const { data: log, error: logError } = await supabase
      .from('fuel_logs')
      .insert({
        user_id:         userId,
        sprint_id:       sprintId || null,
        meal_time:       mealTime,
        time_of_day:     timeOfDay,
        image_url:       imageUrl,
        note:            note || null,
        macros:          parsed.macros ?? null,
        fuel_score:      parsed.fuel_score ?? null,
        alerts:          parsed.alerts ?? null,
        recommendations: parsed.recommendations ?? null,
        ai_narrative:    parsed.ai_narrative ?? null,
      })
      .select()
      .single()

    if (logError) {
      console.error('fuel_logs insert error:', logError)
      return NextResponse.json({ error: 'Failed to save log' }, { status: 500 })
    }

    return NextResponse.json({ log, analysis: parsed })

  } catch (err) {
    console.error('fuel-analyze error:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}