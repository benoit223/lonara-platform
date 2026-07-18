import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { token } = await req.json()
  if (token) {
    await supabase.from('visual_capture_tokens').delete().eq('token', token)
  }
  return NextResponse.json({ success: true })
}