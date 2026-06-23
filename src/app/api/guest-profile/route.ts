import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validation minimale
    if (!body.email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        first_name:          body.first_name,
        last_name:           body.last_name,
        full_name:           body.full_name,
        email:               body.email,
        access_mode:         'guest',
        account_status:      'guest',
        subscription_status: 'none',
        subscription_plan:   'free',
      }, { onConflict: 'email' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })

  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}