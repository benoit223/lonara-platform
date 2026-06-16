'use client'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'

import { DevFillButton } from './DevFillButton'

import { calculatePsychometricProfile }
from '../lib/psychometrics/coherenceEngine'

import { questions as questionsEN } from '../data/questions.en'
import { questions as questionsFR } from '../data/questions.fr'
import { questions as questionsES } from '../data/questions.es'

import {
  calculateScores,
  generateInsights,
} from '../lib/scoring'

import { generateProtocols } from '../lib/protocols'

import { supabase } from '../lib/supabase'

import Results from './Results'

type Question = {
  id: number
  category: string
  question: string
  weight: number
  scale: string
}

const categories = [
  'energy',
  'stress',
  'sleep',
  'recovery',
  'gut',
  'inflammation',
  'cognition',
  'hormonal',
  'metabolism',
  'cardiovascular',
  'circadian',
  'immune',
  'longevity',
  'exercise',
  'mobility',
  'emotional',
  'nutrition',
  'social',
  'biohacking',
  'aging',
  'lifestyle',
  'performance',
  'detox',
  'skin',
  'sexual',
  'environment',
  'family',
  'resilience',
  'mindset',
  'purpose',
  'advanced',
  'wellness',
]

type ScaleType = 'a' | 'b' | 'c' | 'd'

const colors = [
  '#ff3b30',
  '#ff9500',
  '#ffd60a',
  '#d9ff3f',
  '#32d74b',
]

type QuizProps = {
  fullName: string
  email: string
  memberTier:
  | 'guest'
  | 'member'
  | 'premium'
  | 'executive'
  accessMode: 'guest' | 'registered'
  age: number
  sex: 'male' | 'female' | 'other'
  height: number
  weight: number
  unitSystem: 'metric' | 'imperial'
country?: string
socioeconomic?: string
biomarkers?: Record<string, string>
onBack: () => void
onMySpace?: () => void 
}

export default function Quiz({
  fullName,
  email,
  memberTier,
  accessMode,
  age,
  sex,
  height,
  weight,
  unitSystem,
  country,
socioeconomic,
biomarkers = {},
onBack,
onMySpace,
}: QuizProps) {

  const t = useTranslations('quiz')
  const locale = useLocale()

  const questions: Question[] =
    locale === 'fr' ? questionsFR :
    locale === 'es' ? questionsES :
    questionsEN

  const scaleConfig: Record<ScaleType, { labels: string[]; values: number[] }> = {
    a: {
      labels: [t('veryLow'), t('low'), t('moderate'), t('high'), t('optimal')],
      values: [4, 3, 2, 1, 0],
    },
    b: {
      labels: [t('never'), t('rarely'), t('sometimes'), t('often'), t('always')],
      values: [4, 3, 2, 1, 0],
    },
    c: {
      labels: [t('always'), t('often'), t('sometimes'), t('rarely'), t('never')],
      values: [4, 3, 2, 1, 0],
    },
    d: {
      labels: [t('veryDifficult'), t('difficult'), t('moderate'), t('easy'), t('veryEasy')],
      values: [4, 3, 2, 1, 0],
    },
  }

  const [sectionIndex, setSectionIndex] = useState(0)
  const [showUnansweredWarning, setShowUnansweredWarning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [processingSignals, setProcessingSignals] = useState(0)
  const [responses, setResponses] = useState<Record<number, number>>({})
  const [pageTimes, setPageTimes] = useState<Record<string, number>>({})
  const [startedAt] = useState(Date.now())
  const [sectionStartedAt, setSectionStartedAt] = useState(Date.now())

  const currentCategory = categories[sectionIndex]

  const currentQuestions = questions.filter(
    (q: Question) => q.category === currentCategory,
  )

  const totalQuestions = questions.length

  const completedQuestions = Object.keys(responses).length

  const unansweredQuestions = questions.filter((q: Question) => {
    const questionCategoryIndex = categories.indexOf(q.category)
    return (
      questionCategoryIndex < sectionIndex &&
      responses[q.id] === undefined
    )
  }).length

  const remainingQuestions = totalQuestions - completedQuestions - unansweredQuestions

  const targetProcessingSignals = Math.round(completedQuestions * 0.72)

  const progress = Math.round(
    (Object.keys(responses).length / totalQuestions) * 100,
  )

  const scores = useMemo(() => {
    const hasResponses = Object.keys(responses).length > 0

    if (!hasResponses) {
      const initialScores: Record<string, number> = {}
      categories.forEach((category) => {
        initialScores[category] = 100
      })
      return initialScores
    }

    return calculateScores(responses)
  }, [responses])

  const insights = useMemo(() => {
    return generateInsights(scores)
  }, [scores])

  const protocols = useMemo(() => {
    return generateProtocols(scores)
  }, [scores])

  const averageScore =
    Object.values(scores).reduce((acc, value) => acc + value, 0) /
    Object.values(scores).length

  const responseCount = Object.keys(responses).length

  useEffect(() => {
    if (processingSignals < targetProcessingSignals) {
      const timeout = setTimeout(() => {
        setProcessingSignals((prev: number) => prev + 1)
      }, 45)
      return () => clearTimeout(timeout)
    }
  }, [processingSignals, targetProcessingSignals])

  const bmi = weight / ((height / 100) ** 2)
  const roundedBMI = bmi.toFixed(1)

  const displayHeight =
    unitSystem === 'metric'
      ? `${height} cm`
      : `${Math.floor(height / 30.48)}'${Math.round((height / 2.54) % 12)}"`

  const displayWeight =
    unitSystem === 'metric'
      ? `${weight} kg`
      : `${Math.round(weight * 2.20462)} lb`

  const bmiValue = Number(roundedBMI)

  const bmiStatus =
    bmiValue < 18.5
      ? { label: t('bmiLow'), color: 'text-amber-300', dot: '●' }
      : bmiValue < 25
      ? { label: t('bmiOptimal'), color: 'text-[#6FA8E8]', dot: '●' }
      : bmiValue < 30
      ? { label: t('bmiModerate'), color: 'text-orange-300', dot: '●' }
      : { label: t('bmiElevated'), color: 'text-red-300', dot: '●' }

  const handleAnswer = (questionId: number, value: number) => {
    setResponses((prev: Record<number, number>) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const previousSection = () => {
    if (sectionIndex > 0) {
      setSectionIndex(sectionIndex - 1)
    } else {
      onBack()
    }
  }

  const nextSection = async () => {
    if (isSaving) return

    const currentUnanswered = currentQuestions.filter(             //ici condition lesboutonstest remettre 1 au lieu de 99 benoit
      (q: Question) => responses[q.id] === undefined
    ).length

    if (currentUnanswered > 1) {
      setShowUnansweredWarning(true)
      return
    }
    setShowUnansweredWarning(false)

    if (sectionIndex < categories.length - 1) {
      const elapsed = Math.round((Date.now() - sectionStartedAt) / 1000)
      setPageTimes((prev: Record<string, number>) => ({
        ...prev,
        [currentCategory]: elapsed,
      }))
      setSectionStartedAt(Date.now())
      setSectionIndex(sectionIndex + 1)
      return
    }

    setIsSaving(true)

   const session = await supabase.auth.getSession()
   const payload = {
    profile_id: session.data.session?.user?.id ?? null,  
full_name: fullName,
email,
age,
sex,
height,
weight,
unit_system: unitSystem,
country: country ?? '',
socioeconomic: socioeconomic ?? '',
access_mode: accessMode,
member_tier: memberTier,
feedback_score: null,
completion_time: Math.round((Date.now() - startedAt) / 1000),
responses,
scores,
protocols,
biomarkers: biomarkers ?? {},
}

    const { data, error } = await supabase
      .from('assessments')
      .insert([payload])
      .select()

    if (error) {
      setIsSaving(false)
      console.error(error)
      alert(t('errorSaving'))
      return
    }

    setAssessmentId(data?.[0]?.id ?? null)
    setCompleted(true)
  }

  const psychometricProfile = useMemo(() => calculatePsychometricProfile({
    responses,
    questions,
    completionTime: Math.round((Date.now() - startedAt) / 1000),
    pageTimes,
  }), [responses, pageTimes])

  const hasEnoughData = psychometricProfile.hasEnoughData

  const stabilityFactor = Math.min(12, Math.sqrt(responseCount) * 1.8)

  const liveCoherence = psychometricProfile.coherence ?? 0
  const reliability = psychometricProfile.reliability ?? 0
  const stability = psychometricProfile.stability ?? 0
  const contradictionLoad = psychometricProfile.contradictionLoad ?? 0
  const confidence = psychometricProfile.confidence ?? 0

  if (completed) {
    return (
      <Results
        assessmentId={assessmentId}
        scores={scores}
        protocols={protocols}
        fullName={fullName}
        email={email}
        memberTier={memberTier}
        accessMode={accessMode}
        psychometricProfile={psychometricProfile}
        age={age}
        sex={sex}
        weight={weight}
        height={height}
        unitSystem={unitSystem}
        country={country}
        socioeconomic={socioeconomic}
biomarkers={biomarkers}
responses={responses}
        completionTime={Math.round((Date.now() - startedAt) / 1000)}
        onRestart={() => {
          setResponses({})
          setSectionIndex(0)
          setCompleted(false)
        }}
        onMySpace={onMySpace}
      />
    )
  }

  return (
    <div className="relative min-h-screen z-[70] overflow-visible max-w-[1800px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 pt-8 items-stretch px-4 lg:px-6 bg-[#02040A]">

      {/* Main Quiz */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-[1.8rem] lg:rounded-[2.7rem] border border-[#0E2238]/80 bg-[#02040a]/45 backdrop-blur-sm p-6 lg:p-10 shadow-[0_0_2px_rgba(120,200,255,0.15),0_0_18px_rgba(3,90,168,0.10),0_0_60px_rgba(0,110,255,0.08),0_0_160px_rgba(0,80,255,0.04)]">

        {/* DNA IMAGE */}
        <img
          src="/dna.png"
          alt="DNA"
          className="absolute top-0 right-0 h-full w-auto object-cover object-right-top z-[2] pointer-events-none select-none"
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, rgba(3,90,168,0.12) 0%, rgba(3,90,168,0.06) 40%, transparent 80%)`,
          }}
        />

        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(3,90,168,0.045),transparent_28%)] pointer-events-none" />
        <div className="absolute top-[-180px] left-[-10%] w-[420px] h-[420px] rounded-full bg-[#035AA8]/10 blur-3xl opacity-40" />
        <div className="absolute bottom-[-200px] right-[-10%] w-[360px] h-[360px] rounded-full bg-[#7FD6FF]/10 blur-3xl opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0A1724,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(92,150,216,0.20),transparent_55%)] pointer-events-none z-[5]" />

        <div className="relative z-10 flex h-full flex-col">

          <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
            <div className="flex items-start gap-5">
              <img
                src="/lonara-logo.png"
                alt="Lonara"
                className="h-30 w-auto mt-1"
              />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-[#C7AC60]/80 mb-4">
                  {t('label')}
                </p>

                <h2
                  className="text-[2rem] md:text-[3rem] leading-[0.95] font-medium capitalize tracking-[0.04em] text-[#EAE4D5]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {currentCategory}
                </h2>

                <p className="mt-4 text-[#EAE4D5]/45 max-w-2xl leading-[1.9] text-[15px]">
                  {t(`cat_${currentCategory}` as any)}
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 h-[42px] flex items-center overflow-visible">

              {/* Track */}
              <div className="absolute inset-x-0 h-[6px] rounded-full bg-white/[0.04] border border-white/[0.03]" />

              {/* Progress */}
              <div
                className="relative h-[6px] rounded-full bg-gradient-to-r from-[#4A3410] via-[#C7AC60] to-[#E7D19A] shadow-[0_0_8px_rgba(199,172,96,0.28),0_0_18px_rgba(199,172,96,0.14),0_0_42px_rgba(199,172,96,0.08)] transition-all duration-700"
                style={{ width: `${progress}%` }}
              >
                {/* Glow Node */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-50">
                  <div className="absolute left-1/2 top-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C7AC60]/28 blur-[12px]" />
                  <div className="absolute left-1/2 top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C7AC60]/18 blur-[5px]" />
                  <div className="relative w-2 h-2 rounded-full bg-[#E7D19A]" />
                </div>
              </div>
            </div>

            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C7AC60] whitespace-nowrap">
              {progress}% Complete
            </div>
          </div>

          {/* Questions */}
          <div className="flex-1 space-y-10">
            {currentQuestions.map((item: Question, index: number) => {
              const scaleKey = ((item as any).scale || 'a') as ScaleType
              const scale = scaleConfig[scaleKey] || scaleConfig.a

              return (
                <div key={item.id}>
                  <h3 className="text-[1.15rem] font-medium text-[#EAE4D5]/92 mb-1 leading-[1.8] tracking-[-0.02em] max-w-4xl">
                    {questions.findIndex((q: Question) => q.id === item.id) + 1}{' '}
                    {item.question}
                  </h3>

                  <div className="grid grid-cols-5 gap-2 mt-3">
                    {scale.values.map((value: number, idx: number) => {
                      const selected = responses[item.id] === value

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(item.id, value)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 4px ${colors[idx]}, 0 0 10px ${colors[idx]}, 0 0 20px ${colors[idx]}`
                          }}
                          onMouseLeave={(e) => {
                            if (!selected) {
                              e.currentTarget.style.boxShadow = 'none'
                            }
                          }}
                          style={{
                            boxShadow: selected
                              ? `0 0 4px ${colors[idx]}, 0 0 10px ${colors[idx]}, 0 0 20px ${colors[idx]}`
                              : `0 0 14px ${colors[idx]}88`,
                          }}
                          className={`group relative hover:z-10 hover:scale-[1.02] h-16 rounded-[1.5rem] overflow-visible transition-all duration-300 ${
                            selected ? 'bg-[#09111b]' : 'bg-[#02050a]'
                          }`}
                        >
                          <div
                            className="absolute -inset-[1px] rounded-[1.5rem] transition-all duration-300 group-hover:scale-[1.02]"
                            style={{
                              color: colors[idx],
                              border: `1px solid ${colors[idx]}`,
                              boxShadow: `0 0 8px ${colors[idx]}100`,
                            }}
                          />
                          <div
                            className="absolute inset-[1px] rounded-[1.45rem] opacity-50 pointer-events-none transition-all duration-300"
                            style={{
                              background: `radial-gradient(circle at center, ${colors[idx]}40 0%, ${colors[idx]}18 35%, transparent 78%)`,
                              boxShadow: selected
                                ? `inset 0 0 40px ${colors[idx]}88, inset 0 0 70px ${colors[idx]}44`
                                : `inset 0 0 24px ${colors[idx]}44`,
                            }}
                          />

                          <div className="relative z-10 h-full flex flex-col items-center justify-center">
                            <div
                              className="w-12 h-[2px] rounded-full mb-3"
                              style={{
                                background: `linear-gradient(90deg, ${colors[idx]}, ${colors[idx]})`,
                                boxShadow: selected
                                  ? `0 0 12px ${colors[idx]}, 0 0 24px ${colors[idx]}, 0 0 42px ${colors[idx]}`
                                  : `0 0 10px ${colors[idx]}CC`,
                              }}
                            />
                            <p className="relative z-20 text-[10px] uppercase tracking-[0.22em] font-semibold drop-shadow-[0_0_4px_rgba(255,255,255,0.35)] transition-all text-white">
                              {scale.labels[idx]}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <DevFillButton onFill={(filled) => setResponses(filled)} />

          {showUnansweredWarning && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-[13px] text-red-300 text-center">
                {t('unansweredWarning')}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">

            {/* BACK */}
            <button
              onClick={previousSection}
              className="relative z-[9999] pointer-events-auto group overflow-hidden px-10 py-4 rounded-[1.4rem] border border-[#C7AC60]/30 bg-[#0A0F18] backdrop-blur-[1px] text-[#C7AC60] transition-all duration-300 hover:bg-[#060A11] hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-[1.4rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />
              <div
                className="absolute inset-[1px] rounded-[1.35rem] opacity-40 pointer-events-none"
                style={{
                  background: `linear-gradient(180deg, rgba(199,172,96,0.10), rgba(199,172,96,0.03))`,
                  boxShadow: `inset 0 0 30px rgba(199,172,96,0.22), inset 0 0 60px rgba(199,172,96,0.10)`,
                }}
              />
              <span className="relative z-10 flex items-center gap-3 uppercase tracking-[0.18em] text-[12px]">
                <span className="text-lg">←</span>
                {t('back')}
              </span>
            </button>

            {/* NEXT */}
            <button
              onClick={nextSection}
              disabled={isSaving}
              className="group relative overflow-hidden px-10 py-4 rounded-[1.4rem] border border-[#C7AC60]/30 bg-[#0A0F18] backdrop-blur-[1px] text-[#C7AC60] transition-all duration-300 hover:bg-[#060A11] hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
            >
              <div className="absolute inset-0 bg-[#C7AC60]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-[1.4rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />
              <div
                className="absolute inset-[1px] rounded-[1.35rem] opacity-40 pointer-events-none"
                style={{
                  background: `linear-gradient(180deg, rgba(199,172,96,0.10), rgba(199,172,96,0.03))`,
                  boxShadow: `inset 0 0 30px rgba(199,172,96,0.22), inset 0 0 40px rgba(199,172,96,0.10)`,
                }}
              />
              <span className="relative z-10 flex items-center gap-3 uppercase tracking-[0.18em] text-[12px]">
                {isSaving
                  ? t('generatingReport')
                  : sectionIndex === categories.length - 1
                  ? t('completeAssessment')
                  : t('next')}
                <span className="text-lg">→</span>
              </span>
            </button>

          </div>
        </div>
      </div>

      {/* RIGHT BIOMETRIC PANEL */}
      <div className="lg:col-span-1">
        <div className="h-full flex flex-col relative overflow-hidden rounded-[1.8rem] lg:rounded-[2.7rem] border border-[#0E2238]/80 bg-[#02040a]/45 backdrop-blur-sm p-6 lg:p-10 shadow-[0_0_1px_rgba(120,200,255,0.08),0_0_8px_rgba(3,90,168,0.05),0_0_25px_rgba(0,110,255,0.04)]">

          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(92,150,216,0.20),transparent_55%)] pointer-events-none" />

          <div className="relative z-10">

            {/* HEADER */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#C7AC60] drop-shadow-[0_0_8px_rgba(199,172,96,0.45)]"
                  >
                    <path
                      d="M2 12H6L9 7L13 17L16 12H22"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#C7AC60]/80">
                    {t('biologicalSummary')}
                  </p>
                </div>
                <h3
                  className="text-[2rem] font-semibold text-[#EAE4D5] tracking-[0.10em]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {t('biometrics')}
                </h3>
              </div>

              <div className="flex items-center gap-4 px-3 py-1.5 rounded-full border border-[#035AA8]/20 bg-[#035AA8]/5">
                <div className="relative w-2 h-2 rounded-full bg-[#E7D19A] animate-pulse">
                  <div className="absolute left-1/2 top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C7AC60]/28 blur-[10px]" />
                  <div className="absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C7AC60]/18 blur-[4px]" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.28em] text-[#C7AC60] uppercase">
                  Live
                </span>
              </div>
            </div>

            {/* CORE */}
            <div className="relative rounded-[2rem] border border-[#C7AC60]/20 bg-[#07111d]/25 p-6 mb-8 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(3,90,168,0.08),transparent_60%)]" />
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.05)] pointer-events-none" />

              <div className="relative z-10 flex items-start gap-6">

                {/* CIRCLE */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute w-[140px] h-[140px] rounded-full bg-[#035AA8]/10 blur-3xl opacity-70" />
                  <div className="absolute w-[124px] h-[124px] rounded-full border border-[#035AA8]/10 shadow-[0_0_30px_rgba(3,90,168,0.18)]" />

                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,0.045)" strokeWidth="6" fill="none" />
                    <circle
                      cx="60" cy="60" r="52"
                      stroke="url(#ringGradient)"
                      strokeWidth="5.2"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={327}
                      strokeDashoffset={hasEnoughData ? 327 - (327 * liveCoherence) / 100 : 327}
                      className="transition-all duration-700 animate-pulse"
                      style={{
                        opacity: 0.96,
                        filter: `drop-shadow(0 0 4px rgba(199,172,96,0.18)) drop-shadow(0 0 14px rgba(199,172,96,0.12))`,
                      }}
                    />
                    <circle
                      cx="60" cy="60" r="52"
                      stroke="rgba(255,255,255,0.38)"
                      strokeWidth="0.55"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="22 305"
                      strokeDashoffset="7"
                      style={{ filter: 'blur(0.4px)' }}
                    />
                    <defs>
                      <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4A3410" />
                        <stop offset="42%" stopColor="#C7AC60" />
                        <stop offset="100%" stopColor="#E7D19A" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* CENTER CORE */}
                  <div className="relative z-10 w-[78%] h-[78%] rounded-full overflow-hidden border border-white/5 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09)_0%,rgba(10,20,34,0.97)_42%,rgba(4,10,18,1)_100%)] flex flex-col items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-35px_50px_rgba(0,0,0,0.62),inset_0_0_40px_rgba(3,90,168,0.08),0_0_12px_rgba(3,90,168,0.06)]">
                    <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-12 h-4 rounded-full bg-white/8 blur-lg opacity-55" />
                    <div className="relative text-[1.8rem] leading-none font-semibold tracking-[-0.03em] text-[#EAE4D5] drop-shadow-[0_0_10px_rgba(255,255,255,0.08)]">
                      {hasEnoughData ? `${liveCoherence}%` : '...'}
                    </div>
                    <div className="mt-1 text-center text-[9px] uppercase tracking-[0.24em] text-[#C7AC60]/70">
                      {hasEnoughData ? t('signalIntegrity') : t('analyzing')}
                    </div>
                  </div>
                </div>

                {/* INFO */}
                <div className="flex-1 flex flex-col items-start">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/80 mb-3">
                    {t('neuralProcessing')}
                  </p>
                  <h4
                    className="text-[#EAE4D5] text-[1.7rem] leading-[1.1] mb-6 max-w-[420px]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {t('patternRecognition')}
                  </h4>
                  <div className="grid grid-cols-3 gap-4 w-full max-w-[420px]">
                    <div className="px-4 py-4 flex flex-col items-center justify-center text-center">
                      <p className="text-[8px] uppercase tracking-[0.22em] text-[#EAE4D5]/40 mb-2">{t('reliability')}</p>
                      <span className="text-[1rem] leading-none text-[#EAE4D5]">{reliability}%</span>
                    </div>
                    <div className="px-4 py-4 flex flex-col items-center justify-center text-center">
                      <p className="text-[8px] uppercase tracking-[0.22em] text-[#EAE4D5]/40 mb-2">{t('stability')}</p>
                      <span className="text-[1rem] leading-none text-[#EAE4D5]">{stability}%</span>
                    </div>
                    <div className="px-4 py-4 flex flex-col items-center justify-center text-center">
                      <p className="text-[8px] uppercase tracking-[0.22em] text-[#EAE4D5]/40 mb-2">{t('contradiction')}</p>
                      <span className="text-[1rem] leading-none text-[#EAE4D5]">{contradictionLoad}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {hasEnoughData ? (
              <div className="grid grid-cols-2 gap-4 mt-7">

                {/* COMPLETED */}
                <div className="relative overflow-hidden rounded-[1.9rem] border border-[#035CB7]/20 bg-[#081019] px-4 py-2.5 min-h-[58px] shadow-[0_0_34px_rgba(3,90,168,0.10)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(3,90,168,0.16),transparent_62%)]" />
                  <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#035CB7] to-transparent opacity-90" />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-[#035CB7]/20 blur-3xl opacity-70" />
                  <div
                    className="absolute inset-[1px] rounded-[1.8rem]"
                    style={{
                      background: `linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 22%, rgba(255,255,255,0.01) 100%)`,
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 40px rgba(3,90,168,0.10), inset 0 -20px 40px rgba(0,0,0,0.45)`,
                    }}
                  />
                  <div className="relative z-10 flex items-center h-full gap-4">
                    <div className="relative w-11 h-11 rounded-[1.2rem] border border-[#035CB7]/20 bg-[#035AA8]/[0.03] flex items-center justify-center shrink-0">
                      <div className="absolute inset-0 rounded-[1.2rem] bg-[#035CB7]/12 blur-xl opacity-60" />
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="relative z-10 text-[#5C96D8]">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex flex-col justify-center flex-1 min-w-0 pr-2">
                      <div className="text-[1.45rem] leading-none font-semibold tracking-tight text-[#EAE4D5]">{completedQuestions}</div>
                      <div className="mt-1 text-[8px] uppercase tracking-[0.32em] text-[#5C96D8]/80">{t('completed')}</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[#5C96D8] shadow-[0_0_10px_rgba(3,90,168,0.45)] shrink-0" />
                  </div>
                </div>

                {/* PROCESSING */}
                <div className="relative overflow-hidden rounded-[1.9rem] border border-[#035CB7]/20 bg-[#081019] px-4 py-2.5 min-h-[58px] shadow-[0_0_34px_rgba(3,90,168,0.12)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(3,90,168,0.16),transparent_70%)] animate-pulse" />
                  <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#035CB7] to-transparent opacity-90" />
                  <div className="relative z-10 flex items-center h-full gap-3">
                    <div className="relative w-11 h-11 rounded-[1.2rem] border border-[#035CB7]/20 bg-[#035AA8]/[0.03] flex items-center justify-center shrink-0">
                      <div className="w-4 h-4 rounded-full border-2 border-[#5C96D8] border-t-transparent animate-spin" />
                    </div>
                    <div className="flex flex-col justify-center flex-1 min-w-0 pr-2">
                      <div className="text-[1.45rem] leading-none font-semibold tracking-tight text-[#5C96D8]">{String(processingSignals).padStart(2, '0')}</div>
                      <div className="mt-1 text-[8px] uppercase tracking-[0.32em] text-[#5C96D8]/90">{t('processing')}</div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5C96D8] animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5C96D8] animate-pulse delay-75" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5C96D8] animate-pulse delay-150" />
                    </div>
                  </div>
                </div>

                {/* UNANSWERED */}
                <div className="relative overflow-hidden rounded-[1.9rem] border border-white/12 bg-[#081019] px-4 py-2.5 min-h-[58px] shadow-[0_0_24px_rgba(255,255,255,0.04)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_75%)]" />
                  <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-90" />
                  <div className="relative z-10 flex items-center h-full gap-3">
                    <div className="relative w-11 h-11 rounded-[1.2rem] border border-white/10 bg-white/[0.03] flex items-center justify-center shrink-0">
                      <span className="text-[#EAE4D5]/70 text-2xl font-light">?</span>
                    </div>
                    <div className="flex flex-col justify-center flex-1 min-w-0 pr-2">
                      <div className="text-[1.45rem] leading-none font-semibold tracking-tight text-[#EAE4D5]">{unansweredQuestions}</div>
                      <div className="mt-1 text-[8px] uppercase tracking-[0.32em] text-[#EAE4D5]/45">{t('unanswered')}</div>
                    </div>
                  </div>
                </div>

                {/* REMAINING */}
                <div className="relative overflow-hidden rounded-[1.9rem] border border-[#035CB7]/20 bg-[#081019] px-4 py-2.5 min-h-[58px] shadow-[0_0_28px_rgba(3,90,168,0.10)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(3,90,168,0.12),transparent_75%)]" />
                  <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#035CB7] to-transparent opacity-90" />
                  <div className="relative z-10 flex items-center h-full gap-3">
                    <div className="relative w-11 h-11 rounded-[1.2rem] border border-[#035CB7]/20 bg-[#035AA8]/[0.03] flex items-center justify-center shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#5C96D8]">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="flex flex-col justify-center flex-1 min-w-0 pr-2">
                      <div className="text-[1.45rem] leading-none font-semibold tracking-tight text-[#5C96D8]">{remainingQuestions}</div>
                      <div className="mt-1 text-[8px] uppercase tracking-[0.32em] text-[#5C96D8]/80">{t('remaining')}</div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="mt-7 rounded-2xl border border-[#035AA8]/10 bg-[#071926]/50 px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-2 h-2 rounded-full bg-[#C7AC60] animate-pulse">
                    <div className="absolute inset-0 rounded-full bg-[#C7AC60] blur-[6px] opacity-70" />
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#C7AC60]/70">
                    {t('initializing')}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* GRID */}
          <div className="mt-4 grid grid-cols-2 gap-4 content-start auto-rows-max">
            {Object.entries(scores)
              .slice(
                Math.floor(sectionIndex / 12) * 12,
                Math.floor(sectionIndex / 12) * 12 + 12,
              )
              .map(([label, value], index) => (
                <div key={label} className="group relative overflow-hidden rounded-[0.6rem] bg-[#07111d]/18">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full border border-[#035AA8]/20 flex items-center justify-center text-[9px] text-[#5C96D8]/85 bg-[#035AA8]/[0.03]">
                          {String(Math.floor(sectionIndex / 12) * 12 + index + 1).padStart(2, '0')}
                        </div>
                        <span className="text-[13px] text-[#EAE4D5]/75 capitalize">{label}</span>
                      </div>
                      <span className="text-[12px] text-[#5C96D8]/85">{value}%</span>
                    </div>
                    <div className="relative h-[5px] rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#0A2340] via-[#015EBC] to-[#0E4F96] shadow-[0_0_14px_rgba(1,94,188,0.42),0_0_32px_rgba(1,94,188,0.16)] transition-all duration-700"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* BIOLOGICAL PROFILE */}
          <div className="relative mt-8 rounded-[1.8rem] border border-[#C7AC60]/20 bg-[#07111d]/25 px-3 py-4 overflow-hidden">
            <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-75" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(199,172,96,0.08),transparent_60%)]" />
            <div className="absolute inset-0 rounded-[1.8rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(199,172,96,0.05)] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#C7AC60]/90">{t('biologicalProfile')}</p>
              </div>

              <div className="grid grid-cols-[2.8fr_0.6fr_0.8fr] gap-x-4 gap-y-4 w-full">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#EAE4D5]/35">{t('name')}</p>
                  <p className="text-[13px] text-[#EAE4D5]/88">{fullName}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#EAE4D5]/35">{t('sex')}</p>
                  <p className="text-[13px] capitalize text-[#EAE4D5]/88">{sex}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#EAE4D5]/35">{t('age')}</p>
                  <p className="text-[13px] text-[#EAE4D5]/88">{age}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#EAE4D5]/35">{t('height')}</p>
                  <p className="text-[13px] text-[#EAE4D5]/88">{displayHeight}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#EAE4D5]/35">{t('weight')}</p>
                  <p className="text-[13px] text-[#EAE4D5]/88">{displayWeight}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#EAE4D5]/35">{t('bmi')}</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-[13px] font-medium ${bmiStatus.color}`}>{roundedBMI}</p>
                    <span className={`text-[9px] uppercase tracking-[0.18em] ${bmiStatus.color}`}>{bmiStatus.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}