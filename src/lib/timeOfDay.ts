export type TimeOfDay = 'matin' | 'jour' | 'soir' | 'nuit'

export function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours()
  const m = new Date().getMinutes()
  if (h >= 5  && h < 10) return 'matin'
  if (h >= 10 && h < 17) return 'jour'
  if (h >= 17 && (h < 21 || (h === 21 && m < 30))) return 'soir'
  return 'nuit'
}

export function getMySpaceBg(character: string): string {
  return `/${character}${getTimeOfDay()}.png`
}

export function getFuelBg(): string {
  const tod = getTimeOfDay()
  const map: Record<string, string> = {
    matin: '/fuelmatin.png',
    jour:  '/fuelmidi.png',
    soir:  '/fuelaprem.png',
    nuit:  '/fuelsoir.png',
  }
  return map[tod]
}

export function isNightTime(): boolean {
  return getTimeOfDay() === 'nuit'
}