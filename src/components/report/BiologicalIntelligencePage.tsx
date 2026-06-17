'use client'

import {
  Activity,
  Brain,
  HeartPulse,
  Moon,
  Shield,
  Waves,
} from 'lucide-react'

import { motion } from 'framer-motion'

import { getBiologicalStatus } from './data/statusEngine'
import { useTranslations } from 'next-intl'

export default function BiologicalIntelligencePage({
  report,
}: any) {

  const scores = report.scores
const tb = useTranslations('biological')

  const recoveryStatus =
    getBiologicalStatus(
      scores.recovery,
    )

  const stressStatus =
    getBiologicalStatus(
      scores.stress,
    )

  const sleepStatus =
    getBiologicalStatus(
      scores.sleep,
    )

  return (

    <section
      className="
      relative
      overflow-hidden
      rounded-[2.7rem]
      border
      border-[#0E2238]/80
      bg-[#02040A]/45
      backdrop-blur-3xl
      shadow-[0_0_2px_rgba(120,200,255,0.15),0_0_18px_rgba(3,90,168,0.10),0_0_60px_rgba(0,110,255,0.08),0_0_160px_rgba(0,80,255,0.04)]
    "
    >

      {/* AMBIENT BACKGROUND */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(3,90,168,0.12),transparent_38%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(3,90,168,0.08),transparent_65%)]" />

      <div className="absolute top-[-120px] left-[-10%] w-[320px] h-[320px] rounded-full bg-[#035AA8]/10 blur-3xl opacity-40" />

      <div className="absolute bottom-[-140px] right-[-10%] w-[260px] h-[260px] rounded-full bg-[#035AA8]/10 blur-3xl opacity-40" />

      <div className="absolute top-[18%] right-[12%] w-[500px] h-[500px] rounded-full bg-[#035AA8]/[0.05] blur-[140px]" />

      <div className="absolute bottom-[10%] left-[5%] w-[420px] h-[420px] rounded-full bg-[#C7AC60]/[0.04] blur-[120px]" />

      

      <div className="relative z-10 p-4 sm:p-6 md:p-10">

{/* EXECUTIVE BACKGROUND IMAGE */}
<div
  className="absolute inset-0 opacity-[0.3] bg-cover bg-center mix-blend-soft-light"
  style={{
    backgroundImage: "url('/f2.png')",
  }}
/>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-5 mb-6 md:mb-0">

  <img
    src="/LOGOOFFICIELTRANSP.png"
    alt="Lonara"
    className="h-24 md:h-30 w-auto opacity-95"
  />

  <div>
            <p className="text-[11px] md:text-[14px] uppercase tracking-[0.35em] text-[#C7AC60]/70 mb-1 md:mb-2">
              {tb('header_label')}
            </p>

           <h2 className="text-[2rem] sm:text-[2.4rem] md:text-[3rem] leading-[0.95] font-medium capitalize tracking-[0.04em] text-[#EAE4D5]"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
              {tb('header_title')}
            </h2>

          </div>

          <div className="hidden md:block max-w-[460px] text-right ml-auto">

            <p className="text-sm leading-relaxed text-[#EAE4D5]/50">
              {tb('header_desc')}
            </p>

          </div>

        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

          {/* LEFT */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">

<div className="flex flex-col md:flex-row gap-6">

  {/* ── A : RADAR DES 4 PILIERS ── */}
 <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-5 sm:p-6 md:p-8 backdrop-blur-xl md:w-[58%]">
    <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
    <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.05)] pointer-events-none" />

    <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-1">{tb('pillar_radar_label')}</p>
    <h3 className="text-[22px] md:text-[28px] font-extralight text-[#EAE4D5] mb-6">{tb('pillar_radar_title')}</h3>

    {(() => {
      const pillars = [
        { label: 'Activate', score: report.pillarScores?.activate ?? 50 },
        { label: 'Balance',  score: report.pillarScores?.balance  ?? 50 },
        { label: 'Protect',  score: report.pillarScores?.protect  ?? 50 },
        { label: 'Restore',  score: report.pillarScores?.restore  ?? 50 },
      ]

     const cx = 210
const cy = 190
const maxR = 90
      const n = pillars.length
      const angleOffset = -Math.PI / 2

      const rings = [25, 50, 75, 100]

      const points = pillars.map((p, i) => {
        const angle = angleOffset + (i / n) * 2 * Math.PI
        const r = (p.score / 100) * maxR
        return {
          x: cx + r * Math.cos(angle),
          y: cy + r * Math.sin(angle),
         lx: cx + (maxR + 50) * Math.cos(angle),
ly: cy + (maxR + 57) * Math.sin(angle),
          angle,
          ...p,
        }
      })

      const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ')

      const scoreColor = (s: number) =>
        s >= 80 ? '#7EE2A8' : s >= 65 ? '#C7AC60' : s >= 45 ? '#FF9F43' : '#FF4D6D'

      return (
        <div className="flex flex-col items-center relative z-10 translate-x-[-10px] md:translate-x-0 -translate-y-[20px]">
  <svg viewBox="-10 20 420 360" className="w-full max-w-[420px] relative z-10 md:translate-x-[-10px]">
            {rings.map((pct) => {
              const r = (pct / 100) * maxR
              const ringPoints = Array.from({ length: n }, (_, i) => {
                const angle = angleOffset + (i / n) * 2 * Math.PI
                return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
              }).join(' ')
              return (
                <polygon
                  key={pct}
                  points={ringPoints}
                  fill="none"
                  stroke="rgba(199,172,96,0.35)"
                  strokeWidth="1"
                />
              )
            })}

            {pillars.map((_, i) => {
              const angle = angleOffset + (i / n) * 2 * Math.PI
              return (
                <line
                  key={i}
                  x1={cx} y1={cy}
                  x2={cx + maxR * Math.cos(angle)}
                  y2={cy + maxR * Math.sin(angle)}
                  stroke="rgba(199,172,96,0.15)"
                  strokeWidth="2"
                />
              )
            })}

            <polygon
              points={polyPoints}
              fill="rgba(199,172,96,0.12)"
              stroke="rgba(199,172,96,0.7)"
              strokeWidth="2"
            />

            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x} cy={p.y}
                r="5"
                fill={scoreColor(p.score)}
                style={{ filter: `drop-shadow(0 0 6px ${scoreColor(p.score)})` }}
              />
            ))}

            {points.map((p, i) => {
              const isLeft = p.lx < cx - 10
              return (
                <g key={i}>
                  <text
                    x={p.lx}
                    y={p.ly - 4}
                    textAnchor={isLeft ? 'end' : p.lx > cx + 10 ? 'start' : 'middle'}
                    fontSize="11"
                    fill="rgba(231,209,154,0.7)"
                    fontFamily="Inter, sans-serif"
                    letterSpacing="1.5"
                    
                    style={{ textTransform: 'uppercase' }}
                  >
                    {p.label.toUpperCase()}
                  </text>
                  <text
                    x={p.lx}
                    y={p.ly + 10}
                    textAnchor={isLeft ? 'end' : p.lx > cx + 10 ? 'start' : 'middle'}
                    fontSize="15"
                    fill={scoreColor(p.score)}
                    fontFamily="Inter, sans-serif"
                    fontWeight="300"
                  >
                    {p.score}
                  </text>
                </g>
              )
            })}

            <text
              x={cx} y={cy - 8}
              textAnchor="middle"
              fontSize="22"
              fill="rgba(231,209,154,0.9)"
              fontFamily="Inter, sans-serif"
              fontWeight="200"
            >
              {report.longevityScore ?? 0}
            </text>
            <text
              x={cx} y={cy + 10}
              textAnchor="middle"
              fontSize="8"
              fill="rgba(199,172,96,0.5)"
              fontFamily="Inter, sans-serif"
              letterSpacing="1"
            >
              {tb('vital_index')}
            </text>
          </svg>

{/* RONDGRAPH + EFFETS */}
<div className="absolute left-[53%] md:left-1/2 top-[172px] -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] pointer-events-none z-0">

  {/* CABLE */}
  <img
    src="/cable2.png"
    alt=""
    className="absolute inset-0 w-full h-full object-contain opacity-90 scale-[1.] saturate-[2.5] brightness-[1.0] select-none"
  style={{ transform: 'scaleX(1.4) scaleY(1.7) rotate(48deg) translateX(110px) translateY(-126px)' }}
  />

  {/* LUEURS */}
<div className="absolute inset-0 rounded-full bg-[#C7AC60]/10 blur-[120px] scale-[1.4] opacity-80" />
<div className="absolute inset-0 rounded-full bg-[#E7D19A]/8 blur-[80px] scale-[0.9] opacity-60" />
<div className="absolute inset-0 rounded-full bg-[#C7AC60]/20 blur-[40px] scale-[0.9] opacity-50" />
<div className="absolute bottom-[10%] left-[20%] w-[60%] h-[30%] rounded-full bg-[#E7D19A]/25 blur-[30px] opacity-60" />

  {/* ANNEAUX TOURNANTS */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="absolute w-[300px] h-[300px] rounded-full border border-[#C7AC60]/15" />
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      className="absolute w-[320px] h-[240px] rounded-full border border-[#C7AC60]/30"
    />
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
      className="absolute w-[280px] h-[220px] rounded-full border border-[#E7D19A]/25"
    />
  </div>

  {/* ROND */}
  <img
    src="/rondgraph.png"
    alt=""
    className="absolute inset-0 w-full h-full object-contain opacity-98 scale-[0.76] contrast-90 brightness-[1.4] saturate-[0.7] relative z-5"
  />
</div>

        <div className="grid grid-cols-2 gap-3 w-full mt-2 translate-y-[20px] relative z-10">
            {pillars.map((p, i) => (
              <div key={i} className="flex items-center gap-2 rounded-[10px] border border-white/5 bg-white/[0.02] px-3 py-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: scoreColor(p.score) }} />
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[#EAE4D5]/40 truncate">{p.label}</p>
                  <p className="text-[13px] font-light" style={{ color: scoreColor(p.score) }}>{p.score}<span className="text-[9px] text-white/20">/100</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    })()}
  </div>

  {/* ── B : BIOLOGICAL AGE TIMELINE ── */}
<div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-5 sm:p-6 md:p-8 backdrop-blur-xl md:flex-1">
    <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
    <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.05)] pointer-events-none" />

    <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-1">{tb('age_timeline_label')}</p>
    <h3 className="text-[22px] md:text-[28px] font-extralight text-[#EAE4D5] mb-6 md:mb-8">{tb('age_timeline_title')}</h3>

    {(() => {
      const chronoAge   = report.user?.age ?? 40
      const bioAge      = report.biologicalAge ?? chronoAge
      const longevScore = report.longevityScore ?? 50
      const optimized   = Math.max(18, bioAge - Math.round((100 - longevScore) / 10))

      const minAge = Math.min(optimized, bioAge, chronoAge) - 5
      const maxAge = Math.max(optimized, bioAge, chronoAge) + 5
      const span   = maxAge - minAge

      const pct = (age: number) => ((age - minAge) / span) * 100

      const bioColor =
        bioAge < chronoAge ? '#7EE2A8'
        : bioAge > chronoAge ? '#FF9F43'
        : '#C7AC60'

      const delta = chronoAge - bioAge
      const deltaLabel =
        delta > 0 ? `${delta.toFixed(1)} ${tb('years_younger')}`
        : delta < 0 ? `${Math.abs(delta).toFixed(1)} ${tb('years_older')}`
        : tb('aligned')

      const deltaColor =
        delta > 0 ? '#7EE2A8' : delta < 0 ? '#FF9F43' : '#C7AC60'

      return (
        <div className="flex flex-col gap-6 md:gap-8">

          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/30 mb-2">{tb('chrono')}</p>
              <p className="text-[32px] sm:text-[38px] md:text-[42px] font-extralight text-[#EAE4D5]/70">{chronoAge}</p>
              <p className="text-[9px] text-white/20">{tb('years')}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/30 mb-2">{tb('biological')}</p>
              <p className="text-[32px] sm:text-[38px] md:text-[42px] font-extralight" style={{ color: bioColor }}>{bioAge}</p>
              <p className="text-[9px]" style={{ color: bioColor }}>{deltaLabel}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/30 mb-2">{tb('optimized')}</p>
              <p className="text-[32px] sm:text-[38px] md:text-[42px] font-extralight text-[#5C96D8]">{optimized}</p>
              <p className="text-[9px] text-[#5C96D8]/60">{tb('potential')}</p>
            </div>
          </div>

          <div className="relative">
            <svg viewBox="0 0 300 100" className="w-full">

              <rect x="20" y="46" width="260" height="8" rx="4" fill="rgba(255,255,255,0.05)" />

              <rect
                x={20 + (pct(optimized) / 100) * 260 - 2}
                y="42"
                width={Math.abs((pct(bioAge) - pct(optimized)) / 100) * 260 + 4}
                height="16"
                rx="8"
                fill="rgba(92,150,216,0.15)"
              />

              <rect
                x="20"
                y="46"
                width={Math.min((pct(bioAge) / 100) * 260, 260)}
                height="8"
                rx="4"
                fill={`${bioColor}50`}
              />

              <circle cx={20 + (pct(optimized) / 100) * 260} cy="50" r="6"
                fill="#5C96D8"
                style={{ filter: 'drop-shadow(0 0 8px rgba(92,150,216,0.8))' }}
              />
              <text
                x={20 + (pct(optimized) / 100) * 260}
                y="30"
                textAnchor="middle"
                fontSize="9"
                fill="rgba(92,150,216,0.8)"
                fontFamily="Inter, sans-serif"
              >{optimized}</text>
              <text
                x={20 + (pct(optimized) / 100) * 260}
                y="20"
                textAnchor="middle"
                fontSize="7"
                fill="rgba(92,150,216,0.5)"
                fontFamily="Inter, sans-serif"
                letterSpacing="0.5"
              >{tb('potential_short')}</text>

              <circle cx={20 + (pct(bioAge) / 100) * 260} cy="50" r="8"
                fill={bioColor}
                style={{ filter: `drop-shadow(0 0 10px ${bioColor})` }}
              />
              <text
                x={20 + (pct(bioAge) / 100) * 260}
                y="80"
                textAnchor="middle"
                fontSize="10"
                fill={bioColor}
                fontFamily="Inter, sans-serif"
                fontWeight="300"
              >{bioAge}</text>
              <text
                x={20 + (pct(bioAge) / 100) * 260}
                y="92"
                textAnchor="middle"
                fontSize="7"
                fill={`${bioColor}80`}
                fontFamily="Inter, sans-serif"
                letterSpacing="0.5"
              >{tb('biological_short')}</text>

              <line
                x1={20 + (pct(chronoAge) / 100) * 260}
                y1="38"
                x2={20 + (pct(chronoAge) / 100) * 260}
                y2="62"
                stroke="rgba(231,209,154,0.5)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text
                x={20 + (pct(chronoAge) / 100) * 260}
                y="30"
                textAnchor="middle"
                fontSize="9"
                fill="rgba(231,209,154,0.5)"
                fontFamily="Inter, sans-serif"
              >{chronoAge}</text>
              <text
                x={20 + (pct(chronoAge) / 100) * 260}
                y="20"
                textAnchor="middle"
                fontSize="7"
                fill="rgba(231,209,154,0.3)"
                fontFamily="Inter, sans-serif"
                letterSpacing="0.5"
              >{tb('chrono_short')}</text>

            </svg>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[14px] border border-white/5 bg-white/[0.02] px-4 py-3">
              <p className="text-[9px] uppercase tracking-[0.18em] text-white/30 mb-1">{tb('bio_delta')}</p>
              <p className="text-[18px] font-light" style={{ color: deltaColor }}>
                {delta > 0 ? `−${delta.toFixed(1)}` : `+${Math.abs(delta).toFixed(1)}`} {tb('years')}
              </p>
              <p className="text-[10px] text-white/30 mt-0.5">{deltaLabel}</p>
            </div>
            <div className="rounded-[14px] border border-[#5C96D8]/15 bg-[#5C96D8]/[0.05] px-4 py-3">
              <p className="text-[9px] uppercase tracking-[0.18em] text-[#5C96D8]/50 mb-1">{tb('optim_potential')}</p>
              <p className="text-[18px] font-light text-[#5C96D8]">
                −{Math.max(0, bioAge - optimized)} {tb('years')}
              </p>
              <p className="text-[10px] text-[#5C96D8]/40 mt-0.5">{tb('achievable')}</p>
            </div>
          </div>

        </div>
      )
    })()}
  </div>

</div>

          {/* ── LIFESTYLE COHERENCE ── */}
          {report.aiLifestyleInsight && (
            <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-5 sm:p-6 md:p-8 backdrop-blur-xl">
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.05)] pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-1">
                    {tb('lifestyle_label')}
                  </p>
                  <h3 className="text-[22px] md:text-[28px] font-extralight text-[#EAE4D5]">
                    {tb('lifestyle_title')}
                  </h3>
                </div>
                <div className="sm:ml-auto flex items-center gap-2 rounded-full border border-[#C7AC60]/20 bg-[#C7AC60]/5 px-3 py-1.5 self-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C7AC60] animate-pulse" />
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#C7AC60]/70">
                    {tb('lifestyle_badge')}
                  </p>
                </div>
              </div>

              <div className="rounded-[20px] border border-[#C7AC60]/8 bg-black/20 px-6 py-5">
                <p className="text-[14px] leading-[2] text-[#EAE4D5]/75">
                  {report.aiLifestyleInsight}
                </p>
              </div>
            </div>
          )}

          {/* ── 1. AI BIOMARKER ANALYSIS ── */}
          {report.hasBiomarkers && report.aiBiomarkerAnalysis && (
          <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-5 sm:p-6 md:p-8 backdrop-blur-xl">
            <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
            <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.05)] pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-1">
                  {tb('ai_clinical_label')}
                </p>
                <h3 className="text-[22px] md:text-[28px] font-extralight text-[#EAE4D5]">
                  {tb('ai_clinical_title')}
                </h3>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#C7AC60]/20 bg-[#C7AC60]/5 px-3 py-1.5 self-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C7AC60] animate-pulse" />
                <p className="text-[9px] uppercase tracking-[0.22em] text-[#C7AC60]/70">
                  {report.biomarkers?.length ?? 0} {tb('markers_analyzed')}
                </p>
              </div>
            </div>

            <div className="rounded-[20px] border border-[#C7AC60]/8 bg-black/20 p-4 md:p-6 mb-6">
              <p className="text-[13px] md:text-[14px] leading-[2] text-[#EAE4D5]/75">
                {report.aiBiomarkerAnalysis}
              </p>
            </div>

            {report.biomarkers?.some((m: any) => m.status === 'critical' || m.status === 'elevated') && (
              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-[0.28em] text-[#FF9F43]/60 mb-3">
                  {tb('flagged_values')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {report.biomarkers
                    ?.filter((m: any) => m.status === 'critical' || m.status === 'elevated' || m.status === 'low')
                    .slice(0, 4)
                    .map((m: any, i: number) => {
                      const color =
                        m.status === 'critical' ? '#FF4D6D'
                        : m.status === 'elevated' ? '#FF9F43'
                        : '#60A5FA'
                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-[12px] border bg-black/20 px-4 py-3"
                          style={{ borderColor: `${color}20` }}
                        >
                          <div>
                            <p className="text-[11px] text-[#EAE4D5]/70">{m.label}</p>
                            <p className="text-[10px] text-white/30 mt-0.5">{m.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[14px] font-light" style={{ color }}>
                              {m.value} <span className="text-[10px] text-white/30">{m.unit}</span>
                            </p>
                            <p className="text-[9px] uppercase tracking-[0.18em] mt-0.5" style={{ color }}>
                              {m.status}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            <p className="mt-5 text-[10px] text-white/20 leading-relaxed">
              {tb('ai_disclaimer')}
            </p>
          </div>
          )}

          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 space-y-6">

            {/* SYSTEMS — 32 DOMAINS */}
            <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-4 sm:p-5 md:p-7 backdrop-blur-xl">
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.05)] pointer-events-none" />
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">{tb('domains')}</p>
              <h3 className="mt-3 text-[22px] md:text-[28px] font-extralight text-[#EAE4D5] mb-6">{tb('32scores')}</h3>
              {(() => {
                const pillars = [
                  { key: 'activate', color: '#7EE2A8', domains: ['energy','cognition','performance','exercise','mobility','metabolism','nutrition','sexual'] },
                  { key: 'balance',  color: '#5C96D8', domains: ['stress','sleep','hormonal','emotional','circadian','social','lifestyle'] },
                  { key: 'protect',  color: '#FF9F43', domains: ['inflammation','immune','cardiovascular','gut','detox','environment','family','skin'] },
                  { key: 'restore',  color: '#C7AC60', domains: ['recovery','resilience','longevity','aging','mindset','purpose','biohacking','advanced','wellness'] },
                ]
                const scoreColor = (s: number) =>
                  s >= 80 ? '#7EE2A8' : s >= 65 ? '#C7AC60' : s >= 45 ? '#FF9F43' : '#FF4D6D'
                return (
                  <div className="space-y-4">
                    {pillars.map((pillar) => (
                      <div key={pillar.key}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pillar.color }} />
                          <p className="text-[9px] uppercase tracking-[0.28em]" style={{ color: `${pillar.color}99` }}>{tb(`pillar_${pillar.key}`)}</p>
                          <div className="flex-1 h-px" style={{ backgroundColor: `${pillar.color}20` }} />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-1.5">
                          {pillar.domains.map((key) => {
                            const s = scores[key] ?? 0
                            const c = scoreColor(s)
                            return (
                              <div key={key} className="rounded-[10px] bg-black/20 px-2 py-2 border" style={{ borderColor: `${c}18` }}>
                                <p className="text-[8px] text-white/35 uppercase tracking-[0.12em] truncate mb-1">{tb(`domain_${key}`)}</p>
                                <div className="flex items-center gap-1">
                                  <p className="text-[13px] font-light leading-none" style={{ color: c }}>{s}</p>
                                  <div className="flex-1 h-[3px] rounded-full bg-white/5 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${s}%`, backgroundColor: c }} />
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>

            {/* ── 3. OPTIMIZATION HORIZON — Biological Age Projection ── */}
            <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-5 sm:p-6 md:p-8 backdrop-blur-xl">
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.05)] pointer-events-none" />

              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-1">
                {tb('traj_label')}
              </p>
              <h3 className="text-[22px] md:text-[28px] font-extralight text-[#EAE4D5] mb-6 md:mb-8">
                {tb('traj_title')}
              </h3>

              {(() => {
                const chronoAge   = report.user?.age ?? 40
                const bioAge      = report.biologicalAge ?? chronoAge
                const longevScore = report.longevityScore ?? 50
                const delta       = chronoAge - bioAge

                const improvementFactor = (100 - longevScore) / 100
                const proj30d  = Math.max(18, bioAge - Math.round(improvementFactor * 0.3))
                const proj90d  = Math.max(18, bioAge - Math.round(improvementFactor * 0.8))
                const proj6m   = Math.max(18, bioAge - Math.round(improvementFactor * 1.8))
                const proj12m  = Math.max(18, bioAge - Math.round(improvementFactor * 3.2))

                const bioColor = delta >= 2 ? '#7EE2A8' : delta <= -2 ? '#FF9F43' : '#C7AC60'

                const deltaDesc = delta > 0
                  ? `${delta}${tb('years_younger')}`
                  : delta < 0 ? `${Math.abs(delta)}${tb('years_older')}`
                  : tb('aligned')

                const milestones = [
                  { label: 'Current', age: bioAge, color: bioColor, pct: 0, desc: deltaDesc },
                  { label: '30 Days', age: proj30d, color: '#5C96D8', pct: 25, desc: `−${bioAge - proj30d}y` },
                  { label: '90 Days', age: proj90d, color: '#5C96D8', pct: 50, desc: `−${bioAge - proj90d}y` },
                  { label: '6 Months', age: proj6m, color: '#C7AC60', pct: 75, desc: `−${bioAge - proj6m}y` },
                  { label: '12 Months', age: proj12m, color: '#7EE2A8', pct: 100, desc: `−${bioAge - proj12m}y` },
                ]

                const minAge = Math.min(proj12m, bioAge) - 2
                const maxAge = Math.max(chronoAge, bioAge) + 2
                const span   = maxAge - minAge

                return (
                  <div className="space-y-6 md:space-y-8">

                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                      <div className="rounded-[16px] border border-white/5 bg-white/[0.02] p-3 md:p-4">
                        <p className="text-[9px] uppercase tracking-[0.22em] text-white/30 mb-2">{tb('chrono')}</p>
                        <p className="text-[22px] sm:text-[26px] md:text-[28px] font-extralight text-[#EAE4D5]/70">{chronoAge}</p>
                        <p className="text-[9px] text-white/20">{tb('years')}</p>
                      </div>
                      <div className="rounded-[16px] border p-3 md:p-4" style={{ borderColor: `${bioColor}30`, backgroundColor: `${bioColor}08` }}>
                        <p className="text-[9px] uppercase tracking-[0.22em] text-white/30 mb-2">{tb('biological')}</p>
                        <p className="text-[22px] sm:text-[26px] md:text-[28px] font-extralight" style={{ color: bioColor }}>{bioAge}</p>
                        <p className="text-[9px] mt-0.5" style={{ color: bioColor }}>{deltaDesc}</p>
                      </div>
                      <div className="rounded-[16px] border border-[#7EE2A8]/20 bg-[#7EE2A8]/[0.05] p-3 md:p-4">
                        <p className="text-[9px] uppercase tracking-[0.22em] text-white/30 mb-2">12m {tb('potential')}</p>
                        <p className="text-[22px] sm:text-[26px] md:text-[28px] font-extralight text-[#7EE2A8]">{proj12m}</p>
                        <p className="text-[9px] text-[#7EE2A8]/60">−{bioAge - proj12m}y</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {milestones.map((m, i) => {
                        const barPct = Math.max(5, Math.min(100, ((m.age - minAge) / span) * 100))
                        return (
                          <div key={i} className="grid grid-cols-12 gap-2 md:gap-3 items-center">
                            <p className="col-span-3 sm:col-span-2 text-[9px] uppercase tracking-[0.16em] text-white/40 text-right">{m.label}</p>
                            <div className="col-span-6 sm:col-span-7 relative h-[6px] rounded-full bg-white/5 overflow-hidden">
                              <div
                                className="absolute left-0 top-0 h-full rounded-full transition-all"
                                style={{ width: `${barPct}%`, backgroundColor: m.color, opacity: 0.7 }}
                              />
                            </div>
                            <p className="col-span-2 text-[13px] font-light" style={{ color: m.color }}>{m.age}</p>
                            <p className="hidden sm:block col-span-1 text-[9px] text-white/25 truncate">{m.desc}</p>
                          </div>
                        )
                      })}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-[14px] border border-white/5 bg-white/[0.02] px-4 py-3">
                        <p className="text-[9px] uppercase tracking-[0.18em] text-white/30 mb-1">{tb('longevity_score')}</p>
                        <p className="text-[22px] font-light text-[#C7AC60]">{longevScore}<span className="text-[11px] text-white/20">/100</span></p>
                        <p className="text-[10px] text-white/30 mt-0.5">
                          {longevScore >= 80 ? tb('score_optimal')
                           : longevScore >= 65 ? tb('score_good')
                           : longevScore >= 50 ? tb('score_moderate')
                           : tb('score_critical')}
                        </p>
                      </div>
                      <div className="rounded-[14px] border border-[#5C96D8]/15 bg-[#5C96D8]/[0.05] px-4 py-3">
                        <p className="text-[9px] uppercase tracking-[0.18em] text-[#5C96D8]/50 mb-1">{tb('bio_age_gain')}</p>
                        <p className="text-[22px] font-light text-[#5C96D8]">−{bioAge - proj12m}<span className="text-[11px] text-[#5C96D8]/40"> {tb('years')}</span></p>
                        <p className="text-[10px] text-[#5C96D8]/40 mt-0.5">{tb('bio_age_reduction')}</p>
                      </div>
                    </div>

                    <p className="text-[10px] text-white/20 leading-relaxed">
                      {tb('projections_disclaimer')}
                    </p>

                  </div>
                )
              })()}
            </div>

          </div>

        </div>

        {/* BIOMARKERS */}
        {report.biomarkers && report.biomarkers.length > 0 && (
        <div className="relative mt-6 rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] backdrop-blur-xl flex overflow-hidden isolate">

          <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.05)] pointer-events-none" />

          <div className="flex-1 p-5 sm:p-6 md:p-8">

          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-2">
            {tb('biomarker_label')}
          </p>
          <h3 className="text-[24px] sm:text-[28px] md:text-[32px] font-extralight text-[#EAE4D5] mb-2">
            {tb('biomarker_title')}
          </h3>
          <p className="text-sm text-[#EAE4D5]/40 mb-6 md:mb-8">
            {report.biomarkers.length} {tb('biomarker_subtitle')}
          </p>

          {(() => {
            const panels: Record<string, any[]> = {}
            report.biomarkers.forEach((m: any) => {
              if (!panels[m.panel]) panels[m.panel] = []
              panels[m.panel].push(m)
            })

            const panelLabels: Record<string, string> = {
              metabolic:    tb('panel_metabolic'),
              hormonal:     tb('panel_hormonal'),
              inflammatory: tb('panel_inflammatory'),
              epigenetic:   tb('panel_epigenetic'),
              telomere:     tb('panel_telomere'),
              omics:        tb('panel_omics'),
              neuro:        tb('panel_neuro'),
              cardio:       tb('panel_cardio'),
            }

            return Object.entries(panels).map(([panel, markers]) => (
              <div key={panel} className="mb-8 last:mb-0">

                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-[#C7AC60]/10" />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#C7AC60]/50 whitespace-nowrap">
                    {panelLabels[panel] ?? panel}
                  </p>
                  <div className="h-px flex-1 bg-[#C7AC60]/10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {markers.map((marker: any, i: number) => {
                    const statusColor =
                      marker.status === 'optimal'    ? '#4ADE80'
                      : marker.status === 'borderline' ? '#FFB357'
                      : marker.status === 'low'        ? '#60A5FA'
                      : marker.status === 'elevated'   ? '#FF9F43'
                      : marker.status === 'critical'   ? '#FF4D6D'
                      : '#C7AC60'

                    const statusLabel =
                      marker.status === 'optimal'    ? 'Optimal'
                      : marker.status === 'borderline' ? 'Borderline'
                      : marker.status === 'low'        ? 'Low'
                      : marker.status === 'elevated'   ? 'Elevated'
                      : marker.status === 'critical'   ? 'Critical'
                      : marker.status

                    const hasRange = marker.optimalMin != null && marker.optimalMax != null
                    const rangeMin = marker.optimalMin ?? 0
                    const rangeMax = marker.optimalMax ?? 100
                    const rangeSpan = rangeMax - rangeMin
                    const barMin = rangeMin - rangeSpan * 0.5
                    const barMax = rangeMax + rangeSpan * 0.5
                    const pct = hasRange && marker.value != null
                      ? Math.max(0, Math.min(100, ((marker.value - barMin) / (barMax - barMin)) * 100))
                      : null
                    const optPctStart = hasRange ? ((rangeMin - barMin) / (barMax - barMin)) * 100 : null
                    const optPctEnd   = hasRange ? ((rangeMax - barMin) / (barMax - barMin)) * 100 : null

                    return (
                      <div
                        key={i}
                        className="rounded-[20px] border bg-black/20 px-4 sm:px-5 py-4"
                        style={{ borderColor: `${statusColor}22` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-[13px] text-[#EAE4D5]/90 leading-tight">
                              {marker.label}
                            </p>
                            <p className="text-[10px] text-[#C7AC60]/50 mt-0.5 uppercase tracking-[0.18em]">
                              {marker.impact} {tb('impact')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[18px] font-light leading-none" style={{ color: statusColor }}>
                              {marker.value != null ? marker.value : '—'}
                              <span className="text-[11px] text-[#EAE4D5]/30 ml-1">{marker.unit}</span>
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.18em] mt-1" style={{ color: statusColor }}>
                              {statusLabel}
                            </p>
                          </div>
                        </div>

                        {pct !== null && optPctStart !== null && optPctEnd !== null && (
                          <div className="relative h-[6px] rounded-full bg-white/5 overflow-hidden mb-2">
                            <div
                              className="absolute top-0 h-full rounded-full bg-[#4ADE80]/20"
                              style={{
                                left: `${optPctStart}%`,
                                width: `${optPctEnd - optPctStart}%`,
                              }}
                            />
                            <div
                              className="absolute top-[-2px] w-[10px] h-[10px] rounded-full border-2 border-[#02040A]"
                              style={{
                                left: `calc(${pct}% - 5px)`,
                                backgroundColor: statusColor,
                              }}
                            />
                          </div>
                        )}

                        {marker.flagMessage && (
                          <p className="text-[10px] leading-relaxed mt-2" style={{ color: statusColor }}>
                            ⚠ {marker.flagMessage}
                          </p>
                        )}

                      </div>
                    )
                  })}
                </div>

              </div>
            ))
          })()}

          </div>{/* end flex-1 content */}

{/* PHOTO — 1/4 */}
<div className="hidden md:block w-[35%] shrink-0 relative overflow-hidden rounded-tr-[32px] rounded-br-[32px] self-stretch"
  style={{ borderRadius: '0 32px 32px 0' }}
>
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: "url('/robot.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.6,
      filter: 'contrast(1) brightness(0.8)',
      transform: 'scaleX(1)',
    }}
  />
  <div className="absolute inset-0 bg-[rgba(7,17,29,0.2)]" />
</div>

        </div>
        )}

      </div>
<div className="absolute top-4 sm:top-6 md:top-10 right-4 sm:right-6 md:right-10 z-30">
  <p className="text-[11px] tracking-[0.25em] uppercase text-[#EAE4D5]/25">
    {tb('page')}
  </p>
</div>
    </section>

  )
}

function SystemCard({
  icon,
  title,
  score,
}: any) {

const scoreColor =
  score >= 85
    ? 'text-[#E7D19A]'
    : score >= 70
    ? 'text-[#C7AC60]'
    : score >= 55
    ? 'text-[#FF9F43]'
    : 'text-[#FF4D6D]'

  return (

    <div className="flex items-center justify-between rounded-[22px] border border-[#C7AC60]/12 bg-black/20 p-5">

      <div className="flex items-center gap-4">

        <div className="w-11 h-11 rounded-full border border-[#C7AC60]/12 bg-[rgba(199,172,96,0.08)] flex items-center justify-center text-[#C7AC60]">

          {icon}

        </div>

        <p className="text-sm text-[#EAE4D5]/80">
          {title}
        </p>

      </div>

      <div className="text-right">

        <p className={`text-[28px] leading-none font-extralight ${scoreColor}`}>
          {Number.isFinite(score) ? score : 0}
        </p>

        <p className="text-[10px] uppercase tracking-[0.2em] text-[#EAE4D5]/30 mt-1">
          score
        </p>

      </div>

    </div>

  )
}

function MetricRow({
  label,
  value,
}: any) {

  return (

    <div className="flex items-center justify-between border-b border-[#C7AC60]/8 pb-4">

      <p className="text-sm text-[#EAE4D5]/60">
        {label}
      </p>

      <p className="text-sm text-[#C7AC60]">
        {value}
      </p>

    </div>

  )
}

function InsightBlock({
  title,
  text,
}: any) {

  return (

    <div className="rounded-[24px] border border-[#C7AC60]/12 bg-black/20 p-6">

      <p className="text-[11px] uppercase tracking-[0.25em] text-[#C7AC60]/60 mb-4">
        {title}
      </p>

      <p className="text-sm leading-relaxed text-[#EAE4D5]/70">
        {text}
      </p>

    </div>

  )
}