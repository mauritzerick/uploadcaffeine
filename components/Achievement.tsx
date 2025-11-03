'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Flame, Zap } from 'lucide-react'

interface AchievementProps {
  title: string
  description: string
  icon?: 'trophy' | 'star' | 'flame' | 'zap'
  isVisible: boolean
}

export default function Achievement({ title, description, icon = 'trophy', isVisible }: AchievementProps) {
  const icons = {
    trophy: Trophy,
    star: Star,
    flame: Flame,
    zap: Zap,
  }

  const Icon = icons[icon]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: -100 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="fixed bottom-8 right-8 z-50 pointer-events-none"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 30px rgba(255, 215, 0, 0.6)',
                '0 0 50px rgba(255, 215, 0, 0.8)',
                '0 0 30px rgba(255, 215, 0, 0.6)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border-2 border-yellow-500 max-w-sm"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center flex-shrink-0"
                style={{ boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)' }}
              >
                <Icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Content */}
              <div>
                <div className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                  </motion.div>
                  Achievement Unlocked!
                </div>
                <h4 className="text-white font-bold text-lg mb-1">{title}</h4>
                <p className="text-cyan-100/80 text-sm">{description}</p>
              </div>
            </div>

            {/* Sparkle effects */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [0, -50],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


