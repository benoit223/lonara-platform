import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  const { data, error } = await supabase
    .from('capture_tokens')
    .select('user_id, sprint_id, expires_at')
    .eq('token', token)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Invalid token' }, { status: 404 })

  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Expired token' }, { status: 410 })
  }

  // Ne pas supprimer le token — il sera réutilisé par la PWA
  // Retourner userId et sprintId pour que le client les stocke
  return NextResponse.json({
    userId: data.user_id,
    sprintId: data.sprint_id ?? null,
  })
}