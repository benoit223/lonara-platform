import { useState } from 'react'
import { FileText, ExternalLink, Clock } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

interface AssessmentItem {
  id: number
  created_at: string
  biological_age?: number | null
  longevity_score?: number | null
  recovery_index?: number | null
  stress_load?: number | null
  pdf_url?: string | null
}

interface UnderstandSectionProps {
  assessmentHistory: AssessmentItem[]
}

function formatFullDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(
    locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  })
}

function ScoreDot({ value }: { value: number | null | undefined }) {
  if (value == null) return <span className="text-white/20">—</span>
  const color = value >= 70 ? '#4ADE80' : value >= 45 ? '#E7C980' : '#FF4444'
  return (
    <span style={{ color }} className="text-[13px] font-light">
      {Math.round(value)}
    </span>
  )
}

export default function UnderstandSection({ assessmentHistory }: UnderstandSectionProps) {
  const t = useTranslations('myspace')
  const locale = useLocale()
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const openPDF = async (assessment: AssessmentItem) => {
    if (!assessment.pdf_url) return
    setLoadingId(assessment.id)
    try {
      const response = await fetch('/api/get-report-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: assessment.pdf_url }),
      })
      const data = await response.json()
      if (data.url) {
        window.open(data.url, '_blank')
      }
    } catch (e) {
      console.error('PDF open error:', e)
    } finally {
      setLoadingId(null)
    }
  }

  if (!assessmentHistory || assessmentHistory.length === 0) {
    return (
      <div className="mt-4 rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 px-6 py-5 backdrop-blur-xl text-center">
        <p className="text-[1.2rem] font-light text-[#EAE4D5]/30 italic"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {t('understand_noReports')}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 mt-2 min-w-0 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0" style={{ maxHeight: '460px', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {assessmentHistory.slice().reverse().map((assessment) => (
          <div
            key={assessment.id}
            className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-6 py-5"
          >
           <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[12px] text-[#EAE4D5]/80">
                  {formatFullDate(assessment.created_at, locale)}
                </p>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-white/25" />
                  <p className="text-[10px] text-white/30">{formatTime(assessment.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-0.5">{t('understand_longevity')}</p>
                  <ScoreDot value={assessment.longevity_score} />
                </div>
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-0.5">{t('understand_bioAge')}</p>
                  <ScoreDot value={assessment.biological_age} />
                </div>
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-0.5">{t('understand_recovery')}</p>
                  <ScoreDot value={assessment.recovery_index} />
                </div>

                {assessment.pdf_url ? (
                  <button
                    onClick={() => openPDF(assessment)}
                    disabled={loadingId === assessment.id}
                    className="flex items-center gap-1.5 rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[#C7AC60] transition hover:bg-[#C7AC60]/20 disabled:opacity-40"
                  >
                    {loadingId === assessment.id ? (
                      <div className="w-3 h-3 rounded-full border border-[#C7AC60]/30 border-t-[#C7AC60] animate-spin" />
                    ) : (
                      <FileText className="h-3 w-3" />
                    )}
                    <span>{t('understand_pdf')}</span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-white/20">
                    <FileText className="h-3 w-3" />
                    <span>{t('understand_noPdf')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-white/55 leading-relaxed text-center">
        {t('understand_upTo50')}
      </p>
    </div>
  )
}