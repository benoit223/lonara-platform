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
import MySpace from '@/components/MySpace'

export default function Home() {

  const [step, setStep] = useState<'hero' | 'assessment' | 'prequiz' | 'quiz' | 'myspace'>('hero')
  const router = useRouter()

  

  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('type=recovery')) {
      router.push(`/reset-password${hash}`)
      return
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setMemberTier('guest')
        setFullName('')
        setEmail('')
        setStep('hero')
      }

      if (!session && event !== 'SIGNED_OUT') {
        // Session perdue — remettre en état guest proprement
        setMemberTier('guest')
        setFullName('')
        setEmail('')
        if (step === 'myspace') setStep('hero')
      }

      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('member_tier, full_name, email')
          .eq('id', session.user.id)
          .single()
        if (profile?.member_tier) setMemberTier(profile.member_tier as 'guest' | 'member' | 'premium' | 'executive')
        if (profile?.full_name) setFullName(profile.full_name)
        if (profile?.email) setEmail(profile.email)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const [showReport, setShowReport] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  // ── PROFIL UTILISATEUR ────────────────────────────────────────────────────
  const [fullName, setFullName]       = useState<string>('')
  const [email, setEmail]             = useState<string>('')
  const [age, setAge]                 = useState<number>(0)
  const [sex, setSex]                 = useState<'male' | 'female' | 'other'>('male')
  const [height, setHeight]           = useState<number>(0)
  const [weight, setWeight]           = useState<number>(0)
  const [unitSystem, setUnitSystem]   = useState<'metric' | 'imperial'>('metric')
  const [country, setCountry]         = useState<string>('')
  const [socioeconomic, setSocioeconomic] = useState<string>('')
  const [accessMode, setAccessMode]   = useState<'guest' | 'registered'>('guest')
  const [password, setPassword]       = useState<string>('')

  // ── MEMBER TIER — lu depuis Supabase après login ──────────────────────────
  const [memberTier, setMemberTier] = useState<'guest' | 'member' | 'premium' | 'executive'>('guest')

const [pendingStep, setPendingStep] = useState<boolean>(false)
const [previousStep, setPreviousStep] = useState<string>('hero')
const [mySpaceKey, setMySpaceKey] = useState(0)
const [cachedAssessment, setCachedAssessment] = useState<any>(() => {
  try {
    const stored = sessionStorage.getItem('lonara-cached-assessment')
    return stored ? JSON.parse(stored) : null
  } catch { return null }
})
const [cachedHistory, setCachedHistory] = useState<any[]>(() => {
  try {
    const stored = sessionStorage.getItem('lonara-cached-history')
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
})

const handleMySpaceBack = () => {
  setStep('hero')
}

const handleGoToMySpace = () => {

  setMySpaceKey(k => k + 1)
  setStep('myspace')
}

  // ── BIOMARQUEURS — collectés dans PreQuiz ────────────────────────────────
  // Panel 1 — Métabolique
  const [fastingGlucose, setFastingGlucose] = useState<string>('')
  const [hba1c, setHba1c]                   = useState<string>('')
  const [ldl, setLdl]                       = useState<string>('')
  const [hdl, setHdl]                       = useState<string>('')
  const [triglycerides, setTriglycerides]   = useState<string>('')
  const [apoB, setApoB]                     = useState<string>('')
  // Panel 2 — Hormonal de base (premium) + avancé (executive)
  const [tsh, setTsh]                       = useState<string>('')
  const [vitaminD, setVitaminD]             = useState<string>('')
  const [testosterone, setTestosterone]     = useState<string>('')
  const [homocysteine, setHomocysteine]     = useState<string>('')
  const [igf1, setIgf1]                     = useState<string>('')
  const [insulin, setInsulin]               = useState<string>('')
  const [dheas, setDheas]                   = useState<string>('')
  // Panel 3 — Inflammation
  const [hsCRP, setHsCRP]                   = useState<string>('')
  const [ferritin, setFerritin]             = useState<string>('')
  const [il6, setIl6]                       = useState<string>('')
  const [tnfAlpha, setTnfAlpha]             = useState<string>('')
  // Panel 4 — Épigénétique (executive)
  const [horvath, setHorvath]               = useState<string>('')
  const [phenoAge, setPhenoAge]             = useState<string>('')
  const [grimAge, setGrimAge]               = useState<string>('')
  const [dunedinPACE, setDunedinPACE]       = useState<string>('')
  // Panel 5 — Télomères (executive)
  const [telomereQPCR, setTelomereQPCR]           = useState<string>('')
  const [telomereFISH, setTelomereFISH]           = useState<string>('')
  const [telomeraseActivity, setTelomeraseActivity] = useState<string>('')
  // Panel 6 — Multi-omics (executive)
  const [proteomics, setProteomics]         = useState<string>('')
  const [metabolomics, setMetabolomics]     = useState<string>('')
  const [microbiome, setMicrobiome]         = useState<string>('')
  const [gwasSNP, setGwasSNP]               = useState<string>('')
  // Panel 7 — Neuro (executive)
  const [gfap, setGfap]                     = useState<string>('')
  const [nfl, setNfl]                       = useState<string>('')
  const [amyloidBeta, setAmyloidBeta]       = useState<string>('')
  const [pTau217, setPTau217]               = useState<string>('')
  // Panel 8 — Cardio avancé (executive)
  const [ntProBNP, setNtProBNP]             = useState<string>('')
  const [lpa, setLpa]                       = useState<string>('')
  const [cacScore, setCacScore]             = useState<string>('')
  const [gdf15, setGdf15]                   = useState<string>('')

  useEffect(() => {
    if (!pendingStep) return
    setPendingStep(false)
    setStep('prequiz')
  }, [pendingStep])

// ── LIRE LE TIER AU MONTAGE si session active ─────────────────────────────
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setMemberTier('guest')
        return
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('member_tier, full_name, email')
        .eq('id', session.user.id)
        .single()
      if (!profile) return
      if (profile.member_tier) 
      
        setMemberTier(profile.member_tier as 'guest' | 'member' | 'premium' | 'executive')
      if (profile.full_name) setFullName(profile.full_name)
      if (profile.email) setEmail(profile.email)

      // Précharger le dernier assessment
      const userEmail = profile.email ?? session.user.email ?? ''
      if (userEmail) {
        const { data: assessment } = await supabase
          .from('assessments')
          .select('id, created_at, scores, protocols, biomarkers, biological_age, longevity_score, recovery_index, stress_load, age, pillar_activate, pillar_balance, pillar_protect, pillar_restore')
          .eq('email', userEmail)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (assessment) {
          setCachedAssessment(assessment)
          sessionStorage.setItem('lonara-cached-assessment', JSON.stringify(assessment))
        }
        const { data: allAssessments } = await supabase
          .from('assessments')
          .select('id, created_at, biological_age, longevity_score, recovery_index, stress_load, age, pdf_url, pillar_activate, pillar_balance, pillar_protect, pillar_restore')
          .eq('email', userEmail)
          .order('created_at', { ascending: true })
        if (allAssessments) {
          setCachedHistory(allAssessments)
          sessionStorage.setItem('lonara-cached-history', JSON.stringify(allAssessments))
        }
      }
    }
    checkSession()
  }, [])




  // ── OBJET BIOMARQUEURS — transmis au Quiz puis à Results ─────────────────
  const biomarkers = {
    fastingGlucose, hba1c, ldl, hdl, triglycerides, apoB,
    tsh, vitaminD, testosterone, homocysteine, igf1, insulin, dheas,
    hsCRP, ferritin, il6, tnfAlpha,
    horvath, phenoAge, grimAge, dunedinPACE,
    telomereQPCR, telomereFISH, telomeraseActivity,
    proteomics, metabolomics, microbiome, gwasSNP,
    gfap, nfl, amyloidBeta, pTau217,
    ntProBNP, lpa, cacScore, gdf15,
  }

  // ── RÉSOLUTION DU MEMBER TIER depuis Supabase ────────────────────────────
  const resolveMemberTier = async (mode: 'guest' | 'registered') => {
    if (mode === 'guest') {
      setMemberTier('guest')
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setMemberTier('member'); return }

  const { data: profile } = await supabase
  .from('profiles')
  .select('member_tier, subscription_plan, full_name, email')
  .eq('id', user.id)
  .single()

if (!profile) { setMemberTier('member'); return }

// Remplir le nom et email depuis le profil
if (profile.full_name) setFullName(profile.full_name)
if (profile.email) setEmail(profile.email)

const tier = profile.member_tier
  ?? mapSubscriptionPlan(profile.subscription_plan)
  ?? 'member'

setMemberTier(tier as 'guest' | 'member' | 'premium' | 'executive')
  }

  const mapSubscriptionPlan = (plan: string | null): string => {
    if (!plan) return 'member'
    if (plan === 'executive') return 'executive'
    if (plan === 'premium') return 'premium'
    return 'member'
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#02040A] text-white relative">
      <div className="relative z-10">

        {(step === 'hero' || step === 'assessment') && (
         <Hero

  onStart={() => {
  if (memberTier !== 'guest') {
    setAccessMode('registered')
    setPreviousStep('hero')
    setStep('prequiz')
  } else {
    setStep('assessment')
  }
}}          onAbout={() => setShowAbout(true)}
  onReports={() => setShowReport(true)}
  onMySpace={() => handleGoToMySpace()}
  memberTier={memberTier}
/>
        )}

        {step === 'assessment' && (
          <AssessmentForm
            memberTier={memberTier}
            onClose={() => setStep('hero')}
  
            onStart={async (mode, name, mail, pw) => {
  setFullName(name)
  setEmail(mail)
  setAccessMode(mode)
  setPassword(pw)
  await resolveMemberTier(mode)
setPendingStep(true)
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
            // Panel 1
            fastingGlucose={fastingGlucose}
            hba1c={hba1c}
            ldl={ldl}
            hdl={hdl}
            triglycerides={triglycerides}
            apoB={apoB}
            // Panel 2
            tsh={tsh}
            vitaminD={vitaminD}
            testosterone={testosterone}
            homocysteine={homocysteine}
            igf1={igf1}
            insulin={insulin}
            dheas={dheas}
            // Panel 3
            hsCRP={hsCRP}
            ferritin={ferritin}
            il6={il6}
            tnfAlpha={tnfAlpha}
            // Panel 4
            horvath={horvath}
            phenoAge={phenoAge}
            grimAge={grimAge}
            dunedinPACE={dunedinPACE}
            // Panel 5
            telomereQPCR={telomereQPCR}
            telomereFISH={telomereFISH}
            telomeraseActivity={telomeraseActivity}
            // Panel 6
            proteomics={proteomics}
            metabolomics={metabolomics}
            microbiome={microbiome}
            gwasSNP={gwasSNP}
            // Panel 7
            gfap={gfap}
            nfl={nfl}
            amyloidBeta={amyloidBeta}
            pTau217={pTau217}
            // Panel 8
            ntProBNP={ntProBNP}
            lpa={lpa}
            cacScore={cacScore}
            gdf15={gdf15}
            // Setters Panel 1
            onFastingGlucoseChange={setFastingGlucose}
            onHba1cChange={setHba1c}
            onLdlChange={setLdl}
            onHdlChange={setHdl}
            onTriglyceridesChange={setTriglycerides}
            onApoBChange={setApoB}
            // Setters Panel 2
            onTshChange={setTsh}
            onVitaminDChange={setVitaminD}
            onTestosteroneChange={setTestosterone}
            onHomocysteineChange={setHomocysteine}
            onIgf1Change={setIgf1}
            onInsulinChange={setInsulin}
            onDheasChange={setDheas}
            // Setters Panel 3
            onHsCRPChange={setHsCRP}
            onFerritinChange={setFerritin}
            onIl6Change={setIl6}
            onTnfAlphaChange={setTnfAlpha}
            // Setters Panel 4
            onHorvathChange={setHorvath}
            onPhenoAgeChange={setPhenoAge}
            onGrimAgeChange={setGrimAge}
            onDunedinPACEChange={setDunedinPACE}
            // Setters Panel 5
            onTelomereQPCRChange={setTelomereQPCR}
            onTelomereFISHChange={setTelomereFISH}
            onTelomeraseActivityChange={setTelomeraseActivity}
            // Setters Panel 6
            onProteomicsChange={setProteomics}
            onMetabolomicsChange={setMetabolomics}
            onMicrobiomeChange={setMicrobiome}
            onGwasSNPChange={setGwasSNP}
            // Setters Panel 7
            onGfapChange={setGfap}
            onNflChange={setNfl}
            onAmyloidBetaChange={setAmyloidBeta}
            onPTau217Change={setPTau217}
            // Setters Panel 8
            onNtProBNPChange={setNtProBNP}
            onLpaChange={setLpa}
            onCacScoreChange={setCacScore}
            onGdf15Change={setGdf15}
            // Autres
   onBack={() => {
  if (previousStep === 'myspace') {
    handleGoToMySpace()
  } else if (memberTier === 'member' || memberTier === 'premium' || memberTier === 'executive') {
    setStep('hero')
  } else {
    setStep('assessment')
  }
}}         onContinue={() => setStep('quiz')}
            onAgeChange={setAge}
            onSexChange={setSex}
            onHeightChange={setHeight}
            onWeightChange={setWeight}
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
            biomarkers={biomarkers}
            onBack={() => setStep('prequiz')}
               onMySpace={
      memberTier === 'premium' || memberTier === 'executive'
        ? () => handleGoToMySpace()
        : undefined
    } 
          />
        )}

       {/* ── MY SPACE ── */}
<div style={{ display: step === 'myspace' ? 'block' : 'none' }}>
  <MySpace
    memberTier={memberTier}
    fullName={fullName}
    onBack={handleMySpaceBack}
    onStartAssessment={() => {
      setPreviousStep('myspace')
      setStep('prequiz')
    }}
    initialAssessment={cachedAssessment}
    initialHistory={cachedHistory}
    onAssessmentLoaded={(a: any) => setCachedAssessment(a)}
  />
</div>

      </div>

      {showAbout && <About onClose={() => setShowAbout(false)} />}
      {showReport && <UnderstandingReport onClose={() => setShowReport(false)} />}
    </main>
  )
}