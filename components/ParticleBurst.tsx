'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Zap, Sparkles, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  icon: any
  color: string
  rotation: number
  scale: number
}

interface ParticleBurstProps {
  trigger: boolean
  x?: number
  y?: number
}

export default function ParticleBurst({ trigger, x = 0, y = 0 }: ParticleBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (trigger) {
      // Create 12 particles in a burst pattern
      const newParticles: Particle[] = []
      const icons = [Coffee, Zap, Sparkles, Star]
      const colors = ['#00ffff', '#ff00ff', '#b000ff', '#ffff00']

      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2
        const distance = 100 + Math.random() * 50
        const velocity = 1 + Math.random() * 0.5

        newParticles.push({
          id: Date.now() + i,
          x: Math.cos(angle) * distance * velocity,
          y: Math.sin(angle) * distance * velocity,
          icon: icons[Math.floor(Math.random() * icons.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
        })
      }

      setParticles(newParticles)

      // Clear particles after animation
      setTimeout(() => setParticles([]), 1500)
    }
  }, [trigger])

  return (
    <div className="fixed inset-0 pointer-events-none z-50" style={{ left: x, top: y }}>
      <AnimatePresence>
        {particles.map((particle) => {
          const Icon = particle.icon
          return (
            <motion.div
              key={particle.id}
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 1, 
                scale: particle.scale,
                rotate: particle.rotation 
              }}
              animate={{
                x: particle.x,
                y: particle.y,
                opacity: 0,
                scale: 0,
                rotate: particle.rotation + 360,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute"
              style={{ left: '50%', top: '50%' }}
            >
              <Icon
                className="w-6 h-6"
                style={{
                  color: particle.color,
                  filter: `drop-shadow(0 0 10px ${particle.color})`,
                }}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}


