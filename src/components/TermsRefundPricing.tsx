'use client'

import { useTranslations } from 'next-intl'

interface TermsRefundPricingProps {
  onClose: () => void
}

export default function TermsRefundPricing({ onClose }: TermsRefundPricingProps) {
  const t = useTranslations()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[3px] px-4 py-4">
      <div className="relative w-full max-w-[1100px] max-h-[88vh] overflow-y-auto overflow-x-hidden rounded-[1.2rem] md:rounded-[1.8rem] border border-[#C7AC60]/10 bg-[rgba(3,10,20,0.68)] backdrop-blur-[20px] px-4 md:px-8 py-6 md:py-8 shadow-[0_0_50px_rgba(199,172,96,0.04)]">

        {/* AMBIENT GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(199,172,96,0.06),transparent_40%)] pointer-events-none" />
        <div className="absolute top-[-120px] right-[-10%] w-[320px] h-[320px] rounded-full bg-[#C7AC60]/8 blur-3xl opacity-40" />
        <div className="absolute bottom-[-140px] left-[-10%] w-[260px] h-[260px] rounded-full bg-[#C7AC60]/6 blur-3xl opacity-40" />

        {/* TOP LIGHT */}
        <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 md:top-6 right-4 md:right-6 z-50 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/40 backdrop-blur-xl transition-all hover:border-[#C7AC60]/30 hover:bg-[#C7AC60]/10 hover:text-[#E7D19A]"
        >
          <span className="text-[16px] md:text-[18px] leading-none">×</span>
        </button>

        <div className="relative z-10">

          {/* HEADER */}
          <div className="mb-6 md:mb-12">
            <p className="text-[10px] md:text-[12px] uppercase tracking-[0.28em] md:tracking-[0.32em] text-[#C7AC60]/80 mb-2">
              {t('terms.label')}
            </p>
            <h1
              className="text-[2.8rem] md:text-[4.5rem] leading-none font-light tracking-[0.01em] text-[#EAE4D5]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {t('terms.title')}
            </h1>
            <p className="mt-3 md:mt-5 max-w-[760px] text-[13px] md:text-[15px] leading-[1.8] md:leading-[1.9] text-white/45">
              {t('terms.description')}
            </p>
          </div>

          {/* ── SECTION 1 : CONDITIONS D'UTILISATION ── */}
          <div className="mb-10 md:mb-16">
            <h2
              className="text-[1.8rem] md:text-[2.4rem] tracking-[0.04em] text-[#C7AC60] mb-6 pb-3 border-b border-[#C7AC60]/15"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {t('terms.s1title')}
            </h2>
            <div className="space-y-8 md:space-y-10">

              <section>
                <h3 className="text-[1.2rem] md:text-[1.5rem] tracking-[0.04em] text-[#C7AC60]/80 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {t('terms.s1_1title')}
                </h3>
                <div className="space-y-3 text-[13px] md:text-[15px] leading-[1.85] md:leading-[1.95] text-white/58">
                  <p>{t('terms.s1_1p1')}</p>
                  <p>{t('terms.s1_1p2')}</p>
                </div>
              </section>

              <section>
                <h3 className="text-[1.2rem] md:text-[1.5rem] tracking-[0.04em] text-[#C7AC60]/80 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {t('terms.s1_2title')}
                </h3>
                <div className="space-y-3 text-[13px] md:text-[15px] leading-[1.85] md:leading-[1.95] text-white/58">
                  <p>{t('terms.s1_2p1')}</p>
                  <p>{t('terms.s1_2p2')}</p>
                </div>
              </section>

              <section>
                <h3 className="text-[1.2rem] md:text-[1.5rem] tracking-[0.04em] text-[#C7AC60]/80 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {t('terms.s1_3title')}
                </h3>
                <div className="space-y-3 text-[13px] md:text-[15px] leading-[1.85] md:leading-[1.95] text-white/58">
                  <p>{t('terms.s1_3p1')}</p>
                  <p>{t('terms.s1_3p2')}</p>
                </div>
              </section>

              <section>
                <h3 className="text-[1.2rem] md:text-[1.5rem] tracking-[0.04em] text-[#C7AC60]/80 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {t('terms.s1_4title')}
                </h3>
                <div className="space-y-3 text-[13px] md:text-[15px] leading-[1.85] md:leading-[1.95] text-white/58">
                  <p>{t('terms.s1_4p1')}</p>
                </div>
              </section>

            </div>
          </div>

          {/* ── SECTION 2 : POLITIQUE DE REMBOURSEMENT ── */}
          <div className="mb-10 md:mb-16">
            <h2
              className="text-[1.8rem] md:text-[2.4rem] tracking-[0.04em] text-[#C7AC60] mb-6 pb-3 border-b border-[#C7AC60]/15"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {t('terms.s2title')}
            </h2>
            <div className="space-y-8 md:space-y-10">

              {/* General */}
              <section>
                <h3 className="text-[1.2rem] md:text-[1.5rem] tracking-[0.04em] text-[#C7AC60]/80 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {t('terms.s2_1title')}
                </h3>
                <div className="space-y-3 text-[13px] md:text-[15px] leading-[1.85] text-white/58">
                  <p>{t('terms.s2_1p1')}</p>
                </div>
              </section>

              {/* Plans cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Member */}
                <div className="rounded-[1.2rem] border border-[#035AA8]/25 bg-[#035AA8]/[0.06] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[1.4rem] font-light text-[#5C96D8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Member</span>
                    <span className="text-[11px] text-[#5C96D8]/60">1€/mois</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-2">{t('terms.commitment3')}</p>
                  <p className="text-[12px] leading-[1.7] text-white/55">{t('terms.memberRefund')}</p>
                </div>

                {/* Premium */}
                <div className="rounded-[1.2rem] border border-[#C7AC60]/25 bg-[#C7AC60]/[0.06] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[1.4rem] font-light text-[#C7AC60]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Premium</span>
                    <span className="text-[11px] text-[#C7AC60]/60">4€/mois</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-2">{t('terms.commitment6')}</p>
                  <p className="text-[12px] leading-[1.7] text-white/55">{t('terms.premiumRefund')}</p>
                </div>

                {/* Executive */}
                <div className="rounded-[1.2rem] border border-[#C7AC60]/35 bg-gradient-to-b from-[#C7AC60]/[0.10] to-[#C7AC60]/[0.04] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[1.4rem] font-light text-[#E7D19A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Executive</span>
                    <span className="text-[11px] text-[#E7D19A]/60">499€/mois</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-2">{t('terms.commitment6cancel')}</p>
                  <p className="text-[12px] leading-[1.7] text-white/55">{t('terms.executiveRefund')}</p>
                </div>

              </div>

              <section>
                <h3 className="text-[1.2rem] md:text-[1.5rem] tracking-[0.04em] text-[#C7AC60]/80 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {t('terms.s2_2title')}
                </h3>
                <div className="space-y-3 text-[13px] md:text-[15px] leading-[1.85] text-white/58">
                  <p>{t('terms.s2_2p1')}</p>
                  <p>{t('terms.s2_2p2')}</p>
                </div>
              </section>

            </div>
          </div>

          {/* ── SECTION 3 : TARIFICATION ── */}
          <div className="mb-10 md:mb-16">
            <h2
              className="text-[1.8rem] md:text-[2.4rem] tracking-[0.04em] text-[#C7AC60] mb-6 pb-3 border-b border-[#C7AC60]/15"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {t('terms.s3title')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

              {/* Guest */}
              <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.02] p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/35 mb-2">Guest</p>
                <p className="text-[2rem] font-light text-white/70 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t('terms.free')}</p>
                <p className="text-[11px] text-white/35 mb-3">{t('terms.noCommitment')}</p>
                <div className="space-y-1.5">
                  <p className="text-[11px] text-white/45">✓ {t('terms.guestF1')}</p>
                  <p className="text-[11px] text-white/45">✓ {t('terms.guestF2')}</p>
                  <p className="text-[11px] text-white/20">✗ {t('terms.guestF3')}</p>
                </div>
              </div>

              {/* Member */}
              <div className="rounded-[1.2rem] border border-[#035AA8]/25 bg-[#035AA8]/[0.06] p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#5C96D8]/70 mb-2">Member</p>
                <p className="text-[2rem] font-light text-[#5C96D8] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>1€</p>
                <p className="text-[11px] text-white/35 mb-3">{t('terms.perMonthMin3')}</p>
                <div className="space-y-1.5">
                  <p className="text-[11px] text-white/45">✓ {t('terms.memberF1')}</p>
                  <p className="text-[11px] text-white/45">✓ {t('terms.memberF2')}</p>
                  <p className="text-[11px] text-white/45">✓ {t('terms.memberF3')}</p>
                  <p className="text-[11px] text-white/20">✗ {t('terms.memberF4')}</p>
                </div>
              </div>

              {/* Premium */}
              <div className="rounded-[1.2rem] border border-[#C7AC60]/25 bg-[#C7AC60]/[0.06] p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#C7AC60]/70 mb-2">Premium</p>
                <p className="text-[2rem] font-light text-[#C7AC60] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>4€</p>
                <p className="text-[11px] text-white/35 mb-3">{t('terms.perMonthMin6')}</p>
                <div className="space-y-1.5">
                  <p className="text-[11px] text-white/45">✓ {t('terms.premiumF1')}</p>
                  <p className="text-[11px] text-white/45">✓ {t('terms.premiumF2')}</p>
                  <p className="text-[11px] text-white/45">✓ {t('terms.premiumF3')}</p>
                  <p className="text-[11px] text-white/45">✓ {t('terms.premiumF4')}</p>
                </div>
              </div>

              {/* Executive */}
              <div className="rounded-[1.2rem] border border-[#C7AC60]/35 bg-gradient-to-b from-[#C7AC60]/[0.10] to-[#C7AC60]/[0.04] p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#C7AC60]/70 mb-2">Executive™</p>
                <p className="text-[2rem] font-light text-[#E7D19A] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>499€</p>
                <p className="text-[11px] text-white/35 mb-3">{t('terms.perMonthMin6cancel')}</p>
                <div className="space-y-1.5">
                  <p className="text-[11px] text-white/55">✓ {t('terms.executiveF1')}</p>
                  <p className="text-[11px] text-white/55">✓ {t('terms.executiveF2')}</p>
                  <p className="text-[11px] text-white/55">✓ {t('terms.executiveF3')}</p>
                  <p className="text-[11px] text-[#C7AC60]">✓ {t('terms.executiveF4')}</p>
                </div>
              </div>

            </div>

            <div className="space-y-3 text-[13px] md:text-[15px] leading-[1.85] text-white/58">
              <p>{t('terms.s3p1')}</p>
              <p>{t('terms.s3p2')}</p>
            </div>

          </div>

          {/* CONTACT */}
          <div className="rounded-[1.2rem] border border-white/6 bg-white/[0.02] p-5 md:p-6 mb-8">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#C7AC60]/60 mb-2">{t('terms.contactLabel')}</p>
            <p className="text-[13px] md:text-[15px] text-white/55 leading-[1.8]">{t('terms.contactText')}</p>
            <p className="mt-2 text-[13px] text-[#C7AC60]/70">legal@lonaralabs.com</p>
          </div>

          {/* FOOTER */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="group relative overflow-hidden rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/5 px-7 md:px-10 py-3 md:py-4 text-base md:text-lg tracking-[0.08em] text-[#C7AC60] backdrop-blur-xl transition-all hover:bg-[#C7AC60]/10 hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
            >
              <div className="absolute top-0 left-[18%] w-[64%] h-[1px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />
              <span className="relative z-10 flex items-center gap-3 uppercase tracking-[0.18em] text-[12px]">
                <span className="text-lg">←</span>
                {t('terms.back')}
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}