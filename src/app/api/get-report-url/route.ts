import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { filePath } = await req.json()
    if (!filePath) return Response.json({ error: 'No filePath' }, { status: 400 })

    const { data, error } = await supabaseAdmin.storage
      .from('reports')
      .createSignedUrl(filePath, 3600) // 1 heure

    if (error || !data) {
      console.error('Signed URL error:', error)
      return Response.json({ error: 'Failed to generate URL' }, { status: 500 })
    }

    return Response.json({ url: data.signedUrl })
  } catch (error) {
    console.error('get-report-url ERROR:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}