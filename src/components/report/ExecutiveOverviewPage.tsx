'use client'

import { motion } from 'framer-motion'
import {
  Activity,
  Shield,
  Moon,
  Zap,
} from 'lucide-react'

export default function ExecutiveOverviewPage({ report }: any) {
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

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(3,90,168,0.16),transparent_38%)]" />

      <div className="absolute top-[-180px] left-[-10%] w-[420px] h-[420px] rounded-full bg-[#035AA8]/12 blur-3xl opacity-40" />

      <div className="absolute bottom-[-200px] right-[-10%] w-[360px] h-[360px] rounded-full bg-[#7FD6FF]/10 blur-3xl opacity-40" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0A1724,transparent_70%)]" />

{/* EXECUTIVE BACKGROUND IMAGE */}
<div
  className="absolute inset-0 opacity-[0.7] bg-cover bg-center mix-blend-soft-light"
  style={{
    backgroundImage: "url('/f1.png')",
  }}
/>

      {/* NOISE */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />

      <div className="relative z-10 p-10">

{/* TOP BAR */}

<div className="flex items-start justify-between mb-2">

  {/* LEFT */}

  <div className="flex items-center gap-5">

    <img
      src="/LOGOOFFICIELTRANSP.png"
      alt="Lonara"
      className="h-30 w-auto opacity-95"
    />

    <div>

      <p className="text-[11px] uppercase tracking-[0.35em] text-[#C7AC60]/70 mb-2">
        Summary
      </p>

      <h1   className="text-[3rem] leading-[0.95] font-medium capitalize tracking-[0.04em] text-[#EAE4D5]"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>        
        Executive Longevity Dossier
      </h1>

    </div>

  </div>

  {/* RIGHT */}

  <div className="text-right pt-7">

    <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">
      Report Date
    </p>

    <p className="text-sm text-[#EAE4D5]/90 mt-2">
      {new Date().toLocaleDateString()}
    </p>

    <p className="text-xs text-[#EAE4D5]/40 mt-1">
      {new Date().toLocaleTimeString()}
    </p>

  </div>

</div>

{/* CLIENT METADATA */}

<div className="relative overflow-hidden mt-8 mb-10 rounded-[28px] border border-[#C7AC60]/10 bg-[rgba(7,17,29,0.45)] p-6 backdrop-blur-xl">

  {/* TOP LIGHT */}
  <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
  {/* INNER GLOW */}
  <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] pointer-events-none" />

  <div className="grid grid-cols-6 gap-6">

    <MetadataItem
      label="Client"
      value={report.user?.name || 'Tom Reeves'}
    />

    <MetadataItem
      label="Email"
      value={report.user?.email || 'Tom@lonaralabs.com'}
    />

    <MetadataItem
      label="Age"
      value={`${report.user?.age || 42} years`}
    />

    <MetadataItem
      label="Sex"
      value={report.user?.sex || 'Male'}
    />

    <MetadataItem
      label="Height"
      value={report.user?.height || '182 cm'}
    />

    <MetadataItem
      label="Weight"
      value={report.user?.weight || '78 kg'}
    />

  </div>

</div>


        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-8 min-h-[700px]">

          {/* LEFT PANEL */}
          <div className="col-span-3 flex flex-col justify-between">

            <div className="space-y-6">

              {/* LONGEVITY SCORE */}
              <div className="relative overflow-hidden rounded-[28px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-6 backdrop-blur-xl">

                {/* TOP LIGHT */}
                <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
                {/* INNER GLOW */}
                <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

                <p className="text-[11px] uppercase tracking-[0.25em] text-[#C7AC60]/60 mb-5">
                  Longevity Score
                </p>

                <div className="flex items-end gap-2">

                  <h2 className="text-[90px] leading-none font-extralight text-[#EAE4D5]">
                    {Number.isFinite(report.longevityScore)
  ? report.longevityScore
  : 0}
                  </h2>

                  <span className="text-2xl text-[#EAE4D5]/40 mb-3">
                    /100
                  </span>

                </div>

                <div className="mt-6 h-[1px] bg-white/10" />

                <div className="mt-5">

                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#EAE4D5]/40">
                    Population Ranking
                  </p>

                  <p className="mt-2 text-[28px] font-light text-[#C7AC60]">
                    Top {100 - report.percentile}%
                  </p>

                </div>

              </div>

              {/* BIO AGE */}
              <div className="relative overflow-hidden rounded-[28px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-6 backdrop-blur-xl">

                {/* TOP LIGHT */}
                <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
                {/* INNER GLOW */}
                <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

                <p className="text-[11px] uppercase tracking-[0.25em] text-[#C7AC60]/60">
                  Biological Age
                </p>

                <div className="mt-5 flex items-end gap-2">

                  <span className="text-[58px] leading-none font-extralight text-[#EAE4D5]">
                    {Number.isFinite(report.biologicalAge)
  ? report.biologicalAge
  : 0}
                  </span>

                  <span className="text-[#EAE4D5]/40 mb-2">
                    years
                  </span>

                </div>

                <p className="mt-4 text-[#C7AC60] text-sm">
                  {(
  report.user.age -
  report.biologicalAge
).toFixed(1)} years younger
                </p>

                <p className="mt-2 text-[#EAE4D5]/40 text-xs">
                  vs chronological age
                </p>

              </div>

            </div>

            {/* SIGNATURE */}
            <div className="relative overflow-hidden rounded-[28px] border border-[#C7AC60]/12 bg-gradient-to-b from-[#035AA8]/[0.08] to-transparent p-6 backdrop-blur-xl">

              {/* TOP LIGHT */}
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              {/* INNER GLOW */}
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-4">
                Biological Signature
              </p>

              <h3 className="text-[30px] leading-tight font-extralight text-[#EAE4D5]">
                {report.signature.title}
              </h3>

              <p className="mt-5 text-sm leading-relaxed text-[#EAE4D5]/60">
                {report.narrative.tone}
              </p>

            </div>

          </div>

          {/* CENTER VISUAL */}
          <div className="col-span-6 relative flex items-center justify-center">

            {/* CENTER GLOW */}
            <div className="absolute w-[820px] h-[820px] rounded-full bg-[#7FD6FF]/10 blur-[180px]" />

            <div className="absolute w-[540px] h-[540px] rounded-full border border-[#035AA8]/10" />

            <div className="absolute w-[700px] h-[700px] rounded-full bg-[rgba(199,172,96,0.08)] blur-[140px]" />

            {/* ORBITAL RINGS */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute w-[620px] h-[620px] rounded-full border border-[#7FD6FF]/20"
            />

            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute w-[480px] h-[480px] rounded-full border border-[#7FD6FF]/20"
            />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 90,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute w-[760px] h-[320px] rounded-full border border-[#7FD6FF]/20"
            />

            {/* HUMAN */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative z-20"
            >

              <img
                src="/human-glow.png"
                alt=""
                className="h-[760px] object-contain opacity-95"
              />

            </motion.div>

            {/* FLOATING NODES */}
            <>

              <div className="absolute top-[20%] left-[18%]">
                <Node
                  label="Recovery"
                  value={
                    Number.isFinite(report.scores.recovery) &&
report.scores.recovery >= 80
                      ? 'Optimal'
                      : report.scores.recovery >= 65
                      ? 'Stable'
                      : 'Compromised'
                  }
                />
              </div>

              <div className="absolute top-[35%] right-[12%]">
                <Node
                  label="Stress"
                  value={
                    Number.isFinite(report.scores.stress) &&
report.scores.stress >= 80                      ? 'Balanced'
                      : report.scores.stress >= 65
                      ? 'Moderate'
                      : 'Elevated'
                  }
                />
              </div>

              <div className="absolute bottom-[28%] left-[10%]">
                <Node
                  label="Cognition"
                  value={
                    Number.isFinite(report.scores.cognition) &&
report.scores.cognition >= 80                      ? 'Strong'
                      : report.scores.cognition >= 65
                      ? 'Stable'
                      : 'Fatigued'
                  }
                />
              </div>

              <div className="absolute bottom-[20%] right-[18%]">
                <Node
                  label="Longevity"
                  value={
                    Number.isFinite(report.scores.longevity) &&
report.scores.longevity >= 85                      ? 'Optimized'
                      : report.scores.longevity >= 70
                      ? 'Favorable'
                      : 'At Risk'
                  }
                />
              </div>

            </>

          </div>

          {/* RIGHT PANEL */}
          <div className="col-span-3 flex flex-col gap-6">

            {/* KEY INSIGHT */}
            <div className="relative overflow-hidden rounded-[28px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-6 backdrop-blur-xl">

              {/* TOP LIGHT */}
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              {/* INNER GLOW */}
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

              <p className="text-[11px] uppercase tracking-[0.25em] text-[#C7AC60]/60 mb-5">
                Key Insight
              </p>

              <p className="text-[15px] leading-relaxed text-[#EAE4D5]/80">
                {report.insights?.[0]}
              </p>

            </div>

            {/* PRIORITIES */}
            <div className="relative overflow-hidden rounded-[28px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-6 backdrop-blur-xl">

              {/* TOP LIGHT */}
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              {/* INNER GLOW */}
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

              <p className="text-[11px] uppercase tracking-[0.25em] text-[#C7AC60]/60 mb-5">
                Primary Priorities
              </p>

              <div className="space-y-5">

                {report.priorities?.map(
                  (
                    priority: any,
                    index: number,
                  ) => (
                    <PriorityItem
                      key={index}
                      title={priority.title}
                      impact={priority.impact}
                      severity={priority.severity}
                    />
                  ),
                )}

              </div>

            </div>

            {/* AI INTERPRETATION */}
            <div className="relative overflow-hidden rounded-[28px] border border-[#C7AC60]/12 bg-[rgba(7,20,38,0.78)] p-6 flex-1 backdrop-blur-xl">

              {/* TOP LIGHT */}
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              {/* INNER GLOW */}
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

              <p className="text-[11px] uppercase tracking-[0.25em] text-[#C7AC60]/60 mb-5">
                AI Interpretation
              </p>

              <div className="space-y-4">

                {report.insights?.map(
                  (
                    insight: string,
                    index: number,
                  ) => (
                    <p
                      key={index}
                      className="text-sm leading-relaxed text-[#EAE4D5]/70"
                    >
                      {insight}
                    </p>
                  ),
                )}

              </div>

            </div>

          </div>

        </div>

        {/* 4 PILLARS */}
        <div className="grid grid-cols-4 gap-6 mt-10">

          <PillarCard
            icon={<Zap size={22} />}
            title="Activate"
            score={report.scores.performance}
            description="Energy, cognition and metabolic activation."
          />

          <PillarCard
            icon={<Activity size={22} />}
            title="Balance"
            score={report.scores.stress}
            description="Autonomic stability and stress regulation."
          />

          <PillarCard
            icon={<Shield size={22} />}
            title="Protect"
            score={report.scores.inflammation}
            description="Inflammation and oxidative defense."
          />

          <PillarCard
            icon={<Moon size={22} />}
            title="Restore"
            score={report.scores.recovery}
            description="Recovery depth and regenerative quality."
          />

        </div>

      

      {/* RISK PROJECTION */}
      <div className="relative overflow-hidden mt-10 rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-10 backdrop-blur-xl">

        {/* TOP LIGHT */}
        <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
        {/* INNER GLOW */}
        <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

        <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-6">
          Biological Risk Projection
        </p>

        <h3 className="text-[32px] font-extralight text-[#EAE4D5] mb-10">
          Adaptive Vulnerability Signals
        </h3>

        <div className="space-y-5">

          {report.risks?.map(
            (
              risk: any,
              index: number,
            ) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-[22px] border border-[#C7AC60]/12 bg-black/20 px-6 py-5"
              >

                <p className="text-[#EAE4D5]/80">
                  {risk.label}
                </p>

                <p className="text-sm text-amber-300">
                  {risk.severity}
                </p>

              </div>
            ),
          )}

        </div>

      </div>

      </div>
<div className="absolute top-10 right-10 z-30">

  <p className="text-[11px] tracking-[0.25em] uppercase text-[#EAE4D5]/25">
    Page 1 of 3
  </p>

</div>
    </section>
  )
}

function PillarCard({
  icon,
  title,
  score,
  description,
}: any) {

  const scoreColor =
    score >= 85
      ? 'text-[#C7AC60]'
      : score >= 70
      ? 'text-[#C7AC60]'
      : score >= 55
      ? 'text-amber-300'
      : 'text-red-300'

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-6 backdrop-blur-xl">

      {/* TOP LIGHT */}
      <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
      {/* INNER GLOW */}
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

      <div className="w-12 h-12 rounded-full bg-[rgba(199,172,96,0.08)] border border-[#C7AC60]/12 flex items-center justify-center text-[#C7AC60]">
        {icon}
      </div>

      <h4 className="mt-6 text-[24px] font-light text-[#EAE4D5]">
        {title}
      </h4>

      <div className="mt-4 flex items-end gap-2">

        <span className={`text-[44px] leading-none font-extralight ${scoreColor}`}>
          {Number.isFinite(score) ? score : 0}
        </span>

        <span className="text-[#EAE4D5]/40 mb-1">
          /100
        </span>

      </div>

      <p className="mt-5 text-sm leading-relaxed text-[#EAE4D5]/50">
        {description}
      </p>

    </div>
  )
}

function PriorityItem({
  title,
  impact,
  severity,
}: any) {

  const severityStyles: Record<
    string,
    string
  > = {
    critical:
      'border-red-500/20 bg-red-500/[0.05] text-red-300',

    moderate:
      'border-amber-500/20 bg-amber-500/[0.05] text-amber-300',

    low:
      'border-[#C7AC60]/12 bg-[#035AA8]/[0.05] text-[#C7AC60]',
  }

  return (
    <div
      className={`
        flex items-center justify-between
        rounded-[18px]
        border
        px-4 py-4
        ${severityStyles[severity]}
      `}
    >

      <p className="text-sm text-[#EAE4D5]/85">
        {title}
      </p>

      <span className="text-[11px] tracking-[0.2em] uppercase">
        {impact}
      </span>

    </div>
  )
}

function MetadataItem({
  label,
  value,
}: any) {

  return (

    <div>

      <p className="text-[10px] uppercase tracking-[0.22em] text-[#EAE4D5]/35 mb-3">
        {label}
      </p>

      <p className="text-sm text-[#EAE4D5]/85">
        {value}
      </p>

    </div>

  )
}

function Node({
  label,
  value,
}: any) {
  return (
    <div className="flex flex-col items-center">

      <div className="w-3 h-3 rounded-full bg-[#C7AC60] shadow-[0_0_20px_rgba(3,90,168,0.45)]" />

      <div className="mt-3 rounded-full border border-[#C7AC60]/12 bg-black/40 px-4 py-2 backdrop-blur-xl">

        <p className="text-[10px] uppercase tracking-[0.2em] text-[#EAE4D5]/40 text-center">
          {label}
        </p>

        <p className="mt-1 text-xs text-[#C7AC60] text-center">
          {value}
        </p>

      </div>

    </div>
  )
}
