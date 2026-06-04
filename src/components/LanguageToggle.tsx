'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'es', label: 'ES' },
]

export default function LanguageToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    // Remplace le segment de langue dans l'URL
    const segments = pathname.split('/')
    // segments[1] est toujours la locale (/en, /fr, /es)
    if (segments.length >= 2) {
      segments[1] = newLocale
    }
    router.push(segments.join('/') || `/${newLocale}`)
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-1 py-1">
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] transition-all ${
            locale === code
              ? 'bg-[#C7AC60]/20 text-[#E7D19A]'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}