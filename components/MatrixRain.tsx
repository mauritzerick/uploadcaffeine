'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MatrixRainProps {
  isActive: boolean
  onClose: () => void
}

export default function MatrixRain({ isActive, onClose }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Matrix characters
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const charArray = chars.split('')

    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = []

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    let animationId: number

    function draw() {
      if (!ctx || !canvas) return

      // Semi-transparent black to create trailing effect
      ctx.fillStyle = 'rgba(10, 10, 20, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text style
      ctx.fillStyle = '#0ff' // Cyan
      ctx.font = `${fontSize}px monospace`

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.fillText(char, x, y)

        // Randomly reset drops
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [isActive])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100]"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ mixBlendMode: 'screen' }}
          />
          
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            onClick={onClose}
            className="fixed top-4 right-4 z-[101] px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 backdrop-blur-md border border-cyan-500/50 rounded-lg text-cyan-400 font-bold uppercase tracking-wider transition-all"
          >
            Exit Matrix
          </motion.button>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] text-center"
          >
            <div className="bg-black/80 backdrop-blur-md border-2 border-cyan-500 rounded-lg p-8">
              <motion.div
                animate={{
                  textShadow: [
                    '0 0 20px rgba(0, 255, 255, 0.8)',
                    '0 0 40px rgba(0, 255, 255, 1)',
                    '0 0 20px rgba(0, 255, 255, 0.8)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl md:text-6xl font-bold text-cyan-400 mb-4 font-mono"
              >
                MATRIX MODE
              </motion.div>
              <p className="text-cyan-300 text-lg font-mono">
                Welcome to the cyber dimension
              </p>
              <p className="text-cyan-400/60 text-sm mt-2 font-mono">
                🎮 Easter egg unlocked!
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


