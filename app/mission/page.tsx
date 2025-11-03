'use client'

import { motion } from 'framer-motion'
import { Terminal, CheckCircle, Circle, Lock, Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const missionLogs = [
  {
    id: 1,
    title: 'Phase 1: Foundation',
    description: 'Build the core infrastructure and launch MVP',
    status: 'completed',
    date: '2024-Q1',
    tasks: ['Set up development environment', 'Create cyberpunk UI design', 'Implement payment system', 'Launch beta'],
  },
  {
    id: 2,
    title: 'Phase 2: Enhancement',
    description: 'Add advanced features and micro-interactions',
    status: 'in_progress',
    date: '2024-Q2',
    tasks: ['Particle effects system', 'AI thanks messages', 'Matrix easter egg', 'Ambient agent AI'],
    requiredSupport: 5,
  },
  {
    id: 3,
    title: 'Phase 3: Community',
    description: 'Build community features and engagement tools',
    status: 'locked',
    date: '2024-Q3',
    tasks: ['Public leaderboard', 'Supporter badges system', 'Email notifications', 'Discord integration'],
    requiredSupport: 15,
  },
  {
    id: 4,
    title: 'Phase 4: Scale',
    description: 'Global expansion and advanced analytics',
    status: 'locked',
    date: '2024-Q4',
    tasks: ['Multi-currency support', 'Advanced analytics dashboard', 'Mobile app', 'API for creators'],
    requiredSupport: 50,
  },
]

export default function MissionPage() {
  const [mounted, setMounted] = useState(false)
  const [currentSupport, setCurrentSupport] = useState(7) // Demo value

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#120a1f] to-[#0a0a14] text-white relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Back button */}
      <Link href="/">
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-gray-900/80 backdrop-blur-md border border-cyan-500/50 px-4 py-2 rounded-lg text-cyan-400 font-bold hover:bg-cyan-500/20 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>
      </Link>

      <div className="max-w-5xl mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Terminal className="w-12 h-12 text-cyan-400" style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.8))' }} />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wider">
              Mission Terminal
            </h1>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-12 h-12 text-yellow-400" style={{ filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))' }} />
            </motion.div>
          </div>
          <p className="text-xl text-cyan-100/80 font-light max-w-2xl mx-auto">
            <span className="text-cyan-400 font-semibold">Decrypted development logs</span> from the cyber frontier.
            <br />
            Each phase unlocks with supporter milestones.
          </p>
        </motion.div>

        {/* Support Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border-2 border-cyan-500/30 mb-12"
          style={{ boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-cyan-400 font-bold uppercase tracking-wider">Current Support Level</span>
            <span className="text-purple-400 font-bold text-2xl">{currentSupport} Supporters</span>
          </div>
          <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentSupport / 50) * 100}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
              style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.6)' }}
            />
          </div>
        </motion.div>

        {/* Mission Logs */}
        <div className="space-y-8">
          {missionLogs.map((log, index) => {
            const Icon =
              log.status === 'completed' ? CheckCircle : log.status === 'in_progress' ? Circle : Lock
            const isUnlocked = log.status !== 'locked' || currentSupport >= (log.requiredSupport || 0)
            const statusColor =
              log.status === 'completed'
                ? 'from-green-500 to-emerald-600'
                : log.status === 'in_progress'
                ? 'from-yellow-500 to-orange-600'
                : 'from-gray-600 to-gray-700'
            const glowColor =
              log.status === 'completed'
                ? 'rgba(0, 255, 100, 0.4)'
                : log.status === 'in_progress'
                ? 'rgba(255, 200, 0, 0.4)'
                : 'rgba(100, 100, 100, 0.2)'

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border-2 ${
                  isUnlocked ? 'border-cyan-500/30' : 'border-gray-700/50'
                } ${!isUnlocked && 'opacity-60'}`}
                style={{ boxShadow: `0 0 30px ${glowColor}` }}
              >
                <div className="absolute inset-0 scanline pointer-events-none rounded-xl" />

                <div className="relative z-10 flex gap-6">
                  {/* Icon */}
                  <motion.div
                    animate={
                      log.status === 'in_progress'
                        ? {
                            rotate: [0, 360],
                          }
                        : {}
                    }
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${statusColor} flex items-center justify-center flex-shrink-0`}
                    style={{ boxShadow: `0 0 20px ${glowColor}` }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-white uppercase tracking-wider">{log.title}</h3>
                        <p className="text-cyan-400/80 text-sm font-mono">{log.date}</p>
                      </div>
                      {log.status === 'locked' && (
                        <div className="bg-gray-700 px-3 py-1 rounded-full text-xs font-bold text-gray-400 uppercase">
                          Requires {log.requiredSupport} Supporters
                        </div>
                      )}
                    </div>

                    <p className="text-cyan-100/90 mb-4">{log.description}</p>

                    {/* Tasks */}
                    <div className="space-y-2">
                      {log.tasks.map((task, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-cyan-300/70">
                          <div className="w-1 h-1 rounded-full bg-cyan-400" />
                          <span className="font-mono">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <Link href="/#coffee">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-bold py-4 px-8 rounded-lg text-lg uppercase tracking-wider"
              style={{ boxShadow: '0 0 40px rgba(0, 255, 255, 0.5)' }}
            >
              <span className="flex items-center gap-3">
                <Zap className="w-6 h-6" />
                Unlock Next Phase
                <Zap className="w-6 h-6" />
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}


