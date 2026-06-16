import { renderToBuffer } from '@react-pdf/renderer'
import PDFReport from '@/components/PDFReport'
import path from 'path'
import fs from 'fs'
import React from 'react'
import { createClient } from '@supabase/supabase-js'

const LOGO_BL_PATH = path.join(process.cwd(), 'public', 'lonara-logo-bl.png')

export async function POST(req: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const body = await req.json()
    const { assessmentId, fullName, scores, insights, protocols, longevityScore, biologicalAge, report, userId } = body

    const tier = report?.user?.memberType ?? 'member'
    const isFullAccess = tier === 'executive' || tier === 'premium'

    if (!isFullAccess) {
      return Response.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Générer le PDF Classic
    const element = PDFReport({
      fullName,
      scores,
      insights: insights ?? [],
      protocols: protocols ?? [],
      longevityScore,
      biologicalAge,
      report,
      variant: 'bw',
      tier,
      showPage1: true,
      showPage2: isFullAccess,
      showPage3: true,
      logoPath: `data:image/png;base64,${fs.readFileSync(LOGO_BL_PATH).toString('base64')}`,
    })

    const pdfBuffer = await renderToBuffer(element)

    // Chemin dans Supabase Storage
    const filePath = `${userId}/${assessmentId}_classic.pdf`

    // Upload dans Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('reports')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return Response.json({ error: 'Upload failed' }, { status: 500 })
    }

    // Sauvegarder l'URL dans assessments
    const { error: updateError } = await supabaseAdmin
      .from('assessments')
      .update({ pdf_url: filePath })
      .eq('id', assessmentId)

    if (updateError) {
      console.error('Update error:', updateError)
    }

 // Garder maximum 50 PDFs par usager — supprimer les plus anciens
const { data: allUserPdfs } = await supabaseAdmin
  .from('assessments')
  .select('id, pdf_url, created_at')
  .eq('profile_id', userId)
  .not('pdf_url', 'is', null)
  .order('created_at', { ascending: false })

if (allUserPdfs && allUserPdfs.length > 50) {
  const toDelete = allUserPdfs.slice(50)
  for (const old of toDelete) {
    await supabaseAdmin.storage.from('reports').remove([old.pdf_url])
    await supabaseAdmin.from('assessments').update({ pdf_url: null }).eq('id', old.id)
  }
}

    return Response.json({ success: true, filePath })
  } catch (error) {
    console.error('save-report ERROR:', error)
    return Response.json({ error: 'Save failed' }, { status: 500 })
  }
}