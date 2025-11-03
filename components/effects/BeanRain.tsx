'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EFFECTS_CONFIG } from '@/lib/effectsConfig'
import { trackEvent } from '@/lib/analytics'

interface Particle {
  id: string
  x: number
  emoji: string
  delay: number
}

interface BeanRainProps {
  trigger: boolean
  intensity?: 'low' | 'med' | 'high'
  onComplete?: () => void
}

const BEAN_EMOJIS = ['☕', '🫘', '💎', '⚡', '✨', '💫', '🌟']

export default function BeanRain({ trigger, intensity = 'med', onComplete }: BeanRainProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  const createParticles = useCallback(() => {
    const config = EFFECTS_CONFIG.beanRain
    const count = config.intensity[intensity]
    
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: `bean-${Date.now()}-${i}`,
      x: Math.random() * 100, // percentage
      emoji: BEAN_EMOJIS[Math.floor(Math.random() * BEAN_EMOJIS.length)],
      delay: Math.random() * 0.5, // stagger animation
    }))

    setParticles(newParticles)
    setIsActive(true)
    trackEvent('bean_rain_emit', { intensity, count })

    // Clear after duration
    setTimeout(() => {
      setParticles([])
      setIsActive(false)
      onComplete?.()
    }, config.duration + 500)
  }, [intensity, onComplete])

  useEffect(() => {
    if (trigger && !isActive) {
      createParticles()
    }
  }, [trigger, isActive, createParticles])

  if (!isActive || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              y: -50, 
              x: `${particle.x}vw`, 
              opacity: 0,
              scale: 0.5,
              rotate: 0,
            }}
            animate={{
              y: '105vh',
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.5],
              rotate: [0, 360, 720],
            }}
            transition={{
              duration: 1.5,
              delay: particle.delay,
              ease: 'easeIn',
            }}
            className="absolute text-4xl"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))',
              textShadow: '0 0 20px rgba(0, 255, 255, 0.6)',
            }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}


