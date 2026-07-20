'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { supabase } from '../lib/supabase'

interface CaptureShot {
  pose: string
  url: string
  created_at: string
}

interface FaceAnalysis {
  fitzpatrick_type?: string
  griffiths_scores?: { forehead: number; periorbital: number; nasolabial: number; perioral: number }
  glogau_stage?: string
  glogau_justification?: string
  pigmentation_load_percent?: number
  vascularity_load_percent?: number
  texture_score?: number // 0-9, cohérent avec l'échelle Griffiths
  skin_laxity?: { jawline: string; eyelids: string; neck: string }
  midface_volume_score?: number   // 0-4, Merz Midface Volume Scale
  tear_trough_score?: number      // 0-4, Merz Tear Trough Scale
  jowl_score?: number             // 0-4, Merz Jowl Scale
  crows_feet_score?: number       // 0-4
  facial_asymmetry?: string       // 'symmetric' | 'mild' | 'moderate' | 'pronounced'
  fatigue_signs?: string
  perceived_age_range?: [number, number]
  confidence?: string
  notes?: string
}
interface BodyAnalysis {
  postural_alignment?: string
  forward_head_posture?: string   // 'neutral' | 'mild' | 'pronounced'
  pelvic_tilt?: string            // 'neutral' | 'anterior' | 'posterior'
  waist_hip_ratio_estimate?: number | null
  shoulder_hip_symmetry?: string
  muscle_tone?: { arms: string; core: string; legs: string } // 'low' | 'moderate' | 'high' | 'not_assessable'
  sarcopenia_indicators?: string
  adiposity_distribution?: string // 'android' | 'gynoid' | 'mixed' | 'not_assessable'
  skin_laxity_body?: { arms: string; abdomen: string } // 'mild' | 'moderate' | 'pronounced'
  cellulite_grade?: number | null // 0-4, échelle Nürnberger-Müller
  visual_aging_index?: number     // score composite 0-100
  confidence?: string
  notes?: string
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

const CONFIDENCE_KEYS: Record<string, string> = {
  low: 'visual_confidenceLow', moderate: 'visual_confidenceModerate', high: 'visual_confidenceHigh',
}
// ── SECTION — RÉSULTATS ───────────────────────────────────────────────────────
const FACE_POSE_LABELS: Record<string, string> = { center: 'Face', left: 'Profil gauche', right: 'Profil droit' }
const BODY_POSE_LABELS: Record<string, string> = { front: 'Face', back: 'Dos', left: 'Profil gauche', right: 'Profil droit' }

const LAXITY_LABELS: Record<string, string> = { mild: 'Légère', moderate: 'Modérée', pronounced: 'Marquée' }
const ORIENTATION_LABELS: Record<string, string> = {
  neutral: 'Neutre', mild_kyphosis: 'Cyphose légère', pronounced_kyphosis: 'Cyphose marquée', not_assessable: 'Non évaluable',
}
const SYMMETRY_LABELS: Record<string, string> = {
  symmetric: 'Symétrique', mild_asymmetry: 'Légère asymétrie', notable_asymmetry: 'Asymétrie notable', not_assessable: 'Non évaluable',
}
const MUSCLE_LABELS: Record<string, string> = { low: 'Faible', moderate: 'Modérée', high: 'Élevée', not_assessable: 'Non évaluable' }

// ── Nouveaux dictionnaires — analyse enrichie (clés i18n, pas de texte en dur) ──
const ASYMMETRY_KEYS: Record<string, string> = {
  symmetric: 'visual_asymSymmetric', mild: 'visual_asymMild', moderate: 'visual_asymModerate',
  pronounced: 'visual_asymPronounced', not_assessable: 'visual_notAssessable',
}
const FATIGUE_KEYS: Record<string, string> = {
  none: 'visual_fatigueNone', mild: 'visual_fatigueMild', moderate: 'visual_fatigueModerate',
  pronounced: 'visual_fatiguePronounced', not_assessable: 'visual_notAssessable',
}
const FORWARD_HEAD_KEYS: Record<string, string> = {
  neutral: 'visual_postureNeutral', mild: 'visual_postureMildForward',
  pronounced: 'visual_posturePronouncedForward', not_assessable: 'visual_notAssessable',
}
const PELVIC_TILT_KEYS: Record<string, string> = {
  neutral: 'visual_pelvicNeutral', anterior: 'visual_pelvicAnterior',
  posterior: 'visual_pelvicPosterior', not_assessable: 'visual_notAssessable',
}
const SARCOPENIA_KEYS: Record<string, string> = {
  none: 'visual_sarcopeniaNone', mild: 'visual_sarcopeniaMild', moderate: 'visual_sarcopeniaModerate',
  pronounced: 'visual_sarcopeniaPronounced', not_assessable: 'visual_notAssessable',
}
const ADIPOSITY_KEYS: Record<string, string> = {
  android: 'visual_adiposityAndroid', gynoid: 'visual_adiposityGynoid',
  mixed: 'visual_adiposityMixed', not_assessable: 'visual_notAssessable',
}

const SCALE_0_4_MAX = 4

// ── Consentement biométrique — version + textes légaux ─────────────────────
const VISUAL_CONSENT_VERSION = '2026-07-19'

const CONSENT_TEXT: Record<string, {
  title: string
  intro: string
  points: string[]
  recTitle: string
  lightTitle: string
  lightPoints: string[]
  attireTitle: string
  attirePoints: string[]
  faceTitle: string
  facePoints: string[]
  checkbox: string
  cta: string
}> = {
  fr: {
    title: 'Avant de commencer votre session',
    intro: 'Les photos de votre visage et/ou de votre corps sont analysées par une intelligence artificielle afin de générer une estimation visuelle indicative liée au vieillissement phénotypique. Ces données sont considérées comme des données biométriques.',
    points: [
      'Ces analyses sont des estimations visuelles indicatives, non validées cliniquement, et ne constituent en aucun cas un diagnostic médical.',
      'Vos photos sont transmises de manière sécurisée dans le seul but de générer votre rapport.',
      'Vos données sont conservées pendant une durée maximale de 7 mois, après quoi elles sont automatiquement supprimées. Vous pouvez également demander leur suppression à tout moment.',
      'Vous pouvez retirer ce consentement à tout moment, sans affecter votre accès aux autres fonctionnalités de la plateforme.',
      'Conformément au RGPD, vous disposez d\'un droit d\'accès, de rectification et d\'effacement de vos données.',
    ],
    recTitle: 'Recommandations pour une analyse fiable :',
    lightTitle: 'Éclairage',
    lightPoints: [
      'Privilégiez une lumière naturelle, diffuse et uniforme (près d\'une fenêtre en journée, sans soleil direct).',
      'Évitez les éclairages colorés, les contre-jours et les zones d\'ombre marquées sur le visage ou le corps.',
    ],
    attireTitle: 'Tenue (session corps)',
    attirePoints: [
      'Portez une tenue ajustée et neutre (sous-vêtements, maillot de bain, ou vêtements de sport près du corps).',
      'Évitez les vêtements amples qui masquent la silhouette, la posture ou le tonus musculaire.',
    ],
    faceTitle: 'Visage',
    facePoints: [
      'Visage démaquillé si possible, cheveux dégagés du front et des joues.',
      'Retirez lunettes et accessoires couvrant le visage.',
    ],
    checkbox: 'Je comprends la nature de ce traitement, je consens explicitement à la capture et à l\'analyse de mes photos par intelligence artificielle, et j\'ai pris connaissance des recommandations ci-dessus.',
    cta: 'J\'accepte et je continue',
  },
  en: {
    title: 'Before starting your session',
    intro: 'Photos of your face and/or body are analyzed by artificial intelligence to generate an indicative visual estimate related to phenotypic aging. This data is considered biometric data.',
    points: [
      'These analyses are indicative visual estimates, not clinically validated, and do not constitute a medical diagnosis in any way.',
      'Your photos are transmitted securely for the sole purpose of generating your report.',
      'Your data is retained for a maximum of 7 months, after which it is automatically deleted. You may also request its deletion at any time.',
      'You may withdraw this consent at any time, without affecting your access to the platform\'s other features.',
      'In accordance with GDPR, you have the right to access, rectify, and erase your data.',
    ],
    recTitle: 'Recommendations for a reliable analysis:',
    lightTitle: 'Lighting',
    lightPoints: [
      'Prefer natural, diffuse, even light (near a window during the day, avoiding direct sunlight).',
      'Avoid colored lighting, backlighting, and harsh shadows on the face or body.',
    ],
    attireTitle: 'Attire (body session)',
    attirePoints: [
      'Wear fitted, neutral clothing (underwear, swimwear, or fitted activewear).',
      'Avoid loose clothing that hides your silhouette, posture, or muscle tone.',
    ],
    faceTitle: 'Face',
    facePoints: [
      'No makeup if possible, hair pulled back from the forehead and cheeks.',
      'Remove glasses and accessories covering the face.',
    ],
    checkbox: 'I understand the nature of this processing, I explicitly consent to the capture and analysis of my photos by artificial intelligence, and I have read the recommendations above.',
    cta: 'I accept and continue',
  },
  es: {
    title: 'Antes de comenzar su sesión',
    intro: 'Las fotos de su rostro y/o cuerpo son analizadas por inteligencia artificial para generar una estimación visual indicativa relacionada con el envejecimiento fenotípico. Estos datos se consideran datos biométricos.',
    points: [
      'Estos análisis son estimaciones visuales indicativas, no validadas clínicamente, y no constituyen en ningún caso un diagnóstico médico.',
      'Sus fotos se transmiten de forma segura únicamente con el fin de generar su informe.',
      'Sus datos se conservan durante un máximo de 7 meses, tras lo cual se eliminan automáticamente. También puede solicitar su eliminación en cualquier momento.',
      'Puede retirar este consentimiento en cualquier momento, sin que ello afecte su acceso a las demás funciones de la plataforma.',
      'De conformidad con el RGPD, tiene derecho de acceso, rectificación y supresión de sus datos.',
    ],
    recTitle: 'Recomendaciones para un análisis fiable:',
    lightTitle: 'Iluminación',
    lightPoints: [
      'Prefiera una luz natural, difusa y uniforme (cerca de una ventana durante el día, evitando el sol directo).',
      'Evite luces de colores, contraluces y sombras marcadas en el rostro o el cuerpo.',
    ],
    attireTitle: 'Vestimenta (sesión de cuerpo)',
    attirePoints: [
      'Use ropa ajustada y neutra (ropa interior, traje de baño o ropa deportiva ajustada).',
      'Evite prendas holgadas que oculten la silueta, la postura o el tono muscular.',
    ],
    faceTitle: 'Rostro',
    facePoints: [
      'Sin maquillaje si es posible, cabello recogido de la frente y las mejillas.',
      'Retire gafas y accesorios que cubran el rostro.',
    ],
    checkbox: 'Entiendo la naturaleza de este tratamiento, consiento explícitamente la captura y el análisis de mis fotos mediante inteligencia artificial, y he tomado nota de las recomendaciones anteriores.',
    cta: 'Acepto y continúo',
  },
}

// ── Interprétations — Glogau ──────────────────────────────────────────────
const GLOGAU_INTERPRETATION_KEYS: Record<string, string> = {
  I: 'visual_glogauI', II: 'visual_glogauII', III: 'visual_glogauIII', IV: 'visual_glogauIV',
}

// ── Interprétation — Indice de vieillissement visuel (paliers 0-100) ──────
function getAgingIndexInterpretationKey(score: number): string {
  if (score >= 90) return 'visual_agingIndexExcellent'
  if (score >= 75) return 'visual_agingIndexGood'
  if (score >= 55) return 'visual_agingIndexModerate'
  if (score >= 35) return 'visual_agingIndexNoticeable'
  return 'visual_agingIndexPronounced'
}

// ── LAYOUT PARTAGÉ — titre fixe, contenu défilant ────────────────────────────
function SectionLayout({ badge, title, children }: { badge: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-3">
          {badge}
        </p>
        <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {title}
        </h2>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto pb-8" style={{ scrollbarWidth: 'none' }}>
        {children}
      </div>
    </div>
  )
}

// ── CARTE ANALYSE VISAGE — réutilisable (Résultats + Historique) ───────────
function FaceAnalysisCard({ faceAnalysis }: { faceAnalysis: FaceAnalysis }) {
  const t = useTranslations('myspace')
  const FACE_ZONE_KEYS: Record<string, string> = {
    jawline: 'visual_zoneJawline', eyelids: 'visual_zoneEyelids', neck: 'visual_zoneNeck',
  }

  return (
    <div className="flex-1 min-w-[280px] rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4 flex flex-col gap-4">

      {faceAnalysis.perceived_age_range && (
        <div className="rounded-[0.8rem] border border-[#8FC1E8]/20 bg-[#8FC1E8]/5 px-4 py-3">
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_perceivedAge')}</p>
          <p className="text-[1.8rem] font-light text-[#8FC1E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {faceAnalysis.perceived_age_range[0]}–{faceAnalysis.perceived_age_range[1]} <span className="text-[13px] text-white/50">{t('visual_yearsUnit')}</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_glogauStage')}</p>
          <p className="text-[1.4rem] font-light text-[#8FC1E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {faceAnalysis.glogau_stage ?? '—'}
          </p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_fitzpatrick')}</p>
          <p className="text-[1.4rem] font-light text-[#8FC1E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {faceAnalysis.fitzpatrick_type ?? '—'}
          </p>
        </div>
      </div>

      {faceAnalysis.glogau_stage && GLOGAU_INTERPRETATION_KEYS[faceAnalysis.glogau_stage] && (
        <p className="text-[11px] text-white/60 leading-relaxed italic">
          {t(GLOGAU_INTERPRETATION_KEYS[faceAnalysis.glogau_stage])}
        </p>
      )}

      {faceAnalysis.griffiths_scores && (
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-2">{t('visual_griffithsScores')}</p>
          <div className="flex flex-col gap-1.5">
            {[
              [t('visual_zoneForehead'), faceAnalysis.griffiths_scores.forehead],
              [t('visual_zonePeriorbital'), faceAnalysis.griffiths_scores.periorbital],
              [t('visual_zoneNasolabial'), faceAnalysis.griffiths_scores.nasolabial],
              [t('visual_zonePerioral'), faceAnalysis.griffiths_scores.perioral],
            ].map(([label, val]) => (
              <div key={label as string} className="flex items-center gap-2">
                <span className="text-[10px] text-white/60 w-[90px]">{label}</span>
                <div className="flex-1 h-[3px] bg-white/8 rounded-full">
                  <div className="h-[3px] rounded-full bg-[#8FC1E8]" style={{ width: `${((val as number) / 9) * 100}%` }} />
                </div>
                <span className="text-[10px] text-white/50 w-[16px] text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(faceAnalysis.midface_volume_score != null || faceAnalysis.tear_trough_score != null ||
        faceAnalysis.jowl_score != null || faceAnalysis.crows_feet_score != null ||
        faceAnalysis.texture_score != null) && (
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-2">{t('visual_volumetryTexture')}</p>
          <div className="flex flex-col gap-1.5">
            {[
              [t('visual_midfaceVolume'), faceAnalysis.midface_volume_score, 4],
              [t('visual_tearTrough'), faceAnalysis.tear_trough_score, 4],
              [t('visual_jowl'), faceAnalysis.jowl_score, 4],
              [t('visual_crowsFeet'), faceAnalysis.crows_feet_score, 4],
              [t('visual_textureScore'), faceAnalysis.texture_score, 9],
            ].filter(([, val]) => val != null).map(([label, val, max]) => (
              <div key={label as string} className="flex items-center gap-2">
                <span className="text-[10px] text-white/60 w-[110px]">{label}</span>
                <div className="flex-1 h-[3px] bg-white/8 rounded-full">
                  <div className="h-[3px] rounded-full bg-[#8FC1E8]" style={{ width: `${((val as number) / (max as number)) * 100}%` }} />
                </div>
                <span className="text-[10px] text-white/50 w-[24px] text-right">{val}/{max}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {faceAnalysis.skin_laxity && (
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1.5">{t('visual_skinLaxity')}</p>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(faceAnalysis.skin_laxity).map(([zone, val]) => (
              <span key={zone} className="text-[9px] px-2 py-1 rounded-full border border-white/10 text-white/60">
                {t(FACE_ZONE_KEYS[zone] ?? 'visual_notAssessable')}: {LAXITY_LABELS[val as string] ?? val}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {faceAnalysis.pigmentation_load_percent != null && (
          <div>
            <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_pigmentationLoad')}</p>
            <p className="text-[13px] text-white/75">{faceAnalysis.pigmentation_load_percent}%</p>
          </div>
        )}
        {faceAnalysis.vascularity_load_percent != null && (
          <div>
            <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_vascularity')}</p>
            <p className="text-[13px] text-white/75">{faceAnalysis.vascularity_load_percent}%</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {faceAnalysis.facial_asymmetry && (
          <div>
            <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_facialAsymmetry')}</p>
            <p className="text-[12px] text-white/75">{t(ASYMMETRY_KEYS[faceAnalysis.facial_asymmetry] ?? 'visual_notAssessable')}</p>
          </div>
        )}
        {faceAnalysis.fatigue_signs && (
          <div>
            <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_fatigueSigns')}</p>
            <p className="text-[12px] text-white/75">{t(FATIGUE_KEYS[faceAnalysis.fatigue_signs] ?? 'visual_notAssessable')}</p>
          </div>
        )}
      </div>

      {faceAnalysis.notes && (
        <p className="text-[11px] text-white/55 leading-relaxed border-t border-white/8 pt-3">
          {faceAnalysis.notes}
        </p>
      )}

      {faceAnalysis.confidence && (
        <p className="text-[9px] text-white/35 uppercase tracking-[0.1em]">
          {t('visual_confidenceLabel')} : {t(CONFIDENCE_KEYS[faceAnalysis.confidence] ?? 'visual_notAssessable')}
        </p>
      )}
    </div>
  )
}

// ── CARTE ANALYSE CORPS — réutilisable (Résultats + Historique) ────────────
function BodyAnalysisCard({ bodyAnalysis }: { bodyAnalysis: BodyAnalysis }) {
  const t = useTranslations('myspace')

  return (
    <div className="flex-1 min-w-[280px] rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4 flex flex-col gap-4">

      {bodyAnalysis.visual_aging_index != null && (
        <div className="rounded-[0.8rem] border border-[#8FC1E8]/20 bg-[#8FC1E8]/5 px-4 py-3">
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_agingIndex')}</p>
          <p className="text-[1.8rem] font-light text-[#8FC1E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {bodyAnalysis.visual_aging_index}<span className="text-[13px] text-white/50">/100</span>
          </p>
          <p className="text-[11px] text-white/60 leading-relaxed italic mt-2">
            {t(getAgingIndexInterpretationKey(bodyAnalysis.visual_aging_index))}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_posturalAlignment')}</p>
          <p className="text-[13px] text-white/80">{ORIENTATION_LABELS[bodyAnalysis.postural_alignment ?? ''] ?? '—'}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_shoulderHipSymmetry')}</p>
          <p className="text-[13px] text-white/80">{SYMMETRY_LABELS[bodyAnalysis.shoulder_hip_symmetry ?? ''] ?? '—'}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_waistHipRatio')}</p>
          <p className="text-[13px] text-white/80">{bodyAnalysis.waist_hip_ratio_estimate?.toFixed(2) ?? '—'}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_forwardHeadPosture')}</p>
          <p className="text-[13px] text-white/80">{t(FORWARD_HEAD_KEYS[bodyAnalysis.forward_head_posture ?? ''] ?? 'visual_notAssessable')}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_pelvicTilt')}</p>
          <p className="text-[13px] text-white/80">{t(PELVIC_TILT_KEYS[bodyAnalysis.pelvic_tilt ?? ''] ?? 'visual_notAssessable')}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_adiposityDistribution')}</p>
          <p className="text-[13px] text-white/80">{t(ADIPOSITY_KEYS[bodyAnalysis.adiposity_distribution ?? ''] ?? 'visual_notAssessable')}</p>
        </div>
      </div>

      {bodyAnalysis.muscle_tone && (
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1.5">{t('visual_muscleTone')}</p>
          <div className="flex gap-2 flex-wrap">
            {[
              [t('visual_muscleArms'), bodyAnalysis.muscle_tone.arms],
              [t('visual_muscleCore'), bodyAnalysis.muscle_tone.core],
              [t('visual_muscleLegs'), bodyAnalysis.muscle_tone.legs],
            ].map(([zone, val]) => (
              <span key={zone as string} className="text-[9px] px-2 py-1 rounded-full border border-white/10 text-white/60">
                {zone}: {MUSCLE_LABELS[val as string] ?? val}
              </span>
            ))}
          </div>
        </div>
      )}

      {bodyAnalysis.skin_laxity_body && (
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1.5">{t('visual_skinLaxityBody')}</p>
          <div className="flex gap-2 flex-wrap">
            {[
              [t('visual_laxityArms'), bodyAnalysis.skin_laxity_body.arms],
              [t('visual_laxityAbdomen'), bodyAnalysis.skin_laxity_body.abdomen],
            ].map(([zone, val]) => (
              <span key={zone as string} className="text-[9px] px-2 py-1 rounded-full border border-white/10 text-white/60">
                {zone}: {LAXITY_LABELS[val as string] ?? val}
              </span>
            ))}
          </div>
        </div>
      )}

      {bodyAnalysis.cellulite_grade != null && (
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_celluliteGrade')}</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-[3px] bg-white/8 rounded-full">
              <div className="h-[3px] rounded-full bg-[#8FC1E8]" style={{ width: `${(bodyAnalysis.cellulite_grade / SCALE_0_4_MAX) * 100}%` }} />
            </div>
            <span className="text-[10px] text-white/50 w-[24px] text-right">{bodyAnalysis.cellulite_grade}/4</span>
          </div>
        </div>
      )}

      {bodyAnalysis.sarcopenia_indicators && (
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45 mb-1">{t('visual_sarcopeniaIndicators')}</p>
          <p className="text-[12px] text-white/75">{t(SARCOPENIA_KEYS[bodyAnalysis.sarcopenia_indicators] ?? 'visual_notAssessable')}</p>
        </div>
      )}

      {bodyAnalysis.notes && (
        <p className="text-[11px] text-white/55 leading-relaxed border-t border-white/8 pt-3">
          {bodyAnalysis.notes}
        </p>
      )}

      {bodyAnalysis.confidence && (
        <p className="text-[9px] text-white/35 uppercase tracking-[0.1em]">
          {t('visual_confidenceLabel')} : {t(CONFIDENCE_KEYS[bodyAnalysis.confidence] ?? 'visual_notAssessable')}
        </p>
      )}
    </div>
  )
}


function ResultsSection({ faceShots, bodyShots, faceAnalysis, bodyAnalysis, loading }: {
  faceShots: CaptureShot[]
  bodyShots: CaptureShot[]
  faceAnalysis: FaceAnalysis | null
  bodyAnalysis: BodyAnalysis | null
  loading: boolean
}) {
  const t = useTranslations('myspace')
  const hasAny = faceShots.length > 0 || bodyShots.length > 0

  const FACE_ZONE_KEYS: Record<string, string> = {
    jawline: 'visual_zoneJawline', eyelids: 'visual_zoneEyelids', neck: 'visual_zoneNeck',
  }

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

      {!loading && hasAny && (
        <div className="flex flex-col gap-8 overflow-y-auto max-h-[70vh] md:max-h-[calc(100vh-490px)] [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>

          {/* ══════════════ ANALYSE VISAGE ══════════════ */}
          {faceShots.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 mb-3">{t('visual_faceAnalysisTitle')}</p>
              <div className="flex gap-6 flex-wrap">
                <div className="grid grid-cols-3 gap-2 w-[180px] shrink-0">
                  {faceShots.map((shot) => (
                    <div key={shot.pose} className="flex flex-col items-center gap-2">
                      <div className="relative w-full aspect-[3/4] rounded-[12px] overflow-hidden border border-white/8">
                        <img src={shot.url} alt={shot.pose} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[8px] uppercase tracking-[0.12em] text-white/50 text-center">{FACE_POSE_LABELS[shot.pose] ?? shot.pose}</p>
                    </div>
                  ))}
                </div>

                {faceAnalysis && <FaceAnalysisCard faceAnalysis={faceAnalysis} />}
              </div>
            </div>
          )}

          {/* ══════════════ ANALYSE CORPS ══════════════ */}
          {bodyShots.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 mb-3">{t('visual_bodyAnalysisTitle')}</p>
              <div className="flex gap-6 flex-wrap">
                <div className="grid grid-cols-4 gap-1.5 w-[180px] shrink-0">
                  {bodyShots.map((shot) => (
                    <div key={shot.pose} className="flex flex-col items-center gap-2">
                      <div className="relative w-full aspect-[3/4] rounded-[10px] overflow-hidden border border-white/8">
                        <img src={shot.url} alt={shot.pose} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[7px] uppercase tracking-[0.1em] text-white/50 text-center">{BODY_POSE_LABELS[shot.pose] ?? shot.pose}</p>
                    </div>
                  ))}
                </div>

                {bodyAnalysis && <BodyAnalysisCard bodyAnalysis={bodyAnalysis} />}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}

// ── Mappings ordinaux pour les tendances (catégories → échelle numérique) ──
const FITZPATRICK_ORDER: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6 }
const GLOGAU_ORDER: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4 }
const POSTURE_ORDER: Record<string, number> = { neutral: 0, mild_kyphosis: 1, pronounced_kyphosis: 2 }
const FORWARD_HEAD_ORDER: Record<string, number> = { neutral: 0, mild: 1, pronounced: 2 }
const PELVIC_ORDER: Record<string, number> = { neutral: 0, anterior: 1, posterior: 1 }
const SYMMETRY_ORDER: Record<string, number> = { symmetric: 0, mild_asymmetry: 1, notable_asymmetry: 2 }
const SARCOPENIA_ORDER: Record<string, number> = { none: 0, mild: 1, moderate: 2, pronounced: 3 }
const LAXITY_ORDER: Record<string, number> = { mild: 1, moderate: 2, pronounced: 3 }
const MUSCLE_ORDER: Record<string, number> = { low: 1, moderate: 2, high: 3 }
const ADIPOSITY_ORDER: Record<string, number> = { android: 1, mixed: 2, gynoid: 3 }

type MetricKey =
  | 'perceivedAge' | 'fitzpatrick' | 'glogau' | 'griffiths' | 'midface' | 'tearTrough' | 'jowl'
  | 'agingIndex' | 'postural' | 'forwardHead' | 'pelvicTilt' | 'whr' | 'symmetry' | 'muscleTone'
  | 'adiposity' | 'sarcopenia' | 'laxity' | 'cellulite'

// ── SECTION — ÉVOLUTION ────────────────────────────────────────────────────
function EvolveSection({ allAnalyses }: { allAnalyses: { capture_type: string; analysis: any; created_at: string }[] }) {
  const t = useTranslations('myspace')
  const [selected, setSelected] = useState<MetricKey | null>(null)

  const faceAnalyses = allAnalyses.filter(a => a.capture_type === 'face').slice().reverse()
  const bodyAnalyses = allAnalyses.filter(a => a.capture_type === 'body').slice().reverse()

  const extract = (analyses: any[], accessor: (a: any) => number | null | undefined) =>
    analyses
      .map(a => ({ date: a.created_at, value: accessor(a.analysis) }))
      .filter((p): p is { date: string; value: number } => typeof p.value === 'number')

  const series: Record<MetricKey, { date: string; value: number }[]> = {
    perceivedAge: extract(faceAnalyses, a => Array.isArray(a.perceived_age_range) ? Math.round((a.perceived_age_range[0] + a.perceived_age_range[1]) / 2) : null),
    fitzpatrick: extract(faceAnalyses, a => a.fitzpatrick_type ? FITZPATRICK_ORDER[a.fitzpatrick_type] ?? null : null),
    glogau: extract(faceAnalyses, a => a.glogau_stage ? GLOGAU_ORDER[a.glogau_stage] ?? null : null),
    griffiths: extract(faceAnalyses, a => a.griffiths_scores
      ? Math.round(((a.griffiths_scores.forehead + a.griffiths_scores.periorbital + a.griffiths_scores.nasolabial + a.griffiths_scores.perioral) / 4) * 10) / 10
      : null),
    midface: extract(faceAnalyses, a => a.midface_volume_score ?? null),
    tearTrough: extract(faceAnalyses, a => a.tear_trough_score ?? null),
    jowl: extract(faceAnalyses, a => a.jowl_score ?? null),
    agingIndex: extract(bodyAnalyses, a => a.visual_aging_index ?? null),
    postural: extract(bodyAnalyses, a => a.postural_alignment ? POSTURE_ORDER[a.postural_alignment] ?? null : null),
    forwardHead: extract(bodyAnalyses, a => a.forward_head_posture ? FORWARD_HEAD_ORDER[a.forward_head_posture] ?? null : null),
    pelvicTilt: extract(bodyAnalyses, a => a.pelvic_tilt ? PELVIC_ORDER[a.pelvic_tilt] ?? null : null),
    whr: extract(bodyAnalyses, a => a.waist_hip_ratio_estimate ?? null),
    symmetry: extract(bodyAnalyses, a => a.shoulder_hip_symmetry ? SYMMETRY_ORDER[a.shoulder_hip_symmetry] ?? null : null),
    muscleTone: extract(bodyAnalyses, a => a.muscle_tone
      ? Math.round(((MUSCLE_ORDER[a.muscle_tone.arms] ?? 0) + (MUSCLE_ORDER[a.muscle_tone.core] ?? 0) + (MUSCLE_ORDER[a.muscle_tone.legs] ?? 0)) / 3 * 10) / 10
      : null),
    adiposity: extract(bodyAnalyses, a => a.adiposity_distribution ? ADIPOSITY_ORDER[a.adiposity_distribution] ?? null : null),
    sarcopenia: extract(bodyAnalyses, a => a.sarcopenia_indicators ? SARCOPENIA_ORDER[a.sarcopenia_indicators] ?? null : null),
    laxity: extract(bodyAnalyses, a => a.skin_laxity_body
      ? Math.round(((LAXITY_ORDER[a.skin_laxity_body.arms] ?? 0) + (LAXITY_ORDER[a.skin_laxity_body.abdomen] ?? 0)) / 2 * 10) / 10
      : null),
    cellulite: extract(bodyAnalyses, a => a.cellulite_grade ?? null),
  }

  const METRICS: { key: MetricKey; label: string; max: number; unit: string; group: 'face' | 'body' }[] = [
    { key: 'perceivedAge', label: t('visual_perceivedAge'), max: 90, unit: ` ${t('visual_yearsUnit')}`, group: 'face' },
    { key: 'fitzpatrick', label: t('visual_fitzpatrick'), max: 6, unit: '', group: 'face' },
    { key: 'glogau', label: t('visual_glogauStage'), max: 4, unit: '', group: 'face' },
    { key: 'griffiths', label: t('visual_griffithsScores'), max: 9, unit: '/9', group: 'face' },
    { key: 'midface', label: t('visual_midfaceVolume'), max: 4, unit: '/4', group: 'face' },
    { key: 'tearTrough', label: t('visual_tearTrough'), max: 4, unit: '/4', group: 'face' },
    { key: 'jowl', label: t('visual_jowl'), max: 4, unit: '/4', group: 'face' },
    { key: 'agingIndex', label: t('visual_agingIndex'), max: 100, unit: '/100', group: 'body' },
    { key: 'postural', label: t('visual_posturalAlignment'), max: 2, unit: '', group: 'body' },
    { key: 'forwardHead', label: t('visual_forwardHeadPosture'), max: 2, unit: '', group: 'body' },
    { key: 'pelvicTilt', label: t('visual_pelvicTilt'), max: 1, unit: '', group: 'body' },
    { key: 'whr', label: t('visual_waistHipRatio'), max: 1.2, unit: '', group: 'body' },
    { key: 'symmetry', label: t('visual_shoulderHipSymmetry'), max: 2, unit: '', group: 'body' },
    { key: 'muscleTone', label: t('visual_muscleTone'), max: 3, unit: '/3', group: 'body' },
    { key: 'adiposity', label: t('visual_adiposityDistribution'), max: 3, unit: '', group: 'body' },
    { key: 'sarcopenia', label: t('visual_sarcopeniaIndicators'), max: 3, unit: '/3', group: 'body' },
    { key: 'laxity', label: t('visual_skinLaxityBody'), max: 3, unit: '/3', group: 'body' },
    { key: 'cellulite', label: t('visual_celluliteGrade'), max: 4, unit: '/4', group: 'body' },
  ]

  const hasAny = Object.values(series).some(s => s.length > 0)

  if (!hasAny) {
    return (
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-3">{t('visual_menuEvolve')}</p>
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

  const activeMetric = METRICS.find(m => m.key === selected)
  const activeSeries = selected ? series[selected] : []

  const W = 600, H = 100
  const n = activeSeries.length
  const px = (i: number) => n <= 1 ? W / 2 : (i / (n - 1)) * W
  const py = (val: number, max: number) => H - (val / max) * H * 0.9
  const pathD = activeMetric ? activeSeries.map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(1)} ${py(p.value, activeMetric.max).toFixed(1)}`).join(' ') : ''
  const areaD = activeMetric && n > 1 ? `${pathD} L ${px(n - 1).toFixed(1)} ${H} L 0 ${H} Z` : ''

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-3">{t('visual_menuEvolve')}</p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('visual_evolveTitle')}
      </h2>

      <div className="overflow-y-auto max-h-[70vh] md:max-h-[calc(100vh-490px)] [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>

        <p className="text-[11px] text-white/45 mb-3">{t('visual_selectMetric')}</p>

        <div className="mb-2">
          <p className="text-[9px] uppercase tracking-[0.16em] text-[#8FC1E8]/60 mb-2">{t('visual_faceAnalysisTitle')}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {METRICS.filter(m => m.group === 'face').map(m => (
              <button key={m.key} onClick={() => setSelected(m.key)}
                disabled={series[m.key].length === 0}
                className={`rounded-full border px-3 py-1.5 text-[11px] transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                  selected === m.key ? 'border-[#8FC1E8]/70 bg-[#8FC1E8]/15 text-[#8FC1E8]' : 'border-white/10 text-white/60 hover:border-white/25'
                }`}>
                {m.label}
              </button>
            ))}
          </div>

          <p className="text-[9px] uppercase tracking-[0.16em] text-[#8FC1E8]/60 mb-2">{t('visual_bodyAnalysisTitle')}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {METRICS.filter(m => m.group === 'body').map(m => (
              <button key={m.key} onClick={() => setSelected(m.key)}
                disabled={series[m.key].length === 0}
                className={`rounded-full border px-3 py-1.5 text-[11px] transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                  selected === m.key ? 'border-[#8FC1E8]/70 bg-[#8FC1E8]/15 text-[#8FC1E8]' : 'border-white/10 text-white/60 hover:border-white/25'
                }`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {activeMetric && (
          activeSeries.length === 0 ? (
            <p className="text-[13px] italic text-white/50">{t('visual_noTrendData')}</p>
          ) : (
            <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/65">{activeMetric.label}</p>
                <p className="text-[11px] text-[#8FC1E8]/80">
                  {activeSeries[activeSeries.length - 1].value}{activeMetric.unit} — {t('visual_latestValue')}
                </p>
              </div>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '90px' }}>
                <defs>
                  <linearGradient id="evolveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8FC1E8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#8FC1E8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {areaD && <path d={areaD} fill="url(#evolveGrad)" />}
                <path d={pathD} fill="none" stroke="#8FC1E8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                {activeSeries.map((p, i) => (
                  <circle key={i} cx={px(i)} cy={py(p.value, activeMetric.max)} r="2.5" fill="#8FC1E8" opacity="0.85" />
                ))}
              </svg>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-white/45">
                  {new Date(activeSeries[0].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-[9px] text-white/45">
                  {new Date(activeSeries[activeSeries.length - 1].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          )
        )}

      </div>
    </div>
  )
}

// ── SECTION — HISTORIQUE ──────────────────────────────────────────────────────
function HistorySection({ allAnalyses, loading }: {
  allAnalyses: { capture_type: string; analysis: any; created_at: string }[]
  loading: boolean
}) {
  const t = useTranslations('myspace')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Regroupement par mois (clé "2026-07")
  const byMonth: Record<string, { capture_type: string; analysis: any; created_at: string }[]> = {}
  for (const a of allAnalyses) {
    const monthKey = a.created_at.slice(0, 7)
    if (!byMonth[monthKey]) byMonth[monthKey] = []
    byMonth[monthKey].push(a)
  }
  const months = Object.keys(byMonth).sort((a, b) => b.localeCompare(a))

  const selected = allAnalyses.find(a => a.created_at === selectedId) ?? null

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

      {!loading && allAnalyses.length === 0 && (
        <p className="text-[14px] italic text-white/55" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {t('visual_historyEmpty')}
        </p>
      )}

      {!loading && allAnalyses.length > 0 && (
        <div className="overflow-y-auto max-h-[70vh] md:max-h-[calc(100vh-490px)] [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>

          <div className="rounded-[1rem] border border-[#8FC1E8]/20 bg-[#8FC1E8]/5 px-5 py-3 mb-5">
            <p className="text-[12px] text-white/65 leading-relaxed">{t('visual_historyRecommendation')}</p>
          </div>

          {selected ? (
            <div>
              <button onClick={() => setSelectedId(null)}
                className="mb-4 text-[11px] uppercase tracking-[0.18em] text-[#8FC1E8]/80 hover:text-[#8FC1E8] transition">
                ← {t('visual_closeDetail')}
              </button>
              <p className="text-[13px] text-white/70 mb-4">
                {new Date(selected.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                {' — '}
                {selected.capture_type === 'face' ? t('visual_faceAnalysisTitle') : t('visual_bodyAnalysisTitle')}
              </p>
              <div className="flex gap-6 flex-wrap">
                {selected.capture_type === 'face'
                  ? <FaceAnalysisCard faceAnalysis={selected.analysis as FaceAnalysis} />
                  : <BodyAnalysisCard bodyAnalysis={selected.analysis as BodyAnalysis} />}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {months.map((monthKey) => {
                const items = byMonth[monthKey]
                const faceCount = items.filter(i => i.capture_type === 'face').length
                const bodyCount = items.filter(i => i.capture_type === 'body').length
                const monthLabel = new Date(monthKey + '-01').toLocaleDateString(undefined, { year: 'numeric', month: 'long' })

                return (
                  <div key={monthKey}>
                   <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 mb-2">
  {items.length} {t('visual_sessionsIn')} {monthLabel}
</p>
                    <div className="flex flex-col gap-2">
                      {items.map((a) => (
                        <button key={a.created_at} onClick={() => setSelectedId(a.created_at)}
                          className="rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-3 flex items-center justify-between text-left hover:border-[#8FC1E8]/40 transition-all">
                          <div>
                            <p className="text-[13px] text-white/80">
                              {new Date(a.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-[11px] text-white/45">
                              {a.capture_type === 'face' ? t('visual_faceAnalysisTitle') : t('visual_bodyAnalysisTitle')}
                            </p>
                          </div>
                          <span className="text-[11px] text-[#8FC1E8]/70">{t('visual_viewDetail')} →</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      )}
    </div>
  )
}

function ReportSection({ allAnalyses, chronologicalAge, onSendGlobal, onSendDetail, sendingGlobal, sendingDetail, sentGlobal, sentDetail, period, setPeriod, narrative, narrativeGeneratedAt, narrativeLoading, onUpdateNarrative, lastSessionDate }: {
  allAnalyses: { capture_type: string; analysis: any; created_at: string }[]
  chronologicalAge: number | null
  onSendGlobal: () => void
  onSendDetail: () => void
  sendingGlobal: boolean
  sendingDetail: boolean
  sentGlobal: boolean
  sentDetail: boolean
  period: '30' | '90' | '180'
  setPeriod: (p: '30' | '90' | '180') => void
  narrative: string | null
  narrativeGeneratedAt: string | null
  narrativeLoading: boolean
  onUpdateNarrative: () => void
  lastSessionDate: string | null
}) {
  const t = useTranslations('myspace')

  const since = new Date()
  since.setDate(since.getDate() - parseInt(period))

  const filtered = allAnalyses.filter(a => new Date(a.created_at) >= since)
  const faceAnalyses = filtered.filter(a => a.capture_type === 'face')
  const bodyAnalyses = filtered.filter(a => a.capture_type === 'body')

  const perceivedAgeMidpoints = faceAnalyses
    .map(a => a.analysis?.perceived_age_range)
    .filter((r: any) => Array.isArray(r) && r.length === 2)
    .map((r: number[]) => (r[0] + r[1]) / 2)

  const avgPerceivedAge = perceivedAgeMidpoints.length
    ? Math.round(perceivedAgeMidpoints.reduce((s, v) => s + v, 0) / perceivedAgeMidpoints.length)
    : null

  const ageGap = (chronologicalAge != null && avgPerceivedAge != null) ? avgPerceivedAge - chronologicalAge : null

  const agingIndexValues = bodyAnalyses
    .map(a => a.analysis?.visual_aging_index)
    .filter((v: any) => typeof v === 'number')

  const avgAgingIndex = agingIndexValues.length
    ? Math.round(agingIndexValues.reduce((s, v) => s + v, 0) / agingIndexValues.length)
    : null

  const latestFace = faceAnalyses[0]?.analysis ?? null

  const gapColor = (gap: number | null) => {
    if (gap == null) return '#EAE4D5'
    if (gap <= 0) return '#4ADE80'
    if (gap <= 5) return '#E7C980'
    return '#FF4D6D'
  }

  const agingIndexColorFn = (v: number) => v >= 75 ? '#4ADE80' : v >= 55 ? '#8FC1E8' : v >= 35 ? '#E7C980' : '#FF4D6D'

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-3">{t('visual_menuReport')}</p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('visual_reportTitle')}
      </h2>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {([['30', t('visual_report30')], ['90', t('visual_report90')], ['180', t('visual_report180')]] as [string, string][]).map(([val, label]) => (
          <button key={val} onClick={() => setPeriod(val as any)}
            className={`rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-all ${
              period === val ? 'border-[#8FC1E8]/70 bg-[#8FC1E8]/15 text-[#8FC1E8]' : 'border-white/10 text-white/55 hover:border-white/25'
            }`}>
            {label}
          </button>
        ))}

{(() => {
  const isUpToDate = !lastSessionDate || Boolean(narrativeGeneratedAt && new Date(narrativeGeneratedAt) >= new Date(lastSessionDate))
  return (
    <button onClick={onUpdateNarrative} disabled={narrativeLoading || isUpToDate}
              className={`rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-all ${
                isUpToDate ? 'border-white/8 text-white/30 cursor-not-allowed' : 'border-[#8FC1E8]/65 bg-[#8FC1E8]/15 text-[#8FC1E8] hover:bg-[#8FC1E8]/25'
              } disabled:opacity-50`}>
              {narrativeLoading ? t('visual_narrativeUpdating') : t('visual_narrativeUpdate')}
            </button>
          )
        })()}

        <div className="ml-auto flex gap-2">
          <button onClick={onSendGlobal} disabled={sendingGlobal || filtered.length === 0}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[11px] uppercase tracking-[0.14em] text-white/55 transition hover:border-[#8FC1E8]/45 hover:text-[#8FC1E8] disabled:opacity-40 disabled:cursor-not-allowed">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {sendingGlobal ? t('visual_reportSending') : sentGlobal ? t('visual_reportSent') : t('visual_reportGlobal')}
          </button>
          <button onClick={onSendDetail} disabled={sendingDetail || filtered.length === 0}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[11px] uppercase tracking-[0.14em] text-white/55 transition hover:border-[#8FC1E8]/45 hover:text-[#8FC1E8] disabled:opacity-40 disabled:cursor-not-allowed">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {sendingDetail ? t('visual_reportSending') : sentDetail ? t('visual_reportSent') : t('visual_reportDetail')}
          </button>
        </div>
      </div>

      {narrativeGeneratedAt && (
        <p className="text-[10px] text-white/35 mb-6">
          {t('visual_narrativeLastUpdate')} {new Date(narrativeGeneratedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="text-[14px] italic text-white/55" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {t('visual_reportEmpty')}
        </p>
      ) : (
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] md:max-h-[calc(100vh-490px)] [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>

          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-4 py-3">
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/45 mb-1">{t('visual_chronologicalAge')}</p>
              <p className="text-[1.4rem] font-light leading-none text-[#EAE4D5]/80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {chronologicalAge ?? '—'}
              </p>
            </div>
            <div className="rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-4 py-3">
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/45 mb-1">{t('visual_perceivedAge')}</p>
              <p className="text-[1.4rem] font-light leading-none text-[#8FC1E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {avgPerceivedAge ?? '—'}
              </p>
            </div>
            <div className="rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-4 py-3">
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/45 mb-1">{t('visual_ageGap')}</p>
              <p className="text-[1.4rem] font-light leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", color: gapColor(ageGap) }}>
                {ageGap != null ? `${ageGap > 0 ? '+' : ''}${ageGap}` : '—'}
              </p>
            </div>
            <div className="rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-4 py-3">
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/45 mb-1">{t('visual_agingIndex')}</p>
              <p className="text-[1.4rem] font-light leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", color: avgAgingIndex != null ? agingIndexColorFn(avgAgingIndex) : '#EAE4D5' }}>
                {avgAgingIndex ?? '—'}<span className="text-[11px] text-white/30">/100</span>
              </p>
            </div>
          </div>

          {!chronologicalAge && (
            <p className="text-[11px] text-white/40 italic -mt-2">{t('visual_noDob')}</p>
          )}

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-4 py-3">
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/45 mb-1">{t('visual_faceSessionsCount')}</p>
              <p className="text-[1.4rem] font-light leading-none text-[#EAE4D5]/80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {faceAnalyses.length}
              </p>
            </div>
            <div className="rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-4 py-3">
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/45 mb-1">{t('visual_bodySessionsCount')}</p>
              <p className="text-[1.4rem] font-light leading-none text-[#EAE4D5]/80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {bodyAnalyses.length}
              </p>
            </div>
            <div className="rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-4 py-3">
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/45 mb-1">{t('visual_glogauStage')}</p>
              <p className="text-[1.4rem] font-light leading-none text-[#8FC1E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {latestFace?.glogau_stage ?? '—'}
              </p>
            </div>
          </div>

          {narrative && (
            <div className="rounded-[1.2rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 mb-3">{t('visual_narrativeTitle')}</p>
              <p className="text-[13px] text-white/70 leading-relaxed whitespace-pre-line">{narrative}</p>
            </div>
          )}

        </div>
      )}
    </div>
  )
}

const FACE_SILHOUETTE_SRC: Record<'center' | 'left' | 'right', string> = {
  center: '/visage.png',
  left: '/profilA.png',
  right: '/profilB.png',
}

// ── SECTION — CAPTURE VISAGE (placeholder) ───────────────────────────────────
function CaptureFaceSection({ uploads, setUploads, isUploading, onAnalyze }: {
  uploads: Record<'center' | 'left' | 'right', File | null>
  setUploads: (u: Record<'center' | 'left' | 'right', File | null>) => void
  isUploading: boolean
  onAnalyze: () => void
}) {
  const t = useTranslations('myspace')
  const poses: { id: 'center' | 'left' | 'right'; label: string }[] = [
    { id: 'center', label: FACE_POSE_LABELS.center },
    { id: 'left', label: FACE_POSE_LABELS.left },
    { id: 'right', label: FACE_POSE_LABELS.right },
  ]
  const allFilled = poses.every(p => uploads[p.id] !== null)

  const handleFile = (pose: 'center' | 'left' | 'right', file: File | null) => {
    setUploads({ ...uploads, [pose]: file })
  }

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-3">
        {t('visual_menuCaptureFace')}
      </p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('visual_captureFaceTitle')}
      </h2>

      <div className="rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4 mb-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8FC1E8]/70 mb-2">{t('visual_uploadRecTitle')}</p>
        <p className="text-[12px] text-white/60 leading-relaxed">{t('visual_uploadRecFace')}</p>
      </div>

  <div className="grid grid-cols-3 gap-3 mb-6 max-w-[720px]">
  {poses.map((p) => (
    <label key={p.id}
      className="relative aspect-[3/4] max-h-[400px] rounded-[0.8rem] border border-dashed border-white/25 bg-white/[0.03] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#8FC1E8]/55 hover:bg-[#8FC1E8]/5 transition-all overflow-hidden">
            {uploads[p.id] ? (
              <img src={URL.createObjectURL(uploads[p.id]!)} alt={p.label} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <img src={FACE_SILHOUETTE_SRC[p.id]} alt="" aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" />
                <span className="relative text-[10px] uppercase tracking-[0.14em] text-white/50 text-center px-2 bg-black/40 rounded-full py-1">{p.label}</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden"
              onChange={(e) => handleFile(p.id, e.target.files?.[0] ?? null)} />
          </label>
        ))}
      </div>

      <button onClick={onAnalyze} disabled={!allFilled || isUploading}
        className="relative w-full rounded-full border border-[#8FC1E8]/65 bg-[#8FC1E8]/15 py-4 text-[12px] uppercase tracking-[0.22em] text-[#8FC1E8] transition hover:bg-[#8FC1E8]/25 disabled:opacity-40 disabled:cursor-not-allowed">
        {isUploading ? t('visual_uploadAnalyzing') : t('visual_uploadAnalyze')}
      </button>
    </div>
  )
}
const BODY_SILHOUETTE_SRC: Record<'front' | 'back' | 'left' | 'right', string> = {
  front: '/face.png',
  back: '/dos.png',
  left: '/coteA.png',
  right: '/coteB.png',
}
// ── SECTION — CAPTURE CORPS (placeholder) ────────────────────────────────────
function CaptureBodySection({ uploads, setUploads, isUploading, onAnalyze }: {
  uploads: Record<'front' | 'back' | 'left' | 'right', File | null>
  setUploads: (u: Record<'front' | 'back' | 'left' | 'right', File | null>) => void
  isUploading: boolean
  onAnalyze: () => void
}) {
  const t = useTranslations('myspace')
  const poses: { id: 'front' | 'back' | 'left' | 'right'; label: string }[] = [
    { id: 'front', label: BODY_POSE_LABELS.front },
    { id: 'back', label: BODY_POSE_LABELS.back },
    { id: 'left', label: BODY_POSE_LABELS.left },
    { id: 'right', label: BODY_POSE_LABELS.right },
  ]
  const allFilled = poses.every(p => uploads[p.id] !== null)

  const handleFile = (pose: 'front' | 'back' | 'left' | 'right', file: File | null) => {
    setUploads({ ...uploads, [pose]: file })
  }

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80 mb-3">
        {t('visual_menuCaptureBody')}
      </p>
      <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {t('visual_captureBodyTitle')}
      </h2>

      <div className="rounded-[1rem] border border-white/8 bg-black/24 backdrop-blur-xl px-5 py-4 mb-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8FC1E8]/70 mb-2">{t('visual_uploadRecTitle')}</p>
        <p className="text-[12px] text-white/60 leading-relaxed">{t('visual_uploadRecBody')}</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {poses.map((p) => (
          <label key={p.id}
            className="relative aspect-[3/4] rounded-[1rem] border border-dashed border-white/25 bg-white/[0.03] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#8FC1E8]/55 hover:bg-[#8FC1E8]/5 transition-all overflow-hidden">
            {uploads[p.id] ? (
              <img src={URL.createObjectURL(uploads[p.id]!)} alt={p.label} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
             <img src={BODY_SILHOUETTE_SRC[p.id]} alt="" aria-hidden="true"
  className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" />
                <span className="relative text-[9px] uppercase tracking-[0.12em] text-white/50 text-center px-1 bg-black/40 rounded-full py-1">{p.label}</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden"
              onChange={(e) => handleFile(p.id, e.target.files?.[0] ?? null)} />
          </label>
        ))}
      </div>

      <button onClick={onAnalyze} disabled={!allFilled || isUploading}
        className="relative w-full rounded-full border border-[#8FC1E8]/65 bg-[#8FC1E8]/15 py-4 text-[12px] uppercase tracking-[0.22em] text-[#8FC1E8] transition hover:bg-[#8FC1E8]/25 disabled:opacity-40 disabled:cursor-not-allowed">
        {isUploading ? t('visual_uploadAnalyzing') : t('visual_uploadAnalyze')}
      </button>
    </div>
  )
}

// ── MODALE DE CONSENTEMENT — capture biométrique ────────────────────────────
function ConsentModal({ locale, onAccept, onCancel }: { locale: string; onAccept: () => void; onCancel: () => void }) {
  const [checked, setChecked] = useState(false)
  const c = CONSENT_TEXT[locale] ?? CONSENT_TEXT.en

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-lg max-h-[85vh] rounded-[24px] border border-white/10 bg-[#040B14] shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
        <div className="absolute top-0 left-[12%] w-[76%] h-[2px] bg-gradient-to-r from-transparent via-[#8FC1E8] to-transparent opacity-70" />

        <div className="px-8 pt-8 pb-4 shrink-0">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#8FC1E8]/80 mb-2">My Visual</p>
          <h3 className="text-[1.6rem] font-light text-[#EAE4D5]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {c.title}
          </h3>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-8 pb-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          <p className="text-[13px] text-white/70 leading-relaxed mb-4">{c.intro}</p>

          <ul className="flex flex-col gap-2 mb-5">
            {c.points.map((p, i) => (
              <li key={i} className="text-[12px] text-white/60 leading-relaxed flex gap-2">
                <span className="text-[#8FC1E8]/70 shrink-0">—</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <p className="text-[11px] uppercase tracking-[0.16em] text-[#8FC1E8]/70 mb-3">{c.recTitle}</p>

          <div className="mb-4">
            <p className="text-[12px] font-medium text-white/75 mb-1">{c.lightTitle}</p>
            <ul className="flex flex-col gap-1">
              {c.lightPoints.map((p, i) => (
                <li key={i} className="text-[11px] text-white/55 leading-relaxed flex gap-2">
                  <span className="shrink-0">—</span><span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <p className="text-[12px] font-medium text-white/75 mb-1">{c.attireTitle}</p>
            <ul className="flex flex-col gap-1">
              {c.attirePoints.map((p, i) => (
                <li key={i} className="text-[11px] text-white/55 leading-relaxed flex gap-2">
                  <span className="shrink-0">—</span><span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-2">
            <p className="text-[12px] font-medium text-white/75 mb-1">{c.faceTitle}</p>
            <ul className="flex flex-col gap-1">
              {c.facePoints.map((p, i) => (
                <li key={i} className="text-[11px] text-white/55 leading-relaxed flex gap-2">
                  <span className="shrink-0">—</span><span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-8 py-5 border-t border-white/8 shrink-0">
          <label className="flex items-start gap-3 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#8FC1E8]"
            />
            <span className="text-[11px] text-white/65 leading-relaxed">{c.checkbox}</span>
          </label>

          <div className="flex gap-3">
            <button onClick={onCancel}
              className="flex-1 rounded-full border border-white/10 py-3 text-[11px] uppercase tracking-[0.18em] text-white/50 transition hover:bg-white/[0.03]">
              {locale === 'fr' ? 'Annuler' : locale === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
            <button onClick={onAccept} disabled={!checked}
              className="flex-1 rounded-full border border-[#8FC1E8]/65 bg-[#8FC1E8]/15 py-3 text-[11px] uppercase tracking-[0.18em] text-[#8FC1E8] transition hover:bg-[#8FC1E8]/25 disabled:opacity-30 disabled:cursor-not-allowed">
              {c.cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function VisualSpace({ memberTier, fullName, sex, onBack, onSignOut }: VisualSpaceProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<ActiveSection>(null)
  const [showQR, setShowQR] = useState(false)
const [showConsentModal, setShowConsentModal] = useState(false)
const [pendingAction, setPendingAction] = useState<'captureFace' | 'captureBody' | 'connectPhone' | null>(null)
const [hasValidConsent, setHasValidConsent] = useState(false)
  const [qrToken, setQrToken] = useState<string | null>(null)
  const [faceShots, setFaceShots] = useState<CaptureShot[]>([])
  const [bodyShots, setBodyShots] = useState<CaptureShot[]>([])
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysis | null>(null)
  const [bodyAnalysis, setBodyAnalysis] = useState<BodyAnalysis | null>(null)
const [historySessions, setHistorySessions] = useState<{ date: string; faceCount: number; bodyCount: number }[]>([])
const [dataLoading, setDataLoading] = useState(true)
const [allAnalyses, setAllAnalyses] = useState<{ capture_type: string; analysis: any; created_at: string }[]>([])
const [chronologicalAge, setChronologicalAge] = useState<number | null>(null)
const [reportPeriod, setReportPeriod] = useState<'30' | '90' | '180'>('30')
const [sendingGlobal, setSendingGlobal] = useState(false)
const [sendingDetail, setSendingDetail] = useState(false)
const [sentGlobal, setSentGlobal] = useState(false)
const [sentDetail, setSentDetail] = useState(false)
const [narrative, setNarrative] = useState<string | null>(null)
const [narrativeGeneratedAt, setNarrativeGeneratedAt] = useState<string | null>(null)
const [narrativeLoading, setNarrativeLoading] = useState(false)
const [faceUploads, setFaceUploads] = useState<Record<'center' | 'left' | 'right', File | null>>({ center: null, left: null, right: null })
const [bodyUploads, setBodyUploads] = useState<Record<'front' | 'back' | 'left' | 'right', File | null>>({ front: null, back: null, left: null, right: null })
const [isUploadingFace, setIsUploadingFace] = useState(false)
const [isUploadingBody, setIsUploadingBody] = useState(false)

  const t = useTranslations('myspace')
  const tGlobal = useTranslations()
  const locale = useLocale()
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

        // Vérification du consentement biométrique en vigueur
        const { data: consent } = await supabase
          .from('visual_consents')
          .select('consent_version')
          .eq('user_id', user.id)
          .order('accepted_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        setHasValidConsent(consent?.consent_version === VISUAL_CONSENT_VERSION)

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

        // Dernières analyses (une par capture_type) + historique complet pour Rapport
        const { data: analyses } = await supabase
          .from('visual_analyses')
          .select('capture_type, analysis, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (analyses) {
          const latestFaceAnalysis = analyses.find(a => a.capture_type === 'face')
          const latestBodyAnalysis = analyses.find(a => a.capture_type === 'body')
          if (latestFaceAnalysis) setFaceAnalysis(latestFaceAnalysis.analysis as FaceAnalysis)
          if (latestBodyAnalysis) setBodyAnalysis(latestBodyAnalysis.analysis as BodyAnalysis)
          setAllAnalyses(analyses as { capture_type: string; analysis: any; created_at: string }[])
        }

        // Dernière narrative de rapport générée (période 30j par défaut)
        const { data: lastNarrative } = await supabase
          .from('visual_report_narratives')
          .select('narrative, generated_at')
          .eq('user_id', user.id)
          .eq('period', '30')
          .order('generated_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (lastNarrative) {
          setNarrative(lastNarrative.narrative)
          setNarrativeGeneratedAt(lastNarrative.generated_at)
        }

        // Âge chronologique — depuis date_of_birth (fiable pour Premium/Executive)
        const { data: profile } = await supabase
          .from('profiles')
          .select('date_of_birth')
          .eq('id', user.id)
          .single()

        if (profile?.date_of_birth) {
          const dob = new Date(profile.date_of_birth)
          const today = new Date()
          let age = today.getFullYear() - dob.getFullYear()
          const m = today.getMonth() - dob.getMonth()
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
          setChronologicalAge(age)
        }

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
const handleAcceptConsent = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase.from('visual_consents').insert({
    user_id: user.id,
    consent_version: VISUAL_CONSENT_VERSION,
    locale,
  })

  if (error) {
    console.error('Erreur insertion consentement:', error)
    return
  }

  setHasValidConsent(true)
  setShowConsentModal(false)

  if (pendingAction === 'captureFace') setActiveSection('captureFace')
  if (pendingAction === 'captureBody') setActiveSection('captureBody')
  if (pendingAction === 'connectPhone') generateQRToken()

  setPendingAction(null)
}

const handleCancelConsent = () => {
  setShowConsentModal(false)
  setPendingAction(null)
}

const requestActionWithConsent = (action: 'captureFace' | 'captureBody' | 'connectPhone') => {
  if (hasValidConsent) {
    if (action === 'captureFace') setActiveSection(prev => prev === 'captureFace' ? null : 'captureFace')
    if (action === 'captureBody') setActiveSection(prev => prev === 'captureBody' ? null : 'captureBody')
    if (action === 'connectPhone') generateQRToken()
    return
  }
  setPendingAction(action)
  setShowConsentModal(true)
}

const handleUploadAnalyzeFace = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const shots = Object.entries(faceUploads).filter(([, f]) => f !== null) as [string, File][]
  if (shots.length < 3) return

  setIsUploadingFace(true)
  try {
    const sessionId = crypto.randomUUID()
    for (const [pose, file] of shots) {
      const formData = new FormData()
      formData.append('userId', user.id)
      formData.append('captureType', 'face')
      formData.append('pose', pose)
      formData.append('sessionId', sessionId)
      formData.append('image', file, `${pose}.jpg`)
      await fetch('/api/visual-capture-upload', { method: 'POST', body: formData })
    }
    await fetch('/api/visual-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, sessionId, captureType: 'face', locale }),
    })
    setFaceUploads({ center: null, left: null, right: null })
    setActiveSection('results')
  } catch (e) {
    console.error('face upload/analyze error:', e)
  } finally {
    setIsUploadingFace(false)
  }
}

const handleUploadAnalyzeBody = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const shots = Object.entries(bodyUploads).filter(([, f]) => f !== null) as [string, File][]
  if (shots.length < 4) return

  setIsUploadingBody(true)
  try {
    const sessionId = crypto.randomUUID()
    for (const [pose, file] of shots) {
      const formData = new FormData()
      formData.append('userId', user.id)
      formData.append('captureType', 'body')
      formData.append('pose', pose)
      formData.append('sessionId', sessionId)
      formData.append('image', file, `${pose}.jpg`)
      await fetch('/api/visual-capture-upload', { method: 'POST', body: formData })
    }
    await fetch('/api/visual-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, sessionId, captureType: 'body', locale }),
    })
    setBodyUploads({ front: null, back: null, left: null, right: null })
    setActiveSection('results')
  } catch (e) {
    console.error('body upload/analyze error:', e)
  } finally {
    setIsUploadingBody(false)
  }
}



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

const handleUpdateNarrative = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  setNarrativeLoading(true)
  try {
    const res = await fetch('/api/visual-report-narrative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, period: reportPeriod, locale }),
    })
    const data = await res.json()
    if (data.narrative) {
      setNarrative(data.narrative)
      setNarrativeGeneratedAt(data.generatedAt)
    }
  } catch (e) {
    console.error('narrative update error:', e)
  } finally {
    setNarrativeLoading(false)
  }
}

const handleSendVisualReport = async (type: 'global' | 'detail') => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return
  const setSending = type === 'global' ? setSendingGlobal : setSendingDetail
  const setSent    = type === 'global' ? setSentGlobal    : setSentDetail
  setSending(true)
  setSent(false)
  try {
    await fetch('/api/visual-report-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        period: reportPeriod,
        locale,
        type,
        email: user.email,
        fullName,
      }),
    })
    setSent(true)
  } catch (e) {
    console.error('visual report send error:', e)
  } finally {
    setSending(false)
  }
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
      case 'results':     return <ResultsSection faceShots={faceShots} bodyShots={bodyShots} faceAnalysis={faceAnalysis} bodyAnalysis={bodyAnalysis} loading={dataLoading} />
      case 'evolve':      return <EvolveSection allAnalyses={allAnalyses} />
      case 'history':     return <HistorySection allAnalyses={allAnalyses} loading={dataLoading} />
      case 'report':
  return (
    <ReportSection
      allAnalyses={allAnalyses}
      chronologicalAge={chronologicalAge}
      onSendGlobal={() => handleSendVisualReport('global')}
      onSendDetail={() => handleSendVisualReport('detail')}
      sendingGlobal={sendingGlobal}
      sendingDetail={sendingDetail}
      sentGlobal={sentGlobal}
      sentDetail={sentDetail}
      period={reportPeriod}
      setPeriod={async (p) => {
        setReportPeriod(p)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data: lastNarrative } = await supabase
          .from('visual_report_narratives')
          .select('narrative, generated_at')
          .eq('user_id', user.id)
          .eq('period', p)
          .order('generated_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        setNarrative(lastNarrative?.narrative ?? null)
        setNarrativeGeneratedAt(lastNarrative?.generated_at ?? null)
      }}
      narrative={narrative}
      narrativeGeneratedAt={narrativeGeneratedAt}
      narrativeLoading={narrativeLoading}
      onUpdateNarrative={handleUpdateNarrative}
      lastSessionDate={allAnalyses[0]?.created_at ?? null}
    />
  )
    case 'captureFace': return <CaptureFaceSection uploads={faceUploads} setUploads={setFaceUploads} isUploading={isUploadingFace} onAnalyze={handleUploadAnalyzeFace} />
case 'captureBody': return <CaptureBodySection uploads={bodyUploads} setUploads={setBodyUploads} isUploading={isUploadingBody} onAnalyze={handleUploadAnalyzeBody} />
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
          <div className="relative ml-0 w-full max-w-[490px] -mt-16 lg:-mt-[260px]">
            <div className="relative rounded-[32px] lg:rounded-[36px] border border-white/10 bg-black/40 px-10 lg:px-12 py-8 backdrop-blur-[14px] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden h-[524px] lg:h-[564px]">
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#8FC1E8] to-transparent opacity-70" />

              <p className="mb-6 text-[13px] uppercase tracking-[0.28em] text-[#8FC1E8]/80"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                {t('visual_badge')}
              </p>
              <h2 className="text-[42px] lg:text-[50px] font-light leading-[1.05] text-[#EAE4D5]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {(() => {
                  const hour = new Date().getHours()
                  if (hour >= 5 && hour < 12) return t('visual_goodMorning')
                  if (hour >= 12 && hour < 18) return t('visual_goodAfternoon')
                  if (hour >= 18 && hour < 22) return t('visual_goodEvening')
                  return t('visual_goodNight')
                })()} 
                <br />
                <span className="italic">{firstName}</span>
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
                      onClick={() => requestActionWithConsent(item.id as 'captureFace' | 'captureBody')}
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

                <button onClick={() => requestActionWithConsent('connectPhone')}
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
  <div className="hidden md:flex absolute left-[520px] lg:left-[600px] top-[0px] bottom-[40px] right-0 z-30 px-10 lg:px-16">
    <div className="relative w-full max-w-[960px] min-w-0 h-full flex flex-col overflow-hidden">
      {/* Panneau de fond — améliore le contraste sans dupliquer le style des cartes */}
      <div className="absolute -top-6 -left-6 -right-6 bottom-60 bg-black/15 backdrop-blur-md border border-white/5 -z-10" />
      <div className="flex-1 min-h-0 px-2 py-2">
        {renderSection()}
      </div>
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
                {(() => {
                  const hour = new Date().getHours()
                  if (hour >= 5 && hour < 12) return t('visual_goodMorning')
                  if (hour >= 12 && hour < 18) return t('visual_goodAfternoon')
                  if (hour >= 18 && hour < 22) return t('visual_goodEvening')
                  return t('visual_goodNight')
                })()} 
                <br />
                <span className="italic">{firstName}</span>
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
                      onClick={() => requestActionWithConsent(item.id as 'captureFace' | 'captureBody')}
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

                <button onClick={() => requestActionWithConsent('connectPhone')}
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
    {/* Panneau de fond — améliore le contraste sans dupliquer le style des cartes */}
    <div className="absolute -top-6 -left-6 -right-6 bottom-16 bg-black/15 backdrop-blur-md border border-white/5 -z-10" />
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-6 pb-3 shrink-0">
        <button onClick={() => setActiveSection(null)}
          className="flex items-center gap-2 text-white/60 text-[11px] uppercase tracking-[0.18em]">
          <ArrowLeft className="h-4 w-4" />
          {t('visual_back')}
        </button>
      </div>
      <div className="px-4 pb-8 flex-1 min-h-0 overflow-y-auto">
        {renderSection()}
      </div>
    </div>
  </div>
)}
      </div>

      {showConsentModal && (
        <ConsentModal
          locale={locale}
          onAccept={handleAcceptConsent}
          onCancel={handleCancelConsent}
        />
      )}

      {showQR && qrToken && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative rounded-[24px] border border-white/10 bg-[#040B14] px-10 py-8 flex flex-col items-center gap-6 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 left-[12%] w-[76%] h-[2px] bg-gradient-to-r from-transparent via-[#4A90C2] to-transparent opacity-70" />
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8FC1E8]/80">{t('visual_connectPhone')}</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://app.lonaralabs.com/${locale}/visual-capture?token=${qrToken}`)}&bgcolor=040B14&color=8FC1E8`}
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