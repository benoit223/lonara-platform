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
  { id: 'state',        bg: '/lonamatin.png',    character: 'Lona',    label: 'STATE' },
  { id: 'understand',   bg: '/lonajour.png',     character: 'Lona',    label: 'UNDERSTAND' },
  { id: 'protocols',    bg: '/engineamatin.png', character: 'EngineA', label: 'OPTIMIZE — PROTOCOLS' },
  { id: 'products',     bg: '/engineajour.png',  character: 'EngineA', label: 'OPTIMIZE — PRODUCTS' },
  { id: 'sleep',        bg: '/engineasoir.png',  character: 'EngineA', label: 'OPTIMIZE — SLEEP' },
  { id: 'nutrition',    bg: '/engineanuit.png',  character: 'EngineA', label: 'OPTIMIZE — NUTRITION' },
  { id: 'evolve',       bg: '/gummysoir.png',    character: 'Gummy',   label: 'EVOLVE' },
  { id: 'fuelToday',    bg: '/fuelmidi.png',  character: 'EngineA', label: 'MY FUEL — TODAY' },
  { id: 'fuelScan',     bg: '/fuelmatin.png', character: 'EngineA', label: 'MY FUEL — SCAN A MEAL' },
  { id: 'fuelFeed',     bg: '/fuelaprem.png', character: 'EngineA', label: 'MY FUEL — FEED' },
  { id: 'fuelEvolve',   bg: '/fuelsoir.png',  character: 'EngineA', label: 'MY FUEL — EVOLVE' },
  { id: 'fuelReport',   bg: '/fuelsoir.png',  character: 'EngineA', label: 'MY FUEL — REPORT' },
  { id: 'fuelSetup',    bg: '/fuelmatin.png', character: 'EngineA', label: 'MY FUEL — SETUP' },
  { id: 'visualResults',      bg: '/myvisualh.png', character: 'Lona', label: 'MY VISUAL — RESULTS' },
  { id: 'visualCaptureFace',  bg: '/myvisualf.png', character: 'Lona', label: 'MY VISUAL — CAPTURE FACE' },
  { id: 'visualCaptureBody',  bg: '/myvisualh.png', character: 'Lona', label: 'MY VISUAL — CAPTURE BODY' },
  { id: 'visualEvolve',       bg: '/myvisualf.png', character: 'Lona', label: 'MY VISUAL — EVOLVE' },
  { id: 'visualHistory',      bg: '/myvisualh.png', character: 'Lona', label: 'MY VISUAL — HISTORY' },
  { id: 'visualReport',       bg: '/myvisualf.png', character: 'Lona', label: 'MY VISUAL — REPORT' },
  { id: 'connect',      bg: '/gummynuit.png',    character: 'Gummy',   label: 'CONNECT' },
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

// ── SLIDE MY FUEL — TODAY (fuel01) ────────────────────────────────────────────
function SlideFuelToday() {
  const macros = [
    { label: 'PROTEIN', consumed: 92, target: '80–110', color: '#1D9E75' },
    { label: 'CARBS',   consumed: 140, target: '150–200', color: '#E7C980' },
    { label: 'FAT',     consumed: 55, target: '50–70', color: '#5C96D8' },
    { label: 'KCAL',    consumed: 1620, target: '1800–2200', color: '#EAE4D5' },
  ]
  return (
    <div className="absolute inset-0 flex flex-col px-4 md:px-16 pt-[80px] md:pt-[110px] pb-[110px] md:pb-[100px] overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#3DD4A0]/80 mb-1 md:mb-2">TODAY</p>
      <h2 className="text-[2rem] md:text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>My Fuel</h2>
      <p className="text-[12px] md:text-[13px] text-white/45 mb-3 md:mb-5 max-w-[600px]">Your active sprint, daily macro targets, and real-time nutritional tracking.</p>

      <div className="rounded-[1.2rem] border border-[#1D9E75]/40 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-[0.18em] text-[#3DD4A0]/80">RHYTHM SPRINT</span>
          <span className="text-[11px] text-white/65">9 days left · Day 5/14</span>
        </div>
        <p className="text-[12px] text-white/75 mb-3 italic">Goal: Anti-inflammatory reset</p>
        <div className="grid grid-cols-3 gap-3">
          {[['SCANNED', '12'], ['AVG SCORE', '78'], ['TODAY', '2']].map(([label, val]) => (
            <div key={label} className="text-center">
              <p className="text-[9px] uppercase tracking-[0.14em] text-white/55 mb-0.5">{label}</p>
              <p className="text-[1.4rem] font-light text-[#EAE4D5]/80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-white/8 bg-black/45 backdrop-blur-xl px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/65 mb-4">DAILY TARGETS</p>
        {macros.map((m) => (
          <div key={m.label} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-[11px] text-white/75">{m.label}</span>
              <span className="text-[11px] text-white/55">{m.consumed} / {m.target}</span>
            </div>
            <div className="h-[3px] w-full bg-white/8 rounded-full">
              <div className="h-[3px] rounded-full" style={{ width: '65%', background: m.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-[1.2rem] border border-[#1D9E75]/30 bg-[#1D9E75]/5 px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#3DD4A0]/70 mb-2">AI INSIGHT</p>
        <p className="text-[12px] text-white/70 leading-relaxed">Your protein intake is well-aligned with your anti-inflammatory goal. Consider adding omega-3 sources at dinner to further support recovery.</p>
      </div>
    </div>
  )
}

// ── SLIDE MY FUEL — SCAN (fuel02) ─────────────────────────────────────────────
function SlideFuelScan() {
  const analysisSteps = [
    { label: 'Identify foods', done: true },
    { label: 'Estimate macros', done: true },
    { label: 'Score longevity coherence', done: true },
    { label: 'Cross-check conditions & biomarkers', done: false },
  ]
  return (
    <div className="absolute inset-0 flex flex-col px-4 md:px-16 pt-[80px] md:pt-[110px] pb-[110px] md:pb-[100px] overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#3DD4A0]/80 mb-1 md:mb-2">SCAN</p>
      <h2 className="text-[2rem] md:text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>My Fuel</h2>
      <p className="text-[12px] md:text-[13px] text-white/45 mb-3 md:mb-5 max-w-[600px]">Photograph any meal — Engine A analyzes macros, longevity coherence, and personalized alerts in seconds.</p>

      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-6 py-6 mb-3">
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-[1.2rem] border border-dashed border-white/30 bg-white/[0.03] py-10 flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <p className="text-[12px] text-white/60">Take or upload a photo</p>
            <p className="text-[9px] text-white/30">JPG, PNG — max 10MB</p>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/55 mb-2">MEAL TIME</p>
              <div className="flex gap-2 flex-wrap">
                {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((m, i) => (
                  <span key={m} className={`rounded-full border px-3 py-1.5 text-[10px] ${i === 1 ? 'border-[#1D9E75]/70 bg-[#1D9E75]/15 text-[#3DD4A0]' : 'border-white/10 text-white/55'}`}>{m}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/55 mb-2">NOTE (OPTIONAL)</p>
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[11px] text-white/30">Add context to your meal...</div>
            </div>
            <div className="mt-1 rounded-full border border-[#1D9E75]/65 bg-[#1D9E75]/15 py-3 text-center text-[11px] uppercase tracking-[0.2em] text-[#3DD4A0]">Analyze Meal</div>
          </div>
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-white/8 bg-black/45 backdrop-blur-xl px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/65 mb-3">WHAT ENGINE A CHECKS</p>
        <div className="flex flex-col gap-2">
          {analysisSteps.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${s.done ? 'border-[#1D9E75] bg-[#1D9E75]/20' : 'border-white/15'}`}>
                {s.done && <span className="text-[#3DD4A0] text-[9px]">✓</span>}
              </div>
              <p className="text-[12px] text-white/65">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── SLIDE MY FUEL — FEED (fuel03) ─────────────────────────────────────────────
function SlideFuelFeed() {
  const logs = [
    { meal: 'Breakfast', score: 84, protein: 28, carbs: 35, fat: 12, time: '08:15' },
    { meal: 'Snack', score: 58, protein: 8, carbs: 22, fat: 6, time: '10:30' },
    { meal: 'Lunch', score: 72, protein: 32, carbs: 48, fat: 18, time: '12:40' },
    { meal: 'Snack', score: 65, protein: 12, carbs: 18, fat: 8, time: '16:00' },
    { meal: 'Dinner', score: 65, protein: 25, carbs: 40, fat: 22, time: '19:20' },
    { meal: 'Dinner', score: 48, protein: 20, carbs: 55, fat: 25, time: 'Yesterday' },
  ]
  return (
    <div className="absolute inset-0 flex flex-col px-4 md:px-16 pt-[80px] md:pt-[110px] pb-[110px] md:pb-[100px] overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#3DD4A0]/80 mb-1 md:mb-2">FEED</p>
      <h2 className="text-[2rem] md:text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>My Fuel</h2>
      <p className="text-[12px] md:text-[13px] text-white/45 mb-3 md:mb-5 max-w-[600px]">Every scanned meal, with its score, macros, and AI narrative.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {logs.map((log, i) => {
          const color = log.score >= 70 ? '#1D9E75' : log.score >= 45 ? '#E7C980' : '#E24B4A'
          return (
            <div key={i} className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-[13px] font-medium text-[#EAE4D5]/80">{log.meal}</p>
                  <p className="text-[10px] text-white/55">{log.time}</p>
                </div>
                <p className="text-[1.4rem] font-light leading-none" style={{ color, fontFamily: "'Cormorant Garamond', serif" }}>{log.score}</p>
              </div>
              <div className="h-[2px] w-full bg-white/8 rounded-full mb-3">
                <div className="h-[2px] rounded-full" style={{ width: `${log.score}%`, background: color }} />
              </div>
              <div className="flex gap-3 flex-wrap">
                <span className="text-[10px] text-white/65"><span className="text-white/40">P </span>{log.protein}g</span>
                <span className="text-[10px] text-white/65"><span className="text-white/40">C </span>{log.carbs}g</span>
                <span className="text-[10px] text-white/65"><span className="text-white/40">F </span>{log.fat}g</span>
              </div>
              {log.score < 55 && (
                <p className="mt-2 text-[9px] px-2 py-0.5 rounded-full border border-[#E7C980]/45 bg-[#E7C980]/5 text-[#E7C980]/90 inline-block">High sugar detected</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── SLIDE MY FUEL — EVOLVE (fuel04) ───────────────────────────────────────────
function SlideFuelEvolve() {
  const pts = [55,50,45,48,42,38,40,35,32,30]
  const path = pts.map((v,i) => `${i===0?'M':'L'} ${i*26} ${65-v*0.9}`).join(' ')
  const macroSparklines = [
    { label: 'PROTEIN', color: '#1D9E75', points: '0,20 15,15 30,18 45,10 60,8', current: '92g', delta: '+14g vs week 1' },
    { label: 'CARBS', color: '#E7C980', points: '0,10 15,14 30,12 45,18 60,16', current: '140g', delta: '−22g vs week 1' },
    { label: 'FAT', color: '#5C96D8', points: '0,18 15,16 30,14 45,15 60,12', current: '55g', delta: '−6g vs week 1' },
    { label: 'KCAL', color: '#EAE4D5', points: '0,12 15,13 30,10 45,11 60,9', current: '1620', delta: 'stable' },
  ]
  return (
    <div className="absolute inset-0 flex flex-col px-4 md:px-16 pt-[80px] md:pt-[110px] pb-[110px] md:pb-[100px] overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#3DD4A0]/80 mb-1 md:mb-2">EVOLVE</p>
      <h2 className="text-[2rem] md:text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>My Fuel</h2>
      <p className="text-[12px] md:text-[13px] text-white/45 mb-3 md:mb-5 max-w-[600px]">Your fuel score and macro trends over the last 30 days.</p>

      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/65">FUEL SCORE</p>
          <p className="text-[11px] text-[#3DD4A0]/80">76/100 latest</p>
        </div>
        <svg viewBox="0 0 260 65" className="w-full h-[60px]">
          <path d={path} fill="none" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" />
          {pts.map((v,i) => <circle key={i} cx={i*26} cy={65-v*0.9} r="2.3" fill="#1D9E75" opacity="0.8" />)}
        </svg>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-white/40">30 days ago</span>
          <span className="text-[9px] text-white/40">Today</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        {macroSparklines.map((m) => (
          <div key={m.label} className="rounded-[1rem] border border-white/8 bg-black/45 backdrop-blur-xl px-3 py-3">
            <p className="text-[9px] uppercase tracking-[0.14em] text-white/55 mb-1">{m.label}</p>
            <p className="text-[1.1rem] font-light mb-1" style={{ color: m.color, fontFamily: "'Cormorant Garamond', serif" }}>{m.current}</p>
            <svg viewBox="0 0 60 30" className="w-full h-[22px]">
              <polyline points={m.points} fill="none" stroke={m.color} strokeWidth="1.5" />
            </svg>
            <p className="text-[8px] text-white/35 mt-1">{m.delta}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-[#1D9E75]/30 bg-[#1D9E75]/5 px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#3DD4A0]/70 mb-2">TREND ANALYSIS</p>
        <p className="text-[12px] text-white/70 leading-relaxed">Protein consistency has improved steadily over the sprint, while sugar-heavy snacks have declined — a pattern strongly aligned with your anti-inflammatory goal.</p>
      </div>
    </div>
  )
}

// ── SLIDE MY FUEL — REPORT (fuel05) ───────────────────────────────────────────
function SlideFuelReport() {
  const byMeal = [
    { meal: 'Breakfast', avg: 82, count: 21 },
    { meal: 'Lunch', avg: 75, count: 22 },
    { meal: 'Dinner', avg: 63, count: 19 },
  ]
  return (
    <div className="absolute inset-0 flex flex-col px-4 md:px-16 pt-[80px] md:pt-[110px] pb-[110px] md:pb-[100px] overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#3DD4A0]/80 mb-1 md:mb-2">REPORT</p>
      <h2 className="text-[2rem] md:text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>My Fuel</h2>
      <p className="text-[12px] md:text-[13px] text-white/45 mb-3 md:mb-5 max-w-[600px]">A synthesis of your nutritional coherence — send by email or view over 30/90/180 days.</p>

      <div className="flex items-center gap-2 mb-3">
        {['30 Days', '90 Days', '180 Days'].map((p, i) => (
          <span key={p} className={`rounded-full border px-4 py-1.5 text-[10px] uppercase tracking-[0.14em] ${i === 0 ? 'border-[#1D9E75]/70 bg-[#1D9E75]/15 text-[#3DD4A0]' : 'border-white/10 text-white/55'}`}>{p}</span>
        ))}
        <div className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[10px] uppercase tracking-[0.14em] text-white/50">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Send Report
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 mb-1">AVG SCORE</p>
            <p className="text-[3rem] font-light leading-none text-[#3DD4A0]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>74</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 mb-1">TOTAL MEALS</p>
            <p className="text-[3rem] font-light leading-none text-[#EAE4D5]/70" style={{ fontFamily: "'Cormorant Garamond', serif" }}>62</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {byMeal.map((m) => {
          const color = m.avg >= 70 ? '#1D9E75' : m.avg >= 45 ? '#E7C980' : '#E24B4A'
          return (
            <div key={m.meal} className="rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-4 py-3">
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/45 mb-1">{m.meal}</p>
              <p className="text-[1.4rem] font-light leading-none mb-1" style={{ color, fontFamily: "'Cormorant Garamond', serif" }}>{m.avg}</p>
              <p className="text-[9px] text-white/30">{m.count} meals</p>
            </div>
          )
        })}
      </div>

      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 mb-3">AVG MACROS</p>
        <div className="grid grid-cols-4 gap-4">
          {[['PROTEIN','88','g','#1D9E75'],['CARBS','165','g','#E7C980'],['FAT','58','g','#5C96D8'],['KCAL','1950','','#EAE4D5']].map(([label,val,unit,color]) => (
            <div key={label as string}>
              <p className="text-[9px] uppercase tracking-[0.14em] text-white/40 mb-1">{label}</p>
              <p className="text-[1.4rem] font-light" style={{ color: color as string, fontFamily: "'Cormorant Garamond', serif" }}>{val}<span className="text-[11px] text-white/30">{unit}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── SLIDE MY FUEL — SETUP (fuel06) ────────────────────────────────────────────
function SlideFuelSetup() {
  return (
    <div className="absolute inset-0 flex flex-col px-4 md:px-16 pt-[80px] md:pt-[110px] pb-[110px] md:pb-[100px] overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#3DD4A0]/80 mb-1 md:mb-2">NEW SPRINT</p>
      <h2 className="text-[2rem] md:text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>My Fuel</h2>
      <p className="text-[12px] md:text-[13px] text-white/45 mb-3 md:mb-5 max-w-[600px]">Choose a mode, duration, and goal — Engine A calculates your personalized macro targets.</p>

      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-6 py-6 mb-3">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            {[['Pulse', 'Quick calibration, 7 days', 'All members'], ['Rhythm', 'Structured sprint, 14 days', 'Premium+'], ['Protocol', 'Deep optimization, 30 days', 'Executive']].map(([mode, desc, tier], i) => (
              <div key={mode} className={`rounded-[1rem] border px-5 py-2.5 ${i === 1 ? 'border-[#1D9E75]/70 bg-[#1D9E75]/10' : 'border-white/10 bg-white/[0.03]'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#EAE4D5]">{mode}</span>
                  <span className="text-[8px] uppercase tracking-[0.14em] text-white/30">{tier}</span>
                </div>
                <p className="text-[11px] text-white/60 mt-1">{desc}</p>
              </div>
            ))}
            <div className="mt-2">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/45 mb-2">DURATION</p>
              <div className="flex gap-2">
                {['7', '14', '30'].map((d, i) => (
                  <span key={d} className={`flex-1 rounded-full border py-1.5 text-center text-[10px] uppercase tracking-[0.1em] ${i === 1 ? 'border-[#1D9E75]/70 bg-[#1D9E75]/15 text-[#3DD4A0]' : 'border-white/10 text-white/65'}`}>{d} days</span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/65 mb-3">GOAL</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['General', 'Inflammation', 'Protein', 'Weight Loss', 'Blood Sugar', 'Longevity'].map((g, i) => (
                <span key={g} className={`rounded-full border px-3 py-1.5 text-[11px] ${i === 1 ? 'border-[#1D9E75]/70 bg-[#1D9E75]/15 text-[#3DD4A0]' : 'border-white/10 text-white/65'}`}>{g}</span>
              ))}
            </div>
            <div className="rounded-[1rem] border border-white/8 bg-black/45 backdrop-blur-xl px-4 py-3 mb-4">
              <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-2">PROJECTED DAILY TARGETS</p>
              <div className="grid grid-cols-2 gap-2">
                {[['Protein', '80–110g'], ['Carbs', '150–200g']].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[10px] text-white/55">{label}</span>
                    <span className="text-[10px] text-white/80">{val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-full border border-[#1D9E75]/65 bg-[#1D9E75]/15 py-3 text-center text-[11px] uppercase tracking-[0.2em] text-[#3DD4A0]">Start Sprint</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── SLIDE MY VISUAL — RESULTS (visual01) ──────────────────────────────────────
function SlideVisualResults() {
  return (
    <div className="absolute inset-0 flex flex-col px-4 md:px-16 pt-[80px] md:pt-[110px] pb-[110px] md:pb-[100px] overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-1 md:mb-2">RESULTS</p>
      <h2 className="text-[2rem] md:text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>My Visual</h2>
      <p className="text-[12px] md:text-[13px] text-white/45 mb-3 md:mb-5 max-w-[600px]">Your latest facial and postural analysis using clinical scales — Glogau, Fitzpatrick, Griffiths, Merz.</p>

      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4 mb-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 mb-4">FACE ANALYSIS</p>
        <div className="rounded-[0.8rem] border border-[#8FC1E8]/20 bg-[#8FC1E8]/5 px-4 py-3 mb-3">
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">PERCEIVED AGE</p>
          <p className="text-[1.8rem] font-light text-[#8FC1E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>32–37 <span className="text-[13px] text-white/50">yrs</span></p>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-3">
          {[['GLOGAU', 'II'], ['FITZPATRICK', 'III'], ['MIDFACE', '1/4'], ['TEAR TROUGH', '1/4']].map(([label, val]) => (
            <div key={label}>
              <p className="text-[8px] uppercase tracking-[0.12em] text-white/45 mb-1">{label}</p>
              <p className="text-[1.2rem] font-light text-[#8FC1E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{val}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {[['Jawline', 'Mild'], ['Eyelids', 'Mild'], ['Neck', 'Moderate']].map(([zone, val]) => (
            <span key={zone} className="text-[9px] px-2 py-1 rounded-full border border-white/10 text-white/60">{zone}: {val}</span>
          ))}
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 mb-4">BODY ANALYSIS</p>
        <div className="rounded-[0.8rem] border border-[#8FC1E8]/20 bg-[#8FC1E8]/5 px-4 py-3 mb-3">
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">VISUAL AGING INDEX</p>
          <p className="text-[1.8rem] font-light text-[#8FC1E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>78<span className="text-[13px] text-white/50">/100</span></p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[['POSTURAL ALIGNMENT', 'Neutral'], ['MUSCLE TONE', 'Moderate'], ['ADIPOSITY', 'Mixed'], ['WHR', '0.87']].map(([label, val]) => (
            <div key={label} className="flex justify-between">
              <span className="text-[10px] text-white/60">{label}</span>
              <span className="text-[11px] text-white/80">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── SLIDE MY VISUAL — CAPTURE FACE (visual02) ─────────────────────────────────
function SlideVisualCaptureFace() {
  const poses: { label: string; src: string }[] = [
    { label: 'Face', src: '/visage.png' },
    { label: 'Profil gauche', src: '/profilA.png' },
    { label: 'Profil droit', src: '/profilB.png' },
  ]
  return (
    <div className="absolute inset-0 flex flex-col px-4 md:px-16 pt-[80px] md:pt-[110px] pb-[110px] md:pb-[100px] overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-1 md:mb-2">CAPTURE FACE</p>
      <h2 className="text-[2rem] md:text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Facial Capture</h2>

      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4 mb-4 mt-2">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8FC1E8]/70 mb-2">RECOMMENDATIONS</p>
        <p className="text-[12px] text-white/60 leading-relaxed">Prefer natural, diffuse light. No makeup if possible, hair pulled back from the forehead and cheeks, no glasses.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 max-w-[720px]">
        {poses.map((pose) => (
          <div key={pose.label} className="relative aspect-[3/4] max-h-[280px] rounded-[0.8rem] border border-dashed border-white/25 bg-white/[0.03] flex items-center justify-center overflow-hidden">
            <img src={pose.src} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none" />
            <span className="relative text-[10px] uppercase tracking-[0.14em] text-white/50 text-center px-2 bg-black/40 rounded-full py-1">{pose.label}</span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-[720px] rounded-full border border-white/10 bg-white/[0.03] py-4 text-center text-[12px] uppercase tracking-[0.22em] text-white/25 cursor-not-allowed">Analyze</div>
    </div>
  )
}

// ── SLIDE MY VISUAL — CAPTURE BODY (visual03) ─────────────────────────────────
function SlideVisualCaptureBody() {
  const poses: { label: string; src: string }[] = [
    { label: 'Face', src: '/face.png' },
    { label: 'Dos', src: '/dos.png' },
    { label: 'Profil gauche', src: '/coteA.png' },
    { label: 'Profil droit', src: '/coteB.png' },
  ]
  return (
    <div className="absolute inset-0 flex flex-col px-4 md:px-16 pt-[80px] md:pt-[110px] pb-[110px] md:pb-[100px] overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-1 md:mb-2">CAPTURE BODY</p>
      <h2 className="text-[2rem] md:text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Body Capture</h2>

      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4 mb-4 mt-2">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8FC1E8]/70 mb-2">RECOMMENDATIONS</p>
        <p className="text-[12px] text-white/60 leading-relaxed">Prefer natural, diffuse light. Wear fitted, neutral clothing for a more accurate silhouette analysis.</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {poses.map((pose) => (
          <div key={pose.label} className="relative aspect-[3/4] rounded-[1rem] border border-dashed border-white/25 bg-white/[0.03] flex items-center justify-center overflow-hidden">
            <img src={pose.src} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none" />
            <span className="relative text-[9px] uppercase tracking-[0.12em] text-white/50 text-center px-1 bg-black/40 rounded-full py-1">{pose.label}</span>
          </div>
        ))}
      </div>

      <div className="w-full rounded-full border border-white/10 bg-white/[0.03] py-4 text-center text-[12px] uppercase tracking-[0.22em] text-white/25 cursor-not-allowed">Analyze</div>
    </div>
  )
}

// ── SLIDE MY VISUAL — EVOLVE (visual04) ───────────────────────────────────────
function SlideVisualEvolve() {
  const pts = [45,48,52,55,58,62,65,68,72,75]
  const path = pts.map((v,i) => `${i===0?'M':'L'} ${i*26} ${100-v*0.9}`).join(' ')
  const allMetrics = ['Perceived Age', 'Fitzpatrick', 'Glogau Stage', 'Griffiths Score', 'Midface Volume', 'Tear Trough', 'Jowl', 'Visual Aging Index', 'Postural Alignment', 'Muscle Tone', 'Adiposity', 'Sarcopenia', 'Skin Laxity', 'Cellulite Grade']
  return (
    <div className="absolute inset-0 flex flex-col px-4 md:px-16 pt-[80px] md:pt-[110px] pb-[110px] md:pb-[100px] overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-1 md:mb-2">EVOLVE</p>
      <h2 className="text-[2rem] md:text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>My Visual</h2>
      <p className="text-[12px] md:text-[13px] text-white/45 mb-3 md:mb-5 max-w-[600px]">Track any of your 18 visual metrics over time — from perceived age to muscle tone.</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {allMetrics.map((m, i) => (
          <span key={m} className={`rounded-full border px-3 py-1.5 text-[10px] ${i === 7 ? 'border-[#8FC1E8]/70 bg-[#8FC1E8]/15 text-[#8FC1E8]' : 'border-white/10 text-white/55'}`}>{m}</span>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/65">VISUAL AGING INDEX</p>
          <p className="text-[11px] text-[#8FC1E8]/80">78/100 — latest</p>
        </div>
        <svg viewBox="0 0 260 100" className="w-full h-[90px]">
          <path d={path} fill="none" stroke="#8FC1E8" strokeWidth="1.8" strokeLinecap="round" />
          {pts.map((v,i) => <circle key={i} cx={i*26} cy={100-v*0.9} r="2.5" fill="#8FC1E8" opacity="0.85" />)}
        </svg>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-white/40">Jan 2026</span>
          <span className="text-[9px] text-white/40">Jul 2026</span>
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-[#8FC1E8]/30 bg-[#8FC1E8]/5 px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8FC1E8]/70 mb-2">TREND ANALYSIS</p>
        <p className="text-[12px] text-white/70 leading-relaxed">Your visual aging index has improved by 30 points over 6 months — the steepest gains coincide with consistent My Fuel sprints and improved sleep patterns.</p>
      </div>
    </div>
  )
}

// ── SLIDE MY VISUAL — HISTORY (visual05) ──────────────────────────────────────
function SlideVisualHistory() {
  const groups = [
    { month: 'July 2026', sessions: [
      { date: 'Jul 18', type: 'Face Analysis' },
      { date: 'Jul 12', type: 'Body Analysis' },
      { date: 'Jul 05', type: 'Face Analysis' },
    ]},
    { month: 'June 2026', sessions: [
      { date: 'Jun 28', type: 'Body Analysis' },
      { date: 'Jun 20', type: 'Face Analysis' },
      { date: 'Jun 14', type: 'Face Analysis' },
    ]},
  ]
  return (
    <div className="absolute inset-0 flex flex-col px-4 md:px-16 pt-[80px] md:pt-[110px] pb-[110px] md:pb-[100px] overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-1 md:mb-2">HISTORY</p>
      <h2 className="text-[2rem] md:text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>My Visual</h2>
      <p className="text-[12px] md:text-[13px] text-white/45 mb-3 md:mb-5 max-w-[600px]">Every past session, grouped by month — with the option to keep photos alongside your data.</p>

      <div className="rounded-[1rem] border border-[#8FC1E8]/20 bg-[#8FC1E8]/5 px-5 py-3 mb-4">
        <p className="text-[12px] text-white/65 leading-relaxed">Enable photo retention to compare your visual evolution side by side.</p>
      </div>

      {groups.map((g) => (
        <div key={g.month} className="mb-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 mb-2">{g.sessions.length} sessions in {g.month}</p>
          <div className="flex flex-col gap-2">
            {g.sessions.map((s) => (
              <div key={s.date} className="rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-white/80">{s.date}</p>
                  <p className="text-[11px] text-white/45">{s.type}</p>
                </div>
                <span className="text-[11px] text-[#8FC1E8]/70">View →</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── SLIDE MY VISUAL — REPORT (visual06) ───────────────────────────────────────
function SlideVisualReport() {
  return (
    <div className="absolute inset-0 flex flex-col px-4 md:px-16 pt-[80px] md:pt-[110px] pb-[110px] md:pb-[100px] overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-1 md:mb-2">REPORT</p>
      <h2 className="text-[2rem] md:text-[2.8rem] font-light text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>My Visual</h2>
      <p className="text-[12px] md:text-[13px] text-white/45 mb-3 md:mb-5 max-w-[600px]">A synthesis comparing your perceived age against your chronological and biological age.</p>

      <div className="flex items-center gap-2 mb-3">
        {['30 Days', '90 Days', '180 Days'].map((p, i) => (
          <span key={p} className={`rounded-full border px-4 py-1.5 text-[10px] uppercase tracking-[0.14em] ${i === 0 ? 'border-[#8FC1E8]/70 bg-[#8FC1E8]/15 text-[#8FC1E8]' : 'border-white/10 text-white/55'}`}>{p}</span>
        ))}
        <div className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[10px] uppercase tracking-[0.14em] text-white/50">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Send Report
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        {[['CHRONO AGE','56'],['PERCEIVED AGE','35'],['AGE GAP','−21'],['AGING INDEX','78']].map(([label,val]) => (
          <div key={label} className="rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-4 py-3">
            <p className="text-[9px] uppercase tracking-[0.16em] text-white/45 mb-1">{label}</p>
            <p className="text-[1.4rem] font-light text-[#8FC1E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[['FACE SESSIONS', '9'], ['BODY SESSIONS', '7'], ['GLOGAU STAGE', 'II']].map(([label, val]) => (
          <div key={label} className="rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-4 py-3">
            <p className="text-[9px] uppercase tracking-[0.16em] text-white/45 mb-1">{label}</p>
            <p className="text-[1.4rem] font-light text-[#EAE4D5]/80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{val}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 mb-3">NARRATIVE</p>
        <p className="text-[13px] text-white/70 leading-relaxed">Your perceived age trends consistently below your chronological age, corroborating a strong biological profile. Facial vascularity and fatigue signs remain low, aligning with your nutritional coherence over the same period.</p>
      </div>
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
  

const result = await supabase.auth.signInWithPassword({
  email,
  password
})



const { data, error: authError } = result

   

    if (authError) {
      setError(
        locale === 'fr'
          ? 'Email ou mot de passe incorrect.'
          : locale === 'es'
          ? 'Email o contraseña incorrectos.'
          : 'Incorrect email or password.'
      )
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
    fuelToday:    <SlideFuelToday />,
    fuelScan:     <SlideFuelScan />,
    fuelFeed:     <SlideFuelFeed />,
    fuelEvolve:   <SlideFuelEvolve />,
    fuelReport:   <SlideFuelReport />,
    fuelSetup:    <SlideFuelSetup />,
    visualResults:     <SlideVisualResults />,
    visualCaptureFace: <SlideVisualCaptureFace />,
    visualCaptureBody: <SlideVisualCaptureBody />,
    visualEvolve:      <SlideVisualEvolve />,
    visualHistory:     <SlideVisualHistory />,
    visualReport:      <SlideVisualReport />,
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
  const isFuelOrVisual = slide.id.startsWith('fuel') || slide.id.startsWith('visual')
const isNight = isFuelOrVisual || slide.bg.includes('nuit') || slide.bg.includes('soir')
const isDark = isFuelOrVisual || slide.bg.includes('nuit')
          const greetings: Record<string, string> = {
            state:      'Good morning',
            understand: 'Good day',
            protocols:  'Good morning',
            products:   'Good day',
            sleep:      'Good evening',
            nutrition:  'Good evening',
            evolve:     'Good evening',
            fuelToday:    'Good day',
            fuelScan:     'Good morning',
            fuelFeed:     'Good day',
            fuelEvolve:   'Good evening',
            fuelReport:   'Good night',
            fuelSetup:    'Good morning',
            visualResults:     'Good morning',
            visualCaptureFace: 'Good morning',
            visualCaptureBody: 'Good day',
            visualEvolve:      'Good evening',
            visualHistory:     'Good day',
            visualReport:      'Good night',
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
            fuelToday:    "What fuels your body today shapes the vitality you carry tomorrow.",
            fuelScan:     "A single photograph, a complete nutritional truth.",
            fuelFeed:     "Every meal is a data point in the story of your longevity.",
            fuelEvolve:   "Patterns emerge not in a single meal, but in the rhythm of many.",
            fuelReport:   "Coherence, measured — one plate at a time.",
            fuelSetup:    "Precision begins with intention. Choose your rhythm.",
            visualResults:     "The mirror tells a story only precision can truly read.",
            visualCaptureFace: "Stillness, light, and honesty — the foundation of a clear reading.",
            visualCaptureBody: "The body remembers what words cannot say.",
            visualEvolve:      "Aging is not linear. Neither is your trajectory.",
            visualHistory:     "Every session is a frame in the film of your evolution.",
            visualReport:      "Perception and biology, finally in the same conversation.",
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

const badgeTexts: Record<string, string> = {
  fuel: 'Nutritional Intelligence',
  visual: 'Visual Vitality Analysis',
  default: 'High-Precision Biological Profiling',
}
const badgeText = slide.id.startsWith('fuel') ? badgeTexts.fuel
  : slide.id.startsWith('visual') ? badgeTexts.visual
  : badgeTexts.default

const menuSets: Record<string, string[]> = {
  myspace: ['STATE', 'UNDERSTAND', 'OPTIMIZE', 'EVOLVE', 'CONNECT', 'NEW ASSESSMENT'],
  fuel:    ['TODAY', 'EVOLVE', 'FEED', 'REPORT', 'SCAN A MEAL', 'NEW SPRINT'],
  visual:  ['RESULTS', 'EVOLUTION', 'HISTORY', 'REPORT', 'CAPTURE FACE', 'CAPTURE BODY'],
}
const activeMenuSet = slide.id.startsWith('fuel') ? menuSets.fuel
  : slide.id.startsWith('visual') ? menuSets.visual
  : menuSets.myspace

const navbarLabels: Record<string, string> = {
  fuel: 'MY FUEL — Sophie',
  visual: 'MY VISUAL — Sophie',
  default: 'MY SPACE — Sophie',
}
const navbarLabel = slide.id.startsWith('fuel') ? navbarLabels.fuel
  : slide.id.startsWith('visual') ? navbarLabels.visual
  : navbarLabels.default
          return (
            <>
    {/* Navbar simulée */}
<div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-6 pt-3 md:pt-4">
  <img src={logo} alt="Lonara" className="h-14 md:h-20 w-auto opacity-90 mt-1 md:mt-2" />
  <div className="flex items-center gap-2 md:gap-4">
    {!isFuelOrVisual && (
      <div className="flex items-center gap-0.5 md:gap-1 rounded-full border border-white/15 bg-white/[0.06] px-1 py-1 backdrop-blur-xl">
        {['Lona', 'EngineA', 'Gummy'].map((char) => (
          <div key={char} className={`rounded-full px-2 md:px-3 py-0.5 md:py-1 text-[9px] md:text-[11px] uppercase tracking-[0.12em] md:tracking-[0.18em] ${char === slide.character ? 'bg-white/20 text-white' : 'text-white/40'}`}>{char}</div>
        ))}
      </div>
    )}
    <span className="hidden md:inline text-[11px] uppercase tracking-[0.18em] text-white/52">{navbarLabel}</span>
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
                  <p className={`mb-4 text-[11px] uppercase tracking-[0.28em] ${badgeColor}`}>{badgeText}</p>
                  <div className={`text-[36px] font-light leading-[1.05] ${textColor}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {greeting} <span className={`italic ${textColorItalic}`}>Sophie</span>
                  </div>
                  <p className={`mt-3 text-[14px] font-light leading-[1.75] italic ${phraseColor}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {phrase}
                  </p>
                  <div className={`mt-4 h-px bg-gradient-to-r ${dividerColor}`} />
       <nav className="mt-3 flex flex-col">
  {activeMenuSet.map((item) => {
    const slideLabelPart = slide.label.includes(' — ') ? slide.label.split(' — ')[1] : slide.label
    const isActive = item === slideLabelPart
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