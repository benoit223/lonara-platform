'use client'

import { useTranslations } from 'next-intl'

interface PrivacyPolicyProps {
  onClose: () => void
}

export default function PrivacyPolicy({
  onClose,
}: PrivacyPolicyProps) {
  const t = useTranslations()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[3px] px-4 py-4">

      <div className="relative w-full max-w-[1100px] max-h-[88vh] overflow-y-auto overflow-x-hidden rounded-[1.8rem] md:rounded-[1.8rem] rounded-[1.2rem] border border-[#71BFE3]/10 bg-[rgba(3,10,20,0.68)] backdrop-blur-[20px] px-4 md:px-8 py-6 md:py-8 shadow-[0_0_50px_rgba(0,220,255,0.03)]">

        {/* GLOW */}
        <div className="absolute left-[-120px] top-[-120px] h-[180px] w-[180px] rounded-full bg-[#035AA8]/8 blur-[120px]" />
        <div className="absolute right-[-80px] bottom-[-80px] h-[140px] w-[140px] rounded-full bg-[#C7AC60]/8 blur-[100px]" />
        <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#8FD2FF] to-transparent opacity-90" />

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 md:top-6 right-4 md:right-6 z-50 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/40 backdrop-blur-xl transition-all hover:border-[#C7AC60]/30 hover:bg-[#C7AC60]/10 hover:text-[#E7D19A]"
        >
          <span className="text-[16px] md:text-[18px] leading-none">×</span>
        </button>

        <div className="relative z-10">

          {/* HEADER */}
          <div className="mb-6 md:mb-10">

            <p className="text-[10px] md:text-[12px] uppercase tracking-[0.28em] md:tracking-[0.32em] text-[#C7AC60]/80 mb-2">
              {t('privacy.label')}
            </p>

            <h1
              className="text-[2.8rem] md:text-[4.5rem] leading-none font-light tracking-[0.01em] text-[#EAE4D5]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {t('privacy.title')}
            </h1>

            <p className="mt-3 md:mt-5 max-w-[760px] text-[13px] md:text-[15px] leading-[1.8] md:leading-[1.9] text-white/45">
              {t('privacy.description')}
            </p>

          </div>

          {/* CONTENT */}
          <div className="space-y-6 md:space-y-10 text-[13px] md:text-[15px] leading-[1.85] md:leading-[1.95] text-white/58">

            <section>
              <h2
                className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {t('privacy.s1title')}
              </h2>
              <p>
                {t('privacy.s1')}
              </p>
            </section>

            <section>
              <h2
                className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {t('privacy.s2title')}
              </h2>
              <p>
                {t('privacy.s2')}
              </p>
            </section>

            <section>
              <h2
                className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {t('privacy.s3title')}
              </h2>
              <p>
                {t('privacy.s3')}
              </p>
            </section>

            <section>
              <h2
                className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {t('privacy.s4title')}
              </h2>
              <p>
                {t('privacy.s4')}
              </p>
            </section>

            <section>
              <h2
                className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {t('privacy.s5title')}
              </h2>
              <p>
                {t('privacy.s5')}
              </p>
            </section>

            <section>
              <h2
                className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {t('privacy.s6title')}
              </h2>
              <p>
                {t('privacy.s6')}
              </p>
            </section>

          </div>

          {/* FOOTER */}
          <div className="mt-8 md:mt-14 flex justify-center">
            <button
              onClick={onClose}
              className="group relative overflow-hidden rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/5 px-7 md:px-10 py-3 md:py-4 text-base md:text-lg tracking-[0.08em] text-[#C7AC60] backdrop-blur-xl transition-all hover:bg-[#C7AC60]/10 hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
            >
              <div className="absolute top-0 left-[18%] w-[64%] h-[1px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />
              <span className="relative z-10 flex items-center gap-3 uppercase tracking-[0.18em] text-[12px]">
                <span className="text-lg">←</span>
                {t('privacy.back')}
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}