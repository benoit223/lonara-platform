// lib/report/generateAINarrative.ts
// Génère des narratives personnalisées via OpenAI GPT-4o
// Appelé depuis generate-report/route.ts après Engine A

'use server'

interface NarrativeInput {
  age: number
  sex: string
  biologicalAge: number
  longevityScore: number
  percentile: number
  pillarScores: {
    activate: number
    balance: number
    protect: number
    restore: number
  }
  dominantPillar: string
  strengths: string[]
  weaknesses: string[]
  patterns: Array<{
    label: string
    severity: string
    pillar: string
    description: string
  }>
  flags: Array<{
    category: string
    message: string
    severity: string
  }>
  archetype: {
    name: string
    description: string
  } | null
  signatureCode: string | null
  profileSummary: string
  country: string
  socioeconomic: string
  locale?: string
}

export interface AINarrativeResult {
  aiNarrative: string
  aiKeyInsight: string
  aiSynthesis: string
  aiProtocolIntro: string
}

export async function generateAINarrative(
  input: NarrativeInput,
): Promise<AINarrativeResult> {

  const prompt = buildPrompt(input)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 1500,
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: `You are a world-class longevity scientist writing premium personalized biological assessment reports. Be precise, scientific, and empowering. Always respond with valid JSON only — no markdown, no backticks, no preamble. ${input.locale === 'fr' ? 'Write ALL content in French.' : input.locale === 'es' ? 'Write ALL content in Spanish.' : 'Write ALL content in English.'}`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })



    if (!response.ok) {
      
      console.error('OpenAI API error:', response.status)
      return getFallbackNarrative(input)
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content?.trim() ?? ''

    return parseNarrativeResponse(text, input)

  } catch (error) {
    console.error('generateAINarrative error:', error)
    return getFallbackNarrative(input)
  }
}

// ─────────────────────────────────────────
// PROMPT
// ─────────────────────────────────────────

function buildPrompt(input: NarrativeInput): string {
  const ageDelta = input.biologicalAge - input.age
  const bioAgeText = ageDelta > 0
    ? `${ageDelta} years older than chronological age`
    : ageDelta < 0
    ? `${Math.abs(ageDelta)} years younger than chronological age`
    : 'aligned with chronological age'

  const criticalPatterns = input.patterns
    .filter(p => p.severity === 'critical')
    .map(p => p.label)
    .join(', ')

  const optimalPatterns = input.patterns
    .filter(p => p.severity === 'optimal')
    .map(p => p.label)
    .join(', ')

  const criticalFlags = input.flags
    .filter(f => f.severity === 'critical')
    .map(f => f.message)
    .join('; ')

  const isOptimal = input.weaknesses.length === 0 &&
    Object.values(input.pillarScores).every(s => s >= 80)

  return `Generate three personalized narrative sections for this biological profile. Respond ONLY with valid JSON.
${isOptimal ? 'IMPORTANT: This is a fully optimized biological profile. DO NOT mention any weakness, limiting factor, or pillar needing attention. Focus on longevity maintenance, excellence, and advanced optimization.' : ''}

BIOLOGICAL PROFILE:
- Age: ${input.age} years old, ${input.sex}
- Longevity Score: ${input.longevityScore}/100 (Top ${100 - input.percentile}% of population)
- Biological Age: ${input.biologicalAge} years (${bioAgeText})
- Archetype: ${input.archetype?.name ?? 'Unknown'}
- Signature Code: ${input.signatureCode ?? 'N/A'}

PILLAR SCORES:
- Activate (Energy & Performance): ${input.pillarScores.activate}/100
- Balance (Nervous System & Stress): ${input.pillarScores.balance}/100
- Protect (Inflammation & Immunity): ${input.pillarScores.protect}/100
- Restore (Recovery & Regeneration): ${input.pillarScores.restore}/100

${isOptimal ? `PROFILE STATUS: Fully optimized — all pillars >= 80, no weaknesses identified. Focus on longevity maintenance.` : `DOMINANT WEAKNESS PILLAR: ${input.dominantPillar}`}
BIOLOGICAL STRENGTHS: ${input.strengths.slice(0, 4).join(', ') || 'none identified'}
PRIORITY WEAKNESSES: ${input.weaknesses.slice(0, 4).join(', ') || 'none'}
${criticalPatterns ? `CRITICAL PATTERNS: ${criticalPatterns}` : ''}
${optimalPatterns ? `OPTIMAL PATTERNS: ${optimalPatterns}` : ''}
${criticalFlags ? `CRITICAL FLAGS: ${criticalFlags}` : ''}
${input.country ? `COUNTRY OF RESIDENCE: ${input.country}` : ''}
${input.socioeconomic ? `SOCIOECONOMIC LEVEL: ${input.socioeconomic}` : ''}
${input.country ? `POPULATION CONTEXT — MANDATORY: You MUST reference ${input.country} explicitly in your aiNarrative. Compare this person's longevity score of ${input.longevityScore}/100 to typical health outcomes in ${input.country}. For example, if ${input.country} has high life expectancy (like Japan or Switzerland), note that the bar is higher. If socioeconomic level is ${input.socioeconomic}, factor in access to healthcare and lifestyle resources typical for that level in ${input.country}.` : ''}

Required JSON format:
{
  "aiNarrative": "120-150 words. ANGLE: WHY — explain the biological causality behind this person's scores. Why are they configured this way? What systemic interactions explain the profile? Reference the archetype, specific scores, and critical patterns if present. Do NOT mention what to do — this is diagnosis, not prescription. No quotes around archetype or pillar names. Speak directly to this person.",
  "aiKeyInsight": "Single powerful sentence of 25-35 words. A biological revelation specific to this profile — not an action item, not a summary. The one insight that reframes how this person understands their own biology.",
  "aiSynthesis": "80-100 words. ANGLE: TRAJECTORY — where this biology is headed and what becomes possible. No repetition of scores or content from aiNarrative. Reference the 30-day and 90-day biological transformation arc. End with a statement about this specific profile's potential.",
  "aiProtocolIntro": "${isOptimal ? '60-80 words. ANGLE: WHY THIS PROTOCOL — not what the biology is, but why these specific longevity interventions were chosen for this profile. Start with archetype name, no quotes. Reference longevity score and country context if available. Frame as biological excellence maintenance and advanced longevity optimization. Zero repetition of aiNarrative content. No mention of weakness.' : '60-80 words. ANGLE: WHY THIS PROTOCOL — not a repeat of the biological diagnosis, but the strategic logic behind the intervention choices. Start with archetype name, no quotes. Explain why these specific interventions, in this order, for this exact biology. Reference dominant pillar and 1-2 specific categories. No repetition of scores already covered in aiNarrative.'}"
}`
}

// ─────────────────────────────────────────
// PARSE
// ─────────────────────────────────────────

function parseNarrativeResponse(
  text: string,
  input: NarrativeInput,
): AINarrativeResult {
  try {
    const clean = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    const parsed = JSON.parse(clean)

    return {
      aiNarrative:    parsed.aiNarrative    || getFallbackNarrative(input).aiNarrative,
      aiKeyInsight:   parsed.aiKeyInsight   || getFallbackNarrative(input).aiKeyInsight,
      aiSynthesis:    parsed.aiSynthesis    || getFallbackNarrative(input).aiSynthesis,
      aiProtocolIntro: parsed.aiProtocolIntro || getFallbackNarrative(input).aiProtocolIntro,
    }
  } catch {
    return getFallbackNarrative(input)
  }
}

// ─────────────────────────────────────────
// FALLBACK
// ─────────────────────────────────────────

function getFallbackNarrative(input: NarrativeInput): AINarrativeResult {
  const ageDelta = input.biologicalAge - input.age
  const bioAgeText = ageDelta > 0
    ? input.locale === 'fr' ? `${ageDelta} ans au-dessus de l'âge chronologique` : input.locale === 'es' ? `${ageDelta} años por encima de la edad cronológica` : `${ageDelta} years above chronological age`
    : ageDelta < 0
    ? input.locale === 'fr' ? `${Math.abs(ageDelta)} ans en dessous de l'âge chronologique` : input.locale === 'es' ? `${Math.abs(ageDelta)} años por debajo de la edad cronológica` : `${Math.abs(ageDelta)} years below chronological age`
    : input.locale === 'fr' ? `aligné avec l'âge chronologique` : input.locale === 'es' ? `alineado con la edad cronológica` : 'aligned with chronological age'

  const criticalPatterns = input.patterns.filter(p => p.severity === 'critical')
  const dominantPattern = criticalPatterns[0]

  const aiNarrative = `Your biological profile scores ${input.longevityScore}/100, placing you in the top ${100 - input.percentile}% of the population. Biological age assessment indicates ${bioAgeText}. ${input.archetype ? `Your profile matches the ${input.archetype.name} archetype — ${input.archetype.description}` : ''} The ${input.dominantPillar} pillar represents your primary optimization opportunity, currently scoring ${input.pillarScores[input.dominantPillar as keyof typeof input.pillarScores]}/100. ${dominantPattern ? `A critical biological pattern has been identified: ${dominantPattern.label} — ${dominantPattern.description}` : ''} ${input.strengths.length > 0 ? `Your strongest biological assets are ${input.strengths.slice(0, 2).join(' and ')}.` : ''}`

  const isOptimalFallback = input.weaknesses.length === 0 &&
    Object.values(input.pillarScores).every(s => s >= 80)

  const aiKeyInsight = isOptimalFallback
    ? `Your fully optimized biological profile places you in the top ${100 - input.percentile}% — maintain this foundation through advanced longevity protocols and consistent biological monitoring.`
    : `Your ${input.dominantPillar} system is the limiting factor — addressing it first will unlock compounding improvements across all four biological pillars.`

  const aiSynthesis = isOptimalFallback
    ? `All four biological pillars are operating at high efficiency. The next frontier is advanced longevity optimization — senolytic protocols, NAD+ support, and epigenetic fine-tuning. ${input.strengths.length > 0 ? `Your exceptional strength in ${input.strengths.slice(0, 2).join(' and ')} provides the foundation for elite-level biological enhancement.` : ''}`
    : `A targeted 30-day protocol focused on ${input.dominantPillar} stabilization will create the biological foundation for deeper optimization. By 90 days, systematic improvements across ${input.weaknesses.slice(0, 2).join(' and ')} are achievable. ${input.strengths.length > 0 ? `Leverage your existing strength in ${input.strengths[0]} as the anchor for this transformation.` : 'Consistent daily rituals will compound into measurable biological improvements.'}`

  const aiProtocolIntro = isOptimalFallback
    ? `${input.archetype?.name ?? 'Longevity Optimized'} reflects a rare status — all four biological pillars at high efficiency with a longevity score of ${input.longevityScore}/100. This protocol is designed not for correction, but for the elevation of an already exceptional biological foundation. Every element is calibrated to your unique profile, integrating the highest-leverage longevity interventions available.`
    : `Your ${input.archetype?.name ?? 'biological profile'} demands a precision-engineered response. With a longevity score of ${input.longevityScore}/100, your ${input.dominantPillar} system is the primary limiting factor — scoring critically low and creating cascading effects across your biology. This protocol is not a generic wellness plan. Every intervention below is calibrated to your specific biological architecture, targeting ${input.weaknesses.slice(0, 2).join(' and ')} as the highest-leverage entry points for measurable biological transformation.`

  return { aiNarrative, aiKeyInsight, aiSynthesis, aiProtocolIntro }
}