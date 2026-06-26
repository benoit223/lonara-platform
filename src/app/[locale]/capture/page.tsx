'use client'

import { useRef, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

type Status = 'loading' | 'auth' | 'idle' | 'uploading' | 'done' | 'error' | 'install'

export default function CapturePage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<Status>('loading')
  const [userId, setUserId] = useState<string | null>(null)
  const [sprintId, setSprintId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')

  // ── INIT ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const token = searchParams.get('token')

      if (token) {
        // Valider le token QR — le cookie est set côté serveur
        const res = await fetch('/api/capture-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        if (!res.ok) {
          setErrorMsg('QR code invalide ou expiré')
          setStatus('error')
          return
        }

        // Cookie set — vérifier si PWA installée
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches
        if (!isInstalled) {
          setStatus('install')
          return
        }

        // PWA installée — lire la session
        await loadSession()
        return
      }

      // Pas de token — lire la session existante via cookie
      await loadSession()
    }

    init()
  }, [])

  const loadSession = async () => {
    const res = await fetch('/api/capture-session')

    if (!res.ok) {
      setErrorMsg('Scannez le QR code depuis My Fuel → Connect Phone')
      setStatus('error')
      return
    }

    const data = await res.json()
    setUserId(data.userId)
    setSprintId(data.sprintId)
    setStatus('auth')
  }

  // ── FACE ID via WebAuthn ──────────────────────────────────────────────────
  useEffect(() => {
    if (status !== 'auth') return
    authenticateWithFaceId()
  }, [status])

  const authenticateWithFaceId = async () => {
    if (!window.PublicKeyCredential) { setStatus('idle'); return }

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      if (!available) { setStatus('idle'); return }

      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)
      const credentialId = localStorage.getItem('lonara_credential_id')

      if (!credentialId) {
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: { name: 'Lonara Labs', id: window.location.hostname },
            user: {
              id: new TextEncoder().encode(userId!),
              name: 'Lonara User',
              displayName: 'Lonara User',
            },
            pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
            authenticatorSelection: {
              authenticatorAttachment: 'platform',
              userVerification: 'required',
            },
            timeout: 60000,
          },
        }) as PublicKeyCredential

        localStorage.setItem('lonara_credential_id',
          btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
        )
      } else {
        const rawId = Uint8Array.from(atob(credentialId), c => c.charCodeAt(0))
        await navigator.credentials.get({
          publicKey: {
            challenge,
            allowCredentials: [{ id: rawId, type: 'public-key' }],
            userVerification: 'required',
            timeout: 60000,
          },
        })
      }
      setStatus('idle')
    } catch {
      setStatus('idle')
    }
  }

  // ── UPLOAD ────────────────────────────────────────────────────────────────
  const getMealTime = () => {
    const h = new Date().getHours()
    if (h >= 5 && h < 10) return 'breakfast'
    if (h >= 10 && h < 15) return 'lunch'
    if (h >= 15 && h < 18) return 'snack'
    return 'dinner'
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    setStatus('uploading')
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('mealTime', getMealTime())
      formData.append('note', '')
      formData.append('sprintId', sprintId ?? '')
      formData.append('userId', userId)
      formData.append('locale', navigator.language.split('-')[0])
      const response = await fetch('/api/fuel-analyze', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Erreur upload')
      setStatus('done')
      setTimeout(() => setStatus('idle'), 2000)
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMsg("Erreur lors de l'envoi — réessayez")
      setTimeout(() => setStatus('idle'), 2500)
    }
    e.target.value = ''
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <img src="/qqq.png" alt=""
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none" />

      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative z-10 w-full max-w-lg h-screen flex flex-col items-center justify-start px-6 pt-[8vh]">

          {/* Logo */}
          <img src="/LOGOOFFICIELTRANSP.png" alt="Lonara" className="w-64 object-contain select-none" />
          <p className="mt-1 text-[18px] uppercase tracking-[0.28em] text-white/60"
            style={{ fontFamily: 'Inter, sans-serif' }}>MY FUEL</p>

          <div className="h-[6vh]" />

          {/* Écran installation PWA */}
          {status === 'install' && (
            <div className="flex flex-col items-center gap-8 px-4 text-center">
              <div className="w-20 h-20 rounded-[22px] bg-black border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(61,212,160,0.15)]">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                  stroke="#3DD4A0" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <div>
                <p className="text-[22px] font-light text-[#EAE4D5] mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>Une dernière étape</p>
                <p className="text-[14px] text-white/45 leading-relaxed">
                  Installez l'app pour un accès instantané à la caméra
                </p>
              </div>
              <div className="rounded-[16px] border border-white/8 bg-white/[0.03] px-6 py-5 flex flex-col gap-4 w-full">
                <div className="flex items-center gap-4">
                  <span className="text-xl text-white/50">①</span>
                  <p className="text-[13px] text-white/65 text-left">
                    Appuyez sur <span className="text-white/90">⬆</span> dans Safari
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl text-white/50">②</span>
                  <p className="text-[13px] text-white/65 text-left">
                    Choisissez <span className="text-white/90">"Ajouter à l'écran d'accueil"</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl text-white/50">③</span>
                  <p className="text-[13px] text-white/65 text-left">
                    Ouvrez <span className="text-white/90">My Fuel</span> depuis votre écran
                  </p>
                </div>
              </div>
              <div className="animate-bounce text-[#3DD4A0] text-2xl">↑</div>
            </div>
          )}

          {/* Input caméra */}
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
            className="hidden" onChange={handleImageChange} />

          {/* Bouton principal — caché pendant install */}
          {status !== 'install' && (
            <>
              <div className="relative flex items-center justify-center w-full h-[28vh]">
                <div className="absolute w-[300px] h-[300px] rounded-full bg-[#39FFD0]/5 blur-[45px]" />
                <div className="absolute w-[250px] h-[250px] rounded-full bg-[#39FFD0]/4 blur-[22px]" />
                <button
                  onClick={() => status === 'idle' && fileInputRef.current?.click()}
                  disabled={status !== 'idle'}
                  className="relative z-20 w-[235px] h-[235px] rounded-full transition-all duration-500 active:scale-95 disabled:opacity-70">
                  <div className="absolute inset-0 rounded-full shadow-[0_0_60px_8px_rgba(61,212,160,0.22)]" />
                  <div className={`absolute inset-0 rounded-full border-[3px] transition-colors duration-500 ${
                    status === 'done' ? 'border-[#3DD4A0]' :
                    status === 'error' ? 'border-[#E24B4A]' : 'border-[#7DFFE1]'
                  }`} />
                  <div className="absolute inset-[8px] rounded-full bg-[radial-gradient(circle,#0E4D43_0%,#02090B_45%,#000000_100%)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {(status === 'loading' || status === 'auth') && (
                      <div className="w-8 h-8 rounded-full border-2 border-[#3DD4A0] border-t-transparent animate-spin" />
                    )}
                    {status === 'idle' && (
                      <svg width="86" height="86" viewBox="0 0 24 24" fill="none"
                        stroke="#69FFE4" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    )}
                    {status === 'uploading' && (
                      <div className="w-10 h-10 rounded-full border-[3px] border-[#3DD4A0] border-t-transparent animate-spin" />
                    )}
                    {status === 'done' && <span className="text-[#3DD4A0] text-[52px]">✓</span>}
                    {status === 'error' && <span className="text-[#E24B4A] text-[52px]">✕</span>}
                  </div>
                </button>
              </div>

              <div className="mt-2 h-[90px] flex flex-col items-center justify-center">
                {status === 'loading' && (
                  <p className="text-[13px] text-white/35 font-light">Initialisation...</p>
                )}
                {status === 'auth' && (
                  <p className="text-[13px] text-white/35 font-light">Vérification...</p>
                )}
                {status === 'idle' && (
                  <>
                    <p className="text-[14px] text-white/45 font-light">Tap to capture your meal</p>
                    <div className="mt-4 w-1.5 h-1.5 rounded-full bg-[#4EF3C0]/85" />
                  </>
                )}
                {status === 'uploading' && (
                  <div className="flex items-center gap-3 rounded-full border border-[#4EF3C0]/20 bg-white/5 backdrop-blur-xl px-5 py-3">
                    <span className="text-[#8CF8DB] text-[15px] tracking-[0.04em]">Envoi en cours...</span>
                  </div>
                )}
                {status === 'done' && (
                  <div className="flex items-center gap-3 rounded-full border border-[#4EF3C0]/20 bg-white/5 backdrop-blur-xl px-6 py-3">
                    <span className="text-[#61FFD6] text-[15px]">Photo envoyée ✓</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3 rounded-full border border-red-500/20 bg-white/5 backdrop-blur-xl px-6 py-3">
                      <span className="text-red-400 text-[13px] text-center">{errorMsg}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </main>
  )
}