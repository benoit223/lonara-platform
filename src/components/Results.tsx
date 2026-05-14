'use client'

import { useEffect, useState } from 'react'




export default function Results({
  scores,
  protocols,
  fullName,
  email,
  onRestart,
}: {
  scores: Record<string, number>
  protocols: any[]
  fullName: string
  email: string
  onRestart: () => void
}) {
  const [aiInsight, setAiInsight] =
  useState<{
    insights: string[]
    protocols: any[]
    longevityScore: number
  } | null>(null)

  useEffect(() => {
    const generateAI = async () => {
      try {
        const response = await fetch(
          '/api/generate-insights',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              scores,
            }),
          },
        )

        const data = await response.json()

        setAiInsight(data.insight)
      } catch (error) {
        console.error(error)

      setAiInsight({
  insights: [
    'AI analysis temporarily unavailable.',
  ],
  protocols: [],
  longevityScore: 0,
})
      }
    }

    generateAI()
  }, [scores])

  const globalScore = Math.round(
    Object.values(scores).reduce(
      (acc, value) => acc + value,
      0,
    ) / Object.values(scores).length,
  )

  const biologicalAge = Math.max(
    18,
    Math.round(80 - globalScore * 0.6),
  )

  const globalInterpretation =
    globalScore >= 80
      ? 'Your biological resilience profile indicates excellent recovery capacity, metabolic efficiency and strong longevity potential.'
      : globalScore >= 60
      ? 'Your current biological profile indicates moderate optimization potential with identifiable stress and recovery imbalances.'
      : 'Multiple biological resilience markers suggest elevated stress load and reduced recovery efficiency requiring targeted optimization.'

  const profileTitle =
    globalScore >= 80
      ? 'Elite Longevity Profile'
      : globalScore >= 60
      ? 'Optimized Biological Profile'
      : 'Recovery Optimization Required'

  const reportDate = new Date().toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  )

  const dynamicInsights = [
    scores.stress < 55
      ? 'Elevated nervous system load and stress adaptation dysregulation were detected.'
      : 'Stress resilience markers remain relatively stable.',

    scores.sleep < 60
      ? 'Sleep recovery efficiency appears compromised and should be prioritized.'
      : 'Sleep quality indicators suggest stable recovery cycles.',

    scores.inflammation < 60
      ? 'Inflammatory balance markers indicate elevated systemic stress load.'
      : 'Inflammatory regulation appears relatively optimized.',

    scores.cognition < 60
      ? 'Cognitive resilience and mental clarity patterns suggest recovery optimization potential.'
      : 'Cognitive performance markers remain strong and stable.',

    scores.recovery < 60
      ? 'Biological recovery efficiency may be impaired under prolonged stress exposure.'
      : 'Recovery capacity appears resilient and adaptive.',
  ]

  return (
    <div className="w-full max-w-5xl">
      <div
        id="lonara-report"
        className="rounded-[2.5rem] border border-gray-800 bg-[#111827] p-12"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-16">
          <div>
            <p className="text-cyan-300 uppercase tracking-[0.25em] text-xs mb-4">
              Lonara Labs — Clinical Longevity Report
            </p>

            <h1 className="text-6xl font-semibold text-white leading-tight max-w-3xl">
              {profileTitle}
            </h1>

            <p className="mt-6 text-gray-400 leading-relaxed max-w-2xl">
              Advanced longevity profiling powered by biological scoring,
              recovery analysis, behavioral optimization and dynamic
              intelligence interpretation.
            </p>

            <p className="mt-6 text-sm text-cyan-300">
              Report generated on {reportDate}
            </p>
          </div>

          <img
            src="/lonara-logo.png"
            alt="Lonara"
            className="h-40 w-auto opacity-90"
          />
        </div>

        {/* Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <div className="rounded-3xl border border-cyan-700 bg-[#083344] p-8">
            <p className="text-base font-semibold uppercase tracking-[0.18em] text-cyan-300 mb-4">
              Vital Index
            </p>

            <h2 className="text-7xl font-bold text-white">
              {globalScore}
            </h2>

            <p className="mt-5 text-gray-300 leading-relaxed">
              {globalInterpretation}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-[#0f172a] p-8">
            <p className="text-base font-semibold uppercase tracking-[0.18em] text-cyan-300 mb-4">
              Estimated Biological Age
            </p>

            <h2 className="text-7xl font-bold text-white">
              {biologicalAge}
            </h2>

            <p className="mt-5 text-gray-300 leading-relaxed">
              Biological markers suggest improved recovery capacity
              relative to chronological age.
            </p>
          </div>
        </div>

        {/* Metrics Intro */}
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Biological Performance Metrics
          </h2>

          <p className="text-gray-400 leading-relaxed max-w-4xl">
            Lonara evaluates multidimensional biological resilience
            patterns including mitochondrial efficiency, nervous system
            regulation, inflammatory load, recovery capacity, metabolic
            flexibility and long-term longevity optimization markers.
          </p>
        </div>

        {/* Dynamic Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
        {Object.entries(scores).map(([label, value], index) => (
            <div
              key={`${label}-${value}-${index}`}
              className="rounded-3xl border border-cyan-950 bg-[#0b1120] p-6"
            >
              <div className="flex justify-between mb-5">
                <p className="text-gray-300 capitalize">
                  {label}
                </p>

                <div className="flex items-center gap-3">
                  <p className="text-cyan-300 font-semibold">
                    {value}/100
                  </p>

                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      value >= 75
                   ? 'bg-green-950 text-green-300'
                    : value >= 41
                  ? 'bg-amber-950 text-amber-300'
                   : 'bg-red-950 text-red-300'
                    }`}
                  >
                    {value >= 75
                      ? 'Excellent'
                      : value >= 41
                      ? 'Moderate'
                      : 'Critical'}
                  </span>
                </div>
              </div>

           <div className="h-5 rounded-full bg-[#020617] overflow-hidden border border-cyan-950">
              <div
  key={`${label}-${value}`}
  className={`h-full rounded-full shadow-[0_0_20px_rgba(34,211,238,0.25)] ${
                    value >= 75
                    ? 'bg-[#10b981]'
                    : value >= 41
                        ? 'bg-[#f59e0b]'
                       : 'bg-[#ef4444]'
                  }`}
                  style={{
                    width: `${value}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Intelligence Analysis */}
        <div className="rounded-3xl border border-cyan-700 bg-[#083344] p-10 mb-12">
          <div className="flex items-center justify-between mb-7">
            <div>
              <p className="text-cyan-300 uppercase tracking-[0.2em] text-xs mb-3">
                Lonara Longevity Intelligence Platform
              </p>

              <h2 className="text-3xl font-semibold text-white">
                Dynamic Longevity Analysis
              </h2>
            </div>

            <div className="px-4 py-2 rounded-full border border-cyan-800 bg-[#0f172a] text-cyan-300 text-sm">
              Dynamic Intelligence Interpretation
            </div>
          </div>

          <p className="text-gray-300 leading-loose whitespace-pre-line text-[15px]">
            {aiInsight?.insights?.[0]}
          </p>
        </div>

        {/* Biological Insights */}
        <div className="rounded-3xl border border-gray-800 bg-[#0f172a] p-8 mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Biological Insights
          </h2>

          <div className="space-y-5 text-gray-300 leading-relaxed">
            {dynamicInsights.map((insight, index) => (
              <p key={index}>
                {insight}
              </p>
            ))}
          </div>
        </div>

{/* VISUAL ANALYTICS */}
<div className="rounded-3xl border border-cyan-700 bg-[#083344] p-10 mb-12">

  <div className="mb-10">
    <p className="text-cyan-300 uppercase tracking-[0.2em] text-xs mb-3">
      Lonara Biological Analytics
    </p>

    <h2 className="text-3xl font-semibold text-white">
      Biological Visual Analytics
    </h2>

    <p className="text-gray-300 mt-4 leading-relaxed">
      Advanced visualization of biological resilience,
      physiological recovery dynamics and longevity
      optimization markers.
    </p>
  </div>

  {/* HEATMAP */}
  <div className="space-y-5 mb-14">
    {Object.entries(scores)
      .slice(0, 8)
      .map(([label, value]) => (
        <div key={label}>
          <div className="flex justify-between mb-2">
            <p className="text-gray-200 capitalize">
              {label}
            </p>

            <p
              className={`font-medium ${
                value >= 75
                  ? 'text-green-400'
                  : value >= 41
                  ? 'text-amber-400'
                  : 'text-red-400'
              }`}
            >
              {value >= 75
                ? 'Optimized'
                : value >= 41
                ? 'Moderate'
                : 'Critical'}
            </p>
          </div>

          <div className="h-4 rounded-full bg-[#020617] overflow-hidden">
            <div
              className={`h-full rounded-full ${
                value >= 75
                  ? 'bg-[#10b981]'
                  : value >= 41
                  ? 'bg-[#f59e0b]'
                  : 'bg-[#ef4444]'
              }`}
              style={{
                width: `${value}%`,
              }}
            />
          </div>
        </div>
      ))}
  </div>

  {/* BIO AGE */}
  <div className="rounded-3xl border border-cyan-900 bg-[#071926] p-10 text-center">
    <p className="text-cyan-300 uppercase tracking-[0.2em] text-xs mb-4">
      Biological Age Analysis
    </p>

    <h2 className="text-7xl font-bold text-cyan-300">
      {biologicalAge}
    </h2>

    <p className="mt-6 text-gray-300 max-w-2xl mx-auto leading-relaxed">
      Estimated physiological resilience suggests
      optimized biological recovery patterns and
      adaptive longevity markers.
    </p>
  </div>
</div>

        {/* Protocols */}
        <div className="rounded-3xl border border-gray-800 bg-[#111827] p-8 mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Recommended Longevity Protocols
          </h2>

          <div className="space-y-6">
            {protocols.map((protocol, index) => (
              <div
                key={index}
                className="rounded-2xl border border-cyan-700 bg-[#071926] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-xl font-semibold">
                    {protocol.title}
                  </h3>

                  <span className="px-3 py-1 rounded-full bg-red-900 text-red-300 text-xs">
                    {protocol.priority}
                  </span>
                </div>

                <p className="text-gray-300 leading-relaxed mb-5">
                  {protocol.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  {protocol.recommendations.map(
                    (item: string) => (
                      <span
                        key={item}
                        className="px-5 py-3 rounded-full bg-[#111827] border border-cyan-950 text-cyan-300 text-sm flex items-center justify-center min-h-[48px]"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="rounded-3xl border border-gray-700 bg-[#111111] p-8 mb-12">
          <h2 className="text-xl font-semibold text-white mb-5">
            Privacy & Data Protection
          </h2>

          <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
            <p>
              All personal and biological information collected through
              the Lonara platform is treated as strictly confidential.
            </p>

            <p>
              Your data is never sold, shared or disclosed to third parties
              without your explicit consent.
            </p>

            <p>
              Lonara Labs implements industry-standard security practices
              to protect all personal health and assessment data.
            </p>

            <p>
              This assessment is intended exclusively for wellness and
              longevity optimization purposes and does not replace
              professional medical advice, diagnosis or treatment.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-14 mt-20 border-t border-gray-800 flex items-end justify-between text-sm text-gray-500">
          <div>
            <p className="text-gray-300 font-medium">
              All rights reserved - Lonara Labs 2026
            </p>

            <p className="mt-2">
              www.lonaralabs.com
            </p>
          </div>

          <div className="max-w-md text-right leading-loose">
            This report is intended exclusively for wellness and
            longevity optimization purposes and does not constitute
            medical diagnosis or treatment.
          </div>
        </div>
      </div>

{/* PDF Button */}
<div className="flex justify-center mt-12">
  <button
    onClick={async () => {
    try {

  const { pdf } = await import(
    '@react-pdf/renderer'
  )

  const { default: PDFReport } =
    await import('./PDFReport')

  const instance = pdf(
    <PDFReport
      fullName={fullName}
      scores={scores}
      insights={dynamicInsights}
      protocols={protocols}
      longevityScore={globalScore}
    />,
  )
const blob = await Promise.race([
  instance.toBlob(),

  new Promise<never>(
    (_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              'PDF generation timeout',
            ),
          ),
        15000,
      ),
  ),
])

console.log(blob)

const url =
  URL.createObjectURL(blob)

  const link =
    document.createElement('a')

  link.href = url

  link.download =
    'lonara-premium-report.pdf'

  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)

  URL.revokeObjectURL(url)

  // SEND EMAIL
  await fetch(
          '/api/send-report',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

           body: JSON.stringify({
  email,
  fullName,
  scores,

  insights:
    aiInsight?.insights || [],

  protocols:
    aiInsight?.protocols || [],

  longevityScore:
    aiInsight?.longevityScore || 0,
}),
          },
        )

        alert(
          'Premium report generated and emailed successfully.',
        )
      } catch (error) {
        console.error(error)

        alert(
          'PDF generation failed.',
        )
      }
    }}
    className="px-12 py-6 rounded-3xl bg-[#06b6d4] text-black font-semibold text-xl hover:scale-[1.02] transition-all shadow-lg"
  >
    Download Premium PDF Report
  </button>
</div>

<div className="flex justify-center mt-6">
  <button
    onClick={onRestart}
    className="text-sm text-gray-400 hover:text-white transition-all"
  >
    Restart Assessment
  </button>
</div>

    </div>
  )
}