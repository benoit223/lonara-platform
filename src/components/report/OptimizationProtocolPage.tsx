'use client'

import {
  Moon,
  Sun,
  Sunset,
  ShieldCheck,
} from 'lucide-react'

export default function OptimizationProtocolPage({
  report,
}: any) {

  const scores = report.scores

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

      <div className="absolute top-[-120px] left-[-10%] w-[320px] h-[320px] rounded-full bg-[#035AA8]/10 blur-3xl opacity-40" />

      <div className="absolute bottom-[-140px] right-[-10%] w-[260px] h-[260px] rounded-full bg-[#035AA8]/10 blur-3xl opacity-40" />

      <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />

      <div className="relative z-10 p-10">


{/* EXECUTIVE BACKGROUND IMAGE */}
<div
  className="absolute inset-0 opacity-[0.1] bg-cover bg-center mix-blend-soft-light"
  style={{
    backgroundImage: "url('/f3.png')",
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
              Optimization Protocol
            </p>

           <h2   className="text-[3rem] leading-[0.95] font-medium capitalize tracking-[0.04em] text-[#EAE4D5]"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
              Daily Longevity Ritual
            </h2>

          </div>

          <div className="max-w-[460px] text-right ml-auto">

            <p className="text-sm leading-relaxed text-[#EAE4D5]/50">
              Personalized biological optimization protocol
              designed to support resilience, recovery,
              longevity, and systemic balance.
            </p>

          </div>

        </div>

        {/* ADAPTIVE PHASE */}
        <div className="relative overflow-hidden mb-10 rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-8 backdrop-blur-xl">

          {/* TOP LIGHT */}
          <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
          {/* INNER GLOW */}
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">
            Adaptive Optimization Phase
          </p>

          <div className="mt-5 flex items-center justify-between">

            <div>

              <h3 className="text-[34px] font-extralight text-[#EAE4D5]">
                {report.adaptivePhase.phase}
              </h3>

              <p className="mt-4 max-w-[800px] text-sm leading-relaxed text-[#EAE4D5]/60">
                {report.adaptivePhase.focus}
              </p>

            </div>

            <div className="w-24 h-24 rounded-full border border-[#C7AC60]/12 bg-[rgba(199,172,96,0.08)] flex items-center justify-center">

              <div className="w-10 h-10 rounded-full bg-[#C7AC60]/20 blur-[10px]" />

            </div>

          </div>

        </div>

        {/* TIMELINE */}
        <div className="grid grid-cols-3 gap-8 mb-10">

          {report.protocols?.slice(0, 3).map(
            (
              protocol: any,
              index: number,
            ) => (
              <ProtocolCard
                key={index}
                icon={
                  index === 0 ? (
                    <Sun size={22} />
                  ) : index === 1 ? (
                    <Sunset size={22} />
                  ) : (
                    <Moon size={22} />
                  )
                }
                period={
                  index === 0
                    ? 'Morning'
                    : index === 1
                    ? 'Midday'
                    : 'Evening'
                }
                title={protocol.title}
                objective={
                  protocol.objective ||
                  protocol.description
                }
                protocols={
                  protocol.recommendations ||
                  []
                }
              />
            ),
          )}

        </div>

        {/* ROADMAP + SUMMARY */}
        <div className="grid grid-cols-12 gap-8">

          {/* ROADMAP */}
          <div className="relative overflow-hidden col-span-8 rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-8 backdrop-blur-xl">

            {/* TOP LIGHT */}
            <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
            {/* INNER GLOW */}
            <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

            <div className="flex items-center justify-between mb-10">

              <div>

                <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">
                  Longevity Roadmap
                </p>

                <h3 className="mt-3 text-[32px] font-extralight text-[#EAE4D5]">
                  Projected Biological Adaptation
                </h3>

              </div>

              <div className="text-right">

                <p className="text-[#EAE4D5]/40 text-xs">
                  Optimization Potential
                </p>

                <p className="mt-2 text-[28px] font-light text-[#C7AC60]">
                  {
                    scores.longevity >= 80
                      ? 'High'
                      : scores.longevity >= 65
                      ? 'Moderate'
                      : 'Developing'
                  }
                </p>

              </div>

            </div>

            <div className="space-y-8">

            <RoadmapItem
  timeline="30 DAYS"
  title={
    scores.stress >= 70
      ? 'Autonomic Stabilization'
      : 'Stress Recovery Foundation'
  }
  gain={`+${
    Math.round(scores.recovery * 0.08)
  }% recovery efficiency`}
/>

<RoadmapItem
  timeline="90 DAYS"
  title="Improved Biological Recovery Capacity"
  gain={`-${(
    (
      report.user.age -
      report.biologicalAge
    ) * 0.35
  ).toFixed(1)} biological years`}
/>

<RoadmapItem
  timeline="6 MONTHS"
  title="Advanced Longevity Optimization"
  gain={`+${
    Math.round(scores.longevity * 0.18)
  }% resilience reserve`}
/>

<RoadmapItem
  timeline="12 MONTHS"
  title="Sustained Long-Term Adaptation"
  gain={
    scores.longevity >= 80
      ? 'Advanced longevity trajectory'
      : 'Progressive longevity trajectory'
  }
/>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="col-span-4 space-y-8">

            {/* SUMMARY */}
            <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-8 backdrop-blur-xl">

              {/* TOP LIGHT */}
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              {/* INNER GLOW */}
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">
                Executive Summary
              </p>

              <h3 className="mt-3 text-[28px] font-extralight text-[#EAE4D5]">
                {
  scores.longevity >= 80
    ? 'Advanced Optimization Profile'
    : scores.longevity >= 65
    ? 'Adaptive Recovery Profile'
    : 'Foundational Recovery Profile'
}
              </h3>

              <p className="mt-6 text-sm leading-relaxed text-[#EAE4D5]/60">
                {report.synthesis}
              </p>

            </div>

            {/* PRIORITIES */}
            <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-8 backdrop-blur-xl">

              {/* TOP LIGHT */}
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              {/* INNER GLOW */}
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

              <div className="flex items-center gap-4 mb-8">

                <div className="w-12 h-12 rounded-full border border-[#C7AC60]/12 bg-[rgba(199,172,96,0.08)] flex items-center justify-center text-[#C7AC60]">

                  <ShieldCheck size={22} />

                </div>

                <div>

                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#C7AC60]/60">
                    Priority Focus
                  </p>

                  <h4 className="text-xl font-light text-[#EAE4D5] mt-1">
                    {
  report.priorities?.[0]?.title ||
  'Recovery Optimization'
}
                  </h4>

                </div>

              </div>

              <div className="space-y-5">

             {report.priorities?.map(
  (
    priority: any,
    index: number,
  ) => (
    <PriorityRow
      key={index}
      label={priority.title}
      level={priority.impact}
    />
  ),
)}

              </div>

            </div>

            {/* PRODUCT STACK */}
            <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-8 backdrop-blur-xl">

              {/* TOP LIGHT */}
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              {/* INNER GLOW */}
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">
                Suggested Optimization Stack
              </p>

              <h3 className="mt-3 text-[28px] font-extralight text-[#EAE4D5] mb-8">
                Recommended Support
              </h3>

              <div className="space-y-5">

                {report.products?.map(
                  (
                    product: any,
                    index: number,
                  ) => (
                    <div
                      key={index}
                      className="rounded-[22px] border border-[#C7AC60]/12 bg-black/20 p-5"
                    >

                      <div className="flex items-center justify-between">

                        <div>

                          <p className="text-sm text-[#EAE4D5]/90">
                            {product.title}
                          </p>

                          <p className="mt-2 text-xs text-[#C7AC60]">
                            {product.category}
                          </p>

                        </div>

                        <p className="text-[11px] uppercase tracking-[0.2em] text-[#EAE4D5]/40">
                          Lonara
                        </p>

                      </div>

                      <p className="mt-4 text-sm text-[#EAE4D5]/50">
                        {product.dosage}
                      </p>

                    </div>
                  ),
                )}

              </div>

            </div>

          </div>

        </div>

        {/* EXECUTIVE SYNTHESIS */}
        <div className="relative overflow-hidden mt-10 rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,20,38,0.78)] p-10 backdrop-blur-xl">

          {/* TOP LIGHT */}
          <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
          {/* INNER GLOW */}
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-6">
            Executive Synthesis
          </p>

          <div className="max-w-[1100px]">

            <p className="text-[18px] leading-[1.9] text-[#EAE4D5]/80 whitespace-pre-line">
              {report.synthesis}
            </p>

          </div>

        </div>

{/* LEGAL + PRIVACY */}

<div className="relative overflow-hidden mt-10 rounded-[32px] border border-[#C7AC60]/10 bg-black/20 p-8">

  <div className="grid grid-cols-2 gap-10">

    {/* LEFT */}

    <div>

      <p className="text-[10px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-5">
        Confidentiality & Data Usage
      </p>

      <div className="space-y-4 text-[13px] leading-relaxed text-[#EAE4D5]/45">

        <p>
          All personal health information and biological data
          contained within this report are processed using
          encrypted analytical systems and confidential
          computational infrastructure.
        </p>

        <p>
          Lonara does not sell, distribute, or share
          identifiable biological information with external
          entities without explicit user authorization.
        </p>

        <p>
          Data may be utilized anonymously to improve
          adaptive modeling systems, AI interpretation
          engines, and longitudinal optimization frameworks.
        </p>

      </div>

    </div>

    {/* RIGHT */}

    <div>

      <p className="text-[10px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-5">
        Medical & Regulatory Disclaimer
      </p>

      <div className="space-y-4 text-[13px] leading-relaxed text-[#EAE4D5]/45">

        <p>
          This report is intended exclusively for educational,
          wellness, and optimization purposes and does not
          constitute medical diagnosis, treatment,
          or licensed healthcare advice.
        </p>

        <p>
          Users should consult a qualified physician or
          healthcare professional before implementing
          any nutritional, supplemental, recovery,
          or lifestyle intervention discussed herein.
        </p>

        <p>
          Lonara assumes no liability for decisions,
          actions, or outcomes resulting from the use
          or interpretation of this report.
        </p>

      </div>

    </div>

  </div>

  {/* FOOTER */}

  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">

    <div>

      <p className="text-[11px] uppercase tracking-[0.25em] text-[#EAE4D5]/30">
        © 2026 Lonara Labs — All Rights Reserved
      </p>

      <p className="mt-2 text-xs text-[#EAE4D5]/25">
        www.lonaralabs.com — app.lonaralabs.com 
      </p>

    </div>

    <div className="text-right">

      <p className="text-[10px] uppercase tracking-[0.25em] text-[#C7AC60]/40">
        Proprietary Biological Intelligence System
      </p>

      <p className="mt-2 text-xs text-[#EAE4D5]/25">
        Generated through adaptive AI-assisted longevity modeling
      </p>

    </div>

  </div>
</div>

</div>
<div className="absolute top-10 right-10 z-30">

  <p className="text-[11px] tracking-[0.25em] uppercase text-[#EAE4D5]/25">
    Page 3 of 3
  </p>

</div>
    </section>
  )
}

function ProtocolCard({
  icon,
  period,
  title,
  objective,
  protocols,
}: any) {

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-8 backdrop-blur-xl">

      {/* TOP LIGHT */}
      <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
      {/* INNER GLOW */}
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

      <div className="w-12 h-12 rounded-full border border-[#C7AC60]/12 bg-[rgba(199,172,96,0.08)] flex items-center justify-center text-[#C7AC60]">

        {icon}

      </div>

      <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">
        {period}
      </p>

      <h3 className="mt-3 text-[30px] font-extralight text-[#EAE4D5]">
        {title}
      </h3>

      <p className="mt-5 text-sm leading-relaxed text-[#EAE4D5]/60">
        {objective}
      </p>

      <div className="mt-8 space-y-4">

        {protocols.map((item: string, index: number) => (

          <div
            key={index}
            className="flex items-center gap-3"
          >

            <div className="w-2 h-2 rounded-full bg-[#C7AC60]" />

            <p className="text-sm text-[#EAE4D5]/70">
              {item}
            </p>

          </div>

        ))}

      </div>

    </div>
  )
}

function RoadmapItem({
  timeline,
  title,
  gain,
}: any) {

  return (
    <div className="flex items-start gap-6">

      <div className="w-[140px]">

        <p className="text-[11px] uppercase tracking-[0.25em] text-[#C7AC60]/60">
          {timeline}
        </p>

      </div>

      <div className="flex-1 border-l border-[#C7AC60]/12 pl-8 pb-10">

        <h4 className="text-xl font-light text-[#EAE4D5]">
          {title}
        </h4>

        <p className="mt-3 text-[#C7AC60] text-sm">
          {gain}
        </p>

      </div>

    </div>
  )
}

function PriorityRow({
  label,
  level,
}: any) {

  return (
    <div className="flex items-center justify-between border-b border-[#C7AC60]/8 pb-4">

      <p className="text-sm text-[#EAE4D5]/70">
        {label}
      </p>

      <p className="text-[11px] tracking-[0.25em] text-[#C7AC60]">
        {level}
      </p>

    </div>
  )
}