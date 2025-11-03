'use client'

import { motion } from 'framer-motion'
import { Flame, Zap, Clock } from 'lucide-react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatTimeAgo(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export default function TipStreak() {
  const { data, error } = useSWR('/api/stats', fetcher, { refreshInterval: 30000 })

  if (error || !data) return null

  const supporters = data.supporters?.recent || []
  const totalToday = supporters.filter((s: any) => {
    const supportDate = new Date(s.createdAt)
    const today = new Date()
    return supportDate.toDateString() === today.toDateString()
  }).length

  const lastSupporter = supporters[0]
  const lastSupportTime = lastSupporter ? formatTimeAgo(lastSupporter.createdAt) : null

  // Don't show if no real data
  if (supporters.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed top-24 left-4 z-40 max-w-xs"
    >
      <div className="space-y-2">
        {/* Today's count */}
        {totalToday > 0 && (
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(255, 100, 0, 0.4)',
                '0 0 30px rgba(255, 100, 0, 0.6)',
                '0 0 20px rgba(255, 100, 0, 0.4)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md px-4 py-3 rounded-lg border border-orange-500/50 flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-6 h-6 text-orange-400" />
            </motion.div>
            <div>
              <div className="text-lg font-bold text-orange-300">
                {totalToday} supporter{totalToday !== 1 ? 's' : ''} today
              </div>
              <div className="text-xs text-orange-400/80 font-mono uppercase tracking-wider">
                Keep the streak alive!
              </div>
            </div>
          </motion.div>
        )}

        {/* Last support time */}
        {lastSupportTime && (
          <motion.div
            animate={{
              boxShadow: [
                '0 0 15px rgba(0, 255, 255, 0.3)',
                '0 0 25px rgba(0, 255, 255, 0.5)',
                '0 0 15px rgba(0, 255, 255, 0.3)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md px-4 py-3 rounded-lg border border-cyan-500/50 flex items-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="w-5 h-5 text-cyan-400" />
            </motion.div>
            <div>
              <div className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last support: {lastSupportTime}
              </div>
              <div className="text-xs text-cyan-400/70">
                by {lastSupporter.name || 'Anonymous'}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}


