// src/components/LegalNotice.tsx

'use client'

interface LegalNoticeProps {
  onClose: () => void
}

export default function LegalNotice({
  onClose,
}: LegalNoticeProps) {
  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[3px] px-4 py-4">

      <div className="relative w-full max-w-[1100px] max-h-[88vh] overflow-y-auto rounded-[1.8rem] border border-[#71BFE3]/10 bg-[rgba(3,10,20,0.68)] backdrop-blur-[20px] px-8 py-8 shadow-[0_0_50px_rgba(0,220,255,0.03)]">
        {/* AMBIENT GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,140,255,0.08),transparent_40%)] pointer-events-none" />

        <div className="absolute top-[-120px] right-[-10%] w-[320px] h-[320px] rounded-full bg-cyan-400/10 blur-3xl opacity-40" />

        <div className="absolute bottom-[-140px] left-[-10%] w-[260px] h-[260px] rounded-full bg-blue-500/10 blur-3xl opacity-40" />

        {/* TOP LIGHT */}
        <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#8FD2FF] to-transparent opacity-90" />

        <div className="relative z-10">

          {/* HEADER */}
          <div className="mb-12">

            <p className="text-[10px] uppercase tracking-[0.32em] text-[#C7AC60]/80 mb-4">
              Legal Information
            </p>

           <h1
  className="text-[3.2rem] leading-none font-light tracking-tight text-[#C7AC60]"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
  Legal Notice
</h1>

            <p className="mt-5 max-w-[760px] text-[15px] leading-[1.9] text-white/45">
              Lonara Labs develops advanced biological profiling technologies designed to support wellness optimization, longevity education, and personal health awareness through data-driven analysis and artificial intelligence.
            </p>

          </div>

          {/* CONTENT */}
          <div className="space-y-12">

            <section>

              <h2
  className="text-[1.35rem] tracking-[0.04em] text-[#C7AC60] mb-5"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
                Company Information
              </h2>

              <div className="space-y-4 text-[15px] leading-[1.95] text-white/58">

                <p>
                  Lonara Labs is an advanced longevity and biological intelligence platform focused on translating modern scientific research, biomarker interpretation, and AI-assisted wellness analysis into accessible digital experiences.
                </p>

                <p>
                  The platform combines computational health modeling, biological profiling methodologies, and educational wellness frameworks intended to support informed lifestyle optimization and preventative health awareness.
                </p>

              </div>

            </section>

            <section>

              <h2
  className="text-[1.35rem] tracking-[0.04em] text-[#C7AC60] mb-5"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
                Informational Purpose
              </h2>

              <div className="space-y-4 text-[15px] leading-[1.95] text-white/58">

                <p>
                  All content, scores, protocols, recommendations, visualizations, biological interpretations, and analytical outputs provided by Lonara Labs are intended exclusively for informational, educational, and wellness-oriented purposes.
                </p>

                <p>
                  The platform does not provide medical diagnoses, emergency care, pharmaceutical prescriptions, or regulated healthcare services.
                </p>

              </div>

            </section>

            <section>

              <h2
  className="text-[1.35rem] tracking-[0.04em] text-[#C7AC60] mb-5"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
                No Medical Advice
              </h2>

              <div className="space-y-4 text-[15px] leading-[1.95] text-white/58">

                <p>
                  Lonara Labs does not operate as a medical institution, healthcare provider, hospital, diagnostic laboratory, or licensed clinical practice.
                </p>

                <p>
                  Users should always consult qualified healthcare professionals before making medical decisions or implementing major lifestyle interventions.
                </p>

              </div>

            </section>

            <section>

              <h2
  className="text-[1.35rem] tracking-[0.04em] text-[#C7AC60] mb-5"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
                Data Protection & Privacy
              </h2>

              <div className="space-y-4 text-[15px] leading-[1.95] text-white/58">

                <p>
                  Lonara Labs is committed to protecting user confidentiality, biological data integrity, and platform security through modern encryption standards and secure infrastructure.
                </p>

                <p>
                  Information submitted through the platform may be used to improve analytical systems, personalization quality, and AI model performance.
                </p>

              </div>

            </section>

            <section>

              <h2
  className="text-[1.35rem] tracking-[0.04em] text-[#C7AC60] mb-5"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
                Intellectual Property
              </h2>

              <div className="space-y-4 text-[15px] leading-[1.95] text-white/58">

                <p>
                  All Lonara Labs technologies, visual systems, algorithms, branding assets, interfaces, and platform experiences remain the exclusive intellectual property of Lonara Labs.
                </p>

              </div>

            </section>

            <section>

              <h2
  className="text-[1.35rem] tracking-[0.04em] text-[#C7AC60] mb-5"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
                Platform Usage & Liability
              </h2>

              <div className="space-y-4 text-[15px] leading-[1.95] text-white/58">

                <p>
                  Biological modeling and AI-assisted wellness interpretation inherently involve estimations, probabilistic analysis, and evolving scientific methodologies.
                </p>

                <p>
                  Lonara Labs shall not be held liable for decisions or outcomes resulting from the interpretation of platform-generated information.
                </p>

              </div>

            </section>

          </div>

          {/* FOOTER */}
          <div className="mt-16 flex justify-center">

           <button
  onClick={onClose}
  className="group relative overflow-hidden rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/5 px-10 py-4 text-lg tracking-[0.08em] text-[#C7AC60] backdrop-blur-xl transition-all hover:bg-[#C7AC60]/10 hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
>

  <div className="absolute top-0 left-[18%] w-[64%] h-[1px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />

  <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />

  <span className="relative z-10 flex items-center gap-3 uppercase tracking-[0.18em] text-[12px]">
    <span className="text-lg">←</span>
    Back
  </span>

</button>

          </div>

        </div>

      </div>

    </div>
  )
}