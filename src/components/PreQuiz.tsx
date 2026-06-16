'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'


// ── MARQUEURS ACCESSIBLES PAR NIVEAU ─────────────────────────────────────────
const PREMIUM_MARKERS = new Set([
  'fastingGlucose', 'hba1c', 'ldl', 'hdl', 'triglycerides', 'apoB',
  'tsh', 'vitaminD', 'testosterone', 'homocysteine',
  'hsCRP', 'ferritin',
])
const EXECUTIVE_MARKERS = new Set([
  'fastingGlucose', 'hba1c', 'ldl', 'hdl', 'triglycerides', 'apoB',
  'tsh', 'vitaminD', 'testosterone', 'homocysteine', 'igf1', 'insulin', 'dheas',
  'hsCRP', 'ferritin', 'il6', 'tnfAlpha',
  'horvath', 'phenoAge', 'grimAge', 'dunedinPACE',
  'telomereQPCR', 'telomereFISH', 'telomeraseActivity',
  'proteomics', 'metabolomics', 'microbiome', 'gwasSNP',
  'gfap', 'nfl', 'amyloidBeta', 'pTau217',
  'ntProBNP', 'lpa', 'cacScore', 'gdf15',
])




interface PreQuizProps {
  fullName: string
  email: string
  memberTier: 'guest' | 'member' | 'premium' | 'executive'
  accessMode: 'guest' | 'registered'
  age: number
  sex: 'male' | 'female' | 'other'
  height: number
  weight: number
  unitSystem: 'metric' | 'imperial'
  onUnitSystemChange: (value: 'metric' | 'imperial') => void
  // Panel 1 — Métabolique
  fastingGlucose: string
  hba1c: string
  ldl: string
  hdl: string
  triglycerides: string
  apoB: string
  // Panel 2 — Hormonal
  tsh: string
  vitaminD: string
  testosterone: string
  homocysteine: string
  igf1: string
  insulin: string
  dheas: string
  // Panel 3 — Inflammation
  hsCRP: string
  ferritin: string
  il6: string
  tnfAlpha: string
  // Panel 4 — Épigénétique
  horvath: string
  phenoAge: string
  grimAge: string
  dunedinPACE: string
  // Panel 5 — Télomères
  telomereQPCR: string
  telomereFISH: string
  telomeraseActivity: string
  // Panel 6 — Multi-omics
  proteomics: string
  metabolomics: string
  microbiome: string
  gwasSNP: string
  // Panel 7 — Neuro
  gfap: string
  nfl: string
  amyloidBeta: string
  pTau217: string
  // Panel 8 — Cardio avancé
  ntProBNP: string
  lpa: string
  cacScore: string
  gdf15: string
  // Setters Panel 1
  onFastingGlucoseChange: (v: string) => void
  onHba1cChange: (v: string) => void
  onLdlChange: (v: string) => void
  onHdlChange: (v: string) => void
  onTriglyceridesChange: (v: string) => void
  onApoBChange: (v: string) => void
  // Setters Panel 2
  onTshChange: (v: string) => void
  onVitaminDChange: (v: string) => void
  onTestosteroneChange: (v: string) => void
  onHomocysteineChange: (v: string) => void
  onIgf1Change: (v: string) => void
  onInsulinChange: (v: string) => void
  onDheasChange: (v: string) => void
  // Setters Panel 3
  onHsCRPChange: (v: string) => void
  onFerritinChange: (v: string) => void
  onIl6Change: (v: string) => void
  onTnfAlphaChange: (v: string) => void
  // Setters Panel 4
  onHorvathChange: (v: string) => void
  onPhenoAgeChange: (v: string) => void
  onGrimAgeChange: (v: string) => void
  onDunedinPACEChange: (v: string) => void
  // Setters Panel 5
  onTelomereQPCRChange: (v: string) => void
  onTelomereFISHChange: (v: string) => void
  onTelomeraseActivityChange: (v: string) => void
  // Setters Panel 6
  onProteomicsChange: (v: string) => void
  onMetabolomicsChange: (v: string) => void
  onMicrobiomeChange: (v: string) => void
  onGwasSNPChange: (v: string) => void
  // Setters Panel 7
  onGfapChange: (v: string) => void
  onNflChange: (v: string) => void
  onAmyloidBetaChange: (v: string) => void
  onPTau217Change: (v: string) => void
  // Setters Panel 8
  onNtProBNPChange: (v: string) => void
  onLpaChange: (v: string) => void
  onCacScoreChange: (v: string) => void
  onGdf15Change: (v: string) => void
  // Autres — IDENTIQUES À L'ORIGINAL
  onBack: () => void
  onContinue: () => void
  onAgeChange: (value: number) => void
  onSexChange: (value: 'male' | 'female' | 'other') => void
  onHeightChange: (value: number) => void
  onWeightChange: (value: number) => void
  country: string
  socioeconomic: string
  onCountryChange: (value: string) => void
  onSocioeconomicChange: (value: string) => void
}

export default function PreQuiz({
  fullName, email, memberTier, accessMode,
  age, sex, height, weight, unitSystem, onUnitSystemChange,
  fastingGlucose, hba1c, ldl, hdl, triglycerides, apoB,
  tsh, vitaminD, testosterone, homocysteine, igf1, insulin, dheas,
  hsCRP, ferritin, il6, tnfAlpha,
  horvath, phenoAge, grimAge, dunedinPACE,
  telomereQPCR, telomereFISH, telomeraseActivity,
  proteomics, metabolomics, microbiome, gwasSNP,
  gfap, nfl, amyloidBeta, pTau217,
  ntProBNP, lpa, cacScore, gdf15,
  onFastingGlucoseChange, onHba1cChange, onLdlChange, onHdlChange, onTriglyceridesChange, onApoBChange,
  onTshChange, onVitaminDChange, onTestosteroneChange, onHomocysteineChange, onIgf1Change, onInsulinChange, onDheasChange,
  onHsCRPChange, onFerritinChange, onIl6Change, onTnfAlphaChange,
  onHorvathChange, onPhenoAgeChange, onGrimAgeChange, onDunedinPACEChange,
  onTelomereQPCRChange, onTelomereFISHChange, onTelomeraseActivityChange,
  onProteomicsChange, onMetabolomicsChange, onMicrobiomeChange, onGwasSNPChange,
  onGfapChange, onNflChange, onAmyloidBetaChange, onPTau217Change,
  onNtProBNPChange, onLpaChange, onCacScoreChange, onGdf15Change,
  onBack, onContinue,
  onAgeChange, onSexChange, onHeightChange, onWeightChange,
  country, socioeconomic, onCountryChange, onSocioeconomicChange,
}: PreQuizProps) {


  const t = useTranslations('prequiz')

const locale = useLocale()

const handleLabRequisition = async () => {
  // Validation — infos requises
  if (!age || !sex || !country) {
    setLabError(t('labRequisitionFillFirst'))
    return
  }
  setLabError('')
  setLabSending(true)
  try {
    const res = await fetch('/api/send-lab-requisition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        fullName,
        age,
        sex,
        memberTier,
        locale,
      }),
    })
    if (!res.ok) throw new Error('Failed')
    setLabSent(true)
  } catch {
    setLabError(t('labRequisitionError'))
  } finally {
    setLabSending(false)
  }
}

  const bmi =
    height > 0 && weight > 0
      ? Number((weight / ((height / 100) ** 2)).toFixed(1))
      : null

const [feet, setFeet] = useState('')
const [inches, setInches] = useState('')
const [pounds, setPounds] = useState('')
const [validationError, setValidationError] =
  useState('')

const [labSending, setLabSending] = useState(false)
const [labSent, setLabSent] = useState(false)
const [labError, setLabError] = useState('')

const [openPanel, setOpenPanel] = useState<number | null>(null)

  // ── Helpers d'accès par tier ───────────────────────────────────────────────
  const isPremium   = memberTier === 'premium' || memberTier === 'executive'
  const isExecutive = memberTier === 'executive'

  const canAccess = (marker: string): boolean => {
    if (isExecutive) return EXECUTIVE_MARKERS.has(marker)
    if (isPremium)   return PREMIUM_MARKERS.has(marker)
    return false
  }

  const inputClass = (marker: string) => {
    const active = canAccess(marker)
    return `w-full rounded-[1rem] border px-3 py-2 text-[13px] transition ${
      active
        ? 'border-[#035AA8]/40 bg-black/70 text-white placeholder:text-[#EAE4D5]/40 focus:border-[#C7AC60]/40 focus:outline-none'
        : 'border-[#035AA8]/20 bg-black/70 text-white placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed'
    }`
  }

  const PanelBadge = ({ required }: { required: 'premium' | 'executive' }) => {
    const hasAccess = required === 'premium' ? isPremium : isExecutive
    return (
      <span className={`text-[9px] uppercase tracking-[0.22em] px-2 py-1 rounded-full border ml-2 ${
        hasAccess
          ? 'border-[#C7AC60]/30 text-[#C7AC60]/80 bg-[#C7AC60]/8'
          : 'border-white/10 text-white/25 bg-white/5'
      }`}>
        {required === 'premium' ? 'Premium' : 'Executive'}
      </span>
    )
  }

const PANEL_INFO: Record<number, {
  title: string
  markers: { name: string; unit: string; optimal: string; format: string }[]
}> = {
  1: {
    title: 'Standard Blood Panel',
    markers: [
      { name: 'Fasting Glucose', unit: 'mg/dL', optimal: '70 – 85', format: 'ex: 82' },
      { name: 'HbA1c', unit: '%', optimal: '4.6 – 5.3', format: 'ex: 5.1' },
      { name: 'LDL Cholesterol', unit: 'mg/dL', optimal: '< 100', format: 'ex: 95' },
      { name: 'HDL Cholesterol', unit: 'mg/dL', optimal: '> 60', format: 'ex: 65' },
      { name: 'Triglycerides', unit: 'mg/dL', optimal: '< 100', format: 'ex: 80' },
      { name: 'ApoB', unit: 'mg/dL', optimal: '< 80', format: 'ex: 75' },
    ],
  },
  2: {
    title: 'Metabolic & Hormonal Panel',
    markers: [
      { name: 'IGF-1', unit: 'ng/mL', optimal: '150 – 250', format: 'ex: 185' },
      { name: 'Fasting Insulin', unit: 'µIU/mL', optimal: '2 – 7', format: 'ex: 4.5' },
      { name: 'Testosterone (Total)', unit: 'ng/dL', optimal: '500 – 900', format: 'ex: 650' },
      { name: 'DHEA-S', unit: 'µg/dL', optimal: '200 – 400', format: 'ex: 280' },
      { name: 'TSH', unit: 'mIU/L', optimal: '0.5 – 2.0', format: 'ex: 1.2' },
      { name: 'Vitamin D (25-OH)', unit: 'ng/mL', optimal: '50 – 80', format: 'ex: 62' },
      { name: 'Homocysteine', unit: 'µmol/L', optimal: '< 9', format: 'ex: 7.5' },
    ],
  },
  3: {
    title: 'Inflammatory Markers',
    markers: [
      { name: 'hs-CRP', unit: 'mg/L', optimal: '< 0.5', format: 'ex: 0.3' },
      { name: 'IL-6', unit: 'pg/mL', optimal: '< 1.8', format: 'ex: 1.2' },
      { name: 'TNF-alpha', unit: 'pg/mL', optimal: '< 2.8', format: 'ex: 1.9' },
      { name: 'Ferritin', unit: 'ng/mL', optimal: '50 – 150', format: 'ex: 95' },
    ],
  },
  4: {
    title: 'Epigenetic Aging Clocks',
    markers: [
      { name: 'Horvath Clock', unit: 'years', optimal: '< chronological age', format: 'ex: 38' },
      { name: 'PhenoAge', unit: 'years', optimal: '< chronological age', format: 'ex: 36' },
      { name: 'GrimAge', unit: 'years', optimal: '< chronological age', format: 'ex: 40' },
      { name: 'DunedinPACE', unit: 'pace', optimal: '0.6 – 0.85', format: 'ex: 0.75' },
    ],
  },
  5: {
    title: 'Telomere Biology',
    markers: [
      { name: 'Telomere Length (qPCR)', unit: 'T/S ratio', optimal: '> 1.2', format: 'ex: 1.35' },
      { name: 'Telomere Length (FISH)', unit: 'kb', optimal: '7.5 – 12', format: 'ex: 9.2' },
      { name: 'Telomerase Activity', unit: 'amoles/µg', optimal: '4 – 15', format: 'ex: 8.5' },
    ],
  },
  6: {
    title: 'Multi-Omics',
    markers: [
      { name: 'Proteomics Profile', unit: 'score', optimal: 'Lab-specific', format: 'ex: 82' },
      { name: 'Metabolomics Panel', unit: 'score', optimal: 'Lab-specific', format: 'ex: 75' },
      { name: 'Microbiome (Shannon)', unit: 'score', optimal: 'Lab-specific', format: 'ex: 68' },
      { name: 'GWAS / SNP Risk Score', unit: 'score', optimal: 'Lab-specific', format: 'ex: 71' },
    ],
  },
  7: {
    title: 'Neurodegenerative Markers',
    markers: [
      { name: 'GFAP', unit: 'pg/mL', optimal: '< 80', format: 'ex: 52' },
      { name: 'NfL', unit: 'pg/mL', optimal: '< 10', format: 'ex: 6.5' },
      { name: 'Amyloid Beta 42/40', unit: 'ratio', optimal: '> 0.10', format: 'ex: 0.12' },
      { name: 'pTau-217', unit: 'pg/mL', optimal: '< 0.2', format: 'ex: 0.14' },
    ],
  },
  8: {
    title: 'Advanced Cardiovascular',
    markers: [
      { name: 'NT-proBNP', unit: 'pg/mL', optimal: '< 125', format: 'ex: 80' },
      { name: 'Lp(a)', unit: 'mg/dL', optimal: '< 30', format: 'ex: 18' },
      { name: 'CAC Score', unit: 'AU', optimal: '0', format: 'ex: 0' },
      { name: 'GDF-15', unit: 'pg/mL', optimal: '< 1200', format: 'ex: 850' },
    ],
  },
}


const PanelInfoModal = ({ panelNum }: { panelNum: number | null }) => {
  if (panelNum === null) return null
const info = PANEL_INFO[panelNum]
  if (!info) return null
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={() => setOpenPanel(null)}
    >
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px]" />
 
      {/* MODAL */}
      <div
        className="relative z-10 w-full max-w-[680px] rounded-[1.4rem] border border-[#C7AC60]/20 bg-[rgba(3,10,20,0.92)] backdrop-blur-[20px] p-8 shadow-[0_0_60px_rgba(199,172,96,0.08)]"
        onClick={e => e.stopPropagation()}
      >
        {/* TOP LIGHT */}
        <div className="absolute top-0 left-[12%] w-[76%] h-[1px] bg-gradient-to-r from-transparent via-[#E7D19A]/60 to-transparent" />
 
        {/* HEADER */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.28em] text-[#C7AC60]/60 mb-1">Reference Values</p>
            <h3
              className="text-[1.4rem] font-light text-[#EAE4D5]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {info.title}
            </h3>
          </div>
          <button
            onClick={() => setOpenPanel(null)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/40 hover:border-[#C7AC60]/30 hover:text-[#E7D19A] transition-all"
          >
            <span className="text-[14px] leading-none">×</span>
          </button>
        </div>
 
        {/* TABLE HEADER */}
        <div className="grid grid-cols-12 gap-2 px-3 mb-2">
          <p className="col-span-5 text-[8px] uppercase tracking-[0.22em] text-white/30">Marker</p>
          <p className="col-span-2 text-[8px] uppercase tracking-[0.22em] text-white/30 text-center">Unit</p>
          <p className="col-span-3 text-[8px] uppercase tracking-[0.22em] text-white/30 text-center">Optimal</p>
          <p className="col-span-2 text-[8px] uppercase tracking-[0.22em] text-white/30 text-right">Format</p>
        </div>
 
        {/* ROWS */}
        <div className="space-y-1">
          {info.markers.map((m: { name: string; unit: string; optimal: string; format: string }, i: number) => (
            <div
              key={i}
              className={`grid grid-cols-12 gap-2 px-3 py-2.5 rounded-[0.7rem] ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
            >
              <p className="col-span-5 text-[13px] text-[#EAE4D5]/80 leading-tight">{m.name}</p>
<p className="col-span-2 text-[12px] text-[#C7AC60]/60 text-center self-center">{m.unit}</p>
<p className="col-span-3 text-[12px] text-[#7EE2A8]/80 text-center self-center font-mono">{m.optimal}</p>
<p className="col-span-2 text-[12px] text-white/30 text-right self-center">{m.format}</p>
            </div>
          ))}
        </div>
 
        {/* NOTE */}
        <p className="mt-4 text-[9px] text-white/25 leading-relaxed px-1">
          Values represent optimal ranges for longevity optimization. Clinical reference ranges may differ. Always consult your healthcare provider.
        </p>
      </div>
    </div>
  )
}

  return (
  <div className="relative min-h-screen z-[60] overflow-visible max-w-[1800px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 pt-8 items-stretch bg-[#02040A] text-white">

  

     

      <div className="lg:col-span-2 relative overflow-hidden rounded-[1.8rem] lg:rounded-[2.7rem] border border-[#035AA8]/20 bg-[#02040a]/45 backdrop-blur-sm p-6 lg:p-10 shadow-[0_0_1px_rgba(120,200,255,0.12),
0_0_6px_rgba(3,90,168,0.05),
0_0_16px_rgba(3,90,168,0.03),
0_0_40px_rgba(3,90,168,0.02)]">
        <img
          src="/dna.png"
          alt="DNA"
          className="absolute top-0 right-0 h-full w-auto object-cover object-right-top z-[2] pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-black/20" />

<div className="absolute top-[-180px] left-[-10%] w-[420px] h-[420px] rounded-full bg-[#035AA8]/10 blur-3xl opacity-40" />

<div className="absolute bottom-[-200px] right-[-10%] w-[360px] h-[360px] rounded-full bg-[#7FD6FF]/10 blur-3xl opacity-40" />

<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0A1724,transparent_70%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(3,90,168,0.045),transparent_28%)] pointer-events-none" />
        <div className="absolute top-[-120px] left-[-10%] w-[320px] h-[320px] rounded-full bg-[#035AA8]/5 blur-[110px] opacity-14" />
        <div className="absolute bottom-[-140px] right-[-10%] w-[260px] h-[260px] rounded-full bg-[#035AA8]/5 blur-[110px] opacity-14" />

<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(92,150,216,0.20),transparent_55%)] pointer-events-none z-[5]" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex-1 min-h-0 w-full space-y-3 overflow-hidden">
            
    <div className="flex flex-col sm:flex-row items-start justify-between mb-2 gap-4">

<div className="flex items-start gap-5">
    <img
      src="/lonara-logo.png"
      alt="Lonara"
      className="h-30 w-auto mt-1"
    />
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-[#C7AC60]/80 mb-4">{t('label')}</p>
      <h2
        className="text-[2rem] md:text-[3rem] leading-[0.95] font-medium capitalize tracking-[0.04em] text-[#EAE4D5]"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Lonara Premium & Executive™
      </h2>
      <p className="mt-4 text-[#EAE4D5]/45 max-w-full sm:max-w-[60%] leading-[1.9] text-[15px]">{t('subtitle')}</p>
    </div>
</div>
</div>

{/* LAB REQUISITION BUTTON — premium + executive uniquement */}
{isPremium && (
  <div className="hidden sm:block absolute top-[88px] right-0">
    <button
      type="button"
      onClick={handleLabRequisition}
      disabled={labSending || labSent}
      className={`rounded-[0.9rem] border px-3 py-2 text-left transition-all flex items-center gap-2 ${
        labSent
          ? 'border-[#7EE2A8]/30 bg-[#7EE2A8]/8 cursor-default'
          : 'border-[#C7AC60]/25 bg-[#C7AC60]/5 hover:border-[#C7AC60]/40 hover:bg-[#C7AC60]/10'
      } ${labSending ? 'opacity-60 cursor-wait' : ''}`}
    >
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#C7AC60]/80">
          {labSent
            ? t('labRequisitionSent')
            : labSending
            ? t('labRequisitionSending')
            : t('labRequisitionButton')}
        </p>
     {labSent && (
  <p className="mt-1 text-[10px] text-[#7EE2A8]/70">
    {email}
  </p>
)}
      </div>
      {!labSent && (
        <span className="text-[#C7AC60]/60 text-lg">
          {labSending ? '...' : '→'}
        </span>
      )}
      {labSent && (
        <span className="text-[#7EE2A8] text-lg">✓</span>
      )}
    </button>

    {/* Message si infos manquantes */}
  {labError && (
  <p className="absolute top-full mt-1 right-0 text-[10px] text-[#FF9F43]/80 whitespace-nowrap">
    ⚠ {labError}
  </p>
)}
  </div>
)}

{isPremium && (
  <div className="sm:hidden w-full mb-3">
    <button
      type="button"
      onClick={handleLabRequisition}
      disabled={labSending || labSent}
      className={`w-full rounded-[0.9rem] border px-3 py-2 transition-all flex items-center justify-between ${
        labSent
          ? 'border-[#7EE2A8]/30 bg-[#7EE2A8]/8'
          : 'border-[#C7AC60]/25 bg-[#C7AC60]/5 hover:border-[#C7AC60]/40'
      }`}
    >
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#C7AC60]/80">
        {labSent ? t('labRequisitionSent') : labSending ? t('labRequisitionSending') : t('labRequisitionButton')}
      </p>
      <span className="text-[#C7AC60]/60">{labSending ? '...' : labSent ? '✓' : '→'}</span>
    </button>
    {labError && <p className="mt-1 text-[10px] text-[#FF9F43]/80">⚠ {labError}</p>}
    {labSent && <p className="mt-1 text-[10px] text-[#7EE2A8]/70">{email}</p>}
  </div>
)}

<div className="mt-5 w-full space-y-3 pr-1">

  {/* MESSAGE GUEST / MEMBER */}
  {!isPremium && (
    <div className="rounded-[1.4rem] border border-[#C7AC60]/20 bg-[#C7AC60]/5 px-6 py-4">
      <p className="text-[12px] text-[#C7AC60]/80 leading-relaxed">
        Scientific biomarkers are available for Premium and Executive members. Upgrade your plan to unlock blood panel integration.
      </p>
    </div>
  )}

  {/* PANEL 1 — MÉTABOLIQUE — premium + executive */}
  <div className={`rounded-[1.8rem] border p-3 transition ${isPremium ? 'border-[#C7AC60]/20 bg-[#0d1f12]/60' : 'border-[#035AA8]/20 bg-[#102033]/82'}`}>
   <div className="flex items-center justify-between mb-3">
  <div className="flex items-center">
    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75">{t('panel1')}</p>
    <PanelBadge required="premium" />
  </div>
  {isPremium && (
    <button
      type="button"
      onClick={() => setOpenPanel(openPanel === 1 ? null : 1)}
      className="text-[25px] text-[#C7AC60]/50 hover:text-[#C7AC60] transition-all leading-none"
    >
      ⓘ
    </button>
  )}
</div>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
      <input type="text" placeholder="Fasting Glucose" value={fastingGlucose} onChange={e => onFastingGlucoseChange(e.target.value)} disabled={!canAccess('fastingGlucose')} className={inputClass('fastingGlucose')} />
      <input type="text" placeholder="HbA1c" value={hba1c} onChange={e => onHba1cChange(e.target.value)} disabled={!canAccess('hba1c')} className={inputClass('hba1c')} />
      <input type="text" placeholder="LDL Cholesterol" value={ldl} onChange={e => onLdlChange(e.target.value)} disabled={!canAccess('ldl')} className={inputClass('ldl')} />
      <input type="text" placeholder="HDL Cholesterol" value={hdl} onChange={e => onHdlChange(e.target.value)} disabled={!canAccess('hdl')} className={inputClass('hdl')} />
      <input type="text" placeholder="Triglycerides" value={triglycerides} onChange={e => onTriglyceridesChange(e.target.value)} disabled={!canAccess('triglycerides')} className={inputClass('triglycerides')} />
      <input type="text" placeholder="ApoB" value={apoB} onChange={e => onApoBChange(e.target.value)} disabled={!canAccess('apoB')} className={inputClass('apoB')} />
    </div>
  </div>

  {/* PANEL 2 — HORMONAL — TSH/VitD/Testosterone/Homocysteine = premium | IGF-1/Insulin/DHEA-S = executive */}
  <div className={`rounded-[1.8rem] border p-3 transition ${isPremium ? 'border-[#C7AC60]/20 bg-[#0d1f12]/60' : 'border-[#035AA8]/20 bg-[#102033]/82'}`}>
    <div className="flex items-center justify-between mb-3">
  <div className="flex items-center">
    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75">{t('panel2')}</p>
    <PanelBadge required="premium" />
  </div>
  {isPremium && (
    <button
      type="button"
      onClick={() => setOpenPanel(openPanel === 2 ? null : 2)}
      className="text-[25px] text-[#C7AC60]/50 hover:text-[#C7AC60] transition-all leading-none"
    >
      ⓘ
    </button>
  )}
</div>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
      <input type="text" placeholder="IGF-1" value={igf1} onChange={e => onIgf1Change(e.target.value)} disabled={!canAccess('igf1')} className={inputClass('igf1')} />
      <input type="text" placeholder="Insulin" value={insulin} onChange={e => onInsulinChange(e.target.value)} disabled={!canAccess('insulin')} className={inputClass('insulin')} />
      <input type="text" placeholder="Testosterone" value={testosterone} onChange={e => onTestosteroneChange(e.target.value)} disabled={!canAccess('testosterone')} className={inputClass('testosterone')} />
      <input type="text" placeholder="DHEA-S" value={dheas} onChange={e => onDheasChange(e.target.value)} disabled={!canAccess('dheas')} className={inputClass('dheas')} />
      <input type="text" placeholder="TSH" value={tsh} onChange={e => onTshChange(e.target.value)} disabled={!canAccess('tsh')} className={inputClass('tsh')} />
      <input type="text" placeholder="Vitamin D" value={vitaminD} onChange={e => onVitaminDChange(e.target.value)} disabled={!canAccess('vitaminD')} className={inputClass('vitaminD')} />
      <input type="text" placeholder="Homocysteine" value={homocysteine} onChange={e => onHomocysteineChange(e.target.value)} disabled={!canAccess('homocysteine')} className={inputClass('homocysteine')} />
    </div>
    {isPremium && !isExecutive && (
      <p className="mt-2 text-[10px] text-[#C7AC60]/40">IGF-1, Insulin, DHEA-S — Executive only</p>
    )}
  </div>

  {/* PANEL 3 — INFLAMMATION — hs-CRP/Ferritin = premium | IL-6/TNF-alpha = executive */}
  <div className={`rounded-[1.8rem] border p-3 transition ${isPremium ? 'border-[#C7AC60]/20 bg-[#0d1f12]/60' : 'border-[#035AA8]/20 bg-[#102033]/82'}`}>
    <div className="flex items-center justify-between mb-3">
  <div className="flex items-center">
    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75">{t('panel3')}</p>
    <PanelBadge required="premium" />
  </div>
  {isPremium && (
    <button
      type="button"
      onClick={() => setOpenPanel(openPanel === 3 ? null : 3)}
      className="text-[25px] text-[#C7AC60]/50 hover:text-[#C7AC60] transition-all leading-none"
    >
      ⓘ
    </button>
  )}
</div>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
      <input type="text" placeholder="hs-CRP" value={hsCRP} onChange={e => onHsCRPChange(e.target.value)} disabled={!canAccess('hsCRP')} className={inputClass('hsCRP')} />
      <input type="text" placeholder="IL-6" value={il6} onChange={e => onIl6Change(e.target.value)} disabled={!canAccess('il6')} className={inputClass('il6')} />
      <input type="text" placeholder="TNF-alpha" value={tnfAlpha} onChange={e => onTnfAlphaChange(e.target.value)} disabled={!canAccess('tnfAlpha')} className={inputClass('tnfAlpha')} />
      <input type="text" placeholder="Ferritin" value={ferritin} onChange={e => onFerritinChange(e.target.value)} disabled={!canAccess('ferritin')} className={inputClass('ferritin')} />
    </div>
    {isPremium && !isExecutive && (
      <p className="mt-2 text-[10px] text-[#C7AC60]/40">IL-6, TNF-alpha — Executive only</p>
    )}
  </div>

  {/* PANEL 4 — ÉPIGÉNÉTIQUE — executive only */}
  <div className={`rounded-[1.8rem] border p-3 transition ${isExecutive ? 'border-[#C7AC60]/20 bg-[#0d1f12]/60' : 'border-[#035AA8]/20 bg-[#102033]/82'}`}>
    <div className="flex items-center justify-between mb-3">
  <div className="flex items-center">
    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75">{t('panel4')}</p>
    <PanelBadge required="executive" />
  </div>
  {isExecutive && (
    <button
      type="button"
      onClick={() => setOpenPanel(openPanel === 4 ? null : 4)}
      className="text-[25px] text-[#C7AC60]/50 hover:text-[#C7AC60] transition-all leading-none"
    >
      ⓘ
    </button>
  )}
</div>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
      <input type="text" placeholder="Horvath Clock" value={horvath} onChange={e => onHorvathChange(e.target.value)} disabled={!canAccess('horvath')} className={inputClass('horvath')} />
      <input type="text" placeholder="PhenoAge" value={phenoAge} onChange={e => onPhenoAgeChange(e.target.value)} disabled={!canAccess('phenoAge')} className={inputClass('phenoAge')} />
      <input type="text" placeholder="GrimAge" value={grimAge} onChange={e => onGrimAgeChange(e.target.value)} disabled={!canAccess('grimAge')} className={inputClass('grimAge')} />
      <input type="text" placeholder="DunedinPACE" value={dunedinPACE} onChange={e => onDunedinPACEChange(e.target.value)} disabled={!canAccess('dunedinPACE')} className={inputClass('dunedinPACE')} />
    </div>
  </div>

  {/* PANEL 5 — TÉLOMÈRES — executive only */}
  <div className={`rounded-[1.8rem] border p-3 transition ${isExecutive ? 'border-[#C7AC60]/20 bg-[#0d1f12]/60' : 'border-[#035AA8]/20 bg-[#102033]/82'}`}>
    <div className="flex items-center justify-between mb-3">
  <div className="flex items-center">
    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75">{t('panel5')}</p>
    <PanelBadge required="executive" />
  </div>
  {isExecutive && (
    <button
      type="button"
      onClick={() => setOpenPanel(openPanel === 5 ? null : 5)}
      className="text-[25px] text-[#C7AC60]/50 hover:text-[#C7AC60] transition-all leading-none"
    >
      ⓘ
    </button>
  )}
</div>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
      <input type="text" placeholder="Telomere Length qPCR" value={telomereQPCR} onChange={e => onTelomereQPCRChange(e.target.value)} disabled={!canAccess('telomereQPCR')} className={inputClass('telomereQPCR')} />
      <input type="text" placeholder="Telomere Length FISH" value={telomereFISH} onChange={e => onTelomereFISHChange(e.target.value)} disabled={!canAccess('telomereFISH')} className={inputClass('telomereFISH')} />
      <input type="text" placeholder="Telomerase Activity" value={telomeraseActivity} onChange={e => onTelomeraseActivityChange(e.target.value)} disabled={!canAccess('telomeraseActivity')} className={inputClass('telomeraseActivity')} />
    </div>
  </div>

  {/* PANEL 6 — MULTI-OMICS — executive only */}
  <div className={`rounded-[1.8rem] border p-3 transition ${isExecutive ? 'border-[#C7AC60]/20 bg-[#0d1f12]/60' : 'border-[#035AA8]/20 bg-[#102033]/82'}`}>
    <div className="flex items-center justify-between mb-3">
  <div className="flex items-center">
    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75">{t('panel6')}</p>
    <PanelBadge required="executive" />
  </div>
  {isExecutive && (
    <button
      type="button"
      onClick={() => setOpenPanel(openPanel === 6 ? null : 6)}
      className="text-[25px] text-[#C7AC60]/50 hover:text-[#C7AC60] transition-all leading-none"
    >
      ⓘ
    </button>
  )}
</div>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
      <input type="text" placeholder="Proteomics" value={proteomics} onChange={e => onProteomicsChange(e.target.value)} disabled={!canAccess('proteomics')} className={inputClass('proteomics')} />
      <input type="text" placeholder="Metabolomics" value={metabolomics} onChange={e => onMetabolomicsChange(e.target.value)} disabled={!canAccess('metabolomics')} className={inputClass('metabolomics')} />
      <input type="text" placeholder="Microbiome" value={microbiome} onChange={e => onMicrobiomeChange(e.target.value)} disabled={!canAccess('microbiome')} className={inputClass('microbiome')} />
      <input type="text" placeholder="GWAS / SNP" value={gwasSNP} onChange={e => onGwasSNPChange(e.target.value)} disabled={!canAccess('gwasSNP')} className={inputClass('gwasSNP')} />
    </div>
  </div>

  {/* PANEL 7 — NEURO — executive only */}
  <div className={`rounded-[1.8rem] border p-3 transition ${isExecutive ? 'border-[#C7AC60]/20 bg-[#0d1f12]/60' : 'border-[#035AA8]/20 bg-[#102033]/82'}`}>
    <div className="flex items-center justify-between mb-3">
  <div className="flex items-center">
    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75">{t('panel7')}</p>
    <PanelBadge required="executive" />
  </div>
  {isExecutive && (
    <button
      type="button"
      onClick={() => setOpenPanel(openPanel === 7 ? null : 7)}
      className="text-[25px] text-[#C7AC60]/50 hover:text-[#C7AC60] transition-all leading-none"
    >
      ⓘ
    </button>
  )}
</div>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
      <input type="text" placeholder="GFAP" value={gfap} onChange={e => onGfapChange(e.target.value)} disabled={!canAccess('gfap')} className={inputClass('gfap')} />
      <input type="text" placeholder="NfL" value={nfl} onChange={e => onNflChange(e.target.value)} disabled={!canAccess('nfl')} className={inputClass('nfl')} />
      <input type="text" placeholder="Amyloid Beta 42/40" value={amyloidBeta} onChange={e => onAmyloidBetaChange(e.target.value)} disabled={!canAccess('amyloidBeta')} className={inputClass('amyloidBeta')} />
      <input type="text" placeholder="pTau-217" value={pTau217} onChange={e => onPTau217Change(e.target.value)} disabled={!canAccess('pTau217')} className={inputClass('pTau217')} />
    </div>
  </div>

  {/* PANEL 8 — CARDIO AVANCÉ — executive only */}
  <div className={`rounded-[1.8rem] border p-3 transition ${isExecutive ? 'border-[#C7AC60]/20 bg-[#0d1f12]/60' : 'border-[#035AA8]/20 bg-[#102033]/82'}`}>
    <div className="flex items-center justify-between mb-3">
  <div className="flex items-center">
    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75">{t('panel8')}</p>
    <PanelBadge required="executive" />
  </div>
  {isExecutive && (
    <button
      type="button"
      onClick={() => setOpenPanel(openPanel === 8 ? null : 8)}
      className="text-[25px] text-[#C7AC60]/50 hover:text-[#C7AC60] transition-all leading-none"
    >
      ⓘ
    </button>
  )}
</div>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
      <input type="text" placeholder="NT-proBNP" value={ntProBNP} onChange={e => onNtProBNPChange(e.target.value)} disabled={!canAccess('ntProBNP')} className={inputClass('ntProBNP')} />
      <input type="text" placeholder="Lp(a)" value={lpa} onChange={e => onLpaChange(e.target.value)} disabled={!canAccess('lpa')} className={inputClass('lpa')} />
      <input type="text" placeholder="CAC Score" value={cacScore} onChange={e => onCacScoreChange(e.target.value)} disabled={!canAccess('cacScore')} className={inputClass('cacScore')} />
      <input type="text" placeholder="GDF-15" value={gdf15} onChange={e => onGdf15Change(e.target.value)} disabled={!canAccess('gdf15')} className={inputClass('gdf15')} />
    </div>
  </div>

</div>



          </div>

           
<div className="flex items-center justify-between gap-4 mt-6">
{validationError && (

  <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">

    <p className="text-[13px] text-red-300">

      {validationError}

    </p>

  </div>

)}
  {/* BACK */}
  <button
    type="button"
    onClick={onBack}
    className="group relative overflow-hidden px-10 py-4 rounded-[1.4rem] border border-[#C7AC60]/30 bg-[#0A0F18] backdrop-blur-[1px] text-[#C7AC60] transition-all duration-300 hover:bg-[#060A11] hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
  >

    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />

    <div className="absolute inset-0 rounded-[1.4rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />

    <div
      className="absolute inset-[1px] rounded-[1.35rem] opacity-40 pointer-events-none"
      style={{
        background: `
          linear-gradient(
            180deg,
            rgba(199,172,96,0.10),
            rgba(199,172,96,0.03)
          )
        `,
        boxShadow: `
          inset 0 0 30px rgba(199,172,96,0.22),
          inset 0 0 60px rgba(199,172,96,0.10)
        `,
      }}
    />

    <span className="relative z-10 flex items-center gap-3 uppercase tracking-[0.18em] text-[12px]">
      <span className="text-lg">←</span>
      {t('back')}
    </span>

  </button>

  <button
  type="button"
  onClick={() => {
if (age < 18 || age > 100) {
  setValidationError(
    t('errorAge')
  )
  return
}

if (height < 120 || height > 230) {
  setValidationError(
    t('errorHeight')
  )
  return
}

if (weight < 35 || weight > 250) {
  setValidationError(
    t('errorWeight')
  )
  return
}

setValidationError('')
onContinue()

  }}
  disabled={
    !sex ||
    !age ||
    !height ||
    !weight ||
    !country ||
    !socioeconomic
  }
    className="group relative overflow-hidden px-10 py-4 rounded-[1.4rem] border border-[#C7AC60]/30 bg-[#0A0F18] backdrop-blur-[1px] text-[#C7AC60] transition-all duration-300 hover:bg-[#060A11] hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)] disabled:opacity-40 disabled:cursor-not-allowed"
  >

    <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />

    <div className="absolute inset-0 rounded-[1.4rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />

    <div
      className="absolute inset-[1px] rounded-[1.35rem] opacity-40 pointer-events-none"
      style={{
        background: `
          linear-gradient(
            180deg,
            rgba(199,172,96,0.10),
            rgba(199,172,96,0.03)
          )
        `,
        boxShadow: `
          inset 0 0 30px rgba(199,172,96,0.22),
          inset 0 0 40px rgba(199,172,96,0.10)
        `,
      }}
    />

    <span className="relative z-10 flex items-center gap-3 uppercase tracking-[0.18em] text-[12px]">
      {t('next')}
      <span className="text-lg">→</span>
    </span>

  </button>


</div>
        </div>
      </div>


      <aside className="relative overflow-hidden rounded-[1.8rem] lg:rounded-[2.7rem] border border-[#035AA8]/20 bg-[#02040a]/45 backdrop-blur-sm p-6 lg:p-10 shadow-[0_0_1px_rgba(120,200,255,0.12),
0_0_6px_rgba(3,90,168,0.05),
0_0_16px_rgba(3,90,168,0.03),
0_0_40px_rgba(3,90,168,0.02)]">
        
<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(92,150,216,0.20),transparent_55%)] pointer-events-none" />


        <div className="relative z-10 space-y-6">
          <div>
             <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-[#C7AC60]/80 mb-4">
              {t('coreInputs')}
            </p>
            <h3  className="text-[2rem] md:text-[3rem] leading-[0.95] font-medium capitalize tracking-[0.04em] text-[#EAE4D5]"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
        }}>
              {t('baselineTitle')}
            </h3>
            <p className="mt-4 text-[#EAE4D5]/45 max-w-2xl leading-[1.9] text-[15px]">
              {t('baselineSubtitle')}
            </p>
          </div>

          <div className="relative overflow-hidden space-y-4 rounded-[1.5rem] border border-white/5 bg-white/[0.02] p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_75%)]" />

<div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-90" />
            <div>
              <label className="text-[9px] uppercase tracking-[0.24em] text-[#EAE4D5]/50 block mb-2">{t('fullName')}</label>
              <p className="text-[14px] text-[#EAE4D5]">{fullName || t('notSet')}</p>
            </div>
            <div>
              <label className="text-[9px] uppercase tracking-[0.24em] text-[#EAE4D5]/50 block mb-2">{t('email')}</label>
              <p className="text-[14px] text-[#EAE4D5]">{email || t('notSet')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">

            <div>
              
              <label className="text-[9px] uppercase tracking-[0.22em] text-[#EAE4D5]/50 block mb-2">{t('sex')}</label>
              <select
                value={sex}
                onChange={(event) => onSexChange(event.target.value as 'male' | 'female' | 'other')}
                className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 transition focus:border-[#035AA8]/45 focus:outline-none"
              >
                <option value="male">{t('male')}</option>
                <option value="female">{t('female')}</option>
                <option value="other">{t('other')}</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] uppercase tracking-[0.22em] text-[#EAE4D5]/50 block mb-2">{t('age')}</label>
              <input
                type="number"
                value={age || ''}
                min={18}
max={100}
                onChange={(event) => onAgeChange(Number(event.target.value))}
                placeholder={t('age')}
                className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 transition focus:border-[#035AA8]/45 focus:outline-none"
              />
            </div>
           </div>

            <div>
              <label className="text-[9px] uppercase tracking-[0.22em] text-[#EAE4D5]/50 block mb-2">{t('country')}</label>
              <select value={country} onChange={(e) => onCountryChange(e.target.value)}
                className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] transition focus:border-[#035AA8]/45 focus:outline-none">
            <option value="">{t('selectCountry')}</option>
                <option value="Afghanistan">Afghanistan</option>
                <option value="Albania">Albania</option>
                <option value="Algeria">Algeria</option>
                <option value="Andorra">Andorra</option>
                <option value="Angola">Angola</option>
                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                <option value="Argentina">Argentina</option>
                <option value="Armenia">Armenia</option>
                <option value="Australia">Australia</option>
                <option value="Austria">Austria</option>
                <option value="Azerbaijan">Azerbaijan</option>
                <option value="Bahamas">Bahamas</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Barbados">Barbados</option>
                <option value="Belarus">Belarus</option>
                <option value="Belgium">Belgium</option>
                <option value="Belize">Belize</option>
                <option value="Benin">Benin</option>
                <option value="Bhutan">Bhutan</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                <option value="Botswana">Botswana</option>
                <option value="Brazil">Brazil</option>
                <option value="Brunei">Brunei</option>
                <option value="Bulgaria">Bulgaria</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Burundi">Burundi</option>
                <option value="Cabo Verde">Cabo Verde</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Canada">Canada</option>
                <option value="Central African Republic">Central African Republic</option>
                <option value="Chad">Chad</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Colombia">Colombia</option>
                <option value="Comoros">Comoros</option>
                <option value="Congo">Congo</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Croatia">Croatia</option>
                <option value="Cuba">Cuba</option>
                <option value="Cyprus">Cyprus</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Denmark">Denmark</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Dominica">Dominica</option>
                <option value="Dominican Republic">Dominican Republic</option>
                <option value="DR Congo">DR Congo</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Egypt">Egypt</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Estonia">Estonia</option>
                <option value="Eswatini">Eswatini</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Fiji">Fiji</option>
                <option value="Finland">Finland</option>
                <option value="France">France</option>
                <option value="Gabon">Gabon</option>
                <option value="Gambia">Gambia</option>
                <option value="Georgia">Georgia</option>
                <option value="Germany">Germany</option>
                <option value="Ghana">Ghana</option>
                <option value="Greece">Greece</option>
                <option value="Grenada">Grenada</option>
                <option value="Guatemala">Guatemala</option>
                <option value="Guinea">Guinea</option>
                <option value="Guinea-Bissau">Guinea-Bissau</option>
                <option value="Guyana">Guyana</option>
                <option value="Haiti">Haiti</option>
                <option value="Honduras">Honduras</option>
                <option value="Hong Kong">Hong Kong</option>
                <option value="Hungary">Hungary</option>
                <option value="Iceland">Iceland</option>
                <option value="India">India</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Iran">Iran</option>
                <option value="Iraq">Iraq</option>
                <option value="Ireland">Ireland</option>
                <option value="Israel">Israel</option>
                <option value="Italy">Italy</option>
                <option value="Ivory Coast">Ivory Coast</option>
                <option value="Jamaica">Jamaica</option>
                <option value="Japan">Japan</option>
                <option value="Jordan">Jordan</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Kenya">Kenya</option>
                <option value="Kiribati">Kiribati</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Kyrgyzstan">Kyrgyzstan</option>
                <option value="Laos">Laos</option>
                <option value="Latvia">Latvia</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Liberia">Liberia</option>
                <option value="Libya">Libya</option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Lithuania">Lithuania</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malawi">Malawi</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Maldives">Maldives</option>
                <option value="Mali">Mali</option>
                <option value="Malta">Malta</option>
                <option value="Marshall Islands">Marshall Islands</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Mexico">Mexico</option>
                <option value="Micronesia">Micronesia</option>
                <option value="Moldova">Moldova</option>
                <option value="Monaco">Monaco</option>
                <option value="Mongolia">Mongolia</option>
                <option value="Montenegro">Montenegro</option>
                <option value="Morocco">Morocco</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Namibia">Namibia</option>
                <option value="Nauru">Nauru</option>
                <option value="Nepal">Nepal</option>
                <option value="Netherlands">Netherlands</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Niger">Niger</option>
                <option value="Nigeria">Nigeria</option>
                <option value="North Korea">North Korea</option>
                <option value="North Macedonia">North Macedonia</option>
                <option value="Norway">Norway</option>
                <option value="Oman">Oman</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Palau">Palau</option>
                <option value="Palestine">Palestine</option>
                <option value="Panama">Panama</option>
                <option value="Papua New Guinea">Papua New Guinea</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Peru">Peru</option>
                <option value="Philippines">Philippines</option>
                <option value="Poland">Poland</option>
                <option value="Portugal">Portugal</option>
                <option value="Qatar">Qatar</option>
                <option value="Romania">Romania</option>
                <option value="Russia">Russia</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                <option value="Saint Lucia">Saint Lucia</option>
                <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                <option value="Samoa">Samoa</option>
                <option value="San Marino">San Marino</option>
                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Senegal">Senegal</option>
                <option value="Serbia">Serbia</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra Leone">Sierra Leone</option>
                <option value="Singapore">Singapore</option>
                <option value="Slovakia">Slovakia</option>
                <option value="Slovenia">Slovenia</option>
                <option value="Solomon Islands">Solomon Islands</option>
                <option value="Somalia">Somalia</option>
                <option value="South Africa">South Africa</option>
                <option value="South Korea">South Korea</option>
                <option value="South Sudan">South Sudan</option>
                <option value="Spain">Spain</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Sudan">Sudan</option>
                <option value="Suriname">Suriname</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Syria">Syria</option>
                <option value="Taiwan">Taiwan</option>
                <option value="Tajikistan">Tajikistan</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Thailand">Thailand</option>
                <option value="Timor-Leste">Timor-Leste</option>
                <option value="Togo">Togo</option>
                <option value="Tonga">Tonga</option>
                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Turkey">Turkey</option>
                <option value="Turkmenistan">Turkmenistan</option>
                <option value="Tuvalu">Tuvalu</option>
                <option value="UAE">UAE</option>
                <option value="Uganda">Uganda</option>
                <option value="Ukraine">Ukraine</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Uzbekistan">Uzbekistan</option>
                <option value="Vanuatu">Vanuatu</option>
                <option value="Vatican City">Vatican City</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Vietnam">Vietnam</option>
                <option value="Yemen">Yemen</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] uppercase tracking-[0.22em] text-[#EAE4D5]/50 block mb-2">{t('socioeconomic')}</label>
              <select value={socioeconomic} onChange={(e) => onSocioeconomicChange(e.target.value)}
                className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] transition focus:border-[#035AA8]/45 focus:outline-none">
                <option value="">{t('select')}</option>
                <option value="low">{t('low')}</option>
                <option value="middle">{t('middle')}</option>
                <option value="upper-middle">{t('upperMiddle')}</option>
                <option value="high">{t('high')}</option>
              </select>
            </div>

            <div className="col-span-2">
              

              
<div>
  <label className="text-[9px] uppercase tracking-[0.22em] text-[#EAE4D5]/50 block mb-2">
    {t('measurementSystem')}
  </label>

  <div className="grid grid-cols-2 gap-2 mb-5">

    <button
      type="button"
      onClick={() =>
        onUnitSystemChange('metric')
      }
      className={`rounded-[0.9rem] border px-3 py-2 text-[12px] transition ${
        unitSystem === 'metric'
          ? 'border-[#C7AC60]/40 bg-[#C7AC60]/10 text-[#E7D19A]'
          : 'border-[#035AA8]/20 bg-black/70 text-white/70'
      }`}
    >
      {t('metric')}
    </button>

    <button
      type="button"
      onClick={() =>
        onUnitSystemChange('imperial')
      }
      className={`rounded-[0.9rem] border px-3 py-2 text-[12px] transition ${
        unitSystem === 'imperial'
          ? 'border-[#C7AC60]/40 bg-[#C7AC60]/10 text-[#E7D19A]'
          : 'border-[#035AA8]/20 bg-black/70 text-white/70'
      }`}
    >
      {t('imperial')}
    </button>

  </div>
</div>

            <label className="text-[9px] uppercase tracking-[0.22em] text-[#EAE4D5]/50 block mb-2">
  {t('height')}
</label>

{unitSystem === 'metric' ? (

  <input
    type="number"
    min={120}
    max={230}
    value={height || ''}

    onChange={(event) =>
      onHeightChange(
        Number(event.target.value),
      )
    }
    placeholder={t('heightCm')}
    className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px]"
  />

) : (

  <div className="grid grid-cols-2 gap-2">

    <input
  type="number"
  min={3}
  max={7}
  placeholder={t('feet')}
  value={feet}
      onChange={(e) => {

        const ft =
          Number(e.target.value)

        setFeet(
          e.target.value,
        )

        const totalCm =
          ((ft * 12)
            + Number(inches || 0))
          * 2.54

        onHeightChange(
          Math.round(totalCm),
        )

      }}
      className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px]"
    />

   <input
  type="number"
  min={0}
  max={11}
  placeholder={t('inches')}
  value={inches}
      onChange={(e) => {

        const inch =
          Number(e.target.value)

        setInches(
          e.target.value,
        )

        const totalCm =
          ((Number(feet || 0) * 12)
            + inch)
          * 2.54

        onHeightChange(
          Math.round(totalCm),
        )

      }}
      className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px]"
    />

  </div>

)}
            <div className="col-span-2">
          
              <label className="text-[9px] uppercase tracking-[0.22em] text-[#EAE4D5]/50 block mb-2">
  {t('weight')}
</label>

{unitSystem === 'metric' ? (

  <input
    type="number"
    min={35}
    max={250}
    value={weight || ''}
    onChange={(event) =>
      onWeightChange(
        Number(event.target.value),
      )
    }
    placeholder={t('weightKg')}
    className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px]"
  />

) : (

  <input
  type="number"
  min={77}
  max={551}
  placeholder={t('weightLb')}
  value={pounds}
    onChange={(e) => {

      setPounds(
        e.target.value,
      )

      const kg =
        Number(e.target.value)
        / 2.20462

      onWeightChange(
        Math.round(kg),
      )

    }}
    className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px]"
  />

)}
            </div>
          </div>

    

          <div className="relative overflow-hidden rounded-[1.8rem] border border-[#C7AC60]/20 bg-[#07111d]/25 p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(199,172,96,0.08),transparent_60%)]" />

<div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-75" />

<div className="absolute inset-0 rounded-[1.8rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(199,172,96,0.05)] pointer-events-none" />
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#C7AC60]/70 mb-3">{t('calculatedInsight')}</p>
            <p className="text-[14px] leading-7 text-white/65">
              {t('bmiDescription')}
            </p>
            <p className="mt-4 text-[2rem] font-semibold text-[#EAE4D5]">
              {bmi ?? '--'} {bmi ? 'BMI' : ''}
            </p>
          </div>

   </div>
      </aside>

      {openPanel !== null && <PanelInfoModal panelNum={openPanel} />}

    </div>

  )
}