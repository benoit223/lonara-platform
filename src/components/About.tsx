'use client'

import { useTranslations } from 'next-intl'

interface AboutProps {
  onClose: () => void
}

export default function About({ onClose }: AboutProps) {
  const t = useTranslations('about')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[3px] px-4 py-4">
      <div className="relative w-full max-w-[1100px] max-h-[88vh] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden scrollbar-none rounded-[1.2rem] md:rounded-[1.8rem] border border-[#71BFE3]/10 bg-[rgba(3,10,20,0.72)] backdrop-blur-[20px] px-4 md:px-8 py-6 md:py-8 shadow-[0_0_50px_rgba(0,220,255,0.03)]">
        <div className="absolute left-[-120px] top-[-120px] h-[180px] w-[180px] rounded-full bg-[#035AA8]/8 blur-[120px]" />
        <div className="absolute right-[-80px] bottom-[-80px] h-[140px] w-[140px] rounded-full bg-[#C7AC60]/8 blur-[100px]" />
        <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#8FD2FF] to-transparent opacity-90" />

        <button
          onClick={onClose}
          className="absolute top-4 md:top-6 right-4 md:right-6 z-50 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/40 backdrop-blur-xl transition-all hover:border-[#C7AC60]/30 hover:bg-[#C7AC60]/10 hover:text-[#E7D19A]"
        >
          <span className="text-[16px] md:text-[18px] leading-none">x</span>
        </button>

        <div className="relative z-10 space-y-8 md:space-y-10 text-[13px] md:text-[14px] leading-[1.85] md:leading-[1.9] text-white/65">
          <div className="space-y-3 md:space-y-4">
            <p className="text-[10px] md:text-[16px] uppercase tracking-[0.28em] md:tracking-[0.32em] text-[#C7AC60]/80">
              {t('label')}
            </p>
            <h1 className="text-[2.8rem] md:text-[4rem] leading-none font-light tracking-[0.01em] text-[#EAE4D5]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t('title')}
            </h1>
            <p className="mt-3 md:mt-6 text-[10px] md:text-[13px] uppercase tracking-[0.22em] md:tracking-[0.28em] text-[#71BFE3]/65">
              {t('subtitle')}
            </p>
          </div>

          {/* SECTION 01 */}
          <section className="space-y-3 md:space-y-4 pt-6 md:pt-8">
            <p className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t('section1.title')}
            </p>
            <p>{t('section1.p1')}</p>
            <p>{t('section1.p2')}</p>
            <p>{t('section1.p3')}</p>
            <div className="grid gap-3 md:gap-4 lg:grid-cols-2">
              <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
                <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-2 md:mb-3">{t('section1.missionLabel')}</p>
                <p>{t('section1.mission')}</p>
              </div>
              <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
                <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-2 md:mb-3">{t('section1.visionLabel')}</p>
                <p>{t('section1.vision')}</p>
              </div>
            </div>
            <p className="text-[#EAE4D5]/70 italic">{t('section1.quote')}</p>
          </section>

          {/* SECTION 02 */}
          <section className="space-y-3 md:space-y-4 pt-6 md:pt-8">
            <p className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t('section2.title')}
            </p>
            <p>{t('section2.p1')}</p>
            <p>{t('section2.p2')}</p>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-3 md:mb-4">{t('section2.whiteSpaceLabel')}</p>
              <ul className="space-y-2 md:space-y-3 list-disc pl-5 text-white/70">
                <li>{t('section2.whiteSpace1')}</li>
                <li>{t('section2.whiteSpace2')}</li>
                <li>{t('section2.whiteSpace3')}</li>
              </ul>
              <p className="mt-3 md:mt-4">{t('section2.whiteSpaceConclusion')}</p>
            </div>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-3 md:mb-4">{t('section2.differenceLabel')}</p>
              <p>{t('section2.difference')}</p>
            </div>
          </section>

          {/* SECTION 03 */}
          <section className="space-y-3 md:space-y-4 pt-6 md:pt-8">
            <p className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t('section3.title')}
            </p>
            <p>{t('section3.p1')}</p>
            <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
              <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
                <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-2 md:mb-3">{t('section3.activateLabel')}</p>
                <p>{t('section3.activate')}</p>
              </div>
              <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
                <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-2 md:mb-3">{t('section3.balanceLabel')}</p>
                <p>{t('section3.balance')}</p>
              </div>
              <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
                <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-2 md:mb-3">{t('section3.protectLabel')}</p>
                <p>{t('section3.protect')}</p>
              </div>
              <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
                <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-2 md:mb-3">{t('section3.restoreLabel')}</p>
                <p>{t('section3.restore')}</p>
              </div>
            </div>
            <p>{t('section3.p2')}</p>
            <p>{t('section3.p3')}</p>
          </section>

          {/* SECTION 04 */}
          <section className="space-y-3 md:space-y-4 pt-6 md:pt-8">
            <p className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t('section4.title')}
            </p>
            <p>{t('section4.p1')}</p>
            <p>{t('section4.p2')}</p>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-3 md:mb-4">{t('section4.deliversLabel')}</p>
              <ul className="space-y-2 md:space-y-3 list-disc pl-5 text-white/70">
                {(t.raw('section4.delivers') as string[]).map((item: string, i: number) => (
                  <li key={i} className={i === 7 ? 'pt-3 text-[#C7AC60] font-medium' : i > 7 ? 'ml-4 md:ml-6' : ''}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-3 md:mb-4">{t('section4.scalableLabel')}</p>
              <p>{t('section4.scalable')}</p>
            </div>
          </section>

          {/* SECTION 05 */}
          <section className="space-y-3 md:space-y-4 pt-6 md:pt-8">
            <p className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t('section5.title')}
            </p>
            <p>{t('section5.p1')}</p>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-3 md:mb-4">{t('section5.domainsLabel')}</p>
              <ul className="space-y-1 md:space-y-2 pl-5 text-white/70 list-disc">
                {(t.raw('section5.domains') as string[]).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <p>{t('section5.p2')}</p>
            <p>{t('section5.p3')}</p>
          </section>

          {/* SECTION 06 */}
          <section className="space-y-3 md:space-y-4 pt-6 md:pt-8">
            <p className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t('section6.title')}
            </p>
            <p>{t('section6.p1')}</p>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-3 md:mb-4">{t('section6.architectureLabel')}</p>
              <ul className="space-y-2 md:space-y-3 list-disc pl-5 text-white/70">
                {(t.raw('section6.architecture') as string[]).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-3 md:mb-4">{t('section6.aiLabel')}</p>
              <p>{t('section6.aiIntro')}</p>
              <ul className="space-y-2 md:space-y-3 list-disc pl-5 text-white/70 mt-3">
                {(t.raw('section6.ai') as string[]).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <p>{t('section6.p2')}</p>
          </section>

          {/* SECTION 07 */}
          <section className="space-y-3 md:space-y-4 pt-6 md:pt-8">
            <p className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t('section7.title')}
            </p>
            <p>{t('section7.p1')}</p>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-3 md:mb-4">{t('section7.biomarkerLabel')}</p>
              <ul className="space-y-2 md:space-y-3 list-disc pl-5 text-white/70">
                {(t.raw('section7.biomarkers') as string[]).map((item: string, i: number) => (
                  <li key={i}><strong>{item.split(' — ')[0]}</strong>{item.includes(' — ') ? ` — ${item.split(' — ')[1]}` : ''}</li>
                ))}
              </ul>
            </div>
            <p>{t('section7.p2')}</p>
          </section>

          {/* SECTION MY FUEL */}
          <section className="space-y-3 md:space-y-4 pt-6 md:pt-8">
            <p className="text-[1.1rem] md:text-[1.4rem] tracking-[0.04em] text-[#C7AC60]/80 mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t('myfuelTitle')}
            </p>
            <p>{t('myfuelP1')}</p>
            <p>{t('myfuelP2')}</p>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-3 md:mb-4">{t('myfuelLabel')}</p>
              <ul className="space-y-2 md:space-y-3 list-disc pl-5 text-white/70">
                {(t.raw('myfuelFeatures') as string[]).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <p>{t('myfuelP3')}</p>
          </section>

          {/* SECTION MY VISUAL */}
          <section className="space-y-3 md:space-y-4 pt-6 md:pt-8">
            <p className="text-[1.1rem] md:text-[1.4rem] tracking-[0.04em] text-[#C7AC60]/80 mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t('myvisualTitle')}
            </p>
            <p>{t('myvisualP1')}</p>
            <p>{t('myvisualP2')}</p>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-3 md:mb-4">{t('myvisualLabel')}</p>
              <ul className="space-y-2 md:space-y-3 list-disc pl-5 text-white/70">
                {(t.raw('myvisualFeatures') as string[]).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <p>{t('myvisualP3')}</p>
          </section>

          {/* SECTION BIOMARKERS ACTIFS */}
          <section className="space-y-3 md:space-y-4 pt-6 md:pt-8">
            <p className="text-[1.1rem] md:text-[1.4rem] tracking-[0.04em] text-[#C7AC60]/80 mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t('biomarkersActiveTitle')}
            </p>
            <p>{t('biomarkersActiveP1')}</p>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-3 md:mb-4">{t('biomarkersActiveLabel')}</p>
              <ul className="space-y-2 md:space-y-3 list-disc pl-5 text-white/70">
                {(t.raw('biomarkersActivePanels') as string[]).map((item: string, i: number) => (
                  <li key={i}><strong>{item.split(' — ')[0]}</strong>{item.includes(' — ') ? ` — ${item.split(' — ')[1]}` : ''}</li>
                ))}
              </ul>
            </div>
            <p>{t('biomarkersActiveP2')}</p>
          </section>

          {/* SECTION 08 */}
          <section className="space-y-3 md:space-y-4 pt-6 md:pt-8">
            <p className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t('section8.title')}
            </p>
            <p>{t('section8.p1')}</p>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-3 md:mb-4">{t('section8.aiLabel')}</p>
              <ul className="space-y-2 md:space-y-3 list-disc pl-5 text-white/70">
                {(t.raw('section8.ai') as string[]).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-3 md:mb-4">{t('section8.archLabel')}</p>
              <ul className="space-y-2 md:space-y-3 list-disc pl-5 text-white/70">
                {(t.raw('section8.arch') as string[]).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-3 md:mb-4">{t('section8.designLabel')}</p>
              <ul className="space-y-2 md:space-y-3 list-disc pl-5 text-white/70">
                {(t.raw('section8.design') as string[]).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* SECTION 09 */}
          <section className="space-y-3 md:space-y-4 pt-6 md:pt-8">
            <p className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t('section9.title')}
            </p>
            <p>{t('section9.p1')}</p>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-2 md:mb-3">{t('section9.ecosystemLabel')}</p>
              <p>{t('section9.ecosystem')}</p>
            </div>
            <div className="grid gap-3 md:gap-4 lg:grid-cols-2">
              <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
                <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-2 md:mb-3">{t('section9.platformLabel')}</p>
                <p>{t('section9.platform')}</p>
              </div>
              <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
                <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-2 md:mb-3">{t('section9.kioskLabel')}</p>
                <p>{t('section9.kiosk')}</p>
              </div>
              <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
                <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-2 md:mb-3">{t('section9.mobileLabel')}</p>
                <p>{t('section9.mobile')}</p>
              </div>
              <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
                <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-2 md:mb-3">{t('section9.displayLabel')}</p>
                <p>{t('section9.display')}</p>
              </div>
            </div>
            <div className="grid gap-3 md:gap-4 lg:grid-cols-2">
              <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
                <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-2 md:mb-3">{t('section9.executiveLabel')}</p>
                <p>{t('section9.executive')}</p>
              </div>
              <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
                <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-2 md:mb-3">{t('section9.kidsLabel')}</p>
                <p>{t('section9.kids')}</p>
              </div>
            </div>
          </section>

          {/* SECTION 10 */}
          <section className="space-y-3 md:space-y-4 pt-6 md:pt-8 pb-8 md:pb-12">
            <p className="text-[1.5rem] md:text-[2.0rem] tracking-[0.04em] text-[#C7AC60] mb-3 md:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t('section10.title')}
            </p>
            <p>{t('section10.p1')}</p>
            <p>{t('section10.p2')}</p>
            <div className="rounded-[1.2rem] md:rounded-[1.5rem] border border-[#C7AC60]/10 bg-white/[0.03] p-4 md:p-5">
              <p className="text-[#C7AC60] uppercase tracking-[0.18em] text-[10px] md:text-[11px] mb-3 md:mb-4">{t('section10.apartLabel')}</p>
              <ul className="space-y-2 md:space-y-3 list-disc pl-5 text-white/70">
                {(t.raw('section10.apart') as string[]).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <p className="text-white/75">{t('section10.quote')}</p>
          </section>

          {/* FOOTER */}
          <section>
            <p className="uppercase tracking-[0.24em] md:tracking-[0.28em] text-[#C7AC60]/70 text-[10px] md:text-[11px] mb-3 md:mb-4">
              {t('footer.tagline')}
            </p>
            <p className="text-[12px] md:text-[14px] leading-[1.9] text-white/58 mt-2 md:mt-3">
              {t('footer.copyright')}
            </p>
          </section>

          {/* BACK BUTTON */}
          <div className="mt-8 md:mt-14 flex justify-center">
            <button
              onClick={onClose}
              className="group relative overflow-hidden rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/5 px-7 md:px-10 py-3 md:py-4 text-base md:text-lg tracking-[0.08em] text-[#C7AC60] backdrop-blur-xl transition-all hover:bg-[#C7AC60]/10 hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
            >
              <div className="absolute top-0 left-[18%] w-[64%] h-[1px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />
              <span className="relative z-10 flex items-center gap-3 uppercase tracking-[0.18em] text-[12px]">
                <span className="text-lg">←</span>
                {t('back')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}