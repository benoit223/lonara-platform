'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

export interface FaceDetectionResult {
  detected: boolean
  yaw: number // angle horizontal — 0 = face, négatif = tourné à gauche, positif = tourné à droite
  faceBoxOk: boolean // le visage est correctement cadré (taille/position dans le champ)
}

export function useFaceLandmarker() {
  const landmarkerRef = useRef<FaceLandmarker | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )
        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU',
          },
          outputFacialTransformationMatrixes: true,
          outputFaceBlendshapes: false,
          runningMode: 'VIDEO',
          numFaces: 1,
        })
        if (!cancelled) {
          landmarkerRef.current = landmarker
          setIsReady(true)
        }
      } catch (e) {
        console.error('FaceLandmarker load error:', e)
        if (!cancelled) setLoadError('Impossible de charger le modèle de détection.')
      }
    }

    load()
    return () => {
      cancelled = true
      landmarkerRef.current?.close()
    }
  }, [])

  // Extrait l'angle de lacet (yaw) depuis la matrice de transformation faciale
  const detect = useCallback((video: HTMLVideoElement, timestampMs: number): FaceDetectionResult => {
    if (!landmarkerRef.current || video.readyState < 2) {
      return { detected: false, yaw: 0, faceBoxOk: false }
    }

    const result = landmarkerRef.current.detectForVideo(video, timestampMs)

    if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
      return { detected: false, yaw: 0, faceBoxOk: false }
    }

    const matrixData = result.facialTransformationMatrixes?.[0]?.data
    let yaw = 0
    if (matrixData) {
      // Matrice 4x4 column-major — extraction de l'angle de lacet (rotation Y)
      const m = matrixData
      yaw = Math.atan2(-m[8], Math.sqrt(m[9] * m[9] + m[10] * m[10])) * (180 / Math.PI)
    }

    // Vérifie que le visage occupe une portion raisonnable du cadre (cadrage correct)
    const landmarks = result.faceLandmarks[0]
    const xs = landmarks.map(p => p.x)
    const ys = landmarks.map(p => p.y)
    const width = Math.max(...xs) - Math.min(...xs)
    const height = Math.max(...ys) - Math.min(...ys)
    const faceBoxOk = width > 0.18 && width < 0.75 && height > 0.18 && height < 0.85

    return { detected: true, yaw, faceBoxOk }
  }, [])

  return { isReady, loadError, detect }
}