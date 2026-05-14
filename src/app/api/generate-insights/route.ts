import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { scores } = body

    const prompt = `
You are Lonara Labs AI.

Analyze these biological scores and generate:
- a premium longevity analysis,
- biological interpretation,
- recovery observations,
- nervous system insights,
- mitochondrial optimization suggestions,
- clinical-style wellness recommendations.

Scores:
${JSON.stringify(scores, null, 2)}

Write in premium clinical longevity language.
Keep it concise but intelligent.
`

    const completion =
      await openai.chat.completions.create({
        model: 'gpt-4.1-mini',

        messages: [
          {
            role: 'system',
            content:
              'You are an elite longevity AI platform.',
          },

          {
            role: 'user',
            content: prompt,
          },
        ],

        temperature: 0.8,
      })

    return Response.json({
      insight:
        completion.choices[0].message.content,
    })
  } catch (error) {
    console.error(error)

    return Response.json(
      {
        error: 'AI generation failed.',
      },
      { status: 500 },
    )
  }
}