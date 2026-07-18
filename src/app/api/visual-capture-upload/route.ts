import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const userId = formData.get('userId') as string
    const captureType = formData.get('captureType') as string
    const pose = formData.get('pose') as string
    const sessionId = formData.get('sessionId') as string
    const image = formData.get('image') as File

    if (!userId || !captureType || !pose || !image) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileName = `${userId}/${captureType}/${pose}-${Date.now()}.jpg`

    const { error: uploadError } = await supabase.storage
      .from('visual-captures')
      .upload(fileName, buffer, { contentType: 'image/jpeg' })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const { data: inserted, error: insertError } = await supabase
      .from('visual_captures')
      .insert({
        user_id: userId,
        capture_type: captureType,
        pose,
        image_url: fileName,
        session_id: sessionId || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('DB insert error:', insertError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, capture: inserted })
  } catch (e) {
    console.error('visual-capture-upload error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}