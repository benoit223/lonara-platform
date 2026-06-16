import { useTranslations } from 'next-intl'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface AssessmentPoint {
  id: number
  created_at: string
  biological_age?: number | null
  longevity_score?: number | null
  recovery_index?: number | null
  stress_load?: number | null
  age?: number | null
}

interface EvolveSectionProps {
  assessmentHistory: AssessmentPoint[]
  lastAssessment: any
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function buildProjection(
  history: AssessmentPoint[],
  key: keyof AssessmentPoint,
  lastAssessment: any,
): { date: string; projected: number }[] {
  if (history.length < 1) return []
  const last = history[history.length - 1]
  const lastVal = last[key] as number | null
  if (lastVal == null) return []
  const lastDate = new Date(last.created_at)
  const roadmapDeltas: Record<string, number[]> = {
    biological_age:  [-1, -2, -3, -5],
    longevity_score: [5,  10, 15, 20],
    recovery_index:  [5,  10, 15, 20],
    stress_load:     [5,  10, 15, 20],
  }
  const keyStr = key as string
  const deltas = roadmapDeltas[keyStr] ?? [3, 6, 10, 15]
  const horizons = [30, 90, 180, 365]
  return horizons.map((days, i) => {
    const projectedVal = Math.max(0, Math.min(100, lastVal + deltas[i]))
    return {
      date: formatDate(addDays(lastDate, days).toISOString()),
      projected: Math.round(projectedVal * 10) / 10,
    }
  })
}

function MetricChart({
  title, color, dataKey, history, lastAssessment, unit, invertDelta,
}: {
  title: string
  color: string
  dataKey: keyof AssessmentPoint
  history: AssessmentPoint[]
  lastAssessment: any
  unit: string
  invertDelta?: boolean
}) {
  const t = useTranslations('myspace')

  const realData = history
    .filter(a => a[dataKey] != null)
    .map(a => ({
      date: formatDate(a.created_at),
      real: Math.round((a[dataKey] as number) * 10) / 10,
    }))

  const projection = buildProjection(history, dataKey, lastAssessment)
  const combined: any[] = [
    ...realData.map(d => ({ date: d.date, real: d.real })),
    ...projection.map(p => ({ date: p.date, projected: p.projected })),
  ]

  const first = realData[0]?.real ?? null
  const last  = realData[realData.length - 1]?.real ?? null
  const delta = first != null && last != null ? Math.round((last - first) * 10) / 10 : null

  const deltaPositive = invertDelta ? (delta != null && delta < 0) : (delta != null && delta > 0)
  const deltaColor = delta == null ? 'text-white/80' : deltaPositive ? 'text-[#4ADE80]' : 'text-[#FF4444]'
  const deltaArrow = delta == null ? '' : invertDelta
    ? (delta < 0 ? '↘' : '↗')
    : (delta > 0 ? '↗' : '↘')

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-[0.8rem] border border-white/10 bg-[#02040A]/90 px-3 py-2 text-[11px]">
        <p className="text-white/80 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name === 'real' ? t('evolve_actual') : t('evolve_projection')}: {p.value}{unit}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-[1.2rem] border border-[#035AA8]/60 bg-[#0A3566]/40 backdrop-blur-xl px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/80">{title}</p>
        {delta != null && (
          <span className={`text-[11px] font-light ${deltaColor}`}>
            {deltaArrow} {Math.abs(delta)}{unit} {t('evolve_sinceStart')}
          </span>
        )}
      </div>

      {last != null && (
        <p className="text-[1.8rem] font-light text-[#EAE4D5]/60 mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {last}<span className="text-[0.9rem] text-white/80 ml-1">{unit}</span>
        </p>
      )}

      {combined.length > 1 ? (
        <ResponsiveContainer width="100%" height={90}>
          <LineChart data={combined} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.25)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.25)' }} axisLine={false} tickLine={false} width={30} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="real" stroke={color} strokeWidth={2}
              dot={{ fill: color, r: 3, strokeWidth: 0 }} activeDot={{ r: 4 }} connectNulls />
            <Line type="monotone" dataKey="projected" stroke={color} strokeWidth={1.5}
              strokeDasharray="4 4" dot={{ fill: color, r: 2, strokeWidth: 0 }} opacity={0.5} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[90px] flex items-center justify-center">
          <p className="text-[12px] italic text-white/80">{t('evolve_noData')}</p>
        </div>
      )}

      <div className="mt-2 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-[2px] rounded-full" style={{ backgroundColor: color }} />
          <p className="text-[9px] uppercase tracking-[0.15em] text-white/80">{t('evolve_actual')}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-[1px] border-t border-dashed" style={{ borderColor: color, opacity: 0.5 }} />
          <p className="text-[9px] uppercase tracking-[0.15em] text-white/80">{t('evolve_projection')}</p>
        </div>
      </div>
    </div>
  )
}

export default function EvolveSection({ assessmentHistory, lastAssessment }: EvolveSectionProps) {
  const t = useTranslations('myspace')

  if (!assessmentHistory || assessmentHistory.length === 0) {
    return (
      <div className="mt-4 rounded-[1.2rem] border border-[#035AA8]/40 bg-[#035AA8]/[0.15] px-6 py-5 backdrop-blur-xl text-center">
        <p className="text-[1.2rem] font-light text-[#EAE4D5]/30 italic"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {t('evolveStart')}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="grid grid-cols-2 gap-3">
        <MetricChart title={t('evolve_biologicalAge')} color="#C7AC60" dataKey="biological_age"
          history={assessmentHistory} lastAssessment={lastAssessment} unit=" yrs" invertDelta />
        <MetricChart title={t('evolve_longevityScore')} color="#0D96FF" dataKey="longevity_score"
          history={assessmentHistory} lastAssessment={lastAssessment} unit="/100" />
        <MetricChart title={t('evolve_recoveryIndex')} color="#4ADE80" dataKey="recovery_index"
          history={assessmentHistory} lastAssessment={lastAssessment} unit="%" />
        <MetricChart title={t('evolve_stressResilience')} color="#A78BFA" dataKey="stress_load"
          history={assessmentHistory} lastAssessment={lastAssessment} unit="/100" />
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/80 text-center">
        {assessmentHistory.length} {assessmentHistory.length > 1 ? t('evolve_recordedPlural') : t('evolve_recorded')}
      </p>
    </div>
  )
}