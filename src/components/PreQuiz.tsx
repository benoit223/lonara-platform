'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface PreQuizProps {
  fullName: string
  email: string
  memberTier:
  | 'guest'
  | 'member'
  | 'premium'
  | 'executive'
  accessMode: 'guest' | 'registered'
  age: number
  sex: 'male' | 'female' | 'other'
  height: number
  weight: number
  unitSystem: 'metric' | 'imperial'
onUnitSystemChange: (
  value: 'metric' | 'imperial',
) => void
  bloodGlucose: string
  ldl: string
  hdl: string
  crp: string
  vitaminD: string
  tsh: string
  geneticRisk: string
  onBack: () => void
  onContinue: () => void
  onAgeChange: (value: number) => void
  onSexChange: (value: 'male' | 'female' | 'other') => void
  onHeightChange: (value: number) => void
  onWeightChange: (value: number) => void
  onBloodGlucoseChange: (value: string) => void
  onLdlChange: (value: string) => void
  onHdlChange: (value: string) => void
  onCrpChange: (value: string) => void
  onVitaminDChange: (value: string) => void
  onTshChange: (value: string) => void
  onGeneticRiskChange: (value: string) => void
  country: string
  socioeconomic: string
  onCountryChange: (value: string) => void
  onSocioeconomicChange: (value: string) => void
}

export default function PreQuiz({
  fullName,
  email,
  memberTier,
  accessMode,
  age,
  sex,
  height,
  weight,
unitSystem,
onUnitSystemChange,

  bloodGlucose,
  ldl,
  hdl,
  crp,
  vitaminD,
  tsh,
  geneticRisk,
  onBack,
  onContinue,
  onAgeChange,
  onSexChange,
  onHeightChange,
  onWeightChange,
  onBloodGlucoseChange,
  onLdlChange,
  onHdlChange,
  onCrpChange,
  onVitaminDChange,
  onTshChange,
  onGeneticRiskChange,
  country,
  socioeconomic,
  onCountryChange,
  onSocioeconomicChange,
}: PreQuizProps) {
  const t = useTranslations('prequiz')

  const bmi =
    height > 0 && weight > 0
      ? Number((weight / ((height / 100) ** 2)).toFixed(1))
      : null

const [feet, setFeet] = useState('')
const [inches, setInches] = useState('')
const [pounds, setPounds] = useState('')
const [validationError, setValidationError] =
  useState('')


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

      <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-[#C7AC60]/80 mb-4">
        {t('label')}
      </p>

      <h2
        className="text-[2rem] md:text-[3rem] leading-[0.95] font-medium capitalize tracking-[0.04em] text-[#EAE4D5]"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        Lonara Executive™
      </h2>

      <p className="mt-4 text-[#EAE4D5]/45 max-w-2xl leading-[1.9] text-[15px]">
       {t('subtitle')}
      </p>

    </div>

  </div>
<div className="mt-[88px]">

  <div className="rounded-[0.9rem] border border-[#C7AC60]/25 bg-[#C7AC60]/8 px-4 py-2">

    <p className="text-[11px] uppercase tracking-[0.18em] text-[#E7D19A] whitespace-nowrap">
      {t('executiveOnly')}
    </p>
</div>
  </div>
</div>
<div className="mt-5 w-full space-y-3 pr-1">

  {/* 1 */}
  <div className="rounded-[1.8rem] border border-[#035AA8]/20 bg-[#102033]/82 p-3">

    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75 mb-3">
      {t('panel1')}
    </p>

    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">

      <input
        type="text"
disabled
        placeholder="Fasting Glucose"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="HbA1c"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="LDL Cholesterol"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="HDL Cholesterol"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="Triglycerides"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="ApoB"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

    </div>
  </div>

  {/* 2 */}
  <div className="rounded-[1.8rem] border border-[#035AA8]/20 bg-[#102033]/82 p-3">

    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75 mb-3">
      {t('panel2')}
    </p>

    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">

      <input
        type="text"
disabled
        placeholder="IGF-1"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="Insulin"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="Testosterone"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="DHEA-S"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="TSH"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="Vitamin D"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="Homocysteine"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

    </div>
  </div>

  {/* 3 */}
  <div className="rounded-[1.8rem] border border-[#035AA8]/20 bg-[#102033]/82 p-3">

    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75 mb-3">
      {t('panel3')}
    </p>

    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">

      <input
        type="text"
disabled
        placeholder="hs-CRP"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="IL-6"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="TNF-alpha"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="Ferritin"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

    </div>
  </div>

  {/* 4 */}
  <div className="rounded-[1.8rem] border border-[#035AA8]/20 bg-[#102033]/82 p-3">

    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75 mb-3">
      {t('panel4')}
    </p>

    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">

      <input
        type="text"
disabled
        placeholder="Horvath Clock"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="PhenoAge"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="GrimAge"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="DunedinPACE"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

    </div>
  </div>

  {/* 5 */}
  <div className="rounded-[1.8rem] border border-[#035AA8]/20 bg-[#102033]/82 p-3">

    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75 mb-3">
      {t('panel5')}
    </p>

    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">

      <input
        type="text"
disabled
        placeholder="Telomere Length qPCR"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="Telomere Length FISH"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="Telomerase Activity"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

    </div>
  </div>

  {/* 6 */}
  <div className="rounded-[1.8rem] border border-[#035AA8]/20 bg-[#102033]/82 p-3">

    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75 mb-3">
      {t('panel6')}
    </p>

    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">

      <input
        type="text"
disabled
        placeholder="Proteomics"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="Metabolomics"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="Microbiome"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="GWAS / SNP"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

    </div>
  </div>

  {/* 7 */}
  <div className="rounded-[1.8rem] border border-[#035AA8]/20 bg-[#102033]/82 p-3">

    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75 mb-3">
      {t('panel7')}
    </p>

    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">

      <input
        type="text"
disabled
        placeholder="GFAP"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="NfL"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="Amyloid Beta 42/40"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="pTau-217"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

    </div>
  </div>

  {/* 8 */}
  <div className="rounded-[1.8rem] border border-[#035AA8]/20 bg-[#102033]/82 p-3">

    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/75 mb-3">
      {t('panel8')}
    </p>

    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">

      <input
        type="text"
disabled
        placeholder="NT-proBNP"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="Lp(a)"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="CAC Score"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

      <input
        type="text"
disabled
        placeholder="GDF-15"
        className="w-full rounded-[1rem] border border-[#035AA8]/20 bg-black/70 text-white px-3 py-2 text-[13px] placeholder:text-[#EAE4D5]/75 opacity-50 cursor-not-allowed"
      />

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
    </div>
  )
}