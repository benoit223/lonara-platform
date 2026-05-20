// 2. COLLE CE CODE COMPLET DANS PrivacyPolicy.tsx

'use client'

interface PrivacyPolicyProps {
  onClose: () => void
}

export default function PrivacyPolicy({
  onClose,
}: PrivacyPolicyProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[3px] px-4 py-4">

      <div className="relative w-full max-w-[1100px] max-h-[88vh] overflow-y-auto rounded-[1.8rem] border border-[#71BFE3]/10 bg-[rgba(3,10,20,0.68)] backdrop-blur-[20px] px-8 py-8 shadow-[0_0_50px_rgba(0,220,255,0.03)]">

        {/* GLOW */}
        <div className="absolute left-[-120px] top-[-120px] h-[180px] w-[180px] rounded-full bg-[#035AA8]/8 blur-[120px]" />

        <div className="absolute right-[-80px] bottom-[-80px] h-[140px] w-[140px] rounded-full bg-[#C7AC60]/8 blur-[100px]" />

        {/* CLOSE */}
        <button
          type="button"
          onClick={() => onClose()}
          className="absolute right-5 top-4 z-[100] text-xl text-white/40 transition-all hover:text-white cursor-pointer"
        >
          ×
        </button>

        <div className="relative z-10">

          {/* HEADER */}
          <div className="mb-10">

            <p className="text-[10px] uppercase tracking-[0.32em] text-[#C7AC60]/80 mb-4">
              DATA & CONFIDENTIALITY
            </p>

            <h1
  className="text-[3.2rem] leading-none font-light tracking-tight text-[#C7AC60]"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>

              Privacy Policy

            
            </h1>

            <p className="mt-5 max-w-[760px] text-[15px] leading-[1.9] text-white/45">
              Lonara Labs is committed to protecting the confidentiality, integrity, and security of all biological, personal, and analytical information processed through the platform.
            </p>

          </div>

          {/* CONTENT */}
          <div className="space-y-10 text-[14px] leading-[1.9] text-white/58">

            <section>

              <h2
  className="text-[1.35rem] tracking-[0.04em] text-[#C7AC60] mb-5"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
                Information Collection
              </h2>

              <p>
                Lonara Labs may collect biological metrics, wellness inputs, demographic information, device interactions, and analytical responses in order to generate personalized longevity insights and improve platform intelligence.
              </p>

            </section>

            <section>

           <h2
  className="text-[1.35rem] tracking-[0.04em] text-[#C7AC60] mb-5"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
                Platform Analytics
              </h2>

              <p>
                Certain anonymized interactions and analytical patterns may be used to improve AI-assisted recommendations, system accuracy, platform stability, and biological modeling methodologies.
              </p>

            </section>

            <section>

              <h2
  className="text-[1.35rem] tracking-[0.04em] text-[#C7AC60] mb-5"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
                Data Protection
              </h2>

              <p>
                Lonara Labs uses modern security practices, restricted-access systems, encryption technologies, and infrastructure safeguards intended to protect user confidentiality and platform integrity.
              </p>

            </section>

            <section>

              <h2
  className="text-[1.35rem] tracking-[0.04em] text-[#C7AC60] mb-5"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
                Biological Information
              </h2>

              <p>
                Biological profiling information is processed exclusively for wellness-oriented analysis, personalization, reporting experiences, and platform optimization functionalities.
              </p>

            </section>

            <section>

             <h2
  className="text-[1.35rem] tracking-[0.04em] text-[#C7AC60] mb-5"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
                Third-Party Services
              </h2>

              <p>
                Certain infrastructure providers, hosting platforms, analytics systems, and secure processing services may support Lonara Labs operations while adhering to confidentiality and security standards.
              </p>

            </section>

            <section>

            <h2
  className="text-[1.35rem] tracking-[0.04em] text-[#C7AC60] mb-5"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
                User Rights
              </h2>

              <p>
                Users may request clarification regarding stored information, platform processing practices, or account-related inquiries through official Lonara Labs communication channels.
              </p>

            </section>

          </div>

          {/* FOOTER */}
          <div className="mt-14 flex justify-center">

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