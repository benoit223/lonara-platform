// src/components/AssessmentForm.tsx

'use client'

import { useState } from 'react'

interface AssessmentFormProps {

onStart: (
  name: string,
  email: string,
  age: number,
  sex: string,
  height: number,
  weight: number,
) => void

  onClose: () => void
}

export default function AssessmentForm({

  onStart,
  onClose,

}: AssessmentFormProps) {

  const [name, setName] =
    useState<string>('')

  const [email, setEmail] =
    useState<string>('')

const [age, setAge] =
  useState<string>('')

const [sex, setSex] =
  useState<string>('')

const [height, setHeight] =
  useState<string>('')

const [weight, setWeight] =
  useState<string>('')

  const [unitSystem, setUnitSystem] =
  useState<'metric' | 'imperial'>(
    'metric',
  )

  const [error, setError] =
    useState<string>('')

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[3px] px-4 py-4">

      {/* CARD */}
      <div className="relative w-full max-w-[560px] rounded-[1.8rem] border border-[#035AA8]/14 bg-[rgba(3,10,20,0.68)] backdrop-blur-[20px] px-5 py-5 shadow-[0_0_50px_rgba(3,90,168,0.10)]">

        {/* GLOW */}
        <div className="absolute left-[-120px] top-[-120px] h-[180px] w-[180px] rounded-full bg-[#035AA8]/8 blur-[120px]" />

        <div className="absolute right-[-80px] bottom-[-80px] h-[140px] w-[140px] rounded-full bg-[#C7AC60]/8 blur-[100px]" />

        {/* CLOSE */}
       <button
  type="button"
  onClick={() => onClose()}
  className="absolute right-5 top-4 z-[100] text-xl text-white/40 transition-all hover:text-white cursor-pointer"
>
  ×
</button>

        {/* HEADER */}
        <div className="relative z-10 mb-6">

          <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#C7AC60]/85">
            BIOLOGICAL INTAKE
          </p>

         <h2
  className="mt-2 text-[24px] md:text-[28px] font-extralight leading-[1.05] tracking-[0.01em] text-[#EAE4D5]"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>

            Begin Your

            <span
  className="block text-[#C7AC60]"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 500,
  }}
>
              Longevity Assessment
            </span>

          </h2>

          <p className="mt-3 max-w-[420px] text-[12px] leading-[1.6] text-white/58">
            Advanced biological profiling designed to uncover actionable longevity insights tailored to your physiology and lifestyle.
          </p>

        </div>

        {/* FORM */}
        <div className="relative z-10 space-y-3">

          {/* FULL NAME */}
          <div>

            <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/72">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your full name"
className="w-full resize-none rounded-[0.9rem] border border-[#035AA8]/20 bg-white/[0.025] px-4 py-2.5 text-[13px] text-white placeholder:text-white/18 backdrop-blur-xl transition-all duration-300 focus:border-[#035AA8]/45 focus:outline-none focus:shadow-[0_0_25px_rgba(3,90,168,0.18)]"
            />

          </div>

          {/* EMAIL */}
          <div>

            <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/72">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
             className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-white/[0.025] px-4 py-2.5 text-[13px] text-white placeholder:text-white/18 backdrop-blur-xl transition-all duration-300 focus:border-[#035AA8]/45 focus:outline-none focus:shadow-[0_0_25px_rgba(3,90,168,0.18)]"
            />

          </div>

{/* BIOMETRICS */}

<div className="flex items-center justify-end gap-2 mb-1">

  <button
    type="button"
    onClick={() =>
      setUnitSystem('metric')
    }
    className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.18em] transition-all ${
      unitSystem === 'metric'
        ? 'bg-[#035AA8]/14 text-[#6E8BC7] border border-[#035AA8]/25'
        : 'text-white/35 border border-white/5'
    }`}
  >
    Metric
  </button>

  <button
    type="button"
    onClick={() =>
      setUnitSystem('imperial')
    }
    className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.18em] transition-all ${
      unitSystem === 'imperial'
        ? 'bg-[#035AA8]/14 text-[#6E8BC7] border border-[#035AA8]/25'
        : 'text-white/35 border border-white/5'
    }`}
  >
    Imperial
  </button>

</div>

<div className="grid grid-cols-2 gap-3">

  {/* AGE */}
  <div>

    <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/72">
      Age
    </label>

    <input
      type="number"
      min="18"
      max="100"
      value={age}
      onChange={(e) =>
        setAge(e.target.value)
      }
      placeholder="Age"
      className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-white/[0.025] px-4 py-2.5 text-[13px] text-white placeholder:text-white/18 backdrop-blur-xl transition-all duration-300 focus:border-[#035AA8]/45 focus:outline-none focus:shadow-[0_0_25px_rgba(3,90,168,0.18)]"
    />

  </div>

  {/* SEX */}
  <div>

    <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/72">
      Sex
    </label>

    <select
      value={sex}
      onChange={(e) =>
        setSex(e.target.value)
      }
    className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-white/[0.025] px-4 py-2.5 text-[13px] text-white placeholder:text-white/18 backdrop-blur-xl transition-all duration-300 focus:border-[#035AA8]/45 focus:outline-none focus:shadow-[0_0_25px_rgba(3,90,168,0.18)]"
    >
     <option value="" className="bg-[#0A1A28] text-[#EAE4D5]">
  Select
</option>

<option value="male" className="bg-[#0A1A28] text-[#EAE4D5]">
  Male
</option>

<option value="female" className="bg-[#0A1A28] text-[#EAE4D5]">
  Female
</option>
    </select>

  </div>

  {/* HEIGHT */}
  <div>

    <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/72">
      {unitSystem === 'metric'
  ? 'Height (cm)'
  : 'Height (ft/in)'}
    </label>

    <input
      type="number"
      value={height}
      onChange={(e) =>
        setHeight(e.target.value)
      }
      placeholder={
  unitSystem === 'metric'
    ? '178'
    : `5'10`
}
      className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-white/[0.025] px-4 py-2.5 text-[13px] text-white placeholder:text-white/18 backdrop-blur-xl transition-all duration-300 focus:border-[#035AA8]/45 focus:outline-none focus:shadow-[0_0_25px_rgba(3,90,168,0.18)]"
    />

  </div>

  {/* WEIGHT */}
  <div>

    <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/72">
      {unitSystem === 'metric'
  ? 'Weight (kg)'
  : 'Weight (lbs)'}
    </label>

    <input
      type="number"
      value={weight}
      onChange={(e) =>
        setWeight(e.target.value)
      }
      placeholder={
  unitSystem === 'metric'
    ? '72'
    : '165'
}
      className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-white/[0.025] px-4 py-2.5 text-[13px] text-white placeholder:text-white/18 backdrop-blur-xl transition-all duration-300 focus:border-[#035AA8]/45 focus:outline-none focus:shadow-[0_0_25px_rgba(3,90,168,0.18)]"
    />

  </div>

</div>

          {/* LONGEVITY GOAL */}
          <div>

            <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/72">
              Longevity Goal
            </label>

            <select
className="w-full rounded-[0.9rem] border border-[#035AA8]/20 bg-white/[0.025] px-4 py-2.5 text-[13px] text-white placeholder:text-white/18 backdrop-blur-xl transition-all duration-300 focus:border-[#035AA8]/45 focus:outline-none focus:shadow-[0_0_25px_rgba(3,90,168,0.18)]"
            >
         <option className="bg-[#0A1A28] text-[#EAE4D5]">
  Optimize energy
</option>

<option className="bg-[#0A1A28] text-[#EAE4D5]">
  Improve sleep
</option>

<option className="bg-[#0A1A28] text-[#EAE4D5]">
  Reduce stress
</option>

<option className="bg-[#0A1A28] text-[#EAE4D5]">
  Increase performance
</option>

<option className="bg-[#0A1A28] text-[#EAE4D5]">
  Healthy aging
</option>

<option className="bg-[#0A1A28] text-[#EAE4D5]">
  Longevity optimization
</option>

            </select>

          </div>

          {/* PRIORITY */}
          <div>

            <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-white/72">
              Current Health Priority
            </label>

            <textarea
              rows={3}
              placeholder="Describe your current goals, symptoms or health priorities"
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
            onClick={() => {

              if (
  !name ||
  !email ||
  !age ||
  !sex ||
  !height ||
  !weight
) {

                setError(
                  'Please complete all required biological intake fields before starting the assessment.',
                )

                return
              }

              setError('')

     const parsedHeight =
  unitSystem === 'metric'
    ? Number(height)
    : (() => {
        const match =
          height.match(
            /(\d+)'(\d+)/,
          )

        if (!match) return 0

        const feet =
          Number(match[1])

        const inches =
          Number(match[2])

        return Math.round(
          feet * 30.48 +
            inches * 2.54,
        )
      })()

const parsedWeight =
  unitSystem === 'metric'
    ? Number(weight)
    : Math.round(
        Number(weight) * 0.453592,
      )

onStart(
  name,
  email,
  Number(age),
  sex,
  parsedHeight,
  parsedWeight,
)

            }}
           className="group relative overflow-hidden mt-4 w-full rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/5 px-6 py-3 text-[13px] tracking-[0.06em] text-[#C7AC60] backdrop-blur-xl transition-all hover:bg-[#C7AC60]/10 hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
          >
            {/* TOP LIGHT LINE */}
<div className="absolute top-0 left-[18%] w-[64%] h-[2px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />

{/* INNER GLOW */}
<div className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />
            <span className="relative z-10">
  Start Biological Assessment
</span>
          </button>

        </div>
      </div>
    </div>
  )
}