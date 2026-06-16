'use client'
import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import ExecutiveOverviewPage from '@/components/report/ExecutiveOverviewPage'
import BiologicalIntelligencePage from '@/components/report/BiologicalIntelligencePage'
import OptimizationProtocolPage from '@/components/report/OptimizationProtocolPage'
import { supabase } from '../lib/supabase'
// ── NOUVEAU : import du moteur V2 ──────────────────────────────────────────
import { calculateScoresV2 } from '@/lib/scoring/engineA'
import { questions } from '../data/questions'
// ──────────────────────────────────────────────────────────────────────────

import { generateAINarrative } from '@/lib/report/generateAINarrative'
import { useTranslations } from 'next-intl'

type ResultsProps = {
  scores: Record<string, number>
  protocols: any[]
  fullName: string
  email: string
  memberTier:
    | 'guest'
    | 'member'
    | 'premium'
    | 'executive'
  age: number
  sex: string
  height: number
  weight: number
  unitSystem: 'metric' | 'imperial'
  completionTime: number
  psychometricProfile: any
  accessMode: 'guest' | 'registered'
  assessmentId: string | null
// ── NOUVEAU : responses brutes transmises depuis Quiz.tsx ──
responses: Record<string, number>
// ──────────────────────────────────────────────────────────
biomarkers?: Record<string, string>
country?: string
socioeconomic?: string
  onRestart: () => void
  onMySpace?: () => void 
}

export default function Results({
  scores,
  protocols,
  fullName,
  email,
  memberTier,
  age,
  sex,
  height,
  weight,
  unitSystem,
  country,
socioeconomic,
  completionTime,
  psychometricProfile,
 accessMode,
assessmentId,
responses,       // ── NOUVEAU
biomarkers = {},
onRestart,
onMySpace,
}: ResultsProps) {
const locale = useLocale()
  const t = useTranslations('results')
  const [report, setReport] = useState<any>(null)

  useEffect(() => {

    async function generateReport() {

      // ── NOUVEAU : calcul Engine A en parallèle ─────────────────────────
   const bmi = height > 0 && weight > 0
  ? Number((weight / Math.pow(height / 100, 2)).toFixed(1))
  : 22

const engineAResult = calculateScoresV2(
  responses && typeof responses === 'object' ? responses : {},
  Array.isArray(questions) ? questions : [],
  age,
  sex,
  bmi,
  psychometricProfile ?? undefined,
)
      // ──────────────────────────────────────────────────────────────────

      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores,
          protocols,
          fullName,
          email,
          age,
          sex,
          height,
          weight,
          unitSystem,
          memberType: memberTier,
          accessMode,
          completionTime,
          psychometric: psychometricProfile,
          country:       country ?? '',
          socioeconomic: socioeconomic ?? '',
          locale,
// ── Biomarqueurs scientifiques ─────────────────────────────────
biomarkers,
// ── NOUVEAU : données enrichies transmises à l'API ─────────────
engineA: {
            pillarScores:     engineAResult.pillarScores,
            longevityScore:   engineAResult.longevityScore,
            biologicalAge:    engineAResult.biologicalAge,
            percentile:       engineAResult.percentile,
            strengths:        engineAResult.strengths,
            weaknesses:       engineAResult.weaknesses,
            flags:            engineAResult.flags,
            profileSummary:   engineAResult.profileSummary,
            patterns:         engineAResult.patterns,
            dominantPillar:   engineAResult.dominantPillar,
            patternNarrative: engineAResult.patternNarrative,
            profileVector:    engineAResult.profileVector,
          },
          // ──────────────────────────────────────────────────────────────
        }),
      })

      const data = await response.json()

      
      setReport(data)



// Sauvegarder les scores calculés dans assessments
if (assessmentId && data) {
  await supabase
  .from('assessments')
  .update({
    biological_age:  data.biologicalAge,
    longevity_score: data.longevityScore,
    recovery_index:  data.scores?.recovery ?? null,
    stress_load:     data.scores?.stress ?? null,
    pillar_activate: data.pillarScores?.activate ?? null,
    pillar_balance:  data.pillarScores?.balance  ?? null,
    pillar_protect:  data.pillarScores?.protect  ?? null,
    pillar_restore:  data.pillarScores?.restore  ?? null,
  })
  .eq('id', assessmentId)
    
}

    }

    generateReport()

  }, [])

 if (!report) return (
  <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#040B14] text-white">
    <div className="relative flex flex-col items-center gap-8">
      
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[#035AA8]/15 blur-[80px]" />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        <img src="/LOGOOFFICIELTRANSP.png" alt="Lonara" className="h-16 w-auto opacity-80" />
        
        <p className="text-[11px] uppercase tracking-[0.38em] text-[#C7AC60]/70">
          {t('analyzing')}
        </p>
        <h2 className="text-[2.2rem] font-extralight text-[#EAE4D5]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {t('generating')}
        </h2>
        <p className="text-[14px] text-[#EAE4D5]/40 max-w-[400px] text-center leading-relaxed">
          {t('processing')}
        </p>

        <div className="flex gap-3 mt-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#C7AC60]/60 animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
)

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-[#040B14] text-white">

      <div className="w-full max-w-[1800px] mx-auto px-6 py-10 space-y-10">

        <ExecutiveOverviewPage
          report={report}
          assessmentId={assessmentId}
        />

        {(memberTier === 'premium' || memberTier === 'executive') ? (

          <BiologicalIntelligencePage report={report} />

        ) : (

          <div className="relative overflow-hidden rounded-[2.7rem] border border-[#C7AC60]/12 bg-[#02040A]/45 py-28 px-20 text-center">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(199,172,96,0.08),transparent_70%)]" />

            <div className="relative z-10">

              <p className="text-[11px] uppercase tracking-[0.35em] text-[#C7AC60]/60">
                {t('executiveLabel')}
              </p>

              <h2
                className="mt-5 text-[3.2rem] leading-none text-[#EAE4D5]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {t('executiveTitle')}
              </h2>

              <p className="mt-8 max-w-3xl mx-auto text-[#EAE4D5]/60 leading-[2]">
                {t('executiveDescription')}
              </p>

              <div className="mt-10 inline-flex rounded-full border border-[#C7AC60]/20 bg-[#C7AC60]/8 px-6 py-3">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#E7D19A]">
                  {t('executiveBadge')}
                </span>
              </div>

            </div>

          </div>

        )}

        <OptimizationProtocolPage report={{ ...report, assessmentId }} onMySpace={onMySpace} />

      </div>

    </div>
  )
}