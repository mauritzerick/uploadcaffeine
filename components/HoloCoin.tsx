'use client'

import { motion } from 'framer-motion'
import { DollarSign, Sparkles } from 'lucide-react'

export default function HoloCoin() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-6">
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-40 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Main coin */}
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 shadow-2xl"
        style={{
          boxShadow: '0 0 40px rgba(255, 215, 0, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.3)',
        }}
        animate={{
          rotateY: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotateY: {
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {/* Inner circle detail */}
        <div className="absolute inset-2 rounded-full border-4 border-yellow-300/50" />
        
        {/* Dollar sign */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <DollarSign 
              className="w-12 h-12 text-yellow-900"
              strokeWidth={3}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Sparkle effects */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${50 + 40 * Math.cos((i * Math.PI) / 2)}%`,
            top: `${50 + 40 * Math.sin((i * Math.PI) / 2)}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </motion.div>
      ))}

      {/* Hologram scan line */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0, 255, 255, 0.3) 50%, transparent 100%)',
        }}
        animate={{
          y: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}


