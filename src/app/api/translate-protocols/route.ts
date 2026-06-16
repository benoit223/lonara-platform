import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { protocols, locale } = await req.json()

    if (locale === 'en') {
      return NextResponse.json({ protocols })
    }

    const langName = locale === 'fr' ? 'French' : locale === 'es' ? 'Spanish' : 'English'

    const prompt = `Translate the following longevity protocol JSON to ${langName}. 
Translate ONLY these fields: title, objective, strategicFocus, and each system's title, description, and each intervention's label.
Keep the JSON structure identical. Return ONLY valid JSON, no markdown, no explanation.

${JSON.stringify(protocols)}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 3000,
    })

    const text = response.choices[0]?.message?.content ?? ''
    const clean = text.replace(/```json|```/g, '').trim()
    const translated = JSON.parse(clean)

    return NextResponse.json({ protocols: translated })
  } catch (error) {
    console.error('translate-protocols error:', error)
    return NextResponse.json({ protocols: null }, { status: 500 })
  }
}