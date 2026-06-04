// src/components/Science.tsx

'use client'

import { useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { sectionContent as sectionContentEN } from './scienceContent.en'
import { sectionContent as sectionContentFR } from './scienceContent.fr'
import { sectionContent as sectionContentES } from './scienceContent.es'

interface ScienceProps {
  onClose: () => void
}

const getSectionId = (section: string) =>
  section
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll('™', '')

const getSubsectionId = (title: string) =>
  title
    .toLowerCase()
    .replace(/™/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/™/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const findHeading = (
  container: HTMLDivElement,
  section: string,
): HTMLElement | null => {
  const normalizedSection = normalizeText(section)
  const headings = Array.from(
    container.querySelectorAll<HTMLHeadingElement>('h1,h2,h3,h4,h5,h6'),
  )

  const found = headings.find((heading) => {
    const text = normalizeText(heading.textContent || '')
    return (
      text === normalizedSection ||
      text.includes(normalizedSection) ||
      normalizedSection.includes(text)
    )
  })

  return found || null
}

const scrollToSection = (
  section: string,
  event: any,
  container: HTMLDivElement | null,
) => {
  event.preventDefault()
  const targetId = getSectionId(section)
  let target = document.getElementById(targetId)

  if (!target && container) {
    target = findHeading(container, section)
  }

  if (!target) {
    return
  }

  if (container) {
    const containerRect = container.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()

    container.scrollTo({
      top: container.scrollTop + targetRect.top - containerRect.top,
      behavior: 'smooth',
    })
    return
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}





export default function Science({ onClose }: ScienceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
const locale = useLocale()
const tSci = useTranslations('science')
const sectionContent = locale === 'fr' ? sectionContentFR
  : locale === 'es' ? sectionContentES
  : sectionContentEN

  const subSections = sectionContent.flatMap((section) => {
  return section.content
    .split(/\n_{5,}\n/)
    .map((block) => {
      const lines = block.trim().split('\n')
      const firstLine = lines[0].trim()
      const match = firstLine.match(/^(\d{2}) — (.+)$/)

      if (!match) {
        return null
      }

      const title = `${match[1]} — ${match[2]}`

      return {
        id: `${section.id}-${getSubsectionId(title)}`,
        title,
        sectionId: section.id,
        content: lines.slice(1).join('\n').trim(),
      }
    })
    .filter(Boolean) as Array<{
      id: string
      title: string
      sectionId: string
      content: string
    }>
})

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[3px] px-4 py-4">
      <div
        ref={containerRef}
        className="relative w-full max-w-[1280px] max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-[1.2rem] md:rounded-[1.8rem] border border-[#71BFE3]/10 bg-[rgba(3,10,20,0.72)] backdrop-blur-[24px] shadow-[0_0_80px_rgba(0,220,255,0.04)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,140,255,0.08),transparent_40%)] pointer-events-none" />
        <div className="absolute top-[-120px] right-[-10%] w-[320px] h-[320px] rounded-full bg-cyan-400/10 blur-3xl opacity-40" />
        <div className="absolute bottom-[-140px] left-[-10%] w-[260px] h-[260px] rounded-full bg-blue-500/10 blur-3xl opacity-40" />
        <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#8FD2FF] to-transparent opacity-90" />

        <button
          onClick={onClose}
          className="absolute top-4 md:top-6 right-4 md:right-6 z-50 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/40 backdrop-blur-xl transition-all hover:border-[#C7AC60]/30 hover:bg-[#C7AC60]/10 hover:text-[#E7D19A]"
        >
          <span className="text-[16px] md:text-[18px] leading-none">×</span>
        </button>

        <div className="relative z-10 flex">
          {/* Sidebar — desktop only, unchanged */}
          <div className="sticky top-0 max-h-[calc(92vh-4rem)] overflow-y-auto pr-4 w-[260px] border-r border-white/[0.04] px-8 py-10 hidden lg:block">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#C7AC60]/70 mb-8">
              Framework
            </p>
            <div className="space-y-3">
              {subSections.map((subSection, index) => (
                <a
                  key={subSection.id}
                  href={`#${subSection.id}`}
                  onClick={(event) => scrollToSection(subSection.id, event, containerRef.current)}
                  className="group block cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-[#C7AC60]/40 tracking-[0.22em]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[12px] tracking-[0.08em] text-white/45 transition-all group-hover:text-[#C7AC60]">
                      {subSection.title}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 px-4 md:px-8 py-8 md:py-10 lg:px-14 lg:py-12">
            <div className="mb-10 md:mb-16">
             <p className="text-[10px] md:text-[15px] uppercase tracking-[0.28em] md:tracking-[0.32em] text-[#C7AC60]/80 mb-3 md:mb-5">
  {tSci('label')}
</p>
<h1
  className="text-[2.8rem] md:text-[4rem] leading-[0.92] font-light tracking-[0.01em] text-[#EAE4D5]"
  style={{ fontFamily: "'Cormorant Garamond', serif" }}
>
  {tSci('title')}
</h1>
<p className="mt-3 md:mt-6 text-[10px] md:text-[13px] uppercase tracking-[0.22em] md:tracking-[0.28em] text-[#71BFE3]/65">
  {tSci('subtitle')}
</p>
<p className="mt-5 md:mt-8 max-w-[920px] text-[13px] md:text-[16px] leading-[1.85] md:leading-[2] text-white/50">
  {tSci('intro1')}
</p>
<p className="mt-4 md:mt-6 max-w-[920px] text-[13px] md:text-[16px] leading-[1.85] md:leading-[2] text-white/50">
  {tSci('intro2')}
</p>
            </div>

            {sectionContent.map((section) => (
              <section id={section.id} key={section.id} className="mb-16 md:mb-28">
                <div className="flex items-start gap-4 md:gap-6 mb-5 md:mb-7">
                  <span className="text-[1.5rem] md:text-[2rem] text-[#C7AC60] tracking-[0.02em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {section.title.split(' ')[1]}
                  </span>
                  <div>
                    <h2 className="text-[1.5rem] md:text-[2rem] text-[#C7AC60]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {section.title}
                    </h2>
                    <p className="mt-3 md:mt-5 max-w-[920px] text-[13px] md:text-[15px] leading-[1.85] md:leading-[2] text-white/68">
                      {section.summary}
                    </p>
                  </div>
                </div>

                <div className="space-y-8 md:space-y-12 rounded-[1.2rem] md:rounded-[1.6rem] border border-[#71BFE3]/10 bg-[#07111d]/40 px-4 md:px-8 py-6 md:py-8">
                  {subSections
                    .filter((subSection) => subSection.sectionId === section.id)
                    .map((subSection) => (
                      <article key={subSection.id} id={subSection.id} className="space-y-3 md:space-y-5">
                        <p
                          className="text-[12px] md:text-[15px] uppercase tracking-[0.28em] md:tracking-[0.32em] text-[#C7AC60]/80"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {subSection.title}
                        </p>
                        <div className="text-[13px] md:text-[15px] leading-[1.85] md:leading-[2] text-white/68 whitespace-pre-line">
                          {subSection.content}
                        </div>
                      </article>
                    ))}
                </div>
              </section>
            ))}

            <section>
              <p className="uppercase tracking-[0.24em] md:tracking-[0.28em] text-[#C7AC60]/70 text-[10px] md:text-[11px] mb-3 md:mb-4">
                LONARA LABS · THE ART OF LONGEVITY
              </p>
              <p className="text-[12px] md:text-[14px] leading-[1.9] text-white/58 mt-2 md:mt-3">
                © 2026 Lonara Labs · All rights reserved
              </p>
            </section>

            <div className="mt-8 md:mt-14 flex justify-center">
              <button
                onClick={onClose}
                className="group relative overflow-hidden rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/5 px-7 md:px-10 py-3 md:py-4 text-base md:text-lg tracking-[0.08em] text-[#C7AC60] backdrop-blur-xl transition-all hover:bg-[#C7AC60]/10 hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
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
    </div>
  )
}