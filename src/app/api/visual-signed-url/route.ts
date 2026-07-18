import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { path } = await req.json()
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 })

  const { data, error } = await supabase.storage
    .from('visual-captures')
    .createSignedUrl(path, 60 * 10) // valide 10 minutes

  if (error || !data) {
    return NextResponse.json({ error: 'Could not sign URL' }, { status: 500 })
  }

  return NextResponse.json({ url: data.signedUrl })
}