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

  setError(
    t('errorEmail'),
  )

  return
}

if (
  entryMode !== 'signin' &&
  (
    !firstName ||
    !lastName
  )
) {

  setError(
    t('errorName'),
  )

  return
}
 

              setError('')

if (
  entryMode === 'signup'
) {

  if (
    !password ||
    !confirmPassword
  ) {

    setError(
      t('errorPassword'),
    )

    return
  }

  if (
    password !== confirmPassword
  ) {

    setError(
      t('errorPasswordMatch'),
    )

    return
  }

  if (password.length < 8) {

    setError(
      t('errorPasswordLength'),
    )

    return
  }

}

if (
  entryMode === 'guest'
) {

 const { error: profileError } =
  await supabase
    .from('profiles')
    .insert({
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`,
      email,
      access_mode: 'guest',
      account_status: 'guest',
      subscription_status: 'none',
      subscription_plan: 'free',
    })

if (profileError) {

  setError(
    profileError.message,
  )

  return
}

}

if (
  entryMode !== 'guest'
) {

  if (
    entryMode === 'signup'
  ) {

    const {
      data,
      error: signupError,
    } =
      await supabase.auth.signUp({
        email,
        password,
      })

   if (signupError?.message) {

  setError(
    signupError.message,
  )

  return
}

  if (data?.user) {

  await supabase
    .from('profiles')
    .insert({

      id: data.user.id,

      first_name: firstName,

      last_name: lastName,

      full_name: `${firstName} ${lastName}`,

      email,

          access_mode:
  'registered',

        })

// Si email non confirmé, afficher message et stopper
  if (!data.user.confirmed_at) {
    setError(t('checkYourEmail'))
    return
 }
    }

  } else {

    const {
      error: signinError,
    } =
      await supabase.auth.signInWithPassword({
      
        email,
        password,
      })

   if (signinError?.message) {

  setError(
    signinError.message,
  )

  return
}

  }

}

onStart(
  entryMode === 'guest'
    ? 'guest'
    : 'registered',
  `${firstName} ${lastName}`,
  email,
  password,
)

            }}
           className="group relative overflow-hidden mt-4 w-full rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/5 px-6 py-3 text-[13px] tracking-[0.06em] text-[#C7AC60] backdrop-blur-xl transition-all hover:bg-[#C7AC60]/10 hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
          >
            {/* TOP LIGHT LINE */}
<div className="absolute top-0 left-[18%] w-[64%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />

{/* INNER GLOW */}
<div className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />
            <span className="relative z-10">
  {
    entryMode === 'guest'
      ? t('startAssessment')
      : entryMode === 'signup'
      ? t('createAndContinue')
      : t('signInAndContinue')
  }
</span>
          </button>
</div>
        </div>
      </div>
          </div>
    </div>
  )
}