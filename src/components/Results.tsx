'use client'

import ExecutiveOverviewPage from '@/components/report/ExecutiveOverviewPage'
import BiologicalIntelligencePage from '@/components/report/BiologicalIntelligencePage'
import OptimizationProtocolPage from '@/components/report/OptimizationProtocolPage'

import { generateLongevityReport } from '@/components/report/data/scoringEngine'

import { test } from '../lib/test'

import {
  calculateLongevityScores,
  calculateBiologicalAge,
  calculatePercentile,
  generatePriorities,
  generateRisks,
  recommendProducts,
} from '../lib/longevityEngine'

type ResultsProps = {
  scores: Record<string, number>
  protocols: any[]
  fullName: string
  email: string
  age: number
  sex: string
  weight: number
  height: number
  completionTime: number
  onRestart: () => void
}

export default function Results({
  scores,
  protocols,
  fullName,
  email,
  age,
  sex,
  weight,
  height,
  completionTime,
  onRestart,
}: ResultsProps) {

  
const calculatedScores =
  calculateLongevityScores({
  sleep: scores.sleep || 50,
  stress: scores.stress || 50,
  cognition: scores.cognition || 50,
  exercise: scores.exercise || 50,
  recovery: scores.recovery || 50,
  nutrition: scores.nutrition || 50,
  energy: scores.energy || 50,
  inflammation: scores.inflammation || 50,
})

const biologicalAge =
  calculateBiologicalAge(
    age,
    calculatedScores,
  )

const percentile =
  calculatePercentile(
    calculatedScores.longevity,
  )

const priorities =
  generatePriorities(
    calculatedScores,
  )

const risks =
  generateRisks(
    calculatedScores,
  )

const recommendations =
  recommendProducts(
    calculatedScores,
  )

const report = generateLongevityReport({
  user: {
    name: fullName,
    email,
    age,
    sex,
    weight,
    height,
  },

  scores: calculatedScores,

  protocols,

  biologicalAge,

  percentile,

  priorities,

  risks,

  recommendations,
})

  return (
    <div className="bg-[#040B14] min-h-screen text-white">

      <div className="w-full max-w-[1800px] mx-auto px-6 py-10 space-y-10">

        <ExecutiveOverviewPage report={report} />

        <BiologicalIntelligencePage report={report} />

        <OptimizationProtocolPage report={report} />

      </div>

    </div>
  )
}