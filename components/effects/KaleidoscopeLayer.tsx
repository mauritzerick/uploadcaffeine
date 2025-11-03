'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EFFECTS_CONFIG } from '@/lib/effectsConfig'

interface KaleidoscopeLayerProps {
  trigger: boolean
  intensity?: 'low' | 'med' | 'high'
  onComplete?: () => void
}

export default function KaleidoscopeLayer({ trigger, intensity = 'med', onComplete }: KaleidoscopeLayerProps) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)
      
      const config = EFFECTS_CONFIG.kaleidoscope
      setTimeout(() => {
        setIsActive(false)
        onComplete?.()
      }, config.duration)
    }
  }, [trigger, isActive, onComplete])

  if (!isActive) return null

  const mirrors = EFFECTS_CONFIG.kaleidoscope.intensity[intensity]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 pointer-events-none z-[9996]"
        style={{
          mixBlendMode: 'screen',
          overflow: 'hidden',
        }}
      >
        {/* Rotating gradient background */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            background: `conic-gradient(
              from 0deg,
              rgba(0, 255, 255, 0.3) 0deg,
              rgba(255, 0, 255, 0.3) 90deg,
              rgba(255, 255, 0, 0.3) 180deg,
              rgba(0, 255, 255, 0.3) 270deg,
              rgba(0, 255, 255, 0.3) 360deg
            )`,
          }}
        />

        {/* Mirror segments */}
        {Array.from({ length: mirrors }).map((_, i) => {
          const angle = (360 / mirrors) * i

          return (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{
                transformOrigin: 'center',
                transform: `rotate(${angle}deg)`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.1,
                type: 'spring',
                stiffness: 200,
              }}
            >
              {/* Mirror line */}
              <div
                className="absolute top-0 left-1/2 w-0.5 h-full"
                style={{
                  background: 'linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.5), transparent)',
                  boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                }}
              />
            </motion.div>
          )
        })}

        {/* Central glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div
            className="w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, transparent 70%)',
              boxShadow: '0 0 60px rgba(0, 255, 255, 0.6), inset 0 0 60px rgba(0, 255, 255, 0.3)',
            }}
          />
        </motion.div>

        {/* Overlay message */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-cyan-400 font-mono text-sm uppercase tracking-wider"
            style={{
              textShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
            }}
          >
            ✨ Kaleidoscope Mode Active ✨
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}


