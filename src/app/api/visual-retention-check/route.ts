import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRetentionSlot } from '@/lib/visualRetention'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { userId, captureType } = await req.json()
  if (!userId || !captureType) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }
  const result = await checkRetentionSlot(supabase, userId, captureType)
  return NextResponse.json(result)
}