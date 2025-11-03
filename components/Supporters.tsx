'use client'

import { motion } from 'framer-motion'
import { Heart, Star, Trophy, Award, Coffee, User } from 'lucide-react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Mock supporters for demo when database is empty
const mockSupporters = [
  {
    id: 'mock-1',
    name: 'Sarah Chen',
    amountCents: 5000,
    currency: 'usd',
    monthly: true,
    message: 'Love your work! Keep building amazing things 🚀',
    createdAt: new Date(),
  },
  {
    id: 'mock-2',
    name: 'Alex Rivers',
    amountCents: 2500,
    currency: 'usd',
    monthly: false,
    message: 'This project helped me so much. Thank you!',
    createdAt: new Date(),
  },
  {
    id: 'mock-3',
    name: 'Jordan Lee',
    amountCents: 1500,
    currency: 'usd',
    monthly: false,
    message: 'Amazing work on this! 💙',
    createdAt: new Date(),
  },
  {
    id: 'mock-4',
    name: 'Taylor Swift',
    amountCents: 5000,
    currency: 'usd',
    monthly: true,
    message: 'Supporting innovation, one coffee at a time ☕',
    createdAt: new Date(),
  },
  {
    id: 'mock-5',
    name: 'Morgan Blake',
    amountCents: 1000,
    currency: 'usd',
    monthly: false,
    message: 'Great stuff! Keep it up!',
    createdAt: new Date(),
  },
  {
    id: 'mock-6',
    name: 'Casey Nova',
    amountCents: 3000,
    currency: 'usd',
    monthly: false,
    message: 'Your tutorials saved my project. Thanks! 🙏',
    createdAt: new Date(),
  },
]

export default function Supporters() {
  const { data, error } = useSWR('/api/stats', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  if (error) {
    // Fallback to static display
    return <SupportersSkeleton />
  }

  // Use mock data if no real supporters yet, otherwise use real data
  const supporters = data?.supporters?.recent && data.supporters.recent.length > 0 
    ? data.supporters.recent 
    : mockSupporters
  
  const totalCount = data?.supporters?.total || supporters.length
  const isDemo = !data?.supporters?.recent || data.supporters.recent.length === 0

  return (
    <section id="supporters" className="relative py-20 px-4 bg-gradient-to-br from-[#0a0a14] via-[#120a1f] to-[#0a0a14] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Trophy 
                className="w-10 h-10 text-yellow-400"
                style={{ filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))' }}
              />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider">
              Hall of Fame
            </h2>
            <motion.div
              animate={{ rotate: [0, -360], scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Star 
                className="w-10 h-10 text-cyan-400"
                style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.8))' }}
              />
            </motion.div>
          </div>
          <p className="text-xl md:text-2xl text-cyan-100 max-w-2xl mx-auto font-light">
            <span className="text-yellow-400 font-semibold">{totalCount} legendary supporters</span> who fuel this mission
            {isDemo && (
              <span className="block text-sm text-cyan-400/60 mt-2">
                (Demo data - Real supporters will appear here)
              </span>
            )}
          </p>
        </motion.div>

        {supporters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {supporters.map((supporter: any, index: number) => {
              const Icon = supporter.monthly ? Trophy : Award
              const color = supporter.monthly
                ? 'from-yellow-500 to-orange-600'
                : supporter.amountCents >= 2500
                ? 'from-purple-500 to-pink-600'
                : 'from-cyan-500 to-blue-600'
              
              const glowColor = supporter.monthly
                ? 'rgba(255, 215, 0, 0.5)'
                : supporter.amountCents >= 2500
                ? 'rgba(255, 0, 255, 0.5)'
                : 'rgba(0, 255, 255, 0.5)'

              return (
                <motion.div
                  key={supporter.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl overflow-hidden border-2 border-cyan-500/30 ${
                    isDemo ? 'opacity-90' : ''
                  }`}
                  style={{ boxShadow: `0 0 30px ${glowColor}` }}
                >
                  <div className="absolute inset-0 scanline pointer-events-none" />
                  
                  <motion.div
                    className="absolute top-2 right-2 w-1 h-1 rounded-full bg-cyan-400"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [1, 2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 1)' }}
                  />

                  <div className="relative z-10">
                    {/* Super Supporter Badge */}
                    {(supporter.amountCents >= 5000 || supporter.monthly) && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', delay: index * 0.1 + 0.3 }}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1"
                        style={{ boxShadow: '0 0 15px rgba(255, 215, 0, 0.8)' }}
                      >
                        <Star className="w-3 h-3 fill-current" />
                        {supporter.monthly ? 'VIP' : 'SUPER'}
                      </motion.div>
                    )}

                    <div className="flex items-start gap-4 mb-4">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className={`w-16 h-16 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}
                        style={{ boxShadow: `0 0 20px ${glowColor}` }}
                      >
                        <Icon 
                          className="w-8 h-8 text-white"
                          style={{ filter: `drop-shadow(0 0 10px ${glowColor})` }}
                        />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white text-lg uppercase tracking-wider">
                            {supporter.name || 'Anonymous'}
                          </h4>
                          {supporter.monthly && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            >
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-cyan-400 font-bold text-2xl">
                          ${(supporter.amountCents / 100).toFixed(2)}
                          {supporter.monthly && (
                            <span className="text-sm text-purple-400 ml-2">/month</span>
                          )}
                        </p>
                      </div>
                    </div>
                    {supporter.message && (
                      <div className="flex items-start gap-2 bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/20">
                        <Heart className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                        <p className="text-cyan-100/90 font-light flex-1">{supporter.message}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
            )
          })}
        </div>
        )}

        {/* Demo Badge */}
        {isDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-gray-900/50 border border-cyan-500/30 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400/80 text-sm font-mono uppercase tracking-wider">
                Demo Mode - Your real supporters will appear here automatically
              </span>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 rounded-lg border-2 border-cyan-400/50"
            style={{ boxShadow: '0 0 40px rgba(0, 255, 255, 0.4)' }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-6 h-6 text-white fill-current" />
            </motion.div>
            <span className="text-white font-bold text-lg uppercase tracking-wider">
              Join {totalCount}+ Elite Supporters
            </span>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Trophy className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function SupportersSkeleton() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="h-32 bg-gray-800 rounded-2xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  )
}

