import { Resend } from 'resend'
import { renderToBuffer } from '@react-pdf/renderer'
import PDFVisualReport from '@/components/PDFVisualReport'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import fs from 'fs'

const resend = new Resend(process.env.RESEND_API_KEY)

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

function buildEmailHtml(fullName: string, type: 'global' | 'detail', period: string, locale: string): string {
  const periodLabel = period === '30'
    ? locale === 'fr' ? '30 derniers jours' : locale === 'es' ? 'Últimos 30 días' : 'Last 30 days'
    : period === '90'
    ? locale === 'fr' ? '90 derniers jours' : locale === 'es' ? 'Últimos 90 días' : 'Last 90 days'
    : locale === 'fr' ? '6 derniers mois' : locale === 'es' ? 'Últimos 6 meses' : 'Last 6 months'

  const strings: Record<string, Record<string, string>> = {
    subject_global: { en: 'Your Visual Longevity Report', fr: 'Votre Rapport de Longévité Visuelle', es: 'Su Informe de Longevidad Visual' },
    subject_detail: { en: 'Your Session Detail Report', fr: 'Votre Rapport Détaillé des Sessions', es: 'Su Informe Detallado de Sesiones' },
    greeting:       { en: `Hello ${fullName},`, fr: `Bonjour ${fullName},`, es: `Hola ${fullName},` },
    body_global:    { en: `Your My Visual longevity report for the period <strong>${periodLabel}</strong> is attached.`, fr: `Votre rapport de longévité visuelle My Visual pour la période <strong>${periodLabel}</strong> est joint.`, es: `Su informe de longevidad visual My Visual para el período <strong>${periodLabel}</strong> está adjunto.` },
    body_detail:    { en: `Your complete session log for the period <strong>${periodLabel}</strong> is attached.`, fr: `Votre journal complet des sessions pour la période <strong>${periodLabel}</strong> est joint.`, es: `Su registro completo de sesiones para el período <strong>${periodLabel}</strong> está adjunto.` },
    tagline:        { en: 'The Art of Longevity', fr: 'L\'Art de la Longévité', es: 'El Arte de la Longevidad' },
  }

  const l = locale as 'en' | 'fr' | 'es'
  const s = (key: string) => strings[key]?.[l] ?? strings[key]?.['en'] ?? key

  return `
    <div style="font-family: Georgia, serif; padding: 48px 40px; background: #f8f8f6; color: #111; max-width: 580px; margin: 0 auto; border-radius: 12px;">
      <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #4A90C2; margin-bottom: 20px;">Lonara Labs — My Visual</p>
      <h1 style="font-size: 24px; font-weight: 300; margin: 0 0 16px 0; color: #111;">${s(type === 'global' ? 'subject_global' : 'subject_detail')}</h1>
      <p style="color: #555; line-height: 1.8; font-size: 14px; margin-bottom: 24px;">
        ${s('greeting')}<br/><br/>
        ${s(type === 'global' ? 'body_global' : 'body_detail')}
      </p>
      <p style="font-size: 11px; color: #888; border-top: 1px solid #ddd; padding-top: 20px; margin-top: 32px; line-height: 1.8;">
        Lonara Labs — ${s('tagline')}<br/>
        www.lonaralabs.com
      </p>
    </div>
  `
}

export async function POST(req: Request) {
  try {
    const { userId, period, locale, type, email, fullName } = await req.json()

    if (!userId || !period || !type || !email) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // ── PROFIL (âge chronologique) ──────────────────────────────────────────
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('date_of_birth')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError
    const chronologicalAge = profile?.date_of_birth ? calculateAge(profile.date_of_birth) : null

    // ── FETCH ANALYSES ───────────────────────────────────────────────────────
    const since = new Date()
    since.setDate(since.getDate() - parseInt(period))

    const { data: analyses, error: analysesError } = await supabaseAdmin
      .from('visual_analyses')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })

    if (analysesError) throw analysesError
    if (!analyses || analyses.length === 0) {
      return Response.json({ error: 'NO_DATA' }, { status: 422 })
    }

    const faceAnalyses = analyses.filter((a: any) => a.capture_type === 'face')
    const bodyAnalyses = analyses.filter((a: any) => a.capture_type === 'body')

    const latestFace = faceAnalyses[0]?.analysis ?? null
    const latestBody = bodyAnalyses[0]?.analysis ?? null

    // ── AGRÉGATS — ÂGE PERÇU ─────────────────────────────────────────────────
    const perceivedAgeMidpoints = faceAnalyses
      .map((a: any) => a.analysis?.perceived_age_range)
      .filter((r: any) => Array.isArray(r) && r.length === 2)
      .map((r: number[]) => (r[0] + r[1]) / 2)

    const avgPerceivedAge = perceivedAgeMidpoints.length
      ? Math.round(perceivedAgeMidpoints.reduce((s: number, v: number) => s + v, 0) / perceivedAgeMidpoints.length)
      : null

    const ageGap = (chronologicalAge != null && avgPerceivedAge != null) ? avgPerceivedAge - chronologicalAge : null

    // ── AGRÉGATS — INDICE DE VIEILLISSEMENT VISUEL ──────────────────────────
    const agingIndexValues = bodyAnalyses
      .map((a: any) => a.analysis?.visual_aging_index)
      .filter((v: any) => typeof v === 'number')

    const avgAgingIndex = agingIndexValues.length
      ? Math.round(agingIndexValues.reduce((s: number, v: number) => s + v, 0) / agingIndexValues.length)
      : null

    // ── TENDANCE DANS LE TEMPS (par session, pas par semaine — volumes plus faibles) ──
    const faceTrend = faceAnalyses
      .slice().reverse()
      .map((a: any) => ({
        date: a.created_at,
        midpoint: Array.isArray(a.analysis?.perceived_age_range)
          ? Math.round((a.analysis.perceived_age_range[0] + a.analysis.perceived_age_range[1]) / 2)
          : null,
      }))
      .filter((p: any) => p.midpoint != null)

    const bodyTrend = bodyAnalyses
      .slice().reverse()
      .map((a: any) => ({
        date: a.created_at,
        index: a.analysis?.visual_aging_index ?? null,
      }))
      .filter((p: any) => p.index != null)

    // ── GPT NARRATIVE (global only) ─────────────────────────────────────────
    let aiNarrative = ''
    if (type === 'global') {
      const periodLabel = period === '30' ? '30 days' : period === '90' ? '90 days' : '6 months'
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

      try {
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
        aiNarrative = gptData.choices?.[0]?.message?.content ?? ''
      } catch (e) {
        console.error('GPT narrative error:', e)
      }
    }

    // ── LOGOS ────────────────────────────────────────────────────────────────
    const logoBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'lonara-logo-bl.png'))
    const logoPath   = `data:image/png;base64,${logoBuffer.toString('base64')}`
    const watermarkBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'LOGOOFFICIELTRANSPNOIR.png'))
    const watermarkPath   = `data:image/png;base64,${watermarkBuffer.toString('base64')}`

    // ── PDF ──────────────────────────────────────────────────────────────────
    const element = PDFVisualReport({
      type,
      period,
      locale,
      fullName,
      logoPath,
      watermarkPath,
      data: {
        chronologicalAge,
        avgPerceivedAge,
        ageGap,
        avgAgingIndex,
        latestFace,
        latestBody,
        faceCount: faceAnalyses.length,
        bodyCount: bodyAnalyses.length,
        faceTrend,
        bodyTrend,
        aiNarrative,
        analyses,
      },
    })

    const pdfBuffer = await renderToBuffer(element)

    // ── EMAIL ────────────────────────────────────────────────────────────────
    const subjects: Record<string, Record<string, string>> = {
      global: { en: 'Your Visual Longevity Report — Lonara My Visual', fr: 'Votre Rapport de Longévité Visuelle — Lonara My Visual', es: 'Su Informe de Longevidad Visual — Lonara My Visual' },
      detail: { en: 'Your Session Detail Report — Lonara My Visual', fr: 'Votre Journal des Sessions — Lonara My Visual', es: 'Su Registro de Sesiones — Lonara My Visual' },
    }

    const subject = subjects[type]?.[locale] ?? subjects[type]?.['en']
    const filename = `lonara-myvisual-${type}-${period}d-${new Date().toISOString().split('T')[0]}.pdf`

    await resend.emails.send({
      from: 'Lonara <reports@lonaralabs.com>',
      to: [email],
      subject,
      html: buildEmailHtml(fullName, type, period, locale),
      attachments: [{ filename, content: pdfBuffer }],
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('visual-report-send ERROR:', error)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}