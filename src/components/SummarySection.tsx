'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { supabase } from '../lib/supabase'

interface SummaryData {
  narrative: string
  recommendation: string
  age_gap: number | null
  fuel_trend_score: number | null
  coherence_level: string
  generated_at: string
}

export default function SummarySection() {
  const t = useTranslations('myspace')
  const locale = useLocale()
  const [status, setStatus] = useState<'checking' | 'generating' | 'ready' | 'unavailable'>('checking')
  const [summary, setSummary] = useState<SummaryData | null>(null)

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setStatus('unavailable'); return }

      try {
        const checkRes = await fetch('/api/summary-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        })
        const check = await checkRes.json()

        if (!check.needsRegeneration && check.hasExisting) {
          setSummary(check.lastSummary)
          setStatus('ready')
          return
        }

        setStatus('generating')
        const genRes = await fetch('/api/summary-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, locale }),
        })

        if (genRes.status === 404) {
          setStatus('unavailable')
          return
        }

        const generated = await genRes.json()
        setSummary(generated.summary)
        setStatus('ready')
      } catch (e) {
        console.error('SummarySection error:', e)
        setStatus('unavailable')
      }
    }
    run()
  }, [locale])

  const coherenceLabel: Record<string, string> = {
    low: t('summaryCoherenceLow'),
    moderate: t('summaryCoherenceModerate'),
    attention: t('summaryCoherenceAttention'),
  }

  const coherenceColor: Record<string, string> = {
    low: '#4ADE80',
    moderate: '#E7C980',
    attention: '#FF9F43',
  }

  if (status === 'checking') {
    return <p className="text-[13px] text-white/40 italic mt-4">{t('summaryChecking')}</p>
  }

  if (status === 'generating') {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="w-8 h-8 border-2 border-[#C7AC60]/30 border-t-[#C7AC60] rounded-full animate-spin" />
        <p className="text-[13px] text-white/50 italic">{t('summaryGenerating')}</p>
      </div>
    )
  }

  if (status === 'unavailable' || !summary) {
    return (
      <p className="text-[14px] italic text-white/55 mt-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('summaryUnavailable')}
      </p>
    )
  }

  return (
    <div className="mt-4 flex flex-col gap-5">
      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">{t('summaryCoherenceLabel')}</p>
          <span
            className="text-[11px] uppercase tracking-[0.14em] px-3 py-1 rounded-full border"
            style={{
              borderColor: `${coherenceColor[summary.coherence_level]}40`,
              color: coherenceColor[summary.coherence_level],
              background: `${coherenceColor[summary.coherence_level]}10`,
            }}
          >
            {coherenceLabel[summary.coherence_level] ?? summary.coherence_level}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {summary.age_gap != null && (
            <div className="rounded-[0.9rem] border border-white/8 bg-white/[0.02] px-4 py-3">
              <p className="text-[9px] uppercase tracking-[0.14em] text-white/40 mb-1">{t('summaryAgeGap')}</p>
              <p className="text-[1.3rem] font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {summary.age_gap > 0 ? `+${summary.age_gap}` : summary.age_gap}
              </p>
            </div>
          )}
          {summary.fuel_trend_score != null && (
            <div className="rounded-[0.9rem] border border-white/8 bg-white/[0.02] px-4 py-3">
              <p className="text-[9px] uppercase tracking-[0.14em] text-white/40 mb-1">{t('summaryFuelTrend')}</p>
              <p className="text-[1.3rem] font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {summary.fuel_trend_score}<span className="text-[11px] text-white/30">/100</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-6 py-5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 mb-3">{t('summaryNarrativeLabel')}</p>
        <p className="text-[14px] leading-[1.9] text-white/75 whitespace-pre-line">{summary.narrative}</p>
      </div>

  {summary.recommendation && (
  <div className="rounded-[1.2rem] border border-[#C7AC60]/30 bg-black/50 backdrop-blur-xl px-6 py-5">
    <p className="text-[10px] uppercase tracking-[0.18em] text-[#C7AC60] mb-3">{t('summaryRecommendationLabel')}</p>
    <p className="text-[14px] leading-[1.8] text-white/95">{summary.recommendation}</p>
  </div>
)}

   <p className="text-[10px] text-white/70 mt-1">
  {t('summaryLastUpdate')} {new Date(summary.generated_at).toLocaleDateString()}
</p>
    </div>
  )
}