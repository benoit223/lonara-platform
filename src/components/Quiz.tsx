'use client'

import { useMemo, useState } from 'react'

import { questions } from '../data/questions'

import {
  calculateScores,
  generateInsights,
} from '../lib/scoring'

import { generateProtocols } from '../lib/protocols'

import { supabase } from '../lib/supabase'

import Results from './Results'

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
  'emotional',
  'nutrition',
  'biohacking',
  'aging',
  'lifestyle',
  'performance',
  'detox',
  'skin',
  'sexual',
  'environment',
  'resilience',
  'mindset',
  'advanced',
  'wellness',
]

const categoryDescriptions: Record<
  string,
  string
> = {
  energy:
    'Cellular ATP production and vitality optimization.',

  stress:
    'Nervous system resilience and stress management.',

  sleep:
    'Deep sleep quality and circadian optimization.',

  recovery:
    'Recovery capacity and biological regeneration.',

  gut:
    'Digestive health and microbiome resilience.',

  inflammation:
    'Systemic inflammation and recovery balance.',

  cognition:
    'Mental clarity, focus and cognitive resilience.',

  hormonal:
    'Hormonal balance and biological regulation.',

  metabolism:
    'Metabolic flexibility and energy utilization.',

  cardiovascular:
    'Cardiovascular endurance and circulation optimization.',

  circadian:
    'Circadian rhythm alignment and biological timing.',

  immune:
    'Immune resilience and systemic defense capacity.',

  longevity:
    'Long-term wellness priorities and optimization goals.',

  exercise:
    'Physical conditioning and performance resilience.',

  emotional:
    'Emotional resilience and psychological balance.',

  nutrition:
    'Nutritional quality and metabolic nourishment.',

  biohacking:
    'Optimization behaviors and longevity engagement.',

  aging:
    'Biological aging resilience and vitality markers.',

  lifestyle:
    'Lifestyle balance and environmental health impact.',

  performance:
    'Mental and physical performance optimization.',

  detox:
    'Detoxification capacity and toxic exposure resilience.',

  skin:
    'Skin vitality and external aging indicators.',

  sexual:
    'Hormonal vitality and sexual wellness balance.',

  environment:
    'Environmental impact on long-term biological health.',

  resilience:
    'Stress resilience and adaptive biological capacity.',

  mindset:
    'Longevity mindset and behavioral consistency.',

  advanced:
    'Advanced optimization and preventative longevity engagement.',

  wellness:
    'Global biological wellness and vitality overview.',
}
type ScaleType = 'a' | 'b' | 'c' | 'd'

const scaleConfig: Record<
  ScaleType,
  {
    labels: string[]
    values: number[]
  }
> = {
  a: {
    labels: [
      'Very Low',
      'Low',
      'Moderate',
      'High',
      'Optimal',
    ],

    values: [4, 3, 2, 1, 0],
  },

  b: {
    labels: [
      'Never',
      'Rarely',
      'Sometimes',
      'Often',
      'Always',
    ],

    values: [4, 3, 2, 1, 0],
  },

  c: {
    labels: [
      'Always',
      'Often',
      'Sometimes',
      'Rarely',
      'Never',
    ],

    values: [4, 3, 2, 1, 0],
  },

  d: {
    labels: [
      'Very Difficult',
      'Difficult',
      'Moderate',
      'Easy',
      'Very Easy',
    ],

    values: [4, 3, 2, 1, 0],
  },
}

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
}

export default function Quiz({
  fullName,
  email,
}: QuizProps) {
  const [sectionIndex, setSectionIndex] =
    useState(0)

  const [completed, setCompleted] =
    useState(false)

  const [responses, setResponses] =
    useState<Record<string, number>>({})

  const currentCategory =
    categories[sectionIndex]

  const currentQuestions = questions.filter(
    (q) => q.category === currentCategory,
  )

  const totalQuestions = questions.length

  const progress = Math.round(
    (Object.keys(responses).length /
      totalQuestions) *
      100,
  )

  const scores = useMemo(() => {
    const hasResponses =
      Object.keys(responses).length > 0

    if (!hasResponses) {
      const initialScores: Record<
        string,
        number
      > = {}

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

  const handleAnswer = (
    question: string,
    value: number,
  ) => {
    setResponses((prev) => ({
      ...prev,
      [question]: value,
    }))
  }

  const nextSection = async () => {
    if (
      sectionIndex <
      categories.length - 1
    ) {
      setSectionIndex(
        sectionIndex + 1,
      )

      return
    }

    const payload = {
      full_name: fullName,
      email,
      responses,
      scores,
      protocols,
    }

    const { error } = await supabase
      .from('assessments')
      .insert([payload])

    if (error) {
      console.error(error)

      alert(
        'Error saving assessment.',
      )

      return
    }

    alert(
      'Assessment successfully saved.',
    )

    setCompleted(true)
  }

  if (completed) {
    return (
      <Results
        scores={scores}
        protocols={protocols}
        fullName={fullName}
        email={email}
        onRestart={() => {
          setResponses({})
          setSectionIndex(0)
          setCompleted(false)
        }}
      />
    )
  }

  return (
    <div className="max-w-7xl w-full grid grid-cols-1 xl:grid-cols-3 gap-10">
      {/* Main Quiz */}
      <div className="xl:col-span-2 rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-start gap-5">
            <img
              src="/lonara-logo.png"
              alt="Lonara"
              className="h-24 w-auto mt-1"
            />

            <div>
              <p className="text-cyan-300 uppercase tracking-[0.25em] text-xs mb-4">
                Biological Analysis
              </p>

              <h2 className="text-5xl font-semibold capitalize">
                {currentCategory}
              </h2>

              <p className="mt-5 text-white/50 max-w-2xl leading-relaxed">
                {
                  categoryDescriptions[
                    currentCategory
                  ]
                }
              </p>
            </div>
          </div>

          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black text-2xl font-bold">
            {progress}%
          </div>
        </div>

        {/* Progress */}
        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden mb-14">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* Questions */}
        <div className="space-y-10">
          {currentQuestions.map(
            (item, index) => {
     const scale =
  scaleConfig[
    ((item as any).scale ||
      'a') as ScaleType
  ]
              return (
                <div key={item.id}>
                  <h3 className="text-xl text-white/90 mb-5 leading-relaxed">
                    {index + 1}.{' '}
                    {item.question}
                  </h3>

                  <div className="grid grid-cols-5 gap-3 mt-8">
                  {scale.values.map(
  (
    value: number,
    idx: number,
  ) => {
                        const selected =
                          responses[
                            item.question
                          ] === value

                        return (
                          <button
                            key={idx}
                            onClick={() =>
                              handleAnswer(
                                item.question,
                                value,
                              )
                            }
                            className={`relative h-28 rounded-3xl border transition-all duration-300 overflow-hidden ${
                              selected
                                ? 'scale-[1.08] brightness-125'
                                : 'opacity-60 hover:opacity-100'
                            }`}
                            style={{
                              borderColor:
                                colors[
                                  idx
                                ],

                              background: `linear-gradient(180deg, ${colors[idx]}20 0%, rgba(0,0,0,0.4) 100%)`,

                              boxShadow:
                                selected
                                  ? `0 0 45px ${colors[idx]}AA`
                                  : 'none',
                            }}
                          >
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <div
                                className="w-14 h-1 rounded-full mb-5"
                                style={{
                                  backgroundColor:
                                    colors[
                                      idx
                                    ],

                                  boxShadow: `0 0 15px ${colors[idx]}`,
                                }}
                              />

                              <p
                                className={`text-sm uppercase tracking-[0.18em] font-semibold transition-all ${
                                  selected
                                    ? 'text-white'
                                    : 'text-white/65'
                                }`}
                              >
                                {
                                  scale
                                    .labels[
                                    idx
                                  ]
                                }
                              </p>
                            </div>
                          </button>
                        )
                      },
                    )}
                  </div>
                </div>
              )
            },
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-end mt-14">
          <button
            onClick={nextSection}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold"
          >
            Continue Analysis
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Scores */}
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300 mb-6">
            Biological Scores
          </p>

          <div className="space-y-6">
            {Object.entries(scores).map(
              ([label, value]) => (
                <div key={label}>
                  <div className="flex justify-between mb-3 text-sm text-white/70">
                    <span className="capitalize">
                      {label}
                    </span>

                    <span>
                      {value}/100
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                      style={{
                        width: `${value}%`,
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Insights */}
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-2xl p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300 mb-5">
            Lonara Insights
          </p>

          <div className="space-y-5 text-white/70 leading-relaxed text-sm">
            {insights.map(
              (insight, index) => (
                <p key={index}>
                  {insight}
                </p>
              ),
            )}
          </div>
        </div>

        {/* Protocols */}
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300 mb-6">
            Recommended Protocols
          </p>

          <div className="space-y-6">
            {protocols.map(
              (protocol, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">
                      {
                        protocol.title
                      }
                    </h3>

                    <span className="text-xs text-cyan-300">
                      {
                        protocol.priority
                      }
                    </span>
                  </div>

                  <p className="text-sm text-white/60 leading-relaxed mb-4">
                    {
                      protocol.description
                    }
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {protocol.recommendations.map(
                      (
                        item: string,
                      ) => (
                        <span
                          key={item}
                          className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-200 text-xs"
                        >
                          {item}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}