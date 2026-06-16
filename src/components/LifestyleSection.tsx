'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useTranslations } from 'next-intl'

interface LifestyleData {
  sleep_bedtime: string
  sleep_waketime: string
  sleep_tracker: string
  sleep_aids: boolean
  diet_type: string
  fasting: string
  alcohol: string
  caffeine: string
  meals_per_day: number
}

const DEFAULT_DATA: LifestyleData = {
  sleep_bedtime: '23:00',
  sleep_waketime: '07:00',
  sleep_tracker: 'none',
  sleep_aids: false,
  diet_type: '',
  fasting: 'none',
  alcohol: '',
  caffeine: '',
  meals_per_day: 3,
}

function computeSleepDuration(bedtime: string, waketime: string): string {
  if (!bedtime || !waketime) return '—'
  const [bh, bm] = bedtime.split(':').map(Number)
  const [wh, wm] = waketime.split(':').map(Number)
  let minutes = (wh * 60 + wm) - (bh * 60 + bm)
  if (minutes < 0) minutes += 24 * 60
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h${m > 0 ? `${m}min` : ''}`
}

function OptionButton({ label, value, selected, onClick }: { label: string; value: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] transition border ${
        selected
          ? 'border-[#035AA8]/60 bg-[#035AA8]/30 text-white/80'
          : 'border-white/10 text-white/30 hover:text-white/60 hover:border-white/20'
      }`}>
      {label}
    </button>
  )
}

export default function LifestyleSection({ initialTab = 'sleep' }: { initialTab?: 'sleep' | 'nutrition' }) {
  const t = useTranslations('myspace')
  const [tab] = useState<'sleep' | 'nutrition'>(initialTab as 'sleep' | 'nutrition')
  const [data, setData] = useState<LifestyleData>(DEFAULT_DATA)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data: log } = await supabase
        .from('lifestyle_logs').select('*').eq('profile_id', user.id).single()
      if (log) {
        setData({
          sleep_bedtime:  log.sleep_bedtime  ?? '23:00',
          sleep_waketime: log.sleep_waketime ?? '07:00',
          sleep_tracker:  log.sleep_tracker  ?? 'none',
          sleep_aids:     log.sleep_aids     ?? false,
          diet_type:      log.diet_type      ?? '',
          fasting:        log.fasting        ?? 'none',
          alcohol:        log.alcohol        ?? '',
          caffeine:       log.caffeine       ?? '',
          meals_per_day:  log.meals_per_day  ?? 3,
        })
      }
    }
    load()
  }, [])

  const set = (key: keyof LifestyleData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const save = async () => {
    if (!userId) return
    setSaving(true)
    await supabase.from('lifestyle_logs').upsert({
      profile_id: userId, ...data, updated_at: new Date().toISOString(),
    }, { onConflict: 'profile_id' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sleepDuration = computeSleepDuration(data.sleep_bedtime, data.sleep_waketime)

  const trackerOptions = [
    { value: 'none', label: t('lifestyle_none') },
    { value: 'Oura', label: 'Oura' },
    { value: 'Whoop', label: 'Whoop' },
    { value: 'Apple Watch', label: 'Apple Watch' },
    { value: 'Garmin', label: 'Garmin' },
    { value: 'Other', label: t('lifestyle_other') },
  ]

  const fastingOptions = [
    { value: 'none', label: t('lifestyle_none') },
    { value: '16:8', label: '16:8' },
    { value: '18:6', label: '18:6' },
    { value: '20:4', label: '20:4' },
    { value: 'Other', label: t('lifestyle_other') },
  ]

  const alcoholOptions = [
    { value: 'Never', label: t('lifestyle_never') },
    { value: 'Occasional', label: t('lifestyle_occasional') },
    { value: 'Weekly', label: t('lifestyle_weekly') },
    { value: 'Daily', label: t('lifestyle_daily') },
  ]

  const caffeineOptions = [
    { value: 'None', label: t('lifestyle_none') },
    { value: '1-2/day', label: t('caffeine_low') },
    { value: '3+/day', label: t('caffeine_high') },
  ]

  return (
    <div className="flex flex-col gap-3 mt-2">

      {/* SLEEP */}
      {tab === 'sleep' && (
        <div className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-4 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-1.5">{t('sleep_bedtime')}</p>
              <input type="time" value={data.sleep_bedtime}
                onChange={e => set('sleep_bedtime', e.target.value)}
                className="w-full rounded-[0.7rem] border border-[#035AA8]/40 bg-[#035AA8]/10 px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[#C7AC60]/40" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-1.5">{t('sleep_waketime')}</p>
              <input type="time" value={data.sleep_waketime}
                onChange={e => set('sleep_waketime', e.target.value)}
                className="w-full rounded-[0.7rem] border border-[#035AA8]/40 bg-[#035AA8]/10 px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[#C7AC60]/40" />
            </div>
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-1">{t('sleep_duration')}</p>
              <p className="text-[1.4rem] font-light text-[#4ADE80]/80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {sleepDuration}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">{t('sleep_tracker')}</p>
            <div className="flex flex-wrap gap-2">
              {trackerOptions.map(({ value, label }) => (
                <OptionButton key={value} label={label} value={value}
                  selected={data.sleep_tracker === value} onClick={() => set('sleep_tracker', value)} />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[11px] text-white/50">{t('sleep_aids')}</p>
            <button onClick={() => set('sleep_aids', !data.sleep_aids)}
              className={`w-10 h-5 rounded-full border transition-all relative ${
                data.sleep_aids ? 'border-[#4ADE80]/50 bg-[#4ADE80]/20' : 'border-white/15 bg-white/5'
              }`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                data.sleep_aids ? 'left-5 bg-[#4ADE80]' : 'left-0.5 bg-white/20'
              }`} />
            </button>
          </div>
        </div>
      )}

      {/* NUTRITION */}
      {tab === 'nutrition' && (
        <div className="rounded-[1.2rem] border border-[#035AA8]/40 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-4 flex flex-col gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">{t('nutrition_diet')}</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'Omnivore', label: 'Omnivore' },
                { value: 'Vegetarian', label: 'Vegetarian' },
                { value: 'Vegan', label: 'Vegan' },
                { value: 'Keto', label: 'Keto' },
                { value: 'Mediterranean', label: 'Mediterranean' },
                { value: 'Paleo', label: 'Paleo' },
                { value: 'Other', label: t('lifestyle_other') },
              ].map(({ value, label }) => (
                <OptionButton key={value} label={label} value={value}
                  selected={data.diet_type === value} onClick={() => set('diet_type', value)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">{t('nutrition_meals')}</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(n => (
                <OptionButton key={n} label={`${n}${n === 4 ? '+' : ''}`} value={String(n)}
                  selected={data.meals_per_day === n} onClick={() => set('meals_per_day', n)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">{t('nutrition_fasting')}</p>
            <div className="flex flex-wrap gap-2">
              {fastingOptions.map(({ value, label }) => (
                <OptionButton key={value} label={label} value={value}
                  selected={data.fasting === value} onClick={() => set('fasting', value)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">{t('nutrition_alcohol')}</p>
            <div className="flex flex-wrap gap-2">
              {alcoholOptions.map(({ value, label }) => (
                <OptionButton key={value} label={label} value={value}
                  selected={data.alcohol === value} onClick={() => set('alcohol', value)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">{t('nutrition_caffeine')}</p>
            <div className="flex flex-wrap gap-2">
              {caffeineOptions.map(({ value, label }) => (
                <OptionButton key={value} label={label} value={value}
                  selected={data.caffeine === value} onClick={() => set('caffeine', value)} />
              ))}
            </div>
          </div>
        </div>
      )}

      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 rounded-full border border-[#035AA8]/60 bg-[#0A3566]/40 ml-auto px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-white/70 hover:bg-[#0A3566]/60 transition disabled:opacity-40">
        <Save className="h-3 w-3" />
        {saving ? t('lifestyle_saving') : saved ? t('lifestyle_saved') : t('lifestyle_save')}
      </button>

    </div>
  )
}