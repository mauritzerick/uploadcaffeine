'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Terminal, 
  Scan, 
  Sparkles, 
  Bot, 
  Zap,
  Quote,
  TrendingUp,
  Coffee,
  Trophy,
  Flame,
  Gift,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { useFeatureFlagsContext } from '@/providers/FeatureFlagsProvider'

interface Feature {
  id: string
  icon: any
  title: string
  description: string
  shortcut?: string
  color: string
  action?: () => void
}

export default function FeaturesMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { isEnabled } = useFeatureFlagsContext()

  const features: Feature[] = [
    {
      id: 'terminal',
      icon: Terminal,
      title: 'Terminal Console',
      description: 'Access the cyberpunk terminal',
      shortcut: 'Press `',
      color: 'text-cyan-400',
      action: () => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: '`' }))
        setIsOpen(false)
      },
    },
    {
      id: 'hologram',
      icon: Scan,
      title: 'Device Hologram',
      description: 'Scan your device specs',
      shortcut: 'Hover CTAs',
      color: 'text-purple-400',
      action: () => {
        window.dispatchEvent(new Event('toggle-hologram'))
        setIsOpen(false)
      },
    },
    {
      id: 'matrix',
      icon: Sparkles,
      title: 'Matrix Rain',
      description: 'Enter the Matrix',
      shortcut: 'Press M×3',
      color: 'text-green-400',
      action: () => {
        // Trigger matrix mode
        window.dispatchEvent(new CustomEvent('toggle-matrix-mode'))
        setIsOpen(false)
      },
    },
    {
      id: 'ai_agents',
      icon: Bot,
      title: 'AI Agents',
      description: 'Draggable AI assistants',
      shortcut: 'Click for jokes',
      color: 'text-blue-400',
    },
    {
      id: 'particle_burst',
      icon: Zap,
      title: 'Particle Effects',
      description: 'Neon particle explosions',
      color: 'text-yellow-400',
    },
    {
      id: 'daily_quote',
      icon: Quote,
      title: 'Daily Dev Quote',
      description: 'Changes at 12PM AEST',
      color: 'text-pink-400',
    },
    {
      id: 'goal_progress',
      icon: TrendingUp,
      title: 'Goal Tracker',
      description: 'Real-time progress bar',
      color: 'text-cyan-400',
    },
    {
      id: 'coffee_types',
      icon: Coffee,
      title: 'Coffee Types',
      description: 'Choose your brew',
      color: 'text-orange-400',
    },
    {
      id: 'support_heatwave',
      icon: Flame,
      title: 'Support Heatwave',
      description: 'Button glows with amount',
      color: 'text-red-400',
    },
    {
      id: 'achievements',
      icon: Trophy,
      title: 'Achievements',
      description: 'Unlock supporter badges',
      color: 'text-yellow-400',
    },
    {
      id: 'tip_streak',
      icon: Gift,
      title: 'Tip Streak',
      description: 'Live supporter activity',
      color: 'text-green-400',
    },
    {
      id: 'feature_flags',
      icon: Settings,
      title: 'Feature Flags',
      description: 'Runtime toggles',
      shortcut: '/web-admin',
      color: 'text-purple-400',
      action: () => {
        window.open('/web-admin', '_blank')
        setIsOpen(false)
      },
    },
  ]

  // Filter out disabled features
  const activeFeatures = features.filter(f => {
    if (f.id === 'terminal') return isEnabled('terminal_console')
    if (f.id === 'hologram') return isEnabled('device_hologram')
    if (f.id === 'matrix') return isEnabled('matrix_rain')
    if (f.id === 'ai_agents') return isEnabled('ai_agents')
    if (f.id === 'particle_burst') return isEnabled('particle_effects')
    return true // Always show non-flagged features
  })

  return (
    <>
      {/* Menu Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-4 left-4 z-[90] p-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl shadow-2xl border-2 border-cyan-400"
        style={{
          boxShadow: '0 0 30px rgba(0, 255, 255, 0.6)',
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </motion.div>
        
        {/* Pulse Effect */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-cyan-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </motion.button>

      {/* Features Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[85]"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-full sm:w-96 bg-gradient-to-br from-gray-900 to-gray-800 border-r-2 border-cyan-500 shadow-2xl z-[90] overflow-y-auto"
              style={{
                boxShadow: '0 0 60px rgba(0, 255, 255, 0.4)',
              }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gray-800 border-b-2 border-cyan-500 p-6 z-10">
                <div className="flex items-center justify-between mb-2">
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent uppercase tracking-wider"
                  >
                    ⚡ Features
                  </motion.h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-cyan-400" />
                  </button>
                </div>
                <p className="text-cyan-100/60 text-sm font-mono">
                  Explore {activeFeatures.length} cyberpunk features
                </p>
              </div>

              {/* Features List */}
              <div className="p-4 space-y-3">
                {activeFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={feature.action}
                      className={`group relative bg-gray-800/50 border-2 border-cyan-500/30 rounded-xl p-4 ${
                        feature.action ? 'cursor-pointer hover:border-cyan-400 hover:bg-gray-800' : ''
                      } transition-all`}
                    >
                      {/* Glow Effect on Hover */}
                      {feature.action && (
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                          }}
                        />
                      )}

                      <div className="relative flex items-start gap-3">
                        {/* Icon */}
                        <div className={`w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${feature.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-bold text-sm uppercase tracking-wider truncate">
                              {feature.title}
                            </h3>
                            {feature.action && (
                              <ChevronRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-cyan-100/70 text-xs leading-relaxed">
                            {feature.description}
                          </p>
                          {feature.shortcut && (
                            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-gray-900/50 border border-cyan-500/30 rounded text-[10px] text-cyan-400 font-mono">
                              {feature.shortcut}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-800 border-t-2 border-cyan-500 p-4">
                <div className="flex items-center gap-2 text-cyan-400/60 text-xs font-mono">
                  <Sparkles className="w-4 h-4" />
                  <span>Built with cyberpunk vibes ✨</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}


