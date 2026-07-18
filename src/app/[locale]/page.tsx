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
import { useLocale } from 'next-intl'
import { calculateAge } from '@/lib/utils'
import FuelSpace from '@/components/FuelSpace'
import VisualSpace from '@/components/VisualSpace'

export default function Home() {

  const [step, setStep] = useState<'hero' | 'assessment' | 'prequiz' | 'quiz' | 'myspace' | 'fuel' | 'visual'>('hero')
useEffect(() => {
 
}, [step])

  const router = useRouter()

  const locale = useLocale()

  const [showReport, setShowReport] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
const [hasFuelSprint, setHasFuelSprint] = useState(false)
  // ── PROFIL UTILISATEUR ────────────────────────────────────────────────────
  const [fullName, setFullName]       = useState<string>('')
  const [email, setEmail]             = useState<string>('')
  const [age, setAge] = useState<number>(0)
const [dateOfBirth, setDateOfBirth] = useState<string>('')
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

  useEffect(() => {

}, [memberTier])

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
const [cachedBgCharacter, setCachedBgCharacter] = useState<'lona' | 'enginea' | 'gummy'>('lona')

useEffect(() => {
}, [cachedBgCharacter])


const [showSessionGuard, setShowSessionGuard] = useState(false)

const handleMySpaceBack = () => {
  setStep('hero')
}

const handleSignOut = async () => {
  await supabase.auth.signOut()
  setMemberTier('guest')
  setFullName('')
  setEmail('')
  setHasFuelSprint(false)
  localStorage.removeItem('lonara-auth-token')
  sessionStorage.clear()
  setStep('hero')
}

const handleGoToMySpace = async () => {
  
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
  const handleVisibility = () => {
    if (document.visibilityState === 'visible' && step === 'myspace') {
      setShowSessionGuard(true)
    }
  }
  document.addEventListener('visibilitychange', handleVisibility)
  return () => document.removeEventListener('visibilitychange', handleVisibility)
}, [step])

useEffect(() => {
  const hash = window.location.hash
  if (hash.includes('type=recovery')) {
    router.push(`/reset-password${hash}`)
    return
  }

  const loadUserData = async (userId: string, userEmail: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('member_tier, full_name, email, bg_character, date_of_birth, height_cm, weight_kg')
      .eq('id', userId)
      .single()

    if (profile?.member_tier) setMemberTier(profile.member_tier as 'guest' | 'member' | 'premium' | 'executive')
    if (profile?.full_name) setFullName(profile.full_name)
    if (profile?.email) setEmail(profile.email)
    if ((profile as any)?.bg_character) setCachedBgCharacter((profile as any).bg_character)
if ((profile as any)?.date_of_birth) {
  setDateOfBirth((profile as any).date_of_birth)
  setAge(calculateAge((profile as any).date_of_birth))
}
if ((profile as any)?.height_cm) setHeight((profile as any).height_cm)
if ((profile as any)?.weight_kg) setWeight((profile as any).weight_kg)


    const resolvedEmail = profile?.email ?? userEmail
    if (!resolvedEmail) return

    const { data: assessment } = await supabase
      .from('assessments')
      .select('id, created_at, scores, protocols, biomarkers, biological_age, longevity_score, recovery_index, stress_load, age, pillar_activate, pillar_balance, pillar_protect, pillar_restore')
      .eq('email', resolvedEmail)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (assessment) {
      setCachedAssessment(assessment)
      sessionStorage.setItem('lonara-cached-assessment', JSON.stringify(assessment))
    }

    const { data: fuelSprint } = await supabase
      .from('fuel_sprints')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle()

    setHasFuelSprint(!!fuelSprint)

    
const { data: allAssessments } = await supabase
  .from('assessments')
  .select('id, created_at, biological_age, longevity_score, recovery_index, stress_load, age, pdf_url, pillar_activate, pillar_balance, pillar_protect, pillar_restore')
  .eq('email', resolvedEmail)
  .order('created_at', { ascending: true })



if (allAssessments) {
  setCachedHistory(allAssessments)
  sessionStorage.setItem(
    'lonara-cached-history',
    JSON.stringify(allAssessments)
  )
}


}

 const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {


    if (event === 'SIGNED_OUT') {
      setMemberTier('guest')
      setFullName('')
      setEmail('')
setHasFuelSprint(false)
      setStep('hero')
     
      
      return
    }
if (
  (event === 'SIGNED_IN' ||
    event === 'TOKEN_REFRESHED' ||
    event === 'INITIAL_SESSION') &&
  session
) {
  loadUserData(
    session.user.id,
    session.user.email ?? ''
  )
}
  })

  return () => subscription.unsubscribe()
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
  .select('member_tier, subscription_plan, full_name, email, date_of_birth')
  .eq('id', user.id)
  .single()

if (!profile) { setMemberTier('member'); return }

// Remplir le nom et email depuis le profil
if (profile.full_name) setFullName(profile.full_name)
if (profile.email) setEmail(profile.email)
if ((profile as any)?.date_of_birth) {
  setDateOfBirth((profile as any).date_of_birth)
  setAge(calculateAge((profile as any).date_of_birth))
}
if ((profile as any)?.height_cm) setHeight((profile as any).height_cm)
if ((profile as any)?.weight_kg) setWeight((profile as any).weight_kg)  

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
}}
  onAbout={() => setShowAbout(true)}
  onReports={() => setShowReport(true)}
  onMySpace={() => handleGoToMySpace()}
  onFuel={() => {
    setPreviousStep('hero')
    setStep('fuel')
  }}
  memberTier={memberTier}
  hasFuelSprint={hasFuelSprint}
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
  setStep('prequiz')
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
dateOfBirth={dateOfBirth}
onDateOfBirthChange={async (dob) => {
  setDateOfBirth(dob)
  setAge(calculateAge(dob))
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('profiles')
      .update({ date_of_birth: dob })
      .eq('id', user.id)
  }
}}
            onSexChange={setSex}
        onHeightChange={async (h) => {
  setHeight(h)
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('profiles')
      .update({ height_cm: h })
      .eq('id', user.id)
  }
}}
onWeightChange={async (w) => {
  setWeight(w)
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('profiles')
      .update({ weight_kg: w })
      .eq('id', user.id)
  }
}}
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
{step === 'myspace' && (
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
    initialBgCharacter={cachedBgCharacter}
    onAssessmentLoaded={(a: any) => setCachedAssessment(a)}
    onBgCharacterChange={(bg: any) => setCachedBgCharacter(bg)}
    onSignOut={handleSignOut}
    onFuel={() => {
      setPreviousStep('myspace')
      setStep('fuel')
    }}
    hasFuelSprint={hasFuelSprint}
    onVisual={() => {
      setPreviousStep('myspace')
      setStep('visual')
    }}
  />
)}

{step === 'fuel' && (
  <FuelSpace
    memberTier={memberTier}
    fullName={fullName}
    onBack={() => {
      if (previousStep === 'myspace') {
        setMySpaceKey(k => k + 1)
        setStep('myspace')
      } else {
        setStep('hero')
      }
    }}
    onSignOut={handleSignOut}
  />
)}

{step === 'visual' && (
  <VisualSpace
    memberTier={memberTier}
    fullName={fullName}
    sex={sex}
    onBack={() => {
      if (previousStep === 'myspace') {
        setMySpaceKey(k => k + 1)
        setStep('myspace')
      } else {
        setStep('hero')
      }
    }}
    onSignOut={handleSignOut}
  />
)}

      </div>

      {showAbout && <About onClose={() => setShowAbout(false)} />}
      {showReport && <UnderstandingReport onClose={() => setShowReport(false)} />}

      {showSessionGuard && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-[#02040A]/70 backdrop-blur-md" />
          <div className="relative z-10 w-full max-w-[400px] mx-4 rounded-[28px] border border-white/8 bg-[#02040A]/90 backdrop-blur-xl px-8 py-10 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
            <div className="absolute top-0 left-[18%] w-[64%] h-[1px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-80" />
            <div className="flex justify-center mb-6">
       
           <img
  src={`/${cachedBgCharacter}-medallion.png`}
  alt={cachedBgCharacter}
  className="h-38 w-38 object-cover scale-80 border border-[#C7AC60]/20 rounded-full bg-[#C7AC60]/5 shadow-[0_0_20px_rgba(199,172,96,0.25)]"
 style={{
  filter: 'brightness(1.00) contrast(1.00)'
}}
/>
            </div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#C7AC60]/70 text-center mb-3">
              {locale === 'fr' ? 'Données Confidentielles' : locale === 'es' ? 'Datos Confidenciales' : 'Confidential Data'}
            </p>
            <h2 className="text-[1.6rem] font-light text-[#EAE4D5] text-center mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {locale === 'fr' ? 'Toujours là ?' : locale === 'es' ? '¿Sigues ahí?' : 'Still there?'}
            </h2>
            <p className="text-[13px] text-[#EAE4D5]/40 text-center leading-relaxed mb-8">
              {locale === 'fr'
                ? 'Votre session est active. Souhaitez-vous continuer ou mettre fin à votre session pour protéger vos données ?'
                : locale === 'es'
                ? 'Su sesión está activa. ¿Desea continuar o cerrar su sesión para proteger sus datos?'
                : 'Your session is active. Would you like to continue or end your session to protect your data?'}
            </p>
            <div className="flex flex-col gap-3">
              <button
    onClick={() => {

  setShowSessionGuard(false)
}}
                className="relative w-full rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/10 py-3.5 text-[11px] uppercase tracking-[0.25em] text-[#C7AC60] transition hover:bg-[#C7AC60]/20"
              >
                <div className="absolute top-0 left-[18%] w-[64%] h-[1px] bg-gradient-to-r from-transparent via-[#E7D19A]/60 to-transparent" />
                {locale === 'fr' ? 'Continuer la session' : locale === 'es' ? 'Continuar sesión' : 'Continue session'}
              </button>

           
              <button
onClick={() => {
  

  
  supabase.auth.signOut()
 

  setShowSessionGuard(false)

  setMemberTier('guest')
  setFullName('')
  setEmail('')
setHasFuelSprint(false)
  localStorage.removeItem('lonara-auth-token')
  sessionStorage.clear()

 

  setStep('hero')

  
}}
                className="w-full rounded-full border border-white/8 bg-white/[0.03] py-3.5 text-[11px] uppercase tracking-[0.25em] text-white/30 transition hover:text-white/50 hover:border-white/15"
              >
                {locale === 'fr' ? 'Terminer la session' : locale === 'es' ? 'Cerrar sesión' : 'End session'}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}