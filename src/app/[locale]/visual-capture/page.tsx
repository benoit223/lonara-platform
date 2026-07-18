'use client'

import { useRef, useState, useEffect } from 'react'
import { useSearchParams, useParams } from 'next/navigation'
import FaceCaptureFlow from '@/components/FaceCaptureFlow'
import BodyCaptureFlow from '@/components/BodyCaptureFlow'

type Status = 'loading' | 'auth' | 'choice' | 'error' | 'install'
type CaptureMode = 'face' | 'body' | null



export default function VisualCapturePage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const [status, setStatus] = useState<Status>('loading')
  const [userId, setUserId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [captureMode, setCaptureMode] = useState<CaptureMode>(null)

  useEffect(() => {
    const init = async () => {
      const token = searchParams.get('token')

      if (token) {
        const res = await fetch('/api/visual-capture-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        if (!res.ok) {
          setErrorMsg('QR code invalide ou expiré')
          setStatus('error')
          return
        }

        const data = await res.json()
        setUserId(data.userId)

        const isInstalled = window.matchMedia('(display-mode: standalone)').matches
        if (!isInstalled) {
          window.history.replaceState({}, '', `/${locale}/visual-capture`)
          setStatus('install')
          return
        }

        setStatus('auth')
        return
      }

      // Pas de token dans l'URL — on tente de lire la session via cookie
      try {
        const sessionRes = await fetch('/api/visual-capture-session')
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json()
          setUserId(sessionData.userId)
          setStatus('auth')
          return
        }
      } catch (e) {
        console.error('Session check error:', e)
      }

      setErrorMsg('Scannez le QR code depuis My Visual → Connecter le téléphone')
      setStatus('error')
    }

    init()
  }, [])

  useEffect(() => {
    if (status !== 'auth') return
    setStatus('choice')
  }, [status])

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <img src="/qqq1.png" alt=""
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none" />

      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative z-10 w-full max-w-lg h-screen flex flex-col items-center justify-start px-6 pt-[8vh]">

          <img src="/LOGOOFFICIELTRANSP.png" alt="Lonara" className="w-64 object-contain select-none" />
          <p className="mt-1 text-[18px] uppercase tracking-[0.28em] text-white/60"
            style={{ fontFamily: 'Inter, sans-serif' }}>MY VISUAL</p>

          <div className="h-[6vh]" />

          {/* Écran installation — identique au pattern My Fuel */}
          {status === 'install' && (
            <div className="flex flex-col items-center gap-8 px-4 text-center">
              <div>
                <p className="text-[24px] font-light text-[#EAE4D5] mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>Une dernière étape</p>
                <p className="text-[14px] text-white/70 leading-relaxed">
                  Installez l'app pour un accès instantané à la caméra guidée
                </p>
              </div>
              <div className="rounded-[16px] border border-white/8 bg-white/[0.03] px-6 py-5 flex flex-col gap-4 w-full">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-[7px] bg-white/10 flex items-center justify-center shrink-0">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 15V3"/>
                      <path d="M8 7l4-4 4 4"/>
                      <path d="M4 13v6a1 1 0 001 1h14a1 1 0 001-1v-6"/>
                    </svg>
                  </div>
                  <p className="text-[13px] text-white/80 text-left">Appuyez sur ce bouton dans Safari</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                  <p className="text-[13px] text-white/80 text-left">Défilez et appuyez sur <span className="text-white">"En voir plus"</span></p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-[7px] bg-white/10 flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8"/>
                    </svg>
                  </div>
                  <p className="text-[13px] text-white/80 text-left">Appuyez sur <span className="text-white">"Sur l'écran d'accueil"</span></p>
                </div>
              </div>
              <div className="animate-bounce text-[#8FC1E8] text-2xl">↑</div>
              <button
                onClick={() => setStatus('choice')}
                className="text-[11px] uppercase tracking-[0.18em] text-white/30 mt-2">
                Déjà installé
              </button>
            </div>
          )}

          {/* Écran de chargement */}
          {(status === 'loading' || status === 'auth') && (
            <div className="w-10 h-10 rounded-full border-2 border-[#8FC1E8] border-t-transparent animate-spin" />
          )}

          {/* Écran d'erreur */}
          {status === 'error' && (
            <div className="rounded-full border border-red-500/20 bg-white/5 backdrop-blur-xl px-6 py-3">
              <span className="text-red-400 text-[13px] text-center">{errorMsg}</span>
            </div>
          )}

          {/* Écran de choix — Visage / Corps */}
          {status === 'choice' && (
            <div className="relative flex flex-col items-center gap-6 w-full">
              <div className="absolute -inset-x-10 top-0 h-full bg-[#8FC1E8]/[0.04] blur-[60px] pointer-events-none" />

              <p className="relative text-[14px] text-white/55 text-center italic mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Choisissez votre session de capture
              </p>

              <button
                onClick={() => setCaptureMode('face')}
                className="relative w-full rounded-[20px] border border-[#8FC1E8]/30 bg-black/30 backdrop-blur-xl px-6 py-6 flex items-center gap-5 active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(143,193,232,0.08)]">
                <div className="w-14 h-14 rounded-full border border-[#8FC1E8]/30 flex items-center justify-center shrink-0">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8FC1E8" strokeWidth="1.4">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[15px] font-medium text-[#EAE4D5]">Capture Visage</p>
                  <p className="text-[12px] text-white/50 mt-0.5">3 clichés guidés — face, profil gauche, profil droit</p>
                </div>
              </button>

              <button
                onClick={() => setCaptureMode('body')}
                className="relative w-full rounded-[20px] border border-[#8FC1E8]/30 bg-black/30 backdrop-blur-xl px-6 py-6 flex items-center gap-5 active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(143,193,232,0.08)]">
                <div className="w-14 h-14 rounded-full border border-[#8FC1E8]/30 flex items-center justify-center shrink-0">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8FC1E8" strokeWidth="1.4">
                    <circle cx="12" cy="5" r="2.5" />
                    <path d="M12 8v7M8 11l4-3 4 3M9 20l3-5 3 5" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[15px] font-medium text-[#EAE4D5]">Capture Corps</p>
                  <p className="text-[12px] text-white/50 mt-0.5">4 clichés guidés — face, dos, profil gauche, profil droit</p>
                </div>
              </button>

              </div>
          )}

        </div>
      </div>

      {captureMode === 'face' && (
        <FaceCaptureFlow
          onComplete={(shots) => {
            console.log('Photos visage capturées:', shots)
            // Upload vers Supabase à connecter à l'étape suivante
            setCaptureMode(null)
          }}
          onCancel={() => setCaptureMode(null)}
        />
      )}

      {captureMode === 'body' && userId && (
        <BodyCaptureFlow
          onComplete={async (shots) => {
            for (const shot of shots) {
              const blob = await (await fetch(shot.dataUrl)).blob()
              const formData = new FormData()
              formData.append('userId', userId)
              formData.append('captureType', 'body')
              formData.append('pose', shot.pose)
              formData.append('image', blob, `${shot.pose}.jpg`)
              await fetch('/api/visual-capture-upload', { method: 'POST', body: formData })
            }
            setCaptureMode(null)
            setStatus('choice')
          }}
          onCancel={() => setCaptureMode(null)}
        />
      )}
    </main>
  )
}