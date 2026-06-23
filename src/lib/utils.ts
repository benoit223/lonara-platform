// ─────────────────────────────────────────────────────────────────────────────
// utils.ts
// Lonara Labs — Utilitaires globaux
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calcule l'âge exact en années à partir d'une date de naissance (format YYYY-MM-DD)
 */
export function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0
  const birth = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return Math.max(0, age)
}