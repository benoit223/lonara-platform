import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'

Font.registerHyphenationCallback((word) => [word])

const STRINGS: Record<string, Record<string, string>> = {
  title_global:   { en: 'Nutritional Intelligence Report', fr: 'Rapport d\'Intelligence Nutritionnelle', es: 'Informe de Inteligencia Nutricional' },
  title_detail:   { en: 'Meal Detail Report', fr: 'Rapport Détaillé des Repas', es: 'Informe Detallado de Comidas' },
  subtitle_global:{ en: 'Fuel Score analysis, macro evolution and nutritional habits over the selected period.', fr: 'Analyse du score Fuel, évolution des macros et habitudes nutritionnelles sur la période sélectionnée.', es: 'Análisis del score Fuel, evolución de macros y hábitos nutricionales en el período seleccionado.' },
  subtitle_detail:{ en: 'Complete log of all scanned meals with nutritional analysis and AI insights.', fr: 'Journal complet de tous les repas scannés avec analyse nutritionnelle et insights IA.', es: 'Registro completo de todas las comidas escaneadas con análisis nutricional e insights de IA.' },
  period:         { en: 'Period', fr: 'Période', es: 'Período' },
  total_scans:    { en: 'Total Scans', fr: 'Total Scans', es: 'Total Scans' },
  avg_score:      { en: 'Average Score', fr: 'Score Moyen', es: 'Puntuación Media' },
  by_meal:        { en: 'Score by Meal Type', fr: 'Score par Type de Repas', es: 'Puntuación por Tipo de Comida' },
  avg_macros:     { en: 'Average Macros per Meal', fr: 'Macros Moyennes par Repas', es: 'Macros Promedio por Comida' },
  protein:        { en: 'Protein', fr: 'Protéines', es: 'Proteínas' },
  carbs:          { en: 'Carbs', fr: 'Glucides', es: 'Carbohidratos' },
  fat:            { en: 'Fat', fr: 'Lipides', es: 'Grasas' },
  kcal:           { en: 'Kcal', fr: 'Kcal', es: 'Kcal' },
  breakfast:      { en: 'Breakfast', fr: 'Petit-déjeuner', es: 'Desayuno' },
  lunch:          { en: 'Lunch', fr: 'Déjeuner', es: 'Almuerzo' },
  dinner:         { en: 'Dinner', fr: 'Dîner', es: 'Cena' },
  snack:          { en: 'Snack', fr: 'Collation', es: 'Merienda' },
  scans:          { en: 'scans', fr: 'scans', es: 'scans' },
  ai_analysis:    { en: 'AI Nutritional Analysis', fr: 'Analyse Nutritionnelle IA', es: 'Análisis Nutricional IA' },
  weekly_trend:   { en: 'Weekly Score Trend', fr: 'Tendance Score Hebdomadaire', es: 'Tendencia de Puntuación Semanal' },
  week:           { en: 'Week', fr: 'Semaine', es: 'Semana' },
  meals:          { en: 'Meal Log', fr: 'Journal des Repas', es: 'Registro de Comidas' },
  score:          { en: 'Score', fr: 'Score', es: 'Puntuación' },
  alerts:         { en: 'Alerts', fr: 'Alertes', es: 'Alertas' },
  narrative:      { en: 'Analysis', fr: 'Analyse', es: 'Análisis' },
  footer:         { en: 'Lonara Labs — My Fuel Nutritional Report — Confidential — www.lonaralabs.com', fr: 'Lonara Labs — Rapport Nutritionnel My Fuel — Confidentiel — www.lonaralabs.com', es: 'Lonara Labs — Informe Nutricional My Fuel — Confidencial — www.lonaralabs.com' },
  copyright:      { en: '© 2026 Lonara Labs — All Rights Reserved', fr: '© 2026 Lonara Labs — Tous Droits Réservés', es: '© 2026 Lonara Labs — Todos los Derechos Reservados' },
  disclaimer:     { en: 'This report is for informational and wellness purposes only and does not constitute medical advice.', fr: 'Ce rapport est fourni à des fins d\'information et de bien-être uniquement et ne constitue pas un avis médical.', es: 'Este informe es solo para fines informativos y de bienestar y no constituye asesoramiento médico.' },
}

function t(key: string, locale: string): string {
  return STRINGS[key]?.[locale] ?? STRINGS[key]?.['en'] ?? key
}

function scoreColor(s: number) {
  return s >= 70 ? '#4ADE80' : s >= 45 ? '#E7C980' : '#FF4D6D'
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
  brand: { fontSize: 7, color: '#1A6B35', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  title: { fontSize: 18, fontWeight: 700, color: '#111111', marginBottom: 4 },
  sub: { fontSize: 8, color: '#555555', lineHeight: 1.6, maxWidth: 320 },
  label: { fontSize: 7, textTransform: 'uppercase', letterSpacing: 2, color: '#1A6B35', marginBottom: 5 },
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

export type PDFFuelReportProps = {
  type: 'global' | 'detail'
  period: string
  locale: string
  fullName: string
  logoPath: string
  watermarkPath: string
  data: {
    totalScans: number
    avgScore: number | null
    byMeal: { meal: string; count: number; avg: number | null }[]
    avgProtein: number | null
    avgCarbs: number | null
    avgFat: number | null
    avgKcal: number | null
    weeklyTrend: { week: string; avg: number; count: number }[]
    aiNarrative: string
    logs: {
      id: string
      created_at: string
      meal_time: string
      fuel_score: number | null
      macros: { protein: number; carbs: number; fat: number; kcal: number } | null
      alerts: { message: string }[] | null
      ai_narrative: string | null
    }[]
  }
}

export default function PDFFuelReport({ type, period, locale, fullName, logoPath, watermarkPath, data }: PDFFuelReportProps) {
  const l = locale
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const periodLabel = period === '30' 
    ? locale === 'fr' ? '30 derniers jours' : locale === 'es' ? 'Últimos 30 días' : 'Last 30 days'
    : period === '90'
    ? locale === 'fr' ? '90 derniers jours' : locale === 'es' ? 'Últimos 90 días' : 'Last 90 days'
    : locale === 'fr' ? '6 derniers mois' : locale === 'es' ? 'Últimos 6 meses' : 'Last 6 months'

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {watermarkPath && <Image src={watermarkPath} style={styles.watermark} fixed />}

        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
            {logoPath && <Image src={logoPath} style={styles.logo} />}
            <View>
              <Text style={styles.brand}>Lonara Labs — My Fuel</Text>
              <Text style={styles.title}>{t(type === 'global' ? 'title_global' : 'title_detail', l)}</Text>
              <Text style={styles.sub}>{t(type === 'global' ? 'subtitle_global' : 'subtitle_detail', l)}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 4 }}>
            <Text style={{ fontSize: 7, color: '#64748B' }}>{date}</Text>
            <Text style={{ fontSize: 7, color: '#64748B' }}>{fullName}</Text>
            <Text style={{ fontSize: 7, color: '#1D9E75' }}>{periodLabel}</Text>
          </View>
        </View>

        {type === 'global' && (
          <>
            {/* KPIs */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              {[
                { label: t('total_scans', l), value: String(data.totalScans), unit: t('scans', l), color: '#EAE4D5' },
                { label: t('avg_score', l), value: data.avgScore ? String(data.avgScore) : '—', unit: '/100', color: data.avgScore ? scoreColor(data.avgScore) : '#64748B' },
                { label: t('protein', l), value: data.avgProtein ? `${data.avgProtein}g` : '—', unit: '/meal', color: '#1D9E75' },
                { label: t('carbs', l), value: data.avgCarbs ? `${data.avgCarbs}g` : '—', unit: '/meal', color: '#E7C980' },
                { label: t('fat', l), value: data.avgFat ? `${data.avgFat}g` : '—', unit: '/meal', color: '#5C96D8' },
                { label: t('kcal', l), value: data.avgKcal ? String(data.avgKcal) : '—', unit: 'kcal', color: '#EAE4D5' },
              ].map((kpi, i) => (
                <View key={i} style={{ flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: '#DEDEDE', backgroundColor: '#F7F7F7' }}>
                  <Text style={{ fontSize: 6, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{kpi.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: 700, color: kpi.color, lineHeight: 1 }}>{kpi.value}</Text>
                  <Text style={{ fontSize: 6.5, color: '#64748B', marginTop: 2 }}>{kpi.unit}</Text>
                </View>
              ))}
            </View>

            {/* SCORE PAR REPAS */}
            <Text style={styles.label}>{t('by_meal', l)}</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
              {data.byMeal.map((m, i) => {
                const mealLabel = t(m.meal, l)
                const col = m.avg ? scoreColor(m.avg) : '#64748B'
                return (
                  <View key={i} style={{ flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: '#DEDEDE', backgroundColor: '#F7F7F7' }}>
                    <Text style={{ fontSize: 6.5, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{mealLabel}</Text>
                    <Text style={{ fontSize: 18, fontWeight: 700, color: col, lineHeight: 1 }}>{m.avg ?? '—'}</Text>
                    <Text style={{ fontSize: 6.5, color: '#64748B', marginTop: 2 }}>{m.count} {t('scans', l)}</Text>
                    {m.avg && (
                      <View style={[styles.bar, { marginTop: 5 }]}>
                        <View style={{ height: 4, borderRadius: 999, width: `${m.avg}%`, backgroundColor: col }} />
                      </View>
                    )}
                  </View>
                )
              })}
            </View>

            {/* WEEKLY TREND */}
            {data.weeklyTrend.length > 1 && (
              <>
                <Text style={styles.label}>{t('weekly_trend', l)}</Text>
                <View style={[styles.card, { marginBottom: 12 }]}>
                  {data.weeklyTrend.map((w, i) => {
                    const col = scoreColor(w.avg)
                    return (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 }}>
                        <Text style={{ width: 70, fontSize: 7, color: '#64748B' }}>{w.week}</Text>
                        <View style={[styles.bar, { flex: 1 }]}>
                          <View style={{ height: 4, borderRadius: 999, width: `${w.avg}%`, backgroundColor: col }} />
                        </View>
                        <Text style={{ width: 30, fontSize: 9, fontWeight: 700, color: col, textAlign: 'right' }}>{w.avg}</Text>
                        <Text style={{ width: 45, fontSize: 6.5, color: '#64748B' }}>{w.count} {t('scans', l)}</Text>
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
            <Text style={styles.label}>{t('meals', l)}</Text>
            {data.logs.map((log, i) => {
              const sc = log.fuel_score ?? 0
              const col = scoreColor(sc)
              const dateStr = new Date(log.created_at).toLocaleDateString(
                locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-US',
                { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
              )
              return (
                <View key={i} style={{ marginBottom: 8, padding: 10, borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: '#DEDEDE', backgroundColor: '#F7F7F7' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <View>
                      <Text style={{ fontSize: 9, color: '#EAE4D5', fontWeight: 700, textTransform: 'capitalize' }}>{t(log.meal_time, l)}</Text>
                      <Text style={{ fontSize: 7, color: '#64748B', marginTop: 1 }}>{dateStr}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 18, fontWeight: 700, color: col, lineHeight: 1 }}>{log.fuel_score ?? '—'}</Text>
                      <Text style={{ fontSize: 6, color: '#64748B', textTransform: 'uppercase' }}>{t('score', l)}</Text>
                    </View>
                  </View>
                  <View style={[styles.bar, { marginBottom: 6 }]}>
                    <View style={{ height: 4, borderRadius: 999, width: `${sc}%`, backgroundColor: col }} />
                  </View>
                  {log.macros && (
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 5 }}>
                      {[
                        { l: t('protein', locale), v: log.macros.protein, u: 'g', c: '#1D9E75' },
                        { l: t('carbs', locale),   v: log.macros.carbs,   u: 'g', c: '#E7C980' },
                        { l: t('fat', locale),     v: log.macros.fat,     u: 'g', c: '#5C96D8' },
                        { l: t('kcal', locale),    v: log.macros.kcal,    u: '',  c: '#EAE4D5' },
                      ].map((m, j) => (
                        <Text key={j} style={{ fontSize: 7.5, color: '#94A3B8' }}>
                          <Text style={{ color: m.c }}>{m.l} </Text>{m.v}{m.u}
                        </Text>
                      ))}
                    </View>
                  )}
                  {log.alerts && log.alerts.length > 0 && (
                    <Text style={{ fontSize: 7, color: '#E7C980', marginBottom: 3 }}>
                      ⚠ {log.alerts.map(a => a.message).join(' · ')}
                    </Text>
                  )}
                  {log.ai_narrative && (
                    <Text style={{ fontSize: 7.5, color: '#64748B', lineHeight: 1.6 }}>{log.ai_narrative}</Text>
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