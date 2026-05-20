'use client'

import { useEffect, useState } from 'react'

import {
  FlaskConical,
  ShieldCheck,
  LineChart,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react'

import LegalNotice from './LegalNotice'
import PrivacyPolicy from './PrivacyPolicy'

interface HeroProps {
  onStart: (name: string, email: string) => void
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  subtitle: string
}

function FeatureCard({
  icon,
  title,
  subtitle,
}: FeatureCardProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border border-[#C7AC60]/18 bg-[rgba(12,18,32,0.55)] backdrop-blur-[20px]">
        <div className="absolute inset-0 rounded-full shadow-[0_0_45px_rgba(199,172,96,0.10)]" />

        <div className="absolute h-[54px] w-[54px] rounded-full border border-[#E7D19A]/12" />

        {icon}
      </div>

      <div className="w-[145px]">
        <p className="text-[12px] font-light uppercase tracking-[0.16em] text-[#EAE4D5] whitespace-nowrap">
          {title}
        </p>

        <p className="mt-[4px] text-[12px] leading-[1.25] text-[#EAE4D5]/55">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

function BackgroundParticles() {
  return (
    <>
      <div className="absolute left-[12%] top-[22%] h-2 w-2 rounded-full bg-cyan-200/80 blur-[2px] animate-pulseGlow" />

      <div className="absolute left-[32%] top-[14%] h-1 w-1 rounded-full bg-cyan-200/40 blur-[1px] animate-pulseGlow" />

      <div className="absolute left-[72%] top-[26%] h-2 w-2 rounded-full bg-cyan-300/40 blur-[2px] animate-pulseGlow" />

      <div className="absolute left-[82%] top-[54%] h-1 w-1 rounded-full bg-cyan-200/40 blur-[1px] animate-pulseGlow" />

      <div className="absolute left-[18%] top-[74%] h-2 w-2 rounded-full bg-cyan-300/40 blur-[2px] animate-pulseGlow" />

      <div className="absolute left-[55%] top-[84%] h-[3px] w-[3px] rounded-full bg-cyan-200/60 blur-[1px] animate-pulseGlow" />

      <div className="absolute left-[64%] top-[10%] h-[4px] w-[4px] rounded-full bg-cyan-200/80 blur-[1px] animate-pulseGlow" />
    </>
  )
}

function Navbar({ onStart }: HeroProps) {
  return (
    <div className="relative z-40 mx-auto mt-4 flex max-w-[1850px] items-center justify-between bg-transparent">
      <div className="flex items-center gap-5">
        <img
          src="/LOGOOFFICIELTRANSP.png"
          alt="Lonara"
         className="ml-0 mt-3 h-40 w-auto opacity-95 object-contain"
        />

        <div>

         
        </div>
      </div>

      <div className="hidden xl:flex absolute right-[420px] items-center gap-10 text-[12px] uppercase tracking-[0.18em] text-white/52">
        <a className="transition-all hover:text-[#C7AC60] cursor-pointer">
          Platform
        </a>

        <a className="transition-all hover:text-[#C7AC60] cursor-pointer">
          Reports
        </a>

        <a className="transition-all hover:text-[#C7AC60] cursor-pointer">
          Science
        </a>
      </div>
<a
  href="https://www.lonaralabs.com"
  target="_blank"
  rel="noopener noreferrer"
  className="group relative overflow-hidden rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/5 px-10 py-3 text-sm uppercase tracking-[0.14em] text-[#C7AC60] backdrop-blur-xl transition-all hover:bg-[#C7AC60]/10 hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
>

  <div className="absolute top-0 left-[18%] h-[1px] w-[64%] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />

  <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />

  <span className="relative z-10 flex items-center gap-2">
    VISIT LONARA LABS

    <ArrowUpRight className="h-4 w-4 opacity-70 transition-transform duration-300 group-hover:-translate-y-[1px] group-hover:translate-x-[1px]" />
  </span>

</a>
    </div>
  )
}

export default function Hero({ onStart }: HeroProps) {
  const [cellularHealth, setCellularHealth] = useState(92)

useEffect(() => {
  const interval = setInterval(() => {
    setCellularHealth(91 + Math.random() * 2)
  }, 2400)

  return () => clearInterval(interval)
}, [])

  const [mitochondrialFunction, setMitochondrialFunction] = useState(87)

useEffect(() => {
  const interval = setInterval(() => {
    setMitochondrialFunction(86 + Math.random() * 2)
  }, 2800)

  return () => clearInterval(interval)
}, [])

const [showLegal, setShowLegal] =
  useState(false)
const [showPrivacy, setShowPrivacy] =
  useState(false)

const [dnaIntegrity, setDnaIntegrity] = useState(98.2)

const [neuralRecovery, setNeuralRecovery] = useState(91.7)

useEffect(() => {
  const interval = setInterval(() => {
    setDnaIntegrity(97.8 + Math.random() * 1.2)

    setNeuralRecovery(91 + Math.random() * 1.4)
  }, 3200)

  return () => clearInterval(interval)
}, [])

  return (
    <section
    
      className="relative min-h-screen overflow-hidden bg-black bg-cover bg-center"
      style={{
        backgroundImage: "url('/hero_premium.png')",
      }}
    >
   
   
   <div className="absolute bottom-[8%] right-[6%] z-30 flex items-center gap-4">
  <FeatureCard
    icon={
      <FlaskConical
        className="relative z-10 h-[26px] w-[26px] text-[#D6BA72]"
        strokeWidth={1.5}
      />
    }
    title="Science Backed"
    subtitle="Evidence-based models"
  />

  <div className="h-[48px] w-px bg-[#C7AC60]/10" />

  <FeatureCard
    icon={
      <ShieldCheck
        className="relative z-10 h-[26px] w-[26px] text-[#D6BA72]"
        strokeWidth={1.5}
      />
    }
    title="Private & Secure"
    subtitle="Your data is protected"
  />

  <div className="h-[48px] w-px bg-[#C7AC60]/10" />

  <FeatureCard
    icon={
      <LineChart
        className="relative z-10 h-[26px] w-[26px] text-[#D6BA72]"
        strokeWidth={1.5}
      />
    }
    title="Core Insights"
    subtitle="Clear steps, real impact"
  />
</div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      
      

   <div className="absolute left-[54%] top-[20%] h-[420px] w-[420px] rounded-full bg-[#1A2A44]/30 blur-[160px] animate-slowPulse" />

<div className="absolute right-[12%] bottom-[16%] h-[260px] w-[260px] rounded-full bg-[#C7AC60]/10 blur-[140px] animate-floatSlow" />

      <Navbar onStart={onStart} />
<div className="absolute right-[8%] top-[38%] z-20 h-[240px] w-[340px] overflow-hidden rounded-[28px] border border-[#035AA8]/20 bg-black/10 backdrop-blur-[20px] shadow-[0_0_80px_rgba(3,90,168,0.12)]">

  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent)]" />

  <div className="absolute left-6 top-5 flex items-center gap-2">
    <div className="h-2 w-2 rounded-full bg-[#035AA8] animate-pulse" />

    <p className="text-[10px] uppercase tracking-[0.28em] text-[#EAE4D5]/40">
      LIVE BIOLOGICAL ANALYSIS
    </p>
  </div>

  <div className="absolute left-6 top-14 space-y-3 font-mono text-[13px] text-[#6E8BC7]/85">

    <div className="animate-pulse">
      DNA Integrity ............ {dnaIntegrity.toFixed(1)}%
    </div>

    <div className="animate-pulse">
      Neural Recovery .......... {neuralRecovery.toFixed(1)}%
    </div>

    <div className="animate-pulse">
      Oxidative Stress ......... LOW
    </div>

    <div className="animate-pulse">
      Cellular Respiration ..... ACTIVE
    </div>

    <div className="animate-pulse">
      Mitochondrial Flux ....... 87.4%
    </div>

  </div>

  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#035AA8]/30" />

  <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-[linear-gradient(to_bottom,transparent,rgba(3,90,168,0.08),transparent)] animate-scanMove" />

</div>
<div className="absolute right-[18%] top-[18%] z-20 opacity-60 animate-floatSlow backdrop-blur-[18px]">
  <div className="rounded-[22px] border border-[#035AA8]/20 bg-black/20 px-8 py-6 backdrop-blur-[10px]">
    <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">
      Cellular Health
    </p>

    <p className="mt-3 text-[52px] font-extralight text-[#6E8BC7]">
     {cellularHealth.toFixed(1)}%
    </p>

    <div className="mt-5 flex gap-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="w-[2px] animate-floatSlow bg-[#035AA8]/60"
          style={{
            height: `${10 + (i % 4) * 10}px`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  </div>
</div>



<div className="absolute right-[28%] top-[30%] z-20 text-[#6E8BC7]/55 animate-floatSlowDelay3">
  <p className="text-[11px] uppercase tracking-[0.28em] text-white/20">
    Mitochondrial Function
  </p>

  <p className="mt-3 text-[46px] font-extralight">
    {mitochondrialFunction.toFixed(1)}%
  </p>
</div>

<div className="absolute left-[58%] bottom-[18%] z-20 grid grid-cols-10 gap-2 opacity-40 animate-floatSlowDelay1">
  {Array.from({ length: 50 }).map((_, i) => (
    <div
      key={i}
      className="h-[4px] w-[4px] rounded-full bg-[#035AA8] animate-pulseGlow"
      style={{
        animationDelay: `${i * 0.03}s`,
      }}
    />
  ))}
</div>



      <div className="relative z-20 mx-auto flex max-w-[1850px] min-h-screen">
       
<img
  src="/lonara-logo.png"
  alt=""
  className="pointer-events-none absolute right-[-140px] top-1/2 z-0 w-[980px] -translate-y-1/2 select-none opacity-[0.08] blur-[0.5px]"
/>


        <div className="relative flex w-full max-w-[760px] flex-col justify-center pr-16">
          <div className="absolute left-[-200px] top-[180px] h-[480px] w-[480px] rounded-full bg-cyan-400/[0.018] blur-[120px]" />

          <div className="absolute left-[240px] bottom-[120px] h-[320px] w-[320px] rounded-full bg-cyan-300/[0.015] blur-[90px]" />

     
<div className="-mt-30 ml-0 inline-block max-w-[491px] rounded-[36px] border border-white/6 bg-black/24 px-12 py-12 backdrop-blur-[14px] shadow-[0_0_80px_rgba(0,0,0,0.45)]">

  <p
    className="mb-6 text-[13px] uppercase tracking-[0.28em] text-[#C7AC60]/80"
    style={{
      fontFamily: 'Inter, sans-serif',
    }}
  >
    high-Precision biological profiling
  </p>

  <h1
    className="max-w-[760px] leading-[1.02] tracking-[0.01em]"
    style={{
      fontFamily: "'Cormorant Garamond', serif",
    }}
  >
    {/* LIGNE 1 */}
    <div className="text-[64px] font-light text-[#EAE4D5]">
      Decode your
    </div>

    {/* LIGNE 2 */}
    <div className="text-[64px] italic font-light text-[#C7AC60] drop-shadow-[0_0_30px_rgba(199,172,96,0.18)]">
      biology.
    </div>

    {/* LIGNE 3 */}
    <div className="mt-1 text-[64px] font-light text-[#EAE4D5]">
      Reveal your
    </div>

    {/* LIGNE 4 */}
    <div className="text-[64px] italic font-light text-[#C7AC60] drop-shadow-[0_0_30px_rgba(199,172,96,0.18)]">
      essence.
    </div>
  </h1>

  <p className="mt-8 max-w-[385px] text-[17px] font-light leading-[1.85] tracking-[0.01em] text-white/48">
  The most advanced science in service
of the most refined ritual. Your cellular
transformation begins with precision,
longevity, and elevated human performance.
  </p>

  <div className="mt-14 flex items-center gap-6">
<button
  onClick={() => onStart('', '')}
  className="group relative overflow-hidden rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/5 px-10 py-4 text-lg tracking-[0.08em] text-[#C7AC60] backdrop-blur-xl transition-all hover:bg-[#C7AC60]/10 hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
>

  <div className="absolute top-0 left-[18%] w-[64%] h-[1px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />

  <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />

  <span className="relative z-10">
    Start Biological Assessment
  </span>

  <span className="relative z-10 ml-4 inline-block transition-transform group-hover:translate-x-1">
    <ArrowRight />
  </span>

</button>
  </div>

</div>
          

        <div className="absolute bottom-[8%] left-0 flex items-center gap-5">
            <div className="flex -space-x-3">
              <div className="h-12 w-12 rounded-full border border-white/10 bg-white/20" />

              <div className="h-12 w-12 rounded-full border border-white/10 bg-white/20" />

              <div className="h-12 w-12 rounded-full border border-white/10 bg-white/20" />

              <div className="h-12 w-12 rounded-full border border-white/10 bg-white/20" />
            </div>

            <p className="text-sm uppercase tracking-[0.08em] text-[#EAE4D5]">
              Join 1,250+ optimizing their biology
            </p>
          </div>
        </div>

   
 
      </div>

  {/* LEGAL */}
<div className="absolute bottom-5 left-0 z-50 w-full px-10 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/38">

  <div className="flex items-center gap-6">

   <button
  onClick={() => setShowLegal(true)}
  className="transition-all hover:text-[#C7AC60]/70"
>
  Legal Notice
</button>

    <div className="h-[10px] w-px bg-white/10" />

<button
  onClick={() => setShowPrivacy(true)}
  className="transition-all hover:text-[#C7AC60]/70"
>
  Privacy Policy
</button>

  </div>
<p
  className="absolute left-1/2 -translate-x-1/2 text-[11px] font-thin uppercase tracking-[0.28em]"
  style={{
    fontFamily: 'Inter, sans-serif',
  }}
>
  © 2026 — All rights reserved — LONARA LABS
</p>

</div>
{showLegal && (
  <LegalNotice
    onClose={() =>
      setShowLegal(false)
    }
  />
)}


{showPrivacy && (
  <PrivacyPolicy
    onClose={() =>
      setShowPrivacy(false)
    }
  />
)}
    </section>
  )
}
