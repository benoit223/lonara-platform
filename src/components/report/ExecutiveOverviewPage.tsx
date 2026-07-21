'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Shield,
  Moon,
  Zap,
  Frown,
  Meh,
  Smile,
} from 'lucide-react'
import {
  SCORE_THRESHOLD_GOOD,
  SCORE_THRESHOLD_MODERATE,
  SCORE_THRESHOLD_EXCELLENT,
  SCORE_THRESHOLD_LOW,
  SCORE_THRESHOLD_COMPROMISED,
} from '@/lib/scoreThresholds'
import { supabase } from '@/lib/supabase'
import { useTranslations } from 'next-intl'

export default function ExecutiveOverviewPage({
  report,
  assessmentId,
}: any) {

  const t = useTranslations('executive')

  const [feedbackSent, setFeedbackSent] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null)

  const signalIntegrity =
    report.signalIntegrity ??
    report.scores?.signalIntegrity ??
    report.psychometric?.coherence ??
    null

  const lowIntegrity =
    signalIntegrity !== null &&
    signalIntegrity < SCORE_THRESHOLD_LOW

  // ── PILIERS — Engine A en priorité, fallback sur calcul manuel ────────────
  const activateScore = report.pillarScores?.activate ?? Math.round((
    (report.scores.performance || 0) +
    (report.scores.exercise || 0) +
    (report.scores.mobility || 0) +
    (report.scores.energy || 0) +
    (report.scores.purpose || 0)
  ) / 5)

  const balanceScore = report.pillarScores?.balance ?? Math.round((
    (report.scores.stress || 0) +
    (report.scores.sleep || 0) +
    (report.scores.social || 0) +
    (report.scores.emotional || 0) +
    (report.scores.circadian || 0)
  ) / 5)

  const protectScore = report.pillarScores?.protect ?? Math.round((
    (report.scores.inflammation || 0) +
    (report.scores.immune || 0) +
    (report.scores.cardiovascular || 0) +
    (report.scores.family || 0) +
    (report.scores.environment || 0)
  ) / 5)

  const restoreScore = report.pillarScores?.restore ?? Math.round((
    (report.scores.recovery || 0) +
    (report.scores.sleep || 0) +
    (report.scores.longevity || 0) +
    (report.scores.purpose || 0) +
    (report.scores.resilience || 0)
  ) / 5)

  // ── PROFILE VECTOR ────────────────────────────────────────────────────────
  const profileVector = report.profileVector ?? null
  const archetype = profileVector?.archetype ?? null
  const signatureCode = profileVector?.signatureCode ?? null

  // ── STRENGTHS & PATTERNS ──────────────────────────────────────────────────
  const strengths: string[] = report.strengths ?? []
  const patterns = report.patterns ?? []
  const patternNarrative = report.patternNarrative ?? null

  const unitSystem = report.user?.unitSystem || 'metric'

  const displayHeight = report.user?.height
    ? unitSystem === 'metric'
      ? `${report.user.height} cm`
      : `${Math.floor(report.user.height / 30.48)}'${Math.round((report.user.height / 2.54) % 12)}"`
    : t('notProvided')

  const displayWeight = report.user?.weight
    ? unitSystem === 'metric'
      ? `${report.user.weight} kg`
      : `${Math.round(report.user.weight * 2.20462)} lb`
    : t('notProvided')

  const handleFeedback = async (score: number) => {
    if (feedbackSent || !assessmentId) return
    const { error } = await supabase
      .from('assessments')
      .update({ feedback_score: score })
      .eq('id', assessmentId)
    if (error) { console.error(error); return }
    setFeedbackSent(true)
    setSelectedFeedback(score)
  }

  return (
    <section className="
      relative overflow-hidden rounded-[1.8rem] md:rounded-[2.7rem]
      border border-[#0E2238]/80 bg-[#02040A]/45
      backdrop-blur-3xl
      shadow-[0_0_2px_rgba(120,200,255,0.15),0_0_18px_rgba(3,90,168,0.10),0_0_60px_rgba(0,110,255,0.08),0_0_160px_rgba(0,80,255,0.04)]
    ">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(199,172,96,0.16),transparent_38%)]" />
      <div className="absolute top-[-180px] left-[-10%] w-[420px] h-[420px] rounded-full bg-[#C7AC60]/10 blur-3xl opacity-40" />
      <div className="absolute bottom-[-200px] right-[-10%] w-[360px] h-[360px] rounded-full bg-[#7FD6FF]/10 blur-3xl opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0A1724,transparent_70%)]" />
      <div className="absolute inset-0 opacity-[0.7] bg-cover bg-center mix-blend-soft-light" style={{ backgroundImage: "url('/f1.png')" }} />

      <div className="relative z-10 p-4 md:p-10">

        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row items-start justify-between mb-2 gap-4">
          <div className="flex items-center gap-5">
            <img src="/LOGOOFFICIELTRANSP.png" alt="Lonara" className="h-30 w-auto opacity-95" />
            <div>
              <p className="text-[14px] uppercase tracking-[0.35em] text-[#C7AC60]/70 mb-2">{t('summary')}</p>
              <h1 className="text-[2rem] md:text-[3rem] leading-[0.95] font-medium capitalize tracking-[0.04em] text-[#EAE4D5]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('title')}
              </h1>
            </div>
          </div>

          <div className="text-right pt-7">
            <p className="text-[14px] uppercase tracking-[0.3em] text-[#C7AC60]/60">{t('reportDate')}</p>
            <p className="text-sm text-[#EAE4D5]/90 mt-2">
              {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </p>
            <p className="text-[14px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mt-6">{t('signalIntegrity')}</p>
            <p className={`text-[18px] font-semibold tracking-[0.04em] mt-2 ${
              lowIntegrity ? 'text-[#5C96D8] drop-shadow-[0_0_12px_rgba(92,150,216,0.35)]' : 'text-[#EAE4D5]/90'
            }`}>
              {signalIntegrity != null ? `${signalIntegrity}%` : 'N/A'}
            </p>
          </div>
        </div>

        {/* CLIENT METADATA */}
        <div className="relative overflow-hidden mt-8 mb-10 rounded-[28px] border border-[#C7AC60]/10 bg-[rgba(7,17,29,0.45)] p-6 backdrop-blur-xl">
          <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] pointer-events-none" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <MetadataItem label={t('client')} value={report.user?.name || t('guest')} />
            <MetadataItem label={t('email')} value={report.user?.email || t('notProvided')} />
            <MetadataItem label={t('membership')} value={
              report.user?.memberType === 'executive' ? 'Executive™'
              : report.user?.memberType === 'premium' ? 'Premium'
              : report.user?.memberType === 'member' ? 'Member'
              : t('guest')
            } />
            <MetadataItem label={t('age')} value={report.user?.age ? `${report.user.age} ${t('years')}` : t('notProvided')} />
            <MetadataItem label={t('sex')} value={report.user?.sex || t('notSpecified')} />
            <MetadataItem label={t('height')} value={displayHeight} />
            <MetadataItem label={t('weight')} value={displayWeight} />
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT PANEL */}
          <div className="lg:col-span-3 flex flex-col gap-6">

            {/* LONGEVITY SCORE */}
            <div className="relative overflow-hidden rounded-[28px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-6 backdrop-blur-xl">
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#C7AC60]/60 mb-5">{t('longevityScore')}</p>
              <div className="flex items-end gap-2">
                <h2 className={`text-[90px] leading-none font-extralight ${
                  lowIntegrity ? 'text-[#5C96D8] drop-shadow-[0_0_18px_rgba(92,150,216,0.28)]' : 'text-[#EAE4D5]'
                }`}>
                  {Number.isFinite(report.longevityScore) ? report.longevityScore : 0}
                </h2>
                <span className="text-2xl text-[#EAE4D5]/40 mb-3">/100</span>
              </div>
              <div className="mt-6 h-[1px] bg-white/10" />
              <div className="mt-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#EAE4D5]/40">{t('populationRanking')}</p>
                <p className={`mt-2 text-[28px] font-light ${
                  lowIntegrity ? 'text-[#5C96D8] drop-shadow-[0_0_12px_rgba(92,150,216,0.25)]' : 'text-[#C7AC60]'
                }`}>
                  {t('top')} {100 - report.percentile}%
                </p>
              </div>
            </div>

            {/* BIO AGE */}
            <div className="relative overflow-hidden rounded-[28px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-6 backdrop-blur-xl">
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#C7AC60]/60">{t('biologicalAge')}</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-[58px] leading-none font-extralight text-[#EAE4D5]">
                  {report.biologicalAge != null ? report.biologicalAge : 'N/A'}
                </span>
                <span className="text-[#EAE4D5]/40 mb-2">{t('years')}</span>
              </div>
              {report.user?.age && report.biologicalAge != null ? (
                <p className={`mt-4 text-sm ${
                  report.biologicalAge < report.user.age ? 'text-[#7EE2A8]'
                  : report.biologicalAge > report.user.age ? 'text-[#FF9F43]'
                  : 'text-[#C7AC60]'
                }`}>
                  {report.biologicalAge < report.user.age
                    ? `${(report.user.age - report.biologicalAge).toFixed(1)} ${t('youngerThan')}`
                    : report.biologicalAge > report.user.age
                    ? `${(report.biologicalAge - report.user.age).toFixed(1)} ${t('olderThan')}`
                    : t('alignedAge')
                  }
                </p>
              ) : (
                <p className="mt-4 text-[#EAE4D5]/40 text-sm">{t('notProvided')}</p>
              )}
            </div>

            {/* BIOLOGICAL SIGNATURE */}
            <div className="relative overflow-hidden rounded-[28px] border border-[#C7AC60]/12 bg-gradient-to-b from-[#035AA8]/[0.08] to-transparent p-6 backdrop-blur-xl">
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-4">{t('biologicalSignature')}</p>
              {archetype ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-[22px] leading-tight font-extralight text-[#EAE4D5]">
                      {archetype.name.startsWith('archetype_') ? t(archetype.name) : archetype.name}
                    </h3>
                    {signatureCode && (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#C7AC60]/60 border border-[#C7AC60]/20 rounded-full px-2 py-1">
                        {signatureCode}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-[#EAE4D5]/60">
                    {archetype.description.startsWith('archetype_') ? t(archetype.description) : archetype.description}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-[30px] leading-tight font-extralight text-[#EAE4D5]">{report.signature?.title}</h3>
                  <p className="mt-5 text-sm leading-relaxed text-[#EAE4D5]/60">{report.narrative?.tone}</p>
                </>
              )}
              {report.dominantPillar && (
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C7AC60]" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#C7AC60]/70">
                    {t('focusPillar')}: {report.dominantPillar}
                  </p>
                </div>
              )}
            </div>

            {/* BIOLOGICAL STRENGTHS */}
            {strengths.length > 0 && (
              <div className="relative overflow-hidden rounded-[28px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-6 backdrop-blur-xl">
                <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
                <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#C7AC60]/60 mb-5">{t('biologicalStrengths')}</p>
                <div className="space-y-3">
                  {strengths.slice(0, 4).map((strength: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 rounded-[14px] border border-[#7EE2A8]/20 bg-[#7EE2A8]/[0.05] px-4 py-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7EE2A8] shadow-[0_0_8px_rgba(126,226,168,0.6)]" />
                      <p className="text-sm capitalize text-[#EAE4D5]/80">
  {t(`priority_${strength}`) !== `priority_${strength}` ? t(`priority_${strength}`) : strength}
</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* CENTER VISUAL */}
          <div className="hidden lg:flex lg:col-span-6 relative items-center justify-center">
            <div className="absolute w-[820px] h-[820px] rounded-full bg-[#C7AC60]/10 blur-[180px]" />
            <div className="absolute w-[540px] h-[540px] rounded-full border border-[#C7AC60]/6" />
            <div className="absolute w-[700px] h-[700px] rounded-full bg-[rgba(199,172,96,0.08)] blur-[140px]" />

            <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[620px] h-[620px] rounded-full border border-[#C7AC60]/20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#C7AC60] shadow-[0_0_18px_rgba(199,172,96,0.8)]" />
            </motion.div>
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[580px] h-[390px] rounded-full border border-[#C7AC60]/20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#C7AC60] shadow-[0_0_18px_rgba(199,172,96,0.8)]" />
            </motion.div>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[730px] h-[320px] rounded-full border border-[#C7AC60]/20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#C7AC60] shadow-[0_0_18px_rgba(199,172,96,0.8)]" />
            </motion.div>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[330px] h-[260px] rounded-full border border-[#C7AC60]/20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#C7AC60] shadow-[0_0_18px_rgba(199,172,96,0.8)]" />
            </motion.div>

            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-20">
              <img src="/human-glow.png" alt="" className="h-[760px] object-contain opacity-95" />
            </motion.div>

            {/* FLOATING NODES */}
            <>
              <div className="absolute top-[20%] left-[18%]">
                <Node label={t('pillarActivate')} value={
                  activateScore >= SCORE_THRESHOLD_GOOD ? t('nodeOptimal')
                  : activateScore >= SCORE_THRESHOLD_LOW ? t('nodeModerate')
                  : t('nodeDepleted')
                } />
              </div>
              <div className="absolute top-[35%] right-[12%]">
                <Node label={t('pillarBalance')} value={
                  balanceScore >= SCORE_THRESHOLD_GOOD ? t('nodeAligned')
                  : balanceScore >= SCORE_THRESHOLD_LOW ? t('nodeStressed')
                  : t('nodeOverloaded')
                } />
              </div>
              <div className="absolute bottom-[28%] left-[10%]">
                <Node label={t('pillarProtect')} value={
                  protectScore >= SCORE_THRESHOLD_GOOD ? t('nodeDefended')
                  : protectScore >= SCORE_THRESHOLD_LOW ? t('nodeModerate')
                  : t('nodeVulnerable')
                } />
              </div>
              <div className="absolute bottom-[20%] right-[18%]">
                <Node label={t('pillarRestore')} value={
                  restoreScore >= SCORE_THRESHOLD_EXCELLENT ? t('nodeOptimized')
                  : restoreScore >= SCORE_THRESHOLD_MODERATE ? t('nodeRecovering')
                  : t('nodeDepleted')
                } />
              </div>
            </>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-3 flex flex-col gap-6">

            {/* KEY INSIGHT */}
            <div className="relative overflow-hidden rounded-[28px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-6 backdrop-blur-xl">
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#C7AC60]/60 mb-5">{t('keyInsight')}</p>
              <p className="text-[15px] leading-relaxed text-[#EAE4D5]/80">
                {report.aiKeyInsight ?? patternNarrative ?? report.insights?.[0]}
              </p>
            </div>

            {/* PRIORITIES */}
            <div className="relative overflow-hidden rounded-[28px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-6 backdrop-blur-xl">
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#C7AC60]/60 mb-5">{t('primaryPriorities')}</p>
              <div className="space-y-5">
                {report.priorities?.map((priority: any, index: number) => (
                  <PriorityItem key={index} title={priority.title} impact={priority.impact} severity={priority.severity} t={t} />
                ))}
              </div>
            </div>

            {/* AI INTERPRETATION */}
            <div className="relative overflow-hidden rounded-[28px] border border-[#C7AC60]/12 bg-[rgba(7,20,38,0.78)] p-6 flex-1 backdrop-blur-xl">
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#C7AC60]/60 mb-5">{t('aiInterpretation')}</p>
              <div className="space-y-4">
                {(report.aiNarrative || report.patternNarrative) && (
                  <p className="text-sm leading-relaxed text-[#EAE4D5]/70">
                    {report.aiNarrative ?? report.patternNarrative}
                  </p>
                )}
                {report.weaknesses?.length > 0 && (
                  <p className="text-sm leading-relaxed text-[#EAE4D5]/70">
                    {t('optimizationAxes')}: {report.weaknesses.slice(0, 3).map((w: string) => t(`priority_${w}`)).join(', ')}.
                  </p>
                )}
                {report.flags?.filter((f: any) => f.severity === 'critical').map((flag: any, index: number) => (
                  <p key={index} className="text-sm leading-relaxed text-[#FF9F43]/80">⚠ {(flag.message.startsWith('flag_') || flag.message.startsWith('biomarker_flag_')) ? t(flag.message) : flag.message}</p>
                ))}
                {!report.patternNarrative && report.insights?.map((insight: string, index: number) => (
                  <p key={index} className="text-sm leading-relaxed text-[#EAE4D5]/70">{insight}</p>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* 4 PILLARS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-10">
          <PillarCard bgImage="/activate.png"
            icon={<Zap className="h-[28px] w-[28px] text-[#EAE4D5]" strokeWidth={1.35} />}
            title={t('pillarActivate')} score={activateScore} description={t('pillarActivateDesc')} />
          <PillarCard bgImage="/balance.png"
            icon={<Activity className="h-[28px] w-[28px] text-[#EAE4D5]" strokeWidth={1.35} />}
            title={t('pillarBalance')} score={balanceScore} description={t('pillarBalanceDesc')} />
          <PillarCard bgImage="/protect.png"
            icon={<Shield className="h-[28px] w-[28px] text-[#EAE4D5]" strokeWidth={1.35} />}
            title={t('pillarProtect')} score={protectScore} description={t('pillarProtectDesc')} />
          <PillarCard bgImage="/restore.png"
            icon={<Moon className="h-[28px] w-[28px] text-[#EAE4D5]" strokeWidth={1.35} />}
            title={t('pillarRestore')} score={restoreScore} description={t('pillarRestoreDesc')} />
        </div>

        {/* PATTERNS */}
        {patterns.length > 0 && (
          <div className="relative overflow-hidden mt-10 rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-10 backdrop-blur-xl">
            <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
            <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-6">{t('patternAnalysis')}</p>
            <h3 className="text-[32px] font-extralight text-[#EAE4D5] mb-10">{t('crossDomain')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {patterns.map((pattern: any, index: number) => (
                <div key={index} className={`rounded-[22px] border p-6 ${
                  pattern.severity === 'critical'
                    ? 'border-[#FF4D6D]/25 bg-[#FF4D6D]/[0.05]'
                    : pattern.severity === 'optimal'
                    ? 'border-[#7EE2A8]/25 bg-[#7EE2A8]/[0.05]'
                    : 'border-[#C7AC60]/15 bg-[#C7AC60]/[0.03]'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className={`text-[11px] uppercase tracking-[0.2em] ${
                      pattern.severity === 'critical' ? 'text-[#FF4D6D]'
                      : pattern.severity === 'optimal' ? 'text-[#7EE2A8]'
                      : 'text-[#C7AC60]'
                    }`}>
                      {pattern.pillar} — {pattern.severity}
                    </p>
                  </div>
                  <p className="text-[15px] font-light text-[#EAE4D5]/90 mb-2">
                    {pattern.id ? t(`pattern_${pattern.id}_label`) : pattern.label}
                  </p>
                  <p className="text-sm leading-relaxed text-[#EAE4D5]/55">
                    {pattern.id ? t(`pattern_${pattern.id}_desc`) : pattern.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RISK PROJECTION */}
        <div className="relative overflow-hidden mt-10 rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-10 backdrop-blur-xl">
          <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-6">{t('riskProjection')}</p>
          <h3 className="text-[32px] font-extralight text-[#EAE4D5] mb-10">{t('vulnerabilitySignals')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
   {report.flags?.map((flag: any, index: number) => (
  <div key={`flag-${index}`} className="flex items-center justify-between rounded-[22px] border bg-black/20 px-6 py-4"
    style={{
      borderColor: flag.severity === 'critical' ? 'rgba(255,77,109,0.25)' : 'rgba(255,159,67,0.25)'
    }}>
    <p className="text-[#EAE4D5]/80 text-sm">
      {(flag.message.startsWith('flag_') || flag.message.startsWith('biomarker_flag_')) ? t(flag.message) : flag.message}
    </p>
    <p className={`text-xs uppercase tracking-[0.15em] ml-4 shrink-0 ${
      flag.severity === 'critical' ? 'text-[#FF4D6D]' : 'text-[#FF9F43]'
    }`}>
      {t(`severity_${flag.severity.toLowerCase()}`)}
    </p>
  </div>
))}
</div>

          {/* RECOMMANDATION PROFESSIONNELLE */}
          {(() => {
            const score = report.longevityScore ?? 100
            const flags = report.flags ?? []
            const scores = report.scores ?? {}
            const criticalCount = flags.filter((f: any) => f.severity === 'critical').length

            const recommendations: { specialist: string; reason: string }[] = []

            if (score < 25 || criticalCount >= 4) {
              recommendations.push({ specialist: t('specGeneralist'), reason: t('specGeneralistReason') })
            }
            if ((scores.sleep ?? 100) < 25) {
              recommendations.push({ specialist: t('specSleep'), reason: t('specSleepReason') })
            }
            if ((scores.stress ?? 100) < 25 || (scores.emotional ?? 100) < 25) {
              recommendations.push({ specialist: t('specPsychologist'), reason: t('specPsychologistReason') })
            }
            if ((scores.inflammation ?? 100) < 25) {
              recommendations.push({ specialist: t('specNutritionist'), reason: t('specNutritionistReason') })
            }
            if ((scores.cardiovascular ?? 100) < 25) {
              recommendations.push({ specialist: t('specCardiologist'), reason: t('specCardiologistReason') })
            }
            if ((scores.gut ?? 100) < 25) {
              recommendations.push({ specialist: t('specGastro'), reason: t('specGastroReason') })
            }
            if ((scores.hormonal ?? 100) < 25) {
              recommendations.push({ specialist: t('specEndo'), reason: t('specEndoReason') })
            }

            if (recommendations.length === 0) return null

            return (
              <div className="mt-8 rounded-[22px] border border-[#FF4D6D]/20 bg-[#FF4D6D]/5 px-6 py-5">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#FF4D6D]/80 mb-4">
                  {t('clinicalConsultation')}
                </p>
                <p className="text-[13px] text-[#EAE4D5]/60 mb-4 leading-relaxed">
                  {t('clinicalConsultationDesc')}
                </p>
                <div className="space-y-3">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FF4D6D]/60 shrink-0" />
                      <div>
                        <p className="text-[13px] text-[#EAE4D5]/80 font-medium">{rec.specialist}</p>
                        <p className="text-[12px] text-[#EAE4D5]/45">{rec.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-[11px] text-[#EAE4D5]/35 leading-relaxed">
                  {t('clinicalDisclaimer')}
                </p>
              </div>
            )
          })()}
        </div>

        {/* FEEDBACK */}
        <div className="mt-10 ml-12 flex items-center">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#C7AC60]/70">{t('assessmentExperience')}</span>
          <div className="flex items-center gap-6 ml-6">
            <div className="h-[14px] w-px bg-[#C7AC60]/20" />
            <Frown onClick={() => handleFeedback(1)} size={22} strokeWidth={1.5}
              className={`transition-all ${feedbackSent ? 'opacity-30 cursor-default' : 'cursor-pointer text-[#EAE4D5]/45 hover:text-[#E7D19A] hover:scale-110'}`} />
            <Meh onClick={() => handleFeedback(5)} size={22} strokeWidth={1.5}
              className={`transition-all ${feedbackSent ? 'opacity-30 cursor-default' : 'cursor-pointer text-[#EAE4D5]/45 hover:text-[#E7D19A] hover:scale-110'}`} />
            <Smile onClick={() => handleFeedback(10)} size={22} strokeWidth={1.5}
              className={`transition-all ${feedbackSent ? 'opacity-30 cursor-default' : 'cursor-pointer text-[#EAE4D5]/45 hover:text-[#E7D19A] hover:scale-110'}`} />
          </div>
          {feedbackSent && (
            <span className="ml-8 text-[11px] uppercase tracking-[0.18em] text-[#C7AC60]/70">{t('thankYou')}</span>
          )}
        </div>

      </div>

      <div className="absolute top-4 right-4 z-30">
        <p className="text-[11px] tracking-[0.25em] uppercase text-[#EAE4D5]/25">{t('page')}</p>
      </div>
    </section>
  )
}

// ── COMPOSANTS ──────────────────────────────────────────────────────────────

function PillarCard({ bgImage, icon, title, score, description }: any) {
  const scoreColor =
    score >= SCORE_THRESHOLD_EXCELLENT ? 'text-[#E7D19A]'
    : score >= SCORE_THRESHOLD_MODERATE ? 'text-[#C7AC60]'
    : score >= SCORE_THRESHOLD_COMPROMISED ? 'text-[#FF9F43]'
    : 'text-[#FF4D6D]'

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.45)] p-6 backdrop-blur-xl text-center">
      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url('${bgImage}')` }} />
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.28)]" />
      <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />
      <div className="relative z-10">
        <div className="mx-auto flex items-center justify-center text-[#EAE4D5]">{icon}</div>
        <h4 className="mt-6 text-[24px] font-light text-[#EAE4D5]">{title}</h4>
        <div className="mt-4 flex items-end justify-center gap-2">
          <span className={`text-[44px] leading-none font-extralight ${scoreColor}`}>
            {Number.isFinite(score) ? score : 0}
          </span>
          <span className="text-[#EAE4D5]/40 mb-1">/100</span>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-[#EAE4D5]/50">{description}</p>
      </div>
    </div>
  )
}

function PriorityItem({ title, impact, severity, t }: any) {
  const severityStyles: Record<string, string> = {
    critical: 'border-[#FF4D6D]/35 bg-[#FF4D6D]/[0.10] text-[#FF4D6D] shadow-[0_0_25px_rgba(255,77,109,0.15)]',
    moderate: 'border-[#FF9F43]/35 bg-[#FF9F43]/[0.10] text-[#FF9F43] shadow-[0_0_25px_rgba(255,159,67,0.12)]',
    low:      'border-[#E7D19A]/20 bg-[#C7AC60]/[0.06] text-[#E7D19A] shadow-[0_0_20px_rgba(199,172,96,0.10)]',
  }

  let displayTitle = title
  if (title.startsWith('priority_') || title.startsWith('flag_')) {
    displayTitle = t(title)
  } else if (title.startsWith('condition_flag::')) {
    const [, conditionLabel, familyFlag] = title.split('::')
    displayTitle = familyFlag === 'family'
      ? t('conditionPredispositionFamily', { condition: conditionLabel })
      : t('conditionPredisposition', { condition: conditionLabel })
  }

  return (
   <div className={`flex items-center justify-between rounded-[18px] border px-4 py-4 ${severityStyles[severity] ?? severityStyles.low}`}>
  <p className="text-sm text-[#EAE4D5]/85 flex-1 pr-4">
    {displayTitle}
  </p>
  <span className="text-[11px] tracking-[0.2em] uppercase text-right shrink-0 w-[120px]">{t(impact)}</span>
</div>
  )
}
function MetadataItem({ label, value }: any) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-[0.22em] text-[#EAE4D5]/35 mb-3">{label}</p>
      <p className="text-sm text-[#EAE4D5]/85 truncate">{value}</p>
    </div>
  )
}

function Node({ label, value }: any) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-3 h-3 rounded-full bg-[#C7AC60] shadow-[0_0_18px_rgba(199,172,96,0.8)]" />
      <div className="mt-3 rounded-full border border-[#C7AC60]/12 bg-black/40 px-4 py-2 backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#EAE4D5]/40 text-center">{label}</p>
        <p className="mt-1 text-xs text-[#C7AC60] text-center">{value}</p>
      </div>
    </div>
  )
}