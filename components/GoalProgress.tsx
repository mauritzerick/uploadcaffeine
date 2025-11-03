'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Zap, DollarSign } from 'lucide-react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function GoalProgress() {
  const { data, error } = useSWR('/api/stats', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  if (error) return null
  if (!data) {
    return (
      <div className="w-full h-32 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl animate-pulse" />
    )
  }

  // Use real data only
  const { goal } = data
  const goalData = goal || {
    targetCents: parseInt(process.env.NEXT_PUBLIC_MONTHLY_GOAL_CENTS || '15000'),
    currentCents: 0,
    progressPercentage: 0,
    oneTimeTotal: 0,
    subscriptionTotal: 0,
  }
  
  const currentAmount = (goalData.currentCents / 100).toFixed(2)
  const targetAmount = (goalData.targetCents / 100).toFixed(2)
  const progressPercentage = goalData.progressPercentage

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border-2 border-cyan-500/30 overflow-hidden"
      style={{
        boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)',
      }}
    >
      {/* Scanline effect */}
      <div className="absolute inset-0 scanline pointer-events-none" />

      {/* Animated corner particles */}
      <motion.div
        className="absolute top-4 right-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <TrendingUp
          className="w-8 h-8 text-cyan-400"
          style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))' }}
        />
      </motion.div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Monthly Goal
            </h3>
            <p className="text-cyan-100/70 text-sm mt-1 font-light">
              Funding hosting, coffee, and late-night coding
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl md:text-4xl font-bold text-white">
              {progressPercentage}%
            </div>
            <div className="text-cyan-400/80 text-sm uppercase tracking-wider">
              Complete
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-8 bg-gray-900/50 rounded-lg overflow-hidden border border-cyan-500/30 mb-4">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.6)',
            }}
          />
          
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 3,
            }}
          />
        </div>

        {/* Amount Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-100">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-2xl font-bold text-white">
              ${currentAmount}
            </span>
            <span className="text-cyan-400/70">raised</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400/70">
            <span>of</span>
            <span className="text-xl font-bold text-cyan-400">
              ${targetAmount}
            </span>
            <span>goal</span>
          </div>
        </div>

        {/* Additional stats */}
        {goalData.oneTimeTotal > 0 || goalData.subscriptionTotal > 0 ? (
          <div className="mt-6 pt-6 border-t border-cyan-500/20 grid grid-cols-2 gap-4">
            <div>
              <div className="text-cyan-400/70 text-xs uppercase tracking-wider mb-1">
                One-Time
              </div>
              <div className="text-xl font-bold text-white">
                ${(goalData.oneTimeTotal / 100).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-purple-400/70 text-xs uppercase tracking-wider mb-1">
                Monthly
              </div>
              <div className="text-xl font-bold text-white">
                ${(goalData.subscriptionTotal / 100).toFixed(2)}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}

