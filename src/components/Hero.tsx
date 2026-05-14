'use client'

import { useState } from 'react'

interface HeroProps {
  onStart: (
    name: string,
    email: string,
  ) => void
}

export default function Hero({ onStart }: HeroProps) {
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [error, setError] = useState('')


  return (
    <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
      {/* LEFT SIDE */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-4 mb-10">
          <img
            src="/lonara-logo.png"
            alt="Lonara"
            className="h-20 w-auto"
          />

          <div>
            <p className="text-white text-2xl font-semibold tracking-wide">
              Lonara Labs
            </p>

            <p className="text-cyan-300 text-sm tracking-[0.2em] uppercase mt-1">
              Biological Profiling Platform
            </p>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-6xl xl:text-7xl leading-[1.05] font-semibold text-white max-w-3xl">
          Personalized longevity protocols powered by biological profiling.
        </h1>

        {/* Description */}
        <p className="mt-8 text-xl leading-relaxed text-white/60 max-w-2xl">
          Lonara analyzes your biological patterns across energy,
          recovery, cognition, sleep, stress adaptation,
          inflammation and longevity markers to generate a
          personalized optimization protocol.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-4 mt-10">
          {[
            'Biological Scoring',
            'Longevity Analysis',
            'Protocol Generation',
            'AI Optimization',
            'Recovery Insights',
          ].map((item) => (
            <div
              key={item}
              className="px-5 py-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 text-sm"
            >
              {item}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-5 mt-12">
          <button
          onClick={() => onStart(name, email)}
            className="px-8 py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold text-lg transition-all hover:scale-[1.02]"
          >
            Start Biological Assessment
          </button>

          <a
            href="https://www.lonaralabs.com"
            target="_blank"
            className="px-8 py-5 rounded-2xl border border-white/10 bg-white/[0.04] text-white/80 font-medium hover:bg-white/[0.08] transition-all"
          >
            Visit Website
          </a>
        </div>

        {/* Footer Info */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-semibold text-white">
              135+
            </p>

            <p className="text-sm text-white/50 mt-2">
              Biological markers analyzed
            </p>
          </div>

          <div>
            <p className="text-3xl font-semibold text-white">
              AI
            </p>

            <p className="text-sm text-white/50 mt-2">
              Protocol generation engine
            </p>
          </div>

          <div>
            <p className="text-3xl font-semibold text-white">
              Premium
            </p>

            <p className="text-sm text-white/50 mt-2">
              Longevity optimization experience
            </p>
          </div>

          <div>
            <p className="text-3xl font-semibold text-white">
              Dynamic
            </p>

            <p className="text-sm text-white/50 mt-2">
              Personalized biological scoring
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-10 shadow-2xl shadow-cyan-500/10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-cyan-300 uppercase tracking-[0.2em] text-xs mb-3">
              Client Intake
            </p>

            <h2 className="text-3xl font-semibold text-white">
              Begin Your Biological Profiling
            </h2>
          </div>

          
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-white/60 mb-3">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-3">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-3">
              Longevity Goal
            </label>

            <select
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white focus:outline-none focus:border-cyan-400/50"
            >
              <option>Optimize energy</option>
              <option>Improve sleep</option>
              <option>Reduce stress</option>
              <option>Increase performance</option>
              <option>Healthy aging</option>
              <option>Longevity optimization</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-3">
              Current Health Priority
            </label>

            <textarea
              placeholder="Describe your current goals, symptoms or health priorities"
              rows={5}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 resize-none"
            />
          </div>

          {/* Assessment Preview */}
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5 mt-8">
            <p className="text-cyan-200 text-sm leading-relaxed">
              Your assessment includes:
            </p>

            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>• 135+ biological profiling questions</li>
              <li>• Longevity optimization scoring</li>
              <li>• Personalized supplement recommendations</li>
              <li>• Recovery and stress analysis</li>
              <li>• AI-powered protocol generation</li>
            </ul>
          </div>

          {/* CTA */}
            {error && (
                <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
                 {error}
               </div>
            )}


          <button
             onClick={() => {
               if (!name || !email) {
                 setError(
                   'Please complete your full name and email address before starting the assessment.',
                 )
                 return
               }

               setError('')
                onStart(name, email)
         }}
            className="w-full mt-8 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 py-5 text-black font-semibold text-lg transition-all hover:scale-[1.01]"
          >
            Launch Assessment
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-sm text-white/40">
          <p>www.lonaralabs.com</p>

          <p>Lonara Longevity Intelligence Platform</p>
        </div>

        <div className="mt-6 text-center text-xs text-white/30 tracking-wide">
          All rights reserved — Lonara Labs 2026
        </div>
      </div>
    </div>
  )
}