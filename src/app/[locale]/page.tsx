'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Hero from '@/components/Hero'
import Quiz from '@/components/Quiz'
import AssessmentForm from '@/components/AssessmentForm'
import PreQuiz from '@/components/PreQuiz'
import About from '@/components/About'
import UnderstandingReport from '@/components/UnderstandingReport'

export default function Home() {

  const [step, setStep] = useState<'hero' | 'assessment' | 'prequiz' | 'quiz'>('hero')
  const router = useRouter()

useEffect(() => {
  const hash = window.location.hash
  if (hash.includes('type=recovery')) {
    router.push(`/reset-password${hash}`)
    return
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_IN') {
  // session active
}
  })

  return () => subscription.unsubscribe()
}, [])
  const [showReport, setShowReport] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [age, setAge] = useState<number>(0)
  const [sex, setSex] = useState<'male' | 'female' | 'other'>('male')
  const [height, setHeight] = useState<number>(0)
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric')
  const [weight, setWeight] = useState<number>(0)
  const [bloodGlucose, setBloodGlucose] = useState<string>('')
  const [ldl, setLdl] = useState<string>('')
  const [hdl, setHdl] = useState<string>('')
  const [crp, setCrp] = useState<string>('')
  const [vitaminD, setVitaminD] = useState<string>('')
  const [tsh, setTsh] = useState<string>('')
  const [geneticRisk, setGeneticRisk] = useState<string>('')
  const [country, setCountry] = useState<string>('')
  const [socioeconomic, setSocioeconomic] = useState<string>('')
  const [accessMode, setAccessMode] = useState<'guest' | 'registered'>('guest')
  const [password, setPassword] = useState<string>('')

  const memberTier: 'guest' | 'member' | 'premium' | 'executive' =
    accessMode === 'guest' ? 'guest' : 'member'

  return (
    <main className="min-h-screen overflow-hidden bg-[#02040A] text-white relative">
      <div className="relative z-10">

        {(step === 'hero' || step === 'assessment') && (
          <Hero
            onStart={() => setStep('assessment')}
            onAbout={() => setShowAbout(true)}
            onReports={() => setShowReport(true)}
          />
        )}

        {step === 'assessment' && (
          <AssessmentForm
            memberTier={memberTier}
            onClose={() => setStep('hero')}
            onStart={(mode, name, mail, password) => {
              setFullName(name)
              setEmail(mail)
              setAccessMode(mode)
              setPassword(password)
              requestAnimationFrame(() => setStep('prequiz'))
            }}
          />
        )}

        {step === 'prequiz' && (
          <PreQuiz
            fullName={fullName}
            email={email}
            memberTier={memberTier}
            accessMode={accessMode}
            age={age}
            sex={sex}
            height={height}
            weight={weight}
            unitSystem={unitSystem}
            onUnitSystemChange={setUnitSystem}
            bloodGlucose={bloodGlucose}
            ldl={ldl}
            hdl={hdl}
            crp={crp}
            vitaminD={vitaminD}
            tsh={tsh}
            geneticRisk={geneticRisk}
            onBack={() => setStep('assessment')}
            onContinue={() => setStep('quiz')}
            onAgeChange={setAge}
            onSexChange={setSex}
            onHeightChange={setHeight}
            onWeightChange={setWeight}
            onBloodGlucoseChange={setBloodGlucose}
            onLdlChange={setLdl}
            onHdlChange={setHdl}
            onCrpChange={setCrp}
            onVitaminDChange={setVitaminD}
            onTshChange={setTsh}
            onGeneticRiskChange={setGeneticRisk}
            country={country}
            socioeconomic={socioeconomic}
            onCountryChange={setCountry}
            onSocioeconomicChange={setSocioeconomic}
          />
        )}

        {step === 'quiz' && (
          <Quiz
            fullName={fullName}
            email={email}
            memberTier={memberTier}
            accessMode={accessMode}
            age={age}
            sex={sex}
            height={height}
            weight={weight}
            unitSystem={unitSystem}
            country={country}
            socioeconomic={socioeconomic}
            onBack={() => setStep('prequiz')}
          />
        )}

      </div>

      {showAbout && <About onClose={() => setShowAbout(false)} />}
      {showReport && <UnderstandingReport onClose={() => setShowReport(false)} />}
    </main>
  )
}