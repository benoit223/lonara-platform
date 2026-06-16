'use client'

import { INTERVENTIONS_EN, FIXED_INTERVENTIONS_EN } from '@/lib/i18n/interventions_en'
import { INTERVENTIONS_FR, FIXED_INTERVENTIONS_FR } from '@/lib/i18n/interventions_fr'
import { INTERVENTIONS_ES, FIXED_INTERVENTIONS_ES } from '@/lib/i18n/interventions_es'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
  Moon,
  Sun,
  Sunset,
  BrainCircuit,
  Dna,
  Shield,
  Orbit,
  ShieldCheck,
  HeartPulse,
  ShieldAlert,
  Zap,
  Activity,
  Flame,
  Wind,
} from 'lucide-react'
import {
  SCORE_THRESHOLD_GOOD,
  SCORE_THRESHOLD_MODERATE,
  SCORE_THRESHOLD_LOW,
} from '@/lib/scoreThresholds'

function LiveScore({ value }: { value: number }) {
  const [decimal, setDecimal] = useState(Math.random() * 0.8)

  useEffect(() => {
    const interval = setInterval(() => {
      setDecimal((prev) => {
        const next = prev + (Math.random() - 0.5) * 0.08
        return Math.max(0.05, Math.min(0.95, next))
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return <span>{(Math.round(value) + decimal).toFixed(2)}</span>
}

function getInterventionsForWeaknesses(weaknesses: string[], dict: Record<string, string[]>): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const category of weaknesses.slice(0, 4)) {
    const list = dict[category] ?? []
    for (const item of list.slice(0, 8)) {
      if (!seen.has(item)) {
        seen.add(item)
        result.push(item)
      }
    }
  }

  return result
}



function getPersonalizedInterventions(
  weaknesses: string[],
  dict: Record<string, string[]>,
  excludeLabels: string[] = [],
  limit: number = 5,
): Array<{ label: string }> {
  const seen = new Set<string>(excludeLabels.map(l => l.toLowerCase()))
  const result: Array<{ label: string }> = []

  for (const category of weaknesses.slice(0, 4)) {
    const list = dict[category] ?? []
    for (const item of list) {
      if (!seen.has(item.toLowerCase())) {
        seen.add(item.toLowerCase())
        result.push({ label: item })
      }
      if (result.length >= limit) break
    }
    if (result.length >= limit) break
  }

  return result
}

// ── CONTENU DYNAMIQUE PAR PILIER DOMINANT ────────────────────────────────────

function getMorningProtocol(dominantPillar: string, weaknesses: string[], t: any, dict: Record<string, string[]>, fixed: Record<string, string>) {
 const tr = (label: string) => fixed[label] ?? label
  const protocols: Record<string, any> = {
    balance: {
      title: t('morning_balance_title'),
      objective: t('morning_balance_objective'),
      strategicFocus: t('morning_balance_focus'),
      systems: [
        {
          title: t('morning_balance_s1_title'),
          description: t('morning_balance_s1_desc'),
          interventions: [{ label: tr('Morning Sunlight 10-20 min') }, { label: tr('Consistent Wake Time') }, { label: tr('Avoid Screens First 30 min') }],
        },
        {
          title: t('morning_balance_s2_title'),
          description: t('morning_balance_s2_desc'),
          interventions: [{ label: tr('Box Breathing 4-7-8') }, { label: tr('Cold Shower 90s') }, { label: tr('HRV Check') }],
        },
        {
          title: t('morning_balance_s3_title'),
          description: t('morning_balance_s3_desc'),
          interventions: [{ label: tr('Protein-First Breakfast') }, { label: tr('Omega-3') }, { label: tr('Avoid High-Glycemic Foods') }, ...getPersonalizedInterventions(weaknesses, dict, [tr('Protein-First Breakfast'), tr('Omega-3'), tr('Avoid High-Glycemic Foods')], 4)],
        },
      ],
    },
    activate: {
      title: t('morning_activate_title'),
      objective: t('morning_activate_objective'),
      strategicFocus: t('morning_activate_focus'),
      systems: [
        {
          title: t('morning_activate_s1_title'),
          description: t('morning_activate_s1_desc'),
          interventions: [{ label: tr('Morning Movement 20-30 min' ) }, { label: tr('Zone 2 or HIIT' ) }, { label: tr('Creatine + CoQ10' ) }],
        },
        {
          title: t('morning_activate_s2_title'),
          description: t('morning_activate_s2_desc'),
          interventions: [{ label: tr("Lion's Mane" ) }, { label: tr('Caffeine + L-Theanine' ) }, { label: tr('Alpha-GPC' ) }],
        },
        {
          title: t('morning_activate_s3_title'),
          description: t('morning_activate_s3_desc'),
          interventions: [{ label: tr('Sunlight Exposure' ) }, { label: tr('Cold Shower' ) }, { label: tr('Meal Timing Optimization' ) }, ...getPersonalizedInterventions(weaknesses, dict, [tr('Sunlight Exposure'), tr('Cold Shower'), tr('Meal Timing Optimization')], 4)],
        },
      ],
    },
    protect: {
      title: t('morning_protect_title'),
      objective: t('morning_protect_objective'),
      strategicFocus: t('morning_protect_focus'),
      systems: [
        {
          title: t('morning_protect_s1_title'),
          description: t('morning_protect_s1_desc'),
          interventions: [{ label: tr('Omega-3 with Meal' ) }, { label: tr('Curcumin + Piperine' ) }, { label: tr('Vitamin D3 + K2' ) }],
        },
        {
          title: t('morning_protect_s2_title'),
          description: t('morning_protect_s2_desc'),
          interventions: [{ label: tr('Probiotics (Empty Stomach)' ) }, { label: tr('Prebiotic Fiber' ) }, { label: tr('L-Glutamine' ) }],
        },
        {
          title: t('morning_protect_s3_title'),
          description: t('morning_protect_s3_desc'),
          interventions: [{ label: tr('Cold Exposure 2-3 min' ) }, { label: tr('Sauna Protocol' ) }, { label: tr('Zone 2 Cardio' ) }, ...getPersonalizedInterventions(weaknesses, dict, [tr('Cold Exposure 2-3 min'), tr('Sauna Protocol'), tr('Zone 2 Cardio')], 4)],
        },
      ],
    },
    restore: {
      title: t('morning_restore_title'),
      objective: t('morning_restore_objective'),
      strategicFocus: t('morning_restore_focus'),
      systems: [
        {
          title: t('morning_restore_s1_title'),
          description: t('morning_restore_s1_desc'),
          interventions: [{ label: tr('HRV Measurement' ) }, { label: tr('Sleep Score Review' ) }, { label: tr('Subjective Readiness 1-10' ) }],
        },
        {
          title: t('morning_restore_s2_title'),
          description: t('morning_restore_s2_desc'),
          interventions: [{ label: tr('Collagen + Vitamin C' ) }, { label: tr('Protein Breakfast' ) }, { label: tr('Creatine' ) }],
        },
        {
          title: t('morning_restore_s3_title'),
          description: t('morning_restore_s3_desc'),
          interventions: [{ label: tr('Mobility Work 15 min' ) }, { label: tr('Walk in Nature' ) }, { label: tr('Stretching Protocol' ) }, ...getPersonalizedInterventions(weaknesses, dict, [tr('Mobility Work 15 min'), tr('Walk in Nature'), tr('Stretching Protocol')], 4)],
        },
      ],
    },
  }
  return protocols[dominantPillar] ?? protocols.balance
}

function getMiddayProtocol(dominantPillar: string, weaknesses: string[], t: any, dict: Record<string, string[]>, fixed: Record<string, string>)  {
 const tr = (label: string) => fixed[label] ?? label
  const protocols: Record<string, any> = {
    balance: {
      title: t('midday_balance_title'),
      objective: t('midday_balance_objective'),
      strategicFocus: t('midday_balance_focus'),
      systems: [
        {
          title: t('midday_balance_s1_title'),
          description: t('midday_balance_s1_desc'),
          interventions: [{ label: tr('Screen Break 10 min') }, { label: tr('Breathwork 4-7-8') }, { label: tr('Nature Walk if Possible') }],
        },
        {
          title: t('midday_balance_s2_title'),
          description: t('midday_balance_s2_desc'),
          interventions: [{ label: tr('Protein-First Lunch') }, { label: tr('Avoid High-Glycemic Foods') }, { label: tr('Magnesium with Meal') } ],
        },
        {
          title: t('midday_balance_s3_title'),
          description: t('midday_balance_s3_desc'),
          interventions: [{ label: tr('Ashwagandha') }, { label: tr('Rhodiola Rosea') }, { label: tr('L-Theanine') }, ...getPersonalizedInterventions(weaknesses, dict, [tr('Ashwagandha'), tr('Rhodiola Rosea'), tr('L-Theanine')], 4)],
        },
      ],
    },
    activate: {
      title: t('midday_activate_title'),
      objective: t('midday_activate_objective'),
      strategicFocus: t('midday_activate_focus'),
      systems: [
        {
          title: t('midday_activate_s1_title'),
          description: t('midday_activate_s1_desc'),
          interventions: [{ label: tr('Protein + Complex Carbs') }, { label: tr('CoQ10 Second Dose') }, { label: tr('Electrolytes') }],
        },
        {
          title: t('midday_activate_s2_title'),
          description: t('midday_activate_s2_desc'),
          interventions: [{ label: tr('Post-Lunch Walk') }, { label: tr('Light Resistance Movement') }, { label: tr('Sunlight Exposure') }],
        },
        {
          title: t('midday_activate_s3_title'),
          description: t('midday_activate_s3_desc'),
          interventions: [{ label: tr('Caffeine Cutoff by 2pm') }, { label: tr('L-Tyrosine') }, { label: tr('Hydration Check') }, ...getPersonalizedInterventions(weaknesses, dict, [tr('Caffeine Cutoff by 2pm'), tr('L-Tyrosine'), tr('Hydration Check')], 4)],
        },
      ],
    },
    protect: {
      title: t('midday_protect_title'),
      objective: t('midday_protect_objective'),
      strategicFocus: t('midday_protect_focus'),
      systems: [
        {
          title: t('midday_protect_s1_title'),
          description: t('midday_protect_s1_desc'),
          interventions: [{ label: tr('Omega-3 with Lunch') }, { label: tr('Polyphenol-Rich Foods') }, { label: tr('Avoid Processed Foods') }],
        },
        {
          title: t('midday_protect_s2_title'),
          description: t('midday_protect_s2_desc'),
          interventions: [{ label: tr('Fermented Foods') }, { label: tr('Prebiotic Fiber') }, { label: tr('Digestive Enzymes if Needed') }],
        },
        {
          title: t('midday_protect_s3_title'),
          description: t('midday_protect_s3_desc'),
          interventions: [{ label: tr('Vitamin C') }, { label: tr('Quercetin') }, { label: tr('Green Tea') }, ...getPersonalizedInterventions(weaknesses, dict, [tr('Vitamin C'), tr('Quercetin'), tr('Green Tea')], 4)],
        },
      ],
    },
    restore: {
      title: t('midday_restore_title'),
      objective: t('midday_restore_objective'),
      strategicFocus: t('midday_restore_focus'),
      systems: [
        {
          title: t('midday_restore_s1_title'),
          description: t('midday_restore_s1_desc'),
          interventions: [{ label: tr('Protein-Rich Lunch') }, { label: tr('Collagen Peptides') }, { label: tr('Anti-Inflammatory Fats') }],
        },
        {
          title: t('midday_restore_s2_title'),
          description: t('midday_restore_s2_desc'),
          interventions: [{ label: tr('NSDR / Yoga Nidra 10-20 min') }, { label: tr('Eyes Closed Rest') }, { label: tr('No Screens') }],
        },
        {
          title: t('midday_restore_s3_title'),
          description: t('midday_restore_s3_desc'),
          interventions: [{ label: tr('HRV Check') }, { label: tr('Adapt Afternoon Intensity') }, { label: tr('Magnesium if Needed') }, ...getPersonalizedInterventions(weaknesses, dict, [tr('HRV Check'), tr('Adapt Afternoon Intensity'), tr('Magnesium if Needed')], 4)],
        },
      ],
    },
  }
  return protocols[dominantPillar] ?? protocols.balance
}

function getEveningProtocol(dominantPillar: string, weaknesses: string[], t: any, dict: Record<string, string[]>, fixed: Record<string, string>) {
  const tr = (label: string) => fixed[label] ?? label
  const protocols: Record<string, any> = {
    balance: {
      title: t('evening_balance_title'),
      objective: t('evening_balance_objective'),
      strategicFocus: t('evening_balance_focus'),
      systems: [
        {
          title: t('evening_balance_s1_title'),
          description: t('evening_balance_s1_desc'),
          interventions: [{ label: tr('Digital Cutoff 2h Before Bed') }, { label: tr('Blue Light Glasses') }, { label: tr('Journaling 10 min') }],
        },
        {
          title: t('evening_balance_s2_title'),
          description: t('evening_balance_s2_desc'),
          interventions: [{ label: tr('Magnesium Glycinate') }, { label: tr('Apigenin') }, { label: tr('L-Theanine') }, { label: tr('Glycine') }],
        },
        {
          title: t('evening_balance_s3_title'),
          description: t('evening_balance_s3_desc'),
          interventions: [{ label: tr('Room Temperature 65-68°F') }, { label: tr('Complete Darkness') }, { label: tr('White Noise if Needed') }, ...getPersonalizedInterventions(weaknesses, dict, [tr('Room Temperature 65-68°F'), tr('Complete Darkness'), tr('White Noise if Needed')], 4)],
        },
      ],
    },
    restore: {
      title: t('evening_restore_title'),
      objective: t('evening_restore_objective'),
      strategicFocus: t('evening_restore_focus'),
      systems: [
        {
          title: t('evening_restore_s1_title'),
          description: t('evening_restore_s1_desc'),
          interventions: [{ label: tr('Collagen + Glycine') }, { label: tr('Magnesium Glycinate') }, { label: tr('Zinc + Copper') }, { label: tr('Apigenin') }],
        },
        {
          title: t('evening_restore_s2_title'),
          description: t('evening_restore_s2_desc'),
          interventions: [{ label: tr('Hot Bath/Sauna 90 min Before Bed') }, { label: tr('Cool Room') }, { label: tr('Avoid Vigorous Exercise After 7pm') }],
        },
        {
          title: t('evening_restore_s3_title'),
          description: t('evening_restore_s3_desc'),
          interventions: [{ label: tr('Reading (Non-Screen)') }, { label: tr('Gentle Stretching') }, { label: tr('4-7-8 Breathing') }, ...getPersonalizedInterventions(weaknesses, dict, [tr('Reading (Non-Screen)'), tr('Gentle Stretching'), tr('4-7-8 Breathing')], 4)],
        },
      ],
    },
    activate: {
      title: t('evening_activate_title'),
      objective: t('evening_activate_objective'),
      strategicFocus: t('evening_activate_focus'),
      systems: [
        {
          title: t('evening_activate_s1_title'),
          description: t('evening_activate_s1_desc'),
          interventions: [{ label: tr('Casein or Collagen Protein') }, { label: tr('Tart Cherry Extract') }, { label: tr('Magnesium') }],
        },
        {
          title: t('evening_activate_s2_title'),
          description: t('evening_activate_s2_desc'),
          interventions: [{ label: tr('Zinc + Magnesium (ZMA)') }, { label: tr('Ashwagandha') }, { label: tr('Sleep Timing Consistency') }],
        },
        {
          title: t('evening_activate_s3_title'),
          description: t('evening_activate_s3_desc'),
          interventions: [{ label: tr('Mental Decompression') }, { label: tr('No Stimulants After 2pm') }, { label: tr('L-Theanine') }, ...getPersonalizedInterventions(weaknesses, dict, [tr('Mental Decompression'), tr('No Stimulants After 2pm'), tr('L-Theanine')], 4)],
        },
      ],
    },
    protect: {
      title: t('evening_protect_title'),
      objective: t('evening_protect_objective'),
      strategicFocus: t('evening_protect_focus'),
      systems: [
        {
          title: t('evening_protect_s1_title'),
          description: t('evening_protect_s1_desc'),
          interventions: [{ label: tr('Eating Cutoff 3h Before Bed') }, { label: tr('No Late Snacking') }, { label: tr('Hydration Only') }],
        },
        {
          title: t('evening_protect_s2_title'),
          description: t('evening_protect_s2_desc'),
          interventions: [{ label: tr('Omega-3 with Dinner') }, { label: tr('Resveratrol') }, { label: tr('NAC') }, { label: tr('Quercetin') }],
        },
        {
          title: t('evening_protect_s3_title'),
          description: t('evening_protect_s3_desc'),
          interventions: [{ label: tr('Vitamin D3 + K2 with Dinner') }, { label: tr('Zinc') }, { label: tr('Elderberry') }, ...getPersonalizedInterventions(weaknesses, dict, [tr('Vitamin D3 + K2 with Dinner'), tr('Zinc'), tr('Elderberry')], 4)],
        },
      ],
    },
  }
  return protocols[dominantPillar] ?? protocols.balance
}

// ── MÉTRIQUES GRANULAIRES ─────────────────────────────────────────────────────

function getGranularMetrics(report: any) {
  const scores = report.scores ?? {}
  const weaknesses: string[] = report.weaknesses ?? []
  const strengths: string[] = report.strengths ?? []

  const criticalCats = weaknesses.slice(0, 2)
  const strongCats = strengths.slice(0, 2)
  const selectedCats = [...criticalCats, ...strongCats]

  const icons: Record<string, any> = {
    sleep:          <Moon className="h-[22px] w-[22px] text-[#EAE4D5]" strokeWidth={1.35} />,
    stress:         <Wind className="h-[22px] w-[22px] text-[#EAE4D5]" strokeWidth={1.35} />,
    energy:         <Zap className="h-[22px] w-[22px] text-[#EAE4D5]" strokeWidth={1.35} />,
    cognition:      <BrainCircuit className="h-[22px] w-[22px] text-[#EAE4D5]" strokeWidth={1.35} />,
    inflammation:   <Flame className="h-[22px] w-[22px] text-[#EAE4D5]" strokeWidth={1.35} />,
    cardiovascular: <HeartPulse className="h-[22px] w-[22px] text-[#EAE4D5]" strokeWidth={1.35} />,
    recovery:       <Activity className="h-[22px] w-[22px] text-[#EAE4D5]" strokeWidth={1.35} />,
    immune:         <Shield className="h-[22px] w-[22px] text-[#EAE4D5]" strokeWidth={1.35} />,
    longevity:      <Dna className="h-[22px] w-[22px] text-[#EAE4D5]" strokeWidth={1.35} />,
    resilience:     <ShieldCheck className="h-[22px] w-[22px] text-[#EAE4D5]" strokeWidth={1.35} />,
    hormonal:       <Orbit className="h-[22px] w-[22px] text-[#EAE4D5]" strokeWidth={1.35} />,
    gut:            <ShieldAlert className="h-[22px] w-[22px] text-[#EAE4D5]" strokeWidth={1.35} />,
  }

  const defaultIcon = <Activity className="h-[22px] w-[22px] text-[#EAE4D5]" strokeWidth={1.35} />

  return selectedCats.map((cat) => ({
    icon: icons[cat] ?? defaultIcon,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: scores[cat] ?? 50,
  }))
}

// ── ROADMAP DYNAMIQUE ─────────────────────────────────────────────────────────

function getRoadmapItems(report: any, t: any, tExec: any, interventions: Record<string, string[]>) {  const weaknesses: string[] = report.weaknesses ?? []
  const dominantPillar: string = report.dominantPillar ?? 'balance'
  const pillarScores = report.pillarScores ?? {}

 const allInterventions = getInterventionsForWeaknesses(weaknesses, interventions)
  const chunk = (arr: string[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size))

  const chunks = chunk(allInterventions, Math.ceil(allInterventions.length / 4))
const topWeaknesses = weaknesses.slice(0, 6)
const w0 = topWeaknesses[0] ?? 'stress'
const w1 = topWeaknesses[1] ?? 'sleep'
const w2 = topWeaknesses[2] ?? 'energy'
const w3 = topWeaknesses[3] ?? 'recovery'
const w4 = topWeaknesses[4] ?? 'inflammation'
const w5 = topWeaknesses[5] ?? 'longevity'

  const score = (cat: string) => {
    const s = report.scores?.[cat]
    return s !== undefined ? ` ${Math.round(s)}` : ''
  }

  const cap = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
  const label = (w: string) => tExec(`priority_${w}`)
  const pillarScore = pillarScores[dominantPillar] ?? 0


  
  return [
  {
  time: '30 DAYS',
  title: t('roadmap30title'),
  color: '#E7C980',
  image: '/aa.png',
 description: t('roadmap30desc', {
  pillar: label(dominantPillar),
  score: String(pillarScore),
  w0: label(w0), s0: score(w0),
  w1: label(w1), s1: score(w1),
}),
  metrics: [`${label(w0)} ${score(w0)} ↗`, `${label(w1)} ${score(w1)} ↗`, `${label(dominantPillar)} ↗`],
  systems: [`${label(dominantPillar)} ${t('stabilization')}`, `${label(w0)} ${t('recoveryLabel')}`, `${label(w1)} ${t('restoration')}`],
  interventions: (chunks[0] ?? []).map((i) => i),
  nextStep: `${t('unlocks')} ${label(w2)} & ${label(w3)} ${t('restoration')}`,
},
{
  time: '90 DAYS',
  title: t('roadmap90title'),
  color: '#0D96FF',
  image: '/ab.png',
  description: t('roadmap90desc', {
  w0: label(w0), w1: label(w1),
  w2: label(w2), s2: score(w2),
  w3: label(w3), s3: score(w3),
}),
  metrics: [`${label(w2)} ${score(w2)} ↗`, `${label(w3)} ${score(w3)} ↗`, `${t('bioAge')} ↘`],
  systems: [`${label(w2)} ${t('optimizationLabel')}`, `${label(w3)} ${t('enhancement')}`, t('hormonalBalance')],
  interventions: (chunks[1] ?? []).map((i) => i),
  nextStep: `${t('unlocks')} ${label(w4)} ${t('regulation')}`,
},
{
  time: '6 MONTHS',
  title: t('roadmap6title'),
  color: '#0D96FF',
  image: '/ac.png',
description: t('roadmap6desc', {
  w4: label(w4), s4: score(w4),
}),
  metrics: [`${label(w4)} ${score(w4)} ↘`, `${t('resilienceLabel')} ↗`, `${t('performanceLabel')} ↗`],
  systems: [`${label(w4)} ${t('regulation')}`, t('autonomicFlexibility'), t('recoverySync')],
  interventions: (chunks[2] ?? []).map((i) => i),
 nextStep: w5 !== 'longevity'
  ? `${t('unlocks')} ${label(w5)} & Longevity`
  : `${t('unlocks')} ${t('longevityProtocols')}`,
},
{
  time: '12 MONTHS',
  title: t('roadmap12title'),
  color: '#E7C980',
  image: '/ad.png',
 description: t('roadmap12desc', {
  pillar: label(dominantPillar),
  score: String(pillarScore),
  w5: label(w5), s5: score(w5),
}),
  metrics: [`${label(w5)} ${score(w5)} ↗`, w5 !== 'longevity' ? `${label('longevity')} ${score('longevity')} ↗` : `${t('vitality')} ↗`, `${t('bioAge')} ↘`],
  systems: [t('cellularResilience'), t('senolyticProtocols'), `${label(w5)} ${t('mastery')}`],
  interventions: (chunks[3] ?? []).map((i) => i),
  nextStep: t('foundationComplete'),
},
  ]
}

// ── COMPOSANT PRINCIPAL ───────────────────────────────────────────────────────

export default function OptimizationProtocolPage({ report, onMySpace }: { report: any; onMySpace?: () => void }) {

  const t = useTranslations('optimization')
const locale = useLocale()
const INTERVENTIONS_BY_CATEGORY = locale === 'fr' ? INTERVENTIONS_FR
  : locale === 'es' ? INTERVENTIONS_ES
  : INTERVENTIONS_EN
const FIXED_INTERVENTIONS = locale === 'fr' ? FIXED_INTERVENTIONS_FR
  : locale === 'es' ? FIXED_INTERVENTIONS_ES
  : FIXED_INTERVENTIONS_EN
  const tExec = useTranslations('executive')

  const scores = report.scores ?? {}
  const dominantPillar: string = report.dominantPillar ?? 'balance'
  const weaknesses: string[] = report.weaknesses ?? []
  const strengths: string[] = report.strengths ?? []
  const patternNarrative: string = report.aiProtocolIntro ?? report.patternNarrative ?? report.adaptivePhase?.focus ?? ''
  const aiSynthesis: string = report.aiSynthesis ?? report.synthesis ?? ''

  const isOptimalProfile = weaknesses.length === 0 &&
    Object.values(report.pillarScores ?? {}).every((s: any) => s >= 80)

  const granularMetrics = getGranularMetrics(report)
const morningProtocol = getMorningProtocol(dominantPillar, weaknesses, t, INTERVENTIONS_BY_CATEGORY, FIXED_INTERVENTIONS)
const middayProtocol = getMiddayProtocol(dominantPillar, weaknesses, t, INTERVENTIONS_BY_CATEGORY, FIXED_INTERVENTIONS)
const eveningProtocol = getEveningProtocol(dominantPillar, weaknesses, t, INTERVENTIONS_BY_CATEGORY, FIXED_INTERVENTIONS)
  const roadmapItems = getRoadmapItems(report, t, tExec, INTERVENTIONS_BY_CATEGORY)

  const protocolGroups = ['activate', 'balance', 'protect', 'restore', 'skin'].map((phase) => ({
    phase,
    products: report.protocolProducts?.filter((p: any) => p.protocol_phase === phase) || [],
  }))

  const lifestyleGroups = ['activate', 'balance', 'protect', 'restore', 'skin'].map((phase) => ({
    phase,
    products: report.lifestyleProducts?.filter((product: any) => {
      const linkedProtocol = report.protocolProducts?.find((p: any) => p.name === product.alternative_to)
      if (product.protocol_phase === phase) return true
      return linkedProtocol?.protocol_phase === phase
    }) || [],
  }))

  return (
    <section className="
      relative overflow-hidden rounded-[1.8rem] md:rounded-[2.7rem]
      border border-[#0E2238]/80 bg-[#02040A]/45
      backdrop-blur-3xl
      shadow-[0_0_2px_rgba(120,200,255,0.15),0_0_18px_rgba(3,90,168,0.10),0_0_60px_rgba(0,110,255,0.08),0_0_160px_rgba(0,80,255,0.04)]
    ">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(3,90,168,0.12),transparent_38%)]" />
      <div className="absolute top-[-120px] left-[-10%] w-[320px] h-[320px] rounded-full bg-[#035AA8]/10 blur-3xl opacity-40" />
      <div className="absolute bottom-[-140px] right-[-10%] w-[260px] h-[260px] rounded-full bg-[#035AA8]/10 blur-3xl opacity-40" />

      <div className="relative z-10 p-4 md:p-10">

        <div className="absolute inset-0 opacity-[0.1] bg-cover bg-center mix-blend-soft-light" style={{ backgroundImage: "url('/f3.png')" }} />

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-5">
          <img src="/LOGOOFFICIELTRANSP.png" alt="Lonara" className="h-24 md:h-30 w-auto opacity-95" />
          <div>
            <p className="text-[11px] md:text-[14px] uppercase tracking-[0.35em] text-[#C7AC60]/70 mb-2">{t('label')}</p>
            <h2 className="text-[2rem] md:text-[3rem] leading-[0.95] font-medium capitalize tracking-[0.04em] text-[#EAE4D5]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t('title')}
            </h2>
          </div>
          <div className="max-w-[460px] text-right ml-auto">
            <p className="hidden md:block text-sm leading-relaxed text-[#EAE4D5]/50">
              {t('description')}
            </p>
          </div>
        </div>

        {/* LONGEVITY INTELLIGENCE MATRIX */}
        <div className="relative overflow-hidden mb-10 rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] px-8 pt-6 pb-2 backdrop-blur-xl">
          <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />

          <div className="mt-0 flex flex-col lg:flex-row justify-between items-start min-h-[200px] gap-6">

            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">
                {t('matrix')}
              </p>
              <h3 className="mt-5 text-[34px] font-extralight text-[#EAE4D5]">
                {report.profileVector?.archetype?.name
                  ? `${report.profileVector.archetype.name.startsWith('archetype_') ? tExec(report.profileVector.archetype.name) : report.profileVector.archetype.name} — ${t('label')}`
                  : report.adaptivePhase?.phase
                  ?? `${dominantPillar.charAt(0).toUpperCase() + dominantPillar.slice(1)} Optimization Phase`}
              </h3>
              <p className="mt-6 max-w-[800px] text-sm leading-relaxed text-[#EAE4D5]/60">
                {report.aiProtocolIntro
                  ? report.aiProtocolIntro
                  : isOptimalProfile
                  ? t('optimalProfileMessage')
                  : report.patternNarrative ?? report.adaptivePhase?.focus ?? ''}
              </p>
            </div>

            {/* MÉTRIQUES GRANULAIRES */}
            <div className="hidden lg:block relative w-[620px] h-[300px] shrink-0 mr-[-140px] translate-y-[-0px] scale-[0.82] origin-right">

              <div className="absolute left-[-5px] top-[50%] -translate-y-1/2 z-[50] flex flex-col gap-3 w-[180px]">
                {granularMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {metric.icon}
                    <div>
                      <p className="text-[18px] font-light text-[#EAE4D5]">
                        <LiveScore value={metric.value} />
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#EAE4D5]/45">
                        {metric.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <img src="/cable2.png" alt="" className="absolute right-[-80px] top-[-140px] w-[600px] h-auto z-[1] object-contain opacity-90 scale-[0.80] saturate-[2.5] brightness-[1.0] contrast-[1.00] pointer-events-none select-none" />
              <img src="/gaugeb.png" alt="" className="absolute inset-0 w-full h-full z-[3] object-contain opacity-90 scale-[1.0] contrast-90 brightness-[1.4] saturate-[0.7] pointer-events-none select-none" />
              <div className="absolute inset-0 rounded-full bg-[#57C7FF]/10 blur-[120px] scale-[1.05] opacity-90" />
              <div className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(5,12,24,0.96) 0%, rgba(5,12,24,0.94) 18%, rgba(5,12,24,0.88) 36%, rgba(5,12,24,0.74) 52%, rgba(5,12,24,0.48) 68%, rgba(5,12,24,0.12) 84%, transparent 100%)', filter: 'blur(12px)' }} />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-[520px] h-[520px] rounded-full bg-[#69D6FF]/18 blur-[160px] opacity-75" />
                <div className="absolute w-[340px] h-[340px] rounded-full bg-[#FFD36B]/10 blur-[100px] opacity-55" />
                <div className="absolute w-[300px] h-[301px] z-[12] rounded-full border border-[#0D96FF]/12" />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-[330px] h-[240px] z-[2] rounded-full border border-[#0D96FF]/30" />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-[295px] h-[230px] z-[2] rounded-full border border-[#0D96FF]/30" />
                <motion.div animate={{ y: [0, -10, 0], scale: [1, 1.02, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-20">
                  <img src="/gaugea.png" alt="" className="relative z-20 w-[240px] h-[240px] object-contain scale-[1.25] translate-y-[20px] opacity-80 contrast-120 brightness-[1.0] saturate-[0.80] drop-shadow-[0_0_60px_rgba(120,210,255,0.28)] pointer-events-none select-none" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* MORNING / MIDDAY / EVENING */}
        {isOptimalProfile && (
          <div className="rounded-[20px] border border-[#7EE2A8]/20 bg-[#7EE2A8]/[0.04] px-6 py-3 mb-6 text-center">
            <p className="text-[#7EE2A8] text-sm">{t('optimalProfileMessage')}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mb-10">
          <ProtocolCard bgImage="/morning.png"
            icon={<Sun className="h-[28px] w-[28px] text-[#EAE4D5]" strokeWidth={1.35} />}
            period={t('morning')}
            title={morningProtocol.title}
            objective={morningProtocol.objective}
            systems={morningProtocol.systems}
            strategicFocus={morningProtocol.strategicFocus}
            strategicFocusLabel={t('strategicFocus')}
          />
          <ProtocolCard bgImage="/midday.png"
            icon={<Sunset className="h-[28px] w-[28px] text-[#EAE4D5]" strokeWidth={1.35} />}
            period={t('midday')}
            title={middayProtocol.title}
            objective={middayProtocol.objective}
            systems={middayProtocol.systems}
            strategicFocus={middayProtocol.strategicFocus}
            strategicFocusLabel={t('strategicFocus')}
          />
          <ProtocolCard bgImage="/evening.png"
            icon={<Moon className="h-[28px] w-[28px] text-[#EAE4D5]" strokeWidth={1.35} />}
            period={t('evening')}
            title={eveningProtocol.title}
            objective={eveningProtocol.objective}
            systems={eveningProtocol.systems}
            strategicFocus={eveningProtocol.strategicFocus}
            strategicFocusLabel={t('strategicFocus')}
          />
        </div>
        

        {/* LONGEVITY ROADMAP */}
        <div className="relative overflow-hidden rounded-[32px] mt-10 border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-8 backdrop-blur-xl">
          <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(3,90,168,0.16),transparent_60%)] pointer-events-none" />
          <div className="absolute top-[-120px] left-[-8%] w-[300px] h-[300px] rounded-full bg-[#C7AC60]/10 blur-[140px] opacity-60" />
          <div className="absolute bottom-[-160px] right-[-8%] w-[380px] h-[380px] rounded-full bg-[#4D7EA8]/10 blur-[140px] opacity-60" />

          <div className="relative z-10">
            <p className="text-[11px] uppercase tracking-[0.38em] text-[#C7AC60]/70">{t('roadmap')}</p>
            <h2 className="mt-5 text-[38px] leading-[0.92] font-extralight tracking-[-0.04em] text-[#F5EFE5]">
              {t('roadmapTitle')}
            </h2>
            <p className="mt-8 text-[17px] leading-[2] text-[#EAE4D5]/58">
              {t('roadmapIntro', { pillar: dominantPillar })}
            </p>

            {/* CINEMATIC TIMELINE */}
            <div className="relative mt-14 min-h-[560px]">
              <div className="absolute left-[-8%] right-[-8%] top-[-20px] h-[320px] z-[1] pointer-events-none overflow-hidden">
                <img src="/cable1.png" alt="" className="w-full h-full object-fill opacity-90 saturate-[1.4]" />
              </div>

              <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-2 items-start [&>*:nth-child(2)]:mt-0 [&>*:nth-child(4)]:mt-16 md:[&>*:nth-child(4)]:mt-0 [&>*:nth-child(3)]:mt-16 md:[&>*:nth-child(3)]:mt-0">
                {roadmapItems.map((item, index) => (
                  <div key={index} className="relative flex flex-col items-center text-center px-5">
                    <div className="relative h-[260px] flex items-center justify-center">
                      <div className="absolute w-[320px] h-[320px] rounded-full opacity-100 pointer-events-none"
                        style={{ background: `radial-gradient(circle, ${item.color}22 0%, ${item.color}14 12%, ${item.color}10 22%, ${item.color}06 38%, transparent 72%)`, filter: 'blur(34px)' }} />
                      <div className="absolute w-[180px] h-[180px] rounded-full opacity-90 pointer-events-none"
                        style={{ background: `radial-gradient(circle, rgba(255,255,255,0.16) 0%, ${item.color}14 28%, transparent 72%)`, filter: 'blur(18px)' }} />
                      <div className="absolute w-[120px] h-[120px] rounded-full border" style={{ borderColor: `${item.color}18`, boxShadow: `0 0 40px ${item.color}12` }} />
                      <div className="relative z-20 w-[320px] h-[320px] rounded-full flex items-center justify-center">
                        <img src={item.image} alt="" className="w-full h-full object-contain scale-[0.75] opacity-90 contrast-90 brightness-[1.40] saturate-[0.70] drop-shadow-[0_0_55px_rgba(255,255,255,0.34)] pointer-events-none select-none" />
                      </div>
                      <p className="absolute bottom-[272px] text-[16px] uppercase tracking-[0.34em]" style={{ color: item.color }}>{item.time}</p>
                    </div>

                    <h3 className="min-h-[48px] mt-[-16px] flex items-end justify-center text-[28px] leading-[0.92] font-extralight tracking-[-0.01em] text-[#F5EFE5]">{item.title}</h3>
                    <p className="mt-3 min-h-[108px] text-[14px] leading-[1.9] text-[#EAE4D5]/42">{item.description}</p>

                    <div className="mt-4 min-h-[46px] flex flex-wrap justify-center gap-3">
                      {item.metrics.map((metric, idx) => {
                        const isUp = metric.includes('↗')
                        const cleanLabel = metric.replace('↗', '').replace('↘', '').trim()
                        if (!cleanLabel) return null
                        return (
                          <div key={idx} className="relative min-w-[122px] h-[34px] rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl flex items-center justify-center px-5">
                            <span className="text-[10px] uppercase tracking-[0.18em] text-[#EAE4D5]/74 leading-none">{cleanLabel}</span>
                            <span className={`absolute right-[10px] top-1/2 -translate-y-1/2 text-[9px] leading-none ${isUp ? 'text-[#59C8FF]/82' : 'text-[#E7C980]/82'}`}>{isUp ? '↗' : '↘'}</span>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-3 min-h-[66px] flex flex-col justify-start gap-2">
                      {item.systems.map((system, idx) => (
                        <p key={idx} className="text-[11px] uppercase tracking-[0.22em]"
                          style={{ color: item.color === '#0D96FF' ? 'rgba(120,190,232,0.62)' : 'rgba(199,172,96,0.72)' }}>
                          {system}
                        </p>
                      ))}
                    </div>

                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      {item.interventions.map((intervention, idx) => (
                        <div key={idx} className="rounded-full border border-[#C7AC60]/14 bg-[#C7AC60]/[0.04] px-3 py-[8px] text-[10px] tracking-[0.04em] text-[#EAE4D5]/84">
                          {intervention}
                        </div>
                      ))}

                      {item.nextStep && (
                        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#C7AC60]/60 text-center w-full">
                          {item.nextStep}
                        </p>
                      )}

                    </div>
                  </div>
                ))}
              </div>
            </div>

        <p className="mt-8 text-[17px] leading-[2] text-[#EAE4D5]/58">
          {t('roadmapOutro')}
        </p>
      </div>
      <div className="h-10" />

       </div>

        <div className="h-10" />
{/* PRODUCT STACK */}
<div className="relative mb-10">
  {/* Coming Soon Overlay */}
  <div className="absolute inset-0 z-20 rounded-[34px] backdrop-blur-[5px] bg-[rgba(2,4,10,0.50)] flex items-center justify-center">
    <div className="relative overflow-hidden rounded-[20px] border border-[#C7AC60]/20 bg-[rgba(7,17,29,0.85)] px-10 py-8 text-center backdrop-blur-xl max-w-[500px] mx-4">
      <div className="absolute top-0 left-[18%] w-[64%] h-[1px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-80" />
      <p className="text-[11px] uppercase tracking-[0.38em] text-[#C7AC60]/70 mb-4">Lonara Labs</p>
      <h3 className="text-[26px] font-extralight text-[#EAE4D5] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {locale === 'fr' ? 'Lancement de nos produits prochainement'
          : locale === 'es' ? 'Lanzamiento de productos próximamente'
          : 'Product launch coming soon'}
      </h3>
      <p className="text-[13px] leading-[1.8] text-[#EAE4D5]/50">
        {locale === 'fr' ? 'Notre gamme de protocoles de supplémentation de précision est en cours de finalisation. Restez à l\'écoute.'
          : locale === 'es' ? 'Nuestra gama de protocolos de suplementación de precisión está siendo finalizada. Permanezca atento.'
          : 'Our precision supplementation protocol range is being finalized. Stay tuned.'}
      </p>
    </div>
  </div>

  <div className="relative overflow-hidden rounded-[34px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.18)] px-8 pt-10 pb-4 backdrop-blur-xl">
    <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
    <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />
    <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">{t('lanaraLabsProtocol')}</p>
    <h3 className="mt-3 text-[32px] font-extralight text-[#EAE4D5] mb-10">{t('coreStack')}</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
      <div>
        <p className="text-[13px] uppercase tracking-[0.3em] text-[rgba(120,190,232,0.62)] mb-4">{t('coreStackLabel')}</p>
        <div className="space-y-5">
          {protocolGroups.map((group: any, groupIndex: number) => {
            if (!group.products.length) return null
            return (
              <div key={groupIndex} className="mb-8">
                <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">{group.phase}</p>
                <div className="space-y-5">
                  {group.products.map((product: any, index: number) => (
                    <ProductCard key={index} product={product} report={report} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div>
        <p className="text-[13px] uppercase tracking-[0.3em] text-[rgba(120,190,232,0.62)] mb-4">{t('alternatives')}</p>
        <div className="space-y-5">
          {lifestyleGroups.map((group: any, groupIndex: number) => {
            if (!group.products.length) return null
            return (
              <div key={groupIndex} className="mb-8">
                <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">{group.phase}</p>
                <div className="space-y-5">
                  {group.products.map((product: any, index: number) => (
                    <ProductCard key={index} product={product} report={report} isAlternative={true} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  </div>
</div>

        {/* CUMULATIVE INTAKE */}
        <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.55)] p-8 backdrop-blur-xl">
          <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60">{t('cumulativeIntake')}</p>
          <h3 className="mt-3 text-[28px] font-extralight text-[#EAE4D5] mb-2">{t('dailyOverlap')}</h3>
          <p className="text-[12px] text-[#EAE4D5]/40 mb-8">{t('overlapNote')}</p>
          <div className="space-y-8">
            {[report.ingredientOverlaps].map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-3">
                <div className="grid grid-cols-4 gap-4 border-b border-white/10 pb-3 text-[10px] uppercase tracking-[0.18em] text-[#C7AC60]/50">
                  <p>{t('ingredient')}</p><p className="text-center">{t('intake')}</p><p className="text-center">{t('optimal')}</p><p className="text-right">{t('status')}</p>
                </div>
                {column?.map((item: any, index: number) => (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center border-b border-white/5 pb-3">
                    <p className="text-sm text-[#EAE4D5]/78">{item.name}</p>
                    <p className="text-center text-sm text-white/70">{item.total}{item.unit}</p>
                    <p className="text-center text-sm text-white/40">{item.optimal}{item.unit}</p>
                    <div className="flex justify-end">
                      <div className="rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.12em]"
                        style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}30` }}>
                        {item.exceedsUpper ? 'Limit' : item.color === '#D97C7C' ? 'High' : item.color === '#D6C27A' ? 'Elevated' : t('optimal')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* EXECUTIVE SYNTHESIS */}
        <div className="relative overflow-hidden mt-10 rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,20,38,0.25)] p-10 backdrop-blur-xl">
          <img src="/fondbas.png" alt="" className="hidden md:block absolute top-[-40px] right-[-120px] z-[6] w-[820px] h-auto object-contain opacity-[0.92] pointer-events-none select-none mix-blend-screen"
            style={{ filter: 'drop-shadow(0 0 18px rgba(13,150,255,0.22)) drop-shadow(0 0 42px rgba(13,150,255,0.14))' }} />
          <div className="absolute inset-0 bg-[rgba(7,20,38,0.72)] md:bg-[rgba(7,20,38,0.42)]" />
          <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90" />
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none" />
          <p className="relative z-10 text-[11px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-6">{t('synthesis')}</p>
          <div className="relative z-10 max-w-[820px] mt-8">
            <p className="text-[18px] leading-[1.9] text-[#EAE4D5]/80 whitespace-pre-line">
              {aiSynthesis}
            </p>
          </div>
        </div>

<PDFButtons report={report} onMySpace={onMySpace} />


        {/* LEGAL */}
        <div className="relative overflow-hidden mt-10 rounded-[32px] border border-[#C7AC60]/10 bg-black/20 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-5">{t('confidentiality')}</p>
              <div className="space-y-4 text-[13px] leading-relaxed text-[#EAE4D5]/45">
                <p>{t('confidentialityP1')}</p>
                <p>{t('confidentialityP2')}</p>
                <p>{t('confidentialityP3')}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#C7AC60]/60 mb-5">{t('disclaimer')}</p>
              <div className="space-y-4 text-[13px] leading-relaxed text-[#EAE4D5]/45">
                <p>{t('disclaimerP1')}</p>
                <p>{t('disclaimerP2')}</p>
                <p>{t('disclaimerP3')}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#EAE4D5]/30">{t('copyright')}</p>
              <p className="mt-2 text-xs text-[#EAE4D5]/25">www.lonaralabs.com — app.lonaralabs.com</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#C7AC60]/40">{t('proprietarySystem')}</p>
              <p className="mt-2 text-xs text-[#EAE4D5]/25">{t('generatedThrough')}</p>
            </div>
          </div>
        </div>

      </div>

      <div className="absolute top-4 right-4 z-30">
        <p className="text-[11px] tracking-[0.25em] uppercase text-[#EAE4D5]/25">{t('page')}</p>
      </div>
    </section>
  )
}

// ── PRODUCT CARD ──────────────────────────────────────────────────────────────

function ProductCard({ product, report, isAlternative = false }: any) {
  return (
    <div className="rounded-[22px] border border-[#C7AC60]/12 bg-black/20 p-5">
      <div className="flex justify-between items-center">
        <div className="flex-1 pr-8">
          <div className="flex items-center gap-3">
            <p className="text-sm text-[#EAE4D5]/90">{product.name}</p>
            {[...new Map(
              product.product_ingredients?.map((ingredient: any) => {
                const overlaps = isAlternative ? (report.alternativeOverlaps ?? report.ingredientOverlaps) : report.ingredientOverlaps
                const overlap = overlaps?.find((item: any) => item.name === ingredient.ingredients?.name)
                if (!overlap) return null
                if (overlap.exceedsUpper) return ['LIMIT', { label: 'LIMIT', color: overlap.color }]
                if (overlap.color === '#D97C7C') return ['HIGH', { label: 'HIGH', color: overlap.color }]
                return null
              }).filter(Boolean)
            ).values()].map((status: any, index: number) => (
              <div key={index} className="rounded-full px-2 py-1 text-[9px] uppercase tracking-[0.14em]"
                style={{ background: `${status.color}15`, color: status.color, border: `1px solid ${status.color}30` }}>
                {status.label}
              </div>
            ))}
          </div>
          {product.secondaryPhases?.length > 0 && (
            <div className="mt-4 ml-3 flex flex-wrap gap-2">
              {product.secondaryPhases.map((phase: string, index: number) => (
                <div key={index} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/45">{phase}</div>
              ))}
            </div>
          )}
          <p className="mt-4 text-sm tracking-[0.08em] text-[#C7AC60]/90">{product.category}</p>
          <p className="mt-4 text-sm text-[#EAE4D5]/50">{product.usage}</p>
        </div>
        {product.image_url && (
          <img src={product.image_url} alt={product.name} className="w-25 h-25 object-contain scale-170 ml-6 shrink-0 self-center drop-shadow-[0_0_18px_rgba(255,255,255,0.08)]" />
        )}
      </div>
    </div>
  )
}

// ── PROTOCOL CARD ─────────────────────────────────────────────────────────────

function ProtocolCard({ bgImage, icon, period, title, objective, strategicFocus, strategicFocusLabel, systems }: any) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[#C7AC60]/12 bg-[rgba(7,17,29,0.75)] p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-cover bg-center opacity-70 z-0" style={{ backgroundImage: `url('${bgImage}')` }} />
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.66)] z-0" />
      <div className="absolute top-0 left-[12%] w-[76%] h-[2px] blur-[0.4px] bg-gradient-to-r from-transparent via-[#E7D19A] to-transparent opacity-90 z-0" />
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_35px_rgba(3,90,168,0.04)] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="flex items-center justify-center">
          <div className="text-[#EAE4D5]">{icon}</div>
        </div>
        <p className="mt-6 text-[13px] uppercase tracking-[0.34em] text-[#C7AC60]/78">{period}</p>
        <h3 className="mt-3 text-[30px] font-extralight text-[#EAE4D5]">{title}</h3>
        <p className="mt-5 text-sm leading-relaxed text-[#EAE4D5]/90 max-w-[95%]">{objective}</p>

        <div className="mt-8 w-full rounded-[20px] border border-[#C7AC60]/10 bg-[#C7AC60]/[0.04] px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.30em] text-[#C7AC60]">{strategicFocusLabel}</p>
          <p className="mt-3 text-[13px] leading-[1.8] text-[#EAE4D5]/72">{strategicFocus}</p>
        </div>

        <div className="mt-8 space-y-5 w-full">
          {systems?.map((system: any, index: number) => (
            <div key={index} className="rounded-[22px] border border-white/[0.06] bg-white/[0.02] px-5 py-5 text-left">
              <p className="text-[12px] uppercase tracking-[0.24em] text-[#C7AC60]">{system.title}</p>
              <p className="mt-3 text-[13px] leading-[1.8] text-[#EAE4D5]/66">{system.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {system.interventions?.map((intervention: any, idx: number) => (
                  <div key={idx} className="rounded-full border border-[#C7AC60]/14 bg-[#C7AC60]/[0.05] px-3 py-[7px] text-[11px] tracking-[0.04em] text-[#EAE4D5]/84">
                    {intervention.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── PRIORITY ROW ──────────────────────────────────────────────────────────────

function PriorityRow({ label, level }: any) {
  return (
    <div className="flex items-center justify-between border-b border-[#C7AC60]/8 pb-4">
      <p className="text-sm text-[#EAE4D5]/70">{label}</p>
      <p className="text-[11px] tracking-[0.25em] text-[#C7AC60]">{level}</p>
    </div>
  )
}

function PDFButtons({ report, onMySpace }: { report: any; onMySpace?: () => void }) {
  const t = useTranslations('optimization')
  const locale = useLocale()
  const [loadingBW, setLoadingBW] = useState(false)
  const [sent, setSent]                 = useState<'bw' | 'color' | null>(null)

  async function sendPDF(variant: 'bw' | 'color') {
    const set = setLoadingBW
    set(true)
    setSent(null)
    try {
      await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:          report.user?.email,
          fullName:       report.user?.name,
          scores:         report.scores,
          insights:       [report.aiNarrative ?? report.aiKeyInsight ?? ''],
          protocols:      report.priorities ?? [],
          longevityScore: report.longevityScore,
          biologicalAge:  report.biologicalAge,
          report,
          variant,
          locale,
        }),
      })
      setSent(variant)
    } finally {
      set(false)
    }
  }

 return (
    <div className="relative mt-10 mb-4 flex flex-col sm:flex-row items-center justify-center gap-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(199,172,96,0.05),transparent_70%)] pointer-events-none" />

      {/* BOUTONS PDF — member, premium, executive seulement */}
      {report?.memberType !== 'guest' && (
        <>
          {/* CLASSIC — B&W */}
          <button
            onClick={() => sendPDF('bw')}
            disabled={loadingBW}
            className="relative group flex items-center gap-3 rounded-full border border-[#C7AC60]/25 bg-[rgba(7,17,29,0.6)] px-7 py-3.5 backdrop-blur-xl transition-all duration-300 hover:border-[#C7AC60]/50 hover:bg-[rgba(7,17,29,0.85)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="absolute top-0 left-[18%] w-[64%] h-[1px] bg-gradient-to-r from-transparent via-[#E7D19A]/40 to-transparent" />
            {loadingBW
              ? <div className="w-3.5 h-3.5 rounded-full border border-[#C7AC60]/30 border-t-[#C7AC60] animate-spin" />
              : <svg className="w-3.5 h-3.5 text-[#C7AC60]/60 group-hover:text-[#C7AC60]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            }
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#EAE4D5]/60 group-hover:text-[#EAE4D5] transition-colors">
              {loadingBW ? t('sending') : sent === 'bw' ? t('reportSent') : t('sendReportClassic')}
            </span>
          </button>

          
        </>
      )}

      {/* MY SPACE — premium et executive seulement */}
      {(report?.memberType === 'premium' || report?.memberType === 'executive') && (
     <button
onClick={async () => {
    if ((report?.memberType === 'premium' || report?.memberType === 'executive') && report.assessmentId) {
      try {
        const { supabase } = await import('@/lib/supabase')
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await fetch('/api/save-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
  assessmentId: report.assessmentId,
  userId: user.id,
  fullName: report.user?.name,
  locale,
              scores: report.scores,
              insights: [report.aiNarrative ?? report.aiKeyInsight ?? ''],
              protocols: report.priorities ?? [],
              longevityScore: report.longevityScore,
              biologicalAge: report.biologicalAge,
              report,
            }),
          })
          sessionStorage.removeItem('lonara-cached-history')
          sessionStorage.removeItem('lonara-cached-assessment')
        }
      } catch (e) {
        console.error('save-report error:', e)
      }
    }
    onMySpace?.()
  }}
  className="relative group flex items-center gap-3 rounded-full border border-[#035AA8]/40 bg-[#035AA8]/[0.08] px-7 py-3.5 backdrop-blur-xl transition-all duration-300 hover:border-[#035AA8]/65 hover:bg-[#035AA8]/[0.15]"
>
  <div className="absolute top-0 left-[18%] w-[64%] h-[1px] bg-gradient-to-r from-transparent via-[#5C96D8]/60 to-transparent" />
  <svg className="w-3.5 h-3.5 text-[#5C96D8] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
  <span className="text-[10px] uppercase tracking-[0.3em] text-[#5C96D8] group-hover:text-white transition-colors">
    {t('mySpace')}
  </span>
</button>
      )}

      {sent && (
        <p className="absolute -bottom-6 text-[9px] uppercase tracking-[0.22em] text-[#7EE2A8]/60">
          {t('sentTo')} {report.user?.email}
        </p>
      )}
    </div>
  )
}