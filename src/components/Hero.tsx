'use client'

import { useEffect, useState } from 'react'

import {
  Atom,
  Shield,
  Sparkles,
  ArrowUpRight,
  Menu,
  X,
} from 'lucide-react'

import Science from '@/components/Science'
import LanguageToggle from '@/components/LanguageToggle'
import { useTranslations } from 'next-intl'
import LegalNotice from './LegalNotice'
import PrivacyPolicy from './PrivacyPolicy'
import TermsRefundPricing from './TermsRefundPricing'
import MySpaceModal from './MySpaceModal'
import { supabase } from '../lib/supabase'

interface HeroProps {
  onStart: () => void
  onReports: () => void
  onAbout: () => void
  onMySpace: () => void
  onFuel: () => void
  memberTier: 'guest' | 'member' | 'premium' | 'executive'
  hasFuelSprint: boolean
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  subtitle: string
}

function FeatureCard({ icon, title, subtitle }: FeatureCardProps) {
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <div className="flex h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] md:h-[28px] md:w-[28px] shrink-0 items-center justify-center">
        {icon}
      </div>
      <div className="w-[100px] sm:w-[115px] md:w-[130px] lg:w-[155px]">
        <p className="text-[8px] sm:text-[10px] md:text-[12px] font-light uppercase tracking-[0.08em] md:tracking-[0.16em] text-[#EAE4D5] whitespace-nowrap">
          {title}
        </p>
        <p className="mt-[2px] text-[7px] sm:text-[9px] md:text-[11px] leading-[1.25] text-[#EAE4D5]/55 whitespace-nowrap">
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

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
function Navbar({
  onStart,
  onAbout,
  onScience,
  onReports,
  onMySpace,
  onMySpaceClick,
  onFuel,
  onFuelClick,
  memberTier,
  hasFuelSprint,
}: HeroProps & {
  onScience: () => void
  onMySpaceClick: () => void
  onFuelClick: () => void
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = useTranslations()

  return (
    <>
      <div className="relative z-40 mx-auto mt-4 flex max-w-[1850px] items-center justify-between bg-transparent px-4 md:px-6 lg:px-0">
        <div className="flex items-center gap-5">
          <img
            src="/LOGOOFFICIELTRANSP.png"
            alt="Lonara"
            className="ml-0 mt-3 h-24 md:h-32 lg:h-40 w-auto opacity-95 object-contain"
          />
          <div></div>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex ml-auto mr-4 md:mr-8 lg:mr-12 items-center gap-4 md:gap-6 lg:gap-10 text-[13px] uppercase tracking-[0.18em] text-white/52">
          <LanguageToggle />

          <button
            onClick={onAbout}
            className="transition-all hover:text-[#C7AC60] cursor-pointer"
          >
            {t('nav.about')}
          </button>
          <button
            onClick={onReports}
            className="transition-all hover:text-[#C7AC60] cursor-pointer"
          >
            {t('nav.reports')}
          </button>
          <button
            onClick={onScience}
            className="transition-all hover:text-[#C7AC60] cursor-pointer"
          >
            {t('nav.science')}
          </button>
          <a
            href="https://www.lonaralabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all hover:text-[#C7AC60] cursor-pointer"
          >
            {t('nav.labs')}
          </a>

<button
  onClick={onFuelClick}
  className="relative group flex items-center gap-2 rounded-full border border-[#1D9E75]/25 bg-[#1D9E75]/5 px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-[#1D9E75]/80 backdrop-blur-xl transition-all hover:border-[#1D9E75]/45 hover:bg-[#1D9E75]/10 hover:text-[#5DCAA5]"
>
  <div className="absolute top-0 left-[18%] w-[64%] h-[1px] bg-gradient-to-r from-transparent via-[#5DCAA5]/60 to-transparent pointer-events-none" />
<span className={`h-1.5 w-1.5 rounded-full transition-colors ${
    hasFuelSprint
      ? 'bg-[#5DCAA5] animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_3px_rgba(93,202,165,0.7)]'
      : 'bg-[#1D9E75]/30'
  }`} />
  My Fuel
</button>

          {/* ── MY SPACE ── */}
          <button
            onClick={onMySpaceClick}
            className="relative group flex items-center gap-2 rounded-full border border-[#C7AC60]/25 bg-[#C7AC60]/5 px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-[#C7AC60]/80 backdrop-blur-xl transition-all hover:border-[#C7AC60]/45 hover:bg-[#C7AC60]/10 hover:text-[#E7D19A]"
          >
            {/* top line accent */}
            <div className="absolute top-0 left-[18%] w-[64%] h-[1px] bg-gradient-to-r from-transparent via-[#E7D19A]/60 to-transparent pointer-events-none" />
    <span className={`h-1.5 w-1.5 rounded-full transition-colors ${
          memberTier === 'premium' || memberTier === 'executive'
  ? 'bg-[#E7D19A] animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_3px_rgba(231,209,154,0.7)]'
  : 'bg-[#C7AC60]/50'
            }`} />
            {t('nav.myspace')}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto mr-4 text-white/60 hover:text-white transition-all"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 right-0 bg-black/20 backdrop-blur-xl border-b border-white/6 z-50 flex flex-col items-center gap-6 py-8 text-[13px] uppercase tracking-[0.18em] text-white/70">
          <button
            onClick={() => {
              onAbout()
              setMobileMenuOpen(false)
            }}
            className="hover:text-[#C7AC60] transition-all"
          >
            {t('nav.about')}
          </button>
          <button
            onClick={() => {
              onReports()
              setMobileMenuOpen(false)
            }}
            className="hover:text-[#C7AC60] transition-all"
          >
            {t('nav.reports')}
          </button>
          <button
            onClick={() => {
              onScience()
              setMobileMenuOpen(false)
            }}
            className="hover:text-[#C7AC60] transition-all"
          >
            {t('nav.science')}
          </button>
          <a
       href="https://www.lonaralabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#C7AC60] transition-all"
          >
            {t('nav.labs')}
          </a>

          {/* ── FUEL mobile ── */}
          <button
            onClick={() => {
              onFuelClick()
              setMobileMenuOpen(false)
            }}
            className="flex items-center gap-2 rounded-full border border-[#1D9E75]/25 bg-[#1D9E75]/5 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[#1D9E75]/80 transition-all hover:border-[#1D9E75]/45 hover:text-[#5DCAA5]"
          >
         <span className={`h-1.5 w-1.5 rounded-full transition-colors ${
    hasFuelSprint
      ? 'bg-[#5DCAA5] animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_3px_rgba(93,202,165,0.7)]'
      : 'bg-[#1D9E75]/30'
  }`} />
  My Fuel
</button>

          {/* ── MY SPACE mobile ── */}
          <button
            onClick={() => {
              onMySpaceClick()
              setMobileMenuOpen(false)
            }}
            className="flex items-center gap-2 rounded-full border border-[#C7AC60]/25 bg-[#C7AC60]/5 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[#C7AC60]/80 transition-all hover:border-[#C7AC60]/45 hover:text-[#E7D19A]"
          >
            <span className={`h-1.5 w-1.5 rounded-full transition-colors ${
 memberTier === 'premium' || memberTier === 'executive'
  ? 'bg-[#E7D19A] animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_3px_rgba(231,209,154,0.7)]'
  : 'bg-[#C7AC60]/50'
}`} />
            {t('nav.myspace')}
          </button>

          <LanguageToggle />
        </div>
      )}
    </>
  )
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
export default function Hero({ onStart, onReports, onAbout, onMySpace, onFuel, memberTier, hasFuelSprint }: HeroProps) {
  const [cellularHealth, setCellularHealth] = useState(92)
  useEffect(() => {
    const interval = setInterval(
      () => setCellularHealth(91 + Math.random() * 2),
      2400,
    )
    return () => clearInterval(interval)
  }, [])

  const [mitochondrialFunction, setMitochondrialFunction] = useState(87)
  useEffect(() => {
    const interval = setInterval(
      () => setMitochondrialFunction(86 + Math.random() * 2),
      2800,
    )
    return () => clearInterval(interval)
  }, [])

  const [showScience, setShowScience] = useState(false)
  const [showLegal, setShowLegal] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showMySpaceModal, setShowMySpaceModal] = useState(false)
  const [dnaIntegrity, setDnaIntegrity] = useState(98.2)
  const [neuralRecovery, setNeuralRecovery] = useState(91.7)
  const t = useTranslations()

  useEffect(() => {
    const interval = setInterval(() => {
      setDnaIntegrity(97.8 + Math.random() * 1.2)
      setNeuralRecovery(91 + Math.random() * 1.4)
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  // ── Logique My Space : session active → direct, sinon → modal login
  const handleMySpaceClick = () => {
  if (memberTier === 'guest') {
    setShowMySpaceModal(true)
  } else {
    onMySpace()
  }
}
  return (
    <section
      className="fixed inset-0 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/hero_premium.png')" }}
    >

      <div className="hidden md:block absolute bottom-[18%] sm:bottom-[8%] md:bottom-[6%] left-1/2 -translate-x-1/2 w-full max-w-[1850px] z-30">
        <div className="flex flex-row justify-center md:justify-end items-center gap-4 sm:gap-6 md:gap-3 lg:gap-4 px-4 md:mr-8 lg:mr-12">
          <FeatureCard
            icon={
              <Atom
                className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] md:h-[28px] md:w-[28px] text-[#EAE4D5]"
                strokeWidth={1.35}
              />
            }
            title={t('hero.scienceBacked')}
            subtitle={t('hero.scienceBackedSub')}
          />
          <div className="h-[32px] sm:h-[40px] md:h-[48px] w-px bg-[#EAE4D5]/10" />
          <FeatureCard
            icon={
              <Shield
                className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] md:h-[28px] md:w-[28px] text-[#EAE4D5]"
                strokeWidth={1.35}
              />
            }
            title={t('hero.privateSecure')}
            subtitle={t('hero.privateSecureSub')}
          />
          <div className="h-[32px] sm:h-[40px] md:h-[48px] w-px bg-[#EAE4D5]/10" />
          <FeatureCard
            icon={
              <Sparkles
                className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] md:h-[28px] md:w-[28px] text-[#EAE4D5]"
                strokeWidth={1.35}
              />
            }
            title={t('hero.coreInsights')}
            subtitle={t('hero.coreInsightsSub')}
          />
        </div>
      </div>

      <div className="absolute left-[54%] top-[20%] h-[420px] w-[420px] rounded-full bg-[#1A2A44]/30 blur-[160px] animate-slowPulse" />
      <div className="absolute right-[12%] bottom-[16%] h-[260px] w-[260px] rounded-full bg-[#C7AC60]/10 blur-[140px] animate-floatSlow" />

    <Navbar
  onStart={onStart}
  onAbout={onAbout}
  onReports={onReports}
  onScience={() => setShowScience(true)}
  onMySpace={onMySpace}
  onFuel={onFuel}
  onMySpaceClick={handleMySpaceClick}
  onFuelClick={() => {
  if (memberTier !== 'guest') onFuel()
}}
  memberTier={memberTier}
  hasFuelSprint={hasFuelSprint}
/>

      {/* Desktop CTA */}
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1850px] z-40 px-6 lg:px-0">
        <div className="flex justify-end md:mr-24 lg:mr-46">
          <button
            onClick={() => onStart()}
            className="group relative overflow-hidden rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/5 px-8 lg:px-10 py-3 md:py-4 text-base lg:text-lg tracking-[0.08em] text-[#C7AC60] backdrop-blur-xl transition-all hover:bg-[#C7AC60]/10 hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)] hover:shadow-[0_0_40px_rgba(199,172,96,0.18)]"
          >
            <div className="absolute top-0 left-[18%] w-[64%] h-[1px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
            <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />
            <span className="relative z-10 flex items-center gap-3 whitespace-nowrap">
              {t('hero.cta')}
              <ArrowUpRight className="relative z-10 ml-3 h-4 w-4 opacity-60 transition-transform duration-300 group-hover:-translate-y-[1px] group-hover:translate-x-[1px]" />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile card */}
      <div
        className="md:hidden absolute z-20 left-0 right-0 flex justify-center px-4"
        style={{ top: '96px', bottom: '140px' }}
      >
        <div className="flex items-center justify-center w-full">
          <div className="relative w-full max-w-[320px] rounded-[20px] border border-white/6 bg-black/24 px-5 py-4 backdrop-blur-[14px] shadow-[0_0_80px_rgba(0,0,0,0.45)]">
            <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
            <p
              className="mb-2 text-[9px] uppercase tracking-[0.22em] text-[#C7AC60]/80"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {t('hero.badge')}
            </p>
            <h1
              className="leading-[1.02] tracking-[0.01em]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <div className="text-[32px] font-light text-[#EAE4D5]">
                {t('hero.line1')}
              </div>
              <div className="text-[32px] italic font-light text-[#C7AC60] drop-shadow-[0_0_30px_rgba(199,172,96,0.18)]">
                {t('hero.line2')}
              </div>
              <div className="mt-0 text-[32px] font-light text-[#EAE4D5]">
                {t('hero.line3')}
              </div>
              <div className="text-[32px] italic font-light text-[#C7AC60] drop-shadow-[0_0_30px_rgba(199,172,96,0.18)]">
                {t('hero.line4')}
              </div>
            </h1>
            <p className="mt-2 text-[11px] font-light leading-[1.7] tracking-[0.01em] text-white/48">
              {t('hero.description')}
            </p>
            <div className="mt-4">
              <button
                onClick={() => onStart()}
                className="group relative overflow-hidden rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/5 px-5 py-2.5 text-[12px] tracking-[0.08em] text-[#C7AC60] backdrop-blur-xl transition-all hover:bg-[#C7AC60]/10 hover:text-[#E7D19A] shadow-[0_0_25px_rgba(199,172,96,0.10)]"
              >
                <div className="absolute top-0 left-[18%] w-[64%] h-[1px] blur-[0.3px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(199,172,96,0.08)] pointer-events-none" />
                <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                  {t('hero.cta')}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex relative z-20 mx-auto max-w-[1850px] min-h-screen items-stretch">
        <img
          src="/lonara-logo.png"
          alt=""
          className="pointer-events-none absolute right-[-100px] lg:right-[-140px] top-1/2 z-0 w-[720px] lg:w-[980px] -translate-y-1/2 select-none opacity-[0.08] blur-[0.5px]"
        />
        <div className="relative flex w-full max-w-[760px] flex-col justify-center px-8 lg:pl-0 lg:pr-16 items-start">
          <div className="absolute left-[-200px] top-[180px] h-[480px] w-[480px] rounded-full bg-cyan-400/[0.018] blur-[120px]" />
          <div className="absolute left-[240px] bottom-[120px] h-[320px] w-[320px] rounded-full bg-cyan-300/[0.015] blur-[90px]" />
          <div className="relative ml-0 max-w-[490px] -mt-16 lg:-mt-70 rounded-[32px] lg:rounded-[36px] border border-white/6 bg-black/24 px-10 lg:px-12 py-8 backdrop-blur-[14px] shadow-[0_0_80px_rgba(0,0,0,0.45)]">
            <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
            <p
              className="mb-6 text-[13px] uppercase tracking-[0.28em] text-[#C7AC60]/80"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {t('hero.badge')}
            </p>
            <h1
              className="max-w-[760px] leading-[1.02] tracking-[0.01em]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <div className="text-[52px] lg:text-[64px] font-light text-[#EAE4D5]">
                {t('hero.line1')}
              </div>
              <div className="text-[52px] lg:text-[64px] italic font-light text-[#C7AC60] drop-shadow-[0_0_30px_rgba(199,172,96,0.18)]">
                {t('hero.line2')}
              </div>
              <div className="mt-1 text-[52px] lg:text-[64px] font-light text-[#EAE4D5]">
                {t('hero.line3')}
              </div>
              <div className="text-[52px] lg:text-[64px] italic font-light text-[#C7AC60] drop-shadow-[0_0_30px_rgba(199,172,96,0.18)]">
                {t('hero.line4')}
              </div>
            </h1>
            <p className="mt-6 max-w-[385px] text-[16px] lg:text-[17px] font-light leading-[1.85] tracking-[0.01em] text-white/48">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Legal footer */}
      <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[1850px] z-50 text-[11px] md:text-[13px] uppercase tracking-[0.18em] text-white/38">
        <div className="flex flex-col items-center gap-2 md:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLegal(true)}
              className="transition-all hover:text-[#C7AC60]/70"
            >
              {t('legal.legalNotice')}
            </button>
            <div className="h-[10px] w-px bg-white/10" />
            <button
              onClick={() => setShowPrivacy(true)}
              className="transition-all hover:text-[#C7AC60]/70"
            >
              {t('legal.privacyPolicy')}
            </button>
            <div className="h-[10px] w-px bg-white/10" />
            <button
              onClick={() => setShowTerms(true)}
              className="uppercase transition-all hover:text-[#C7AC60]/70"
            >
              {t('terms.label')}
            </button>
          </div>
          <p
            className="text-[9px] font-thin uppercase tracking-[0.24em] whitespace-nowrap"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {t('legal.copyright')}
          </p>
        </div>
        <div className="hidden md:block">
          <div className="ml-8 lg:ml-12 flex items-center gap-6">
            <button
              onClick={() => setShowLegal(true)}
              className="transition-all hover:text-[#C7AC60]/70"
            >
              {t('legal.legalNotice')}
            </button>
            <div className="h-[10px] w-px bg-white/10" />
            <button
              onClick={() => setShowPrivacy(true)}
              className="transition-all hover:text-[#C7AC60]/70"
            >
              {t('legal.privacyPolicy')}
            </button>
            <div className="h-[10px] w-px bg-white/10" />
            <button
              onClick={() => setShowTerms(true)}
              className="uppercase transition-all hover:text-[#C7AC60]/70"
            >
              {t('terms.label')}
            </button>

          </div>
          <p
            className="absolute left-1/2 -translate-x-1/2 bottom-[-30px] text-[11px] font-thin uppercase tracking-[0.28em] whitespace-nowrap"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {t('legal.copyright')}
          </p>
        </div>
      </div>

      {showLegal && <LegalNotice onClose={() => setShowLegal(false)} />}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      {showTerms && <TermsRefundPricing onClose={() => setShowTerms(false)} />}
      {showScience && <Science onClose={() => setShowScience(false)} />}

      {/* MY SPACE MODAL */}
      {showMySpaceModal && (
        <MySpaceModal
          onClose={() => setShowMySpaceModal(false)}
          onAccess={() => {
            setShowMySpaceModal(false)
            onMySpace()
          }}
        />
      )}

    </section>
  )
}