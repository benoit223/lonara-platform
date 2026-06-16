import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { firstName, tier, timeOfDay, locale } = await req.json()

const langInstruction = locale === 'fr' ? 'Respond in French.' : locale === 'es' ? 'Respond in Spanish.' : 'Respond in English.'

const prompt = `You are Lonara, a premium longevity intelligence platform. 
Generate a single short, poetic, and deeply personal sentence (max 18 words) for ${firstName}, a ${tier} member, in the ${timeOfDay}.
The sentence should feel like a quiet meditation on longevity, vitality, or the art of living longer. 
Tone: serene, elevated, intimate. No generic wellness clichés. No emojis. No quotes. Just the sentence.
${langInstruction}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 60,
      temperature: 0.8,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  const phrase = data.choices?.[0]?.message?.content?.trim() ?? ''
  return NextResponse.json({ phrase })
}