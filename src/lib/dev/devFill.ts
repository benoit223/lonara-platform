// lib/dev/devFill.ts
// Données de test réalistes — À SUPPRIMER AVANT PRODUCTION
// Simule un profil "performeur épuisé" : bon physiquement, mauvais sommeil/stress

import { questions } from '../../data/questions'

// Profils de test disponibles
type DevProfile =
  | 'exhausted_achiever'
  | 'balanced_optimizer'
  | 'inflamed_depleted'
  | 'longevity_focused'

// Valeurs par catégorie pour chaque profil
// 0 = meilleur, 4 = pire
const PROFILE_BIAS: Record<string, Record<string, [number, number]>> = {

  exhausted_achiever: {
    // Bon
    exercise:       [0, 1],
    mobility:       [0, 1],
    performance:    [0, 2],
    cognition:      [0, 2],
    nutrition:      [0, 2],
    // Mauvais
    sleep:          [3, 4],
    stress:         [3, 4],
    emotional:      [2, 4],
    recovery:       [2, 3],
    energy:         [2, 3],
    social:         [2, 3],
    purpose:        [1, 3],
    // Moyen
    inflammation:   [1, 3],
    gut:            [1, 3],
    immune:         [1, 2],
    cardiovascular: [1, 2],
    hormonal:       [1, 3],
    metabolism:     [1, 2],
    circadian:      [2, 4],
    aging:          [1, 3],
    resilience:     [1, 3],
    mindset:        [1, 3],
    longevity:      [1, 2],
    lifestyle:      [2, 3],
    detox:          [1, 2],
    environment:    [1, 2],
    family:         [1, 3],
    skin:           [1, 3],
    sexual:         [1, 2],
    biohacking:     [0, 2],
    advanced:       [0, 2],
    wellness:       [2, 3],
  },

  balanced_optimizer: {
    // Tout modéré
    sleep:          [1, 3],
    stress:         [1, 3],
    energy:         [0, 1],
    cognition:      [0, 1],
    exercise:       [1, 2],
    mobility:       [1, 2],
    recovery:       [1, 2],
    gut:            [1, 3],
    inflammation:   [1, 2],
    immune:         [1, 2],
    cardiovascular: [1, 2],
    hormonal:       [1, 2],
    metabolism:     [1, 2],
    circadian:      [1, 3],
    emotional:      [1, 2],
    social:         [1, 2],
    nutrition:      [1, 2],
    biohacking:     [0, 1],
    aging:          [1, 2],
    lifestyle:      [1, 2],
    performance:    [1, 2],
    detox:          [1, 2],
    skin:           [0, 1],
    sexual:         [1, 2],
    environment:    [1, 2],
    family:         [1, 2],
    resilience:     [1, 2],
    mindset:        [0, 2],
    purpose:        [0, 2],
    advanced:       [0, 2],
    wellness:       [1, 2],
    longevity:      [0, 2],
  },

  inflamed_depleted: {
    // Très mauvais
    inflammation:   [3, 4],
    gut:            [3, 4],
    immune:         [2, 4],
    sleep:          [3, 4],
    stress:         [3, 4],
    energy:         [3, 4],
    recovery:       [3, 4],
    emotional:      [2, 4],
    // Moyen
    cognition:      [2, 3],
    metabolism:     [2, 3],
    hormonal:       [2, 3],
    cardiovascular: [1, 3],
    // Pas trop mal
    exercise:       [1, 2],
    mobility:       [1, 2],
    nutrition:      [1, 3],
    circadian:      [2, 4],
    social:         [1, 3],
    aging:          [2, 3],
    resilience:     [2, 3],
    mindset:        [1, 3],
    purpose:        [1, 3],
    lifestyle:      [2, 3],
    performance:    [2, 3],
    detox:          [2, 3],
    skin:           [2, 3],
    sexual:         [2, 3],
    environment:    [1, 3],
    family:         [2, 3],
    biohacking:     [0, 2],
    advanced:       [0, 2],
    wellness:       [2, 4],
    longevity:      [1, 3],
  },

longevity_focused: {
    sleep:          [0, 1],
    stress:         [0, 1],
    energy:         [0, 1],
    cognition:      [0, 1],
    exercise:       [0, 1],
    recovery:       [0, 1],
    longevity:      [3, 4],
    aging:          [3, 4],
    immune:         [2, 3],
    inflammation:   [2, 3],
    gut:            [1, 2],
    hormonal:       [1, 2],
    cardiovascular: [1, 2],
    metabolism:     [1, 2],
    circadian:      [1, 2],
    emotional:      [1, 2],
    social:         [1, 2],
    nutrition:      [1, 2],
    mobility:       [0, 1],
    performance:    [0, 1],
    resilience:     [1, 2],
    mindset:        [0, 1],
    purpose:        [0, 1],
    lifestyle:      [1, 2],
    detox:          [1, 2],
    skin:           [0, 1],
    sexual:         [1, 2],
    environment:    [1, 2],
    family:         [1, 2],
    biohacking:     [0, 1],
    advanced:       [0, 1],
    wellness:       [1, 2],
  },

}



function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateDevResponses(
  profile: DevProfile = 'exhausted_achiever',
): Record<string, number> {
  const responses: Record<string, number> = {}
  const bias = PROFILE_BIAS[profile]

  for (const question of questions) {
    let value: number

    if (bias && bias[question.category]) {
      const [min, max] = bias[question.category]
      value = randomInt(min, max)
    } else {
      // Catégorie non définie dans le profil → valeur aléatoire modérée
      value = randomInt(1, 3)
    }

    responses[question.id] = value
  }

  return responses
}