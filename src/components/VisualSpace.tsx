'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { supabase } from '../lib/supabase'

interface CaptureShot {
  pose: string
  url: string
  created_at: string
}

// ── PROPS ─────────────────────────────────────────────────────────────────────
interface VisualSpaceProps {
  memberTier: 'guest' | 'member' | 'premium' | 'executive'
  fullName: string
  sex: 'male' | 'female' | 'other'
  onBack: () => void
  onSignOut?: () => void
}

type ActiveSection = 'results' | 'evolve' | 'history' | 'report' | 'captureFace' | 'captureBody' | null

// ── HELPER — fond selon le sexe ──────────────────────────────────────────────
function getVisualBg(sex: 'male' | 'female' | 'other'): string {
  return sex === 'female' ? '/myvisualf.png' : '/myvisualh.png'
}

// ── SECTION — RÉSULTATS ───────────────────────────────────────────────────────
const FACE_POSE_LABELS: Record<string, string> = { center: 'Face', left: 'Profil gauche', right: 'Profil droit' }
const BODY_POSE_LABELS: Record<string, string> = { front: 'Face', back: 'Dos', left: 'Profil gauche', right: 'Profil droit' }

function ResultsSection({ faceShots, bodyShots, loading }: {
  faceShots: CaptureShot[]
  bodyShots: CaptureShot[]
  loading: boolean
}) {
  const t = useTranslations('myspace')
  const hasAny = faceShots.length > 0 || bodyShots.length > 0

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-3">
        {t('visual_menuResults')}
      </p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('visual_resultsTitle')}
      </h2>

      {loading && (
        <p className="text-[13px] text-white/40 italic">Chargement…</p>
      )}

      {!loading && !hasAny && (
        <p className="text-[14px] italic text-white/55" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {t('visual_resultsEmpty')}
        </p>
      )}

      {!loading && faceShots.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 mb-3">Dernière capture — Visage</p>
          <div className="grid grid-cols-3 gap-3 max-w-[560px]">
            {faceShots.map((shot) => (
              <div key={shot.pose} className="flex flex-col items-center gap-2">
                <div className="relative w-full aspect-[3/4] rounded-[12px] overflow-hidden border border-white/8">
                  <img src={shot.url} alt={shot.pose} className="w-full h-full object-cover" />
                </div>
                <p className="text-[9px] uppercase tracking-[0.14em] text-white/50">{FACE_POSE_LABELS[shot.pose] ?? shot.pose}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && bodyShots.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 mb-3">Dernière capture — Corps</p>
          <div className="grid grid-cols-4 gap-3 max-w-[560px]">
            {bodyShots.map((shot) => (
              <div key={shot.pose} className="flex flex-col items-center gap-2">
                <div className="relative w-full aspect-[3/4] rounded-[10px] overflow-hidden border border-white/8">
                  <img src={shot.url} alt={shot.pose} className="w-full h-full object-cover" />
                </div>
                <p className="text-[8px] uppercase tracking-[0.12em] text-white/50 text-center">{BODY_POSE_LABELS[shot.pose] ?? shot.pose}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && hasAny && (
        <p className="mt-8 text-[12px] text-white/35 italic max-w-[600px]">
          L'analyse scientifique détaillée (Griffiths, Glogau, repères posturaux) sera intégrée à cette section prochainement.
        </p>
      )}
    </div>
  )
}

// ── SECTION — ÉVOLUTION (placeholder) ────────────────────────────────────────
function EvolveSection() {
  const t = useTranslations('myspace')
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-3">
        {t('visual_menuEvolve')}
      </p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('visual_evolveTitle')}
      </h2>
      <p className="text-[14px] italic text-white/55" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('visual_evolveEmpty')}
      </p>
    </div>
  )
}

// ── SECTION — HISTORIQUE ──────────────────────────────────────────────────────
interface HistorySession {
  date: string
  faceCount: number
  bodyCount: number
}

function HistorySection({ sessions, loading }: { sessions: HistorySession[]; loading: boolean }) {
  const t = useTranslations('myspace')
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-3">
        {t('visual_menuHistory')}
      </p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('visual_historyTitle')}
      </h2>

      {loading && <p className="text-[13px] text-white/40 italic">Chargement…</p>}

      {!loading && sessions.length === 0 && (
        <p className="text-[14px] italic text-white/55" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {t('visual_historyEmpty')}
        </p>
      )}

      {!loading && sessions.length > 0 && (
        <div className="flex flex-col gap-3 max-w-[600px]">
          {sessions.map((s) => (
            <div key={s.date} className="rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4 flex items-center justify-between">
              <p className="text-[13px] text-white/75">
                {new Date(s.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <div className="flex gap-4 text-[11px] text-white/50">
                {s.faceCount > 0 && <span>{s.faceCount} visage</span>}
                {s.bodyCount > 0 && <span>{s.bodyCount} corps</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── SECTION — RAPPORT (placeholder) ──────────────────────────────────────────
function ReportSection() {
  const t = useTranslations('myspace')
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-3">
        {t('visual_menuReport')}
      </p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('visual_reportTitle')}
      </h2>
      <p className="text-[14px] italic text-white/55" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('visual_reportEmpty')}
      </p>
    </div>
  )
}

// ── SECTION — CAPTURE VISAGE (placeholder) ───────────────────────────────────
function CaptureFaceSection() {
  const t = useTranslations('myspace')
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-3">
        {t('visual_menuCaptureFace')}
      </p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('visual_captureFaceTitle')}
      </h2>
      <p className="text-[14px] leading-[1.9] text-white/60 max-w-[640px] mb-6">
        {t('visual_captureFaceDesc')}
      </p>
      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-8 py-10 flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 rounded-full border border-white/15 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/65">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
        <p className="text-[13px] text-white/55 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {t('visual_captureComingSoon')}
        </p>
      </div>
    </div>
  )
}

// ── SECTION — CAPTURE CORPS (placeholder) ────────────────────────────────────
function CaptureBodySection() {
  const t = useTranslations('myspace')
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-3">
        {t('visual_menuCaptureBody')}
      </p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('visual_captureBodyTitle')}
      </h2>
      <p className="text-[14px] leading-[1.9] text-white/60 max-w-[640px] mb-6">
        {t('visual_captureBodyDesc')}
      </p>
      <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-8 py-10 flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 rounded-full border border-white/15 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/65">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
        <p className="text-[13px] text-white/55 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {t('visual_captureComingSoon')}
        </p>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function VisualSpace({ memberTier, fullName, sex, onBack, onSignOut }: VisualSpaceProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<ActiveSection>(null)
  const [showQR, setShowQR] = useState(false)
  const [qrToken, setQrToken] = useState<string | null>(null)
  const [faceShots, setFaceShots] = useState<CaptureShot[]>([])
  const [bodyShots, setBodyShots] = useState<CaptureShot[]>([])
  const [historySessions, setHistorySessions] = useState<{ date: string; faceCount: number; bodyCount: number }[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  const t = useTranslations('myspace')
  const tGlobal = useTranslations()
  const firstName = fullName.split(' ')[0] || fullName
  const currentBg = getVisualBg(sex)

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timeout)
  }, [])

  // ── Chargement des captures existantes ────────────────────────────────────
  useEffect(() => {
    const loadCaptures = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setDataLoading(false); return }

        const { data: captures } = await supabase
          .from('visual_captures')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!captures || captures.length === 0) { setDataLoading(false); return }

        // Dernière capture par pose (face)
        const latestFace: Record<string, any> = {}
        const latestBody: Record<string, any> = {}
        for (const c of captures) {
          if (c.capture_type === 'face' && !latestFace[c.pose]) latestFace[c.pose] = c
          if (c.capture_type === 'body' && !latestBody[c.pose]) latestBody[c.pose] = c
        }

        const resolveUrl = async (path: string) => {
          const res = await fetch('/api/visual-signed-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path }),
          })
          const json = await res.json()
          return json.url as string
        }

        const faceResolved = await Promise.all(
          Object.values(latestFace).map(async (c: any) => ({
            pose: c.pose, url: await resolveUrl(c.image_url), created_at: c.created_at,
          }))
        )
        const bodyResolved = await Promise.all(
          Object.values(latestBody).map(async (c: any) => ({
            pose: c.pose, url: await resolveUrl(c.image_url), created_at: c.created_at,
          }))
        )
        setFaceShots(faceResolved)
        setBodyShots(bodyResolved)

        // Historique — regroupement par jour
        const byDay: Record<string, { faceCount: number; bodyCount: number }> = {}
        for (const c of captures) {
          const day = new Date(c.created_at).toISOString().split('T')[0]
          if (!byDay[day]) byDay[day] = { faceCount: 0, bodyCount: 0 }
          if (c.capture_type === 'face') byDay[day].faceCount++
          else byDay[day].bodyCount++
        }
        setHistorySessions(
          Object.entries(byDay)
            .map(([date, v]) => ({ date, ...v }))
            .sort((a, b) => b.date.localeCompare(a.date))
        )
      } catch (e) {
        console.error('VisualSpace loadCaptures error:', e)
      } finally {
        setDataLoading(false)
      }
    }
    loadCaptures()
  }, [])

const generateQRToken = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    await supabase.from('visual_capture_tokens').insert({
      token,
      user_id: user.id,
      expires_at: expiresAt,
    })
    setQrToken(token)
    setShowQR(true)
  }

  const MENU_ITEMS: { id: ActiveSection; label: string }[] = [
    { id: 'results',  label: t('visual_menuResults') },
    { id: 'evolve',   label: t('visual_menuEvolve') },
    { id: 'history',  label: t('visual_menuHistory') },
    { id: 'report',   label: t('visual_menuReport') },
  ]

  const CAPTURE_ITEMS: { id: ActiveSection; label: string }[] = [
    { id: 'captureFace', label: t('visual_menuCaptureFace') },
    { id: 'captureBody', label: t('visual_menuCaptureBody') },
  ]

  const renderSection = () => {
    switch (activeSection) {
      case 'results':     return <ResultsSection faceShots={faceShots} bodyShots={bodyShots} loading={dataLoading} />
      case 'evolve':      return <EvolveSection />
      case 'history':     return <HistorySection sessions={historySessions} loading={dataLoading} />
      case 'report':      return <ReportSection />
      case 'captureFace': return <CaptureFaceSection />
      case 'captureBody': return <CaptureBodySection />
      default: return null
    }
  }

  if (isLoading) return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#040B14] text-white">
      <div className="relative flex flex-col items-center gap-8">
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[#4A90C2]/10 blur-[80px]" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <img src="/LOGOOFFICIELTRANSP.png" alt="Lonara" className="h-16 w-auto opacity-80" />
          <p className="text-[11px] uppercase tracking-[0.38em] text-[#8FC1E8]/80">{t('visual_badge')}</p>
          <h2 className="text-[2.2rem] font-extralight text-[#EAE4D5]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {t('visual_loadingTitle')}
          </h2>
          <p className="text-[14px] text-[#EAE4D5]/65 max-w-[400px] text-center leading-relaxed">
            {t('visual_loadingDesc')}
          </p>
          <div className="flex gap-3 mt-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#4A90C2]/70 animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <section className="fixed inset-0 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('${currentBg}')` }}>
      <div className="absolute inset-0 bg-[#02040A]/25" />

      {/* ── NAVBAR ── */}
      <div className="hidden md:block relative z-40 mx-auto mt-4 max-w-[1850px] px-4 md:px-6 lg:px-0">
        <div className="flex items-center justify-between">
          <img src="/LOGOOFFICIELTRANSP.png" alt="Lonara"
            className="ml-0 mt-3 h-24 md:h-32 lg:h-40 w-auto opacity-95 object-contain" />
          <div className="mr-4 md:mr-8 lg:mr-12 flex items-center gap-4 md:gap-6">
            <span className="text-[11px] md:text-[13px] uppercase tracking-[0.18em] text-white/70">
              {tGlobal('myvisual')} — {firstName}
            </span>
            <button onClick={onBack}
              className="flex items-center gap-2 text-white/60 hover:text-white/85 transition-all text-[11px] md:text-[13px] uppercase tracking-[0.18em]">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t('visual_back')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── BLOC GAUCHE — desktop ── */}
      <div className="hidden md:flex relative z-20 mx-auto max-w-[1850px] min-h-screen items-stretch px-4 md:px-8 lg:px-0">
        <div className="relative flex w-full max-w-[760px] flex-col justify-center px-8 lg:pl-0 lg:pr-16 items-start pointer-events-auto">
          <div className="relative ml-0 max-w-[490px] -mt-16 lg:-mt-[260px]">
            <div className="relative rounded-[32px] lg:rounded-[36px] border border-white/10 bg-black/40 px-10 lg:px-12 py-8 backdrop-blur-[14px] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden h-[500px] lg:h-[524px]">
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#8FC1E8] to-transparent opacity-70" />

              <p className="mb-6 text-[13px] uppercase tracking-[0.28em] text-[#8FC1E8]/80"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                {t('visual_badge')}
              </p>
              <h2 className="text-[42px] lg:text-[50px] font-light leading-[1.05] text-[#EAE4D5]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('visual_greeting')} <span className="italic">{firstName}</span>
              </h2>
              <p className="mt-3 text-[14px] font-[450] leading-[1.75] italic text-white/70 max-w-[380px]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('visual_tagline')}
              </p>

              <div className="mt-5 h-px bg-gradient-to-r from-white/15 to-transparent mb-4" />

              {/* Menu navigation — consultation */}
              <nav className="flex flex-col">
                {MENU_ITEMS.map((item) => {
                  const isActive = activeSection === item.id
                  return (
                    <button key={item.id}
                      onClick={() => setActiveSection(prev => prev === item.id ? null : item.id)}
                      className={`group relative flex items-center gap-4 rounded-[0.8rem] px-4 py-1 text-left transition-all duration-200 ${
                        isActive ? 'bg-black/20 border border-white/10' : 'border border-transparent hover:bg-black/10'
                      }`}>
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-[#8FC1E8]" />}
                      <span className={`text-[12px] uppercase tracking-[0.24em] transition-all ${
                        isActive ? 'text-[#8FC1E8] font-medium' : 'text-white/65 group-hover:text-white/80'
                      }`}>
                        {item.label}
                      </span>
                      {isActive && <ChevronRight className="ml-auto h-3 w-3 text-white/50" />}
                    </button>
                  )
                })}

                {/* Actions de capture — en bas, comme Scan/Setup dans My Fuel */}
                {CAPTURE_ITEMS.map((item) => {
                  const isActive = activeSection === item.id
                  return (
                    <button key={item.id}
                      onClick={() => setActiveSection(prev => prev === item.id ? null : item.id)}
                      className={`group relative flex items-center gap-4 rounded-[0.8rem] px-4 py-1 text-left border transition-all duration-200 ${
                        isActive ? 'bg-black/20 border-white/10' : 'border-transparent hover:bg-black/10'
                      }`}>
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-[#8FC1E8]" />}
                      <span className={`text-[12px] uppercase tracking-[0.24em] transition-all ${
                        isActive ? 'text-[#8FC1E8] font-medium' : 'text-[#8FC1E8]/70 group-hover:text-[#8FC1E8]/90'
                      }`}>
                        {item.label}
                      </span>
                      {isActive && <ChevronRight className="ml-auto h-3 w-3 text-white/50" />}
                    </button>
                  )
                })}

                <button onClick={generateQRToken}
                  className="group relative flex items-center gap-4 rounded-[0.8rem] px-4 py-1 mt-2 text-left border border-transparent hover:bg-black/10 transition-all duration-200">
                  <span className="text-[12px] uppercase tracking-[0.24em] text-white/55 group-hover:text-white/75">
                    {t('visual_connectPhone')}
                  </span>
                </button>
                <button onClick={onSignOut}
                  className="group relative flex items-center gap-4 rounded-[0.8rem] px-4 py-1 text-left border border-transparent hover:bg-black/10 transition-all duration-200">
                  <span className="text-[12px] uppercase tracking-[0.24em] text-white/55 group-hover:text-white/75">
                    {t('signOut')}
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* ── CONTENU SECTION — droite ── */}
        {activeSection && (
          <div className="hidden md:flex absolute left-[520px] lg:left-[600px] top-0 right-0 bottom-[40px] items-start z-30 px-10 lg:px-16 pt-[160px]">
            <div className="w-full max-w-[960px] min-w-0 overflow-hidden">
              {renderSection()}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          MOBILE
      ══════════════════════════════════════ */}
      <div className="md:hidden flex flex-col h-full">
        <div className="relative z-40 mx-auto mt-4 flex w-full items-center justify-between bg-transparent px-4">
          <img src="/LOGOOFFICIELTRANSP.png" alt="Lonara"
            className="ml-0 mt-3 h-24 w-auto opacity-95 object-contain" />
          <button onClick={onBack} className="text-white/60 hover:text-white/85 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute z-20 left-0 right-0 flex justify-center px-4"
          style={{ top: '130px', bottom: '40px' }}>
          <div className="flex flex-col w-full max-w-[340px] gap-3">
            <div className="relative w-full rounded-[20px] border border-white/10 bg-black/40 px-5 py-4 backdrop-blur-[14px] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#8FC1E8] to-transparent opacity-70" />
              <p className="mb-2 text-[9px] uppercase tracking-[0.22em] text-[#8FC1E8]/80" style={{ fontFamily: 'Inter, sans-serif' }}>
                {t('visual_badge')}
              </p>
              <h2 className="text-[28px] font-light leading-[1.05] text-[#EAE4D5]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('visual_greeting')} <span className="italic">{firstName}</span>
              </h2>
              <p className="mt-2 text-[12px] font-light leading-[1.7] italic text-white/70"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t('visual_tagline')}
              </p>

              <div className="mt-3 h-px bg-gradient-to-r from-white/15 to-transparent mb-3" />

              <nav className="flex flex-col">
                {MENU_ITEMS.map((item) => {
                  const isActive = activeSection === item.id
                  return (
                    <button key={item.id}
                      onClick={() => setActiveSection(prev => prev === item.id ? null : item.id)}
                      className={`group relative flex items-center gap-3 rounded-[0.8rem] px-3 py-1.5 text-left transition-all ${
                        isActive ? 'bg-black/20 border border-white/10' : 'border border-transparent'
                      }`}>
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-[#8FC1E8]" />}
                      <span className={`text-[11px] uppercase tracking-[0.24em] ${
                        isActive ? 'text-[#8FC1E8] font-medium' : 'text-white/65'
                      }`}>{item.label}</span>
                      {isActive && <ChevronRight className="ml-auto h-3 w-3 text-white/50" />}
                    </button>
                  )
                })}

                {CAPTURE_ITEMS.map((item) => {
                  const isActive = activeSection === item.id
                  return (
                    <button key={item.id}
                      onClick={() => setActiveSection(prev => prev === item.id ? null : item.id)}
                      className={`group relative flex items-center gap-3 rounded-[0.8rem] px-3 py-1.5 text-left border transition-all ${
                        isActive ? 'bg-black/20 border-white/10' : 'border-transparent'
                      }`}>
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-[#8FC1E8]" />}
                      <span className={`text-[11px] uppercase tracking-[0.24em] ${
                        isActive ? 'text-[#8FC1E8] font-medium' : 'text-[#8FC1E8]/70'
                      }`}>{item.label}</span>
                      {isActive && <ChevronRight className="ml-auto h-3 w-3 text-white/50" />}
                    </button>
                  )
                })}

                <button onClick={generateQRToken}
                  className="group flex items-center gap-3 rounded-[0.8rem] px-3 py-1.5 text-left border border-transparent transition-all">
                  <span className="text-[11px] uppercase tracking-[0.24em] text-white/55">
                    {t('visual_connectPhone')}
                  </span>
                </button>
                <button onClick={onSignOut}
                  className="group flex items-center gap-3 rounded-[0.8rem] px-3 py-1.5 mt-1 text-left border border-transparent transition-all">
                  <span className="text-[11px] uppercase tracking-[0.24em] text-white/55">
                    {t('signOut')}
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* SECTION CONTENT MOBILE — overlay pleine largeur */}
        {activeSection && (
          <div className="absolute inset-0 z-50 bg-cover bg-center" style={{ backgroundImage: `url('${currentBg}')` }}>
            <div className="absolute inset-0 bg-[#02040A]/50" />
            <div className="relative z-10 flex flex-col h-full overflow-y-auto">
              <div className="flex items-center justify-between px-4 pt-6 pb-3 shrink-0">
                <button onClick={() => setActiveSection(null)}
                  className="flex items-center gap-2 text-white/60 text-[11px] uppercase tracking-[0.18em]">
                  <ArrowLeft className="h-4 w-4" />
                  {t('visual_back')}
                </button>
              </div>
              <div className="px-4 pb-8 flex-1">
                {renderSection()}
              </div>
            </div>
          </div>
        )}
      </div>

      {showQR && qrToken && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative rounded-[24px] border border-white/10 bg-[#040B14] px-10 py-8 flex flex-col items-center gap-6 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 left-[12%] w-[76%] h-[2px] bg-gradient-to-r from-transparent via-[#4A90C2] to-transparent opacity-70" />
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80">{t('visual_connectPhone')}</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://app.lonaralabs.com/fr/visual-capture?token=${qrToken}`)}&bgcolor=040B14&color=8FC1E8`}
              alt="QR Code"
              className="w-[200px] h-[200px] rounded-[12px]"
            />
            <p className="text-[12px] text-white/45 text-center max-w-[240px] leading-relaxed">
              {t('visual_connectPhoneDesc')}
            </p>
            <button onClick={() => { setShowQR(false); setQrToken(null) }}
              className="text-[11px] uppercase tracking-[0.18em] text-white/35 hover:text-white/55 transition">
              {t('visual_connectPhoneClose')}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}