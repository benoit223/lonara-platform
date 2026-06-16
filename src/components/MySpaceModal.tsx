'use client'

import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { supabase } from '../lib/supabase'

interface MySpaceModalProps {
  onClose: () => void
  onAccess: () => void
}

const SLIDES = [
  { id: 'state',      bg: '/lonamatin.png',    character: 'Lona',    label: 'STATE' },
  { id: 'understand', bg: '/lonajour.png',     character: 'Lona',    label: 'UNDERSTAND' },
  { id: 'protocols',  bg: '/engineamatin.png', character: 'EngineA', label: 'OPTIMIZE — PROTOCOLS' },
  { id: 'products',   bg: '/engineajour.png',  character: 'EngineA', label: 'OPTIMIZE — PRODUCTS' },
  { id: 'sleep',      bg: '/engineasoir.png',  character: 'EngineA', label: 'OPTIMIZE — SLEEP' },
  { id: 'nutrition',  bg: '/engineanuit.png',  character: 'EngineA', label: 'OPTIMIZE — NUTRITION' },
  { id: 'evolve',     bg: '/gummysoir.png',    character: 'Gummy',   label: 'EVOLVE' },
  { id: 'connect',    bg: '/gummynuit.png',    character: 'Gummy',   label: 'CONNECT' },
]

// ── SLIDE STATE (my01) ────────────────────────────────────────────────────────
function SlideState() {
  const pillars = [
    { label: 'ACTIVATE', desc: 'Energy · Cognition · Performance', color: '#C7AC60', score: 75 },
    { label: 'BALANCE',  desc: 'Stress · Sleep · Hormonal',        color: '#5C96D8', score: 85 },
    { label: 'PROTECT',  desc: 'Inflammation · Immune · Gut',      color: '#4ADE80', score: 32 },
    { label: 'RESTORE',  desc: 'Recovery · Resilience · Longevity',color: '#A78BFA', score: 33 },
  ]
  return (
    <div className="absolute inset-0 flex flex-col px-4 md:px-16 pt-[80px] md:pt-[110px] pb-[110px] md:pb-[100px] overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#0A3566] mb-1 md:mb-2">BIOLOGICAL STATE</p>
      <h2 className="text-[2rem] md:text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your Living Map</h2>
      <p className="text-[12px] md:text-[13px] text-white/45 mb-3 md:mb-5 max-w-[600px]">A real-time picture of your biological age, your systems, and where your body stands today.</p>

      {/* 4 pillar circles — 2x2 mobile, 4 colonnes desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
        {pillars.map((p, i) => {
          const size = 90, r = 36, circ = 2 * Math.PI * r
          const dash = circ * (p.score / 100)
          const scoreColor = p.score >= 70 ? p.color : p.score >= 45 ? '#E7C980' : '#FF4444'
          return (
            <div key={i} className="flex flex-col items-center gap-2 rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-3 py-3 md:py-5">
              <div className="relative">
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
                  <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={scoreColor} strokeWidth={6}
                    strokeLinecap="round" strokeDasharray={`${dash} ${circ-dash}`}
                    style={{ filter: `drop-shadow(0 0 6px ${scoreColor}80)` }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[1.3rem] font-light" style={{ color: scoreColor, fontFamily: "'Cormorant Garamond', serif" }}>{p.score}</span>
                  <span className="text-[7px] text-white/25">/100</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[9px] md:text-[11px] uppercase tracking-[0.18em] md:tracking-[0.22em]" style={{ color: p.color }}>{p.label}</p>
                <p className="hidden md:block text-[9px] text-white/30 mt-0.5">{p.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Strengths / Focus */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#4ADE80]/60 mb-3">TOP STRENGTHS</p>
          {[['Sleep', 100], ['Stress', 100], ['Mobility', 96]].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center mb-2">
              <p className="text-[11px] text-white/60">{k}</p>
              <span className="text-[12px] font-light text-[#4ADE80]">{v}</span>
            </div>
          ))}
        </div>
        <div className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#FF4444]/60 mb-3">FOCUS AREAS</p>
          {[['Longevity', 0], ['Aging', 0], ['Immune', 33]].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center mb-2">
              <p className="text-[11px] text-white/60">{k}</p>
              <span className="text-[12px] font-light text-[#FF4444]">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Last / Next */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[1.2rem] border border-[#035AA8]/60 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-3">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/70 mb-1">LAST ASSESSMENT</p>
          <p className="text-[12px] text-[#EAE4D5]/70">June 13, 2026</p>
        </div>
        <div className="rounded-[1.2rem] border border-[#035AA8]/10 bg-[#0A3566]/20 backdrop-blur-xl px-5 py-3">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 mb-1">NEXT RECOMMENDED</p>
          <p className="text-[12px] text-[#EAE4D5]/40">July 13, 2026</p>
        </div>
      </div>
    </div>
  )
}

// ── SLIDE UNDERSTAND (my02) ───────────────────────────────────────────────────
function SlideUnderstand() {
  const reports = [
    { date: 'June 13, 2026', time: '07:15 PM', longevity: 48, bioAge: 26, recovery: 82, hasPdf: true },
    { date: 'June 13, 2026', time: '02:35 PM', longevity: 66, bioAge: 40, recovery: 68, hasPdf: true },
    { date: 'June 13, 2026', time: '02:30 PM', longevity: 45, bioAge: 47, recovery: 57, hasPdf: false },
    { date: 'June 13, 2026', time: '02:24 PM', longevity: 46, bioAge: 57, recovery: 57, hasPdf: false },
    { date: 'June 13, 2026', time: '02:10 PM', longevity: 58, bioAge: 56, recovery: 75, hasPdf: false },
    { date: 'June 13, 2026', time: '01:04 PM', longevity: 75, bioAge: 49, recovery: 43, hasPdf: false },
  ]
  return (
    <div className="absolute inset-0 flex flex-col px-6 md:px-16 pt-[110px] pb-[100px]">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#0A3566] mb-2">DEEP INTELLIGENCE</p>
      <h2 className="text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Understand</h2>
      <p className="text-[13px] text-white/45 mb-5 max-w-[700px]">Your Longevity Dossier, biomarker analysis, and AI-generated biological intelligence — all in one place.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-hidden" style={{ maxHeight: '380px' }}>
        {reports.map((r, i) => (
          <div key={i} className="rounded-[1rem] border border-[#035AA8]/30 bg-[#0A3566]/35 backdrop-blur-xl px-4 py-3">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[11px] text-[#EAE4D5]/70">{r.date}</p>
              <div className="flex items-center gap-2">
                <p className="text-[9px] text-white/30">{r.time}</p>
                <div className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] ${r.hasPdf ? 'border-[#C7AC60]/30 text-[#C7AC60]' : 'border-white/10 text-white/20'}`}>
                  {r.hasPdf ? '⊞ PDF ↗' : 'NO PDF'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[['LONGEVITY', r.longevity, r.longevity >= 70 ? '#4ADE80' : r.longevity >= 45 ? '#E7C980' : '#FF4444'],
                ['BIO AGE', r.bioAge, '#C7AC60'],
                ['RECOVERY', r.recovery, r.recovery >= 70 ? '#4ADE80' : '#E7C980']].map(([label, val, color]) => (
                <div key={label}>
                  <p className="text-[8px] uppercase tracking-[0.15em] text-white/30 mb-0.5">{label}</p>
                  <p className="text-[16px] font-light" style={{ color: color as string, fontFamily: "'Cormorant Garamond', serif" }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-white/30 text-center mt-3">Up to 50 reports are kept. Download or send by email anytime to keep your history.</p>
    </div>
  )
}

// ── SLIDE PROTOCOLS (my03A) ───────────────────────────────────────────────────
function SlideProtocols() {
  return (
    <div className="absolute inset-0 flex flex-col px-6 md:px-16 pt-[110px] pb-[100px]">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#0A3566] mb-2">ACTIVE PROTOCOLS</p>
      <h2 className="text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Optimize</h2>
      <p className="text-[13px] text-white/45 mb-4 max-w-[700px]">Your personalized longevity protocols across the four pillars — Activate, Balance, Protect, Restore.</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {['Protocols', 'Products', 'Sleep', 'Nutrition'].map((tab, i) => (
          <div key={tab} className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] border ${i === 0 ? 'border-[#035AA8]/60 bg-[#035AA8]/30 text-white/80' : 'border-white/10 text-white/30'}`}>
            {tab}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {[
          { period: 'MORNING', color: '#C7AC60', title: 'Morning Activation Protocol', open: false },
          { period: 'MIDDAY',  color: '#5C96D8', title: 'Midday Regulation Protocol',  open: false },
          { period: 'EVENING', color: '#A78BFA', title: 'Evening Recovery Protocol',   open: true  },
        ].map((p, i) => (
          <div key={i}>
            <div className="rounded-[1.2rem] border backdrop-blur-xl px-5 py-4"
              style={{ borderColor: `${p.color}${p.open ? '60' : '30'}`, backgroundColor: p.open ? `${p.color}15` : 'rgba(10,53,102,0.4)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: p.color }}>{p.period}</p>
                </div>
                <span className="text-[9px] text-white/40">{p.open ? '▲' : '▼'}</span>
              </div>
              <p className="text-[13px] font-light text-[#EAE4D5]/80 mt-2">{p.title}</p>
            </div>
            {p.open && (
              <div className="rounded-[1.2rem] border mt-2 backdrop-blur-xl px-5 py-4 bg-[#0A3566]/55"
                style={{ borderColor: `${p.color}40` }}>
                <p className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: p.color }}>{p.period}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {['Blue light reduction', 'Sleep environment cooling', 'Evening nervous system downregulation',
                    'Sleep optimization routine', 'Magnesium glycinate recovery support', 'Apigenin relaxation support',
                    'Glycine sleep recovery support', 'Protein recovery optimization', 'Breath-guided recovery transition',
                    'Low stimulation evening environment', 'Overnight stress-load reduction'].map((item, j) => (
                    <span key={j} className="rounded-full border px-2.5 py-1 text-[10px] text-[#EAE4D5]/70"
                      style={{ borderColor: `${p.color}25`, backgroundColor: `${p.color}10` }}>{item}</span>
                  ))}
                </div>
                <p className="text-[11px] leading-[1.8] text-white/50 italic">Maintain restorative recovery stability, regenerative signaling, and overnight physiological repair efficiency.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SLIDE PRODUCTS (my03B) ────────────────────────────────────────────────────
function SlideProducts() {
  const phases = [
    { label: 'ACTIVATE', color: '#C7AC60', products: [
      { name: 'Longevity Core', checked: true }, { name: 'Botanical Butter', checked: true },
      { name: 'Cellular Energy', checked: false }, { name: 'Wellness Gummies', checked: false },
    ]},
    { label: 'BALANCE', color: '#5C96D8', products: [
      { name: 'Neuro Balance', checked: false }, { name: 'Essential Longevity Blend', checked: true },
    ]},
    { label: 'PROTECT', color: '#4ADE80', products: [
      { name: 'Immune Defense', checked: false }, { name: 'Cellular Renewal Complex', checked: false },
    ]},
    { label: 'RESTORE', color: '#A78BFA', products: [
      { name: 'Gut Renewal', checked: true }, { name: 'Night Regeneration', checked: false },
    ]},
    { label: 'SKIN', color: '#F9A8D4', products: [
      { name: 'Pracaxi Renewal Butter', checked: false },
    ]},
  ]
  return (
    <div className="absolute inset-0 flex flex-col px-6 md:px-16 pt-[110px] pb-[100px]">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#0A3566] mb-2">ACTIVE PROTOCOLS</p>
      <h2 className="text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Optimize</h2>
      <div className="flex gap-2 mb-4">
        {['Protocols', 'Products', 'Sleep', 'Nutrition'].map((tab, i) => (
          <div key={tab} className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] border ${i === 1 ? 'border-[#035AA8]/60 bg-[#035AA8]/30 text-white/80' : 'border-white/10 text-white/30'}`}>
            {tab}
          </div>
        ))}
      </div>
      <div className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-4 mb-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/50 mb-3">LONARA PRODUCTS</p>
        <div className="grid grid-cols-2 gap-4">
          {phases.map(({ label, color, products }) => (
            <div key={label}>
              <p className="text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color }}>{label}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {products.map((p, j) => (
                  <div key={j} className={`flex md:flex-row flex-col items-center gap-2 rounded-[0.9rem] border px-2 py-2 ${p.checked ? 'border-[#4ADE80]/40 bg-[#4ADE80]/10' : 'border-white/8 bg-white/[0.02]'}`}>
                    <div className="w-5 h-5 rounded bg-white/10 shrink-0" />
                    <p className="text-[10px] text-[#EAE4D5]/70 leading-tight text-center md:text-left">{p.name}</p>
                    <div className={`w-3 h-3 rounded-full border shrink-0 flex items-center justify-center ml-auto ${p.checked ? 'border-[#4ADE80] bg-[#4ADE80]' : 'border-white/20'}`}>
                      {p.checked && <span className="text-white text-[8px]">✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/50 mb-2">OTHER SUPPLEMENTS</p>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-[#EAE4D5]/80">creatine</span>
          <span className="text-[10px] text-white/40">5GR</span>
          <span className="text-[10px] text-white/30">1 A DAY</span>
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] text-white/25">Morning</span>
        </div>
      </div>
    </div>
  )
}

// ── SLIDE SLEEP (my03C) ───────────────────────────────────────────────────────
function SlideSleep() {
  return (
    <div className="absolute inset-0 flex flex-col px-6 md:px-16 pt-[110px] pb-[100px]">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#0A3566] mb-2">ACTIVE PROTOCOLS</p>
      <h2 className="text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Optimize</h2>
      <div className="flex gap-2 mb-4">
        {['Protocols', 'Products', 'Sleep', 'Nutrition'].map((tab, i) => (
          <div key={tab} className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] border ${i === 2 ? 'border-[#035AA8]/60 bg-[#035AA8]/30 text-white/80' : 'border-white/10 text-white/30'}`}>
            {tab}
          </div>
        ))}
      </div>
      <div className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-5">
        <div className="grid grid-cols-3 gap-4 items-end mb-5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-1.5">BEDTIME</p>
            <div className="rounded-[0.7rem] border border-[#035AA8]/40 bg-[#035AA8]/10 px-3 py-2 text-[13px] text-white">23:00</div>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-1.5">WAKE TIME</p>
            <div className="rounded-[0.7rem] border border-[#035AA8]/40 bg-[#035AA8]/10 px-3 py-2 text-[13px] text-white">06:00</div>
          </div>
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-1">DURATION</p>
            <p className="text-[1.6rem] font-light text-[#4ADE80]/80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>7h</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">SLEEP TRACKER</p>
          <div className="flex flex-wrap gap-2">
            {['None', 'Oura', 'Whoop', 'Apple Watch', 'Garmin', 'Other'].map((opt, i) => (
              <div key={opt} className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] border ${i === 5 ? 'border-[#035AA8]/60 bg-[#035AA8]/30 text-white/80' : 'border-white/10 text-white/30'}`}>{opt}</div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-white/50">Sleep aids or supplements</p>
          <div className="w-10 h-5 rounded-full border border-white/15 bg-white/5 relative">
            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── SLIDE NUTRITION (my03D) ───────────────────────────────────────────────────
function SlideNutrition() {
  return (
    <div className="absolute inset-0 flex flex-col px-6 md:px-16 pt-[110px] pb-[100px]">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#0A3566] mb-2">ACTIVE PROTOCOLS</p>
      <h2 className="text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Optimize</h2>
      <div className="flex gap-2 mb-4">
        {['Protocols', 'Products', 'Sleep', 'Nutrition'].map((tab, i) => (
          <div key={tab} className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] border ${i === 3 ? 'border-[#035AA8]/60 bg-[#035AA8]/30 text-white/80' : 'border-white/10 text-white/30'}`}>
            {tab}
          </div>
        ))}
      </div>
      <div className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-5 flex flex-col gap-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">DIET TYPE</p>
          <div className="flex flex-wrap gap-2">
            {['Omnivore', 'Vegetarian', 'Vegan', 'Keto', 'Mediterranean', 'Paleo', 'Other'].map((opt, i) => (
              <div key={opt} className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] border ${i === 6 ? 'border-[#035AA8]/60 bg-[#035AA8]/30 text-white/80' : 'border-white/10 text-white/30'}`}>{opt}</div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">MEALS PER DAY</p>
          <div className="flex gap-2">
            {['1', '2', '3', '4+'].map((n, i) => (
              <div key={n} className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] border ${i === 1 ? 'border-[#035AA8]/60 bg-[#035AA8]/30 text-white/80' : 'border-white/10 text-white/30'}`}>{n}</div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">INTERMITTENT FASTING</p>
          <div className="flex flex-wrap gap-2">
            {['None', '16:8', '18:6', '20:4', 'Other'].map((opt, i) => (
              <div key={opt} className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] border ${i === 3 ? 'border-[#035AA8]/60 bg-[#035AA8]/30 text-white/80' : 'border-white/10 text-white/30'}`}>{opt}</div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">ALCOHOL</p>
          <div className="flex flex-wrap gap-2">
            {['Never', 'Occasional', 'Weekly', 'Daily'].map((opt, i) => (
              <div key={opt} className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] border ${i === 0 ? 'border-[#035AA8]/60 bg-[#035AA8]/30 text-white/80' : 'border-white/10 text-white/30'}`}>{opt}</div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">CAFFEINE</p>
          <div className="flex flex-wrap gap-2">
            {['None', '1-2 / day', '3+ / day'].map((opt, i) => (
              <div key={opt} className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] border ${i === 0 ? 'border-[#035AA8]/60 bg-[#035AA8]/30 text-white/80' : 'border-white/10 text-white/30'}`}>{opt}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── SLIDE EVOLVE (my04) ───────────────────────────────────────────────────────
function SlideEvolve() {
  const metrics = [
    { label: 'BIOLOGICAL AGE', value: '26', unit: 'yrs', color: '#C7AC60', delta: '↓ 7 yrs since start', points: '0,50 20,45 40,48 60,42 80,38 100,35 120,32 140,30 160,28 180,25', proj: '180,25 200,22 220,20' },
    { label: 'LONGEVITY SCORE', value: '48', unit: '/100', color: '#0D96FF', delta: '↑ 34/100 since start', points: '0,55 20,50 40,45 60,48 80,42 100,38 120,40 140,35 160,32 180,30', proj: '180,30 200,27 220,24' },
    { label: 'RECOVERY INDEX', value: '82', unit: '%', color: '#4ADE80', delta: '↑ 19% since start', points: '0,45 20,48 40,42 60,45 80,40 100,42 120,38 140,40 160,35 180,32', proj: '180,32 200,28 220,25' },
    { label: 'STRESS RESILIENCE', value: '100', unit: '/100', color: '#A78BFA', delta: '↑ 18/100 since start', points: '0,55 20,50 40,52 60,45 80,48 100,42 120,45 140,40 160,35 180,30', proj: '180,30 200,26 220,22' },
  ]
  return (
    <div className="absolute inset-0 flex flex-col px-4 md:px-16 pt-[75px] md:pt-[110px] pb-[110px] md:pb-[100px] overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#0A3566] mb-1 md:mb-2">TRAJECTORY</p>
      <h2 className="text-[2rem] md:text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Evolve</h2>
      <p className="hidden md:block text-[13px] text-white/45 mb-4 max-w-[700px]">Track your biological evolution over time. Every assessment, every shift — mapped into your longevity arc.</p>
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {metrics.map((m, i) => {
          // Générer des points organiques variés pour chaque métrique
          const ptSets = [
            // Bio Age — descend progressivement avec légère remontée
            [[0,52],[25,48],[50,50],[75,44],[100,42],[125,38],[150,35],[175,30],[200,28],[220,25]],
            // Longevity — monte avec variations
            [[0,55],[25,50],[50,45],[75,48],[100,42],[125,38],[150,40],[175,34],[200,30],[220,27]],
            // Recovery — oscillations puis stabilise
            [[0,45],[25,48],[50,42],[75,45],[100,40],[125,43],[150,37],[175,40],[200,34],[220,30]],
            // Stress — monte fortement
            [[0,58],[25,52],[50,55],[75,48],[100,50],[125,44],[150,46],[175,38],[200,32],[220,27]],
          ]
          const projSets = [
            [[220,25],[235,22],[250,18]],
            [[220,27],[235,23],[250,19]],
            [[220,30],[235,26],[250,22]],
            [[220,27],[235,22],[250,17]],
          ]
          const pts = ptSets[i]
          const proj = projSets[i]
          const pointsStr = pts.map(([x,y]) => `${x},${y}`).join(' ')
          const projStr = proj.map(([x,y]) => `${x},${y}`).join(' ')
          // Dots sur les points
          return (
            <div key={i} className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-3 md:px-4 py-3 md:py-4">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[8px] md:text-[9px] uppercase tracking-[0.15em] md:tracking-[0.18em] text-white/40">{m.label}</p>
                <p className="hidden md:block text-[9px]" style={{ color: m.color }}>{m.delta}</p>
              </div>
              <p className="text-[1.4rem] md:text-[1.8rem] font-light mb-1 md:mb-2" style={{ color: m.color, fontFamily: "'Cormorant Garamond', serif" }}>
                {m.value}<span className="text-[10px] md:text-[11px] text-white/30 ml-1">{m.unit}</span>
              </p>
              <svg viewBox="0 0 260 65" className="w-full h-[55px]">
                {/* Gradient fill sous la courbe */}
                <defs>
                  <linearGradient id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={m.color} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={m.color} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Fill area */}
                <polygon points={`0,65 ${pointsStr} 220,65`} fill={`url(#grad${i})`} />
                {/* Ligne principale */}
                <polyline points={pointsStr} fill="none" stroke={m.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                {/* Projection dashed */}
                <polyline points={projStr} fill="none" stroke={m.color} strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" opacity="0.45" />
                {/* Dots sur points clés */}
                {pts.filter((_, j) => j % 2 === 0).map(([x,y], j) => (
                  <circle key={j} cx={x} cy={y} r="2.5" fill={m.color} opacity="0.8" />
                ))}
                {/* Dot final projection */}
                <circle cx={proj[proj.length-1][0]} cy={proj[proj.length-1][1]} r="2" fill="none" stroke={m.color} strokeWidth="1.5" opacity="0.4" strokeDasharray="2 2" />
              </svg>
              <div className="flex gap-4 mt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-[1.5px] rounded" style={{ background: m.color }} />
                  <span className="text-[8px] text-white/30 uppercase tracking-[0.1em]">Actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke={m.color} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" /></svg>
                  <span className="text-[8px] text-white/30 uppercase tracking-[0.1em]">Roadmap Projection</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 text-center mt-3">148 assessments recorded</p>
    </div>
  )
}

// ── SLIDE CONNECT (my05) ──────────────────────────────────────────────────────
function SlideConnect() {
  const messages = [
    { role: 'user', content: 'Hi How are you ?' },
    { role: 'assistant', content: "Roaring and ready to conquer! How about you? Are you ready to unleash the king within, or are you letting the lion snooze? 🦁 Let's make today roar-worthy!" },
    { role: 'user', content: 'What do you suggest for my breakfast this morning ?' },
    { role: 'assistant', content: "Why not fuel the lion with a king-worthy breakfast? Power up with a high-protein omelet, packed with veggies and a side of whole grain toast. Or will you sleep on greatness and pick the easy way out? Wake up the beast and set the tone for a victorious day! 🔥 🦁" },
  ]
  return (
    <div className="absolute inset-0 flex flex-col px-6 md:px-16 pt-[110px] pb-[100px]">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#0A3566] mb-2">YOUR COMPANION</p>
      <h2 className="text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Gummy</h2>
      <p className="text-[13px] text-white/45 mb-4">Switch companion using the toggle above.</p>
      <div className="flex-1 rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-4 flex flex-col" style={{ maxHeight: '340px' }}>
        <div className="flex-1 overflow-hidden space-y-3 mb-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-[1rem] px-4 py-3 text-[12px] leading-[1.7] ${
                msg.role === 'user' ? 'bg-white/10 text-white/80' : 'bg-[#035AA8]/20 text-[#EAE4D5]/90 border border-[#035AA8]/30'
              }`}>{msg.content}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex-1 rounded-full border border-[#035AA8]/40 bg-[#035AA8]/20 px-5 py-3 text-[13px] text-white/20">Message Gummy...</div>
          <div className="rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/10 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[#C7AC60]/50">SEND</div>
        </div>
      </div>
    </div>
  )
}

// ── COMPOSANT PRINCIPAL ───────────────────────────────────────────────────────
export default function MySpaceModal({ onClose, onAccess }: MySpaceModalProps) {
  const locale = useLocale()
  const [showTour, setShowTour] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const slide = SLIDES[currentSlide]

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError(locale === 'fr' ? 'Email ou mot de passe incorrect.' : locale === 'es' ? 'Email o contraseña incorrectos.' : 'Incorrect email or password.')
      } else {
        onAccess()
      }
    } finally {
      setLoading(false)
    }
  }

  const slideComponents: Record<string, React.ReactElement> = {
    state:      <SlideState />,
    understand: <SlideUnderstand />,
    protocols:  <SlideProtocols />,
    products:   <SlideProducts />,
    sleep:      <SlideSleep />,
    nutrition:  <SlideNutrition />,
    evolve:     <SlideEvolve />,
    connect:    <SlideConnect />,
  }

  if (showTour) {
    return (
      <div className="fixed inset-0 z-[100] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url('${slide.bg}')` }} />
        <div className="absolute inset-0 bg-[#02040A]/20" />

        {/* Calculs selon le slide */}
        {(() => {
          const isNight = slide.bg.includes('nuit') || slide.bg.includes('soir')
          const isDark = slide.bg.includes('nuit')
          const greetings: Record<string, string> = {
            state:      'Good morning',
            understand: 'Good day',
            protocols:  'Good morning',
            products:   'Good day',
            sleep:      'Good evening',
            nutrition:  'Good evening',
            evolve:     'Good evening',
            connect:    'Good night',
          }
          const phrases: Record<string, string> = {
            state:      "In the gentle dawn's embrace, may your spirit weave timeless threads of vitality through each precious breath.",
            understand: "Each data point is a conversation your body is having with time. Today, you hold the answers.",
            protocols:  "Your morning protocol is the architecture of energy — build it with precision, live it with intention.",
            products:   "Precision supplementation is not a shortcut. It is the science of becoming.",
            sleep:      "As the day softens into evening, your body prepares its most sacred act — regeneration.",
            nutrition:  "What you choose to nourish yourself with tonight becomes the foundation of tomorrow's vitality.",
            evolve:     "Every assessment is a checkpoint on a longer arc — your biological story, written one day at a time.",
            connect:    "In the stillness of night, your companion remains present — a quiet intelligence at the edge of sleep.",
          }
          const badgeColor = isDark ? 'text-[#C7AC60]/70' : 'text-black/70'
          const textColor = isDark ? 'text-white/80' : 'text-black/80'
          const textColorItalic = isDark ? 'text-white/90' : 'text-black/90'
          const phraseColor = isDark ? 'text-white/55' : 'text-black/55'
          const menuActive = isDark ? 'text-white font-medium' : 'text-black font-medium'
          const menuInactive = isDark ? 'text-white/40' : 'text-black/40'
          const menuActiveBg = isDark ? 'bg-white/8 border border-white/10' : 'bg-black/8 border border-black/10'
          const chevronColor = isDark ? 'text-white/25' : 'text-black/25'
          const logo = isDark ? '/LOGOOFFICIELTRANSP.png' : '/LOGOOFFICIELTRANSPNOIR.png'
          const dividerColor = isDark ? 'from-white/5 to-transparent' : 'from-black/15 to-transparent'
          const greeting = greetings[slide.id] ?? 'Welcome'
          const phrase = phrases[slide.id] ?? ''

          return (
            <>
              {/* Navbar simulée */}
              <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-6 pt-3 md:pt-4">
                <img src={logo} alt="Lonara" className="h-14 md:h-20 w-auto opacity-90 mt-1 md:mt-2" />
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="flex items-center gap-0.5 md:gap-1 rounded-full border border-white/15 bg-white/[0.06] px-1 py-1 backdrop-blur-xl">
                    {['Lona', 'EngineA', 'Gummy'].map((char) => (
                      <div key={char} className={`rounded-full px-2 md:px-3 py-0.5 md:py-1 text-[9px] md:text-[11px] uppercase tracking-[0.12em] md:tracking-[0.18em] ${char === slide.character ? 'bg-white/20 text-white' : 'text-white/40'}`}>{char}</div>
                    ))}
                  </div>
                  <span className="hidden md:inline text-[11px] uppercase tracking-[0.18em] text-white/52">DASHBOARD — Sophie</span>
                  <button onClick={() => { setShowTour(false); setCurrentSlide(0) }}
                    className="flex items-center gap-1.5 text-white/35 hover:text-white/70 transition text-[10px] md:text-[11px] uppercase tracking-[0.18em]">
                    <X className="h-3.5 w-3.5" /><span className="hidden md:inline">Back</span>
                  </button>
                </div>
              </div>

              {/* Bloc gauche simulé */}
              <div className="absolute left-0 top-0 bottom-[140px] w-[420px] hidden md:flex items-center z-10">
                <div className="ml-8 w-[340px] rounded-[32px] border border-white/6 bg-black/24 px-10 py-8 backdrop-blur-[14px] shadow-[0_0_80px_rgba(0,0,0,0.45)] h-[484px] lg:h-[524px] relative">
                  <div className="absolute top-0 left-[12%] w-[76%] h-[2px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
                  <p className={`mb-4 text-[11px] uppercase tracking-[0.28em] ${badgeColor}`}>High-Precision Biological Profiling</p>
                  <div className={`text-[36px] font-light leading-[1.05] ${textColor}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {greeting} <span className={`italic ${textColorItalic}`}>Sophie</span>
                  </div>
                  <p className={`mt-3 text-[14px] font-light leading-[1.75] italic ${phraseColor}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {phrase}
                  </p>
                  <div className={`mt-4 h-px bg-gradient-to-r ${dividerColor}`} />
                  <nav className="mt-3 flex flex-col">
                    {['STATE', 'UNDERSTAND', 'OPTIMIZE', 'EVOLVE', 'CONNECT', 'NEW ASSESSMENT'].map((item) => {
                      const isActive = item === slide.label.split(' — ')[0]
                      return (
                        <div key={item} className={`flex items-center gap-4 rounded-[0.8rem] px-4 py-1.5 relative ${isActive ? menuActiveBg : 'border border-transparent'}`}>
                          {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-[#C7AC60]" />}
                          <span className={`text-[12px] uppercase tracking-[0.24em] ${isActive ? menuActive : menuInactive}`}>{item}</span>
                          {isActive && <span className={`ml-auto text-[10px] ${chevronColor}`}>›</span>}
                        </div>
                      )
                    })}
                  </nav>
                </div>
              </div>
            </>
          )
        })()}

        {/* Contenu slide */}
        <div className="absolute left-0 md:left-[420px] top-0 right-0 bottom-[100px] md:bottom-[140px] z-10 overflow-y-auto overflow-x-hidden">
          {slideComponents[slide.id]}
        </div>

        {/* 4 cards bas simulées */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-3 md:px-8 pb-3 md:pb-6">
          <div className="grid grid-cols-2 md:flex gap-2 md:gap-3 max-w-[1400px] mx-auto">
            {[
              { label: 'BIO AGE', value: '26', unit: 'yrs', dot: 'bg-[#FF4444]' },
              { label: 'LONGEVITY', value: '48', unit: '/100', dot: 'bg-[#E7C980]' },
              { label: 'RECOVERY', value: '82', unit: '%', dot: 'bg-[#4ADE80]' },
              { label: 'RESILIENCE', value: '100', unit: '/100', dot: 'bg-[#4ADE80]' },
            ].map((card) => (
              <div key={card.label} className="flex-1 rounded-[0.8rem] md:rounded-[1rem] border border-white/10 bg-black/20 backdrop-blur-xl px-3 md:px-5 py-1.5 md:py-2">
                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.22em] text-white/40 mb-0.5">{card.label}</p>
                <div className="flex items-end justify-between">
                  <div className="flex items-end gap-0.5 md:gap-1">
                    <span className="text-[1.4rem] md:text-[2rem] font-light text-[#EAE4D5]/40" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{card.value}</span>
                    <span className="text-[9px] md:text-[11px] text-white/25 mb-0.5 md:mb-1">{card.unit}</span>
                  </div>
                  <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full mb-1 md:mb-2 ${card.dot}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="absolute bottom-[105px] md:bottom-[155px] left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 md:gap-4">
          <button onClick={() => setCurrentSlide(p => Math.max(0, p - 1))}
            disabled={currentSlide === 0}
            className="rounded-full border border-white/15 bg-black/30 backdrop-blur-xl p-1.5 md:p-2 text-white/40 hover:text-white/70 disabled:opacity-20 transition">
            <ChevronLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </button>
          <div className="flex items-center gap-1.5 md:gap-2">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)}
                className={`rounded-full transition-all ${i === currentSlide ? 'w-4 md:w-5 h-1.5 bg-[#C7AC60]' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`} />
            ))}
          </div>
          {currentSlide < SLIDES.length - 1 ? (
            <button onClick={() => setCurrentSlide(p => p + 1)}
              className="rounded-full border border-white/15 bg-black/30 backdrop-blur-xl p-1.5 md:p-2 text-white/40 hover:text-white/70 transition">
              <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
          ) : (
            <button onClick={() => setShowTour(false)}
              className="rounded-full border border-[#C7AC60]/40 bg-[#C7AC60]/10 backdrop-blur-xl px-4 md:px-5 py-1.5 md:py-2 text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#C7AC60] hover:bg-[#C7AC60]/20 transition flex items-center gap-1.5 md:gap-2">
              {locale === 'fr' ? 'Accéder' : locale === 'es' ? 'Acceder' : 'Access'} <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
            </button>
          )}
        </div>

        {/* Compteur — desktop only */}
        <div className="hidden md:block absolute bottom-[155px] right-8 z-30">
          <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">{currentSlide + 1} / {SLIDES.length}</p>
        </div>

        {/* Label slide — desktop only */}
        <div className="hidden md:block absolute bottom-[155px] left-8 z-30">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#C7AC60]/50">{slide.label}</p>
        </div>
      </div>
    )
  }

  // ── LOGIN MODAL ───────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-[420px] rounded-[28px] border border-white/8 bg-[#02040A]/90 backdrop-blur-xl px-8 py-10 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
        <div className="absolute top-0 left-[18%] w-[64%] h-[1px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-80" />
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition">
          <X className="h-4 w-4" />
        </button>
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#C7AC60]/70 mb-3">My Space</p>
        <h2 className="text-[2rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {locale === 'fr' ? 'Votre Univers' : locale === 'es' ? 'Tu Universo' : 'Your Universe'}
        </h2>
        <p className="text-[13px] text-[#EAE4D5]/40 mb-8 leading-relaxed">
          {locale === 'fr' ? 'Connectez-vous pour accéder à votre espace de longévité personnalisé.' : locale === 'es' ? 'Inicie sesión para acceder a su espacio de longevidad personalizado.' : 'Sign in to access your personalized longevity space.'}
        </p>

        {/* Bouton visite guidée */}
        <button onClick={() => setShowTour(true)}
          className="relative group w-full mb-6 flex items-center justify-center gap-3 rounded-full border border-[#C7AC60]/25 bg-[#C7AC60]/5 px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-[#C7AC60]/80 backdrop-blur-xl transition hover:border-[#C7AC60]/45 hover:bg-[#C7AC60]/10 hover:text-[#E7D19A]">
          <div className="absolute top-0 left-[18%] w-[64%] h-[1px] bg-gradient-to-r from-transparent via-[#E7D19A]/60 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#C7AC60]/60 animate-pulse" />
          {locale === 'fr' ? 'Visite Guidée' : locale === 'es' ? 'Visita Guiada' : 'Guided Tour'}
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/8" />
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">{locale === 'fr' ? 'ou connectez-vous' : locale === 'es' ? 'o inicie sesión' : 'or sign in'}</p>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        <div className="flex flex-col gap-3">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder={locale === 'fr' ? 'Adresse email' : locale === 'es' ? 'Correo electrónico' : 'Email address'}
            className="rounded-[0.8rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#C7AC60]/40" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder={locale === 'fr' ? 'Mot de passe' : locale === 'es' ? 'Contraseña' : 'Password'}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="rounded-[0.8rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#C7AC60]/40" />
          {error && <p className="text-[11px] text-[#FF4444]/70 text-center">{error}</p>}
          <button onClick={handleLogin} disabled={loading || !email || !password}
            className="mt-2 rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/10 py-3 text-[11px] uppercase tracking-[0.25em] text-[#C7AC60] transition hover:bg-[#C7AC60]/20 disabled:opacity-40">
            {loading ? '...' : locale === 'fr' ? 'Accéder' : locale === 'es' ? 'Acceder' : 'Access'}
          </button>
        </div>
      </div>
    </div>
  )
}