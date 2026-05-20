'use client'

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'

type Props = {
  scores: Record<string, number>
}

export default function BiologicalRadarChart({
  scores,
}: Props) {

  const data = [
    {
      system: 'Energy',
      value: scores.energy,
    },

    {
      system: 'Recovery',
      value: scores.recovery,
    },

    {
      system: 'Sleep',
      value: scores.sleep,
    },

    {
      system: 'Stress',
      value: scores.stress,
    },

    {
      system: 'Cognition',
      value: scores.cognition,
    },

    {
      system: 'Longevity',
      value: scores.longevity,
    },

    {
      system: 'Metabolism',
      value: scores.metabolism,
    },

    {
      system: 'Inflammation',
      value: scores.inflammation,
    },
  ]

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-cyan-700 bg-[#071926] p-10">

      {/* Ambient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,140,255,0.12),transparent_60%)] animate-pulseSlow" />

<div className="absolute top-[-120px] left-[-120px] w-[340px] h-[340px] rounded-full bg-cyan-400/10 blur-3xl animate-floatSlow" />

<div className="absolute bottom-[-140px] right-[-120px] w-[320px] h-[320px] rounded-full bg-blue-500/10 blur-3xl animate-floatSlow" />

      <div className="relative z-10">

        <div className="mb-10">

          <p className="text-cyan-300 uppercase tracking-[0.22em] text-xs mb-4">
            Biological Systems Visualization
          </p>

          <h2 className="text-3xl font-semibold text-white mb-4">
            Biological Radar Analysis
          </h2>

          <p className="text-gray-300 leading-relaxed max-w-3xl">
            Multi-system physiological visualization
            derived from recovery resilience,
            metabolic regulation and systemic
            biological adaptation modeling.
          </p>

        </div>

        <div className="relative h-[620px] w-full rounded-[2rem] border border-cyan-900 bg-[#020617]/70 backdrop-blur-xl overflow-hidden">

{/* CHART GLOW */}

<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,140,255,0.14),transparent_70%)]" />

{/* SCAN LINE */}

<div className="absolute inset-0 overflow-hidden pointer-events-none">

  <div className="absolute top-[-100%] left-0 w-full h-[40%] bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-scanMove" />

</div>


          <ResponsiveContainer
            width="100%"
            height="100%"
          >
<RadarChart data={data}>

  <defs>

    <linearGradient
      id="radarGradient"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >

      <stop
        offset="0%"
        stopColor="#22d3ee"
        stopOpacity={0.95}
      />

      <stop
        offset="100%"
        stopColor="#2563eb"
        stopOpacity={0.18}
      />

    </linearGradient>

  </defs>

<circle
  cx="50%"
  cy="50%"
  r="38"
  fill="rgba(34,211,238,0.08)"
/>

<circle
  cx="50%"
  cy="50%"
  r="18"
  fill="rgba(34,211,238,0.35)"
/>


  <PolarGrid
    stroke="rgba(255,255,255,0.08)"
  />

  <PolarAngleAxis
    dataKey="system"
    tick={{
      fill: '#9ca3af',
      fontSize: 12,
    }}
  />

  <Radar
    name="Longevity"
    dataKey="value"
    stroke="#22d3ee"
    fill="url(#radarGradient)"
    fillOpacity={0.65}
    strokeWidth={3}
  />

</RadarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  )
}