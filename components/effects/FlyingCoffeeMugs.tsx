'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee } from 'lucide-react'

interface FlyingCoffeeMugsProps {
  trigger: boolean
  count?: number
}

/**
 * Flying Coffee Mugs Easter Egg
 * Triggered when user clicks on coffee icons
 */
export default function FlyingCoffeeMugs({ trigger, count = 20 }: FlyingCoffeeMugsProps) {
  if (!trigger) return null

  // Generate random mugs spread across entire page
  const mugs = Array.from({ length: count }, (_, i) => {
    const startY = Math.random() * 100 // Start anywhere on page vertically
    const flyDistance = 80 + Math.random() * 40 // Fly between 80-120% of viewport height
    
    return {
      id: i,
      startX: Math.random() * 100, // Full width
      startY: startY, // Full height
      endY: startY - flyDistance, // Consistent upward distance
      rotation: Math.random() * 720 - 360,
      scale: 0.6 + Math.random() * 2, // Larger variation (0.6-2.6x)
      duration: 2 + Math.random() * 2, // Longer duration (2-4s)
      delay: Math.random() * 0.5,
      color: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff0000', '#0000ff', '#ff6b35', '#f72585'][Math.floor(Math.random() * 8)],
    }
  })

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" style={{ pointerEvents: 'none' }}>
      {mugs.map((mug) => (
        <motion.div
          key={`mug-${mug.id}-${Date.now()}`}
          className="absolute"
          initial={{
            left: `${mug.startX}%`,
            top: `${mug.startY}%`,
            opacity: 0,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            left: `${mug.startX + (Math.random() - 0.5) * 60}%`,
            top: [
              `${mug.startY}%`,
              `${mug.startY - (mug.startY - mug.endY) * 0.6}%`,
              `${mug.endY}%`,
            ],
            opacity: [0, 1, 1, 0],
            scale: [0, mug.scale, mug.scale, 0],
            rotate: mug.rotation,
          }}
          transition={{
            duration: mug.duration,
            delay: mug.delay,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          <Coffee
            className="w-8 h-8 sm:w-12 sm:h-12"
            style={{
              color: mug.color,
              filter: `drop-shadow(0 0 ${8 + mug.scale * 4}px ${mug.color})`,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

