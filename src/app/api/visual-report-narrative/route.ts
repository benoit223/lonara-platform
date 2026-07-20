import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

export async function POST(req: Request) {
  try {
    const { userId, period, locale } = await req.json()

    if (!userId || !period) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('date_of_birth')
      .eq('id', userId)
      .single()

    const chronologicalAge = profile?.date_of_birth ? calculateAge(profile.date_of_birth) : null

    const since = new Date()
    since.setDate(since.getDate() - parseInt(period))

    const { data: analyses } = await supabaseAdmin
      .from('visual_analyses')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })

    if (!analyses || analyses.length === 0) {
      return Response.json({ error: 'NO_DATA' }, { status: 422 })
    }

    const faceAnalyses = analyses.filter((a: any) => a.capture_type === 'face')
    const bodyAnalyses = analyses.filter((a: any) => a.capture_type === 'body')

    const latestFace = faceAnalyses[0]?.analysis ?? null
    const latestBody = bodyAnalyses[0]?.analysis ?? null

    const perceivedAgeMidpoints = faceAnalyses
      .map((a: any) => a.analysis?.perceived_age_range)
      .filter((r: any) => Array.isArray(r) && r.length === 2)
      .map((r: number[]) => (r[0] + r[1]) / 2)

    const avgPerceivedAge = perceivedAgeMidpoints.length
      ? Math.round(perceivedAgeMidpoints.reduce((s: number, v: number) => s + v, 0) / perceivedAgeMidpoints.length)
      : null

    const ageGap = (chronologicalAge != null && avgPerceivedAge != null) ? avgPerceivedAge - chronologicalAge : null

    const agingIndexValues = bodyAnalyses
      .map((a: any) => a.analysis?.visual_aging_index)
      .filter((v: any) => typeof v === 'number')

    const avgAgingIndex = agingIndexValues.length
      ? Math.round(agingIndexValues.reduce((s: number, v: number) => s + v, 0) / agingIndexValues.length)
      : null

    const dataSummary = `
Chronological age: ${chronologicalAge ?? 'unknown'}
Average perceived age (face): ${avgPerceivedAge ?? 'n/a'}
Age gap (perceived - chronological): ${ageGap ?? 'n/a'}
Latest Glogau stage: ${latestFace?.glogau_stage ?? 'n/a'}
Latest visual aging index (body): ${avgAgingIndex ?? 'n/a'}/100
Face sessions analyzed: ${faceAnalyses.length}
Body sessions analyzed: ${bodyAnalyses.length}
Latest face notes: ${latestFace?.notes ?? 'n/a'}
Latest body notes: ${latestBody?.notes ?? 'n/a'}
`

    const periodLabel = period === '30' ? '30 days' : period === '90' ? '90 days' : '6 months'

    const prompt = locale === 'fr'
      ? `Tu es un expert en longévité et vieillissement phénotypique. Analyse les données visuelles suivantes sur les ${periodLabel === '30 days' ? '30 derniers jours' : periodLabel === '90 days' ? '90 derniers jours' : '6 derniers mois'} et rédige une analyse narrative en 3-4 paragraphes, en français, dans un style professionnel, précis et bienveillant.

Données :
${dataSummary}

Commente l'écart entre âge perçu et âge chronologique s'il est disponible, l'évolution des indicateurs si plusieurs sessions existent, et propose une lecture équilibrée (points positifs et axes d'attention). Reste factuel, jamais alarmiste, et rappelle que ce sont des estimations visuelles, pas un diagnostic médical. Ne liste pas les données brutes — interprète-les.`
      : locale === 'es'
      ? `Eres un experto en longevidad y envejecimiento fenotípico. Analiza los siguientes datos visuales de los últimos ${periodLabel} y redacta un análisis narrativo en 3-4 párrafos, en español, en un estilo profesional, preciso y cercano.

Datos:
${dataSummary}

Comenta la diferencia entre edad percibida y edad cronológica si está disponible, la evolución de los indicadores si hay varias sesiones, y ofrece una lectura equilibrada (puntos positivos y áreas de atención). Mantente factual, nunca alarmista, y recuerda que son estimaciones visuales, no un diagnóstico médico. No listes los datos brutos — interprétalos.`
      : `You are a longevity and phenotypic aging expert. Analyze the following visual data for the last ${periodLabel} and write a narrative analysis in 3-4 paragraphs, in English, in a professional, precise and supportive style.

Data:
${dataSummary}

Comment on the gap between perceived and chronological age if available, the evolution of indicators if multiple sessions exist, and offer a balanced reading (strengths and areas of attention). Stay factual, never alarmist, and remind that these are visual estimates, not a medical diagnosis. Do not list raw data — interpret it.`

    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const gptData = await gptRes.json()
    const narrative = gptData.choices?.[0]?.message?.content ?? ''

    const { data: saved, error: saveError } = await supabaseAdmin
      .from('visual_report_narratives')
      .insert({ user_id: userId, period, narrative })
      .select()
      .single()

    if (saveError) throw saveError

    return Response.json({ success: true, narrative, generatedAt: saved.generated_at })
  } catch (error) {
    console.error('visual-report-narrative ERROR:', error)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}