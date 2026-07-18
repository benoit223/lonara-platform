'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { usePoseLandmarker, type BodyOrientation } from '../hooks/usePoseLandmarker'
import { speak } from '../lib/speech'

type BodyPose = 'front' | 'back' | 'left' | 'right'
type FlowStatus = 'requesting' | 'positioning' | 'countdown' | 'captured-flash' | 'review' | 'error'

interface CapturedShot {
  pose: BodyPose
  dataUrl: string
}

const POSE_IDS: { id: BodyPose; instructionKey: string; labelKey: string; target: BodyOrientation }[] = [
  { id: 'front', instructionKey: 'visual_body_front', labelKey: 'visual_body_pose_front', target: 'front' },
  { id: 'back', instructionKey: 'visual_body_back', labelKey: 'visual_body_pose_back', target: 'back' },
  { id: 'left', instructionKey: 'visual_body_left', labelKey: 'visual_body_pose_left', target: 'left' },
  { id: 'right', instructionKey: 'visual_body_right', labelKey: 'visual_body_pose_right', target: 'right' },
]

const STABLE_FRAMES_TO_START_COUNTDOWN = 20 // ~0.6-0.7s de cadrage correct avant de lancer le compte à rebours
const COUNTDOWN_SECONDS_FIRST = 3  // pose 1 (face) — déjà bien positionné, confirmation courte
const COUNTDOWN_SECONDS_PIVOT = 8  // poses 2-4 — laisse le temps physique de pivoter

interface BodyCaptureFlowProps {
  onComplete: (shots: CapturedShot[]) => void
  onCancel: () => void
}

export default function BodyCaptureFlow({ onComplete, onCancel }: BodyCaptureFlowProps) {
  const t = useTranslations('myspace')
  const locale = useLocale()
  const speechLang = locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-US'

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const stableCountRef = useRef(0)
  const streamRef = useRef<MediaStream | null>(null)
  const lastGuidanceCheckRef = useRef(0)
  const capturingRef = useRef(false)

  const { isReady, loadError, detect } = usePoseLandmarker()

  const [status, setStatus] = useState<FlowStatus>('requesting')
  const [poseIndex, setPoseIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [countdownVal, setCountdownVal] = useState(COUNTDOWN_SECONDS_FIRST)
  const [shots, setShots] = useState<CapturedShot[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [debugInfo, setDebugInfo] = useState('init')

  const currentPoseId = POSE_IDS[poseIndex]
  const isFirstPose = poseIndex === 0

  // ── Démarrage caméra (frontale) ──────────────────────────────────────────
  useEffect(() => {
    const startCamera = async () => {
      try {
        setDebugInfo('demande permission…')
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1707 } },
          audio: false,
        })
        streamRef.current = stream
        const tracks = stream.getVideoTracks()
        setDebugInfo(`stream ok, tracks=${tracks.length}, state=${tracks[0]?.readyState}`)

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            setDebugInfo(prev => prev + ` | metadata: ${videoRef.current?.videoWidth}x${videoRef.current?.videoHeight}`)
          }
          try {
            await videoRef.current.play()
            setDebugInfo(prev => prev + ' | play() ok')
          } catch (playErr: any) {
            setDebugInfo(prev => prev + ` | play() FAIL: ${playErr?.message ?? playErr}`)
          }
        }
      } catch (e: any) {
        console.error('Camera error:', e)
        setDebugInfo(`getUserMedia FAIL: ${e?.name ?? ''} ${e?.message ?? e}`)
        setErrorMsg(t('visual_capture_cameraError'))
        setStatus('error')
      }
    }
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // ── Passage en phase "positioning" dès que le modèle est prêt ────────────
  useEffect(() => {
    if (!isReady || status !== 'requesting') return
    setStatus('positioning')
    speak(t(currentPoseId.instructionKey), { force: true, lang: speechLang })
  }, [isReady])

  // ── Annonce vocale au changement de pose ─────────────────────────────────
  useEffect(() => {
    if (status !== 'positioning') return
    stableCountRef.current = 0
    speak(t(currentPoseId.instructionKey), { force: true, lang: speechLang })
  }, [poseIndex])

  const captureFrame = useCallback((): string => {
    const video = videoRef.current!
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(video, 0, 0)
    return canvas.toDataURL('image/jpeg', 0.92)
  }, [])

  const doCapture = useCallback(() => {
    if (capturingRef.current) return
    capturingRef.current = true
    const dataUrl = captureFrame()
    setShots(prev => [...prev, { pose: currentPoseId.id, dataUrl }])
    speak(t('visual_voice_captured'), { force: true, lang: speechLang })
    setStatus('captured-flash')
  }, [captureFrame, currentPoseId, t, speechLang])

  // ── Boucle de détection — phase positionnement ────────────────────────────
  useEffect(() => {
    if (status !== 'positioning' || !isReady) return

    const loop = () => {
      const video = videoRef.current
      if (!video) return

      const result = detect(video, performance.now())
      setDebugInfo(`detected=${result.detected} orient=${result.orientation} target=${currentPoseId.target} dist=${result.distanceHint} horiz=${result.horizontalHint} frame=${result.fullBodyInFrame}`)

      const canvas = canvasRef.current

      // ── Pose 1 : validation stricte (cadrage + distance + centrage) ───────
      // ── Poses 2-4 : validation allégée (présence + cadrage suffisent) ─────
      const framingOk = isFirstPose
        ? result.detected && result.fullBodyInFrame && result.distanceHint === 'ok' && result.horizontalHint === 'ok'
        : result.detected && result.fullBodyInFrame

      if (framingOk) {
        stableCountRef.current += 1
      } else {
        stableCountRef.current = 0
      }

      const currentProgress = Math.min(1, stableCountRef.current / STABLE_FRAMES_TO_START_COUNTDOWN)
      setProgress(currentProgress)
      if (canvas) drawOverlay(canvas, result, currentProgress)

      // ── Guidage vocal pendant le positionnement — surtout utile pour la pose 1 ──
      const nowMs = performance.now()
      if (isFirstPose && result.detected && nowMs - lastGuidanceCheckRef.current > 3500) {
        lastGuidanceCheckRef.current = nowMs
        if (result.distanceHint === 'too_far') {
          speak(t('visual_voice_moveCloser'), { lang: speechLang })
        } else if (result.distanceHint === 'too_close') {
          speak(t('visual_voice_moveBack'), { lang: speechLang })
        } else if (result.horizontalHint === 'move_left') {
          speak(t('visual_voice_moveLeft'), { lang: speechLang })
        } else if (result.horizontalHint === 'move_right') {
          speak(t('visual_voice_moveRight'), { lang: speechLang })
        }
      }

      if (stableCountRef.current >= STABLE_FRAMES_TO_START_COUNTDOWN) {
        stableCountRef.current = 0
        setStatus('countdown')
        return
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [status, isReady, currentPoseId, isFirstPose, detect])

  // ── Boucle de détection — phase compte à rebours (re-vérifie en continu) ──
  useEffect(() => {
    if (status !== 'countdown') return

    const countdownDuration = isFirstPose ? COUNTDOWN_SECONDS_FIRST : COUNTDOWN_SECONDS_PIVOT
    setCountdownVal(countdownDuration)
    speak(
      isFirstPose ? t('visual_voice_holdStill') : `${t(currentPoseId.instructionKey)}. ${t('visual_voice_holdStill')}`,
      { force: true, lang: speechLang }
    )

    let cancelled = false
    let secondsLeft = countdownDuration

    const checkLoop = () => {
      const video = videoRef.current
      if (!video || cancelled) return

      const result = detect(video, performance.now())

      const framingOk = isFirstPose
        ? result.detected && result.fullBodyInFrame && result.distanceHint === 'ok' && result.horizontalHint === 'ok'
        : result.detected && result.fullBodyInFrame

      const canvas = canvasRef.current
      if (canvas) drawOverlay(canvas, result, 1)

      if (!framingOk) {
        // Perte de position pendant le compte à rebours — annule, repart au positionnement
        cancelled = true
        setStatus('positioning')
        return
      }

      rafRef.current = requestAnimationFrame(checkLoop)
    }
    rafRef.current = requestAnimationFrame(checkLoop)

    const tick = setInterval(() => {
      if (cancelled) return
      secondsLeft -= 1
      setCountdownVal(secondsLeft)
      if (secondsLeft <= 0) {
        clearInterval(tick)
        if (!cancelled) doCapture()
      }
    }, 1000)

    return () => {
      cancelled = true
      clearInterval(tick)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [status])

  // ── Transition après capture d'une pose ──────────────────────────────────
  useEffect(() => {
    if (status !== 'captured-flash') return
    const timeout = setTimeout(() => {
      capturingRef.current = false
      if (poseIndex < POSE_IDS.length - 1) {
        setPoseIndex(prev => prev + 1)
        setProgress(0)
        setStatus('positioning')
      } else {
        setStatus('review')
      }
    }, 800)
    return () => clearTimeout(timeout)
  }, [status, poseIndex])

  const handleRetake = (pose: BodyPose) => {
    setShots(prev => prev.filter(s => s.pose !== pose))
    const idx = POSE_IDS.findIndex(p => p.id === pose)
    setPoseIndex(idx)
    setProgress(0)
    setStatus('positioning')
  }

  const handleConfirm = () => {
    onComplete(shots)
  }

  return (
    <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center">

      <div className={`relative w-full max-w-sm aspect-[3/4] mt-[3vh] rounded-[24px] overflow-hidden border border-white/10 ${
        status === 'positioning' || status === 'countdown' || status === 'captured-flash' ? 'block' : 'hidden'
      }`}>
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} playsInline muted autoPlay />
        <canvas ref={canvasRef} width={640} height={853} className="absolute inset-0 w-full h-full" />
        {status === 'captured-flash' && (
          <div className="absolute inset-0 bg-white/80 animate-[pulse_0.4s_ease-out]" />
        )}
        {!isReady && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#8FC1E8] border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      <div className="mt-2 px-4 py-2 bg-black/80 rounded-lg max-w-md">
        <p className="text-[9px] text-yellow-300 break-all">DEBUG: {debugInfo} | status={status} | isReady={String(isReady)}</p>
      </div>

      {status === 'requesting' && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <div className="w-10 h-10 rounded-full border-2 border-[#8FC1E8] border-t-transparent animate-spin" />
          <p className="text-[13px] text-white/50">{t('visual_capture_preparingCamera')}</p>
        </div>
      )}

      {(status === 'error' || loadError) && (
        <div className="flex flex-col items-center gap-4 px-8 text-center mt-6">
          <p className="text-[14px] text-red-400">{errorMsg || loadError}</p>
          <button onClick={onCancel} className="text-[12px] uppercase tracking-[0.18em] text-white/40">
            {t('visual_capture_back')}
          </button>
        </div>
      )}

      {(status === 'positioning' || status === 'countdown' || status === 'captured-flash') && !loadError && (
        <>
          <div className="mt-6 flex flex-col items-center gap-3 px-6 text-center">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#8FC1E8]/80">
              {t('visual_capture_step')} {poseIndex + 1} / {POSE_IDS.length}
            </p>
            <p className="text-[20px] font-light text-[#EAE4D5]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t(currentPoseId.instructionKey)}
            </p>
            {status === 'positioning' && (
              <p className="text-[12px] text-[#8FC1E8]/70 italic">
                {t('visual_voice_getReady')}
              </p>
            )}
            {status === 'countdown' && (
              <p className="text-[36px] font-light text-[#8FC1E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {countdownVal}
              </p>
            )}
            <div className="flex gap-1.5 mt-2">
              {POSE_IDS.map((p, i) => (
                <div key={p.id} className={`h-1.5 w-8 rounded-full transition-all ${
                  i < poseIndex ? 'bg-[#8FC1E8]' : i === poseIndex ? 'bg-[#8FC1E8]/50' : 'bg-white/15'
                }`} />
              ))}
            </div>
          </div>

          <button onClick={onCancel} className="mt-5 text-[11px] uppercase tracking-[0.18em] text-white/30">
            {t('visual_capture_cancel')}
          </button>
        </>
      )}

      {status === 'review' && (
        <div className="flex flex-col items-center gap-6 px-6 w-full max-w-md">
          <p className="text-[20px] font-light text-[#EAE4D5]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {t('visual_capture_review')}
          </p>
          <div className="grid grid-cols-4 gap-2 w-full">
            {POSE_IDS.map((p) => {
              const shot = shots.find(s => s.pose === p.id)
              return (
                <div key={p.id} className="flex flex-col items-center gap-1.5">
                  <div className="relative w-full aspect-[3/4] rounded-[10px] overflow-hidden border border-white/10">
                    {shot && <img src={shot.dataUrl} alt={t(p.labelKey)} className="w-full h-full object-cover" />}
                  </div>
                  <p className="text-[8px] uppercase tracking-[0.1em] text-white/50 text-center">{t(p.labelKey)}</p>
                  <button onClick={() => handleRetake(p.id)} className="text-[9px] text-[#8FC1E8]/70 underline">
                    {t('visual_capture_retake')}
                  </button>
                </div>
              )
            })}
          </div>
          <button onClick={handleConfirm}
            className="relative w-full rounded-full border border-[#4A90C2]/65 bg-[#4A90C2]/15 py-4 text-[12px] uppercase tracking-[0.22em] text-[#8FC1E8] transition hover:bg-[#4A90C2]/25">
            {t('visual_capture_confirm')}
          </button>
          <button onClick={onCancel} className="text-[11px] uppercase tracking-[0.18em] text-white/30">
            {t('visual_capture_cancelSession')}
          </button>
        </div>
      )}
    </div>
  )
}

function drawOverlay(
  canvas: HTMLCanvasElement,
  result: { detected: boolean; fullBodyInFrame: boolean },
  progress: number
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { width, height } = canvas
  ctx.clearRect(0, 0, width, height)

  const cx = width / 2
  const top = height * 0.08
  const bottom = height * 0.94

  ctx.strokeStyle = result.detected && result.fullBodyInFrame ? 'rgba(143,193,232,0.95)' : 'rgba(255,255,255,0.55)'
  ctx.lineWidth = 3
  ctx.setLineDash([6, 6])
  const guideWidth = width * 0.32
  roundRect(ctx, cx - guideWidth / 2, top, guideWidth, bottom - top, 40)
  ctx.stroke()
  ctx.setLineDash([])

  if (progress > 0) {
    const ringCx = cx
    const ringCy = top - 20
    const ringR = 16
    ctx.strokeStyle = '#8FC1E8'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(ringCx, Math.max(ringCy, 20), ringR, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2)
    ctx.stroke()
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}