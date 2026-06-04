export function calculatePsychometricProfile({
  responses,
  questions,
  completionTime,
  pageTimes,
}: {
  responses: Record<string, number>
  questions: any[]
  completionTime?: number
  pageTimes?: Record<string, number>
}) {

  const values =
    Object.values(responses)

  const responseCount =
    values.length

  // =====================================
  // MINIMUM DATA
  // =====================================

  if (responseCount < 5) {
    return {
      coherence: 0,
      confidence: 'low',
      contradictionLoad: 0,
      stability: 0,
      reliability: 0,
      hasEnoughData: false,
    }
  }

  // =====================================
  // GROUP RESPONSES BY PAGE
  // =====================================

  const pagesMap: Record<string, number[]> = {}

  questions.forEach((question) => {

   const value =
  responses[question.id]

    if (value === undefined) return

    const page =
  question.category || 'default'

    if (!pagesMap[page]) {
      pagesMap[page] = []
    }

    pagesMap[page].push(value)
  })

  const orderedPages =
  Object.keys(pagesMap)

  // =====================================
  // STABILITY
  // =====================================

  let stability = 40

  let samePagePenaltyCount = 0
let consecutivePagesPenaltyCount = 0

  orderedPages.forEach((page, index) => {

  const currentPage: number[] =
  pagesMap[page]

    // même réponses sur une page
    const allSame =
      currentPage.every(
        (value: number) =>
    value === currentPage[0],
)
    if (
      allSame &&
      samePagePenaltyCount < 7
    ) {
      stability *= 0.95
      samePagePenaltyCount++
    }

    // pages consécutives identiques
   const nextPage: number[] | undefined =
  pagesMap[
    orderedPages[index + 1]
  ]

    if (
      nextPage &&
      consecutivePagesPenaltyCount < 7
    ) {

      const identical =
        JSON.stringify(currentPage) ===
        JSON.stringify(nextPage)

      if (identical) {
        stability *= 0.85
        consecutivePagesPenaltyCount++
      }
    }
  })

  if (stability <= 0) {
    stability = 5
  }

  // =====================================
  // CONTRADICTION ANALYSIS
  // =====================================

  let contradictions = 20

  orderedPages.forEach((page) => {

 const currentPage: number[] =
  pagesMap[page]

for (
  let i = 0;
  i < currentPage.length - 1;
  i++
) {

  const current =
    currentPage[i]

  const next =
    currentPage[i + 1]

  const difference =
    Math.abs(current - next)

  // énorme incohérence
  if (difference >= 4) {

    contradictions *= 0.85

    break
  }

  // incohérence modérée
  if (difference >= 3) {

    contradictions *= 0.95

    break
  }
}
  })

  contradictions =
    Math.max(
      0,
      Math.min(
        20,
        Math.round(contradictions),
      ),
    )

  // =====================================
  // RELIABILITY
  // =====================================

  let reliability = 40

  const timingValues =
  Object.values(pageTimes || {})

let slow60Count = 0
let slow120Count = 0
let fast30Count = 0
let fast15Count = 0

  for (
    let i = 0;
    i < timingValues.length - 2;
    i++
  ) {

 const t1 = timingValues[i]
const t2 = timingValues[i + 1]
const t3 = timingValues[i + 2]

    // > 120 sec
    if (
      t1 > 120 &&
      t2 > 120 &&
      t3 > 120 &&
      slow120Count < 2
    ) {
      reliability *= 0.7
      slow120Count++
    }

    // > 60 sec
    else if (
      t1 > 60 &&
      t2 > 60 &&
      t3 > 60 &&
      slow60Count < 3
    ) {
      reliability *= 0.9
      slow60Count++
    }

    // < 15 sec
    if (
      t1 < 15 &&
      t2 < 15 &&
      t3 < 15 &&
      fast15Count < 2
    ) {
      reliability *= 0.7
      fast15Count++
    }

    // < 30 sec
    else if (
      t1 < 30 &&
      t2 < 30 &&
      t3 < 30 &&
      fast30Count < 3
    ) {
      reliability *= 0.9
      fast30Count++
    }
  }

  if (reliability <= 0) {
    reliability = 5
  }

  // =====================================
  // COHERENCE
  // =====================================

  const coherence =
    Math.round(
      (
        stability +
        reliability +
        contradictions
      ),
    )

  // =====================================
  // CONFIDENCE
  // =====================================

  let confidence = 'moderate'

  if (coherence >= 85) {
    confidence = 'high'
  }

  if (coherence <= 60) {
    confidence = 'low'
  }

  return {
    coherence:
      Math.max(
        28,
        Math.min(96, coherence),
      ),

   contradictionLoad:
  Math.round(
    (contradictions / 20) * 100,
  ),

   stability:
  Math.round(
    (stability / 40) * 100,
  ),

reliability:
  Math.round(
    (reliability / 40) * 100,
  ),

    confidence,

    hasEnoughData: true,
  }
}