// Utilitaire de guidage vocal — évite de répéter le même message en boucle

let lastSpokenText = ''
let lastSpokenAt = 0
const MIN_INTERVAL_MS = 2500 // ne pas répéter le même message plus souvent que ça

export function speak(text: string, opts?: { force?: boolean; lang?: string }) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return

  const now = Date.now()
  const isSameMessage = text === lastSpokenText
  const tooSoon = now - lastSpokenAt < MIN_INTERVAL_MS
  const stillSpeaking = window.speechSynthesis.speaking

  // Ne jamais interrompre une phrase en cours, sauf si forcé (ex. "photo prise")
  if (!opts?.force && stillSpeaking) return
  if (!opts?.force && isSameMessage && tooSoon) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = opts?.lang ?? 'fr-FR'
  utterance.rate = 1.0
  window.speechSynthesis.speak(utterance)

  lastSpokenText = text
  lastSpokenAt = now
}

export function stopSpeaking() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
}