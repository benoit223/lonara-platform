import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { token, locale } = await req.json()

  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  const { data, error } = await supabase
    .from('visual_capture_tokens')
    .select('user_id, expires_at')
    .eq('token', token)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Invalid token' }, { status: 404 })

  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Expired token' }, { status: 410 })
  }

  const response = NextResponse.json({ userId: data.user_id })

  // Cookie persistant, partagé entre Safari et la PWA installée (contrairement à localStorage)
  response.cookies.set('lonara_visual_uid', data.user_id, {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    path: '/',
  })

  // Locale au moment du scan — permet de rediriger vers la bonne langue quand la PWA relance sans préfixe
  response.cookies.set('lonara_visual_locale', locale ?? 'en', {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return response
}