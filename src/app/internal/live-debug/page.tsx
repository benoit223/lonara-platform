'use client'

import {
  useEffect,
  useState,
} from 'react'

import ExecutiveOverviewPage
from '@/components/report/ExecutiveOverviewPage'

import BiologicalIntelligencePage
from '@/components/report/BiologicalIntelligencePage'

import OptimizationProtocolPage
from '@/components/report/OptimizationProtocolPage'

export default function
LiveDebugPage() {

  const [assessment, setAssessment] =
    useState<any>(null)

  useEffect(() => {

    function handleMessage(
      event: MessageEvent,
    ) {

      if (
        event.data?.type ===
        'LIVE_ASSESSMENT_UPDATE'
      ) {

        setAssessment(
          event.data.payload,
        )
      }
    }

    window.addEventListener(
      'message',
      handleMessage,
    )

    return () => {

      window.removeEventListener(
        'message',
        handleMessage,
      )
    }

  }, [])

  if (!assessment) {

    return (
      <div className="min-h-screen bg-black p-10 text-white">
        Waiting for live assessment...
      </div>
    )
  }

  return (

    <div className="min-h-screen bg-[#02040A] p-10 space-y-12">

      {/* ===================================== */}
      {/* LIVE REPORT PAGES */}
      {/* ===================================== */}

      <ExecutiveOverviewPage
        report={assessment}
      />

      <BiologicalIntelligencePage
        report={assessment}
      />

      <OptimizationProtocolPage
        report={assessment}
      />

      {/* ===================================== */}
      {/* INTERNAL VALIDATION */}
      {/* ===================================== */}

      <div className="space-y-8 mt-24">

        {/* RAW RESPONSES */}
        <DebugCard title="Raw Responses">

          <pre className="text-xs whitespace-pre-wrap text-white/70">
            {JSON.stringify(
              assessment.responses,
              null,
              2,
            )}
          </pre>

        </DebugCard>

        {/* PSYCHOMETRICS */}
        <DebugCard title="Psychometric Engine">

          <Metric
            label="Coherence"
            value={
              assessment.psychometric
                ?.coherence
            }
          />

          <Metric
            label="Stability"
            value={
              assessment.psychometric
                ?.stability
            }
          />

          <Metric
            label="Reliability"
            value={
              assessment.psychometric
                ?.reliability
            }
          />

          <Metric
            label="Contradiction Load"
            value={
              assessment.psychometric
                ?.contradictionLoad
            }
          />

        </DebugCard>

        {/* BIOLOGICAL SCORES */}
        <DebugCard title="Biological Scores">

          {Object.entries(
            assessment.scores || {},
          ).map(([key, value]) => (

            <Metric
              key={key}
              label={key}
              value={value}
            />

          ))}

        </DebugCard>

        {/* RISKS */}
        <DebugCard title="Risk Engine">

          <pre className="text-xs whitespace-pre-wrap text-white/70">
            {JSON.stringify(
              assessment.risks,
              null,
              2,
            )}
          </pre>

        </DebugCard>

        {/* CORRELATIONS */}
        <DebugCard title="Correlation Engine">

          <pre className="text-xs whitespace-pre-wrap text-white/70">
            {JSON.stringify(
              assessment.correlations,
              null,
              2,
            )}
          </pre>

        </DebugCard>

        {/* BIOMARKERS */}
        <DebugCard title="Biomarker Engine">

          <pre className="text-xs whitespace-pre-wrap text-white/70">
            {JSON.stringify(
              assessment.biomarkers,
              null,
              2,
            )}
          </pre>

        </DebugCard>

        {/* PRIORITIES */}
        <DebugCard title="Priority Engine">

          <pre className="text-xs whitespace-pre-wrap text-white/70">
            {JSON.stringify(
              assessment.priorities,
              null,
              2,
            )}
          </pre>

        </DebugCard>

        {/* SIGNATURE */}
        <DebugCard title="Signature Engine">

          <pre className="text-xs whitespace-pre-wrap text-white/70">
            {JSON.stringify(
              assessment.signature,
              null,
              2,
            )}
          </pre>

        </DebugCard>

        {/* TRAJECTORY */}
        <DebugCard title="Trajectory Engine">

          <pre className="text-xs whitespace-pre-wrap text-white/70">
            {JSON.stringify(
              assessment.trajectory,
              null,
              2,
            )}
          </pre>

        </DebugCard>

        {/* FINAL REPORT */}
        <DebugCard title="Final Report Object">

          <pre className="text-xs whitespace-pre-wrap text-white/70">
            {JSON.stringify(
              assessment,
              null,
              2,
            )}
          </pre>

        </DebugCard>

      </div>

    </div>
  )
}

function DebugCard({
  title,
  children,
}: any) {

  return (

    <div className="rounded-3xl border border-white/10 bg-black/40 p-8">

      <h2 className="mb-6 text-xl text-cyan-300">
        {title}
      </h2>

      {children}

    </div>
  )
}

function Metric({
  label,
  value,
}: any) {

  return (

    <div className="flex justify-between border-b border-white/5 py-3">

      <span className="text-white/60">
        {label}
      </span>

      <span className="text-cyan-300">
        {String(value)}
      </span>

    </div>
  )
}