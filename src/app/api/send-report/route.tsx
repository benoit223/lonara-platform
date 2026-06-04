import { Resend } from 'resend'

import { renderToBuffer } from '@react-pdf/renderer'


import PDFReport from '@/components/PDFReport'


const resend = new Resend(
  process.env.RESEND_API_KEY,
)

export async function POST(req: Request) {
  try {
  
    const body = await req.json()

   
    const {
      email,
      fullName,
      scores,
      insights,
      protocols,
      longevityScore,
    } = body

  
const pdfBuffer =
  await renderToBuffer(
    <PDFReport
      fullName={fullName}
      scores={scores}
      insights={insights}
      protocols={protocols}
      longevityScore={
        longevityScore
      }
biologicalAge={
  body.biologicalAge
}

    />,
  )


    const data =
      await resend.emails.send({
        from:
          'Lonara <reports@lonaralabs.com>',

        to: [email],

        subject:
          'Your Lonara Premium Longevity Report',

        html: `
        <div style="font-family: Arial; padding: 40px; background: #0f172a; color: white;">
          
          <h1 style="color:#22d3ee;">
            Lonara Labs
          </h1>

          <p>
            Hello ${fullName},
          </p>

          <p>
            Your Lonara Premium Longevity Report has been successfully generated.
          </p>

          <p>
            Your biological profiling assessment is now complete.
          </p>

          <p>
            Your premium PDF report is attached to this email.
          </p>

          <br />

          <p style="color:#94a3b8;">
            Lonara Longevity Intelligence Platform
          </p>

        </div>
      `,

        attachments: [
  {
    filename:
      'lonara-premium-report.pdf',

    content: pdfBuffer,
  },
],
      })


    return Response.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error(
      'EMAIL ERROR:',
      error,
    )

    return Response.json(
      {
        error: 'Email failed',
      },
      {
        status: 500,
      },
    )
  }
}