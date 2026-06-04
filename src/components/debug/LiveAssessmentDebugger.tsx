'use client'

export default function
LiveAssessmentDebugger({
  assessment,
}: {
  assessment: any
}) {

  return (

    <div className="fixed top-4 right-4 z-[99999] w-[420px] max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-black/90 p-5 text-white shadow-2xl backdrop-blur-xl">

      <div className="mb-4">
        <h2 className="text-sm font-semibold tracking-wide text-cyan-300">
          LIVE ENGINE DEBUG
        </h2>
      </div>

      {/* ===================================== */}
      {/* PSYCHOMETRICS */}
      {/* ===================================== */}

      <div className="mb-6">
        <h3 className="mb-2 text-xs uppercase text-white/50">
          Psychometrics
        </h3>

        <div className="space-y-1 text-sm">

          <div className="flex justify-between">
            <span>Signal Integrity</span>
            <span>
              {assessment.psychometric.coherence}%
            </span>
          </div>

          <div className="flex justify-between">
            <span>Stability</span>
            <span>
              {assessment.psychometric.stability}%
            </span>
          </div>

          <div className="flex justify-between">
            <span>Reliability</span>
            <span>
              {assessment.psychometric.reliability}%
            </span>
          </div>

          <div className="flex justify-between">
            <span>Contradictions</span>
            <span>
              {assessment.psychometric.contradictionLoad}%
            </span>
          </div>

        </div>
      </div>

      {/* ===================================== */}
      {/* SCORES */}
      {/* ===================================== */}

      <div className="mb-6">
        <h3 className="mb-2 text-xs uppercase text-white/50">
          Biological Scores
        </h3>

        <div className="space-y-1 text-sm">

          {Object.entries(
            assessment.scores,
          ).map(([key, value]) => (

            <div
              key={key}
              className="flex justify-between"
            >
              <span>{key}</span>

              <span>
                {String(value)}
              </span>
            </div>

          ))}

        </div>
      </div>

      {/* ===================================== */}
      {/* SIGNATURE */}
      {/* ===================================== */}

      <div className="mb-6">

        <h3 className="mb-2 text-xs uppercase text-white/50">
          Signature
        </h3>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">

          <div className="text-sm font-medium">
            {assessment.signature.title}
          </div>

          <div className="mt-1 text-xs text-white/60">
            {assessment.signature.risk}
          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* RISKS */}
      {/* ===================================== */}

      <div className="mb-6">

        <h3 className="mb-2 text-xs uppercase text-white/50">
          Risks
        </h3>

        <div className="space-y-2">

          {assessment.risks.map(
            (risk: any, index: number) => (

              <div
                key={index}
                className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-xs"
              >
                <div>
                  {risk.label}
                </div>

                <div className="text-red-300">
                  {risk.severity}
                </div>
              </div>

            ),
          )}

        </div>

      </div>

      {/* ===================================== */}
      {/* RAW JSON */}
      {/* ===================================== */}

      <details className="text-xs text-white/60">

        <summary className="cursor-pointer">
          Raw Assessment JSON
        </summary>

        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-[10px] leading-relaxed">
          {JSON.stringify(
            assessment,
            null,
            2,
          )}
        </pre>

      </details>

    </div>
  )
}