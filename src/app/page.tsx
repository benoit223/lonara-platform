'use client'

import { useState } from 'react'

import Hero from '../components/Hero'
import Quiz from '../components/Quiz'
import Results from '../components/Results'

export default function Home() {
  const [started, setStarted] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')

  const [showResults, setShowResults] = useState(false)

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,180,255,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.15),transparent_35%)]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
        {!started ? (
          <Hero
             onStart={(name, mail) => {
                setFullName(name)
                setEmail(mail)
                setStarted(true)
             }}
        />
       
     
        ) : (
          <Quiz
            fullName={fullName}
            email={email}
        />
        )}
      </div>
    </main>
  )
}