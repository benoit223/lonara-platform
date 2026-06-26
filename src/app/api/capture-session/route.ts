import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('lonara_capture_uid')?.value
  const sprintId = req.cookies.get('lonara_capture_sid')?.value

  if (!userId) {
    return NextResponse.json({ error: 'No session' }, { status: 401 })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: sprint } = await supabase
    .from('fuel_sprints')
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .maybeSingle()

  return NextResponse.json({ userId, sprintId: sprint?.id ?? null })
}