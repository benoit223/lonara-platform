import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FACE_POSE_LABELS: Record<string, string> = {
  center: 'front-facing view',
  left: 'left profile view',
  right: 'right profile view',
}

const BODY_POSE_LABELS: Record<string, string> = {
  front: 'front view',
  back: 'back view',
  left: 'left profile view',
  right: 'right profile view',
}

const LOCALE_NAMES: Record<string, string> = {
  fr: 'French', en: 'English', es: 'Spanish',
}

const FACE_SYSTEM_PROMPT = `You are a clinical dermatological image analysis system. Analyze the provided facial photographs using established clinical scales. Respond ONLY with valid JSON, no other text.

Apply these scales:
- Fitzpatrick Skin Type (I-VI) — for calibration only, do not comment on it
- Griffiths Photonumeric Scale (0-9) per zone: forehead lines, periorbital lines (crow's feet), nasolabial folds, perioral lines
- Glogau Photoaging Classification (I-IV) with one-sentence justification
- Pigmentation load — estimated percentage of visible skin surface affected by lentigines/dyschromia
- Vascularity load — estimated percentage of visible skin surface affected by telangiectasia/diffuse erythema
- Skin texture score (0-9) — roughness, pore visibility, overall surface irregularity, same scale convention as Griffiths
- Skin laxity — jawline, eyelids, neck — each rated "mild", "moderate", or "pronounced"
- Merz Midface Volume Scale (0-4) — cheek/malar volume loss
- Merz Tear Trough Scale (0-4) — infraorbital hollowing
- Merz Jowl Scale (0-4) — jawline contour/jowling
- Crow's feet depth (0-4) — independent of the Griffiths periorbital line score, focused on static depth at rest
- Facial asymmetry — overall left/right asymmetry, rated "symmetric", "mild", "moderate", or "pronounced"
- Signs of fatigue — visible tiredness cues (under-eye hollowing/darkness, dull tone), rated "none", "mild", "moderate", or "pronounced"
- Perceived age range (5-year bracket)
- Confidence level ("low", "moderate", "high") based on photo quality (lighting, angle, resolution)

Rules:
- Stay strictly descriptive and clinical, never normative or comparative
- If photo quality prevents reliable assessment of any criterion, mark it "not_assessable" rather than guessing
- Never make aesthetic judgments
- All estimates are visual approximations, not clinical measurements — treat them accordingly in confidence and notes

Return JSON matching this exact schema:
{
  "fitzpatrick_type": "I"|"II"|"III"|"IV"|"V"|"VI",
  "griffiths_scores": { "forehead": 0-9, "periorbital": 0-9, "nasolabial": 0-9, "perioral": 0-9 },
  "glogau_stage": "I"|"II"|"III"|"IV",
  "glogau_justification": "string",
  "pigmentation_load_percent": 0-100,
  "vascularity_load_percent": 0-100,
  "texture_score": 0-9,
  "skin_laxity": { "jawline": "mild"|"moderate"|"pronounced", "eyelids": "mild"|"moderate"|"pronounced", "neck": "mild"|"moderate"|"pronounced" },
  "midface_volume_score": 0-4,
  "tear_trough_score": 0-4,
  "jowl_score": 0-4,
  "crows_feet_score": 0-4,
  "facial_asymmetry": "symmetric"|"mild"|"moderate"|"pronounced"|"not_assessable",
  "fatigue_signs": "none"|"mild"|"moderate"|"pronounced"|"not_assessable",
  "perceived_age_range": [number, number],
  "confidence": "low"|"moderate"|"high",
  "notes": "string, 1-2 factual sentences summarizing the visual signal"
}`

const BODY_SYSTEM_PROMPT = `You are a clinical postural and morphological image analysis system. Analyze the provided full-body photographs using functional, non-aesthetic criteria. Respond ONLY with valid JSON, no other text.

Assess:
- Postural alignment — visible spinal curvature, shoulder/hip symmetry, sagittal alignment — rate as "neutral", "mild_kyphosis", or "pronounced_kyphosis"
- Forward head posture — visible cervical forward projection from the side view — rate as "neutral", "mild", or "pronounced"
- Pelvic tilt — visible anterior or posterior pelvic tilt from the side view — rate as "neutral", "anterior", or "posterior"
- Waist-hip ratio — estimated from front view proportions (WHO standard reference)
- Shoulder-hip symmetry — any visible asymmetry from back/front views
- Muscle tone by zone — arms, core/abdomen, legs — each rated "low", "moderate", or "high", acknowledge this is a rough visual estimate, not a body composition measurement
- Sarcopenia indicators — indirect visual cues only (limb thinning, loss of muscle contour, visible skin laxity over triceps/thighs suggesting reduced muscle volume) — rate overall likelihood as "none", "mild", "moderate", or "pronounced". This is an indirect visual estimate, not a diagnosis.
- Adiposity distribution — overall fat distribution pattern visible from front/back views — rate as "android" (abdominal-predominant), "gynoid" (hip/thigh-predominant), or "mixed"
- Body skin laxity — arms, abdomen — each rated "mild", "moderate", or "pronounced"
- Cellulite grade (0-4) — using the Nürnberger-Müller scale, if visible and assessable from the provided poses
- Visual aging index — a single composite score (0-100) synthesizing posture, muscle tone, and skin laxity into one overall visual musculoskeletal aging indicator. Calibrate the score against these bands:
  - 90-100: minimal visual aging signs, posture/tone/skin firmness well preserved
  - 75-89: good overall level, a few mild signs, nothing pronounced
  - 55-74: moderate signs, some criteria warrant attention
  - 35-54: more noticeable signs, several criteria show visible aging
  - 0-34: pronounced signs across all assessed criteria
  Pick the score within the appropriate band based on the overall severity you observe; do not default to band boundaries.
- Confidence level based on photo quality and completeness of the 4-pose set

Rules:
- Stay strictly functional and descriptive, never aesthetic or normative
- Never comment on body weight, size, or attractiveness
- If a pose is missing or unclear, mark related fields "not_assessable"
- All estimates are visual approximations, not clinical measurements — treat them accordingly in confidence and notes
- Sarcopenia and adiposity assessments must be framed as indirect visual signals only, never as medical diagnoses

Return JSON matching this exact schema:
{
  "postural_alignment": "neutral"|"mild_kyphosis"|"pronounced_kyphosis"|"not_assessable",
  "forward_head_posture": "neutral"|"mild"|"pronounced"|"not_assessable",
  "pelvic_tilt": "neutral"|"anterior"|"posterior"|"not_assessable",
  "waist_hip_ratio_estimate": number|null,
  "shoulder_hip_symmetry": "symmetric"|"mild_asymmetry"|"notable_asymmetry"|"not_assessable",
  "muscle_tone": { "arms": "low"|"moderate"|"high"|"not_assessable", "core": "low"|"moderate"|"high"|"not_assessable", "legs": "low"|"moderate"|"high"|"not_assessable" },
  "sarcopenia_indicators": "none"|"mild"|"moderate"|"pronounced"|"not_assessable",
  "adiposity_distribution": "android"|"gynoid"|"mixed"|"not_assessable",
  "skin_laxity_body": { "arms": "mild"|"moderate"|"pronounced", "abdomen": "mild"|"moderate"|"pronounced" },
  "cellulite_grade": 0-4|null,
  "visual_aging_index": 0-100,
  "confidence": "low"|"moderate"|"high",
  "notes": "string, 1-2 factual sentences summarizing the visual signal"
}`

async function getSignedUrls(paths: string[]): Promise<string[]> {
  const urls: string[] = []
  for (const path of paths) {
    const { data } = await supabase.storage.from('visual-captures').createSignedUrl(path, 600)
    if (data?.signedUrl) urls.push(data.signedUrl)
  }
  return urls
}

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionId, captureType, locale } = await req.json()

    if (!userId || !sessionId || !captureType) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const languageName = LOCALE_NAMES[locale] ?? 'English'

    const { data: captures, error: fetchError } = await supabase
      .from('visual_captures')
      .select('pose, image_url')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .eq('capture_type', captureType)

    if (fetchError || !captures || captures.length === 0) {
      return NextResponse.json({ error: 'No captures found for this session' }, { status: 404 })
    }

    const paths = captures.map(c => c.image_url)
    const signedUrls = await getSignedUrls(paths)

    const poseLabels = captureType === 'face' ? FACE_POSE_LABELS : BODY_POSE_LABELS
    const basePrompt = captureType === 'face' ? FACE_SYSTEM_PROMPT : BODY_SYSTEM_PROMPT
    const systemPrompt = `${basePrompt}

Language instruction: Write the "notes" and "glogau_justification" (face only) text fields in ${languageName}. All enum/category values in the JSON schema (e.g. "mild", "moderate", "android", "not_assessable", etc.) must remain in English exactly as specified, regardless of the language above — they are internal codes, not display text.`

    const imageContent = captures.map((c, i) => ({
      type: 'image_url',
      image_url: { url: signedUrls[i] },
    }))

    const labelText = captures.map(c => poseLabels[c.pose] ?? c.pose).join(', ')

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 1200,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: `Photos provided, in order: ${labelText}.` },
              ...imageContent,
            ],
          },
        ],
      }),
    })

    if (!openaiRes.ok) {
      const errText = await openaiRes.text()
      console.error('OpenAI error:', errText)
      return NextResponse.json({ error: 'Analysis failed' }, { status: 502 })
    }

    const openaiData = await openaiRes.json()
    const rawContent = openaiData.choices?.[0]?.message?.content
    let analysis: Record<string, unknown>
    try {
      analysis = JSON.parse(rawContent)
    } catch {
      return NextResponse.json({ error: 'Invalid analysis format' }, { status: 500 })
    }

    const { data: inserted, error: insertError } = await supabase
      .from('visual_analyses')
      .insert({
        user_id: userId,
        session_id: sessionId,
        capture_type: captureType,
        analysis,
      })
      .select()
      .single()

    if (insertError) {
      console.error('DB insert error:', insertError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, analysis: inserted })
  } catch (e) {
    console.error('visual-analyze error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}