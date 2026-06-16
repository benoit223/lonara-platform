import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

interface StateSectionProps {
  lastAssessment: any
  chronoAge: number | null
}

function CircleCard({ label, color, desc, score }: { label: string; color: string; desc: string; score: number | null }) {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    if (score == null) return
    const timer = setTimeout(() => setAnimated(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const size = 110
  const strokeWidth = 7
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = animated / 100
  const dash = circumference * pct
  const gap = circumference - dash

  const scoreColor = score == null ? '#ffffff30'
    : score >= 70 ? color
    : score >= 45 ? '#E7C980'
    : '#FF4444'

  return (
    <div className="flex flex-col items-center gap-3 rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-4 py-5">
      <div className="relative">
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={scoreColor} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeDasharray={`${dash} ${gap}`}
            style={{ transition: 'stroke-dasharray 1.2s ease-out', filter: `drop-shadow(0 0 6px ${scoreColor}80)` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[1.6rem] font-light leading-none" style={{ color: scoreColor, fontFamily: "'Cormorant Garamond', serif" }}>
            {score != null ? score : '—'}
          </span>
          <span className="text-[8px] text-white/25">/100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color }}>{label}</p>
        <p className="text-[9px] text-white/30 mt-0.5 leading-tight">{desc}</p>
      </div>
    </div>
  )
}

export default function StateSection({ lastAssessment, chronoAge }: StateSectionProps) {
  const t = useTranslations('myspace')
  const locale = useLocale()
  const a = lastAssessment as any

  const PILLARS = [
    { key: 'pillar_activate', label: t('pillar_activate'), color: '#C7AC60', desc: t('pillar_activate_desc') },
    { key: 'pillar_balance',  label: t('pillar_balance'),  color: '#5C96D8', desc: t('pillar_balance_desc') },
    { key: 'pillar_protect',  label: t('pillar_protect'),  color: '#4ADE80', desc: t('pillar_protect_desc') },
    { key: 'pillar_restore',  label: t('pillar_restore'),  color: '#A78BFA', desc: t('pillar_restore_desc') },
  ]

  const lastDate = lastAssessment
    ? new Date(lastAssessment.created_at).toLocaleDateString(
        locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : null

  const nextDate = lastAssessment
    ? new Date(new Date(lastAssessment.created_at).getTime() + 30 * 24 * 60 * 60 * 1000)
        .toLocaleDateString(
          locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-US',
          { year: 'numeric', month: 'long', day: 'numeric' }
        )
    : null

  const scores = lastAssessment?.scores ?? {}
  const scoreEntries = Object.entries(scores as Record<string, number>)
    .filter(([, v]) => typeof v === 'number')
    .sort(([, a], [, b]) => b - a)

  const top3 = scoreEntries.slice(0, 3)
  const bottom3 = scoreEntries.slice(-3).reverse()

  if (!lastAssessment) {
    return (
      <div className="mt-4 rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 px-6 py-5 text-center">
        <p className="text-[13px] italic text-[#EAE4D5]/30" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {t('state_noAssessment')}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="grid grid-cols-4 gap-3">
        {PILLARS.map(p => (
          <CircleCard key={p.key} label={p.label} color={p.color} desc={p.desc}
            score={a?.[p.key] != null ? Math.round(a[p.key]) : null} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#4ADE80]/60 mb-3">{t('state_topStrengths')}</p>
          <div className="space-y-2">
            {top3.map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <p className="text-[11px] text-white/60 capitalize">{t(`domain_${key}` as any)}</p>
                <span className="text-[12px] font-light text-[#4ADE80]">{Math.round(val)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#FF4444]/60 mb-3">{t('state_focusAreas')}</p>
          <div className="space-y-2">
            {bottom3.map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <p className="text-[11px] text-white/60 capitalize">{t(`domain_${key}` as any)}</p>
                <span className="text-[12px] font-light text-[#FF4444]">{Math.round(val)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[1.2rem] border border-[#035AA8]/60 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-3">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/70 mb-1">{t('state_lastAssessment')}</p>
          <p className="text-[12px] text-[#EAE4D5]/70">{lastDate ?? '—'}</p>
        </div>
       <div className="rounded-[1.2rem] border border-[#035AA8]/10 bg-[#0A3566]/20 backdrop-blur-xl px-5 py-3">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 mb-1">{t('state_nextRecommended')}</p>
          <p className="text-[12px] text-[#EAE4D5]/40 mb-2">{nextDate ?? '—'}</p>
          <p className="text-[9px] leading-[1.6] text-white/40">
            {t('state_nextNote')}
          </p>
        </div>
      </div>
    </div>
  )
}