'use client'

type MembershipLandingProps = {
  onSelect: (tier: 'regular' | 'pro') => void
  onBack: () => void
}

const tierDetails: Record<
  'regular' | 'pro',
  { title: string; description: string; perks: string[] }
> = {
  regular: {
    title: 'Regular Member',
    description:
      'A streamlined longevity assessment with practical recommendations and a simple report experience.',
    perks: [
      'Essential insights',
      'Fast biological report',
      'Actionable optimization guidance',
    ],
  },
  pro: {
    title: 'Pro Member',
    description:
      'Advanced profiling with deep biological intelligence, complex protocols, and premium analytics.',
    perks: [
      'Full-system biomarker view',
      'Complex report mode',
      'Enhanced longevity pathways',
    ],
  },
}

export default function MembershipLanding({
  onSelect,
  onBack,
}: MembershipLandingProps) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#02060D] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,180,255,0.14),transparent_35%)]" />
      <div className="absolute left-[-140px] top-[-160px] h-[250px] w-[250px] rounded-full bg-[#035AA8]/10 blur-[130px]" />
      <div className="absolute right-[-120px] bottom-[-120px] h-[220px] w-[220px] rounded-full bg-[#C7AC60]/10 blur-[110px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-[1180px] rounded-[1.8rem] border border-[#035AA8]/14 bg-[rgba(3,10,20,0.72)] backdrop-blur-[20px] p-10 shadow-[0_0_50px_rgba(3,90,168,0.10)]">
          <div className="mb-10 max-w-[760px]">
            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#C7AC60]/85">
              BIOLOGICAL MEMBERSHIP
            </p>
            <h1
              className="mt-3 text-[2.8rem] md:text-[3.4rem] font-extralight leading-[1.05] tracking-[0.01em] text-[#EAE4D5]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Choose your Lonara pathway
            </h1>
            <p className="mt-4 text-[13px] leading-[1.8] text-white/60">
              Select the membership tier that best fits your personalised longevity journey. Regular membership provides a streamlined assessment experience and practical insights, while Pro membership unlocks the full Lonara ecosystem with deeper intelligence and premium reporting.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {(['regular', 'pro'] as const).map((tier) => {
              const details = tierDetails[tier]
              return (
                <div
                  key={tier}
                  className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-8 shadow-[0_0_30px_rgba(0,0,0,0.18)] transition-all hover:border-[#C7AC60]/20 hover:bg-[rgba(255,255,255,0.06)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(199,172,96,0.08),transparent_75%)] pointer-events-none" />
                  <div className="relative z-10">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-[#C7AC60]/70 mb-4">
                      {tier === 'pro' ? 'Premium Access' : 'Core Access'}
                    </p>
                    <h2
                      className="text-[2.1rem] font-semibold text-[#EAE4D5] mb-4"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      {details.title}
                    </h2>
                    <p className="text-[14px] leading-[1.9] text-white/55 mb-8">
                      {details.description}
                    </p>
                    <ul className="space-y-3 mb-8 text-[13px] text-white/70">
                      {details.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-3">
                          <span className="mt-1 text-[#C7AC60]">▹</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => onSelect(tier)}
                      className="inline-flex items-center justify-center rounded-full border border-[#C7AC60]/25 bg-[#C7AC60]/8 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#EAE4D5] transition hover:bg-[#C7AC60]/15"
                    >
                      {tier === 'pro' ? 'Unlock Pro' : 'Choose Regular'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onBack}
              className="text-[#EAE4D5]/80 transition hover:text-[#C7AC60]"
            >
              Back to homepage
            </button>
            <p className="max-w-[580px] text-[13px] leading-[1.7] text-white/60">
              Select a membership tier and continue to the assessment flow with the same Lonara design language and premium interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
