// src/app/page.tsx

'use client'

import { useState } from 'react'

import Hero from '../components/Hero'
import Quiz from '../components/Quiz'
import AssessmentForm from '../components/AssessmentForm'

export default function Home() {

  const [step, setStep] = useState<string>(
    'hero'
  )

  const [fullName, setFullName] =
    useState<string>('')

  const [email, setEmail] =
    useState<string>('')

    const [age, setAge] =
  useState<number | null>(null)

  const [sex, setSex] =
  useState<string>('')

const [height, setHeight] =
  useState<number | null>(null)

const [weight, setWeight] =
  useState<number | null>(null)

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white relative">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,180,255,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.15),transparent_35%)]" />

  <div className="relative z-10">

  {step !== 'quiz' && (

    <Hero
      onStart={() => {
        setStep('signup')
      }}
    />

  )}

  {step === 'signup' && (
    <AssessmentForm
      onClose={() => {
        setStep('hero')
      }}
   onStart={(
  name: string,
  mail: string,
  age: number,
   sex: string,
  height: number,
  weight: number,
) => {
  setFullName(name)
  setEmail(mail)
  setAge(age)
setSex(sex)
setHeight(height)
setWeight(weight)
  setStep('quiz')
}}
    />
  )}

  {step === 'quiz' && (
   <Quiz
  fullName={fullName}
  email={email}
  age={age || 0}
  sex={sex}
  height={height || 0}
  weight={weight || 0}
/>
  )}

</div>
    </main>
  )
}