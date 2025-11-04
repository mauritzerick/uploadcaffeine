'use client'

import { useState, useEffect, useRef } from 'react'
import Hero from '@/components/Hero'
import About from '@/components/About'
import GoalProgress from '@/components/GoalProgress'
import CoffeeOptions from '@/components/CoffeeOptions'
import Supporters from '@/components/Supporters'
import Footer from '@/components/Footer'
import DailyQuote from '@/components/DailyQuote'
import TipStreak from '@/components/TipStreak'
import AmbientAgent from '@/components/AmbientAgent'
import StoicAgent from '@/components/StoicAgent'
import NeonRadio from '@/components/NeonRadio'
import MatrixRain from '@/components/MatrixRain'
import TerminalConsole from '@/components/TerminalConsole'
import DeviceHologram from '@/components/DeviceHologram'
import FeaturesMenu from '@/components/FeaturesMenu'
import FlyingCoffeeMugs from '@/components/effects/FlyingCoffeeMugs'
import QRCodeBanner from '@/components/QRCodeBanner'
import GlitchAgent from '@/components/GlitchAgent'
import { useFeatureFlagsContext } from '@/providers/FeatureFlagsProvider'
import { useCoffeeMugEasterEgg } from '@/hooks/useCoffeeMugEasterEgg'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [matrixMode, setMatrixMode] = useState(false)
  const konamiIndexRef = useRef(0)
  const mKeyPressesRef = useRef(0)
  const mKeyTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { isEnabled } = useFeatureFlagsContext()
  const { isTriggered: coffeeMugTriggered } = useCoffeeMugEasterEgg()

  useEffect(() => {
    setMounted(true)

    // Konami code detection
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

    const handleKeyDown = (e: KeyboardEvent) => {
      // Simple trigger: Press 'M' key 3 times quickly
      if (e.key.toLowerCase() === 'm' && isEnabled('matrix_rain')) {
        mKeyPressesRef.current++
        
        if (mKeyTimerRef.current) {
          clearTimeout(mKeyTimerRef.current)
        }
        
        if (mKeyPressesRef.current >= 3) {
          setMatrixMode(true)
          mKeyPressesRef.current = 0
          console.log('🎮 Matrix Mode Activated! (MMM)')
        } else {
          // Reset count after 1 second
          mKeyTimerRef.current = setTimeout(() => {
            mKeyPressesRef.current = 0
          }, 1000)
        }
      }

      // Konami code
      if (e.key === konamiCode[konamiIndexRef.current] && isEnabled('matrix_rain')) {
        konamiIndexRef.current++
        console.log(`Konami progress: ${konamiIndexRef.current}/${konamiCode.length}`)
        if (konamiIndexRef.current === konamiCode.length) {
          setMatrixMode(true)
          konamiIndexRef.current = 0
          console.log('🎮 Matrix Mode Activated! (Konami Code)')
        }
      } else {
        konamiIndexRef.current = 0
      }
    }

    // Listen for custom events from terminal
    const handleToggleMatrix = () => {
      if (isEnabled('matrix_rain')) {
        setMatrixMode((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('toggle-matrix-mode', handleToggleMatrix as EventListener)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('toggle-matrix-mode', handleToggleMatrix as EventListener)
      if (mKeyTimerRef.current) {
        clearTimeout(mKeyTimerRef.current)
      }
    }
  }, [isEnabled])

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-[#0a0a14]">
      {/* QR Code Banner */}
      <QRCodeBanner />
      
      {/* Features Menu */}
      <FeaturesMenu />
      
      {/* Matrix Rain Easter Egg */}
      {isEnabled('matrix_rain') && (
        <MatrixRain isActive={matrixMode} onClose={() => setMatrixMode(false)} />
      )}
      
      {/* Flying Coffee Mugs Easter Egg */}
      <FlyingCoffeeMugs trigger={coffeeMugTriggered} count={90} />
      
      {/* Tip Streak Indicator */}
      <TipStreak />
      
      {/* Ambient AI Agents - Positioned around Hero message */}
      {isEnabled('ai_agents') && (
        <>
          <AmbientAgent 
            icon="coffee" 
            initialPosition={{ 
              x: typeof window !== 'undefined' 
                ? window.innerWidth < 768 
                  ? 20  // Mobile: far left
                  : window.innerWidth < 1024
                  ? (window.innerWidth / 2) - 250  // Tablet: closer to center
                  : (window.innerWidth / 2) - 400  // Desktop: far left
                : 300, 
              y: typeof window !== 'undefined' 
                ? window.innerWidth < 768
                  ? window.innerHeight / 2  // Mobile: center height
                  : (window.innerHeight / 2) - 50  // Desktop: slightly above center
                : 300 
            }} 
          />
          <AmbientAgent 
            icon="cpu" 
            initialPosition={{ 
              x: typeof window !== 'undefined' 
                ? window.innerWidth < 768 
                  ? window.innerWidth - 80  // Mobile: far right
                  : window.innerWidth < 1024
                  ? (window.innerWidth / 2) + 180  // Tablet: closer to center
                  : (window.innerWidth / 2) + 320  // Desktop: far right
                : 800, 
              y: typeof window !== 'undefined' 
                ? window.innerWidth < 768
                  ? window.innerHeight / 2  // Mobile: center height
                  : (window.innerHeight / 2) - 50  // Desktop: slightly above center
                : 300 
            }} 
          />
          <StoicAgent 
            initialPosition={{ 
              x: typeof window !== 'undefined' 
                ? window.innerWidth < 768 
                  ? window.innerWidth / 2 - 24  // Mobile: center
                  : window.innerWidth < 1024
                  ? (window.innerWidth / 2) - 24  // Tablet: center
                  : (window.innerWidth / 2) - 24  // Desktop: center bottom
                : 500, 
              y: typeof window !== 'undefined' 
                ? window.innerWidth < 768
                  ? window.innerHeight - 150  // Mobile: near bottom
                  : window.innerHeight - 120  // Desktop: bottom
                : 600 
            }} 
          />
        </>
      )}
      
      {/* Terminal Console */}
      {isEnabled('terminal_console') && <TerminalConsole />}
      
      {/* Glitch Agent Button */}
      <GlitchAgent />
      
      <Hero />
      
      {/* Daily Quote */}
      <section className="py-8 px-4 bg-gradient-to-br from-[#0a0a14] via-[#0d0015] to-[#0a0a14]">
        <div className="max-w-6xl mx-auto">
          <DailyQuote />
        </div>
      </section>
      
      {/* Neon Radio - Vibe Mode */}
      <section className="py-12 px-4 bg-gradient-to-br from-[#0a0a14] via-[#0d0015] to-[#0a0a14] relative overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 grid-bg opacity-10" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <NeonRadio />
        </div>
      </section>
      
      {/* Goal Progress Bar */}
      <section className="py-12 px-4 bg-gradient-to-br from-[#0a0a14] via-[#0d0015] to-[#0a0a14]">
        <div className="max-w-6xl mx-auto">
          <GoalProgress />
        </div>
      </section>

      <CoffeeOptions />
      
      <About />
      <Supporters />
      <Footer />
    </main>
  )
}
