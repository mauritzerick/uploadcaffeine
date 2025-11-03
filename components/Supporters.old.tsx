'use client'

import { motion } from 'framer-motion'
import { Heart, Star, User, Trophy, Award } from 'lucide-react'

const supporters = [
  {
    name: 'Alex M.',
    amount: 50,
    message: 'Amazing work! Keep pushing the limits!',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-600',
    glowColor: 'rgba(255, 215, 0, 0.5)',
  },
  {
    name: 'Sarah K.',
    amount: 25,
    message: 'Your content has been incredibly helpful!',
    icon: Award,
    color: 'from-pink-500 to-purple-600',
    glowColor: 'rgba(255, 0, 255, 0.5)',
  },
  {
    name: 'Mike T.',
    amount: 15,
    message: 'Love what you\'re doing!',
    icon: User,
    color: 'from-cyan-500 to-blue-600',
    glowColor: 'rgba(0, 255, 255, 0.5)',
  },
  {
    name: 'Emma L.',
    amount: 50,
    message: 'Thank you for all your hard work!',
    icon: Trophy,
    color: 'from-purple-500 to-pink-600',
    glowColor: 'rgba(176, 0, 255, 0.5)',
  },
  {
    name: 'David R.',
    amount: 5,
    message: 'Small contribution, big impact!',
    icon: User,
    color: 'from-green-500 to-cyan-600',
    glowColor: 'rgba(0, 255, 200, 0.5)',
  },
  {
    name: 'Lisa W.',
    amount: 25,
    message: 'Inspiring work!',
    icon: Award,
    color: 'from-blue-500 to-purple-600',
    glowColor: 'rgba(100, 100, 255, 0.5)',
  },
]

export default function Supporters() {
  return (
    <section id="supporters" className="relative py-20 px-4 bg-gradient-to-br from-[#0a0a14] via-[#120a1f] to-[#0a0a14] overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
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
              animate={{ 
                rotate: [0, -360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Star 
                className="w-10 h-10 text-cyan-400"
                style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.8))' }}
              />
            </motion.div>
          </div>
          <p className="text-xl md:text-2xl text-cyan-100 max-w-2xl mx-auto font-light">
            <span className="text-yellow-400 font-semibold">Legendary supporters</span> who fuel this mission
            <br />
            <span className="text-pink-400">Your contribution makes history</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {supporters.map((supporter, index) => {
            const Icon = supporter.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl overflow-hidden border-2 border-cyan-500/30"
                style={{
                  boxShadow: `0 0 30px ${supporter.glowColor}`,
                }}
              >
                {/* Scanline effect */}
                <div className="absolute inset-0 scanline pointer-events-none" />
                
                {/* Animated particles */}
                <motion.div
                  className="absolute top-2 right-2 w-1 h-1 rounded-full bg-cyan-400"
                  animate={{ 
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 2, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 1)' }}
                />

                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className={`w-16 h-16 bg-gradient-to-br ${supporter.color} rounded-xl flex items-center justify-center shadow-lg`}
                      style={{
                        boxShadow: `0 0 20px ${supporter.glowColor}`,
                      }}
                    >
                      <Icon 
                        className="w-8 h-8 text-white"
                        style={{
                          filter: `drop-shadow(0 0 10px ${supporter.glowColor})`,
                        }}
                      />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white text-lg uppercase tracking-wider">{supporter.name}</h4>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </motion.div>
                      </div>
                      <p className="text-cyan-400 font-bold text-2xl">${supporter.amount}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/20">
                    <Heart className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <p className="text-cyan-100/90 font-light flex-1">{supporter.message}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 rounded-lg border-2 border-cyan-400/50"
            style={{
              boxShadow: '0 0 40px rgba(0, 255, 255, 0.4)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-6 h-6 text-white fill-current" />
            </motion.div>
            <span className="text-white font-bold text-lg uppercase tracking-wider">
              Join {supporters.length}+ Elite Supporters
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
