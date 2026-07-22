import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { firstName, tier, timeOfDay, locale } = await req.json()

const langInstruction = locale === 'fr' ? 'Respond in French.' : locale === 'es' ? 'Respond in Spanish.' : 'Respond in English.'

const prompt = `You are Lonara, a premium longevity intelligence platform. 
Generate a single short, poetic, and deeply personal sentence for ${firstName}, a ${tier} member, in the ${timeOfDay}.
STRICT LENGTH LIMIT: no more than 12 words total. This is a hard constraint — count your words before responding. Prefer 8-10 words if possible.
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
  let phrase = data.choices?.[0]?.message?.content?.trim() ?? ''

  // Filet de sécurité — si le modèle a dépassé la limite malgré la contrainte,
  // on ne tronque jamais : on retombe sur une phrase de secours courte et complète.
  const wordCount = phrase.split(/\s+/).filter(Boolean).length
  if (wordCount > 14 || wordCount === 0) {
    const fallbacks: Record<string, string> = {
      fr: 'Chaque respiration façonne la longévité de demain.',
      es: 'Cada respiración da forma a la longevidad de mañana.',
      en: 'Every breath shapes the longevity of tomorrow.',
    }
    phrase = fallbacks[locale] ?? fallbacks.en
  }

  return NextResponse.json({ phrase })
}