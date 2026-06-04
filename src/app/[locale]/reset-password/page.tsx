'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useRouter } from 'next/navigation'



export default function ResetPasswordPage() {

  const t = useTranslations('resetPassword')

  const [password, setPassword] =
    useState('')

  const [confirmPassword, setConfirmPassword] =
    useState('')

const router = useRouter()

useEffect(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      // session établie automatiquement via le token dans l'URL
    }
  })
}, [])

  const [message, setMessage] =
    useState('')

  async function updatePassword() {

    if (
      password !==
      confirmPassword
    ) {

      setMessage(
        t('errorMatch'),
      )

      return
    }

    if (
      password.length < 8
    ) {

      setMessage(
        t('errorLength'),
      )

      return
    }

    const { error } =
      await supabase.auth.updateUser({

        password,

      })

    if (error) {

      setMessage(
        error.message,
      )

      return
    }

   setMessage(
  t('successMessage'),
)

setTimeout(() => {

  router.push('/')

}, 2500)
  }

  return (
<div className="min-h-screen bg-[#040B14] overflow-hidden">

  <div className="absolute left-[-120px] top-[-120px] h-[260px] w-[260px] rounded-full bg-[#035AA8]/10 blur-[140px]" />

  <div className="absolute right-[-100px] bottom-[-100px] h-[240px] w-[240px] rounded-full bg-[#C7AC60]/10 blur-[140px]" />

  <div className="relative z-10 flex min-h-screen items-center justify-center px-4 md:px-6 py-10">

<div className="w-full max-w-[1100px] rounded-[1.2rem] md:rounded-[1.8rem] border border-[#035AA8]/14 bg-[rgba(3,10,20,0.58)] backdrop-blur-[20px] shadow-[0_0_50px_rgba(3,90,168,0.10)] overflow-hidden">

  <div className="grid md:grid-cols-2">

    {/* LEFT — caché sur mobile */}
    <div className="hidden md:block relative border-r border-white/5 p-10">

      <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/70">
        {t('accountRecovery')}
      </p>

      <h1
        className="mt-4 text-[48px] leading-[0.95] text-[#EAE4D5]"
        style={{
          fontFamily:
            "'Cormorant Garamond', serif",
        }}
      >
        {t('titleLine1')}
        <br />
        {t('titleLine2')}
      </h1>

      <p className="mt-6 max-w-[420px] text-[14px] leading-[1.9] text-white/48">
        {t('subtitle')}
      </p>

      <div className="mt-10 space-y-4 text-[13px] text-white/55">

        <div>✓ {t('perk1')}</div>

        <div>✓ {t('perk2')}</div>

        <div>✓ {t('perk3')}</div>

        <div>✓ {t('perk4')}</div>

      </div>

    </div>

    {/* RIGHT — formulaire */}
    <div className="p-6 md:p-10">

      <div className="mb-8 md:mb-10 flex justify-center">

        <Image
          src="/LOGOOFFICIELTRANSP.png"
          alt="Lonara"
          width={240}
          height={80}
          priority
          style={{
            width: 'auto',
            height: 'auto',
          }}
        />

      </div>

      <h2
        className="mb-6 text-center text-[28px] md:text-[32px] text-[#EAE4D5]"
        style={{
          fontFamily:
            "'Cormorant Garamond', serif",
        }}
      >
        {t('formTitle')}
      </h2>

      <input
        type="password"
        placeholder={t('newPasswordPlaceholder')}
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        className="mb-4 w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-white/[0.025] px-4 py-3 text-[13px] text-white placeholder:text-white/18 backdrop-blur-xl transition-all duration-300 focus:border-[#035AA8]/45 focus:outline-none"
      />

      <input
        type="password"
        placeholder={t('confirmPasswordPlaceholder')}
        value={confirmPassword}
        onChange={(e) =>
          setConfirmPassword(
            e.target.value,
          )
        }
        className="mb-4 w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-white/[0.025] px-4 py-3 text-[13px] text-white placeholder:text-white/18 backdrop-blur-xl transition-all duration-300 focus:border-[#035AA8]/45 focus:outline-none"
      />

      <button
        onClick={updatePassword}
        className="group relative overflow-hidden mt-4 w-full rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/5 px-6 py-3 text-[13px] tracking-[0.06em] text-[#C7AC60] backdrop-blur-xl transition-all hover:bg-[#C7AC60]/10 hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
      >
        {t('updateButton')}
      </button>

      {message && (

        <div className="mt-6 rounded-[0.9rem] border border-[#7FE29A]/20 bg-[#7FE29A]/10 px-4 py-3 text-center text-[13px] text-[#7FE29A]">

          {message}

        </div>

      )}

    </div>

  </div>

</div>

  </div>

</div>

  )
}