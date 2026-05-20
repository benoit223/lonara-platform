'use client'

function StatCard({
  title,
  value,
  suffix,
  subtitle,
  badge,
  className = '',
}: {
  title: string
  value: string
  suffix?: string
  subtitle?: string
  badge: string
  className?: string
}) {
  return (
    <div
      className={`
        absolute
        z-30
        w-[240px]
        rounded-[30px]
        border border-cyan-400/15
        bg-[rgba(3,10,20,0.58)]
        px-7 py-6
        backdrop-blur-[28px]
        shadow-[0_0_80px_rgba(0,200,255,0.08)]
        overflow-hidden
        ${className}
      `}
    >
      {/* Glass highlight */}
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),transparent_42%)]" />

      <p className="relative text-[11px] uppercase tracking-[0.28em] text-white/45">
        {title}
      </p>

      <div className="relative mt-4 flex items-end gap-1">
        <span className="text-[68px] font-extralight leading-none tracking-[-0.05em] text-cyan-200">
          {value}
        </span>

        {suffix && (
          <span className="mb-2 text-[30px] text-cyan-100/60">
            {suffix}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="relative mt-2 text-[15px] text-white/50">
          {subtitle}
        </p>
      )}

      <div className="relative mt-5 inline-flex rounded-full bg-cyan-400/10 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-cyan-200">
        {badge}
      </div>
    </div>
  )
}

function BottomFeature({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div className="flex items-center gap-5">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/5">
        <div className="h-8 w-8 rounded-full border border-cyan-300/30" />
      </div>

      <div>
        <p className="text-[15px] uppercase tracking-[0.16em] text-white/90">
          {title}
        </p>

        <p className="mt-2 text-[15px] text-white/40">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export default function DNAHero() {
  return (
    <section className="relative min-h-screen overflow-visible bg-[#020817]">

      {/* ================================================= */}
      {/* GLOBAL BACKGROUND */}
      {/* ================================================= */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,255,0.12),transparent_48%)]" />

      <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />

      <div className="absolute right-[-250px] top-[-180px] h-[1100px] w-[1100px] rounded-full bg-cyan-400/10 blur-[220px]" />

      <div className="absolute left-[-200px] bottom-[-200px] h-[700px] w-[700px] rounded-full bg-blue-500/10 blur-[180px]" />

      {/* ================================================= */}
      {/* TOP NAVBAR */}
      {/* ================================================= */}

      <header className="absolute left-0 top-0 z-50 flex w-full items-center justify-between px-12 pt-8">

        {/* LOGO */}
        <div className="flex items-center gap-4">
          <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full border border-cyan-400/30">
            <span className="text-[28px] text-cyan-300">◌</span>
          </div>

          <div>
            <p className="text-[42px] font-light tracking-[0.22em] text-white">
              LONARA
            </p>

            <p className="mt-[-8px] text-sm tracking-[0.25em] text-cyan-300">
              LABS
            </p>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex items-center gap-16">
          {['SCIENCE', 'PLATFORM', 'REPORTS', 'RESEARCH'].map((item) => (
            <a
              key={item}
              className="text-[14px] tracking-[0.14em] text-white/80 transition hover:text-cyan-300"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <button className="rounded-full border border-cyan-400/30 bg-cyan-400/5 px-10 py-5 text-sm uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-cyan-400/10">
          Start Biological Assessment
        </button>
      </header>

      {/* ================================================= */}
      {/* MAIN LAYOUT */}
      {/* ================================================= */}

      <div className="relative flex min-h-[125vh] overflow-visible">
        {/* ================================================= */}
        {/* LEFT SIDE — 1/3 */}
        {/* ================================================= */}

        <div className="relative z-20 w-[34%] border-r border-cyan-400/10">

          <div className="absolute right-0 top-0 h-full w-px bg-cyan-400/10" />

          <div className="flex h-full flex-col justify-center px-[60px] pt-[100px]">

            {/* TAG */}
            <div className="mb-12 inline-flex w-fit items-center rounded-full border border-cyan-400/25 bg-cyan-400/5 px-6 py-3 text-sm uppercase tracking-[0.22em] text-cyan-300">
              + AI LONGEVITY INTELLIGENCE
            </div>

            {/* TITLE */}
            <h1 className="text-[108px] font-light leading-[0.9] tracking-[-0.07em] text-white">
              Decode your
              <br />
              biology.
              <br />

              <span className="text-cyan-300">
                Optimize your
                <br />
                future.
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-12 max-w-[520px] text-[26px] leading-[1.8] text-white/50">
              Lonara Labs transforms advanced science and AI into actionable
              longevity insights, helping you understand your biology and
              unlock your highest potential.
            </p>

            {/* BUTTON */}
            <button className="mt-14 flex w-fit items-center gap-4 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-10 py-6 text-sm uppercase tracking-[0.18em] text-cyan-200 transition-all duration-300 hover:bg-cyan-400/10">
              Start Biological Assessment
              <span className="text-xl">→</span>
            </button>

            {/* USERS */}
            <div className="mt-14 flex items-center gap-6">

              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-14 w-14 rounded-full border-2 border-[#020817] bg-white/20"
                  />
                ))}
              </div>

              <p className="text-[15px] uppercase tracking-[0.12em] text-cyan-300">
                JOIN 1,250+ OPTIMIZING THEIR BIOLOGY
              </p>
            </div>

            {/* FEATURES */}
            <div className="mt-20 grid grid-cols-2 gap-y-12">

              <BottomFeature
                title="AI Powered"
                subtitle="Advanced algorithms"
              />

              <BottomFeature
                title="Science Backed"
                subtitle="Evidence-based models"
              />

              <BottomFeature
                title="Private & Secure"
                subtitle="Your data is protected"
              />

              <BottomFeature
                title="Actionable Insights"
                subtitle="Clear steps, real impact"
              />
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* RIGHT SIDE — 2/3 */}
        {/* ================================================= */}

        <div className="relative w-[66%] overflow-visible">

          {/* ================================================= */}
          {/* DNA SYSTEM */}
          {/* ================================================= */}

          <div className="absolute left-[38%] top-[-6%] z-10 -translate-x-1/2">

            {/* ORBITS */}
            <div className="absolute left-1/2 top-1/2 h-[1350px] w-[1350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/5" />

            <div className="absolute left-1/2 top-1/2 h-[1050px] w-[1050px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/5" />

            <div className="absolute left-1/2 top-1/2 h-[780px] w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/5" />

            {/* CENTRAL GLOW */}
            <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-[180px]" />

            {/* DNA */}
            <img
              src="/dna.png"
              alt="DNA"
              className="
                relative
                z-20
                w-[900px]
                max-w-none
                object-contain
                drop-shadow-[0_0_140px_rgba(0,220,255,0.9)]
              "
            />
          </div>

          {/* ================================================= */}
          {/* HUMAN HUD */}
          {/* ================================================= */}

          <div className="absolute right-[6%] top-[19%] z-20">

            {/* RADAR */}
            <div className="absolute left-1/2 top-1/2 h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10" />

            <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10" />

            <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10" />

            {/* CROSSHAIR */}
            <div className="absolute left-1/2 top-[-280px] h-[820px] w-px -translate-x-1/2 bg-cyan-400/10" />

            <div className="absolute left-[-280px] top-1/2 h-px w-[820px] -translate-y-1/2 bg-cyan-400/10" />

            {/* GLOW */}
            <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-[110px]" />

            {/* HUMAN */}
            <img
              src="/human-hud.png"
              alt="Human HUD"
              className="
                relative
                z-20
                w-[430px]
                max-w-none
                object-contain
                drop-shadow-[0_0_120px_rgba(0,220,255,0.9)]
              "
            />
          </div>

          {/* ================================================= */}
          {/* CONNECTIONS */}
          {/* ================================================= */}

          {/* TOP LEFT */}
          <div className="absolute left-[15%] top-[26%] z-10">
            <div className="h-px w-[110px] bg-cyan-300/80" />

            <div className="absolute right-[-60px] top-0 h-[85px] w-px rotate-[-45deg] bg-cyan-300/80 origin-top" />

            <div className="absolute left-[-5px] top-[-5px] h-3 w-3 rounded-full border border-cyan-300 bg-[#06111d]" />
          </div>

          {/* BOTTOM LEFT */}
          <div className="absolute left-[22%] top-[72%] z-10">
            <div className="h-px w-[110px] bg-cyan-300/80" />

            <div className="absolute right-[-60px] top-[-85px] h-[85px] w-px rotate-[45deg] bg-cyan-300/80 origin-bottom" />

            <div className="absolute left-[-5px] top-[-5px] h-3 w-3 rounded-full border border-cyan-300 bg-[#06111d]" />
          </div>

          {/* TOP RIGHT */}
          <div className="absolute right-[17%] top-[28%] z-10">
            <div className="h-px w-[110px] bg-cyan-300/80" />

            <div className="absolute left-[60px] top-[-85px] h-[85px] w-px rotate-[45deg] bg-cyan-300/80 origin-bottom" />

            <div className="absolute right-[-5px] top-[-5px] h-3 w-3 rounded-full border border-cyan-300 bg-[#06111d]" />
          </div>

          {/* BOTTOM RIGHT */}
          <div className="absolute right-[23%] top-[75%] z-10">
            <div className="h-px w-[110px] bg-cyan-300/80" />

            <div className="absolute left-[60px] top-0 h-[85px] w-px rotate-[-45deg] bg-cyan-300/80 origin-top" />

            <div className="absolute right-[-5px] top-[-5px] h-3 w-3 rounded-full border border-cyan-300 bg-[#06111d]" />
          </div>

   {/* ULTRA PREMIUM FLOATING STATS */}

{/* TOP LEFT */}
<div className="absolute left-[18%] top-[20%] z-30">

  <p className="text-[12px] uppercase tracking-[0.18em] text-white/45">
    Longevity Score
  </p>

  <div className="mt-2 flex items-end">
    <span className="text-[82px] font-extralight leading-none tracking-[-0.08em] text-white">
      87
    </span>

    <span className="mb-[12px] ml-1 text-[30px] text-white/45">
      /100
    </span>
  </div>

  <div className="mt-2 inline-flex rounded-md border border-cyan-400/20 bg-cyan-400/10 px-3 py-[5px] text-[10px] uppercase tracking-[0.16em] text-cyan-200 backdrop-blur-xl">
    Optimal
  </div>
</div>

{/* TOP RIGHT */}
<div className="absolute right-[10%] top-[13%] z-30 text-right">

  <p className="text-[12px] uppercase tracking-[0.18em] text-white/45">
    Biological Age
  </p>

  <div className="mt-2">
    <span className="text-[82px] font-extralight leading-none tracking-[-0.08em] text-white">
      29
    </span>

    <p className="mt-[-2px] text-[18px] text-white/35">
      years
    </p>
  </div>

  <div className="mt-2 inline-flex rounded-md border border-cyan-400/20 bg-cyan-400/10 px-3 py-[5px] text-[10px] uppercase tracking-[0.16em] text-cyan-200 backdrop-blur-xl">
    Optimal
  </div>
</div>

{/* BOTTOM LEFT */}
<div className="absolute left-[20%] top-[68%] z-30">

  <p className="text-[12px] uppercase tracking-[0.18em] text-white/45">
    Recovery Capacity
  </p>

  <div className="mt-2 flex items-end">
    <span className="text-[82px] font-extralight leading-none tracking-[-0.08em] text-white">
      92
    </span>

    <span className="mb-[10px] text-[32px] text-white/45">
      %
    </span>
  </div>

  <div className="mt-2 inline-flex rounded-md border border-cyan-400/20 bg-cyan-400/10 px-3 py-[5px] text-[10px] uppercase tracking-[0.16em] text-cyan-200 backdrop-blur-xl">
    Optimal
  </div>
</div>

{/* BOTTOM RIGHT */}
<div className="absolute right-[7%] top-[67%] z-30 text-right">

  <p className="text-[12px] uppercase tracking-[0.18em] text-white/45">
    Inflammation Index
  </p>

  <div className="mt-2 flex items-end justify-end">
    <span className="text-[82px] font-extralight leading-none tracking-[-0.08em] text-white">
      18
    </span>

    <span className="mb-[12px] ml-1 text-[30px] text-white/45">
      /100
    </span>
  </div>

  <div className="mt-2 inline-flex rounded-md border border-cyan-400/20 bg-cyan-400/10 px-3 py-[5px] text-[10px] uppercase tracking-[0.16em] text-cyan-200 backdrop-blur-xl">
    Low
  </div>
</div>
</div>
</div>
    </section>
  )
}