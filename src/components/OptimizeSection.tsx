'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import LifestyleSection from './LifestyleSection'

import { useTranslations, useLocale } from 'next-intl'
import { Sun, Sunset, Moon, Plus, Trash2, Check, Utensils, Save } from 'lucide-react'


// ── CONDITIONS DE SANTÉ ───────────────────────────────────────────────────────
const HEALTH_CONDITIONS: {
  category: string
  categoryKey: string
  conditions: { key: string; label: string }[]
}[] = [
  {
    category: 'Cardiovascular',
    categoryKey: 'cardiovascular',
    conditions: [
      { key: 'hypertension',      label: 'Hypertension' },
      { key: 'atherosclerosis',   label: 'Atherosclerosis' },
      { key: 'arrhythmia',        label: 'Arrhythmia' },
      { key: 'heart_failure',     label: 'Heart Failure' },
      { key: 'stroke_history',    label: 'Stroke History' },
    ],
  },
  {
    category: 'Metabolic',
    categoryKey: 'metabolic',
    conditions: [
      { key: 'type2_diabetes',      label: 'Type 2 Diabetes' },
      { key: 'insulin_resistance',  label: 'Insulin Resistance' },
      { key: 'obesity',             label: 'Obesity' },
      { key: 'metabolic_syndrome',  label: 'Metabolic Syndrome' },
      { key: 'hypothyroidism',      label: 'Hypothyroidism' },
      { key: 'hyperthyroidism',     label: 'Hyperthyroidism' },
    ],
  },
  {
    category: 'Inflammation & Immunity',
    categoryKey: 'inflammation',
    conditions: [
      { key: 'chronic_inflammation',  label: 'Chronic Inflammation' },
      { key: 'autoimmune',            label: 'Autoimmune Disease' },
      { key: 'rheumatoid_arthritis',  label: 'Rheumatoid Arthritis' },
      { key: 'lupus',                 label: 'Lupus' },
      { key: 'crohn',                 label: "Crohn's Disease" },
    ],
  },
  {
    category: 'Neurological',
    categoryKey: 'neurological',
    conditions: [
      { key: 'depression',          label: 'Depression' },
      { key: 'anxiety',             label: 'Anxiety Disorder' },
      { key: 'migraine',            label: 'Migraine' },
      { key: 'sleep_apnea',         label: 'Sleep Apnea' },
      { key: 'cognitive_decline',   label: 'Early Cognitive Decline' },
    ],
  },
  {
    category: 'Oncological',
    categoryKey: 'oncological',
    conditions: [
      { key: 'cancer_history',        label: 'Cancer History' },
      { key: 'family_cancer_history', label: 'Family Cancer History' },
    ],
  },
  {
    category: 'Musculoskeletal',
    categoryKey: 'musculoskeletal',
    conditions: [
      { key: 'osteoporosis',      label: 'Osteoporosis' },
      { key: 'osteoarthritis',    label: 'Osteoarthritis' },
      { key: 'chronic_back_pain', label: 'Chronic Back Pain' },
    ],
  },
  {
    category: 'Genetic & Familial',
    categoryKey: 'genetic',
    conditions: [
      { key: 'apoe4',                    label: 'APOE4 Carrier' },
      { key: 'brca',                     label: 'BRCA Mutation' },
      { key: 'family_alzheimer',         label: "Family History of Alzheimer's" },
      { key: 'family_cardiovascular',    label: 'Family History of Cardiovascular Disease' },
    ],
  },
]

interface HealthCondition {
  id?: string
  condition_key: string
  condition_label: string
  category: string
  severity: 'mild' | 'moderate' | 'severe'
  family_history: boolean
  notes: string
}

interface Protocol {
  title: string
  period: string
  objective: string
  strategicFocus: string
  systems: {
    title: string
    description: string
    interventions: { label: string }[]
  }[]
}

interface Product {
  id: string
  name: string
  category: string
  protocol_phase: string
  image_url: string | null
}

interface Supplement {
  id: string
  name: string
  dose: string
  frequency: string
  timing: string
}

interface OptimizeSectionProps {
  lastAssessment: any
}

const PERIOD_ICONS: Record<string, any> = {
  Morning: <Sun className="h-4 w-4 text-[#C7AC60]" strokeWidth={1.5} />,
  Midday:  <Sunset className="h-4 w-4 text-[#5C96D8]" strokeWidth={1.5} />,
  Evening: <Moon className="h-4 w-4 text-[#A78BFA]" strokeWidth={1.5} />,
}

const PERIOD_COLORS: Record<string, string> = {
  Morning: '#C7AC60',
  Midday:  '#5C96D8',
  Evening: '#A78BFA',
}

const PHASE_COLORS: Record<string, string> = {
  activate: '#C7AC60',
  balance:  '#5C96D8',
  protect:  '#4ADE80',
  restore:  '#A78BFA',
  skin:     '#F9A8D4',
}



// ── PROTOCOLS PANEL — état géré au niveau parent, 4e bloc toujours sous le 3e ──
function ProtocolsPanel({ protocols }: { protocols: Protocol[] }) {
  const t = useTranslations('myspace')
  const locale = useLocale()
  const [expanded, setExpanded] = useState<number | null>(null)
  const [translatedProtocols, setTranslatedProtocols] = useState<Protocol[]>(protocols)

  useEffect(() => {
    if (locale === 'en' || protocols.length === 0) {
      setTranslatedProtocols(protocols)
      return
    }

    const cacheKey = `protocols_${locale}_${protocols[0]?.title}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      setTranslatedProtocols(JSON.parse(cached))
      return
    }

    fetch('/api/translate-protocols', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ protocols, locale }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.protocols) {
          setTranslatedProtocols(data.protocols)
          sessionStorage.setItem(cacheKey, JSON.stringify(data.protocols))
        }
      })
      .catch(() => setTranslatedProtocols(protocols))
  }, [protocols, locale])

  if (protocols.length === 0) return (
    <div className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 px-6 py-5 text-center">
      <p className="text-[13px] italic text-[#EAE4D5]/30">{t('optimize_noProtocols')}</p>
    </div>
  )

  const selected = expanded !== null ? translatedProtocols[expanded] : null
  const allInterventions = selected ? selected.systems.flatMap(s => s.interventions) : []
  const selectedIndex = expanded
        const originalSelectedPeriod = selectedIndex !== null ? (protocols[selectedIndex]?.period ?? selected?.period) : null
        const color = originalSelectedPeriod ? (PERIOD_COLORS[originalSelectedPeriod] ?? '#C7AC60') : '#C7AC60'

  return (
    <div className="flex flex-col gap-3">
      {/* 3 blocs compacts */}
      {translatedProtocols.map((protocol, i) => {
        const originalPeriod = protocols[i]?.period ?? protocol.period
        const c = PERIOD_COLORS[originalPeriod] ?? '#C7AC60'
        const icon = PERIOD_ICONS[originalPeriod]
        const isOpen = expanded === i
        return (
          <div key={i}
            className="rounded-[1.2rem] border backdrop-blur-xl px-5 py-4 cursor-pointer transition-all"
            style={{ borderColor: `${c}${isOpen ? '60' : '30'}`, backgroundColor: isOpen ? `${c}15` : 'rgba(10,53,102,0.4)' }}
            onClick={() => setExpanded(isOpen ? null : i)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {icon}
                <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: c }}>{t(`period_${originalPeriod.toLowerCase()}`)}</p>
              </div>
              <span className="text-[9px] text-white/40">{isOpen ? '▲' : '▼'}</span>
            </div>
            <p className="text-[13px] font-light text-[#EAE4D5]/80 mt-2">{protocol.title}</p>
          </div>
        )
      })}

      {/* 4e bloc — toujours au même endroit, sous le 3e */}
      {selected && (
        <div className="rounded-[1.2rem] border backdrop-blur-xl px-5 py-4"
          style={{ borderColor: `${color}40`, backgroundColor: 'rgba(10,53,102,0.55)' }}>
          <p className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color }}>{originalSelectedPeriod ? t(`period_${originalSelectedPeriod.toLowerCase()}`) : ''}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {allInterventions.map((item, i) => (
              <span key={i} className="rounded-full border px-2.5 py-1 text-[10px] text-[#EAE4D5]/70"
                style={{ borderColor: `${color}25`, backgroundColor: `${color}10` }}>
                {item.label}
              </span>
            ))}
          </div>
          <p className="text-[11px] leading-[1.8] text-white/50 italic">{selected.objective}</p>
        </div>
      )}
    </div>
  )
}


// ── CONDITIONS PANEL ──────────────────────────────────────────────────────────
function ConditionsPanel({ userId }: { userId: string | null }) {
  const t = useTranslations('myspace')
  const [savedConditions, setSavedConditions] = useState<HealthCondition[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [freeNotes, setFreeNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Charger les conditions existantes
  useEffect(() => {
    if (!userId) return
    const load = async () => {
      const { data } = await supabase
        .from('health_conditions')
        .select('*')
        .eq('profile_id', userId)
      if (data) {
        const free = data.find((c: any) => c.condition_key === 'free_notes')
        if (free) setFreeNotes(free.notes ?? '')
        setSavedConditions(
          data
            .filter((c: any) => c.condition_key !== 'free_notes')
            .map((c: any) => ({
              id: c.id,
              condition_key: c.condition_key,
              condition_label: c.condition_label,
              category: c.category,
              severity: c.severity ?? 'moderate',
              family_history: c.family_history ?? false,
              notes: c.notes ?? '',
            }))
        )
      }
    }
    load()
  }, [userId])

  const isChecked = (key: string) =>
    savedConditions.some(c => c.condition_key === key)

  const getCondition = (key: string) =>
    savedConditions.find(c => c.condition_key === key)

  const toggleCondition = (key: string, label: string, category: string) => {
    if (isChecked(key)) {
      setSavedConditions(prev => prev.filter(c => c.condition_key !== key))
      if (expanded === key) setExpanded(null)
    } else {
      setSavedConditions(prev => [...prev, {
        condition_key: key,
        condition_label: label,
        category,
        severity: 'moderate',
        family_history: false,
        notes: '',
      }])
      setExpanded(key)
    }
  }

  const updateCondition = (key: string, field: keyof HealthCondition, value: any) => {
    setSavedConditions(prev =>
      prev.map(c => c.condition_key === key ? { ...c, [field]: value } : c)
    )
  }

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)
    try {
      // Supprimer toutes les conditions existantes
      await supabase
        .from('health_conditions')
        .delete()
        .eq('profile_id', userId)

      // Réinsérer les conditions cochées
      const toInsert = [
        ...savedConditions.map(c => ({
          profile_id: userId,
          condition_key: c.condition_key,
          condition_label: c.condition_label,
          category: c.category,
          severity: c.severity,
          family_history: c.family_history,
          notes: c.notes,
          updated_at: new Date().toISOString(),
        })),
        // Champ libre
        ...(freeNotes.trim() ? [{
          profile_id: userId,
          condition_key: 'free_notes',
          condition_label: 'Additional Notes',
          category: 'other',
          severity: 'moderate',
          family_history: false,
          notes: freeNotes.trim(),
          updated_at: new Date().toISOString(),
        }] : []),
      ]

      if (toInsert.length > 0) {
        await supabase.from('health_conditions').insert(toInsert)
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error('Save conditions error:', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto max-h-[480px] pr-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>

{/* CATÉGORIES — 2 colonnes */}
<div className="grid grid-cols-2 gap-3">
  {HEALTH_CONDITIONS.map(({ category, categoryKey, conditions }) => (
    <div key={categoryKey}
      className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-4 py-3">

      {/* Header catégorie */}
      <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/70 mb-3">
        {t(`condition_cat_${categoryKey}` as any)}
      </p>

   {/* Conditions — 2 colonnes par catégorie */}
<div className="grid grid-cols-2 gap-2 mb-1">
        {conditions.map(({ key, label }) => {
          const checked = isChecked(key)
          const condition = getCondition(key)

          return (
            <div key={key} className={`flex flex-col gap-2 ${checked ? 'col-span-2' : ''}`}>

              {/* Checkbox */}
              <button
                onClick={() => toggleCondition(key, label, categoryKey)}
                className={`flex items-start gap-2 rounded-[0.8rem] border px-2 py-2 text-left transition-all w-full ${
                  checked
                    ? 'border-[#C7AC60]/40 bg-[#C7AC60]/10'
                    : 'border-white/8 bg-white/[0.02] hover:border-white/15'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 transition-all ${
                  checked ? 'border-[#C7AC60] bg-[#C7AC60]' : 'border-white/20'
                }`}>
                  {checked && <Check className="h-2 w-2 text-black" strokeWidth={3} />}
                </div>
                <p className="text-[10px] text-[#EAE4D5]/70 leading-tight break-words min-w-0">{label}</p>
              </button>

              {/* Détails si coché */}
              {checked && condition && (
                <div className="rounded-[0.8rem] border border-[#C7AC60]/20 bg-[#C7AC60]/5 px-3 py-3 flex flex-col gap-2">

                  {/* Severity */}
                  <div className="flex gap-1.5">
                    {(['mild', 'moderate', 'severe'] as const).map(s => (
                      <button key={s}
                        onClick={() => updateCondition(key, 'severity', s)}
                        className={`flex-1 rounded-full py-1 text-[7px] uppercase tracking-[0.10em] transition border ${
                          condition.severity === s
                            ? s === 'mild'
                              ? 'border-[#4ADE80]/50 bg-[#4ADE80]/15 text-[#4ADE80]'
                              : s === 'moderate'
                              ? 'border-[#C7AC60]/50 bg-[#C7AC60]/15 text-[#C7AC60]'
                              : 'border-[#FF4D6D]/50 bg-[#FF4D6D]/15 text-[#FF4D6D]'
                            : 'border-white/10 text-white/25'
                        }`}>
                        {t(`condition_${s}` as any)}
                      </button>
                    ))}
                  </div>

                  {/* Family history toggle */}
                  <button
                    onClick={() => updateCondition(key, 'family_history', !condition.family_history)}
                    className={`flex items-center gap-2 rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.15em] transition border w-fit ${
                      condition.family_history
                        ? 'border-[#7EB8F7]/60 bg-[#7EB8F7]/20 text-[#B8D9FF]'
                        : 'border-white/10 text-white/25'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${condition.family_history ? 'bg-[#B8D9FF]' : 'bg-white/20'}`} />
                    {t('condition_familyHistory')}
                  </button>

                  {/* Notes optionnelles */}
                  <input
                    type="text"
                    value={condition.notes}
                    onChange={e => updateCondition(key, 'notes', e.target.value)}
                    placeholder={t('condition_notesPlaceholder')}
                    className="rounded-[0.6rem] border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/60 placeholder:text-white/20 focus:outline-none focus:border-[#C7AC60]/30"
                  />

                </div>
              )}

            </div>
          )
        })}
      </div>
    </div>
  ))}
{/* CHAMP LIBRE — 8e cellule, colonne droite */}
  <div className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-4 py-3">
    <p className="text-[10px] uppercase tracking-[0.28em] text-[#C7AC60]/70 mb-3">
      {t('condition_freeField')}
    </p>
    <textarea
      rows={4}
      value={freeNotes}
      onChange={e => setFreeNotes(e.target.value)}
      placeholder={t('condition_freePlaceholder')}
      className="w-full rounded-[0.8rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-[12px] text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[#C7AC60]/30 resize-none"
    />
  </div>
</div>{/* fin grid 2 colonnes */}

      {/* BOUTON SAVE */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`flex items-center gap-2 rounded-full border px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] transition ml-auto ${
          saved
            ? 'border-[#4ADE80]/50 bg-[#4ADE80]/15 text-[#4ADE80]'
            : 'border-[#035AA8]/60 bg-[#0A3566]/40 text-white/70 hover:bg-[#0A3566]/60'
        } disabled:opacity-40`}
      >
        <Save className="h-3 w-3" />
        {saved ? t('condition_saved') : saving ? t('condition_saving') : t('condition_save')}
      </button>

    </div>
  )
}

export default function OptimizeSection({ lastAssessment }: OptimizeSectionProps) {
  const t = useTranslations('myspace')

  const TIMING_OPTIONS = [
  { value: 'Morning',    label: t('timing_morning') },
  { value: 'Midday',     label: t('timing_midday') },
  { value: 'Evening',    label: t('timing_evening') },
  { value: 'With meals', label: t('timing_withMeals') },
  { value: 'Before bed', label: t('timing_beforeBed') },
]

  const [tab, setTab] = useState<'protocols' | 'products' | 'sleep' | 'nutrition' | 'conditions'>('protocols')
  const [products, setProducts] = useState<Product[]>([])
  const [checkedProducts, setCheckedProducts] = useState<Set<string>>(new Set())
  const [supplements, setSupplements] = useState<Supplement[]>([])
  const [newName, setNewName] = useState('')
  const [newDose, setNewDose] = useState('')
  const [newFreq, setNewFreq] = useState('')
  const [newTiming, setNewTiming] = useState('Morning')
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const protocols: Protocol[] = lastAssessment?.protocols ?? []

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data: prods } = await supabase
        .from('products')
        .select('id, name, category, protocol_phase, image_url')
        .eq('active', true)
        .order('protocol_phase')
      if (prods) setProducts(prods)

      const { data: sups } = await supabase
        .from('supplements')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: true })

      if (sups) {
        const lonara = sups.filter((s: any) => s.is_lonara_product)
        setCheckedProducts(new Set(lonara.map((s: any) => s.name)))
        const others = sups.filter((s: any) => !s.is_lonara_product)
        setSupplements(others.map((s: any) => ({
          id: s.id, name: s.name,
          dose: s.dose ?? '', frequency: s.frequency ?? '', timing: s.timing ?? 'Morning',
        })))
      }
    }
    load()
  }, [])

  const toggleProduct = async (product: Product) => {
    if (!userId) return
    const isChecked = checkedProducts.has(product.name)
    if (isChecked) {
      await supabase.from('supplements').delete().eq('profile_id', userId).eq('name', product.name).eq('is_lonara_product', true)
      setCheckedProducts(prev => { const n = new Set(prev); n.delete(product.name); return n })
    } else {
      await supabase.from('supplements').insert({
        profile_id: userId, name: product.name, is_lonara_product: true,
        timing: product.protocol_phase === 'restore' ? 'Before bed' : product.protocol_phase === 'balance' ? 'Midday' : 'Morning',
      })
      setCheckedProducts(prev => new Set([...prev, product.name]))
    }
  }

  const addSupplement = async () => {
    if (!newName.trim() || !userId) return
    setSaving(true)
    const { data } = await supabase.from('supplements').insert({
      profile_id: userId, name: newName.trim(), dose: newDose.trim(),
      frequency: newFreq.trim(), timing: newTiming, is_lonara_product: false,
    }).select().single()
    if (data) {
      setSupplements(prev => [...prev, { id: data.id, name: data.name, dose: data.dose ?? '', frequency: data.frequency ?? '', timing: data.timing ?? 'Morning' }])
      setNewName(''); setNewDose(''); setNewFreq(''); setNewTiming('Morning'); setAdding(false)
    }
    setSaving(false)
  }

  const removeSupplement = async (id: string) => {
    await supabase.from('supplements').delete().eq('id', id)
    setSupplements(prev => prev.filter(s => s.id !== id))
  }

  const phases = ['activate', 'balance', 'protect', 'restore', 'skin']
  const productsByPhase = phases.map(phase => ({
    phase, items: products.filter(p => p.protocol_phase === phase),
  })).filter(g => g.items.length > 0)

  return (
    <div className="flex flex-col gap-3 mt-2">

      {/* ONGLETS */}
      <div className="grid grid-cols-2 md:flex gap-2">
        {[
          { id: 'protocols', label: t('optimize_protocols'), icon: <Sun className="h-3 w-3" /> },
          { id: 'products',  label: t('optimize_products'),  icon: <Check className="h-3 w-3" /> },
          { id: 'sleep',     label: t('optimize_sleep'),     icon: <Moon className="h-3 w-3" /> },
          { id: 'nutrition',   label: t('optimize_nutrition'),   icon: <Utensils className="h-3 w-3" /> },
{ id: 'conditions',  label: t('optimize_conditions'),  icon: <Plus className="h-3 w-3" /> },
        ].map(({ id, label, icon }) => (
          <button key={id} onClick={() => setTab(id as any)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] transition border ${
              tab === id
                ? 'border-[#035AA8]/60 bg-[#035AA8]/30 text-white/80'
                : 'border-white/10 text-white/30 hover:text-white/60'
            }`}>
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* ONGLET PROTOCOLS */}
      {tab === 'protocols' && <ProtocolsPanel protocols={protocols} />}

      {/* ONGLET PRODUCTS */}
      {tab === 'products' && (
        <div className="flex flex-col gap-3">
          <div className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/50 mb-3">{t('optimize_lonaraProducts')}</p>
            <div className="grid grid-cols-2 gap-4">
              {productsByPhase.map(({ phase, items }) => (
                <div key={phase}>
                  <p className="text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color: PHASE_COLORS[phase] ?? '#C7AC60' }}>{t(`phase_${phase}`)}</p>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                    {items.map(product => {
                      const checked = checkedProducts.has(product.name)
                      return (
                        <button key={product.id} onClick={() => toggleProduct(product)}
                          className={`flex flex-col md:flex-row items-center gap-2 rounded-[0.9rem] border px-2 md:px-3 py-3 md:py-2 transition-all ${
                            checked ? 'border-[#4ADE80]/40 bg-[#4ADE80]/10' : 'border-white/8 bg-white/[0.02] hover:border-white/15'
                          }`}>
                          {product.image_url && (
                            <img src={product.image_url} alt={product.name} className="w-6 h-6 object-contain opacity-80 shrink-0" />
                          )}
                          <p className="text-[10px] md:text-[11px] text-[#EAE4D5]/70 leading-tight md:flex-1 text-center md:text-left">{product.name}</p>
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            checked ? 'border-[#4ADE80] bg-[#4ADE80]' : 'border-white/20'
                          }`}>
                            {checked && <Check className="h-2 w-2 text-white" strokeWidth={3} />}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">{t('optimize_otherSupplements')}</p>
              <button onClick={() => setAdding(!adding)}
                className="flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-[#C7AC60]/70 hover:text-[#C7AC60] transition">
                <Plus className="h-3 w-3" />{t('optimize_add')}
              </button>
            </div>
            {adding && (
              <div className="mb-3 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                    placeholder={t('optimize_namePlaceholder')}
                    className="rounded-[0.7rem] border border-[#035AA8]/40 bg-[#035AA8]/10 px-3 py-2 text-[12px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#C7AC60]/40" />
                  <input type="text" value={newDose} onChange={e => setNewDose(e.target.value)}
                    placeholder={t('optimize_dosePlaceholder')}
                    className="rounded-[0.7rem] border border-[#035AA8]/40 bg-[#035AA8]/10 px-3 py-2 text-[12px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#C7AC60]/40" />
                  <input type="text" value={newFreq} onChange={e => setNewFreq(e.target.value)}
                    placeholder={t('optimize_freqPlaceholder')}
                    className="rounded-[0.7rem] border border-[#035AA8]/40 bg-[#035AA8]/10 px-3 py-2 text-[12px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#C7AC60]/40" />
                </div>
                <div className="flex flex-wrap gap-2">
               {TIMING_OPTIONS.map(({ value, label }) => (
                    <button key={value} onClick={() => setNewTiming(value)}
                      className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.12em] transition border ${
                        newTiming === value ? 'border-[#C7AC60]/50 bg-[#C7AC60]/15 text-[#C7AC60]' : 'border-white/10 text-white/30 hover:text-white/60'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
                <button onClick={addSupplement} disabled={saving || !newName.trim()}
                  className="flex items-center gap-2 rounded-full border border-[#035AA8]/60 bg-[#0A3566]/40 ml-auto px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-white/70 hover:bg-[#0A3566]/60 transition disabled:opacity-40">
                  <Save className="h-3 w-3" />
                  {saving ? t('lifestyle_saving') : t('lifestyle_save')}
                </button>
              </div>
            )}
            {supplements.length === 0 ? (
              <p className="text-[11px] italic text-white/20 text-center py-2">{t('optimize_noSupplements')}</p>
            ) : (
              <div className="space-y-2">
                {supplements.map(s => (
                  <div key={s.id} className="flex items-center justify-between rounded-[0.8rem] border border-white/8 bg-white/[0.03] px-3 py-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-[12px] text-[#EAE4D5]/80">{s.name}</p>
                      {s.dose && <p className="text-[10px] text-white/40">{s.dose}</p>}
                      {s.frequency && <p className="text-[10px] text-white/30">{s.frequency}</p>}
                      {s.timing && <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] text-white/25">{t(`timing_${s.timing.toLowerCase().replace(' ', '')}`) || s.timing}</span>}
                    </div>
                    <button onClick={() => removeSupplement(s.id)} className="text-white/20 hover:text-[#FF4444]/70 transition ml-2 shrink-0">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

{tab === 'sleep' && <LifestyleSection initialTab="sleep" />}
{tab === 'nutrition' && <LifestyleSection initialTab="nutrition" />}
{tab === 'conditions' && <ConditionsPanel userId={userId} />}

    </div>
  )
}