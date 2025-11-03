'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EFFECTS_CONFIG } from '@/lib/effectsConfig'

interface ScreenFractureProps {
  trigger: boolean
  intensity?: 'low' | 'med' | 'high'
}

export default function ScreenFracture({ trigger, intensity = 'med' }: ScreenFractureProps) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)
      
      const config = EFFECTS_CONFIG.fracture
      setTimeout(() => {
        setIsActive(false)
      }, config.duration)
    }
  }, [trigger, isActive])

  if (!isActive) return null

  const intensityValue = EFFECTS_CONFIG.fracture.intensity[intensity]
  const sliceCount = Math.floor(8 * intensityValue)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{ mixBlendMode: 'difference' }}
      >
        <svg
          width="100%"
          height="100%"
          className="absolute inset-0"
          style={{ filter: 'url(#fracture-filter)' }}
        >
          <defs>
            <filter id="fracture-filter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency={0.01 * intensityValue}
                numOctaves={3}
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={50 * intensityValue}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          {/* Fracture lines */}
          {Array.from({ length: sliceCount }).map((_, i) => {
            const angle = (360 / sliceCount) * i
            const length = 50 + Math.random() * 50
            
            return (
              <motion.line
                key={i}
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${Math.cos((angle * Math.PI) / 180) * length}%)`}
                y2={`calc(50% + ${Math.sin((angle * Math.PI) / 180) * length}%)`}
                stroke="rgba(0, 255, 255, 0.8)"
                strokeWidth={2 * intensityValue}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: [0, 1, 0.5, 0],
                }}
                transition={{ 
                  duration: 0.35,
                  ease: 'easeOut',
                }}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.9))',
                }}
              />
            )
          })}
        </svg>

        {/* Pulse effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-cyan-400"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ 
            scale: [0, 20, 40], 
            opacity: [1, 0.5, 0],
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.9), inset 0 0 40px rgba(0, 255, 255, 0.5)',
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}


