// components/DevFillButton.tsx
// COMPOSANT DE DEV UNIQUEMENT — supprimer avant production
// Ajouter dans Quiz.tsx juste avant le bouton "Next" de navigation

import { generateDevResponses } from '../lib/dev/devFill'

type DevProfile = 'exhausted_achiever' | 'balanced_optimizer' | 'inflamed_depleted' | 'longevity_focused'

interface DevFillButtonProps {
  onFill: (responses: Record<string, number>) => void
}

export function DevFillButton({ onFill }: DevFillButtonProps) {

  if (process.env.NODE_ENV === 'production') return null

  const profiles: DevProfile[] = [
    'exhausted_achiever',
    'balanced_optimizer',
    'inflamed_depleted',
    'longevity_focused',
  ]

  return (
  <>
    {/*
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-row gap-2">        cest ici lesboutonstest benoit 

      <p className="text-[9px] uppercase tracking-[0.2em] text-[#C7AC60]/60 mb-1">
        Dev — Fill Test Data
      </p>

      {profiles.map((profile) => (
        <button
          key={profile}
          onClick={() => onFill(generateDevResponses(profile))}
          className="px-3 py-2 rounded-lg bg-[#0A1724] border border-[#C7AC60]/30 text-[#C7AC60] text-[11px] uppercase tracking-[0.15em] hover:bg-[#C7AC60]/10 transition-all text-left"
        >
          {profile.replace(/_/g, ' ')}
        </button>
      ))}

    </div>
  */ }
  </>
)
}