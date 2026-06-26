import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('lonara_capture_uid')?.value
  const sprintId = req.cookies.get('lonara_capture_sid')?.value

  if (!userId) {
    return NextResponse.json({ error: 'No session' }, { status: 401 })
  }

  return NextResponse.json({ userId, sprintId: sprintId || null })
}