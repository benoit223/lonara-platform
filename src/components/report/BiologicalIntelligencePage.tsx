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

export default function BiologicalIntelligencePage({
  report,
}: any) {

  const scores = report.scores

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

      <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />

      <div className="relative z-10 p-10">


{/* EXECUTIVE BACKGROUND IMAGE */}
<div
  className="absolute inset-0 opacity-[0.3] bg-cover bg-center mix-blend-soft-light"
  style={{
    backgroundImage: "url('/f2.png')",
  }}
/>

        {/* HEADER */}
         <div className="flex items-center gap-5">

  <img
    src="/LOGOOFFICIELTRANSP.png"
    alt="Lonara"
    className="h-30 w-auto opacity-95"
  />

  <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#C7AC60]/70 mb-2">
              Biological Intelligence
            </p>

           <h2   className="text-[3rem] leading-[0.95] font-medium capitalize tracking-[0.04em] text-[#EAE4D5]"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
              Systemic Analysis
            </h2>

          </div>

          <div className="max-w-[460px] text-right ml-auto">

            <p className="text-sm leading-relaxed text-[#EAE4D5]/50">
              Multi-system biological interpretation based on
              recovery dynamics, stress modulation,
              inflammatory load, and adaptive resilience.
            </p>

          </div>

        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-8">

          {/* LEFT */}
          <div className="col-span-7 space-y-8">

            {/* RADAR BLOCK */}
            <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-8 h-[520px] backdrop-blur-xl">

              {/* TOP LIGHT */}
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              {/* INNER GLOW */}
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.05)] pointer-events-none" />

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">
                    Biological Mapping
                  </p>

                  <h3 className="mt-3 text-[32px] font-extralight text-[#EAE4D5]">
                    Resilience Architecture
                  </h3>

                </div>

                <div className="text-right">

                  <p className="text-[#EAE4D5]/40 text-xs">
                    System Stability
                  </p>

                  <p className="mt-2 text-[28px] font-light text-[#C7AC60]">
                    {report.scores.longevity >= 80
  ? 'Stable'
  : report.scores.longevity >= 65
  ? 'Adaptive'
  : 'Compromised'}
                  </p>

                </div>

              </div>

              {/* RADAR */}
              <div className="absolute inset-0 flex items-center justify-center">

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 80,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="relative w-[340px] h-[340px]"
                >

                  {/* circles */}
                  <div className="absolute inset-0 rounded-full border border-[#7FD6FF]/14" />

                  <div className="absolute inset-[40px] rounded-full border border-[#7FD6FF]/14" />

                  <div className="absolute inset-[80px] rounded-full border border-[#7FD6FF]/14" />

                  <div className="absolute inset-[120px] rounded-full border border-[#7FD6FF]/14" />

                  {/* glow */}
                  <div className="absolute inset-[95px] rounded-full bg-[rgba(199,172,96,0.08)] blur-[60px]" />

                  {/* center */}
                  <div className="absolute inset-[145px] rounded-full bg-[#C7AC60]/80 shadow-[0_0_25px_rgba(199,172,96,0.45)]" />

                  {/* polygon */}
                  <div className="absolute top-[70px] left-[70px] w-[200px] h-[200px] rotate-12 border border-[#035AA8]/30 bg-[rgba(199,172,96,0.08)] backdrop-blur-sm clip-polygon" />

                </motion.div>

              </div>

            </div>

            {/* AI CORRELATIONS */}
            <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-8 backdrop-blur-xl">

              {/* TOP LIGHT */}
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              {/* INNER GLOW */}
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.05)] pointer-events-none" />

              <div className="flex items-center justify-between mb-8">

                <div>

                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">
                    AI Correlation Engine
                  </p>

                  <h3 className="mt-3 text-[30px] font-extralight text-[#EAE4D5]">
                    Biological Interactions
                  </h3>

                </div>

              </div>

              <div className="space-y-5">

                {report.correlations?.map(
                  (
                    correlation: any,
                    index: number,
                  ) => (
                    <InsightBlock
                      key={index}
                      title={correlation.title}
                      text={correlation.text}
                    />
                  ),
                )}

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="col-span-5 space-y-6">

            {/* SYSTEMS */}
            <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-7 backdrop-blur-xl">

              {/* TOP LIGHT */}
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              {/* INNER GLOW */}
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.05)] pointer-events-none" />

              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">
                Proprietary Systems
              </p>

              <h3 className="mt-3 text-[30px] font-extralight text-[#EAE4D5] mb-8">
                Intelligence Engines
              </h3>

              <div className="space-y-4">

                <SystemCard
                  icon={<Brain size={20} />}
                  title="Neural Recovery Index™"
                  score={scores.recovery}
                />

                <SystemCard
                  icon={<HeartPulse size={20} />}
                  title="Adaptive Stress Compensation™"
                  score={scores.stress}
                />

                <SystemCard
                  icon={<Moon size={20} />}
                  title="Circadian Stability Matrix™"
                  score={scores.sleep}
                />

                <SystemCard
                  icon={<Shield size={20} />}
                  title="Inflammatory Protection™"
                  score={scores.inflammation}
                />

                <SystemCard
                  icon={<Waves size={20} />}
                  title="Mitochondrial Efficiency™"
                  score={scores.longevity}
                />

              </div>

            </div>

            {/* TELEMETRY */}
            <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-7 backdrop-blur-xl">

              {/* TOP LIGHT */}
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              {/* INNER GLOW */}
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.05)] pointer-events-none" />

              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">
                Biological Telemetry
              </p>

              <h3 className="mt-3 text-[30px] font-extralight text-[#EAE4D5] mb-8">
                System Metrics
              </h3>

              <div className="space-y-5">

                <MetricRow
                  label="Recovery Reserve"
                  value={recoveryStatus.label}
                />

                <MetricRow
                  label="Stress Load"
                  value={stressStatus.label}
                />

                <MetricRow
                  label="Sleep Efficiency"
                  value={sleepStatus.label}
                />

                <MetricRow
                  label="Inflammatory Burden"
                  value={
  scores.inflammation >= 80
    ? 'Low'
    : scores.inflammation >= 65
    ? 'Moderate'
    : 'Elevated'
}
                />

                <MetricRow
                  label="Cognitive Stability"
               value={
  scores.cognition >= 80
    ? 'High'
    : scores.cognition >= 65
    ? 'Moderate'
    : 'Compromised'
}
                />

              </div>

            </div>

            {/* TRAJECTORY */}
            <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-7 backdrop-blur-xl">

              {/* TOP LIGHT */}
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              {/* INNER GLOW */}
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.05)] pointer-events-none" />

              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">
                Longevity Trajectory
              </p>

              <h3 className="mt-3 text-[28px] font-extralight text-[#EAE4D5]">
                {report.trajectory.trajectory}
              </h3>

              <p className="mt-5 text-sm leading-relaxed text-[#EAE4D5]/60">
                Projected optimization potential:
                {` ${report.trajectory.optimizedGain}`}
                {' '}with sustained biological recovery,
                stress regulation,
                and longevity-focused adaptation.
              </p>

              <div className="mt-8 flex items-center justify-between">

                <div>

                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#EAE4D5]/40">
                    Longevity Risk
                  </p>

                  <p className="mt-2 text-lg text-[#C7AC60]">
                    {report.trajectory.risk}
                  </p>

                </div>

                <div>

                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#EAE4D5]/40">
                    Projection
                  </p>

                  <p className="mt-2 text-lg text-[#C7AC60]">
                    {report.trajectory.optimizedGain}
                  </p>

                </div>

              </div>

              <div className="mt-8 h-[100px] rounded-[24px] border border-[#C7AC60]/12 bg-black/20 flex items-center justify-center">

                <Activity
                  className="text-[#C7AC60]/40"
                  size={38}
                />

              </div>

            </div>

          </div>

        </div>

        {/* BIOMARKERS */}
        <div className="relative overflow-hidden mt-6 rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-8 backdrop-blur-xl">

          {/* TOP LIGHT */}
          <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
          {/* INNER GLOW */}
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.05)] pointer-events-none" />

          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-6">
            Biomarker Intelligence
          </p>

          <h3 className="text-[32px] font-extralight text-[#EAE4D5] mb-8">
            Advanced Biological Signals
          </h3>

          <div className="space-y-4">

            {report.biomarkers?.map(
              (
                marker: any,
                index: number,
              ) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-[22px] border border-[#C7AC60]/12 bg-black/20 px-6 py-5"
                >

                  <div>

                    <p className="text-[#EAE4D5]/90">
                      {marker.label}
                    </p>

                    <p className="mt-2 text-xs text-[#C7AC60]">
                      {marker.category}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-sm text-[#C7AC60]">
                      {marker.status}
                    </p>

                    <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#EAE4D5]/40">
                      {marker.impact} Impact
                    </p>

                  </div>

                </div>
              ),
            )}

          </div>

        </div>

      </div>
<div className="absolute top-10 right-10 z-30">

  <p className="text-[11px] tracking-[0.25em] uppercase text-[#EAE4D5]/25">
    Page 2 of 3
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
      ? 'text-[#C7AC60]'
      : score >= 70
      ? 'text-[#C7AC60]'
      : score >= 55
      ? 'text-amber-300'
      : 'text-red-300'

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