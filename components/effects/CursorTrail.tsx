'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EFFECTS_CONFIG } from '@/lib/effectsConfig'

interface TrailDot {
  id: string
  x: number
  y: number
  timestamp: number
  hue: number // Rainbow color position (0-360)
  type: 'circle' | 'star' | 'sparkle' | 'hex'
}

interface CursorTrailProps {
  enabled: boolean
  intensity?: 'low' | 'med' | 'high'
}

const PARTICLE_TYPES = ['circle', 'star', 'sparkle', 'hex'] as const

export default function CursorTrail({ enabled, intensity = 'med' }: CursorTrailProps) {
  const [dots, setDots] = useState<TrailDot[]>([])
  const dotsRef = useRef<TrailDot[]>([])
  const rafRef = useRef<number>()
  const lastUpdateRef = useRef(0)

  const trailLength = EFFECTS_CONFIG.cursorTrail.intensity[intensity] * 2 // Double for more dramatic effect
  const hueRef = useRef(0) // Rainbow hue counter

  const updateDots = useCallback(() => {
    const now = Date.now()
    // Remove old dots (older than 800ms for longer trail)
    const filtered = dotsRef.current.filter(dot => now - dot.timestamp < 800)
    
    if (filtered.length !== dotsRef.current.length) {
      dotsRef.current = filtered
      setDots([...filtered])
    }

    // Cycle rainbow hue
    hueRef.current = (hueRef.current + 2) % 360

    rafRef.current = requestAnimationFrame(updateDots)
  }, [])

  useEffect(() => {
    if (!enabled) {
      setDots([])
      dotsRef.current = []
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      return
    }

    // Check if mobile (disable on touch devices)
    const isMobile = typeof window !== 'undefined' && 
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    
    if (isMobile) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      
      // Throttle updates to every 10ms for smoother trail
      if (now - lastUpdateRef.current < 10) return
      lastUpdateRef.current = now

      const newDot: TrailDot = {
        id: `dot-${now}-${Math.random()}`,
        x: e.clientX,
        y: e.clientY,
        timestamp: now,
        hue: hueRef.current, // Current rainbow position
        type: PARTICLE_TYPES[Math.floor(Math.random() * PARTICLE_TYPES.length)], // Random particle type
      }

      // Add new dot and limit array length
      dotsRef.current = [newDot, ...dotsRef.current].slice(0, trailLength)
      setDots([...dotsRef.current])
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(updateDots)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [enabled, trailLength, updateDots])

  if (!enabled || dots.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9997]">
      <AnimatePresence>
        {dots.map((dot, index) => {
          const age = Date.now() - dot.timestamp
          const opacity = Math.max(0, 1 - age / 800)
          const scale = 1 - index * 0.03
          
          // Rainbow color based on hue
          const hue = (dot.hue + index * 15) % 360 // Shift hue for each particle
          const color = `hsl(${hue}, 100%, 60%)`
          const shadowColor = `hsla(${hue}, 100%, 70%, 0.8)`
          
          // Size based on particle type
          const sizes = {
            circle: 'w-4 h-4',
            star: 'w-5 h-5',
            sparkle: 'w-3 h-3',
            hex: 'w-4 h-4',
          }
          
          const size = sizes[dot.type]

          return (
            <motion.div
              key={dot.id}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{ 
                opacity: opacity * 0.9,
                scale: scale,
                rotate: dot.type === 'star' || dot.type === 'sparkle' ? [0, 360] : 0,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                duration: 0.15,
                rotate: { duration: 0.8, repeat: Infinity, ease: 'linear' },
              }}
              className={`absolute ${size}`}
              style={{
                left: dot.x - (dot.type === 'star' ? 10 : 8),
                top: dot.y - (dot.type === 'star' ? 10 : 8),
              }}
            >
              {/* Main particle with shape */}
              {dot.type === 'circle' && (
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${color} 0%, ${color}88 50%, transparent 100%)`,
                    boxShadow: `0 0 20px ${shadowColor}, 0 0 40px ${shadowColor}, inset 0 0 10px ${shadowColor}`,
                  }}
                />
              )}
              
              {dot.type === 'star' && (
                <div
                  className="w-full h-full"
                  style={{
                    background: color,
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                    filter: `drop-shadow(0 0 8px ${shadowColor}) drop-shadow(0 0 16px ${shadowColor})`,
                  }}
                />
              )}
              
              {dot.type === 'sparkle' && (
                <div className="relative w-full h-full">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: color,
                      clipPath: 'polygon(50% 0%, 55% 40%, 100% 50%, 55% 60%, 50% 100%, 45% 60%, 0% 50%, 45% 40%)',
                      filter: `drop-shadow(0 0 10px ${shadowColor})`,
                    }}
                  />
                </div>
              )}
              
              {dot.type === 'hex' && (
                <div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                    boxShadow: `0 0 15px ${shadowColor}, inset 0 0 8px ${shadowColor}`,
                  }}
                />
              )}
              
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  background: `radial-gradient(circle, transparent 40%, ${shadowColor} 70%, transparent 100%)`,
                  filter: 'blur(2px)',
                }}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

