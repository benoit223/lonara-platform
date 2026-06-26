'use client'

import { useTranslations } from 'next-intl'

interface UnderstandingReportProps {
  onClose: () => void
}

export default function UnderstandingReport({
  onClose,
}: UnderstandingReportProps) {
  const t = useTranslations('reports')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[3px] px-4 py-4">

      <div className="relative w-full max-w-[1100px] max-h-[88vh] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden scrollbar-none rounded-[1.2rem] md:rounded-[1.8rem] border border-[#71BFE3]/10 bg-[rgba(3,10,20,0.72)] backdrop-blur-[20px] px-4 md:px-8 py-6 md:py-8 shadow-[0_0_50px_rgba(0,220,255,0.03)]">

        {/* GLOW */}
        <div className="absolute left-[-120px] top-[-120px] h-[180px] w-[180px] rounded-full bg-[#035AA8]/8 blur-[120px]" />

        <div className="absolute right-[-80px] bottom-[-80px] h-[140px] w-[140px] rounded-full bg-[#C7AC60]/8 blur-[100px]" />

        <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#8FD2FF] to-transparent opacity-90" />

        <button
          onClick={onClose}
          className="absolute top-4 md:top-6 right-4 md:right-6 z-50 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/40 backdrop-blur-xl transition-all hover:border-[#C7AC60]/30 hover:bg-[#C7AC60]/10 hover:text-[#E7D19A]"
        >
          <span className="text-[16px] md:text-[18px] leading-none">×</span>
        </button>

        <div className="relative z-10">

          {/* HEADER */}
          <div className="mb-6 md:mb-10">

            <p className="text-[10px] md:text-[16px] uppercase tracking-[0.28em] md:tracking-[0.32em] text-[#C7AC60]/80 mb-3 md:mb-4">
              {t('label')}
            </p>

            <h1
              className="text-[2.8rem] md:text-[4rem] leading-none font-light tracking-[0.01em] text-[#EAE4D5]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              {t('title')}
            </h1>

            <p className="mt-3 md:mt-6 text-[10px] md:text-[13px] uppercase tracking-[0.22em] md:tracking-[0.28em] text-[#71BFE3]/65">
              {t('subtitle')}
            </p>

          </div>

          <div className="space-y-8 md:space-y-10 text-[13px] md:text-[14px] leading-[1.85] md:leading-[1.9] text-white/58">

            <section>
              <h2 className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Introduction · Why This Guide Exists
              </h2>

              <p>{t('intro1')}</p>
              <p>{t('intro2')}</p>
              <p>{t('intro3')}</p>
              <p>{t('intro4')}</p>
              <p>{t('intro5')}</p>
            </section>

            <section>
              <h2 className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('s1title')}
              </h2>

              <p>{t('s1p1')}</p>

              <div className="space-y-6 md:space-y-8 border-l border-[#C7AC60]/20 pl-4 md:pl-6 mt-6 md:mt-8">
                <div>
                  <p className="uppercase tracking-[0.2em] text-[#C7AC60]/80 text-[10px] md:text-[11px] mb-2">{t('s1page1label')}</p>
                  <p>{t('s1page1')}</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.2em] text-[#C7AC60]/80 text-[10px] md:text-[11px] mb-2">{t('s1page2label')}</p>
                  <p>{t('s1page2')}</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.2em] text-[#C7AC60]/80 text-[10px] md:text-[11px] mb-2">{t('s1page3label')}</p>
                  <p>{t('s1page3')}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('s2title')}
              </h2>

              <p>{t('s2p1')}</p>
              <p>{t('s2p2')}</p>
              <p>{t('s2p3')}</p>
              <p>{t('s2p4')}</p>

              <div className="space-y- border-l border-[#C7AC60]/20 pl-4 md:pl-6 mt-6 md:mt-8">
                <div>
                  <p className="text-[#C7AC60] uppercase tracking-[0.16em] text-[10px] md:text-[11px] mb-2">{t('s2r1label')}</p>
                  <p>{t('s2r1')}</p>
                </div>
                <div>
                  <p className="text-[#C7AC60] uppercase tracking-[0.16em] text-[10px] md:text-[11px] mb-2">{t('s2r2label')}</p>
                  <p>{t('s2r2')}</p>
                </div>
                <div>
                  <p className="text-[#C7AC60] uppercase tracking-[0.16em] text-[10px] md:text-[11px] mb-2">{t('s2r3label')}</p>
                  <p>{t('s2r3')}</p>
                </div>
                <div>
                  <p className="text-[#C7AC60] uppercase tracking-[0.16em] text-[10px] md:text-[11px] mb-2">{t('s2r4label')}</p>
                  <p>{t('s2r4')}</p>
                </div>
                <div>
                  <p className="text-[#C7AC60] uppercase tracking-[0.16em] text-[10px] md:text-[11px] mb-2">{t('s2r5label')}</p>
                  <p>{t('s2r5')}</p>
                </div>
              </div>

              <p className="pt-2">{t('s2p5')}</p>
              <p>{t('s2p6')}</p>
              <p className="font-semibold text-white/80">{t('s2key')}</p>
            </section>

            <section>
              <h2 className="text-[1.2rem] md:text-[1.35rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('s2btitle')}
              </h2>

              <p>{t('s2bp1')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Recovery</span> {t('s2recovery')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Stress Balance</span> {t('s2stress')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Sleep</span> {t('s2sleep')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Inflammation</span> {t('s2inflam')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Cognition</span> {t('s2cognition')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Performance</span> {t('s2perf')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Longevity Score</span> {t('s2longevity')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Biological Age</span> {t('s2bioage')}</p>
            </section>

            <section>
              <h2 className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('s3title')}
              </h2>

              <p>{t('s3p1')}</p>

              <div className="space-y-5 md:space-y-6 border-l border-[#C7AC60]/20 pl-4 md:pl-6">
                <div>
                  <h3 className="text-[#C7AC60] text-[15px] md:text-[17px] mb-2">{t('s3r1title')}</h3>
                  <p>{t('s3r1p1')}</p>
                  <p>{t('s3r1p2')}</p>
                </div>
                <div>
                  <h3 className="text-[#C7AC60] text-[15px] md:text-[17px] mb-2">{t('s3r2title')}</h3>
                  <p>{t('s3r2p1')}</p>
                  <p>{t('s3r2p2')}</p>
                </div>
                <div>
                  <h3 className="text-[#C7AC60] text-[15px] md:text-[17px] mb-2">{t('s3r3title')}</h3>
                  <p>{t('s3r3p1')}</p>
                  <p>{t('s3r3p2')}</p>
                </div>
                <div>
                  <h3 className="text-[#C7AC60] text-[15px] md:text-[17px] mb-2">{t('s3r4title')}</h3>
                  <p>{t('s3r4p1')}</p>
                  <p>{t('s3r4p2')}</p>
                </div>
                <div>
                  <h3 className="text-[#C7AC60] text-[15px] md:text-[17px] mb-2">{t('s3r5title')}</h3>
                  <p>{t('s3r5p1')}</p>
                  <p>{t('s3r5p2')}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('s4title')}
              </h2>

              <p>{t('s4p1')}</p>
              <p>{t('s4p2')}</p>
              <p>{t('s4p3')}</p>
              <ul className="ml-5 md:ml-6 list-disc space-y-2">
                <li><span className="text-[#C7AC60] font-semibold">Longevity Score</span> — {t('s4li1')}</li>
                <li><span className="text-[#C7AC60] font-semibold">Recovery Score</span> — {t('s4li2')}</li>
                <li><span className="text-[#C7AC60] font-semibold">Inflammation Score</span> — {t('s4li3')}</li>
                <li><span className="text-[#C7AC60] font-semibold">Performance/Vitality Score</span> — {t('s4li4')}</li>
              </ul>
              <p>{t('s4p4')}</p>
              <p className="font-semibold text-white/80">{t('s4key')}</p>
              <p>{t('s4p5')}</p>
              <p className="uppercase tracking-[0.16em] text-[#C7AC60] text-[10px] md:text-[11px] mt-3">
                {t('s4note')}
              </p>
              <p>{t('s4p6')}</p>
            </section>

            <section>
              <h2 className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('s5title')}
              </h2>

              <div className="space-y-6 md:space-y-7">
                <div>
                  <h3 className="text-[#C7AC60] text-[15px] md:text-[17px] mb-2 md:mb-3">{t('s5r1title')}</h3>
                  <p>{t('s5r1p1')}</p>
                  <p>{t('s5r1p2')}</p>
                  <p>{t('s5r1p3')}</p>
                </div>
                <div>
                  <h3 className="text-[#C7AC60] text-[15px] md:text-[17px] mb-2 md:mb-3">{t('s5r2title')}</h3>
                  <p>{t('s5r2p1')}</p>
                  <p>{t('s5r2p2')}</p>
                  <p>{t('s5r2p3')}</p>
                </div>
                <div>
                  <h3 className="text-[#C7AC60] text-[15px] md:text-[17px] mb-2 md:mb-3">{t('s5r3title')}</h3>
                  <p>{t('s5r3p1')}</p>
                  <p>{t('s5r3p2')}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('s6title')}
              </h2>

              <p>{t('s6p1')}</p>
              <p>{t('s6p2')}</p>
              <p>{t('s6p3')}</p>
              <p>{t('s6p4')}</p>
              <div className="space-y-2 md:space-y-3 pl-4 md:pl-6">
                <p><span className="text-[#C7AC60] font-semibold">Critical:</span> {t('s6c1')}</p>
                <p><span className="text-[#C7AC60] font-semibold">Moderate:</span> {t('s6c2')}</p>
                <p><span className="text-[#C7AC60] font-semibold">Opportunity:</span> {t('s6c3')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('s7title')}
              </h2>

              <p>{t('s7p1')}</p>
              <p>{t('s7p2')}</p>
              <ol className="ml-5 md:ml-6 list-decimal space-y-2">
                <li>{t('s7li1')}</li>
                <li>{t('s7li2')}</li>
                <li>{t('s7li3')}</li>
              </ol>
              <p className="font-semibold text-white/80">{t('s7key')}</p>
              <p>{t('s7p3')}</p>
              <p>{t('s7p4')}</p>
            </section>

            <section>
              <h2 className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('s8title')}
              </h2>

              <p>{t('s8p1')}</p>
              <div className="space-y-2 md:space-y-3 pl-4 md:pl-6">
                <p><span className="text-[#C7AC60] font-semibold">Elevated:</span> {t('s8r1')}</p>
                <p><span className="text-[#C7AC60] font-semibold">Moderate:</span> {t('s8r2')}</p>
                <p><span className="text-[#C7AC60] font-semibold">Low:</span> {t('s8r3')}</p>
              </div>
              <p>{t('s8p2')}</p>
              <div className="space-y-2 md:space-y-3 pl-4 md:pl-6">
                <p><span className="font-semibold">30 days:</span> {t('s8t1')}</p>
                <p><span className="font-semibold">90 days:</span> {t('s8t2')}</p>
                <p><span className="font-semibold">6 months:</span> {t('s8t3')}</p>
                <p><span className="font-semibold">12 months:</span> {t('s8t4')}</p>
              </div>
              <p>{t('s8p3')}</p>
            </section>

            <section>
              <h2 className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('s9title')}
              </h2>

              <p>{t('s9p1')}</p>
              <ul className="ml-5 md:ml-6 list-disc space-y-2">
                <li>{t('s9li1')}</li>
                <li>{t('s9li2')}</li>
                <li>{t('s9li3')}</li>
                <li>{t('s9li4')}</li>
                <li>{t('s9li5')}</li>
                <li>{t('s9li6')}</li>
              </ul>
              <p>{t('s9p2')}</p>
              <div className="space-y-2 md:space-y-3 pl-4 md:pl-6">
                <p><span className="font-semibold">Morning:</span> {t('s9t1')}</p>
                <p><span className="font-semibold">Midday:</span> {t('s9t2')}</p>
                <p><span className="font-semibold">Evening:</span> {t('s9t3')}</p>
              </div>
              <p>{t('s9p3')}</p>
              <p>{t('s9p4')}</p>
            </section>

            <section>
              <h2 className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('s10title')}
              </h2>

              <p>{t('s10p1')}</p>
              <p>{t('s10p2')}</p>
              <p>{t('s10can')}</p>
              <ul className="ml-5 md:ml-6 list-disc space-y-2">
                <li>{t('s10li1')}</li>
                <li>{t('s10li2')}</li>
                <li>{t('s10li3')}</li>
                <li>{t('s10li4')}</li>
                <li>{t('s10li5')}</li>
              </ul>
              <p>{t('s10cannot')}</p>
              <ul className="ml-5 md:ml-6 list-disc space-y-2">
                <li>{t('s10li6')}</li>
                <li>{t('s10li7')}</li>
                <li>{t('s10li8')}</li>
                <li>{t('s10li9')}</li>
              </ul>
              <p>{t('s10p3')}</p>
            </section>

            <section>
              <h2 className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('s11title')}
              </h2>

              <p>{t('s11p1')}</p>
              <p>{t('s11p2')}</p>
              <ul className="ml-5 md:ml-6 list-disc space-y-2">
                <li>{t('s11li1')}</li>
                <li>{t('s11li2')}</li>
                <li>{t('s11li3')}</li>
              </ul>
              <p>{t('s11p3')}</p>
              <ul className="ml-5 md:ml-6 list-disc space-y-2">
                <li>{t('s11li4')}</li>
                <li>{t('s11li5')}</li>
                <li>{t('s11li6')}</li>
                <li>{t('s11li7')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('glossaryTitle')}
              </h2>

              <p><span className="text-[#C7AC60] font-semibold">Biological Age</span> — {t('g1')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Adaptive Phase</span> — {t('g2')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Biomarker</span> — {t('g3')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Circadian Stability</span> — {t('g4')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Biological Coherence</span> — {t('g5')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Biological Correlation</span> — {t('g6')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Inflamm-aging</span> — {t('g7')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Longevity Score</span> — {t('g8')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Percentile</span> — {t('g9')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Adaptive Resilience</span> — {t('g10')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Biological Signature</span> — {t('g11')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Autonomic Nervous System (ANS)</span> — {t('g12')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Adaptive Vulnerability</span> — {t('g13')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Dominant Pillar</span> — {t('g14')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Weakness Category</span> — {t('g15')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Ingredient Overlap</span> — {t('g16')}</p>
              <p><span className="text-[#C7AC60] font-semibold">Biological Pillar</span> — {t('g17')}</p>
            </section>

            <section>
              <p className="uppercase tracking-[0.24em] md:tracking-[0.28em] text-[#C7AC60]/70 text-[10px] md:text-[11px] mb-3 md:mb-4">
                {t('footerTagline')}
              </p>
             
              <p className="text-[12px] md:text-[14px] leading-[1.9] text-white/58 mt-2 md:mt-3">
                {t('footerCopyright')}
              </p>
            </section>
          </div>

          <div className="mt-8 md:mt-14 flex justify-center">
            <button
              onClick={onClose}
              className="group relative overflow-hidden rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/5 px-7 md:px-10 py-3 md:py-4 text-base md:text-lg tracking-[0.08em] text-[#C7AC60] backdrop-blur-xl transition-all hover:bg-[#C7AC60]/10 hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
            >
              <div className="absolute top-0 left-[18%] w-[64%] h-[1px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />
              <span className="relative z-10 flex items-center gap-3 uppercase tracking-[0.18em] text-[12px]"><span className="text-lg">←</span>{t('back')}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}