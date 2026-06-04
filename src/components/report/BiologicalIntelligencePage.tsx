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
            <p className="text-[14px] uppercase tracking-[0.35em] text-[#C7AC60]/70 mb-2">
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
{/* QUANTUM BIOLOGICAL MAPPING */}
<div className="absolute inset-0 flex items-center justify-center overflow-hidden">

  {/* ATMOSPHERIC DEPTH */}
  <div className="absolute w-[920px] h-[920px] rounded-full bg-[rgba(231,209,154,0.05)] blur-[180px]" />

  <div className="absolute w-[620px] h-[620px] rounded-full bg-[rgba(231,209,154,0.08)] blur-[120px]" />

  {/* MAIN ENGINE */}
  <motion.div
    animate={{
      rotateX: [0, 5, 0],
      rotateY: [0, -5, 0],
    }}
    transition={{
      duration: 24,
      repeat: Infinity,
      ease: [0.65, 0, 0.35, 1],
    }}
    style={{
      transformStyle: 'preserve-3d',
      perspective: '2400px',
    }}
    className="relative w-[560px] h-[560px]"
  >

    {/* CORE GLOW */}
    <motion.div
      animate={{
        opacity: [0.22, 0.42, 0.22],
        scale: [1, 1.015, 1],
      }}
      transition={{
        duration: 14,
        repeat: Infinity,
        ease: [0.65, 0, 0.35, 1],
      }}
      className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,225,160,0.28),rgba(231,209,154,0.08)_42%,transparent_76%)] blur-[160px]"
    />

    {/* DEPTH RINGS */}
    <div
      className="absolute inset-[78px] rounded-full border border-[#E7D19A]/24"
      style={{
        transform: 'translateZ(90px)',
        boxShadow:
          '0 0 80px rgba(231,209,154,0.12)',
      }}
    />

    <div
      className="absolute inset-[126px] rounded-full border border-[#E7D19A]/16"
      style={{
        transform: 'translateZ(150px)',
      }}
    />

    {/* FLOATING PARTICLES */}
    <motion.div
      animate={{
        y: [0, -20, 0],
        opacity: [0.18, 0.7, 0.18],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="absolute top-[120px] left-[170px] w-[5px] h-[5px] rounded-full bg-[#C7AC60] blur-[1px]"
    />

    <motion.div
      animate={{
        y: [0, 18, 0],
        opacity: [0.12, 0.45, 0.12],
      }}
      transition={{
        duration: 13,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="absolute top-[340px] right-[150px] w-[4px] h-[4px] rounded-full bg-[#C7AC60]"
    />

    <motion.div
      animate={{
        x: [0, 12, 0],
        opacity: [0.10, 0.35, 0.10],
      }}
      transition={{
        duration: 16,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="absolute bottom-[130px] left-[120px] w-[3px] h-[3px] rounded-full bg-[#C7AC60]"
    />

    {/* SVG FIELD */}
    <svg
      viewBox="0 0 560 560"
      className="absolute inset-0 w-full h-full"
      style={{
        filter:
          'drop-shadow(0 0 80px rgba(231,209,154,0.18))',
      }}
    >

      {/* OUTER FIELD */}
      <motion.path
        d="M280 72 C410 66 502 166 494 280 C486 410 386 502 268 494 C142 486 64 386 72 260 C82 150 168 80 280 72"
        fill="none"
        stroke="rgba(231,209,154,0.52)"
        strokeWidth="1.2"
        animate={{
          d: [
            'M280 72 C410 66 502 166 494 280 C486 410 386 502 268 494 C142 486 64 386 72 260 C82 150 168 80 280 72',
            'M292 82 C426 78 510 182 486 292 C464 426 366 510 254 484 C138 456 72 366 86 246 C102 142 186 92 292 82',
            'M280 72 C410 66 502 166 494 280 C486 410 386 502 268 494 C142 486 64 386 72 260 C82 150 168 80 280 72',
          ],
        }}
        transition={{
          duration: 34,
          repeat: Infinity,
          ease: [0.65, 0, 0.35, 1],
        }}
      />

      {/* MID FIELD */}
      <motion.path
        d="M280 132 C374 126 442 194 438 280 C434 378 362 438 274 432 C178 426 126 350 132 266 C138 182 202 138 280 132"
        fill="rgba(231,209,154,0.04)"
        stroke="rgba(231,209,154,0.46)"
        strokeWidth="1"
        animate={{
          opacity: [0.38, 0.82, 0.38],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* INNER FIELD */}
      <motion.path
        d="M280 188 C340 184 388 228 384 280 C380 342 332 386 278 382 C214 378 182 330 186 276 C190 220 232 192 280 188"
        fill="rgba(231,209,154,0.08)"
        stroke="rgba(255,230,180,0.42)"
        strokeWidth="1"
        animate={{
          opacity: [0.4, 0.9, 0.4],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* CONNECTIONS */}
      <motion.line
        x1="280"
        y1="280"
        x2="280"
        y2={130 - ((scores.recovery || 50) * 0.35)}
        stroke="rgba(255,230,180,0.58)"
        strokeWidth="1"
        strokeDasharray="8 14"
        animate={{
          opacity: [0.24, 0.9, 0.24],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.line
        x1="280"
        y1="280"
        x2={420 + ((scores.stress || 50) * 0.28)}
        y2="210"
        stroke="rgba(255,230,180,0.58)"
        strokeWidth="1"
        strokeDasharray="10 18"
        animate={{
          opacity: [0.20, 0.8, 0.20],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.line
        x1="280"
        y1="280"
        x2="388"
        y2={410 + ((scores.cognition || 50) * 0.18)}
        stroke="rgba(255,230,180,0.58)"
        strokeWidth="1"
        strokeDasharray="8 16"
        animate={{
          opacity: [0.22, 0.84, 0.22],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.line
        x1="280"
        y1="280"
        x2={180 - ((scores.inflammation || 50) * 0.25)}
        y2="412"
        stroke="rgba(255,230,180,0.58)"
        strokeWidth="1"
        strokeDasharray="9 16"
        animate={{
          opacity: [0.22, 0.88, 0.22],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.line
        x1="280"
        y1="280"
        x2="158"
        y2={208 - ((scores.sleep || 50) * 0.22)}
        stroke="rgba(255,230,180,0.58)"
        strokeWidth="1"
        strokeDasharray="8 18"
        animate={{
          opacity: [0.18, 0.78, 0.18],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

   {/* CENTRAL BIOLOGICAL CORE */}
<foreignObject
  x="210"
  y="210"
  width="140"
  height="140"
>
  <motion.div
    animate={{
      opacity: [0.88, 1, 0.88],
      rotate: [0, 1.5, 0],
    }}
    transition={{
      duration: 18,
      repeat: Infinity,
      ease: [0.65, 0, 0.35, 1],
    }}
    className="relative w-full h-full rounded-full overflow-hidden border border-[#C7AC60]/40 bg-[rgba(10,18,28,0.92)] shadow-[0_0_40px_rgba(199,172,96,0.18)]"
  >

    {/* INNER GOLD GRID */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(199,172,96,0.18),transparent_72%)]" />

    {/* BIOLOGICAL TEXTURE */}
    <div
      className="absolute inset-0 opacity-70"
      style={{
        backgroundImage: `
          radial-gradient(circle at 30% 30%, rgba(199,172,96,0.22) 0%, transparent 18%),
          radial-gradient(circle at 70% 40%, rgba(199,172,96,0.18) 0%, transparent 22%),
          radial-gradient(circle at 45% 75%, rgba(199,172,96,0.16) 0%, transparent 20%),
          linear-gradient(rgba(199,172,96,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(199,172,96,0.08) 1px, transparent 1px)
        `,
        backgroundSize:
          '100% 100%, 100% 100%, 100% 100%, 18px 18px, 18px 18px',
      }}
    />

    {/* CENTRAL ENERGY */}
    <motion.div
      animate={{
        opacity: [0.45, 0.8, 0.45],
        scale: [1, 1.06, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="absolute top-1/2 left-1/2 w-[44px] h-[44px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C7AC60] blur-[12px]"
    />

    {/* MICRO NODES */}
    <div className="absolute top-[24px] left-[42px] w-[4px] h-[4px] rounded-full bg-[#C7AC60]" />

    <div className="absolute top-[58px] right-[28px] w-[3px] h-[3px] rounded-full bg-[#C7AC60]" />

    <div className="absolute bottom-[30px] left-[52px] w-[5px] h-[5px] rounded-full bg-[#C7AC60]" />

    <div className="absolute bottom-[46px] right-[42px] w-[3px] h-[3px] rounded-full bg-[#C7AC60]" />

  </motion.div>
</foreignObject>

      {/* RECOVERY */}
      <motion.circle
        cx="280"
        cy={130 - ((scores.recovery || 50) * 0.35)}
        r={Math.max(10, (scores.recovery || 0) * 0.14)}
        fill={
          scores.recovery >= 80
            ? '#C7AC60'
            : scores.recovery >= 65
            ? '#FFB357'
            : '#FF4D6D'
        }
        animate={{
          opacity: [0.72, 1, 0.72],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* STRESS */}
      <motion.circle
        cx={420 + ((scores.stress || 50) * 0.28)}
        cy="210"
        r={Math.max(10, (scores.stress || 0) * 0.14)}
        fill={
          scores.stress >= 80
            ? '#C7AC60'
            : scores.stress >= 65
            ? '#FFB357'
            : '#FF4D6D'
        }
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* COGNITION */}
      <motion.circle
        cx="388"
        cy={410 + ((scores.cognition || 50) * 0.18)}
        r={Math.max(10, (scores.cognition || 0) * 0.14)}
        fill={
          scores.cognition >= 80
            ? '#C7AC60'
            : scores.cognition >= 65
            ? '#FFB357'
            : '#FF4D6D'
        }
        animate={{
          opacity: [0.72, 1, 0.72],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* INFLAMMATION */}
      <motion.circle
        cx={180 - ((scores.inflammation || 50) * 0.25)}
        cy="412"
        r={Math.max(10, (scores.inflammation || 0) * 0.14)}
        fill={
          scores.inflammation >= 80
            ? '#C7AC60'
            : scores.inflammation >= 65
            ? '#FFB357'
            : '#FF4D6D'
        }
        animate={{
          opacity: [0.72, 1, 0.72],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* SLEEP */}
      <motion.circle
        cx="158"
        cy={208 - ((scores.sleep || 50) * 0.22)}
        r={Math.max(10, (scores.sleep || 0) * 0.14)}
        fill={
          scores.sleep >= 80
            ? '#C7AC60'
            : scores.sleep >= 65
            ? '#FFB357'
            : '#FF4D6D'
        }
        animate={{
          opacity: [0.72, 1, 0.72],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

    </svg>

    {/* LABELS */}
    <div className="absolute top-[54px] left-1/2 -translate-x-1/2 text-[11px] tracking-[0.42em] uppercase text-[#C7AC60]">
      Recovery
    </div>

    <div className="absolute top-[196px] right-[26px] text-[11px] tracking-[0.42em] uppercase text-[#C7AC60]">
      Stress
    </div>

    <div className="absolute bottom-[112px] right-[40px] text-[11px] tracking-[0.42em] uppercase text-[#C7AC60]">
      Cognition
    </div>

    <div className="absolute bottom-[108px] left-[68px] text-[11px] tracking-[0.42em] uppercase text-[#C7AC60]">
      Inflammation
    </div>

    <div className="absolute top-[198px] left-[72px] text-[11px] tracking-[0.42em] uppercase text-[#C7AC60]">
      Sleep
    </div>

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
  ? 'Well Regulated'
  : scores.inflammation >= 65
  ? 'Adaptive'
  : 'Dysregulated'
}
                />

                <MetricRow
                  label="Cognitive Stability"
               value={
  scores.cognition >= 80
  ? 'Well Regulated'
  : scores.cognition >= 65
  ? 'Adaptive'
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