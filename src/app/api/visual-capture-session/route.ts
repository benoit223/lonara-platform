import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('lonara_visual_uid')?.value

  if (!userId) {
    return NextResponse.json({ error: 'No session' }, { status: 401 })
  }

  return NextResponse.json({ userId })
}