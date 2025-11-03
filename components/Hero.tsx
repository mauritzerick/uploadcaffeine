'use client'

import { motion } from 'framer-motion'
import { Coffee, Zap, Cpu, Code2, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getVariant, trackEvent } from '@/lib/analytics'

const headlines = {
  a: {
    main: "If I made you smile,",
    sub: "buy me a coffee ☕",
    tagline: "No perks. No paywall. Just pure appreciation.",
  },
  b: {
    main: "Did this spark joy?",
    sub: "Fuel my creativity",
    tagline: "Your support = more cool stuff",
  },
}

export default function Hero() {
  const [variant, setVariant] = useState<'a' | 'b'>('a')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const selectedVariant = getVariant('headline_test')
    setVariant(selectedVariant)
    trackEvent('page_view', { experiment: 'headline_test', variant: selectedVariant })
  }, [])

  if (!mounted) return null

  const headline = headlines[variant]
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a14] via-[#120a1f] to-[#0a0a14]">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      {/* Cyber Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating cyber particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          >
            <div 
              className="w-1 h-1 rounded-full"
              style={{
                background: i % 3 === 0 ? '#00ffff' : i % 3 === 1 ? '#ff00ff' : '#b000ff',
                boxShadow: `0 0 ${10 + Math.random() * 10}px currentColor`,
              }}
            />
          </motion.div>
        ))}

        {/* Neon gradient orbs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 rounded-full filter blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #00ffff, transparent)' }}
          animate={{
            scale: [1, 1.5, 1],
            x: [0, 100, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-96 h-96 rounded-full filter blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #ff00ff, transparent)' }}
          animate={{
            scale: [1, 1.6, 1],
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-96 h-96 rounded-full filter blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #b000ff, transparent)' }}
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 60, 0],
            y: [0, -70, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Cyber Icons */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8 flex justify-center gap-6"
        >
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5 }}
            className="relative"
          >
            <Coffee 
              className="w-16 h-16 md:w-20 md:h-20 text-cyan-400" 
              style={{
                filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.8))',
              }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full" 
                style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 1)' }} />
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.7 }}
          >
            <Zap 
              className="w-16 h-16 md:w-20 md:h-20 text-pink-500" 
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255, 0, 255, 0.8))',
              }}
            />
          </motion.div>

          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.9 }}
          >
            <Code2 
              className="w-16 h-16 md:w-20 md:h-20 text-purple-500" 
              style={{
                filter: 'drop-shadow(0 0 20px rgba(176, 0, 255, 0.8))',
              }}
            />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 relative"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          <span 
            className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent neon-glow block"
          >
            {headline.main}
          </span>
          <span 
            className="bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500 bg-clip-text text-transparent neon-glow block"
          >
            {headline.sub}
          </span>
          <motion.div
            className="absolute -top-4 -right-4 md:-right-8"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Coffee className="w-12 h-12 text-cyan-400" 
              style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.9))' }} />
          </motion.div>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2xl md:text-3xl text-cyan-100 mb-8 max-w-3xl mx-auto font-light"
        >
          <span className="text-cyan-400 font-semibold">{headline.tagline}</span>
        </motion.p>

        {/* CTA Button */}
        <motion.a
          href="#coffee"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="inline-block mb-24"
          onClick={() => trackEvent('cta_click', { location: 'hero', variant })}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-bold text-xl overflow-hidden group uppercase tracking-wider"
            style={{
              boxShadow: '0 0 40px rgba(0, 255, 255, 0.6)',
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              <Coffee className="w-7 h-7" />
              BUY ME A COFFEE
              <Zap className="w-7 h-7" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.button>
        </motion.a>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-cyan-400" 
              style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))' }} />
          </motion.div>
          <span className="text-cyan-400 text-sm font-mono uppercase tracking-wider">
            Scroll Down
          </span>
        </motion.div>
      </div>
    </section>
  )
}
