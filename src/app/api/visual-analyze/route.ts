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

const FACE_SYSTEM_PROMPT = `You are a clinical dermatological image analysis system. Analyze the provided facial photographs using established clinical scales. Respond ONLY with valid JSON, no other text.

Apply these scales:
- Fitzpatrick Skin Type (I-VI) — for calibration only, do not comment on it
- Griffiths Photonumeric Scale (0-9) per zone: forehead lines, periorbital lines (crow's feet), nasolabial folds, perioral lines
- Glogau Photoaging Classification (I-IV) with one-sentence justification
- Pigmentation load — estimated percentage of visible skin surface affected by lentigines/dyschromia
- Skin laxity — jawline, eyelids, neck — each rated "mild", "moderate", or "pronounced"
- Perceived age range (5-year bracket)
- Confidence level ("low", "moderate", "high") based on photo quality (lighting, angle, resolution)

Rules:
- Stay strictly descriptive and clinical, never normative or comparative
- If photo quality prevents reliable assessment of any criterion, mark it "not_assessable" rather than guessing
- Never make aesthetic judgments

Return JSON matching this exact schema:
{
  "fitzpatrick_type": "I"|"II"|"III"|"IV"|"V"|"VI",
  "griffiths_scores": { "forehead": 0-9, "periorbital": 0-9, "nasolabial": 0-9, "perioral": 0-9 },
  "glogau_stage": "I"|"II"|"III"|"IV",
  "glogau_justification": "string",
  "pigmentation_load_percent": 0-100,
  "skin_laxity": { "jawline": "mild"|"moderate"|"pronounced", "eyelids": "mild"|"moderate"|"pronounced", "neck": "mild"|"moderate"|"pronounced" },
  "perceived_age_range": [number, number],
  "confidence": "low"|"moderate"|"high",
  "notes": "string, 1-2 factual sentences summarizing the visual signal"
}`

const BODY_SYSTEM_PROMPT = `You are a clinical postural and morphological image analysis system. Analyze the provided full-body photographs using functional, non-aesthetic criteria. Respond ONLY with valid JSON, no other text.

Assess:
- Postural alignment — visible spinal curvature, shoulder/hip symmetry, sagittal alignment — rate as "neutral", "mild_kyphosis", or "pronounced_kyphosis"
- Waist-hip ratio — estimated from front view proportions (WHO standard reference)
- Shoulder-hip symmetry — any visible asymmetry from back/front views
- Muscle definition — qualitative only ("low", "moderate", "high"), acknowledge this is a rough visual estimate, not a body composition measurement
- Confidence level based on photo quality and completeness of the 4-pose set

Rules:
- Stay strictly functional and descriptive, never aesthetic or normative
- Never comment on body weight, size, or attractiveness
- If a pose is missing or unclear, mark related fields "not_assessable"

Return JSON matching this exact schema:
{
  "postural_alignment": "neutral"|"mild_kyphosis"|"pronounced_kyphosis"|"not_assessable",
  "waist_hip_ratio_estimate": number|null,
  "shoulder_hip_symmetry": "symmetric"|"mild_asymmetry"|"notable_asymmetry"|"not_assessable",
  "muscle_definition_visual": "low"|"moderate"|"high"|"not_assessable",
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
    const { userId, sessionId, captureType } = await req.json()

    if (!userId || !sessionId || !captureType) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

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
    const systemPrompt = captureType === 'face' ? FACE_SYSTEM_PROMPT : BODY_SYSTEM_PROMPT

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
        max_tokens: 800,
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