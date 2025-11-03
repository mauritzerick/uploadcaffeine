'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface VisualizerBarsProps {
  isPlaying: boolean
  barCount?: number
  className?: string
}

/**
 * Decorative audio visualizer bars
 * Note: This is purely visual - no actual audio analysis
 * Animates based on playing state for aesthetic effect
 */
export default function VisualizerBars({ 
  isPlaying, 
  barCount = 24,
  className = '' 
}: VisualizerBarsProps) {
  const [bars, setBars] = useState<number[]>([])

  useEffect(() => {
    // Initialize bar heights
    setBars(Array.from({ length: barCount }, () => Math.random()))
  }, [barCount])

  useEffect(() => {
    if (!isPlaying) return

    // Animate bars when playing
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 0.8 + 0.2))
    }, 150)

    return () => clearInterval(interval)
  }, [isPlaying])

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

  if (prefersReducedMotion) {
    // Simple static representation for reduced motion
    return (
      <div className={`flex items-end gap-[2px] h-12 ${className}`}>
        {Array.from({ length: barCount }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-cyan-500/30 rounded-t"
            style={{ height: '50%' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`flex items-end gap-[2px] h-12 ${className}`}>
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t"
          style={{
            background: 'linear-gradient(to top, rgba(0, 255, 255, 0.8), rgba(139, 92, 246, 0.6))',
          }}
          animate={{
            height: isPlaying ? `${height * 100}%` : '20%',
            opacity: isPlaying ? 1 : 0.3,
          }}
          transition={{
            duration: 0.15,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

