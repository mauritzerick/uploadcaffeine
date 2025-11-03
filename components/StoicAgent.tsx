'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { BookOpen, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getRandomStoicQuote, formatStoicQuote } from '@/lib/stoicQuotes'

interface StoicAgentProps {
  initialPosition?: { x: number; y: number }
}

const outOfWisdomMessage = "📜 Ancient wisdom depleted! Support us to unlock more stoic insights... ☕✨"

export default function StoicAgent({ initialPosition }: StoicAgentProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [showQuote, setShowQuote] = useState(false)
  const [currentQuote, setCurrentQuote] = useState('')
  const [mounted, setMounted] = useState(false)

  // Mouse following - relative offset from center of screen
  const mouseOffsetX = useMotionValue(0)
  const mouseOffsetY = useMotionValue(0)
  const springConfig = { damping: 20, stiffness: 150 }
  const followX = useSpring(mouseOffsetX, springConfig)
  const followY = useSpring(mouseOffsetY, springConfig)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        // Calculate offset from center of screen, scaled down
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        
        const offsetX = (e.clientX - centerX) * 0.05
        const offsetY = (e.clientY - centerY) * 0.05
        
        mouseOffsetX.set(offsetX)
        mouseOffsetY.set(offsetY)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isDragging, mouseOffsetX, mouseOffsetY, mounted])

  const scrollToSupport = () => {
    const coffeeSection = document.querySelector('#coffee')
    if (coffeeSection) {
      coffeeSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleClick = () => {
    if (clickCount < 3) {
      // Show random stoic quote
      const quote = getRandomStoicQuote()
      const formattedQuote = formatStoicQuote(quote)
      setCurrentQuote(formattedQuote)
      setClickCount(clickCount + 1)
    } else {
      // Out of wisdom - show message and auto-scroll
      setCurrentQuote(outOfWisdomMessage)
      // Scroll after a short delay so user can see the message
      setTimeout(() => {
        scrollToSupport()
      }, 2000)
    }
    setShowQuote(true)
    setTimeout(() => setShowQuote(false), 5000)
  }

  const handleSupportClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setShowQuote(false)
    scrollToSupport()
  }

  if (!mounted) return null

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        top: 0,
        left: 0,
        right: typeof window !== 'undefined' ? window.innerWidth - 80 : 1000,
        bottom: typeof window !== 'undefined' ? window.innerHeight - 80 : 1000,
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => {
        setIsDragging(false)
      }}
      onClick={handleClick}
      initial={initialPosition || { x: window.innerWidth - 240, y: window.innerHeight - 120 }}
      className="fixed z-50 cursor-grab active:cursor-grabbing"
      whileHover={{ scale: 1.1 }}
      whileDrag={{ scale: 1.15, cursor: 'grabbing' }}
    >
      {/* Mouse follow layer */}
      <motion.div
        style={{
          x: isDragging ? 0 : followX,
          y: isDragging ? 0 : followY,
        }}
        className="relative"
      >
        {/* Floating animation layer */}
        <motion.div
          animate={{
            y: isDragging ? 0 : [0, -10, 0],
            rotate: isDragging ? 0 : [0, 3, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: isDragging ? 0 : Infinity,
            ease: "easeInOut",
          }}
          className="relative"
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
        >
        {/* Outer glow ring - golden stoic theme */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            scale: isDragging ? 1.8 : isHovering ? [1, 1.5, 1] : [1, 1.2, 1],
            opacity: isDragging ? 0.8 : [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: isDragging ? 0 : Infinity,
          }}
          style={{
            background: `radial-gradient(circle, rgba(218, 165, 32, 0.6) 0%, transparent 70%)`,
            filter: 'blur(15px)',
            width: '120px',
            height: '120px',
            left: '-35px',
            top: '-35px',
          }}
        />

        {/* Main agent body - golden/bronze gradient for stoic theme */}
        <motion.div
          animate={{
            scale: isHovering ? 1.2 : 1,
            boxShadow: isDragging
              ? ['0 0 40px rgba(218, 165, 32, 0.8)', '0 0 60px rgba(218, 165, 32, 0.8)', '0 0 40px rgba(218, 165, 32, 0.8)']
              : isHovering
              ? [
                  '0 0 30px rgba(218, 165, 32, 0.6)',
                  '0 0 50px rgba(184, 134, 11, 0.8)',
                  '0 0 30px rgba(218, 165, 32, 0.6)',
                ]
              : [
                  '0 0 20px rgba(218, 165, 32, 0.6)',
                  '0 0 30px rgba(218, 165, 32, 0.6)',
                  '0 0 20px rgba(218, 165, 32, 0.6)',
                ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative w-12 h-12 bg-gradient-to-br from-amber-600 via-yellow-700 to-amber-900 rounded-full flex items-center justify-center"
        >
          <motion.div
            animate={{
              rotate: isDragging ? 360 : [0, 360],
            }}
            transition={{
              duration: isDragging ? 0.5 : 6,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <BookOpen className="w-6 h-6 text-amber-50" />
          </motion.div>

          {/* Inner pulse - golden color */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-amber-400"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
          />
        </motion.div>

        {/* Orbiting particles - golden sparkles */}
        {[0, 90, 180, 270].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              rotate: [angle, angle + 360],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <motion.div
              style={{
                x: 28,
                y: 0,
              }}
              animate={{
                scale: isHovering ? [1, 1.5, 1] : [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
            </motion.div>
          </motion.div>
        ))}

        {/* Tooltip on hover */}
        {(isHovering || isDragging) && !showQuote && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 md:px-3 py-1 md:py-2 bg-gray-900 border border-amber-500/50 rounded-lg whitespace-nowrap pointer-events-none"
            style={{
              maxWidth: 'calc(100vw - 2rem)',
            }}
          >
            <div className="text-[10px] md:text-xs text-amber-400 font-serif uppercase tracking-wider truncate">
              {isDragging ? '✋ Dragging...' : '📖 Stoic Wisdom'}
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 border-b border-r border-amber-500/50 rotate-45" />
          </motion.div>
        )}

        {/* Quote Popup */}
        {showQuote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute bottom-full left-0 mb-2 px-4 py-3 bg-gradient-to-br from-gray-900 via-amber-950/50 to-gray-800 border-2 border-amber-500 rounded-xl pointer-events-none w-72 sm:w-96 md:w-[32rem] shadow-2xl"
            style={{
              boxShadow: '0 0 30px rgba(218, 165, 32, 0.4), 0 0 60px rgba(218, 165, 32, 0.2)',
              maxWidth: 'calc(100vw - 2rem)',
            }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(218, 165, 32, 0.3)',
                  '0 0 40px rgba(218, 165, 32, 0.5)',
                  '0 0 20px rgba(218, 165, 32, 0.3)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 rounded-xl"
            />
            <div className="relative z-10">
              <div className="text-xs sm:text-sm text-amber-100 font-serif leading-relaxed text-center break-words italic">
                {currentQuote}
              </div>
              {clickCount > 3 && (
                <motion.a
                  href="#coffee"
                  onClick={handleSupportClick}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="block mt-3 text-xs text-yellow-400 hover:text-yellow-300 font-bold uppercase tracking-wider text-center cursor-pointer"
                >
                  → Support Our Mission ☕
                </motion.a>
              )}
            </div>
            <div className="absolute bottom-0 left-6 transform translate-y-1/2 w-3 h-3 bg-gray-900 border-b-2 border-r-2 border-amber-500 rotate-45" />
          </motion.div>
        )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

