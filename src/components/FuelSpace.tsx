'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getFuelBg, isNightTime, getTimeOfDay } from '../lib/timeOfDay'
import { useTranslations } from 'next-intl'

// ── PROPS ─────────────────────────────────────────────────────────────────────
interface FuelSpaceProps {
  memberTier: 'guest' | 'member' | 'premium' | 'executive'
  fullName: string
  onBack: () => void
}

// ── TYPES ─────────────────────────────────────────────────────────────────────
type SprintMode = 'pulse' | 'rhythm' | 'protocol'
type ActiveSection = 'today' | 'evolve' | 'feed' | 'scan' | 'setup' | null

interface MacroTargets {
  protein_g: { min: number; max: number }
  carbs_g:   { min: number; max: number }
  fat_g:     { min: number; max: number }
  kcal:      { min: number; max: number }
  rationale: string
}

interface FuelSprint {
  id: string
  mode: SprintMode
  goal: string | null
  started_at: string
  ends_at: string
  is_active: boolean
  macro_targets: MacroTargets | null
}

interface FuelLog {
  id: string
  created_at: string
  meal_time: string
  time_of_day: string
  sprint_id: string | null
  image_url: string | null
  note: string | null
  macros: { protein: number; carbs: number; fat: number; kcal: number } | null
  fuel_score: number | null
  alerts: { type: string; message: string }[] | null
  recommendations: { text: string }[] | null
  ai_narrative: string | null
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const MODE_KEYS: Record<SprintMode, string> = {
  pulse: 'fuel_pulse', rhythm: 'fuel_rhythm', protocol: 'fuel_protocol',
}

const MODE_DESC_KEYS: Record<SprintMode, string> = {
  pulse: 'fuel_descPulse', rhythm: 'fuel_descRhythm', protocol: 'fuel_descProtocol',
}

const SPRINT_DURATIONS = [7, 14, 30]

const GOAL_KEYS = [
  'fuel_goalGeneral', 'fuel_goalInflammation', 'fuel_goalProtein',
  'fuel_goalCardio', 'fuel_goalBloodSugar', 'fuel_goalWeightLoss',
  'fuel_goalMuscle', 'fuel_goalEnergy', 'fuel_goalSleep',
  'fuel_goalGut', 'fuel_goalLongevity',
]



// ── HELPERS ───────────────────────────────────────────────────────────────────
const scoreColor = (s: number) => s >= 70 ? '#1D9E75' : s >= 45 ? '#E7C980' : '#E24B4A'

// ── SUBCOMPONENTS ─────────────────────────────────────────────────────────────

function TodaySection({ activeSprint, logs }: { activeSprint: FuelSprint | null; logs: FuelLog[] }) {
  const t = useTranslations('myspace')
  const tod = getTimeOfDay()
  const timeLabel: Record<string, string> = {
    matin: t('fuel_morning'), jour: t('fuel_midday'), soir: t('fuel_evening'), nuit: t('fuel_night'),
  }
  const todayLogs = logs.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString())
  const sprintLogs = activeSprint ? logs.filter(l => l.sprint_id === activeSprint.id) : []

  const sprintDaysCurrent = activeSprint
    ? Math.floor((Date.now() - new Date(activeSprint.started_at).getTime()) / 86400000) + 1 : 0
  const sprintDaysTotal = activeSprint
    ? Math.floor((new Date(activeSprint.ends_at).getTime() - new Date(activeSprint.started_at).getTime()) / 86400000) : 0
  const daysLeft = activeSprint ? Math.max(0, sprintDaysTotal - sprintDaysCurrent) : 0

  const sprintAvg = sprintLogs.length
    ? Math.round(sprintLogs.filter(l => l.fuel_score).reduce((s, l) => s + (l.fuel_score ?? 0), 0) / sprintLogs.filter(l => l.fuel_score).length)
    : null

  const macros = [
    { label: t('fuel_protein'), key: 'protein_g', macro: 'protein', color: '#1D9E75', unit: 'g' },
    { label: t('fuel_carbs'),   key: 'carbs_g',   macro: 'carbs',   color: '#E7C980', unit: 'g' },
    { label: t('fuel_fat'),     key: 'fat_g',     macro: 'fat',     color: '#5C96D8', unit: 'g' },
    { label: t('fuel_kcal'),   key: 'kcal',      macro: 'kcal',    color: '#EAE4D5', unit: '' },
  ]

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#3DD4A0]/80 mb-3">{t('fuel_menuToday')}</p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {timeLabel[tod] ?? t('fuel_today')}
      </h2>

      {/* Sprint info */}
      {activeSprint && (
        <div className="mb-6 rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#3DD4A0]/80">{t(MODE_KEYS[activeSprint.mode])} {t('fuel_sprintLabel')}</span>
            <span className="text-[11px] text-white/65">{daysLeft} {t('fuel_daysLeft')} · {t('fuel_day')} {sprintDaysCurrent}/{sprintDaysTotal}</span>
          </div>
          {activeSprint.goal && (
            <p className="text-[12px] text-white/75 mb-3 italic">{t('fuel_goal')}: {activeSprint.goal?.startsWith('fuel_') ? t(activeSprint.goal as any) : activeSprint.goal}</p>
          )}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-[0.14em] text-white/55 mb-0.5">{t('fuel_sprintScanned')}</p>
              <p className="text-[1.4rem] font-light text-[#EAE4D5]/80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{sprintLogs.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-[0.14em] text-white/55 mb-0.5">{t('fuel_sprintAvgScore')}</p>
              <p className="text-[1.4rem] font-light text-[#EAE4D5]/80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{sprintAvg ?? '—'}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-[0.14em] text-white/55 mb-0.5">{t('fuel_sprintToday')}</p>
              <p className="text-[1.4rem] font-light text-[#EAE4D5]/80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{todayLogs.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Macro bars */}
      {activeSprint?.macro_targets && (
        <div className="rounded-[1rem] border border-white/8 bg-black/45 backdrop-blur-xl px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/65 mb-4">{t('fuel_dailyTargets')} — {timeLabel[tod]}</p>
          {macros.map((m) => {
            const target = activeSprint.macro_targets![m.key as keyof MacroTargets] as { min: number; max: number }
            const consumed = todayLogs.reduce((sum, l) => {
              if (!l.macros) return sum
              return sum + ((l.macros as any)[m.macro] ?? 0)
            }, 0)
            const pct = Math.min(100, Math.round((consumed / target.max) * 100))
            return (
              <div key={m.label} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-white/75">{m.label}</span>
                  <span className="text-[11px] text-white/55">{consumed}{m.unit} / {target.min}–{target.max}{m.unit}</span>
                </div>
                <div className="h-[3px] w-full bg-white/8 rounded-full">
                  <div className="h-[3px] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: m.color }} />
                </div>
              </div>
            )
          })}
      {activeSprint.macro_targets.rationale && (
  <p className="mt-3 text-[11px] text-white/80 leading-relaxed border-t border-white/5 pt-3"
    style={{ fontFamily: 'Inter, sans-serif' }}>
    {activeSprint.macro_targets.rationale}
  </p>
)}
        </div>
      )}

      {!activeSprint && (
        <p className="text-[14px] italic text-white/55 mt-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {t('fuel_noSprint')}
        </p>
      )}
    </div>
  )
}

function EvolveSection({ logs }: { logs: FuelLog[] }) {
  const t = useTranslations('myspace')
  // Group logs by day for charts
  const byDay: Record<string, { date: string; avg_score: number; protein: number; carbs: number; fat: number; kcal: number; count: number }> = {}

  logs.forEach(l => {
    const day = new Date(l.created_at).toISOString().split('T')[0]
    if (!byDay[day]) byDay[day] = { date: day, avg_score: 0, protein: 0, carbs: 0, fat: 0, kcal: 0, count: 0 }
    if (l.fuel_score) byDay[day].avg_score += l.fuel_score
    if (l.macros) {
      byDay[day].protein += l.macros.protein ?? 0
      byDay[day].carbs   += l.macros.carbs   ?? 0
      byDay[day].fat     += l.macros.fat     ?? 0
      byDay[day].kcal    += l.macros.kcal    ?? 0
    }
    byDay[day].count++
  })

  const days = Object.values(byDay)
    .map(d => ({ ...d, avg_score: d.count > 0 ? Math.round(d.avg_score / d.count) : 0 }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)

  if (days.length === 0) return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#3DD4A0]/80 mb-3">{t('fuel_menuEvolve')}</p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('fuel_evolveTitle')}
      </h2>
      <p className="text-[14px] italic text-white/55" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('fuel_evolveEmpty')}
      </p>
    </div>
  )

  const W = 600; const H = 120
  const maxScore = 100
  const maxProtein = Math.max(...days.map(d => d.protein), 1)
  const maxCarbs   = Math.max(...days.map(d => d.carbs),   1)
  const maxFat     = Math.max(...days.map(d => d.fat),     1)
  const maxKcal    = Math.max(...days.map(d => d.kcal),    1)
  const n = days.length

  const px = (i: number) => (i / Math.max(n - 1, 1)) * W
  const py = (val: number, max: number) => H - (val / max) * H * 0.9

  const pathD = (vals: number[], max: number) =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(1)} ${py(v, max).toFixed(1)}`).join(' ')

  const areaD = (vals: number[], max: number) =>
    `${pathD(vals, max)} L ${px(n - 1).toFixed(1)} ${H} L 0 ${H} Z`

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#3DD4A0]/80 mb-3">{t('fuel_menuEvolve')}</p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('fuel_evolveTitle')}
      </h2>

      {/* Score chart */}
      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/65">{t('fuel_fuelScore')}</p>
          <p className="text-[11px] text-[#3DD4A0]/80">{days[days.length - 1]?.avg_score ?? '—'}/100 {t('fuel_latest')}</p>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '80px' }}>
          <defs>
            <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1D9E75" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD(days.map(d => d.avg_score), maxScore)} fill="url(#fuelGrad)" />
          <path d={pathD(days.map(d => d.avg_score), maxScore)} fill="none" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {days.map((d, i) => (
            <circle key={i} cx={px(i)} cy={py(d.avg_score, maxScore)} r="2.5" fill="#1D9E75" opacity="0.8" />
          ))}
        </svg>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-white/45">{days[0]?.date}</span>
          <span className="text-[9px] text-white/45">{days[days.length - 1]?.date}</span>
        </div>
      </div>

      {/* Macro charts */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: t('fuel_proteinDay'), vals: days.map(d => d.protein), max: maxProtein, color: '#1D9E75', gradId: 'pGrad' },
          { label: t('fuel_carbsDay'),   vals: days.map(d => d.carbs),   max: maxCarbs,   color: '#E7C980', gradId: 'cGrad' },
          { label: t('fuel_fatDay'),     vals: days.map(d => d.fat),     max: maxFat,     color: '#5C96D8', gradId: 'fGrad' },
          { label: t('fuel_kcalDay'),    vals: days.map(d => d.kcal),    max: maxKcal,    color: '#EAE4D5', gradId: 'kGrad' },
        ].map((chart) => (
          <div key={chart.label} className="rounded-[1rem] border border-white/8 bg-black/45 backdrop-blur-xl px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/60">{chart.label}</p>
              <p className="text-[10px]" style={{ color: chart.color }}>
                {Math.round(chart.vals[chart.vals.length - 1] ?? 0)}
              </p>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '50px' }}>
              <defs>
                <linearGradient id={chart.gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chart.color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={chart.color} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaD(chart.vals, chart.max)} fill={`url(#${chart.gradId})`} />
              <path d={pathD(chart.vals, chart.max)} fill="none" stroke={chart.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeedSection({ logs }: { logs: FuelLog[] }) {
  const t = useTranslations('myspace')
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#3DD4A0]/80 mb-3">{t('fuel_menuFeed')}</p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('fuel_feedTitle')}
      </h2>
      {logs.length === 0 && (
        <p className="text-[14px] italic text-white/50" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {t('fuel_feedEmpty')}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[calc(100vh-490px)]" style={{ scrollbarWidth: 'none' }}>
        {logs.map((log) => {
          const sc = log.fuel_score ?? 0
          const col = scoreColor(sc)
          return (
            <div key={log.id} className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-[13px] font-medium text-[#EAE4D5]/80 capitalize">{log.meal_time}</p>
                  <p className="text-[10px] text-white/55">
                    {new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[1.4rem] font-light leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", color: col }}>
                    {log.fuel_score ?? '—'}
                  </p>
                  <p className="text-[8px] uppercase tracking-[0.12em] text-white/50">{t('fuel_score')}</p>
                </div>
              </div>
              <div className="h-[2px] w-full bg-white/8 rounded-full mb-3">
                <div className="h-[2px] rounded-full" style={{ width: `${sc}%`, background: col }} />
              </div>
              {log.macros && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {[
                    { l: t('fuel_protein'), v: log.macros.protein, u: 'g' },
                    { l: t('fuel_carbs'),   v: log.macros.carbs,   u: 'g' },
                    { l: t('fuel_fat'),     v: log.macros.fat,     u: 'g' },
                    { l: t('fuel_kcal'),   v: log.macros.kcal,    u: '' },
                  ].map(m => (
                    <span key={m.l} className="text-[10px] text-white/65">
                      <span className="text-white/50">{m.l} </span>{m.v}{m.u}
                    </span>
                  ))}
                </div>
              )}
              {log.alerts && log.alerts.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {log.alerts.map((a, i) => (
                    <span key={i} className="text-[9px] px-2 py-0.5 rounded-full border border-[#E7C980]/45 bg-[#E7C980]/5 text-[#E7C980]/90">
                      {a.message}
                    </span>
                  ))}
                </div>
              )}
              {log.ai_narrative && (
                <p className="text-[11px] text-white/65 leading-relaxed border-t border-white/5 pt-2 mt-1"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {log.ai_narrative}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ScanSection({ activeSprint, imageFile, setImageFile, imagePreview, setImagePreview, mealTime, setMealTime, note, setNote, isAnalyzing, handleAnalyze, fileInputRef, handleImageChange }: {
  activeSprint: FuelSprint | null
  imageFile: File | null
  setImageFile: (f: File | null) => void
  imagePreview: string | null
  setImagePreview: (s: string | null) => void
  mealTime: string
  setMealTime: (s: string) => void
  note: string
  setNote: (s: string) => void
  isAnalyzing: boolean
  handleAnalyze: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const t = useTranslations('myspace')
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#3DD4A0]/80 mb-3">{t('fuel_menuScan')}</p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t('fuel_scanTitle')}</h2>

      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-8 py-6">
      <div className="grid grid-cols-2 gap-8">
        <div>
          {!imagePreview ? (
            <div onClick={() => fileInputRef.current?.click()}
              className="rounded-[1.2rem] border border-dashed border-white/45 bg-white/[0.03] py-12 flex flex-col items-center gap-3 cursor-pointer hover:border-[#1D9E75]/65 hover:bg-[#1D9E75]/5 transition-all">
              <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/65">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <p className="text-[13px] text-white/65">{t('fuel_scanUpload')}</p>
              <p className="text-[11px] text-white/45">{t('fuel_scanFormat')}</p>
              <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
                onChange={handleImageChange} className="hidden" />
            </div>
          ) : (
            <div className="relative rounded-[1.2rem] overflow-hidden">
              <img src={imagePreview} alt="Meal preview" className="w-full h-48 object-cover" />
              <button onClick={() => { setImageFile(null); setImagePreview(null) }}
                className="absolute top-3 right-3 rounded-full bg-black/75 p-1.5 text-white/70 hover:text-white transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/60 mb-2">{t('fuel_scanMealTime')}</p>
            <select value={mealTime} onChange={(e) => setMealTime(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-[#0A1628] px-5 py-3 text-[13px] text-white/80 focus:outline-none focus:border-[#1D9E75]/65 [&>option]:bg-[#0A1628] [&>option]:text-white/80">
              <option value="breakfast">{t('fuel_breakfast')}</option>
              <option value="lunch">{t('fuel_lunch')}</option>
              <option value="dinner">{t('fuel_dinner')}</option>
              <option value="snack">{t('fuel_snack')}</option>
            </select>
          </div>
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
            placeholder={t('fuel_scanNote')}
            className="w-full rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-[13px] text-white/80 placeholder:text-white/50 focus:outline-none focus:border-[#1D9E75]/65" />
          
          <button onClick={handleAnalyze} disabled={!imagePreview || isAnalyzing}
            className="relative w-full rounded-full border border-[#1D9E75]/65 bg-[#1D9E75]/15 py-4 text-[12px] uppercase tracking-[0.22em] text-[#3DD4A0] transition hover:bg-[#1D9E75]/50 disabled:opacity-40 disabled:cursor-not-allowed">
            <div className="absolute top-0 left-[18%] w-[64%] h-[1px] bg-gradient-to-r from-transparent via-[#5DCAA5]/70 to-transparent" />
            {isAnalyzing ? t('fuel_scanAnalyzing') : t('fuel_scanAnalyze')}
          </button>
          {!isAnalyzing && <p className="text-[11px] text-white/45 text-center">{t('fuel_scanResult')}</p>}
        </div>
      </div>
    </div>
    </div>
  )
}

function SetupSection({ memberTier, selectedMode, setSelectedMode, selectedDuration, setSelectedDuration, selectedGoal, setSelectedGoal, handleStartSprint }: {
  memberTier: string
  selectedMode: SprintMode
  setSelectedMode: (m: SprintMode) => void
  selectedDuration: number
  setSelectedDuration: (d: number) => void
  selectedGoal: string | null
  setSelectedGoal: (g: ((prev: string | null) => string | null)) => void
  handleStartSprint: () => void
}) {
  const t = useTranslations('myspace')
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#3DD4A0]/80 mb-3">{t('fuel_menuNewSprint')}</p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t('fuel_newSprintTitle')}</h2>
      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-8 py-6">
      <p className="text-[13px] text-white/60 mb-4 leading-relaxed">
  {t('fuel_newSprintDesc')}
</p>
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          {(['pulse', 'rhythm', 'protocol'] as SprintMode[]).map((mode) => {
            const isAvailable = mode === 'pulse' ||
              (mode === 'rhythm' && (memberTier === 'premium' || memberTier === 'executive')) ||
              (mode === 'protocol' && memberTier === 'executive')
            return (
              <button key={mode} onClick={() => isAvailable && setSelectedMode(mode)} disabled={!isAvailable}
                className={`relative text-left rounded-[1rem] border px-5 py-2.5 transition-all ${
                  selectedMode === mode ? 'border-[#1D9E75]/70 bg-[#1D9E75]/10'
                  : isAvailable ? 'border-white/10 bg-white/[0.03] hover:border-white/45'
                  : 'border-white/5 bg-white/[0.01] opacity-40 cursor-not-allowed'
                }`}>
                <span className="text-[13px] font-medium text-[#EAE4D5]">{t(MODE_KEYS[mode])}</span>
                <p className="text-[12px] text-white/65 mt-1">{t(MODE_DESC_KEYS[mode])}</p>
              </button>
            )
          })}
        <div className="mt-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/65 mb-3">{t('fuel_sprintDuration')}</p>
            <div className="flex gap-2">
              {SPRINT_DURATIONS.map((d) => (
            <button key={d} onClick={() => setSelectedDuration(d)}
  className={`flex-1 rounded-full border py-1.5 text-[10px] uppercase tracking-[0.12em] transition-all ${
                    selectedDuration === d ? 'border-[#1D9E75]/70 bg-[#1D9E75]/15 text-[#3DD4A0]'
                    : 'border-white/10 text-white/65 hover:border-white/45'
                  }`}>
                  {d} {t('fuel_days')}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/65 mb-3">{t('fuel_sprintGoal')}</p>
            <div className="flex flex-wrap gap-2">
              {GOAL_KEYS.map((key) => (
                <button key={key} onClick={() => setSelectedGoal(prev => prev === key ? null : key)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] transition-all ${
                    selectedGoal === key ? 'border-[#1D9E75]/70 bg-[#1D9E75]/15 text-[#3DD4A0]'
                    : 'border-white/10 text-white/65 hover:border-white/45'
                  }`}>
                  {t(key)}
                </button>
              ))}
            </div>
          </div>
        <button onClick={handleStartSprint}
  disabled={!selectedGoal}
  className="relative mt-auto w-full rounded-full border border-[#1D9E75]/65 bg-[#1D9E75]/15 py-4 text-[12px] uppercase tracking-[0.22em] text-[#3DD4A0] transition hover:bg-[#1D9E75]/50 disabled:opacity-40 disabled:cursor-not-allowed"> <div className="absolute top-0 left-[18%] w-[64%] h-[1px] bg-gradient-to-r from-transparent via-[#5DCAA5]/70 to-transparent" />
            {t('fuel_startSprint')}
          </button>
        </div>
         </div>
      </div>
    </div>
  )
}



// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function FuelSpace({ memberTier, fullName, onBack }: FuelSpaceProps) {
  const [isLoading, setIsLoading]         = useState(true)
  const [currentBg, setCurrentBg]         = useState('')
  const [activeSprint, setActiveSprint]   = useState<FuelSprint | null>(null)
  const [logs, setLogs]                   = useState<FuelLog[]>([])
  const [allLogs, setAllLogs]             = useState<FuelLog[]>([])
  const [view, setView]                   = useState<'dashboard' | 'scan' | 'setup'>('dashboard')
  const [activeSection, setActiveSection] = useState<ActiveSection>(null)

  // Setup
  const [selectedMode,     setSelectedMode]     = useState<SprintMode>('rhythm')
  const [selectedDuration, setSelectedDuration] = useState(14)
  const [selectedGoal,     setSelectedGoal]     = useState<string | null>(null)

  // Scan
  const [imageFile,    setImageFile]    = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [mealTime,     setMealTime]     = useState('lunch')
  const [note,         setNote]         = useState('')
  const [isAnalyzing,  setIsAnalyzing]  = useState(false)
  const [showQR,       setShowQR]       = useState(false)
  const [qrToken,      setQrToken]      = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const t = useTranslations('myspace')
  const firstName = fullName.split(' ')[0] || fullName
  const isNight   = isNightTime()

  // ── LOAD ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    setCurrentBg(getFuelBg())
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setIsLoading(false); return }

        const { data: sprint } = await supabase
          .from('fuel_sprints').select('*')
          .eq('user_id', user.id).eq('is_active', true)
          .order('started_at', { ascending: false }).limit(1).maybeSingle()

        if (sprint) setActiveSprint(sprint as FuelSprint)
        else setView('setup')

        // 30 derniers jours
        const since = new Date()
        since.setDate(since.getDate() - 30)
        const { data: logsData } = await supabase
          .from('fuel_logs').select('*')
          .eq('user_id', user.id)
          .gte('created_at', since.toISOString())
          .order('created_at', { ascending: false })

        if (logsData) {
          setLogs(logsData as FuelLog[])
          setAllLogs(logsData as FuelLog[])
        }
      } catch (e) {
        console.error('FuelSpace load error:', e)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // ── DERIVED ─────────────────────────────────────────────────────────────────
  const totalScanned = allLogs.length
  const avgScoreAll  = allLogs.filter(l => l.fuel_score).length
    ? Math.round(allLogs.filter(l => l.fuel_score).reduce((s, l) => s + (l.fuel_score ?? 0), 0) / allLogs.filter(l => l.fuel_score).length)
    : null

  const bestByMeal = (meal: string) => {
    const ml = allLogs.filter(l => l.meal_time === meal && l.fuel_score)
    return ml.length ? Math.max(...ml.map(l => l.fuel_score ?? 0)) : null
  }

  // ── SPRINT ACTIONS ──────────────────────────────────────────────────────────
  const handleStartSprint = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('fuel_sprints').update({ is_active: false })
      .eq('user_id', user.id).eq('is_active', true)

    const endsAt = new Date()
    endsAt.setDate(endsAt.getDate() + selectedDuration)

    const { data: sprint } = await supabase.from('fuel_sprints')
      .insert({ user_id: user.id, mode: selectedMode, goal: selectedGoal, ends_at: endsAt.toISOString(), is_active: true })
      .select().single()

    if (sprint) {
      setActiveSprint(sprint as FuelSprint)
      setView('dashboard')
      try {
        const res = await fetch('/api/fuel-targets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, sprintId: sprint.id, mode: selectedMode, goal: selectedGoal }),
        })
        const data = await res.json()
        if (data.targets) setActiveSprint({ ...sprint as FuelSprint, macro_targets: data.targets })
      } catch (e) { console.error('fuel-targets error:', e) }
    }
  }

  // ── SCAN ACTIONS ────────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!imageFile && !imagePreview) return
    setIsAnalyzing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const formData = new FormData()
      if (imageFile) formData.append('image', imageFile)
      formData.append('mealTime', mealTime)
      formData.append('note', note)
      formData.append('sprintId', activeSprint?.id ?? '')
      formData.append('userId', user.id)
      const response = await fetch('/api/fuel-analyze', { method: 'POST', body: formData })
      const result = await response.json()
      const newLog = result.log as FuelLog
      setLogs(prev => [newLog, ...prev])
      setAllLogs(prev => [newLog, ...prev])
      setView('dashboard')
      setActiveSection('today')
      setImageFile(null); setImagePreview(null); setNote('')
    } catch (e) { console.error('Fuel analyze error:', e)
    } finally { setIsAnalyzing(false) }
  }

  // ── QR CONNECT PHONE ────────────────────────────────────────────────────────
  const generateQRToken = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    await supabase.from('capture_tokens').insert({
      token,
      user_id: user.id,
      sprint_id: activeSprint?.id ?? null,
      expires_at: expiresAt,
    })
    setQrToken(token)
    setShowQR(true)
  }

  // ── LOADING ─────────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#040B14] text-white">
      <div className="relative flex flex-col items-center gap-8">
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[#1D9E75]/10 blur-[80px]" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <img src="/LOGOOFFICIELTRANSP.png" alt="Lonara" className="h-16 w-auto opacity-80" />
          <p className="text-[11px] uppercase tracking-[0.38em] text-[#3DD4A0]/80">{t('fuel_badge')}</p>
          <h2 className="text-[2.2rem] font-extralight text-[#EAE4D5]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {t('fuel_loadingTitle')}
          </h2>
          <p className="text-[14px] text-[#EAE4D5]/65 max-w-[400px] text-center leading-relaxed">
            {t('fuel_loadingDesc')}
          </p>
          <div className="flex gap-3 mt-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#1D9E75]/70 animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <section className="fixed inset-0 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('${currentBg}')` }}>
      <div className="absolute inset-0 bg-[#02040A]/8" />

      {/* ── NAVBAR ── */}
      <div className="hidden md:block relative z-40 mx-auto mt-4 max-w-[1850px] px-4 md:px-6 lg:px-0">
        <div className="flex items-center justify-between">
          <img src='/LOGOOFFICIELTRANSP.png' alt="Lonara"
            className="ml-0 mt-3 h-24 md:h-32 lg:h-40 w-auto opacity-95 object-contain" />
          <div className="mr-4 md:mr-8 lg:mr-12 flex items-center gap-4 md:gap-6">
            {activeSprint && view === 'dashboard' && (
              <span className="hidden md:inline text-[11px] uppercase tracking-[0.18em] px-3 py-1 rounded-full border border-[#1D9E75]/55 bg-[#1D9E75]/10 text-[#3DD4A0]/80">
                {t(MODE_KEYS[activeSprint.mode])}
              </span>
            )}
            <span className="text-[11px] md:text-[13px] uppercase tracking-[0.18em] text-white/52">
              {t('fuel_navLabel')} — {firstName}
            </span>
            <button onClick={onBack}
              className="flex items-center gap-2 text-white/60 hover:text-white/80 transition-all text-[11px] md:text-[13px] uppercase tracking-[0.18em]">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t('fuel_back')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── SETUP SPRINT ── */}
      {view === 'setup' && (
        <div className="hidden md:flex relative z-20 mx-auto max-w-[1850px] min-h-screen items-start justify-center px-4 pt-[100px]">
          <div className="relative w-full max-w-[960px] rounded-[32px] border border-white/6 bg-black/28 px-10 py-10 backdrop-blur-[14px] shadow-[0_0_80px_rgba(0,0,0,0.45)]">
            <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#1D9E75] to-transparent opacity-70" />
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#3DD4A0]/80 mb-3">{t('fuel_badge')} — {t('fuel_menuNewSprint')}</p>
            <h2 className="text-[2.4rem] font-light text-[#EAE4D5] mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t('fuel_newSprintTitle')}</h2>
            <p className="text-[13px] text-white/60 mb-4 leading-relaxed">
  {t('fuel_newSprintDesc')}
</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Col gauche — modes */}
              <div>
                <div className="flex flex-col gap-3">
                  {(['pulse', 'rhythm', 'protocol'] as SprintMode[]).map((mode) => {
                    const isAvailable = mode === 'pulse' ||
                      (mode === 'rhythm' && (memberTier === 'premium' || memberTier === 'executive')) ||
                      (mode === 'protocol' && memberTier === 'executive')
                    return (
                      <button key={mode} onClick={() => isAvailable && setSelectedMode(mode)}
                        disabled={!isAvailable}
                        className={`relative text-left rounded-[1rem] border px-5 py-2.5 transition-all ${
                          selectedMode === mode ? 'border-[#1D9E75]/70 bg-[#1D9E75]/10'
                          : isAvailable ? 'border-white/10 bg-white/[0.03] hover:border-white/45'
                          : 'border-white/5 bg-white/[0.01] opacity-40 cursor-not-allowed'
                        }`}>
                        <div className="flex items-center mb-1">
                          <span className="text-[13px] font-medium text-[#EAE4D5]">{t(MODE_KEYS[mode])}</span>
                        </div>
                        <p className="text-[12px] text-white/65">{t(MODE_DESC_KEYS[mode])}</p>
                      </button>
                    )
                  })}
                <div className="mt-2">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/65 mb-3">{t('fuel_sprintDuration')}</p>
                    <div className="flex gap-2">
                      {SPRINT_DURATIONS.map((d) => (
                       <button key={d} onClick={() => setSelectedDuration(d)}
  className={`flex-1 rounded-full border py-1.5 text-[10px] uppercase tracking-[0.12em] transition-all ${
                            selectedDuration === d ? 'border-[#1D9E75]/70 bg-[#1D9E75]/15 text-[#3DD4A0]'
                            : 'border-white/10 text-white/65 hover:border-white/45'
                          }`}>
                          {d} {t('fuel_days')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Col droite — objectif + CTA */}
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/65 mb-3">{t('fuel_sprintGoal')}</p>
                  <div className="flex flex-wrap gap-2">
                    {GOAL_KEYS.map((key) => (
                      <button key={key} onClick={() => setSelectedGoal(prev => prev === key ? null : key)}
                        className={`rounded-full border px-3 py-1.5 text-[11px] transition-all ${
                          selectedGoal === key ? 'border-[#1D9E75]/70 bg-[#1D9E75]/15 text-[#3DD4A0]'
                          : 'border-white/10 text-white/65 hover:border-white/45'
                        }`}>
                        {t(key)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-auto">
                  <button onClick={handleStartSprint}
                    className="relative w-full rounded-full border border-[#1D9E75]/65 bg-[#1D9E75]/15 py-4 text-[12px] uppercase tracking-[0.22em] text-[#3DD4A0] transition hover:bg-[#1D9E75]/50">
                    <div className="absolute top-0 left-[18%] w-[64%] h-[1px] bg-gradient-to-r from-transparent via-[#5DCAA5]/70 to-transparent" />
                    {t('fuel_startSprint')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DASHBOARD ── */}
      {view === 'dashboard' && (
        <div className="hidden md:flex relative z-20 mx-auto max-w-[1850px] min-h-screen items-stretch px-4 md:px-8 lg:px-0">
          {/* Bloc gauche */}
          <div className="relative flex w-full max-w-[760px] flex-col justify-center px-8 lg:pl-0 lg:pr-16 items-start pointer-events-auto">
  <div className="relative ml-0 max-w-[490px] -mt-16 lg:-mt-[296px]">
            <div className="relative rounded-[32px] lg:rounded-[36px] border border-white/6 bg-black/24 px-10 lg:px-12 py-8 backdrop-blur-[14px] shadow-[0_0_80px_rgba(0,0,0,0.45)] overflow-hidden h-[484px] lg:h-[500px]">
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#1D9E75] to-transparent opacity-70" />

            <p className="mb-6 text-[13px] uppercase tracking-[0.28em] text-[#3DD4A0]/80"
  style={{ fontFamily: 'Inter, sans-serif' }}>
  {t('fuel_badge')}
</p>
<h2 className="text-[48px] lg:text-[58px] font-light leading-[1.05] text-[#EAE4D5]"
  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
  {(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return t('fuel_goodMorning')
    if (hour >= 12 && hour < 18) return t('fuel_goodAfternoon')
    if (hour >= 18 && hour < 22) return t('fuel_goodEvening')
    return t('fuel_goodNight')
  })()} <span className="italic">{firstName}</span>
</h2>
{activeSprint && (
  <p className="mt-2 text-[16px] lg:text-[17px] font-[450] leading-[1.75] italic text-white/80"
    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
    {t(MODE_KEYS[activeSprint.mode])} {t('fuel_sprintLabel')}
  </p>
)}
<div className="mt-4 h-px bg-gradient-to-r from-white/10 to-transparent mb-4" />
              {/* Menu navigation */}
              <nav className="flex flex-col">
                {([
                  { id: 'today' as ActiveSection,  label: t('fuel_menuToday')    },
                  { id: 'evolve' as ActiveSection, label: t('fuel_menuEvolve')   },
                  { id: 'feed' as ActiveSection,   label: t('fuel_menuFeed')     },
                ] as { id: ActiveSection; label: string }[]).map((item) => {
                  const isActive = activeSection === item.id
                  return (
                    <button key={item.id}
                      onClick={() => setActiveSection(prev => prev === item.id ? null : item.id)}
                      className={`group relative flex items-center gap-4 rounded-[0.8rem] px-4 py-1 text-left transition-all duration-200 ${
                        isActive ? 'bg-black/8 border border-black/10' : 'border border-transparent hover:bg-black/[0.04]'
                      }`}>
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-[#1D9E75]" />}
                      <span className={`text-[12px] uppercase tracking-[0.24em] transition-all ${
                        isActive ? 'text-[#3DD4A0] font-medium' : 'text-white/65 group-hover:text-white/75'
                      }`}>
                        {item.label}
                      </span>
                      {isActive && <ChevronRight className="ml-auto h-3 w-3 text-white/50" />}
                    </button>
                  )
                })}

                <div className="mt-1 h-px bg-gradient-to-r from-black/15 to-transparent mb-1" />

                {/* Actions directes */}
                <button onClick={() => setActiveSection(prev => prev === 'scan' ? null : 'scan')}
                  className={`group relative flex items-center gap-4 rounded-[0.8rem] px-4 py-1 text-left border transition-all duration-200 ${activeSection === 'scan' ? 'bg-black/8 border-black/10' : 'border-transparent hover:bg-black/[0.04]'}`}>
                  {activeSection === 'scan' && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-[#1D9E75]" />}
                  <span className={`text-[12px] uppercase tracking-[0.24em] transition-all ${activeSection === 'scan' ? 'text-[#3DD4A0] font-medium' : 'text-[#3DD4A0]/70 group-hover:text-[#3DD4A0]/90'}`}>
                    {t('fuel_menuScan')}
                  </span>
                  {activeSection === 'scan' && <ChevronRight className="ml-auto h-3 w-3 text-white/50" />}
                </button>
                <button onClick={() => setActiveSection(prev => prev === 'setup' ? null : 'setup')}
                  className={`group relative flex items-center gap-4 rounded-[0.8rem] px-4 py-1 text-left border transition-all duration-200 ${activeSection === 'setup' ? 'bg-black/8 border-black/10' : 'border-transparent hover:bg-black/[0.04]'}`}>
                  {activeSection === 'setup' && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-[#1D9E75]" />}
                  <span className={`text-[12px] uppercase tracking-[0.24em] transition-all ${activeSection === 'setup' ? 'text-[#3DD4A0] font-medium' : 'text-white/55 group-hover:text-white/80'}`}>
                    {t('fuel_menuNewSprint')}
                  </span>
                  {activeSection === 'setup' && <ChevronRight className="ml-auto h-3 w-3 text-white/50" />}
                </button>

                <div className="mt-1 h-px bg-gradient-to-r from-black/15 to-transparent mb-1" />

                <button onClick={generateQRToken}
                  className="group flex items-center gap-4 rounded-[0.8rem] px-4 py-1 text-left border border-transparent hover:bg-black/[0.04] transition-all duration-200">
                  <span className="text-[12px] uppercase tracking-[0.24em] text-white/65 group-hover:text-white/75">
                    {t('fuel_connectPhone')}
                  </span>
                </button>
              </nav>
            </div>
          </div>
         </div>
    

          {/* Contenu section — droite */}
          {activeSection && (
            <div className="hidden md:flex absolute left-[520px] lg:left-[600px] top-0 right-0 bottom-[140px] items-start z-30 px-10 lg:px-16 pt-[0px]">
              <div className="w-full max-w-[960px] min-w-0 overflow-hidden">
                {activeSection === 'today'  && <TodaySection  activeSprint={activeSprint} logs={logs} />}
                {activeSection === 'evolve' && <EvolveSection logs={allLogs} />}
                {activeSection === 'feed'   && <FeedSection   logs={logs} />}
                {activeSection === 'scan'   && <ScanSection   activeSprint={activeSprint} imageFile={imageFile} setImageFile={setImageFile} imagePreview={imagePreview} setImagePreview={setImagePreview} mealTime={mealTime} setMealTime={setMealTime} note={note} setNote={setNote} isAnalyzing={isAnalyzing} handleAnalyze={handleAnalyze} fileInputRef={fileInputRef} handleImageChange={handleImageChange} />}
                {activeSection === 'setup'  && <SetupSection  memberTier={memberTier} selectedMode={selectedMode} setSelectedMode={setSelectedMode} selectedDuration={selectedDuration} setSelectedDuration={setSelectedDuration} selectedGoal={selectedGoal} setSelectedGoal={setSelectedGoal} handleStartSprint={handleStartSprint} />}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CARDS EN BAS — desktop ── */}
      {view === 'dashboard' && (
        <div className="hidden md:block absolute bottom-0 left-0 right-0 z-20 px-8 pb-8">
          <div className="flex gap-3 max-w-[1400px] mx-auto">
            <div className="flex-1 rounded-[1rem] border border-white/10 bg-black/45 backdrop-blur-xl px-5 py-2">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/65 mb-0.5">{t('fuel_totalScanned')}</p>
              <div className="flex items-end gap-1">
                <span className="text-[2rem] font-light text-[#EAE4D5]/65"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>{totalScanned}</span>
                <span className="text-[11px] text-white/50 mb-1">{t('fuel_meals')}</span>
              </div>
            </div>
            <div className="flex-1 rounded-[1rem] border border-white/10 bg-black/45 backdrop-blur-xl px-5 py-2">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/65 mb-0.5">{t('fuel_avgScore')}</p>
              <div className="flex items-end gap-1">
                <span className="text-[2rem] font-light text-[#EAE4D5]/65"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>{avgScoreAll ?? '—'}</span>
                <span className="text-[11px] text-white/50 mb-1">/100</span>
              </div>
            </div>
            <div className="flex-[2] rounded-[1rem] border border-white/10 bg-black/45 backdrop-blur-xl px-5 py-2">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/65 mb-0.5">{t('fuel_bestScores')}</p>
              <div className="flex items-end justify-between w-full">
                {[
                  { label: t('fuel_breakfast'), val: bestByMeal('breakfast') },
                  { label: t('fuel_lunch'),     val: bestByMeal('lunch')     },
                  { label: t('fuel_dinner'),    val: bestByMeal('dinner')    },
                ].map((b) => (
                  <div key={b.label} className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-[0.16em] text-white/50">{b.label}</span>
                    <span className="text-[2rem] font-light text-[#EAE4D5]/65"
                      style={{ fontFamily: "'Cormorant Garamond', serif", color: b.val ? scoreColor(b.val) : undefined }}>
                      {b.val ?? '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          MOBILE
      ══════════════════════════════════════ */}
      <div className="md:hidden flex flex-col h-full">

        {/* NAVBAR MOBILE */}
        <div className="relative z-40 mx-auto mt-4 flex w-full items-center justify-between bg-transparent px-4">
          <img src="/LOGOOFFICIELTRANSP.png" alt="Lonara"
            className="ml-0 mt-3 h-24 w-auto opacity-95 object-contain" />
          <div className="flex items-center gap-3 mr-4">
            {activeSprint && view === 'dashboard' && (
              <span className="text-[9px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full border border-[#1D9E75]/55 bg-[#1D9E75]/10 text-[#3DD4A0]/80">
                {t(MODE_KEYS[activeSprint.mode])}
              </span>
            )}
            <button onClick={onBack} className="text-white/60 hover:text-white/80">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* SETUP SPRINT MOBILE */}
        {view === 'setup' && (
          <div className="absolute inset-0 z-20 overflow-y-auto pt-[100px] px-4 pb-8">
            <div className="relative w-full rounded-[24px] border border-white/6 bg-black/28 px-6 py-8 backdrop-blur-[14px] shadow-[0_0_80px_rgba(0,0,0,0.45)]">
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#1D9E75] to-transparent opacity-70" />
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#3DD4A0]/80 mb-2">{t('fuel_badge')} — {t('fuel_menuNewSprint')}</p>
              <h2 className="text-[2rem] font-light text-[#EAE4D5] mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t('fuel_newSprintTitle')}</h2>
              <p className="text-[12px] text-white/60 mb-5 leading-relaxed">{t('fuel_newSprintDesc')}</p>

              {/* Modes */}
              <div className="flex flex-col gap-2 mb-5">
                {(['pulse', 'rhythm', 'protocol'] as SprintMode[]).map((mode) => {
                  const isAvailable = mode === 'pulse' ||
                    (mode === 'rhythm' && (memberTier === 'premium' || memberTier === 'executive')) ||
                    (mode === 'protocol' && memberTier === 'executive')
                  return (
                    <button key={mode} onClick={() => isAvailable && setSelectedMode(mode)}
                      disabled={!isAvailable}
                      className={`text-left rounded-[1rem] border px-4 py-3 transition-all ${
                        selectedMode === mode ? 'border-[#1D9E75]/70 bg-[#1D9E75]/10'
                        : isAvailable ? 'border-white/10 bg-white/[0.03]'
                        : 'border-white/5 opacity-40 cursor-not-allowed'
                      }`}>
                      <span className="text-[12px] font-medium text-[#EAE4D5]">{t(MODE_KEYS[mode])}</span>
                      <p className="text-[11px] text-white/55 mt-0.5">{t(MODE_DESC_KEYS[mode])}</p>
                    </button>
                  )
                })}
              </div>

              {/* Durée */}
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/65 mb-2">{t('fuel_sprintDuration')}</p>
              <div className="flex gap-2 mb-5">
                {SPRINT_DURATIONS.map((d) => (
                  <button key={d} onClick={() => setSelectedDuration(d)}
                    className={`flex-1 rounded-full border py-1.5 text-[10px] uppercase tracking-[0.12em] transition-all ${
                      selectedDuration === d ? 'border-[#1D9E75]/70 bg-[#1D9E75]/15 text-[#3DD4A0]'
                      : 'border-white/10 text-white/65'
                    }`}>
                    {d} {t('fuel_days')}
                  </button>
                ))}
              </div>

              {/* Goal */}
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/65 mb-2">{t('fuel_sprintGoal')}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {GOAL_KEYS.map((key) => (
                  <button key={key} onClick={() => setSelectedGoal(prev => prev === key ? null : key)}
                    className={`rounded-full border px-3 py-1.5 text-[11px] transition-all ${
                      selectedGoal === key ? 'border-[#1D9E75]/70 bg-[#1D9E75]/15 text-[#3DD4A0]'
                      : 'border-white/10 text-white/65'
                    }`}>
                    {t(key)}
                  </button>
                ))}
              </div>

              <button onClick={handleStartSprint} disabled={!selectedGoal}
                className="relative w-full rounded-full border border-[#1D9E75]/65 bg-[#1D9E75]/15 py-4 text-[12px] uppercase tracking-[0.22em] text-[#3DD4A0] transition hover:bg-[#1D9E75]/50 disabled:opacity-40 disabled:cursor-not-allowed">
                <div className="absolute top-0 left-[18%] w-[64%] h-[1px] bg-gradient-to-r from-transparent via-[#5DCAA5]/70 to-transparent" />
                {t('fuel_startSprint')}
              </button>
            </div>
          </div>
        )}

        {/* DASHBOARD MOBILE */}
        {view === 'dashboard' && (
          <div className="absolute z-20 left-0 right-0 flex justify-center px-4"
            style={{ top: '130px', bottom: '8px' }}>
            <div className="flex flex-col w-full max-w-[340px] gap-3">

              {/* Card principale */}
              <div className="relative w-full rounded-[20px] border border-white/6 bg-black/24 px-5 py-4 backdrop-blur-[14px] shadow-[0_0_80px_rgba(0,0,0,0.45)]">
                <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#1D9E75] to-transparent opacity-70" />
                <p className="mb-2 text-[9px] uppercase tracking-[0.22em] text-[#3DD4A0]/80" style={{ fontFamily: 'Inter, sans-serif' }}>{t('fuel_badge')}</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <span className="text-[32px] font-light leading-[1.05] text-[#EAE4D5]">
                    {(() => {
                      const hour = new Date().getHours()
                      if (hour >= 5 && hour < 12) return t('fuel_goodMorning')
                      if (hour >= 12 && hour < 18) return t('fuel_goodAfternoon')
                      if (hour >= 18 && hour < 22) return t('fuel_goodEvening')
                      return t('fuel_goodNight')
                    })()} <span className="italic">{firstName}</span>
                  </span>
                </h2>
                {activeSprint && (
                  <p className="mt-1 text-[13px] font-light leading-[1.7] italic text-white/65"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {t(MODE_KEYS[activeSprint.mode])} {t('fuel_sprintLabel')}
                  </p>
                )}

                <div className="mt-3 h-px bg-gradient-to-r from-white/10 to-transparent mb-3" />

                {/* Menu */}
                <nav className="flex flex-col">
                  {([
                    { id: 'today' as ActiveSection,  label: t('fuel_menuToday')    },
                    { id: 'evolve' as ActiveSection, label: t('fuel_menuEvolve')   },
                    { id: 'feed' as ActiveSection,   label: t('fuel_menuFeed')     },
                  ] as { id: ActiveSection; label: string }[]).map((item) => {
                    const isActive = activeSection === item.id
                    return (
                      <button key={item.id}
                        onClick={() => setActiveSection(prev => prev === item.id ? null : item.id)}
                        className={`group relative flex items-center gap-3 rounded-[0.8rem] px-3 py-1.5 text-left transition-all ${
                          isActive ? 'bg-black/8 border border-black/10' : 'border border-transparent'
                        }`}>
                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-[#1D9E75]" />}
                        <span className={`text-[11px] uppercase tracking-[0.24em] ${
                          isActive ? 'text-[#3DD4A0] font-medium' : 'text-white/65'
                        }`}>{item.label}</span>
                        {isActive && <ChevronRight className="ml-auto h-3 w-3 text-white/50" />}
                      </button>
                    )
                  })}

                  <div className="mt-1 h-px bg-gradient-to-r from-black/15 to-transparent mb-1" />

                  <button onClick={() => setActiveSection(prev => prev === 'scan' ? null : 'scan')}
                    className={`group relative flex items-center gap-3 rounded-[0.8rem] px-3 py-1.5 text-left border transition-all ${activeSection === 'scan' ? 'bg-black/8 border-black/10' : 'border-transparent'}`}>
                    {activeSection === 'scan' && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-[#1D9E75]" />}
                    <span className={`text-[11px] uppercase tracking-[0.24em] ${activeSection === 'scan' ? 'text-[#3DD4A0] font-medium' : 'text-[#3DD4A0]/70'}`}>
                      {t('fuel_menuScan')}
                    </span>
                    {activeSection === 'scan' && <ChevronRight className="ml-auto h-3 w-3 text-white/50" />}
                  </button>

                  <button onClick={() => setActiveSection(prev => prev === 'setup' ? null : 'setup')}
                    className={`group relative flex items-center gap-3 rounded-[0.8rem] px-3 py-1.5 text-left border transition-all ${activeSection === 'setup' ? 'bg-black/8 border-black/10' : 'border-transparent'}`}>
                    {activeSection === 'setup' && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-[#1D9E75]" />}
                    <span className={`text-[11px] uppercase tracking-[0.24em] ${activeSection === 'setup' ? 'text-[#3DD4A0] font-medium' : 'text-white/55'}`}>
                      {t('fuel_menuNewSprint')}
                    </span>
                    {activeSection === 'setup' && <ChevronRight className="ml-auto h-3 w-3 text-white/50" />}
                  </button>

                  <div className="mt-1 h-px bg-gradient-to-r from-black/15 to-transparent mb-1" />

                  <button onClick={generateQRToken}
                    className="group flex items-center gap-3 rounded-[0.8rem] px-3 py-1.5 text-left border border-transparent transition-all">
                    <span className="text-[11px] uppercase tracking-[0.24em] text-white/65">
                      {t('fuel_connectPhone')}
                    </span>
                  </button>
                </nav>
              </div>

              {/* Métriques 2x2 */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: t('fuel_totalScanned'), value: String(totalScanned), unit: t('fuel_meals') },
                  { label: t('fuel_avgScore'),     value: avgScoreAll ? String(avgScoreAll) : '—', unit: '/100' },
                  { label: t('fuel_breakfast'),    value: bestByMeal('breakfast') ? String(bestByMeal('breakfast')) : '—', unit: t('fuel_score') },
                  { label: t('fuel_dinner'),       value: bestByMeal('dinner') ? String(bestByMeal('dinner')) : '—', unit: t('fuel_score') },
                ].map((card) => (
                  <div key={card.label} className="rounded-[0.9rem] border border-white/10 bg-black/45 backdrop-blur-xl px-4 py-2.5">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-white/50 mb-0.5">{card.label}</p>
                    <div className="flex items-end gap-0.5">
                      <span className="text-[1.4rem] font-light text-[#EAE4D5]/65" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{card.value}</span>
                      <span className="text-[9px] text-white/35 mb-0.5">{card.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* SECTION CONTENT MOBILE — overlay pleine largeur */}
        {activeSection && view === 'dashboard' && (
          <div className="absolute inset-0 z-50 bg-cover bg-center" style={{ backgroundImage: `url('${currentBg}')` }}>
            <div className="absolute inset-0 bg-[#02040A]/40" />
            <div className="relative z-10 flex flex-col h-full overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-6 pb-3 shrink-0">
                <button onClick={() => setActiveSection(null)}
                  className="flex items-center gap-2 text-white/55 text-[11px] uppercase tracking-[0.18em]">
                  <ArrowLeft className="h-4 w-4" />
                  {t('fuel_back')}
                </button>
                {activeSprint && (
                  <span className="text-[9px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full border border-[#1D9E75]/55 bg-[#1D9E75]/10 text-[#3DD4A0]/80">
                    {t(MODE_KEYS[activeSprint.mode])}
                  </span>
                )}
              </div>
              {/* Contenu */}
              <div className="px-4 pb-8 flex-1">
                {activeSection === 'today'  && <TodaySection  activeSprint={activeSprint} logs={logs} />}
                {activeSection === 'evolve' && <EvolveSection logs={allLogs} />}
                {activeSection === 'feed'   && <FeedSection   logs={logs} />}
                {activeSection === 'scan'   && <ScanSection   activeSprint={activeSprint} imageFile={imageFile} setImageFile={setImageFile} imagePreview={imagePreview} setImagePreview={setImagePreview} mealTime={mealTime} setMealTime={setMealTime} note={note} setNote={setNote} isAnalyzing={isAnalyzing} handleAnalyze={handleAnalyze} fileInputRef={fileInputRef} handleImageChange={handleImageChange} />}
                {activeSection === 'setup'  && <SetupSection  memberTier={memberTier} selectedMode={selectedMode} setSelectedMode={setSelectedMode} selectedDuration={selectedDuration} setSelectedDuration={setSelectedDuration} selectedGoal={selectedGoal} setSelectedGoal={setSelectedGoal} handleStartSprint={handleStartSprint} />}
              </div>
            </div>
          </div>
        )}

      </div>
    {showQR && qrToken && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative rounded-[24px] border border-white/10 bg-[#040B14] px-10 py-8 flex flex-col items-center gap-6 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 left-[12%] w-[76%] h-[2px] bg-gradient-to-r from-transparent via-[#1D9E75] to-transparent opacity-70" />
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#3DD4A0]/80">Connect Phone</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://app.lonaralabs.com/capture?token=${qrToken}`)}&bgcolor=040B14&color=3DD4A0`}
              alt="QR Code"
              className="w-[200px] h-[200px] rounded-[12px]"
            />
            <p className="text-[12px] text-white/45 text-center max-w-[240px] leading-relaxed">
              {t('fuel_connectPhoneDesc')}
            </p>
            <button onClick={() => { setShowQR(false); setQrToken(null) }}
              className="text-[11px] uppercase tracking-[0.18em] text-white/35 hover:text-white/55 transition">
              {t('fuel_connectPhoneClose')}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}