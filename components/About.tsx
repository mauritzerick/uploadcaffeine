'use client'

import { motion } from 'framer-motion'
import { Code2, Users, Settings, Lightbulb, Sparkles, Target, Zap } from 'lucide-react'

const features = [
  {
    icon: Code2,
    title: 'Development',
    description: 'Building cutting-edge web applications and tools',
    color: 'from-cyan-500 to-blue-600',
    glowColor: 'rgba(0, 255, 255, 0.5)',
  },
  {
    icon: Users,
    title: 'Consulting',
    description: 'Strategic guidance for your tech projects',
    color: 'from-pink-500 to-purple-600',
    glowColor: 'rgba(255, 0, 255, 0.5)',
  },
  {
    icon: Settings,
    title: 'Automation',
    description: 'Streamlining workflows and boosting efficiency',
    color: 'from-purple-500 to-indigo-600',
    glowColor: 'rgba(176, 0, 255, 0.5)',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Pushing boundaries and exploring new ideas',
    color: 'from-yellow-500 to-orange-600',
    glowColor: 'rgba(255, 215, 0, 0.5)',
  },
]

export default function About() {
  return (
    <section id="about" className="relative py-20 px-4 bg-gradient-to-br from-[#0a0a14] via-[#1a0a2e] to-[#0a0a14] overflow-hidden">
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
              <Sparkles 
                className="w-10 h-10 text-cyan-400"
                style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.8))' }}
              />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wider">
              What I Do
            </h2>
            <motion.div
              animate={{ 
                rotate: [0, -360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Target 
                className="w-10 h-10 text-pink-500"
                style={{ filter: 'drop-shadow(0 0 15px rgba(255, 0, 255, 0.8))' }}
              />
            </motion.div>
          </div>
          <p className="text-xl md:text-2xl text-cyan-100 max-w-3xl mx-auto font-light">
            <span className="text-cyan-400 font-semibold">Creating digital experiences</span> that push the boundaries
            <br />
            <span className="text-pink-400">Your support fuels innovation</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl overflow-hidden border-2 border-cyan-500/30"
                style={{
                  boxShadow: `0 0 30px ${feature.glowColor}`,
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
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 1)' }}
                />

                <div className="relative z-10">
                  <motion.div 
                    className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    style={{
                      boxShadow: `0 0 30px ${feature.glowColor}`,
                    }}
                  >
                    <Icon 
                      className="w-10 h-10 text-white"
                      style={{
                        filter: `drop-shadow(0 0 10px ${feature.glowColor})`,
                      }}
                    />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2 text-center uppercase tracking-wider">
                    {feature.title}
                  </h3>
                  <p className="text-cyan-100/80 text-center font-light">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden border-2 border-cyan-400/50"
          style={{
            boxShadow: '0 0 60px rgba(0, 255, 255, 0.4)',
          }}
        >
          {/* Animated corner elements */}
          <motion.div
            className="absolute top-4 left-4"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-white/50" />
          </motion.div>
          <motion.div
            className="absolute bottom-4 right-4"
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Target className="w-8 h-8 text-white/50" />
          </motion.div>
          
          {/* Scanline effect */}
          <div className="absolute inset-0 scanline pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-wider flex items-center justify-center gap-4">
              <Zap className="w-10 h-10" />
              Why Support Matters
              <Zap className="w-10 h-10" />
            </h3>
            <p className="text-lg md:text-2xl opacity-95 max-w-3xl mx-auto font-light leading-relaxed">
              Every contribution directly enables me to dedicate more time to <span className="font-bold">creating</span>,
              <span className="font-bold"> innovating</span>, and <span className="font-bold">sharing</span> valuable content with the community.
              <br /><br />
              <span className="text-2xl md:text-3xl font-bold">Together, we build the future!</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
