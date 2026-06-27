import { Resend } from 'resend'
import { renderToBuffer } from '@react-pdf/renderer'
import PDFFuelReport from '@/components/PDFFuelReport'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import fs from 'fs'
import React from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function buildEmailHtml(fullName: string, type: 'global' | 'detail', period: string, locale: string): string {
  const periodLabel = period === '30'
    ? locale === 'fr' ? '30 derniers jours' : locale === 'es' ? 'Últimos 30 días' : 'Last 30 days'
    : period === '90'
    ? locale === 'fr' ? '90 derniers jours' : locale === 'es' ? 'Últimos 90 días' : 'Last 90 days'
    : locale === 'fr' ? '6 derniers mois' : locale === 'es' ? 'Últimos 6 meses' : 'Last 6 months'

  const strings: Record<string, Record<string, string>> = {
    subject_global: { en: 'Your Nutritional Intelligence Report', fr: 'Votre Rapport d\'Intelligence Nutritionnelle', es: 'Su Informe de Inteligencia Nutricional' },
    subject_detail: { en: 'Your Meal Detail Report', fr: 'Votre Rapport Détaillé des Repas', es: 'Su Informe Detallado de Comidas' },
    greeting:       { en: `Hello ${fullName},`, fr: `Bonjour ${fullName},`, es: `Hola ${fullName},` },
    body_global:    { en: `Your My Fuel nutritional intelligence report for the period <strong>${periodLabel}</strong> is attached.`, fr: `Votre rapport d\'intelligence nutritionnelle My Fuel pour la période <strong>${periodLabel}</strong> est joint.`, es: `Su informe de inteligencia nutricional My Fuel para el período <strong>${periodLabel}</strong> está adjunto.` },
    body_detail:    { en: `Your complete meal log for the period <strong>${periodLabel}</strong> is attached.`, fr: `Votre journal complet des repas pour la période <strong>${periodLabel}</strong> est joint.`, es: `Su registro completo de comidas para el período <strong>${periodLabel}</strong> está adjunto.` },
    tagline:        { en: 'The Art of Longevity', fr: 'L\'Art de la Longévité', es: 'El Arte de la Longevidad' },
  }

  const l = locale as 'en' | 'fr' | 'es'
  const s = (key: string) => strings[key]?.[l] ?? strings[key]?.['en'] ?? key

  return `
    <div style="font-family: Georgia, serif; padding: 48px 40px; background: #f8f8f6; color: #111; max-width: 580px; margin: 0 auto; border-radius: 12px;">
      <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #1A6B35; margin-bottom: 20px;">Lonara Labs — My Fuel</p>
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

    // ── FETCH LOGS ──────────────────────────────────────────────────────────
    const since = new Date()
    since.setDate(since.getDate() - parseInt(period))

    const { data: logs, error: logsError } = await supabaseAdmin
      .from('fuel_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })

    if (logsError) throw logsError
    if (!logs || logs.length === 0) {
      return Response.json({ error: 'NO_DATA' }, { status: 422 })
    }

    const scoredLogs = logs.filter((l: any) => l.fuel_score != null)

    // ── AGRÉGATS ────────────────────────────────────────────────────────────
    const avgScore = scoredLogs.length
      ? Math.round(scoredLogs.reduce((s: number, l: any) => s + l.fuel_score, 0) / scoredLogs.length)
      : null

    const byMeal = ['breakfast', 'lunch', 'dinner', 'snack'].map(meal => {
      const ml = scoredLogs.filter((l: any) => l.meal_time === meal)
      return {
        meal,
        count: ml.length,
        avg: ml.length ? Math.round(ml.reduce((s: number, l: any) => s + l.fuel_score, 0) / ml.length) : null,
      }
    })

    const macroLogs = logs.filter((l: any) => l.macros)
    const avg = (key: string) => macroLogs.length
      ? Math.round(macroLogs.reduce((s: number, l: any) => s + (l.macros?.[key] ?? 0), 0) / macroLogs.length)
      : null

    const avgProtein = avg('protein')
    const avgCarbs   = avg('carbs')
    const avgFat     = avg('fat')
    const avgKcal    = avg('kcal')

    // ── WEEKLY TREND ────────────────────────────────────────────────────────
    const weekMap: Record<string, { total: number; count: number }> = {}
    scoredLogs.forEach((l: any) => {
      const d = new Date(l.created_at)
      const monday = new Date(d)
      monday.setDate(d.getDate() - ((d.getDay() + 6) % 7))
      const key = monday.toISOString().split('T')[0]
      if (!weekMap[key]) weekMap[key] = { total: 0, count: 0 }
      weekMap[key].total += l.fuel_score
      weekMap[key].count++
    })
    const weeklyTrend = Object.entries(weekMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, { total, count }]) => ({
        week,
        avg: Math.round(total / count),
        count,
      }))

    // ── GPT NARRATIVE (global only) ─────────────────────────────────────────
    let aiNarrative = ''
    if (type === 'global') {
      const periodLabel = period === '30' ? '30 days' : period === '90' ? '90 days' : '6 months'
      const prompt = locale === 'fr'
        ? `Tu es un expert en nutrition et longévité. Analyse les données nutritionnelles suivantes sur les ${periodLabel === '30 days' ? '30 derniers jours' : periodLabel === '90 days' ? '90 derniers jours' : '6 derniers mois'} et rédige une analyse narrative en 3-4 paragraphes, en français, dans un style professionnel et précis.

Données :
- Score Fuel moyen : ${avgScore}/100
- Nombre de repas scannés : ${scoredLogs.length}
- Score par repas : ${byMeal.map(m => `${m.meal} ${m.avg ?? 'n/a'}/100 (${m.count} scans)`).join(', ')}
- Macros moyennes par repas : Protéines ${avgProtein}g, Glucides ${avgCarbs}g, Lipides ${avgFat}g, ${avgKcal} kcal
- Tendance hebdomadaire : ${weeklyTrend.map(w => `semaine du ${w.week}: ${w.avg}/100`).join(', ')}

Commente l'évolution du score, les habitudes par repas, les points forts et les axes d'amélioration. Ne liste pas les données brutes — interprète-les.`
        : locale === 'es'
        ? `Eres un experto en nutrición y longevidad. Analiza los siguientes datos nutricionales de los últimos ${periodLabel} y redacta un análisis narrativo en 3-4 párrafos, en español, en un estilo profesional y preciso.

Datos :
- Puntuación Fuel media : ${avgScore}/100
- Número de comidas escaneadas : ${scoredLogs.length}
- Puntuación por comida : ${byMeal.map(m => `${m.meal} ${m.avg ?? 'n/a'}/100 (${m.count} scans)`).join(', ')}
- Macros promedio por comida : Proteínas ${avgProtein}g, Carbohidratos ${avgCarbs}g, Grasas ${avgFat}g, ${avgKcal} kcal
- Tendencia semanal : ${weeklyTrend.map(w => `semana del ${w.week}: ${w.avg}/100`).join(', ')}

Comenta la evolución de la puntuación, los hábitos por tipo de comida, los puntos fuertes y las áreas de mejora. No listes los datos brutos — interprétalos.`
        : `You are a nutrition and longevity expert. Analyze the following nutritional data for the last ${periodLabel} and write a narrative analysis in 3-4 paragraphs, in English, in a professional and precise style.

Data:
- Average Fuel Score: ${avgScore}/100
- Total meals scanned: ${scoredLogs.length}
- Score by meal type: ${byMeal.map(m => `${m.meal} ${m.avg ?? 'n/a'}/100 (${m.count} scans)`).join(', ')}
- Average macros per meal: Protein ${avgProtein}g, Carbs ${avgCarbs}g, Fat ${avgFat}g, ${avgKcal} kcal
- Weekly trend: ${weeklyTrend.map(w => `week of ${w.week}: ${w.avg}/100`).join(', ')}

Comment on the score evolution, meal habits, strengths and improvement areas. Do not list raw data — interpret it.`

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
    const element = PDFFuelReport({
      type,
      period,
      locale,
      fullName,
      logoPath,
      watermarkPath,
      data: {
        totalScans: scoredLogs.length,
        avgScore,
        byMeal,
        avgProtein,
        avgCarbs,
        avgFat,
        avgKcal,
        weeklyTrend,
        aiNarrative,
        logs,
      },
    })

    const pdfBuffer = await renderToBuffer(element)

    // ── EMAIL ────────────────────────────────────────────────────────────────
    const subjects: Record<string, Record<string, string>> = {
      global: { en: 'Your Nutritional Intelligence Report — Lonara My Fuel', fr: 'Votre Rapport Nutritionnel — Lonara My Fuel', es: 'Su Informe Nutricional — Lonara My Fuel' },
      detail: { en: 'Your Meal Detail Report — Lonara My Fuel', fr: 'Votre Journal des Repas — Lonara My Fuel', es: 'Su Registro de Comidas — Lonara My Fuel' },
    }

    const subject = subjects[type]?.[locale] ?? subjects[type]?.['en']
    const filename = `lonara-myfuel-${type}-${period}d-${new Date().toISOString().split('T')[0]}.pdf`

    await resend.emails.send({
      from: 'Lonara <reports@lonaralabs.com>',
      to: [email],
      subject,
      html: buildEmailHtml(fullName, type, period, locale),
      attachments: [{ filename, content: pdfBuffer }],
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('fuel-report-send ERROR:', error)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}