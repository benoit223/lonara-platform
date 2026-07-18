'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

export type BodyOrientation = 'front' | 'back' | 'left' | 'right' | 'unknown'

export type DistanceHint = 'ok' | 'too_close' | 'too_far' | 'unknown'
export type HorizontalHint = 'ok' | 'move_left' | 'move_right'

export interface PoseDetectionResult {
  detected: boolean
  orientation: BodyOrientation
  fullBodyInFrame: boolean
  distanceHint: DistanceHint
  horizontalHint: HorizontalHint
  debugRaw?: string // valeurs brutes pour calibration — à retirer une fois les seuils validés
}

// Indices des repères MediaPipe Pose pertinents
const NOSE = 0
const LEFT_SHOULDER = 11
const RIGHT_SHOULDER = 12
const LEFT_HIP = 23
const RIGHT_HIP = 24
const LEFT_ANKLE = 27
const RIGHT_ANKLE = 28
const LEFT_EAR = 7
const RIGHT_EAR = 8

export function usePoseLandmarker() {
  const landmarkerRef = useRef<PoseLandmarker | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )
        const landmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        })
        if (!cancelled) {
          landmarkerRef.current = landmarker
          setIsReady(true)
        }
      } catch (e) {
        console.error('PoseLandmarker load error:', e)
        if (!cancelled) setLoadError('Impossible de charger le modèle de détection posturale.')
      }
    }

    load()
    return () => {
      cancelled = true
      landmarkerRef.current?.close()
    }
  }, [])

  const detect = useCallback((video: HTMLVideoElement, timestampMs: number): PoseDetectionResult => {
    if (!landmarkerRef.current || video.readyState < 2) {
      return { detected: false, orientation: 'unknown', fullBodyInFrame: false, distanceHint: 'unknown', horizontalHint: 'ok' }
    }

    const result = landmarkerRef.current.detectForVideo(video, timestampMs)

    if (!result.landmarks || result.landmarks.length === 0) {
      return { detected: false, orientation: 'unknown', fullBodyInFrame: false, distanceHint: 'unknown', horizontalHint: 'ok' }
    }

    const lm = result.landmarks[0]

    // Cadrage complet : tête (nez OU oreille) + chevilles visibles — fonctionne peu importe l'orientation
    const noseVisible = (lm[NOSE]?.visibility ?? 0) > 0.3
    const leftEarVisible = (lm[LEFT_EAR]?.visibility ?? 0) > 0.25
    const rightEarVisible = (lm[RIGHT_EAR]?.visibility ?? 0) > 0.25
    // Fallback supplémentaire — si aucun repère de tête fiable, utiliser la présence des épaules comme proxy
    const shouldersVisible = (lm[LEFT_SHOULDER]?.visibility ?? 0) > 0.4 && (lm[RIGHT_SHOULDER]?.visibility ?? 0) > 0.4
    const headVisible = noseVisible || leftEarVisible || rightEarVisible || shouldersVisible
    const hipsVisible = (lm[LEFT_HIP]?.visibility ?? 0) > 0.3 && (lm[RIGHT_HIP]?.visibility ?? 0) > 0.3
    const anklesVisible = (lm[LEFT_ANKLE]?.visibility ?? 0) > 0.15 || (lm[RIGHT_ANKLE]?.visibility ?? 0) > 0.15
    // Cadrage minimal acceptable = tête + hanches visibles (suffisant pour l'analyse posturale)
    const fullBodyInFrame = headVisible && hipsVisible

    // Référence verticale du haut du corps — nez si visible, sinon estimation via épaules
    const topRefY = noseVisible ? lm[NOSE].y : (lm[LEFT_SHOULDER].y + lm[RIGHT_SHOULDER].y) / 2 - 0.05

    // Diagnostic de distance — hauteur verticale occupée par le corps à l'écran
    const bottomRefY = anklesVisible
      ? Math.max(lm[LEFT_ANKLE]?.y ?? 0, lm[RIGHT_ANKLE]?.y ?? 0)
      : (lm[LEFT_HIP].y + lm[RIGHT_HIP].y) / 2
    const bodyHeight = Math.abs(topRefY - bottomRefY)
    let distanceHint: 'ok' | 'too_close' | 'too_far' | 'unknown' = 'unknown'
    if (headVisible && hipsVisible) {
      if (bodyHeight > 0.70) distanceHint = 'too_close'
      else if (bodyHeight < 0.15) distanceHint = 'too_far'
      else distanceHint = 'ok'
    }

    // Centrage horizontal
    const centerX = (lm[LEFT_SHOULDER].x + lm[RIGHT_SHOULDER].x) / 2
    let horizontalHint: 'ok' | 'move_left' | 'move_right' = 'ok'
    if (centerX < 0.35) horizontalHint = 'move_right' // sujet à gauche de l'image → doit se décaler à droite
    else if (centerX > 0.65) horizontalHint = 'move_left'

    // Orientation déduite de la largeur apparente épaules/hanches et visibilité du nez/oreilles
    const shoulderWidth = Math.abs(lm[LEFT_SHOULDER].x - lm[RIGHT_SHOULDER].x)
    const hipWidth = Math.abs(lm[LEFT_HIP].x - lm[RIGHT_HIP].x)
    const avgWidth = (shoulderWidth + hipWidth) / 2

    const leftEarVis = lm[LEFT_EAR]?.visibility ?? 0
    const rightEarVis = lm[RIGHT_EAR]?.visibility ?? 0
    const noseVis = lm[NOSE]?.visibility ?? 0

    let orientation: BodyOrientation = 'unknown'

    if (avgWidth > 0.14) {
      // Corps large à l'écran → face ou dos
      // Le nez visible avec bonne confiance signale la face ; sinon dos
      orientation = noseVis > 0.6 ? 'front' : 'back'
    } else if (avgWidth < 0.08) {
      // Corps étroit à l'écran → profil
      // L'oreille la plus visible indique le côté tourné vers la caméra
      orientation = leftEarVis > rightEarVis ? 'left' : 'right'
    }

    const debugRaw = `avgW=${avgWidth.toFixed(3)} bodyH=${bodyHeight.toFixed(3)} nose=${noseVis.toFixed(2)} lEar=${leftEarVis.toFixed(2)} rEar=${rightEarVis.toFixed(2)} head=${headVisible} ankles=${anklesVisible}`

    return { detected: true, orientation, fullBodyInFrame, distanceHint, horizontalHint, debugRaw }
  }, [])

  return { isReady, loadError, detect }
}