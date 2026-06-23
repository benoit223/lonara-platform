// lib/report/generateAINarrative.ts
// Génère des narratives personnalisées via OpenAI GPT-4o
// Appelé depuis generate-report/route.ts après Engine A

'use server'

interface LifestyleData {
  supplements: Array<{ name: string; dose?: string; timing?: string }>
  sleepBedtime?: string
  sleepWaketime?: string
  sleepDuration?: string
  sleepTracker?: string
  sleepAids?: string
  nutritionDiet?: string
  nutritionMeals?: string
  nutritionFasting?: string
  nutritionAlcohol?: string
  nutritionCaffeine?: string
  healthConditions?: Array<{
    condition_label: string
    category: string
    severity: string
    family_history: boolean
    notes?: string
  }>
  freeNotes?: string
}

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
  lifestyleData?: LifestyleData
  healthConditions?: Array<{
    condition_label: string
    category: string
    severity: string
    family_history: boolean
    notes?: string
  }>
  freeNotes?: string
}

export interface AINarrativeResult {
  aiNarrative: string
  aiKeyInsight: string
  aiSynthesis: string
  aiProtocolIntro: string
  aiLifestyleInsight: string
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
        max_tokens: 2000,
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
  .map(f => f.message?.startsWith('flag_') || f.message?.startsWith('biomarker_flag_')
    ? f.message.replace('biomarker_flag_', '').replace('flag_', '').replace(/_/g, ' ')
    : f.message)
  .join('; ')

  const isOptimal = input.weaknesses.length === 0 &&
    Object.values(input.pillarScores).every(s => s >= 80)

  const lifestyleContext = input.lifestyleData
    ? (() => {
        const parts: string[] = []
        const sups = input.lifestyleData.supplements
        if (sups?.length > 0) {
          parts.push(`Active supplements: ${sups.map(s => `${s.name}${s.dose ? ` ${s.dose}` : ''}${s.timing ? ` (${s.timing})` : ''}`).join(', ')}`)
        }
        if (input.lifestyleData.sleepBedtime && input.lifestyleData.sleepWaketime) {
          parts.push(`Sleep schedule: bedtime ${input.lifestyleData.sleepBedtime}, wake ${input.lifestyleData.sleepWaketime}${input.lifestyleData.sleepDuration ? `, duration ${input.lifestyleData.sleepDuration}` : ''}`)
        }
        if (input.lifestyleData.sleepAids) parts.push(`Sleep aids: ${input.lifestyleData.sleepAids}`)
        if (input.lifestyleData.nutritionDiet) parts.push(`Diet type: ${input.lifestyleData.nutritionDiet}`)
        if (input.lifestyleData.nutritionMeals) parts.push(`Meals per day: ${input.lifestyleData.nutritionMeals}`)
        if (input.lifestyleData.nutritionFasting) parts.push(`Intermittent fasting: ${input.lifestyleData.nutritionFasting}`)
        if (input.lifestyleData.nutritionAlcohol) parts.push(`Alcohol: ${input.lifestyleData.nutritionAlcohol}`)
        if (input.lifestyleData.nutritionCaffeine) parts.push(`Caffeine: ${input.lifestyleData.nutritionCaffeine}`)
        return parts.length > 0 ? parts.join('\n') : null
      })()
    : null


  // Contexte conditions de santé
  const conditionsContext = (() => {
    const conditions = input.healthConditions ?? input.lifestyleData?.healthConditions ?? []
    const freeNotes = input.freeNotes ?? input.lifestyleData?.freeNotes ?? ''
    if (conditions.length === 0 && !freeNotes) return null
    const lines = conditions.map(c =>
      `- ${c.condition_label} (${c.severity}${c.family_history ? ', family history' : ''})${c.notes ? `: ${c.notes}` : ''}`
    )
    if (freeNotes) lines.push(`- Additional notes: ${freeNotes}`)
    return lines.join('\n')
  })()

  return `Generate three personalized narrative sections for this biological profile. Respond ONLY with valid JSON.
${isOptimal ? 'IMPORTANT: This is a fully optimized biological profile...' : ''}
${conditionsContext ? `\nKNOWN HEALTH CONDITIONS & PREDISPOSITIONS (MANDATORY — integrate into all narrative sections, adjust biological interpretation and recommendations accordingly):\n${conditionsContext}\n` : ''}

BIOLOGICAL PROFILE:
- Age: ${input.age} years old, ${input.sex}
- Longevity Score: ${input.longevityScore}/100 (Top ${100 - input.percentile}% of population)
- Biological Age: ${input.biologicalAge} years (${bioAgeText})
- Archetype: ${input.archetype?.name?.startsWith('archetype_') 
  ? input.archetype.name.replace('archetype_', '').replace(/_/g, ' ') 
  : input.archetype?.name ?? 'Unknown'}
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

${lifestyleContext ? `\nCURRENT LIFESTYLE DATA (declared by user):\n${lifestyleContext}\n` : ''}
Required JSON format:
{
  "aiNarrative": "120-150 words. ANGLE: WHY — explain the biological causality behind this person's scores. Why are they configured this way? What systemic interactions explain the profile? Reference the archetype, specific scores, and critical patterns if present. Do NOT mention what to do — this is diagnosis, not prescription. No quotes around archetype or pillar names. Speak directly to this person.",
  "aiKeyInsight": "Single powerful sentence of 25-35 words. A biological revelation specific to this profile — not an action item, not a summary. The one insight that reframes how this person understands their own biology.",
  "aiSynthesis": "80-100 words. ANGLE: TRAJECTORY — where this biology is headed and what becomes possible. No repetition of scores or content from aiNarrative. Reference the 30-day and 90-day biological transformation arc. End with a statement about this specific profile's potential.",
  "aiProtocolIntro": "${isOptimal ? '60-80 words. ANGLE: WHY THIS PROTOCOL — not what the biology is, but why these specific longevity interventions were chosen for this profile. Start with archetype name, no quotes. Reference longevity score and country context if available. Frame as biological excellence maintenance and advanced longevity optimization. Zero repetition of aiNarrative content. No mention of weakness.' : '60-80 words. ANGLE: WHY THIS PROTOCOL — not a repeat of the biological diagnosis, but the strategic logic behind the intervention choices. Start with archetype name, no quotes. Explain why these specific interventions, in this order, for this exact biology. Reference dominant pillar and 1-2 specific categories. No repetition of scores already covered in aiNarrative.'}",
 "aiLifestyleInsight": "${lifestyleContext
    ? `60-80 words. ANGLE: COHERENCE — analyze the gap or alignment between this person's current lifestyle habits and their biological scores. Be specific: name the supplement, the sleep schedule, the diet if relevant. Identify what is working, what is contradicting the biology, and the single highest-leverage lifestyle adjustment for this profile. Direct, scientific, no generic advice.`
    : `60-80 words. ANGLE: LIFESTYLE POTENTIAL — based on the biological scores alone, identify the 2-3 lifestyle domains (sleep, nutrition, supplementation, movement) most likely to have the highest impact on this specific profile. Be specific to the dominant pillar and weaknesses. No generic advice.`
  }"
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
      aiNarrative:        parsed.aiNarrative        || getFallbackNarrative(input).aiNarrative,
      aiKeyInsight:       parsed.aiKeyInsight        || getFallbackNarrative(input).aiKeyInsight,
      aiSynthesis:        parsed.aiSynthesis         || getFallbackNarrative(input).aiSynthesis,
      aiProtocolIntro:    parsed.aiProtocolIntro     || getFallbackNarrative(input).aiProtocolIntro,
      aiLifestyleInsight: parsed.aiLifestyleInsight  || getFallbackNarrative(input).aiLifestyleInsight,
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

  const lang = input.locale === 'fr' ? 'fr' : input.locale === 'es' ? 'es' : 'en'

const archetypeName = input.archetype?.name?.startsWith('archetype_')
  ? input.archetype.name.replace('archetype_', '').replace(/_/g, ' ')
  : input.archetype?.name ?? ''

const aiNarrative = lang === 'fr'
  ? `Votre profil biologique score ${input.longevityScore}/100, vous plaçant dans le top ${100 - input.percentile}% de la population. L'évaluation de l'âge biologique indique ${bioAgeText}. ${archetypeName ? `Votre profil correspond à l'archétype ${archetypeName}.` : ''} Le pilier ${input.dominantPillar} représente votre principale opportunité d'optimisation, scorant actuellement ${input.pillarScores[input.dominantPillar as keyof typeof input.pillarScores]}/100. ${dominantPattern ? `Un pattern biologique critique a été identifié : ${dominantPattern.label} — ${dominantPattern.description}` : ''} ${input.strengths.length > 0 ? `Vos atouts biologiques les plus forts sont ${input.strengths.slice(0, 2).join(' et ')}.` : ''}`
  : lang === 'es'
  ? `Su perfil biológico puntúa ${input.longevityScore}/100, situándole en el top ${100 - input.percentile}% de la población. La evaluación de la edad biológica indica ${bioAgeText}. ${archetypeName ? `Su perfil corresponde al arquetipo ${archetypeName}.` : ''} El pilar ${input.dominantPillar} representa su principal oportunidad de optimización, puntuando actualmente ${input.pillarScores[input.dominantPillar as keyof typeof input.pillarScores]}/100. ${dominantPattern ? `Se ha identificado un patrón biológico crítico: ${dominantPattern.label} — ${dominantPattern.description}` : ''} ${input.strengths.length > 0 ? `Sus activos biológicos más fuertes son ${input.strengths.slice(0, 2).join(' y ')}.` : ''}`
  : `Your biological profile scores ${input.longevityScore}/100, placing you in the top ${100 - input.percentile}% of the population. Biological age assessment indicates ${bioAgeText}. ${archetypeName ? `Your profile matches the ${archetypeName} archetype.` : ''} The ${input.dominantPillar} pillar represents your primary optimization opportunity, currently scoring ${input.pillarScores[input.dominantPillar as keyof typeof input.pillarScores]}/100. ${dominantPattern ? `A critical biological pattern has been identified: ${dominantPattern.label} — ${dominantPattern.description}` : ''} ${input.strengths.length > 0 ? `Your strongest biological assets are ${input.strengths.slice(0, 2).join(' and ')}.` : ''}`

  const isOptimalFallback = input.weaknesses.length === 0 &&
    Object.values(input.pillarScores).every(s => s >= 80)

const aiKeyInsight = isOptimalFallback
  ? lang === 'fr' ? `Votre profil biologique entièrement optimisé vous place dans le top ${100 - input.percentile}% — maintenez cette base grâce à des protocoles de longévité avancés et une surveillance biologique continue.`
    : lang === 'es' ? `Su perfil biológico completamente optimizado lo sitúa en el top ${100 - input.percentile}% — mantenga esta base con protocolos avanzados de longevidad y monitoreo biológico continuo.`
    : `Your fully optimized biological profile places you in the top ${100 - input.percentile}% — maintain this foundation through advanced longevity protocols and consistent biological monitoring.`
  : lang === 'fr' ? `Votre système ${input.dominantPillar} est le facteur limitant — l'adresser en premier débloquera des améliorations composées sur les quatre piliers biologiques.`
    : lang === 'es' ? `Su sistema ${input.dominantPillar} es el factor limitante — abordarlo primero desbloqueará mejoras compuestas en los cuatro pilares biológicos.`
    : `Your ${input.dominantPillar} system is the limiting factor — addressing it first will unlock compounding improvements across all four biological pillars.`

  const aiSynthesis = isOptimalFallback
  ? lang === 'fr' ? `Les quatre piliers biologiques fonctionnent à haute efficacité. La prochaine frontière est l'optimisation avancée de la longévité — protocoles sénolyse, soutien NAD+ et ajustement épigénétique. ${input.strengths.length > 0 ? `Votre force exceptionnelle en ${input.strengths.slice(0, 2).join(' et ')} fournit la base pour une amélioration biologique de niveau élite.` : ''}`
    : lang === 'es' ? `Los cuatro pilares biológicos funcionan con alta eficiencia. La siguiente frontera es la optimización avanzada de longevidad — protocolos senolíticos, soporte NAD+ y ajuste epigenético. ${input.strengths.length > 0 ? `Su fortaleza excepcional en ${input.strengths.slice(0, 2).join(' y ')} proporciona la base para una mejora biológica de élite.` : ''}`
    : `All four biological pillars are operating at high efficiency. The next frontier is advanced longevity optimization — senolytic protocols, NAD+ support, and epigenetic fine-tuning. ${input.strengths.length > 0 ? `Your exceptional strength in ${input.strengths.slice(0, 2).join(' and ')} provides the foundation for elite-level biological enhancement.` : ''}`
  : lang === 'fr' ? `Un protocole ciblé de 30 jours axé sur la stabilisation du ${input.dominantPillar} créera les fondations biologiques pour une optimisation plus profonde. À 90 jours, des améliorations systématiques sur ${input.weaknesses.slice(0, 2).join(' et ')} sont réalisables. ${input.strengths.length > 0 ? `Utilisez votre force existante en ${input.strengths[0]} comme ancre de cette transformation.` : 'Des rituels quotidiens cohérents se composeront en améliorations biologiques mesurables.'}`
    : lang === 'es' ? `Un protocolo dirigido de 30 días enfocado en la estabilización del ${input.dominantPillar} creará la base biológica para una optimización más profunda. A los 90 días, mejoras sistemáticas en ${input.weaknesses.slice(0, 2).join(' y ')} son alcanzables. ${input.strengths.length > 0 ? `Aproveche su fortaleza existente en ${input.strengths[0]} como ancla de esta transformación.` : 'Los rituales diarios consistentes se compondrán en mejoras biológicas medibles.'}`
    : `A targeted 30-day protocol focused on ${input.dominantPillar} stabilization will create the biological foundation for deeper optimization. By 90 days, systematic improvements across ${input.weaknesses.slice(0, 2).join(' and ')} are achievable. ${input.strengths.length > 0 ? `Leverage your existing strength in ${input.strengths[0]} as the anchor for this transformation.` : 'Consistent daily rituals will compound into measurable biological improvements.'}`

  const aiProtocolIntro = isOptimalFallback
  ? lang === 'fr' ? `${archetypeName || 'Longévité Optimisée'} reflète un statut rare — les quatre piliers biologiques à haute efficacité avec un score de longévité de ${input.longevityScore}/100. Ce protocole est conçu non pour la correction, mais pour l'élévation d'une base biologique déjà exceptionnelle.`
    : lang === 'es' ? `${archetypeName || 'Longevidad Optimizada'} refleja un estado excepcional — los cuatro pilares biológicos en alta eficiencia con una puntuación de longevidad de ${input.longevityScore}/100. Este protocolo está diseñado no para corrección, sino para elevar una base biológica ya excepcional.`
    : `${archetypeName || 'Longevity Optimized'} reflects a rare status — all four biological pillars at high efficiency with a longevity score of ${input.longevityScore}/100. This protocol is designed not for correction, but for the elevation of an already exceptional biological foundation.`
  : lang === 'fr' ? `${archetypeName || 'Votre profil biologique'} exige une réponse de précision. Avec un score de longévité de ${input.longevityScore}/100, votre système ${input.dominantPillar} est le facteur limitant principal — créant des effets en cascade sur toute votre biologie. Ce protocole n'est pas un plan bien-être générique. Chaque intervention est calibrée pour cibler ${input.weaknesses.slice(0, 2).join(' et ')} comme points d'entrée à plus fort levier.`
    : lang === 'es' ? `${archetypeName || 'Su perfil biológico'} exige una respuesta de precisión. Con una puntuación de longevidad de ${input.longevityScore}/100, su sistema ${input.dominantPillar} es el factor limitante principal — creando efectos en cascada en toda su biología. Este protocolo no es un plan de bienestar genérico. Cada intervención está calibrada para apuntar a ${input.weaknesses.slice(0, 2).join(' y ')} como puntos de entrada de mayor apalancamiento.`
    : `${archetypeName || 'Your biological profile'} demands a precision-engineered response. With a longevity score of ${input.longevityScore}/100, your ${input.dominantPillar} system is the primary limiting factor — creating cascading effects across your biology. This protocol is not a generic wellness plan. Every intervention is calibrated to target ${input.weaknesses.slice(0, 2).join(' and ')} as the highest-leverage entry points.`
 
 
  const aiLifestyleInsight = lang === 'fr'
    ? `Votre pilier ${input.dominantPillar} est le levier prioritaire. Optimisez votre sommeil, votre nutrition anti-inflammatoire et votre stack de suppléments en cohérence avec vos scores biologiques pour maximiser la trajectoire de récupération.`
    : lang === 'es'
    ? `Su pilar ${input.dominantPillar} es la palanca prioritaria. Optimice su sueño, su nutrición antiinflamatoria y su stack de suplementos en coherencia con sus puntuaciones biológicas para maximizar la trayectoria de recuperación.`
    : `Your ${input.dominantPillar} pillar is the priority lever. Optimize sleep consistency, anti-inflammatory nutrition, and your supplement stack in alignment with your biological scores to maximize recovery trajectory.`

  return { aiNarrative, aiKeyInsight, aiSynthesis, aiProtocolIntro, aiLifestyleInsight }
}