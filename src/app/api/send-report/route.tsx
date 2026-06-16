import { Resend } from 'resend'
import { renderToBuffer } from '@react-pdf/renderer'
import PDFReport from '@/components/PDFReport'
import path from 'path'
import fs from 'fs'
import React from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)

const LOGO_BL_PATH   = path.join(process.cwd(), 'public', 'lonara-logo-bl.png')
const LOGO_GOLD_PATH = path.join(process.cwd(), 'public', 'lonara-logo.png')

function buildEmailHtml(fullName: string, isFullAccess: boolean, locale: string): string {
  const t = {
    en: {
      title: 'Your Longevity Dossier',
      greeting: `Hello ${fullName},`,
      body: 'Your Lonara biological intelligence report is attached to this email.',
      full: 'Your full 3-page Executive analysis is included.',
      basic: 'Your personalized overview and optimization protocol are included.',
      tagline: 'The Art of Longevity',
    },
    fr: {
      title: 'Votre Dossier de Longévité',
      greeting: `Bonjour ${fullName},`,
      body: 'Votre rapport d\'intelligence biologique Lonara est joint à cet email.',
      full: 'Votre analyse Executive complète de 3 pages est incluse.',
      basic: 'Votre aperçu personnalisé et votre protocole d\'optimisation sont inclus.',
      tagline: 'L\'Art de la Longévité',
    },
    es: {
      title: 'Su Dosier de Longevidad',
      greeting: `Hola ${fullName},`,
      body: 'Su informe de inteligencia biológica Lonara está adjunto a este correo.',
      full: 'Su análisis Executive completo de 3 páginas está incluido.',
      basic: 'Su resumen personalizado y protocolo de optimización están incluidos.',
      tagline: 'El Arte de la Longevidad',
    },
  }

  const l = t[locale as keyof typeof t] ?? t['en']

  return `
    <div style="font-family: Georgia, serif; padding: 48px 40px; background: #0f172a; color: #EAE4D5; max-width: 580px; margin: 0 auto; border-radius: 12px;">
      <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #C7AC60; margin-bottom: 20px;">Lonara Labs</p>
      <h1 style="font-size: 28px; font-weight: 300; margin: 0 0 16px 0; color: #EAE4D5;">${l.title}</h1>
      <p style="color: #94a3b8; line-height: 1.8; font-size: 14px; margin-bottom: 24px;">
        ${l.greeting}<br/><br/>
        ${l.body}
        ${isFullAccess ? l.full : l.basic}
      </p>
      <p style="font-size: 11px; color: #475569; border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 32px; line-height: 1.8;">
        Lonara Labs — ${l.tagline}<br/>
        www.lonaralabs.com
      </p>
    </div>
  `
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, fullName, scores, insights, protocols, longevityScore, biologicalAge, report, variant, locale } = body

    const tier = report?.user?.memberType ?? body.memberType ?? 'member'
    const isFullAccess = tier === 'executive' || tier === 'premium'
    const logoFile = variant === 'color' ? LOGO_GOLD_PATH : LOGO_BL_PATH
    const logoBuffer = fs.readFileSync(logoFile)
    const logoPath = `data:image/png;base64,${logoBuffer.toString('base64')}`
    const watermarkBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'LOGOOFFICIELTRANSPNOIR.png'))
    const watermarkPath = `data:image/png;base64,${watermarkBuffer.toString('base64')}`

  const element = PDFReport({
  fullName,
  scores,
  insights: insights ?? [],
  protocols: protocols ?? [],
  longevityScore,
  biologicalAge,
  report,
  variant: variant ?? 'bw',
  tier,
  showPage1: true,
  showPage2: isFullAccess,
  showPage3: true,
 logoPath,
  watermarkPath,
  locale: locale ?? 'en',
})

const pdfBuffer = await renderToBuffer(element)

    const subjects: Record<string, string> = {
      bw:    locale === 'fr' ? 'Votre Rapport de Longévité Lonara' : locale === 'es' ? 'Su Informe de Longevidad Lonara' : 'Your Lonara Longevity Report',
      color: locale === 'fr' ? 'Votre Rapport de Longévité Lonara — Édition Prestige' : locale === 'es' ? 'Su Informe de Longevidad Lonara — Edición Prestige' : 'Your Lonara Longevity Report — Prestige Edition',
    }

    await resend.emails.send({
      from: 'Lonara <reports@lonaralabs.com>',
      to: [email],
      subject: subjects[variant ?? 'bw'],
      html: buildEmailHtml(fullName, isFullAccess, locale ?? 'en'),
      attachments: [{
        filename: `lonara-longevity-report-${variant ?? 'bw'}-${new Date().toLocaleString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/[\s,:\/]/g, '-').replace('--', '-')}m.pdf`,
        content: pdfBuffer,
      }],
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('send-report ERROR:', error)
    return Response.json({ error: 'Email failed' }, { status: 500 })
  }
}