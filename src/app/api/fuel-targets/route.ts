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
    const { userId, sprintId, mode, goal, locale } = await req.json()

    if (!userId || !sprintId) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    }

    // ── Charger le profil du membre ───────────────────────────────────────
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, member_tier, weight_kg, height_cm, sex, date_of_birth')
      .eq('id', userId)
      .single()

    const { data: assessment } = await supabase
      .from('assessments')
      .select('biological_age, longevity_score, recovery_index, stress_load, scores, pillar_activate, pillar_balance, pillar_protect, pillar_restore')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const { data: conditions } = await supabase
      .from('health_conditions')
      .select('category, condition, severity')
      .eq('user_id', userId)

    // ── Calculer l'âge depuis date_of_birth ──────────────────────────────
    let age = null
    if (profile?.date_of_birth) {
      const dob = new Date(profile.date_of_birth)
      age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    }

    const weight = profile?.weight_kg ?? null
    const height = profile?.height_cm ?? null
    const sex = profile?.sex ?? null

    // ── BMR via Mifflin-St Jeor si données disponibles ───────────────────
    let bmrEstimate = null
    if (weight && height && age && sex) {
      if (sex === 'male') {
        bmrEstimate = Math.round(10 * weight + 6.25 * height - 5 * age + 5)
      } else {
        bmrEstimate = Math.round(10 * weight + 6.25 * height - 5 * age - 161)
      }
    }

    const conditionsContext = conditions && conditions.length > 0
      ? conditions.map(c => `${c.category}: ${c.condition} (${c.severity})`).join(', ')
      : 'none'

    const engineAContext = assessment
      ? `Longevity score: ${assessment.longevity_score}/100, Recovery: ${assessment.recovery_index}%, Stress: ${assessment.stress_load}/100`
      : 'no assessment available'

    // ── Prompt GPT-4o ─────────────────────────────────────────────────────
    const prompt = `You are Fuel, the nutritional intelligence engine of Lonara Labs. Generate personalized daily macro targets for a longevity sprint.

MEMBER PROFILE:
- Weight: ${weight ? `${weight} kg` : 'unknown'}
- Height: ${height ? `${height} cm` : 'unknown'}
- Age: ${age ?? 'unknown'}
- Sex: ${sex ?? 'unknown'}
- Estimated BMR: ${bmrEstimate ? `${bmrEstimate} kcal` : 'unknown'}
- Sprint mode: ${mode}
- Sprint goal: ${goal ?? 'general longevity optimization'}
- Health conditions: ${conditionsContext}
- Engine A: ${engineAContext}

Generate daily macro targets optimized for longevity AND the specific sprint goal. If weight is unknown, use conservative population averages.

Respond ONLY with valid JSON, no preamble:
{
  "protein_g": { "min": <number>, "max": <number> },
  "carbs_g": { "min": <number>, "max": <number> },
  "fat_g": { "min": <number>, "max": <number> },
  "kcal": { "min": <number>, "max": <number> },
  "rationale": "<2 sentences explaining the targets based on the goal and profile>"
}

Respond in this language: ${locale ?? 'en'}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.2,
    })

    const raw = completion.choices[0]?.message?.content ?? '{}'
    const clean = raw.replace(/```json|```/g, '').trim()
    const targets = JSON.parse(clean)

    // ── Sauvegarder dans fuel_sprints ─────────────────────────────────────
    await supabase
      .from('fuel_sprints')
      .update({ macro_targets: targets })
      .eq('id', sprintId)

    return NextResponse.json({ targets })

  } catch (err) {
    console.error('fuel-targets error:', err)
    return NextResponse.json({ error: 'Failed to generate targets' }, { status: 500 })
  }
}