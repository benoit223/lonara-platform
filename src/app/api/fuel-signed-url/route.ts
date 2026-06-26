import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json()
    if (!path) return NextResponse.json({ error: 'No path' }, { status: 400 })

    const { data, error } = await supabase.storage
      .from('fuel-images')
      .createSignedUrl(path, 3600)

    if (error || !data) return NextResponse.json({ error: 'Failed' }, { status: 500 })

    return NextResponse.json({ url: data.signedUrl })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}