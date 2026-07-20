import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function handlePurge(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    console.log('DEBUG authHeader reçu:', authHeader)
    console.log('DEBUG PURGE_SECRET défini:', process.env.PURGE_SECRET ? 'OUI' : 'NON (undefined)')
    if (authHeader !== `Bearer ${process.env.PURGE_SECRET}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - 7)

    const { data: oldCaptures, error: fetchError } = await supabaseAdmin
      .from('visual_captures')
      .select('id, image_url')
      .lt('created_at', cutoff.toISOString())

    if (fetchError) throw fetchError
    if (!oldCaptures || oldCaptures.length === 0) {
      return Response.json({ success: true, deleted: 0 })
    }

    const paths = oldCaptures.map(c => c.image_url)
    const { error: storageError } = await supabaseAdmin
      .storage
      .from('visual-captures')
      .remove(paths)

    if (storageError) {
      console.error('visual-purge storage error:', storageError)
    }

    const { error: dbError } = await supabaseAdmin
      .from('visual_captures')
      .delete()
      .lt('created_at', cutoff.toISOString())

    if (dbError) throw dbError

    return Response.json({ success: true, deleted: oldCaptures.length })
  } catch (error) {
    console.error('visual-purge ERROR:', error)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  return handlePurge(req)
}

export async function POST(req: Request) {
  return handlePurge(req)
}