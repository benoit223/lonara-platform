'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

export type BodyOrientation = 'front' | 'back' | 'left' | 'right' | 'unknown'

export interface PoseDetectionResult {
  detected: boolean
  orientation: BodyOrientation
  fullBodyInFrame: boolean // tête + pieds visibles dans le cadre
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
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
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
      return { detected: false, orientation: 'unknown', fullBodyInFrame: false }
    }

    const result = landmarkerRef.current.detectForVideo(video, timestampMs)

    if (!result.landmarks || result.landmarks.length === 0) {
      return { detected: false, orientation: 'unknown', fullBodyInFrame: false }
    }

    const lm = result.landmarks[0]

    // Cadrage complet : nez + chevilles visibles avec bonne confiance de visibilité
    const noseVisible = (lm[NOSE]?.visibility ?? 0) > 0.5
    const anklesVisible = (lm[LEFT_ANKLE]?.visibility ?? 0) > 0.3 || (lm[RIGHT_ANKLE]?.visibility ?? 0) > 0.3
    const fullBodyInFrame = noseVisible && anklesVisible

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

    return { detected: true, orientation, fullBodyInFrame }
  }, [])

  return { isReady, loadError, detect }
}