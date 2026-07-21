import { SupabaseClient } from '@supabase/supabase-js'

const MONTHLY_CAP = 8 // 2/semaine × 4 semaines, par type (face ou body)

function getCurrentCycleStart(anchorDate: Date): Date {
  const now = new Date()
  const cycleStart = new Date(anchorDate)
  cycleStart.setFullYear(now.getFullYear())
  cycleStart.setMonth(now.getMonth())
  if (cycleStart > now) {
    cycleStart.setMonth(cycleStart.getMonth() - 1)
  }
  return cycleStart
}

function getNextCycleStart(anchorDate: Date): Date {
  const cycleStart = getCurrentCycleStart(anchorDate)
  const next = new Date(cycleStart)
  next.setMonth(next.getMonth() + 1)
  return next
}

export async function checkRetentionSlot(
  supabase: SupabaseClient,
  userId: string,
  captureType: 'face' | 'body'
): Promise<{ canRetain: boolean; renewsAt: string | null }> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('visual_retention_anchor_date')
    .eq('id', userId)
    .single()

  // Première capture retenue de l'utilisateur — on pose l'ancre aujourd'hui
  if (!profile?.visual_retention_anchor_date) {
    const today = new Date().toISOString().split('T')[0]
    await supabase.from('profiles').update({ visual_retention_anchor_date: today }).eq('id', userId)
    return { canRetain: true, renewsAt: null }
  }

  const anchorDate = new Date(profile.visual_retention_anchor_date)
  const cycleStart = getCurrentCycleStart(anchorDate)

  const { data: retainedThisCycle } = await supabase
    .from('visual_captures')
    .select('session_id')
    .eq('user_id', userId)
    .eq('capture_type', captureType)
    .eq('retained', true)
    .gte('created_at', cycleStart.toISOString())

  const uniqueSessions = new Set((retainedThisCycle ?? []).map(r => r.session_id))

  if (uniqueSessions.size < MONTHLY_CAP) {
    return { canRetain: true, renewsAt: null }
  }

  return { canRetain: false, renewsAt: getNextCycleStart(anchorDate).toISOString() }
}