'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useFaceLandmarker } from '../hooks/useFaceLandmarker'

type Pose = 'center' | 'left' | 'right'
type FlowStatus = 'requesting' | 'detecting' | 'captured-flash' | 'review' | 'error'

interface CapturedShot {
  pose: Pose
  dataUrl: string
}

const POSE_IDS: { id: Pose; instructionKey: string; labelKey: string }[] = [
  { id: 'center', instructionKey: 'visual_face_center', labelKey: 'visual_face_pose_center' },
  { id: 'left', instructionKey: 'visual_face_left', labelKey: 'visual_face_pose_left' },
  { id: 'right', instructionKey: 'visual_face_right', labelKey: 'visual_face_pose_right' },
]

const STABLE_FRAMES_REQUIRED = 18 // ~0.5-0.6s à 30fps
const YAW_CENTER_THRESHOLD = 8 // degrés
const YAW_SIDE_THRESHOLD = 18 // degrés minimum pour valider un profil

interface FaceCaptureFlowProps {
  onComplete: (shots: CapturedShot[]) => void
  onCancel: () => void
}

export default function FaceCaptureFlow({ onComplete, onCancel }: FaceCaptureFlowProps) {
  const t = useTranslations('myspace')

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const stableCountRef = useRef(0)
  const streamRef = useRef<MediaStream | null>(null)

  const { isReady, loadError, detect } = useFaceLandmarker()

  const [status, setStatus] = useState<FlowStatus>('requesting')
  const [poseIndex, setPoseIndex] = useState(0)
  const [progress, setProgress] = useState(0) // 0-1 pour l'anneau de progression
  const [shots, setShots] = useState<CapturedShot[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [armDelay, setArmDelay] = useState(5) // décompte avant que la détection ne s'active
  const armedRef = useRef(false)
  

  const currentPoseId = POSE_IDS[poseIndex] // référence stable — POSE_IDS est une constante de module

  // ── Démarrage caméra ──────────────────────────────────────────────────────
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        })
        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          try {
            await videoRef.current.play()
          } catch (playErr) {
            console.error('Video play error:', playErr)
          }
        }
        setStatus('detecting')
      } catch (e: any) {
        console.error('Camera error:', e)
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

// ── Délai d'armement avant chaque pose — laisse le temps de se positionner ──
  useEffect(() => {
    if (status !== 'detecting') return
    armedRef.current = false
    setArmDelay(5)

    const interval = setInterval(() => {
      setArmDelay(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          armedRef.current = true
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [status, poseIndex])

  const captureFrame = useCallback((): string => {
    const video = videoRef.current!
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(video, 0, 0)
    return canvas.toDataURL('image/jpeg', 0.92)
  }, [])

  // ── Boucle de détection ───────────────────────────────────────────────────
  useEffect(() => {
    if (status !== 'detecting' || !isReady) return

    const loop = () => {
      const video = videoRef.current
      if (!video) return

      const result = detect(video, performance.now())

      let withinTarget = false
      if (armedRef.current && result.detected && result.faceBoxOk) {
        if (currentPoseId.id === 'center') {
          withinTarget = Math.abs(result.yaw) < YAW_CENTER_THRESHOLD
        } else if (currentPoseId.id === 'left') {
          withinTarget = result.yaw < -YAW_SIDE_THRESHOLD
        } else {
          withinTarget = result.yaw > YAW_SIDE_THRESHOLD
        }
      }

      if (withinTarget) {
        stableCountRef.current += 1
      } else {
        stableCountRef.current = 0
      }
      const currentProgress = Math.min(1, stableCountRef.current / STABLE_FRAMES_REQUIRED)
      setProgress(currentProgress)

      const canvas = canvasRef.current
      if (canvas) drawOverlay(canvas, result, currentProgress)

      if (stableCountRef.current >= STABLE_FRAMES_REQUIRED) {
        stableCountRef.current = 0
        const dataUrl = captureFrame()
        const newShot: CapturedShot = { pose: currentPoseId.id, dataUrl }
        setShots(prev => [...prev, newShot])
        setStatus('captured-flash')
        return // stoppe la boucle, reprise gérée par l'effet ci-dessous
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [status, isReady, currentPoseId, detect, captureFrame])

  // ── Transition après capture d'une pose ──────────────────────────────────
  useEffect(() => {
    if (status !== 'captured-flash') return
    const timeout = setTimeout(() => {
      if (poseIndex < POSE_IDS.length - 1) {
        setPoseIndex(prev => prev + 1)
        setProgress(0)
        setStatus('detecting')
      } else {
        setStatus('review')
      }
    }, 700)
    return () => clearTimeout(timeout)
  }, [status, poseIndex])

  const handleRetake = (pose: Pose) => {
    setShots(prev => prev.filter(s => s.pose !== pose))
    const idx = POSE_IDS.findIndex(p => p.id === pose)
    setPoseIndex(idx)
    setProgress(0)
    setStatus('detecting')
  }

  const handleConfirm = () => {
    onComplete(shots)
  }

 return (
    <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center">

      {/* La vidéo et le canvas sont TOUJOURS montés — visibilité gérée par CSS, pas par le rendu conditionnel */}
      <div className={`relative w-full max-w-md aspect-[3/4] mt-[6vh] rounded-[24px] overflow-hidden border border-white/10 ${
        status === 'detecting' || status === 'captured-flash' ? 'block' : 'hidden'
      }`}>
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} playsInline muted autoPlay />
        <canvas ref={canvasRef} width={640} height={853} className="absolute inset-0 w-full h-full" style={{ transform: 'scaleX(-1)' }} />
        {status === 'captured-flash' && (
          <div className="absolute inset-0 bg-white/80 animate-[pulse_0.4s_ease-out]" />
        )}
        {!isReady && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#8FC1E8] border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      

      {(status === 'requesting' || (!isReady && status !== 'error')) && (
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

      {(status === 'detecting' || status === 'captured-flash') && !loadError && (
        <>
          <div className="mt-8 flex flex-col items-center gap-3 px-6 text-center">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#8FC1E8]/80">
              {t('visual_capture_step')} {poseIndex + 1} / {POSE_IDS.length}
            </p>
            <p className="text-[20px] font-light text-[#EAE4D5]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t(currentPoseId.instructionKey)}
            </p>
            {armDelay > 0 && (
              <p className="text-[36px] font-light text-[#8FC1E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {armDelay}
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

          <button onClick={onCancel} className="mt-6 text-[11px] uppercase tracking-[0.18em] text-white/30">
            {t('visual_capture_cancel')}
          </button>
        </>
      )}

      {status === 'review' && (
        <div className="flex flex-col items-center gap-6 px-6 w-full max-w-md">
          <p className="text-[20px] font-light text-[#EAE4D5]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {t('visual_capture_review')}
          </p>
          <div className="grid grid-cols-3 gap-3 w-full">
            {POSE_IDS.map((p) => {
              const shot = shots.find(s => s.pose === p.id)
              return (
                <div key={p.id} className="flex flex-col items-center gap-2">
                  <div className="relative w-full aspect-[3/4] rounded-[12px] overflow-hidden border border-white/10">
                    {shot && <img src={shot.dataUrl} alt={t(p.labelKey)} className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />}
                  </div>
                  <p className="text-[9px] uppercase tracking-[0.14em] text-white/50">{t(p.labelKey)}</p>
                  <button onClick={() => handleRetake(p.id)} className="text-[10px] text-[#8FC1E8]/70 underline">
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
// ── Overlay canvas — guide visuel + anneau de progression ──────────────────
function drawOverlay(
  canvas: HTMLCanvasElement,
  result: { detected: boolean; faceBoxOk: boolean },
  progress: number
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { width, height } = canvas
  ctx.clearRect(0, 0, width, height)

  const cx = width / 2
  const cy = height * 0.42
  const rx = width * 0.28
  const ry = height * 0.22

  // Ellipse guide (pointillés)
  ctx.strokeStyle = result.detected && result.faceBoxOk ? 'rgba(143,193,232,0.55)' : 'rgba(255,255,255,0.25)'
  ctx.lineWidth = 2
  ctx.setLineDash([6, 6])
  ctx.beginPath()
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  // Anneau de progression (plein, se remplit à mesure que la pose est tenue)
  if (progress > 0) {
    ctx.strokeStyle = '#8FC1E8'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx + 10, ry + 10, 0, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2)
    ctx.stroke()
  }
}