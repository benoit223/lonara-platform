import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'

Font.registerHyphenationCallback((word) => [word])

const STRINGS: Record<string, Record<string, string>> = {
  title_global:   { en: 'Visual Longevity Report', fr: 'Rapport de Longévité Visuelle', es: 'Informe de Longevidad Visual' },
  title_detail:   { en: 'Session Detail Report', fr: 'Rapport Détaillé des Sessions', es: 'Informe Detallado de Sesiones' },
  subtitle_global:{ en: 'Perceived age, visual aging index and phenotypic trends over the selected period.', fr: 'Âge perçu, indice de vieillissement visuel et tendances phénotypiques sur la période sélectionnée.', es: 'Edad percibida, índice de envejecimiento visual y tendencias fenotípicas en el período seleccionado.' },
  subtitle_detail:{ en: 'Complete log of all face and body sessions with visual analysis.', fr: 'Journal complet de toutes les sessions visage et corps avec analyse visuelle.', es: 'Registro completo de todas las sesiones de rostro y cuerpo con análisis visual.' },
  period:         { en: 'Period', fr: 'Période', es: 'Período' },
  chronological_age: { en: 'Chronological Age', fr: 'Âge Chronologique', es: 'Edad Cronológica' },
  perceived_age:  { en: 'Perceived Age (Face)', fr: 'Âge Perçu (Visage)', es: 'Edad Percibida (Rostro)' },
  age_gap:        { en: 'Gap', fr: 'Écart', es: 'Diferencia' },
  aging_index:    { en: 'Visual Aging Index', fr: 'Indice de Vieillissement Visuel', es: 'Índice de Envejecimiento Visual' },
  face_sessions:  { en: 'Face Sessions', fr: 'Sessions Visage', es: 'Sesiones de Rostro' },
  body_sessions:  { en: 'Body Sessions', fr: 'Sessions Corps', es: 'Sesiones de Cuerpo' },
  glogau_stage:   { en: 'Glogau Stage', fr: 'Stade Glogau', es: 'Estadio Glogau' },
  years:          { en: 'years', fr: 'ans', es: 'años' },
  face_trend:     { en: 'Perceived Age Trend', fr: 'Tendance Âge Perçu', es: 'Tendencia Edad Percibida' },
  body_trend:     { en: 'Visual Aging Index Trend', fr: 'Tendance Indice de Vieillissement', es: 'Tendencia Índice de Envejecimiento' },
  ai_analysis:    { en: 'AI Longevity Analysis', fr: 'Analyse de Longévité IA', es: 'Análisis de Longevidad IA' },
  sessions:       { en: 'Session Log', fr: 'Journal des Sessions', es: 'Registro de Sesiones' },
  face:           { en: 'Face', fr: 'Visage', es: 'Rostro' },
  body:           { en: 'Body', fr: 'Cuerpo', es: 'Cuerpo' },
  notes:          { en: 'Notes', fr: 'Notes', es: 'Notas' },
  no_dob:         { en: 'Not available (birth date required)', fr: 'Non disponible (date de naissance requise)', es: 'No disponible (fecha de nacimiento requerida)' },
  footer:         { en: 'Lonara Labs — My Visual Longevity Report — Confidential — www.lonaralabs.com', fr: 'Lonara Labs — Rapport de Longévité Visuelle My Visual — Confidentiel — www.lonaralabs.com', es: 'Lonara Labs — Informe de Longevidad Visual My Visual — Confidencial — www.lonaralabs.com' },
  copyright:      { en: '© 2026 Lonara Labs — All Rights Reserved', fr: '© 2026 Lonara Labs — Tous Droits Réservés', es: '© 2026 Lonara Labs — Todos los Derechos Reservados' },
  disclaimer:     { en: 'This report presents indirect visual estimates for informational and wellness purposes only. It does not constitute a medical diagnosis or clinical measurement.', fr: 'Ce rapport présente des estimations visuelles indirectes à des fins d\'information et de bien-être uniquement. Il ne constitue ni un diagnostic médical ni une mesure clinique.', es: 'Este informe presenta estimaciones visuales indirectas solo con fines informativos y de bienestar. No constituye un diagnóstico médico ni una medición clínica.' },
}

function t(key: string, locale: string): string {
  return STRINGS[key]?.[locale] ?? STRINGS[key]?.['en'] ?? key
}

function agingIndexColor(v: number) {
  return v >= 75 ? '#4ADE80' : v >= 55 ? '#8FC1E8' : v >= 35 ? '#E7C980' : '#FF4D6D'
}

function gapColor(gap: number | null) {
  if (gap == null) return '#64748B'
  if (gap <= 0) return '#4ADE80'
  if (gap <= 5) return '#E7C980'
  return '#FF4D6D'
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    paddingTop: 32, paddingBottom: 44, paddingHorizontal: 36,
    color: '#111111', fontSize: 10, fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 18, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: '#BBBBBB', borderBottomStyle: 'solid',
  },
  logo: { width: 40, height: 40 },
  brand: { fontSize: 7, color: '#4A90C2', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  title: { fontSize: 18, fontWeight: 700, color: '#111111', marginBottom: 4 },
  sub: { fontSize: 8, color: '#555555', lineHeight: 1.6, maxWidth: 320 },
  label: { fontSize: 7, textTransform: 'uppercase', letterSpacing: 2, color: '#4A90C2', marginBottom: 5 },
  card: {
    marginBottom: 8, padding: 12, borderRadius: 8,
    borderWidth: 1, borderStyle: 'solid',
    borderColor: '#DEDEDE', backgroundColor: '#F7F7F7',
  },
  body: { color: '#555555', lineHeight: 1.8, fontSize: 9 },
  footer: {
    marginTop: 14, paddingTop: 8,
    borderTopWidth: 1, borderTopColor: '#DEDEDE', borderTopStyle: 'solid',
    color: '#888888', fontSize: 7.5,
  },
  pageNum: { position: 'absolute', bottom: 18, right: 36, color: '#888888', fontSize: 7.5 },
  watermark: { position: 'absolute', top: '20%', left: '5%', width: '90%', opacity: 0.04 },
  divider: { height: 1, backgroundColor: '#DEDEDE', marginVertical: 10 },
  bar: { height: 4, borderRadius: 999, backgroundColor: '#E0E0E0' },
})

export type PDFVisualReportProps = {
  type: 'global' | 'detail'
  period: string
  locale: string
  fullName: string
  logoPath: string
  watermarkPath: string
  data: {
    chronologicalAge: number | null
    avgPerceivedAge: number | null
    ageGap: number | null
    avgAgingIndex: number | null
    latestFace: Record<string, any> | null
    latestBody: Record<string, any> | null
    faceCount: number
    bodyCount: number
    faceTrend: { date: string; midpoint: number | null }[]
    bodyTrend: { date: string; index: number | null }[]
    aiNarrative: string
    analyses: {
      id: string
      session_id: string
      capture_type: string
      analysis: Record<string, any>
      created_at: string
    }[]
  }
}

export default function PDFVisualReport({ type, period, locale, fullName, logoPath, watermarkPath, data }: PDFVisualReportProps) {
  const l = locale
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const periodLabel = period === '30'
    ? locale === 'fr' ? '30 derniers jours' : locale === 'es' ? 'Últimos 30 días' : 'Last 30 days'
    : period === '90'
    ? locale === 'fr' ? '90 derniers jours' : locale === 'es' ? 'Últimos 90 días' : 'Last 90 days'
    : locale === 'fr' ? '6 derniers mois' : locale === 'es' ? 'Últimos 6 meses' : 'Last 6 months'

  const gapDisplay = data.ageGap != null
    ? `${data.ageGap > 0 ? '+' : ''}${data.ageGap}`
    : '—'

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {watermarkPath && <Image src={watermarkPath} style={styles.watermark} fixed />}

        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
            {logoPath && <Image src={logoPath} style={styles.logo} />}
            <View>
              <Text style={styles.brand}>Lonara Labs — My Visual</Text>
              <Text style={styles.title}>{t(type === 'global' ? 'title_global' : 'title_detail', l)}</Text>
              <Text style={styles.sub}>{t(type === 'global' ? 'subtitle_global' : 'subtitle_detail', l)}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 4 }}>
            <Text style={{ fontSize: 7, color: '#64748B' }}>{date}</Text>
            <Text style={{ fontSize: 7, color: '#64748B' }}>{fullName}</Text>
            <Text style={{ fontSize: 7, color: '#4A90C2' }}>{periodLabel}</Text>
          </View>
        </View>

        {type === 'global' && (
          <>
            {/* KPIs — ÂGE */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              <View style={{ flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: '#DEDEDE', backgroundColor: '#F7F7F7' }}>
                <Text style={{ fontSize: 6, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{t('chronological_age', l)}</Text>
                <Text style={{ fontSize: 14, fontWeight: 700, color: '#EAE4D5', lineHeight: 1 }}>
                  {data.chronologicalAge != null ? data.chronologicalAge : '—'}
                </Text>
                <Text style={{ fontSize: 6.5, color: '#64748B', marginTop: 2 }}>{t('years', l)}</Text>
              </View>
              <View style={{ flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: '#DEDEDE', backgroundColor: '#F7F7F7' }}>
                <Text style={{ fontSize: 6, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{t('perceived_age', l)}</Text>
                <Text style={{ fontSize: 14, fontWeight: 700, color: '#4A90C2', lineHeight: 1 }}>
                  {data.avgPerceivedAge != null ? data.avgPerceivedAge : '—'}
                </Text>
                <Text style={{ fontSize: 6.5, color: '#64748B', marginTop: 2 }}>{t('years', l)}</Text>
              </View>
              <View style={{ flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: '#DEDEDE', backgroundColor: '#F7F7F7' }}>
                <Text style={{ fontSize: 6, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{t('age_gap', l)}</Text>
                <Text style={{ fontSize: 14, fontWeight: 700, color: gapColor(data.ageGap), lineHeight: 1 }}>
                  {gapDisplay}
                </Text>
                <Text style={{ fontSize: 6.5, color: '#64748B', marginTop: 2 }}>{t('years', l)}</Text>
              </View>
              <View style={{ flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: '#DEDEDE', backgroundColor: '#F7F7F7' }}>
                <Text style={{ fontSize: 6, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{t('aging_index', l)}</Text>
                <Text style={{ fontSize: 14, fontWeight: 700, color: data.avgAgingIndex != null ? agingIndexColor(data.avgAgingIndex) : '#64748B', lineHeight: 1 }}>
                  {data.avgAgingIndex != null ? data.avgAgingIndex : '—'}
                </Text>
                <Text style={{ fontSize: 6.5, color: '#64748B', marginTop: 2 }}>/100</Text>
              </View>
            </View>

            {!data.chronologicalAge && (
              <Text style={{ fontSize: 7, color: '#94A3B8', fontStyle: 'italic', marginBottom: 12 }}>
                {t('no_dob', l)}
              </Text>
            )}

            {/* SESSIONS COUNT + GLOGAU */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              <View style={{ flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: '#DEDEDE', backgroundColor: '#F7F7F7' }}>
                <Text style={{ fontSize: 6.5, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{t('face_sessions', l)}</Text>
                <Text style={{ fontSize: 16, fontWeight: 700, color: '#EAE4D5', lineHeight: 1 }}>{data.faceCount}</Text>
              </View>
              <View style={{ flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: '#DEDEDE', backgroundColor: '#F7F7F7' }}>
                <Text style={{ fontSize: 6.5, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{t('body_sessions', l)}</Text>
                <Text style={{ fontSize: 16, fontWeight: 700, color: '#EAE4D5', lineHeight: 1 }}>{data.bodyCount}</Text>
              </View>
              <View style={{ flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: '#DEDEDE', backgroundColor: '#F7F7F7' }}>
                <Text style={{ fontSize: 6.5, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{t('glogau_stage', l)}</Text>
                <Text style={{ fontSize: 16, fontWeight: 700, color: '#4A90C2', lineHeight: 1 }}>{data.latestFace?.glogau_stage ?? '—'}</Text>
              </View>
            </View>

            {/* TENDANCE ÂGE PERÇU */}
            {data.faceTrend.length > 1 && (
              <>
                <Text style={styles.label}>{t('face_trend', l)}</Text>
                <View style={[styles.card, { marginBottom: 12 }]}>
                  {data.faceTrend.map((p, i) => {
                    const dateStr = new Date(p.date).toLocaleDateString(
                      locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-US',
                      { month: 'short', day: 'numeric' }
                    )
                    return (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 }}>
                        <Text style={{ width: 60, fontSize: 7, color: '#64748B' }}>{dateStr}</Text>
                        <View style={[styles.bar, { flex: 1 }]}>
                          <View style={{ height: 4, borderRadius: 999, width: `${Math.min(100, ((p.midpoint ?? 0) / 90) * 100)}%`, backgroundColor: '#4A90C2' }} />
                        </View>
                        <Text style={{ width: 30, fontSize: 9, fontWeight: 700, color: '#4A90C2', textAlign: 'right' }}>{p.midpoint}</Text>
                      </View>
                    )
                  })}
                </View>
              </>
            )}

            {/* TENDANCE INDICE CORPS */}
            {data.bodyTrend.length > 1 && (
              <>
                <Text style={styles.label}>{t('body_trend', l)}</Text>
                <View style={[styles.card, { marginBottom: 12 }]}>
                  {data.bodyTrend.map((p, i) => {
                    const dateStr = new Date(p.date).toLocaleDateString(
                      locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-US',
                      { month: 'short', day: 'numeric' }
                    )
                    const col = agingIndexColor(p.index ?? 0)
                    return (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 }}>
                        <Text style={{ width: 60, fontSize: 7, color: '#64748B' }}>{dateStr}</Text>
                        <View style={[styles.bar, { flex: 1 }]}>
                          <View style={{ height: 4, borderRadius: 999, width: `${p.index}%`, backgroundColor: col }} />
                        </View>
                        <Text style={{ width: 30, fontSize: 9, fontWeight: 700, color: col, textAlign: 'right' }}>{p.index}</Text>
                      </View>
                    )
                  })}
                </View>
              </>
            )}

            {/* AI NARRATIVE */}
            {data.aiNarrative && (
              <>
                <Text style={styles.label}>{t('ai_analysis', l)}</Text>
                <View style={styles.card}>
                  <Text style={styles.body}>{data.aiNarrative}</Text>
                </View>
              </>
            )}
          </>
        )}

        {type === 'detail' && (
          <>
            <Text style={styles.label}>{t('sessions', l)}</Text>
            {data.analyses.map((a, i) => {
              const dateStr = new Date(a.created_at).toLocaleDateString(
                locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-US',
                { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
              )
              const isFace = a.capture_type === 'face'
              const analysis = a.analysis ?? {}

              return (
                <View key={i} style={{ marginBottom: 8, padding: 10, borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: '#DEDEDE', backgroundColor: '#F7F7F7' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <View>
                      <Text style={{ fontSize: 9, color: '#EAE4D5', fontWeight: 700 }}>{isFace ? t('face', l) : t('body', l)}</Text>
                      <Text style={{ fontSize: 7, color: '#64748B', marginTop: 1 }}>{dateStr}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      {isFace ? (
                        <>
                          <Text style={{ fontSize: 14, fontWeight: 700, color: '#4A90C2', lineHeight: 1 }}>
                            {Array.isArray(analysis.perceived_age_range) ? `${analysis.perceived_age_range[0]}–${analysis.perceived_age_range[1]}` : '—'}
                          </Text>
                          <Text style={{ fontSize: 6, color: '#64748B', textTransform: 'uppercase' }}>{t('perceived_age', l)}</Text>
                        </>
                      ) : (
                        <>
                          <Text style={{ fontSize: 14, fontWeight: 700, color: analysis.visual_aging_index != null ? agingIndexColor(analysis.visual_aging_index) : '#64748B', lineHeight: 1 }}>
                            {analysis.visual_aging_index ?? '—'}
                          </Text>
                          <Text style={{ fontSize: 6, color: '#64748B', textTransform: 'uppercase' }}>/100</Text>
                        </>
                      )}
                    </View>
                  </View>
                  {isFace && analysis.glogau_stage && (
                    <Text style={{ fontSize: 7.5, color: '#94A3B8', marginBottom: 4 }}>
                      {t('glogau_stage', l)}: {analysis.glogau_stage}
                    </Text>
                  )}
                  {analysis.notes && (
                    <Text style={{ fontSize: 7.5, color: '#64748B', lineHeight: 1.6 }}>
                      {analysis.notes}
                    </Text>
                  )}
                </View>
              )
            })}
          </>
        )}

        {/* DISCLAIMER + FOOTER */}
        <View style={styles.divider} />
        <Text style={{ fontSize: 7, color: '#64748B', lineHeight: 1.5, marginBottom: 8 }}>{t('disclaimer', l)}</Text>
        <View style={styles.footer}><Text>{t('footer', l)}</Text></View>
        <Text style={{ fontSize: 7, color: '#64748B', marginTop: 4 }}>{t('copyright', l)}</Text>
        <Text style={styles.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  )
}