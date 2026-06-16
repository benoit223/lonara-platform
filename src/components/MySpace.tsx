'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { supabase } from '../lib/supabase'
import EvolveSection from './EvolveSection'
import UnderstandSection from './UnderstandSection'
import OptimizeSection from './OptimizeSection'
import StateSection from './StateSection'

interface MySpaceProps {
  memberTier: 'guest' | 'member' | 'premium' | 'executive'
  fullName: string
  onBack: () => void
  onStartAssessment: () => void
  initialAssessment?: any | null
  initialHistory?: any[]
  onAssessmentLoaded?: (assessment: any) => void
}

type MenuItem = 'state' | 'understand' | 'optimize' | 'evolve' | 'connect'
type MenuItemOrNew = MenuItem | 'new'

function getGreeting(name: string, t: any): string {
  const hour = new Date().getHours()
  const firstName = name.split(' ')[0] || name
  if (hour >= 5 && hour < 12)  return `${t('greetingMorning')} ${firstName}`
  if (hour >= 12 && hour < 18) return `${t('greetingAfternoon')} ${firstName}`
  if (hour >= 18 && hour < 22) return `${t('greetingEvening')} ${firstName}`
  return `${t('greetingNight')} ${firstName}`
}

function getTierLabel(tier: string): string {
  if (tier === 'executive') return 'Executive'
  if (tier === 'premium')   return 'Premium'
  if (tier === 'member')    return 'Member'
  return ''
}

async function generatePhrase(name: string, tier: string, locale: string): Promise<string> {
  const firstName = name.split(' ')[0] || name
  const hour = new Date().getHours()
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'

  try {
    const response = await fetch('/api/generate-phrase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, tier, timeOfDay, locale }),
    })
    const data = await response.json()
    return data.phrase ?? ''
  } catch {
    return 'Every breath is a choice. Every day, a new architecture of life.'
  }
}

// ── Types Supabase ────────────────────────────────────────────────────────────
interface AssessmentScores {
  biological_age?: number
  longevity_score?: number
  recovery_index?: number
  stress_load?: number
  [key: string]: number | undefined
}

interface LastAssessment {
  id: number
  created_at: string
  scores: AssessmentScores | null
  protocols: Record<string, unknown> | null
  biomarkers: Record<string, unknown> | null
}

// ── CHAT SECTION ─────────────────────────────────────────────────────────────
function ChatSection({ lastAssessment, bgCharacter, messages, setMessages }: { 
  lastAssessment: LastAssessment | null
  bgCharacter: string
  messages: { role: string; content: string }[]
  setMessages: React.Dispatch<React.SetStateAction<{ role: string; content: string }[]>>
}) {
  const t = useTranslations('myspace')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [dailyCount, setDailyCount] = useState(0)
  const [limitReached, setLimitReached] = useState(false)
  const character = bgCharacter === 'enginea' ? 'enginea' : bgCharacter === 'gummy' ? 'gummy' : 'lona'

  const characterNames: Record<string, string> = {
    lona: 'Lona',
    enginea: 'EngineA',
    gummy: 'Gummy',
  }

  const placeholderKey = character === 'enginea' ? 'chatPlaceholderEngineA' : character === 'gummy' ? 'chatPlaceholderGummy' : 'chatPlaceholderLona'
  const greetKey = character === 'enginea' ? 'chatGreetEngineA' : character === 'gummy' ? 'chatGreetGummy' : 'chatGreetLona'

  const userContext = lastAssessment as any

  useEffect(() => {
    const checkLimit = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('chat_daily_count, chat_last_reset')
        .eq('id', user.id)
        .single()
      if (profile) {
        const today = new Date().toISOString().split('T')[0]
        if (profile.chat_last_reset !== today) {
          await supabase.from('profiles').update({ chat_daily_count: 0, chat_last_reset: today }).eq('id', user.id)
          setDailyCount(0)
          setLimitReached(false)
        } else {
          setDailyCount(profile.chat_daily_count ?? 0)
          setLimitReached((profile.chat_daily_count ?? 0) >= 100)
        }
      }
    }
    checkLimit()
  }, [])

 const sendMessage = async () => {
    if (!input.trim() || loading || limitReached) return
    if (loading) return
    const userMessage = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const response = await fetch('/api/chat-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character, messages: newMessages, userContext }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      const data = await response.json()
      const newCount = dailyCount + 2
      setDailyCount(newCount)
      if (newCount >= 100) setLimitReached(true)
      setMessages([...newMessages, { role: 'assistant', content: data.reply }])
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles')
          .update({ chat_daily_count: newCount, chat_last_reset: new Date().toISOString().split('T')[0] })
          .eq('id', user.id)
      }
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: '...' }])
    } finally {
      setLoading(false)
    }
  }

  return (
   <div className="flex flex-col h-[420px] rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-4 mt-2">
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 min-h-0">
      {limitReached && (
          <div className="rounded-[1rem] border border-[#C7AC60]/20 bg-[#C7AC60]/[0.05] px-4 py-3 text-center mt-4">
            <p className="text-[13px] italic text-[#C7AC60]/70">{t('chatLimitReached')}</p>
          </div>
        )}
        {messages.length === 0 && !limitReached && (
          <p className="text-[13px] italic text-white/25 text-center mt-8">{t(greetKey as any)}</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-[1rem] px-4 py-3 text-[13px] leading-[1.7] ${
              msg.role === 'user'
                ? 'bg-white/10 text-white/80'
                : 'bg-[#035AA8]/20 text-[#EAE4D5]/90 border border-[#035AA8]/30'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#035AA8]/20 border border-[#035AA8]/30 rounded-[1rem] px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#5C96D8]/60 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={t(placeholderKey as any)}
          className="flex-1 rounded-full border border-[#035AA8]/40 bg-[#035AA8]/20 px-5 py-3 text-[13px] text-white placeholder:text-white/40 backdrop-blur-xl focus:outline-none focus:border-[#C7AC60]/50"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim() || limitReached}
          className="rounded-full border border-[#C7AC60]/30 bg-[#C7AC60]/10 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[#C7AC60] transition hover:bg-[#C7AC60]/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('chatSend')}
        </button>
      </div>
    </div>
  )
}

// ── SECTION CONTENT ───────────────────────────────────────────────────────────
function SectionContent({
  active,
  memberTier,
  lastAssessment,
  onStartAssessment,
  bgCharacter,
  assessmentHistory,
  chronoAge,
  chatMessages,
  setChatMessages,
}: {
  active: MenuItem
  memberTier: string
  lastAssessment: LastAssessment | null
  onStartAssessment: () => void
  bgCharacter: string
  assessmentHistory: any[]
  chronoAge: number | null
  chatMessages: { role: string; content: string }[]
  setChatMessages: React.Dispatch<React.SetStateAction<{ role: string; content: string }[]>>
  isMobile?: boolean
}) {
  const t = useTranslations('myspace')
  const locale = useLocale()

  const lastReportDate = lastAssessment
    ? new Date(lastAssessment.created_at).toLocaleDateString(
        locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : null

  const protocols = lastAssessment?.protocols as Record<string, string[]> | null

  const content: Record<MenuItem, { eyebrow: string; title: string; description: string; extra?: React.ReactNode }> = {
   state: {
  eyebrow: t('stateEyebrow'),
  title: t('stateTitle'),
  description: t('stateDesc'),
  extra: <StateSection lastAssessment={lastAssessment} chronoAge={chronoAge} />,
},
    understand: {
      eyebrow: t('understandEyebrow'),
      title: t('understandTitle'),
      description: t('understandDesc'),
     extra: <UnderstandSection assessmentHistory={assessmentHistory} />,
    },
   optimize: {
      eyebrow: t('optimizeEyebrow'),
      title: t('optimizeTitle'),
      description: t('optimizeDesc'),
      extra: <OptimizeSection lastAssessment={lastAssessment} />,
    },
   evolve: {
  eyebrow: t('evolveEyebrow'),
  title: t('evolveTitle'),
  description: t('evolveDesc'),
  extra: <EvolveSection assessmentHistory={assessmentHistory} lastAssessment={lastAssessment} />,
},
    connect: {
      eyebrow: t('connectEyebrow'),
      title: bgCharacter === 'enginea' ? 'EngineA' : bgCharacter === 'gummy' ? 'Gummy' : 'Lona',
      description: t('connectDesc'),
      extra: <ChatSection lastAssessment={lastAssessment} bgCharacter={bgCharacter} messages={chatMessages} setMessages={setChatMessages} />,
    },
  }

  const { eyebrow, title, description, extra } = content[active]

  return (
    <div>
      {active === 'connect' ? (
        <>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#0A3566] mb-3">{eyebrow}</p>
          <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {title}
          </h2>
          <p className="mt-3 text-[14px] leading-[1.9] text-white/45 max-w-[800px]">{description}</p>
          {extra}
        </>
      ) : (
        <>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#0A3566] mb-3">{eyebrow}</p>
          <h2 className="text-[3rem] lg:text-[3.6rem] font-light leading-none text-[#EAE4D5]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {title}
          </h2>
          <p className="mt-3 text-[14px] leading-[1.9] text-white/45 max-w-[800px]">{description}</p>
          {extra}
         
        </>
      )}
    </div>
  )
}

// ── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────

type BgCharacter = 'lona' | 'enginea' | 'gummy'

const BG_CHARACTERS: { id: BgCharacter; label: string; file: string }[] = [
  { id: 'lona',    label: 'Lona',    file: '/lona.png'     },
  { id: 'enginea', label: 'EngineA', file: '/enginea.png'  },
  { id: 'gummy',   label: 'Gummy',   file: '/gummy.png'    },
]

export default function MySpace({
  memberTier,
  fullName,
  onBack,
  onStartAssessment,
  initialAssessment = null,
  initialHistory = [],
  onAssessmentLoaded,
}: MySpaceProps) {


  const [activeSection, setActiveSection] = useState<MenuItem | null>(null)
  const [phrase, setPhrase] = useState<string>('')
  const [phraseLoading, setPhraseLoading] = useState<boolean>(true)
  const [bgCharacter, setBgCharacter] = useState<BgCharacter>('lona')
  const [bgFading, setBgFading] = useState<boolean>(false)
  const [lastAssessment, setLastAssessment] = useState<LastAssessment | null>(initialAssessment)
  const [localFullName, setLocalFullName] = useState<string>(fullName)
  const [localTier, setLocalTier] = useState<string>(memberTier)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [chronoAge, setChronoAge] = useState<number | null>(initialAssessment?.age ?? null)
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>(initialHistory)
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([])

 const t = useTranslations('myspace')
const tLegal = useTranslations()
const locale = useLocale()

  const MENU_ITEMS: { id: MenuItem; label: string }[] = [
    { id: 'state',      label: t('menuState')      },
    { id: 'understand', label: t('menuUnderstand') },
    { id: 'optimize',   label: t('menuOptimize')   },
    { id: 'evolve',     label: t('menuEvolve')     },
    { id: 'connect',    label: t('menuConnect')    },
  ]

  const [scoreCards, setScoreCards] = useState(() => {
    if (initialAssessment) {
      const a = initialAssessment
      return [
        { label: t('cardBioAge'),    value: a.biological_age  != null ? String(Math.round(a.biological_age))  : '—', unit: 'yrs'  },
        { label: t('cardLongevity'), value: a.longevity_score != null ? String(Math.round(a.longevity_score)) : '—', unit: '/100' },
        { label: t('cardRecovery'),  value: a.recovery_index  != null ? String(Math.round(a.recovery_index))  : '—', unit: '%'    },
        { label: t('cardStress'),    value: a.stress_load     != null ? String(Math.round(a.stress_load))     : '—', unit: '/100' },
      ]
    }
    return [
      { label: t('cardBioAge'),   value: '—', unit: 'yrs'  },
      { label: t('cardLongevity'), value: '—', unit: '/100' },
      { label: t('cardRecovery'),  value: '—', unit: '%'    },
      { label: t('cardStress'),    value: '—', unit: '/100' },
    ]
  })

  const greeting = getGreeting(localFullName || fullName, t)
  const greetingBase = greeting.replace(/,.*/, ',')
  const greetingName = greeting.replace(/.*,\s*/, '')
  const getTimeOfDay = () => {
  const h = new Date().getHours()
  const m = new Date().getMinutes()
  if (h >= 5 && h < 10) return 'matin'
  if (h >= 10 && h < 17) return 'jour'
  if (h >= 17 && (h < 21 || (h === 21 && m < 30))) return 'soir'
  return 'nuit'
}

const currentBg = `/${bgCharacter}${getTimeOfDay()}.png`
const isNight = getTimeOfDay() === 'nuit'



  

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 8000)

    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user ?? null
        if (!user) {
          setIsLoading(false)
          return
        }

        // Refresh l'email si absent dans la session cachée
        const email = user.email ?? (await supabase.auth.getUser()).data.user?.email ?? ''

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, member_tier, bg_character')
        .eq('id', user.id)
        .single()
      

      if (profile) {
        if (profile.full_name) setLocalFullName(profile.full_name)
        if (profile.member_tier) setLocalTier(profile.member_tier)
        if (profile.bg_character) setBgCharacter(profile.bg_character as BgCharacter)
      }

     const { data: assessment } = await supabase
  .from('assessments')
  .select('id, created_at, scores, protocols, biomarkers, biological_age, longevity_score, recovery_index, stress_load, age, pillar_activate, pillar_balance, pillar_protect, pillar_restore')
  .eq('email', email)
  .order('created_at', { ascending: false })
  .limit(1)
  .maybeSingle()

  
const { data: allAssessments } = await supabase
  .from('assessments')
  .select('id, created_at, biological_age, longevity_score, recovery_index, stress_load, age, pdf_url, pillar_activate, pillar_balance, pillar_protect, pillar_restore')
  .eq('email', email)
  .order('created_at', { ascending: true })

if (allAssessments) setAssessmentHistory(allAssessments)

      if (assessment) {
        setLastAssessment(assessment as LastAssessment)
        const a = assessment as any
        if (a.age) setChronoAge(a.age)
        setScoreCards([
          { label: t('cardBioAge'),    value: a.biological_age  != null ? String(Math.round(a.biological_age))  : '—', unit: 'yrs'  },
          { label: t('cardLongevity'), value: a.longevity_score != null ? String(Math.round(a.longevity_score)) : '—', unit: '/100' },
          { label: t('cardRecovery'),  value: a.recovery_index  != null ? String(Math.round(a.recovery_index))  : '—', unit: '%'    },
          { label: t('cardStress'),    value: a.stress_load     != null ? String(Math.round(a.stress_load))     : '—', unit: '/100' },
        ])
      }

      await supabase
        .from('profiles')
        .update({ myspace_last_visited: new Date().toISOString() })
        .eq('id', user.id)

      } catch (e) {
        console.error('MySpace load error:', e)
      } finally {
        clearTimeout(timeout)
        setIsLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    setPhraseLoading(true)
    generatePhrase(localFullName || fullName || 'Explorer', localTier || memberTier, locale).then((p) => {
      setPhrase(p)
      setPhraseLoading(false)
    })
  }, [localFullName, localTier])

  const handleBgChange = async (id: BgCharacter) => {
    if (id === bgCharacter) return
    setBgFading(true)
    setTimeout(() => {
      setBgCharacter(id)
      setBgFading(false)
    }, 300)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ bg_character: id }).eq('id', user.id)
    }
  }

const getDotColor = (num: number | null, idx: number) => {
    if (num === null) return 'bg-white/20'
    if (idx === 0 && chronoAge !== null) {
      if (num < chronoAge - 2) return 'bg-[#4ADE80]'
      if (num <= chronoAge + 2) return 'bg-[#E7C980]'
      return 'bg-[#FF4444]'
    }
    if (num >= 70) return 'bg-[#4ADE80]'
    if (num >= 45) return 'bg-[#E7C980]'
    return 'bg-[#FF4444]'
  }

  const sectionContentProps = {
    memberTier: localTier || memberTier,
    lastAssessment,
    onStartAssessment,
    bgCharacter,
    assessmentHistory,
    chronoAge,
    chatMessages,
    setChatMessages,
  }

  if (isLoading) return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#040B14] text-white">
      <div className="relative flex flex-col items-center gap-8">
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[#035AA8]/15 blur-[80px]" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <img src="/LOGOOFFICIELTRANSP.png" alt="Lonara" className="h-16 w-auto opacity-80" />
          <p className="text-[11px] uppercase tracking-[0.38em] text-[#C7AC60]/70">{t('loadingLabel')}</p>
          <h2 className="text-[2.2rem] font-extralight text-[#EAE4D5]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {t('loadingTitle')}
          </h2>
          <p className="text-[14px] text-[#EAE4D5]/40 max-w-[400px] text-center leading-relaxed">
            {t('loadingDesc')}
          </p>
          <div className="flex gap-3 mt-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#C7AC60]/60 animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <section
      className="fixed inset-0 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('${currentBg}')`, transition: 'background-image 0s' }}
    >
      {bgFading && (
        <div className="absolute inset-0 bg-[#02040A]/60 z-30 transition-opacity duration-300" />
      )}
      <div className="absolute inset-0 bg-[#02040A]/15" />

      {/* ── NAVBAR ── */}
      <div className="hidden md:block relative z-40 mx-auto mt-4 max-w-[1850px] bg-transparent px-4 md:px-6 lg:px-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <img src={isNight ? "/LOGOOFFICIELTRANSP.png" : "/LOGOOFFICIELTRANSPNOIR.png"} alt="Lonara"
              className="ml-0 mt-3 h-24 md:h-32 lg:h-40 w-auto opacity-95 object-contain" />
          </div>
          <div className="mr-4 md:mr-8 lg:mr-12 flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-1 py-1 backdrop-blur-xl">
              {BG_CHARACTERS.map((char) => (
                <button key={char.id} onClick={() => handleBgChange(char.id)}
                  className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em] transition-all duration-200 ${
                    bgCharacter === char.id ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/65'
                  }`}>
                  {char.label}
                </button>
              ))}
            </div>
            <span className="text-[11px] md:text-[13px] uppercase tracking-[0.18em] text-white/52">
              {t('dashboard')} — {localFullName ? localFullName.split(' ')[0] : fullName ? fullName.split(' ')[0] : 'My Space'}
            </span>
            <button onClick={onBack}
              className="flex items-center gap-2 text-white/35 hover:text-white/70 transition-all text-[11px] md:text-[13px] uppercase tracking-[0.18em]">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t('back')}</span>
            </button>
          </div>
        </div>
        <div className="flex md:hidden justify-end mt-[-34px] mr-4">
          <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-1 py-1 backdrop-blur-xl">
            {BG_CHARACTERS.map((char) => (
              <button key={char.id} onClick={() => handleBgChange(char.id)}
                className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em] transition-all duration-200 ${
                  bgCharacter === char.id ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/65'
                }`}>
                {char.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BLOC GAUCHE ── */}
      <div className="hidden md:flex relative z-20 mx-auto max-w-[1850px] min-h-screen items-stretch pointer-events-none">
        <div className="relative flex w-full max-w-[760px] flex-col justify-center px-8 lg:pl-0 lg:pr-16 items-start pointer-events-auto">
          <div className="absolute left-[-200px] top-[180px] h-[480px] w-[480px] rounded-full bg-cyan-400/[0.018] blur-[120px]" />
          <div className="absolute left-[240px] bottom-[120px] h-[320px] w-[320px] rounded-full bg-cyan-300/[0.015] blur-[90px]" />
          <div className="relative ml-0 max-w-[490px] -mt-16 lg:-mt-70 rounded-[32px] lg:rounded-[36px] border border-white/6 bg-black/24 px-10 lg:px-12 py-8 backdrop-blur-[14px] shadow-[0_0_80px_rgba(0,0,0,0.45)] overflow-hidden h-[484px] lg:h-[524px]">
            <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
            <p className={`mb-6 text-[13px] uppercase tracking-[0.28em] ${isNight ? 'text-[#C7AC60]/70' : 'text-black/70'}`}
              style={{ fontFamily: 'Inter, sans-serif' }}>
              {t('badge')}
            </p>
            <h1 className="max-w-[760px] leading-[1.02] tracking-[0.01em]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        <div className={`text-[48px] lg:text-[58px] font-light leading-[1.05] ${isNight ? 'text-white/80' : 'text-black/80'}`}>
  {greetingBase.replace(',', '')} <span className={`italic ${isNight ? 'text-white/90' : 'text-black/90'}`}>{greetingName}</span>
</div>
            </h1>
            <div className="mt-4 max-w-[385px] min-h-[44px]">
              {phraseLoading ? (
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-black/10 animate-pulse" />
                  <div className="h-2 w-3/4 rounded-full bg-black/8 animate-pulse" />
                </div>
              ) : (
                <p className={`text-[16px] lg:text-[17px] font-[450] leading-[1.75] tracking-[0.01em] italic ${isNight ? 'text-white/55' : 'text-black/55'}`}
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {phrase}
                </p>
              )}
            </div>
            <div className="mt-5 h-px bg-gradient-to-r from-black/15 to-transparent" />
            <nav className="mt-4 flex flex-col">
              {([...MENU_ITEMS, { id: 'new' as MenuItemOrNew, label: t('newAssessment') }] as { id: MenuItemOrNew; label: string }[]).map((item) => {
                const isActive = item.id !== 'new' && activeSection === item.id
                return (
                  <button key={item.id}
                    onClick={() => item.id === 'new' ? onStartAssessment() : setActiveSection(prev => prev === item.id ? null : item.id as MenuItem)}
                    className={`group relative flex items-center gap-4 rounded-[0.8rem] px-4 py-1 text-left transition-all duration-200 ${
                      isActive ? 'bg-black/8 border border-black/10' : 'border border-transparent hover:bg-black/[0.04]'
                    }`}>
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-[#C7AC60]" />}
                    <span className={`text-[12px] uppercase tracking-[0.24em] transition-all ${
                      isActive
                        ? isNight ? 'text-[#C7AC60] font-medium' : 'text-black font-medium'
                        : isNight ? 'text-white/40 group-hover:text-white/65' : 'text-black/40 group-hover:text-black/65'
                    }`}>
                      {item.label}
                    </span>
                    {isActive && <ChevronRight className="ml-auto h-3 w-3 text-black/25" />}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* ── CONTENU SECTION — droite ── */}
      <div className="hidden md:flex absolute left-[520px] lg:left-[600px] top-0 right-0 bottom-[140px] items-start z-30 px-10 lg:px-16 pt-[120px]">
  <div className="w-full max-w-[960px] min-w-0 overflow-hidden">
         {activeSection && <SectionContent
  active={activeSection}
  memberTier={localTier || memberTier}
  lastAssessment={lastAssessment}
  onStartAssessment={onStartAssessment}
  bgCharacter={bgCharacter}
  assessmentHistory={assessmentHistory}
  chronoAge={chronoAge}
  chatMessages={chatMessages}
  setChatMessages={setChatMessages}
/>}
        </div>
      </div>

      {/* ── 4 CARDS EN BAS ── */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 z-20 px-8 pb-8">
        <div className="flex gap-3 max-w-[1400px] mx-auto">
       {scoreCards.map((card, idx) => {
  const num = card.value !== '—' ? Number(card.value) : null
  let dotColor = 'bg-white/20'
  if (num !== null) {
    if (idx === 0 && chronoAge !== null) {
      if (num < chronoAge - 2) dotColor = 'bg-[#4ADE80]'
      else if (num <= chronoAge + 2) dotColor = 'bg-[#E7C980]'
      else dotColor = 'bg-[#FF4444]'
    } else if (idx > 0) {
      if (num >= 70) dotColor = 'bg-[#4ADE80]'
      else if (num >= 45) dotColor = 'bg-[#E7C980]'
      else dotColor = 'bg-[#FF4444]'
    }
  }
  return (
    <div key={card.label} className="flex-1 rounded-[1rem] border border-white/10 bg-black/20 backdrop-blur-xl px-5 py-2">
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-0.5">{card.label}</p>
      <div className="flex items-end justify-between">
        <div className="flex items-end gap-1">
          <span className="text-[2rem] font-light text-[#EAE4D5]/40"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {card.value}
          </span>
          <span className="text-[11px] text-white/25 mb-1">{card.unit}</span>
        </div>
        <div className={`w-2 h-2 rounded-full mb-2 ${dotColor}`} />
      </div>
    </div>
  )
})}
        </div>
      </div>
{/* ══════════════════════════════════════
          MOBILE — même structure que Hero
      ══════════════════════════════════════ */}
      <div className="md:hidden flex flex-col h-full">

        {/* NAVBAR MOBILE — même que Hero */}
        <div className="relative z-40 mx-auto mt-4 flex w-full items-center justify-between bg-transparent px-4">
          <img src={isNight ? "/LOGOOFFICIELTRANSP.png" : "/LOGOOFFICIELTRANSPNOIR.png"} alt="Lonara"
            className="ml-0 mt-3 h-24 w-auto opacity-95 object-contain" />
          <div className="flex items-center gap-3 mr-4">
            {/* Sélecteur personnage compact */}
            <div className="flex items-center gap-0.5 rounded-full border border-white/15 bg-white/[0.06] px-1 py-1 backdrop-blur-xl">
              {BG_CHARACTERS.map((char) => (
                <button key={char.id} onClick={() => handleBgChange(char.id)}
                  className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] transition-all duration-200 ${bgCharacter === char.id ? 'bg-white/20 text-white' : 'text-white/40'}`}>
                  {char.label}
                </button>
              ))}
            </div>
            <button onClick={onBack} className="text-white/40 hover:text-white/70">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* CARD PRINCIPALE MOBILE — même style que Hero */}
        <div className="absolute z-20 left-0 right-0 flex justify-center px-4"
          style={{ top: '130px', bottom: '120px' }}>
          <div className="flex flex-col w-full max-w-[340px] gap-3">

            {/* Card greeting — même style glassmorphique que Hero */}
            <div className="relative w-full rounded-[20px] border border-white/6 bg-black/24 px-5 py-4 backdrop-blur-[14px] shadow-[0_0_80px_rgba(0,0,0,0.45)]">
              <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
              <p className={`mb-2 text-[9px] uppercase tracking-[0.22em] ${isNight ? 'text-[#C7AC60]/70' : 'text-black/60'}`} style={{ fontFamily: 'Inter, sans-serif' }}>{t('badge')}</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <span className={`text-[32px] font-light leading-[1.05] ${isNight ? 'text-white/80' : 'text-black/80'}`}>
                  {greetingBase.replace(',', '')} <span className={`italic ${isNight ? 'text-white/90' : 'text-black/90'}`}>{greetingName}</span>
                </span>
              </h1>
              {phraseLoading ? (
                <div className="mt-2 space-y-1.5">
                  <div className="h-1.5 w-full rounded-full bg-black/10 animate-pulse" />
                  <div className="h-1.5 w-3/4 rounded-full bg-black/8 animate-pulse" />
                </div>
              ) : (
                <p className={`mt-2 text-[13px] font-light leading-[1.7] italic ${isNight ? 'text-white/55' : 'text-black/55'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>{phrase}</p>
              )}

              {/* Séparateur */}
              <div className="mt-4 h-px bg-gradient-to-r from-black/15 to-transparent" />

              {/* Menu vertical dans la card — même style que Hero */}
              <nav className="mt-3 flex flex-col">
                {([...MENU_ITEMS, { id: 'new' as MenuItemOrNew, label: t('newAssessment') }] as { id: MenuItemOrNew; label: string }[]).map((item) => {
                  const isActive = item.id !== 'new' && activeSection === item.id
                  return (
                    <button key={item.id}
                      onClick={() => item.id === 'new' ? onStartAssessment() : setActiveSection(prev => prev === item.id ? null : item.id as MenuItem)}
                      className={`group relative flex items-center gap-3 rounded-[0.8rem] px-3 py-1.5 text-left transition-all ${isActive ? 'bg-black/8 border border-black/10' : 'border border-transparent'}`}>
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-[#C7AC60]" />}
                      <span className={`text-[11px] uppercase tracking-[0.24em] ${
                        isActive
                          ? isNight ? 'text-[#C7AC60] font-medium' : 'text-black font-medium'
                          : isNight ? 'text-white/40' : 'text-black/40'
                      }`}>{item.label}</span>
                      {isActive && <ChevronRight className="ml-auto h-3 w-3 text-black/25" />}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* 4 métriques — 2x2 compact */}
            <div className="grid grid-cols-2 gap-2">
              {scoreCards.map((card, idx) => {
                const num = card.value !== '—' ? Number(card.value) : null
                const dotColor = getDotColor(num, idx)
                return (
                  <div key={card.label} className="rounded-[0.9rem] border border-white/10 bg-black/20 backdrop-blur-xl px-4 py-2.5">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-white/40 mb-0.5">{card.label}</p>
                    <div className="flex items-end justify-between">
                      <div className="flex items-end gap-0.5">
                        <span className="text-[1.4rem] font-light text-[#EAE4D5]/50" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{card.value}</span>
                        <span className="text-[9px] text-white/25 mb-0.5">{card.unit}</span>
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full mb-1 ${dotColor}`} />
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </div>

        {/* SECTION CONTENT MOBILE — overlay pleine largeur */}
        {activeSection && (
          <div className="absolute inset-0 z-50 bg-cover bg-center" style={{ backgroundImage: `url('${currentBg}')` }}>
            <div className="absolute inset-0 bg-[#02040A]/40" />
            <div className="relative z-10 flex flex-col h-full overflow-y-auto">
              {/* Header section */}
              <div className="flex items-center justify-between px-4 pt-6 pb-3 shrink-0">
                <button onClick={() => setActiveSection(null)}
                  className="flex items-center gap-2 text-white/50 text-[11px] uppercase tracking-[0.18em]">
                  <ArrowLeft className="h-4 w-4" />
                  {t('back')}
                </button>
                <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-1 py-1 backdrop-blur-xl">
                  {BG_CHARACTERS.map((char) => (
                    <button key={char.id} onClick={() => handleBgChange(char.id)}
                      className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] transition-all duration-200 ${bgCharacter === char.id ? 'bg-white/20 text-white' : 'text-white/40'}`}>
                      {char.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Contenu */}
              <div className="px-4 pb-8 flex-1">
                <SectionContent
                  active={activeSection}
                  {...sectionContentProps}
                  isMobile={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* COPYRIGHT MOBILE */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <p className="text-[9px] font-thin uppercase tracking-[0.24em] whitespace-nowrap text-white/30" style={{ fontFamily: 'Inter, sans-serif' }}>
            {tLegal('legal.copyright')}
          </p>
        </div>

      </div>
    </section>
  )
}