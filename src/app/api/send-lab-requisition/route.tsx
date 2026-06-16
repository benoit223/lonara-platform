import React from 'react'
import { Resend } from 'resend'
import { renderToBuffer } from '@react-pdf/renderer'
import LabRequisitionPDF from '@/components/LabRequisitionPDF'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      email,
      fullName,
      age,
      sex,
      memberTier,
      locale,
    } = body

    // Validation
    if (!email || !fullName || !age || !sex || !memberTier) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (memberTier !== 'premium' && memberTier !== 'executive') {
      return Response.json({ error: 'Unauthorized tier' }, { status: 403 })
    }

    const localeStr: string = locale ?? 'en'

    const date = new Date().toLocaleDateString(
      localeStr === 'fr' ? 'fr-FR' : localeStr === 'es' ? 'es-ES' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    )

    const pdfBuffer = await renderToBuffer(
      <LabRequisitionPDF
        fullName={fullName}
        email={email}
        age={age}
        sex={sex}
        memberTier={memberTier}
        locale={localeStr}
        date={date}
      />
    )

    const subjects: Record<string, string> = {
      en: 'Your Lonara Labs Laboratory Requisition',
      fr: 'Votre Réquisition de Laboratoire — Lonara Labs',
      es: 'Su Requisición de Laboratorio — Lonara Labs',
    }

    const bodies: Record<string, string> = {
      en: `
        <div style="font-family: Arial, sans-serif; padding: 40px; background: #f8f8f8; color: #1a1a2e;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 40px; border: 1px solid #e0e0e0;">
            <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 8px;">Lonara Labs</h1>
            <p style="color: #888; font-size: 12px; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px;">Laboratory Requisition</p>
            <p style="color: #333;">Hello ${fullName},</p>
            <p style="color: #333; line-height: 1.7;">Your personalized laboratory requisition has been generated. Please find your PDF attached to this email.</p>
            <p style="color: #333; line-height: 1.7;">Present this document to your healthcare provider or any certified laboratory. The requisition includes all biomarker tests corresponding to your <strong>${memberTier === 'executive' ? 'Executive' : 'Premium'}</strong> plan.</p>
            <div style="background: #fffbf0; border: 1px solid #e8d88a; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="color: #856404; font-size: 12px; margin: 0; line-height: 1.6;">⚠️ This requisition is for wellness purposes only and does not constitute a medical prescription. Please consult your healthcare provider before undertaking any laboratory tests.</p>
            </div>
            <p style="color: #888; font-size: 12px; margin-top: 32px;">Lonara Labs — app.lonaralabs.com</p>
          </div>
        </div>`,
      fr: `
        <div style="font-family: Arial, sans-serif; padding: 40px; background: #f8f8f8; color: #1a1a2e;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 40px; border: 1px solid #e0e0e0;">
            <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 8px;">Lonara Labs</h1>
            <p style="color: #888; font-size: 12px; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px;">Réquisition de Laboratoire</p>
            <p style="color: #333;">Bonjour ${fullName},</p>
            <p style="color: #333; line-height: 1.7;">Votre réquisition de laboratoire personnalisée a été générée. Veuillez trouver votre PDF en pièce jointe.</p>
            <p style="color: #333; line-height: 1.7;">Présentez ce document à votre médecin ou à tout laboratoire certifié. La réquisition inclut tous les biomarqueurs correspondant à votre plan <strong>${memberTier === 'executive' ? 'Executive' : 'Premium'}</strong>.</p>
            <div style="background: #fffbf0; border: 1px solid #e8d88a; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="color: #856404; font-size: 12px; margin: 0; line-height: 1.6;">⚠️ Cette réquisition est à des fins de bien-être uniquement et ne constitue pas une ordonnance médicale. Consultez votre médecin avant d'effectuer des analyses.</p>
            </div>
            <p style="color: #888; font-size: 12px; margin-top: 32px;">Lonara Labs — app.lonaralabs.com</p>
          </div>
        </div>`,
      es: `
        <div style="font-family: Arial, sans-serif; padding: 40px; background: #f8f8f8; color: #1a1a2e;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 40px; border: 1px solid #e0e0e0;">
            <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 8px;">Lonara Labs</h1>
            <p style="color: #888; font-size: 12px; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px;">Requisición de Laboratorio</p>
            <p style="color: #333;">Hola ${fullName},</p>
            <p style="color: #333; line-height: 1.7;">Su requisición de laboratorio personalizada ha sido generada. Encontrará su PDF adjunto a este correo.</p>
            <p style="color: #333; line-height: 1.7;">Presente este documento a su médico o a cualquier laboratorio certificado. La requisición incluye todos los biomarcadores correspondientes a su plan <strong>${memberTier === 'executive' ? 'Executive' : 'Premium'}</strong>.</p>
            <div style="background: #fffbf0; border: 1px solid #e8d88a; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="color: #856404; font-size: 12px; margin: 0; line-height: 1.6;">⚠️ Esta requisición es solo para fines de bienestar y no constituye una receta médica. Consulte a su médico antes de realizarse análisis de laboratorio.</p>
            </div>
            <p style="color: #888; font-size: 12px; margin-top: 32px;">Lonara Labs — app.lonaralabs.com</p>
          </div>
        </div>`,
    }

    const filenames: Record<string, string> = {
      en: 'lonara-lab-requisition.pdf',
      fr: 'lonara-requisition-laboratoire.pdf',
      es: 'lonara-requisicion-laboratorio.pdf',
    }

    await resend.emails.send({
      from: 'Lonara <noreply@lonaralabs.com>',
      to: [email],
      subject: subjects[localeStr] ?? subjects.en,
      html: bodies[localeStr] ?? bodies.en,
      attachments: [
        {
          filename: filenames[localeStr] ?? filenames.en,
          content: pdfBuffer,
        },
      ],
    })

    return Response.json({ success: true })

  } catch (error) {
    console.error('LAB REQUISITION EMAIL ERROR:', error)
    return Response.json({ error: 'Failed to send lab requisition' }, { status: 500 })
  }
}