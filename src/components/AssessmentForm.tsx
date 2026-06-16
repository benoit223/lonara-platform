// src/components/AssessmentForm.tsx

'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useTranslations, useLocale } from 'next-intl'

interface AssessmentFormProps {
  memberTier:
  | 'guest'
  | 'member'
  | 'premium'
  | 'executive'

  onStart: (
    accessMode: 'guest' | 'registered',
    name: string,
    email: string,
    password: string,
  ) => void

  onClose: () => void
}

export default function AssessmentForm({
  memberTier,
  onStart,
  onClose,
  
}: AssessmentFormProps) {

const t = useTranslations('assessment')
const locale = useLocale()
const [firstName, setFirstName] =
  useState<string>('')

const [lastName, setLastName] =
  useState<string>('')

  const [email, setEmail] =
    useState<string>('')

  const [error, setError] =
    useState<string>('')

const [entryMode, setEntryMode] =
  useState<
    'guest' |
    'signup' |
    'signin'
  >('guest')

const [password, setPassword] =
  useState<string>('')

const [
  confirmPassword,
  setConfirmPassword,
] = useState<string>('')


const [showPlans, setShowPlans] = useState<boolean>(false)


  return (
   <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-black/10 backdrop-blur-[3px]">

  {/* CONTENT */}
  <div className="relative z-10 flex min-h-screen items-start md:items-center justify-center px-4 py-6">
      <div className="relative w-full max-w-[1180px] rounded-[1.2rem] md:rounded-[1.8rem] border border-[#035AA8]/14 bg-[rgba(3,10,20,0.58)] backdrop-blur-[20px] px-4 md:px-8 py-6 md:py-8 shadow-[0_0_50px_rgba(3,90,168,0.10)]">

        {/* GLOW */}
        <div className="absolute left-[-120px] top-[-120px] h-[180px] w-[180px] rounded-full bg-[#035AA8]/8 blur-[120px]" />

        <div className="absolute right-[-80px] bottom-[-80px] h-[140px] w-[140px] rounded-full bg-[#C7AC60]/8 blur-[100px]" />

        {/* CLOSE */}
        <button
          type="button"
          onClick={() => onClose()}
          className="absolute right-4 top-4 md:right-5 md:top-4 z-[100] flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/40 backdrop-blur-xl transition-all hover:border-[#C7AC60]/30 hover:bg-[#C7AC60]/10 hover:text-[#E7D19A]"
        >
          <span className="text-[16px] md:text-[18px] leading-none">×</span>
        </button>

        {/* FORM */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-10">

{/* LEFT PANEL */}
<div className="relative overflow-hidden rounded-[1.2rem] md:rounded-[1.4rem] border border-[#C7AC60]/10 bg-[rgba(255,255,255,0.02)] p-5 md:p-7 backdrop-blur-[18px]">

  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent)]" />

  <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/70">
    {t('accessMode')}
  </p>

  <h3
    className="mt-2 text-[26px] md:text-[34px] leading-[1.0] text-[#EAE4D5]"
    style={{
      fontFamily:
        "'Cormorant Garamond', serif",
    }}
  >
    {t('enterSystem')}
    
  </h3>

  <p className="mt-2 max-w-[420px] text-[12px] md:text-[13px] leading-[1.8] text-white/48">
    {t('enterSubtitle')}
  </p>

  {/* OPTIONS */}
  <div className="mt-5 md:mt-6 space-y-4">

    {/* GUEST */}
    <button
      type="button"
      onClick={() =>
        setEntryMode('guest')
      }
      className={`w-full rounded-[1.0rem] md:rounded-[1.2rem] border p-4 md:p-5 text-left transition-all ${
        entryMode === 'guest'
          ? 'border-[#035AA8]/40 bg-[#035AA8]/10'
          : 'border-white/5 bg-white/[0.02]'
      }`}
    >

      <div className="flex items-center justify-between">

        <div>
          <p className="text-[12px] md:text-[13px] uppercase tracking-[0.16em] text-[#EAE4D5]">
            {t('guestTitle')}
          </p>

          <p className="mt-2 text-[11px] md:text-[12px] leading-[1.6] text-white/45">
            {t('guestSubtitle')}
          </p>
        </div>

        <div
          className={`h-4 w-4 rounded-full border ${
            entryMode === 'guest'
              ? 'border-[#035AA8] bg-[#035AA8]'
              : 'border-white/20'
          }`}
        />
      </div>

     <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] md:text-[11px] text-white/40">

        <div>✓ {t('guestPerk1')}</div>

        <div>✓ {t('guestPerk2')}</div>

        <div className="text-[#C7AC60]/60">
          ✗ {t('guestLock1')}
        </div>

        <div className="text-[#C7AC60]/60">
          ✗ {t('guestLock2')}
        </div>

      </div>

    </button>



  </div>

{/* VIEW PLANS BUTTON */}
  <button
    type="button"
    onClick={() => setShowPlans(true)}
    className="mt-5 w-full rounded-[1.0rem] border border-[#C7AC60]/20 bg-[#C7AC60]/5 px-4 py-3 text-left transition-all hover:border-[#C7AC60]/35 hover:bg-[#C7AC60]/8"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#C7AC60]/80">
          {t('viewPlans')}
        </p>
        <p className="mt-1 text-[10px] text-white/35">
          {t('viewPlansSubtitle')}
        </p>
      </div>
      <span className="text-[#C7AC60]/60 text-lg">→</span>
    </div>
  </button>

  <div className="mt-5 md:mt-6 flex rounded-full border border-white/8 bg-white/[0.02] p-1">

    <button
      type="button"
      onClick={() =>
        setEntryMode('signup')
      }
      className={`flex-1 rounded-full px-4 py-2 text-[10px] md:text-[11px] uppercase tracking-[0.18em] transition-all ${
        entryMode === 'signup'
          ? 'bg-[#C7AC60] text-black'
          : 'text-white/40'
      }`}
    >
      {t('createAccount')}
    </button>

    <button
      type="button"
      onClick={() =>
        setEntryMode('signin')
      }
      className={`flex-1 rounded-full px-4 py-2 text-[10px] md:text-[11px] uppercase tracking-[0.18em] transition-all ${
        entryMode === 'signin'
          ? 'bg-[#035AA8] text-white'
          : 'text-white/40'
      }`}
    >
      {t('signIn')}
    </button>

  </div>




</div>

{/* RIGHT PANEL */}
<div className="space-y-3">

     
  {/* FULL NAME */}
  {entryMode !== 'signin' && (
  <div className="grid grid-cols-2 gap-3 md:gap-4">

  <div>
    <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/72">
      {t('firstName')}
    </label>

    <input
      type="text"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      placeholder="John"
      className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-white/[0.025] px-4 py-2.5 text-[13px] text-white placeholder:text-white/18 backdrop-blur-xl transition-all duration-300 focus:border-[#035AA8]/45 focus:outline-none focus:shadow-[0_0_25px_rgba(3,90,168,0.18)]"
    />
  </div>

  <div>
    <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/72">
      {t('lastName')}
    </label>

    <input
      type="text"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      placeholder="Doe"
      className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-white/[0.025] px-4 py-2.5 text-[13px] text-white placeholder:text-white/18 backdrop-blur-xl transition-all duration-300 focus:border-[#035AA8]/45 focus:outline-none focus:shadow-[0_0_25px_rgba(3,90,168,0.18)]"
    />
  </div>

</div>
)}
          {/* EMAIL */}
          <div>

            <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/72">
              {t('email')}
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder={t('emailPlaceholder')}
             className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-white/[0.025] px-4 py-2.5 text-[13px] text-white placeholder:text-white/18 backdrop-blur-xl transition-all duration-300 focus:border-[#035AA8]/45 focus:outline-none focus:shadow-[0_0_25px_rgba(3,90,168,0.18)]"
            />

          </div>


{entryMode !== 'guest' && (

<>
{/* ACCOUNT PASSWORD */}


  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">

    <div>

      <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/72">

        {
          entryMode === 'signup'
            ? t('createPassword')
            : t('accountPassword')
        }

      </label>

      <input
        type="password"
        
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        placeholder={
          entryMode === 'signup'
            ? t('createPasswordPlaceholder')
            : t('enterPasswordPlaceholder')
        }
        className="w-full rounded-[0.9rem] border border-[#C7AC60]/20 bg-white/[0.025] px-4 py-3 text-[13px] text-white placeholder:text-white/18 backdrop-blur-xl transition-all duration-300 focus:border-[#C7AC60]/45 focus:outline-none disabled:opacity-35
disabled:cursor-not-allowed"
      />

    </div>
{entryMode === 'signup' && (
    <div>

      <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/72">
  {t('confirmPassword')}
</label>

      <input
        type="password"
        value={confirmPassword}
        onChange={(e) =>
          setConfirmPassword(
            e.target.value,
          )
        }
    
        placeholder={t('confirmPasswordPlaceholder')}

        className="
          w-full
          rounded-[0.9rem]
          border
          border-[#C7AC60]/20
          bg-white/[0.025]
          px-4
          py-3
          text-[13px]
          text-white
          placeholder:text-white/18
          backdrop-blur-xl
          transition-all
          duration-300
          focus:border-[#C7AC60]/45
          focus:outline-none
          disabled:opacity-35
disabled:cursor-not-allowed
        "
      />

    </div>
)}
</div>

{entryMode === 'signin' && (

  <div className="flex justify-end">

    <button
      type="button"
      onClick={async () => {

        if (!email) {

          setError(
            t('errorEmailFirst'),
          )

          return
        }

     const { error } = await supabase.auth.resetPasswordForEmail(
  email,
  {
    redirectTo: `${window.location.origin}/${locale}/reset-password`,
  },
)
        if (error) {

          setError(
            error.message,
          )

          return
        }

        setError(
          t('passwordResetSent'),
        )

      }}
      className="text-[11px] text-[#C7AC60]/70 hover:text-[#E7D19A]"
    >
      {t('forgotPassword')}
    </button>

  </div>

)}

</>

)}

          {/* LONGEVITY GOAL */}
          <div>

            <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/72">
              {t('longevityGoal')}
            </label>

            <select
className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-white/[0.025] px-4 py-2.5 text-[13px] text-white placeholder:text-white/18 backdrop-blur-xl transition-all duration-300 focus:border-[#035AA8]/45 focus:outline-none focus:shadow-[0_0_25px_rgba(3,90,168,0.18)]"
            >
         <option className="bg-[#0A1A28] text-[#EAE4D5]">
  {t('goalEnergy')}
</option>

<option className="bg-[#0A1A28] text-[#EAE4D5]">
  {t('goalSleep')}
</option>

<option className="bg-[#0A1A28] text-[#EAE4D5]">
  {t('goalStress')}
</option>

<option className="bg-[#0A1A28] text-[#EAE4D5]">
  {t('goalPerformance')}
</option>

<option className="bg-[#0A1A28] text-[#EAE4D5]">
  {t('goalAging')}
</option>

<option className="bg-[#0A1A28] text-[#EAE4D5]">
  {t('goalLongevity')}
</option>

            </select>

          </div>

          {/* PRIORITY */}
          <div>

            <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/72">
              {t('healthPriority')}
            </label>

            <textarea
              rows={3}
              placeholder={t('healthPriorityPlaceholder')}
           className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-white/[0.025] px-4 py-2.5 text-[13px] text-white placeholder:text-white/18 backdrop-blur-xl transition-all duration-300 focus:border-[#035AA8]/45 focus:outline-none focus:shadow-[0_0_25px_rgba(3,90,168,0.18)]"
            />

          </div>

  
          {/* ERROR */}
          {error && (

            <div className="rounded-[0.9rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">
              {error}
            </div>

          )}

       {/* BUTTON */}
          <button
            onClick={async () => {

               if (!email) {
  setError(t('errorEmail'))
  return
}

if (
  entryMode !== 'signin' &&
  (!firstName || !lastName)
) {
  setError(t('errorName'))
  return
}

              setError('')

if (entryMode === 'signup') {
  if (!password || !confirmPassword) {
    setError(t('errorPassword'))
    return
  }
  if (password !== confirmPassword) {
    setError(t('errorPasswordMatch'))
    return
  }
  if (password.length < 8) {
    setError(t('errorPasswordLength'))
    return
  }
}

if (entryMode === 'guest') {
 const { error: profileError } =
  await supabase
    .from('profiles')
    .upsert({
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`,
      email,
      access_mode: 'guest',
      account_status: 'guest',
      subscription_status: 'none',
      subscription_plan: 'free',
    }, { onConflict: 'email' })

if (profileError) {
  setError(profileError.message)
  return
}
}

if (entryMode !== 'guest') {
  if (entryMode === 'signup') {
    const { data, error: signupError } =
      await supabase.auth.signUp({ email, password })

   if (signupError?.message) {
  setError(signupError.message)
  return
}

  if (data?.user) {
  await supabase
    .from('profiles')
    .upsert({
      id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`,
      email,
      access_mode: 'registered',
      account_status: 'active',
      member_tier: 'member',
      subscription_status: 'none',
      subscription_plan: 'free',
    }, { onConflict: 'email' })

  if (!data.user.confirmed_at) {
    setError(t('checkYourEmail'))
    return
  }
  }
  } else {
    const { error: signinError } =
      await supabase.auth.signInWithPassword({ email, password })

   if (signinError?.message) {
  setError(signinError.message)
  return
}
  }
}

onStart(
  entryMode === 'guest' ? 'guest' : 'registered',
  `${firstName} ${lastName}`,
  email,
  password,
)

            }}
            className="group relative overflow-hidden mt-4 w-full rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/5 px-6 py-3 text-[13px] tracking-[0.06em] text-[#C7AC60] backdrop-blur-xl transition-all hover:bg-[#C7AC60]/10 hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
          >
            <div className="absolute top-0 left-[18%] w-[64%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
            <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />
            <span className="relative z-10">
              {entryMode === 'guest'
                ? t('startAssessment')
                : entryMode === 'signup'
                ? t('createAndContinue')
                : t('signInAndContinue')}
            </span>
          </button>
         </div>

        </div>
      </div>
          </div>
    

{/* ── MODAL MEMBERSHIP PLANS ─────────────────────────────────────── */}
      {showPlans && (
        <div className="fixed inset-0 z-[60] overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-[6px]">
          <div className="relative z-10 flex min-h-screen items-start md:items-center justify-center px-4 py-8">
            <div className="relative w-full max-w-[1280px] rounded-[1.2rem] md:rounded-[1.8rem] border border-[#C7AC60]/14 bg-[rgba(3,10,20,0.82)] backdrop-blur-[24px] px-4 md:px-10 py-8 md:py-12 shadow-[0_0_80px_rgba(199,172,96,0.08)]">

              {/* GLOW */}
              <div className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-[#C7AC60]/6 blur-[140px]" />
              <div className="absolute right-[-80px] bottom-[-80px] h-[240px] w-[240px] rounded-full bg-[#035AA8]/8 blur-[120px]" />
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />

              {/* CLOSE */}
              <button
                type="button"
                onClick={() => setShowPlans(false)}
                className="absolute right-4 top-4 md:right-6 md:top-6 z-[100] flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/40 backdrop-blur-xl transition-all hover:border-[#C7AC60]/30 hover:bg-[#C7AC60]/10 hover:text-[#E7D19A]"
              >
                <span className="text-[16px] md:text-[18px] leading-none">×</span>
              </button>

              {/* HEADER */}
              <div className="relative z-10 text-center mb-10">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#C7AC60]/70 mb-3">
                  {t('plansLabel')}
                </p>
                <h2
                  className="text-[2.8rem] md:text-[4rem] leading-none font-light text-[#EAE4D5]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {t('plansTitle')}
                </h2>
                <p className="mt-4 text-[13px] text-white/40 max-w-[600px] mx-auto leading-relaxed">
                  {t('plansSubtitle')}
                </p>
              </div>

              {/* PLANS GRID */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">

                {/* ── GUEST ── */}
                <div className="relative overflow-hidden rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-6 flex flex-col">
                  <div className="absolute top-0 left-[12%] w-[76%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/40 mb-4">{t('planGuestLabel')}</p>
                  <h3 className="text-[2rem] font-extralight text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {t('planGuestName')}
                  </h3>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-[2.2rem] font-light text-white/80">{t('planGuestPrice')}</span>
                  </div>
                  <p className="text-[10px] text-white/30 mb-6">{t('planGuestCommitment')}</p>
                  <div className="space-y-2 flex-1 mb-6">
                    <div className="text-[11px] text-white/50">✓ {t('planGuestF1')}</div>
                    <div className="text-[11px] text-white/50">✓ {t('planGuestF2')}</div>
                    <div className="text-[11px] text-[#C7AC60]/40">✗ {t('planGuestF3')}</div>
                    <div className="text-[11px] text-[#C7AC60]/40">✗ {t('planGuestF4')}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setShowPlans(false); setEntryMode('guest') }}
                    className="w-full rounded-full border border-white/12 bg-white/[0.04] py-3 text-[11px] uppercase tracking-[0.18em] text-white/60 transition hover:bg-white/[0.08] hover:text-white/80"
                  >
                    {t('planGuestCTA')}
                  </button>
                </div>

                {/* ── MEMBER ── */}
                <div className="relative overflow-hidden rounded-[1.4rem] border border-[#035AA8]/25 bg-[#035AA8]/[0.06] p-6 flex flex-col">
                  <div className="absolute top-0 left-[12%] w-[76%] h-[1px] bg-gradient-to-r from-transparent via-[#5C96D8]/40 to-transparent" />
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#5C96D8]/70 mb-4">{t('planMemberLabel')}</p>
                  <h3 className="text-[2rem] font-extralight text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {t('planMemberName')}
                  </h3>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-[2.2rem] font-light text-[#5C96D8]">1€</span>
                    <span className="text-[11px] text-white/30 mb-1">{t('perMonth')}</span>
                  </div>
                  <p className="text-[10px] text-white/30 mb-6">{t('planMemberCommitment')}</p>
                  <div className="space-y-2 flex-1 mb-6">
                    <div className="text-[11px] text-white/50">✓ {t('planMemberF1')}</div>
                    <div className="text-[11px] text-white/50">✓ {t('planMemberF2')}</div>
                    <div className="text-[11px] text-white/50">✓ {t('planMemberF3')}</div>
                    <div className="text-[11px] text-[#C7AC60]/40">✗ {t('planMemberF4')}</div>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="w-full rounded-full border border-[#035AA8]/30 bg-[#035AA8]/10 py-3 text-[11px] uppercase tracking-[0.18em] text-[#5C96D8] opacity-50 cursor-not-allowed"
                  >
                    {t('planMemberCTA')}
                  </button>
                  <p className="mt-2 text-center text-[9px] text-white/20">{t('comingSoon')}</p>
                </div>

                {/* ── PREMIUM ── */}
                <div className="relative overflow-hidden rounded-[1.4rem] border border-[#C7AC60]/25 bg-[#C7AC60]/[0.06] p-6 flex flex-col">
                  <div className="absolute top-0 left-[12%] w-[76%] h-[1px] bg-gradient-to-r from-transparent via-[#E7D19A]/60 to-transparent" />
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/70 mb-4">{t('planPremiumLabel')}</p>
                  <h3 className="text-[2rem] font-extralight text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {t('planPremiumName')}
                  </h3>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-[2.2rem] font-light text-[#C7AC60]">4€</span>
                    <span className="text-[11px] text-white/30 mb-1">{t('perMonth')}</span>
                  </div>
                  <p className="text-[10px] text-white/30 mb-6">{t('planPremiumCommitment')}</p>
                  <div className="space-y-2 flex-1 mb-6">
                    <div className="text-[11px] text-white/50">✓ {t('planPremiumF1')}</div>
                    <div className="text-[11px] text-white/50">✓ {t('planPremiumF2')}</div>
                    <div className="text-[11px] text-white/50">✓ {t('planPremiumF3')}</div>
                    <div className="text-[11px] text-white/50">✓ {t('planPremiumF4')}</div>
                    <div className="text-[11px] text-[#C7AC60]/40">✗ {t('planPremiumF5')}</div>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="w-full rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/8 py-3 text-[11px] uppercase tracking-[0.18em] text-[#C7AC60] opacity-50 cursor-not-allowed"
                  >
                    {t('planPremiumCTA')}
                  </button>
                  <p className="mt-2 text-center text-[9px] text-white/20">{t('comingSoon')}</p>
                </div>

                {/* ── EXECUTIVE ── */}
                <div className="relative overflow-hidden rounded-[1.4rem] border border-[#C7AC60]/35 bg-gradient-to-b from-[#C7AC60]/[0.10] to-[#C7AC60]/[0.04] p-6 flex flex-col">
                  <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
                  <div className="absolute inset-0 rounded-[1.4rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_40px_rgba(199,172,96,0.06)] pointer-events-none" />
                  {/* BADGE */}
                  <div className="absolute top-4 right-4 rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/10 px-3 py-1">
                    <p className="text-[9px] uppercase tracking-[0.22em] text-[#E7D19A]">{t('planExecutiveBadge')}</p>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/70 mb-4">{t('planExecutiveLabel')}</p>
                  <h3 className="text-[2rem] font-extralight text-[#EAE4D5] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {t('planExecutiveName')}
                  </h3>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-[2.2rem] font-light text-[#E7D19A]">499€</span>
                    <span className="text-[11px] text-white/30 mb-1">{t('perMonth')}</span>
                  </div>
                  <p className="text-[10px] text-white/30 mb-6">{t('planExecutiveCommitment')}</p>
                  <div className="space-y-2 flex-1 mb-6">
                    <div className="text-[11px] text-white/60">✓ {t('planExecutiveF1')}</div>
                    <div className="text-[11px] text-white/60">✓ {t('planExecutiveF2')}</div>
                    <div className="text-[11px] text-white/60">✓ {t('planExecutiveF3')}</div>
                    <div className="text-[11px] text-white/60">✓ {t('planExecutiveF4')}</div>
                    <div className="text-[11px] text-[#C7AC60]">✓ {t('planExecutiveF5')}</div>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="w-full rounded-full border border-[#C7AC60]/40 bg-[#C7AC60]/10 py-3 text-[11px] uppercase tracking-[0.18em] text-[#E7D19A] opacity-50 cursor-not-allowed"
                  >
                    {t('planExecutiveCTA')}
                  </button>
                  <p className="mt-2 text-center text-[9px] text-white/20">{t('comingSoon')}</p>
                </div>

              </div>

              {/* NOTE BAS */}
              <div className="relative z-10 mt-8 text-center">
                <p className="text-[11px] text-white/25 leading-relaxed max-w-[700px] mx-auto">
                  {t('plansNote')}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
</div>
  )
}