import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FUEL_LOG_THRESHOLD = 5

export async function POST(req: NextRequest) {
  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

  const { data: lastSummary } = await supabase
    .from('summary_reports')
    .select('*')
    .eq('user_id', userId)
    .order('generated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!lastSummary) {
    return NextResponse.json({ needsRegeneration: true, hasExisting: false, lastSummary: null })
  }

  let needsRegeneration = false

  const { data: latestAssessment } = await supabase
    .from('assessments')
    .select('id, created_at')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (latestAssessment && latestAssessment.id !== lastSummary.source_assessment_id) {
    needsRegeneration = true
  }

  const { data: latestVisual } = await supabase
    .from('visual_analyses')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (latestVisual && (!lastSummary.source_visual_analysis_at ||
      new Date(latestVisual.created_at) > new Date(lastSummary.source_visual_analysis_at))) {
    needsRegeneration = true
  }

  const { count: fuelLogCount } = await supabase
    .from('fuel_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gt('created_at', lastSummary.generated_at)

  if ((fuelLogCount ?? 0) >= FUEL_LOG_THRESHOLD) {
    needsRegeneration = true
  }

  return NextResponse.json({ needsRegeneration, hasExisting: true, lastSummary })
}