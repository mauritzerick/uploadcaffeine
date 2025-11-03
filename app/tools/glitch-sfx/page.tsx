'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Zap } from 'lucide-react'
import Link from 'next/link'

export default function GlitchSFXPage() {
  const [lastPlayed, setLastPlayed] = useState<string | null>(null)
  
  const play = (name: string, freq: number) => {
    setLastPlayed(name)
    setTimeout(() => setLastPlayed(null), 300)
    
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.frequency.value = freq
    oscillator.type = 'square'
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    gainNode.gain.setValueAtTime(0.0001, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.01)
    
    oscillator.start()
    
    setTimeout(() => {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25)
      oscillator.stop(ctx.currentTime + 0.3)
    }, 120)
  }
  
  const sounds = [
    { name: 'Blip', freq: 240, color: 'from-cyan-500 to-blue-500' },
    { name: 'Zap', freq: 440, color: 'from-purple-500 to-pink-500' },
    { name: 'Ping', freq: 720, color: 'from-green-500 to-cyan-500' },
    { name: 'Buzz', freq: 180, color: 'from-yellow-500 to-orange-500' },
    { name: 'Chirp', freq: 880, color: 'from-pink-500 to-purple-500' },
    { name: 'Beep', freq: 330, color: 'from-blue-500 to-purple-500' }
  ]
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#0d0015] to-[#0a0a14] text-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        {/* Back link */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 text-sm"
        >
          ← Back to Home
        </Link>
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
            <Volume2 className="w-10 h-10 text-cyan-400" />
            Glitch SFX Panel
          </h1>
          <p className="text-cyan-100/80 text-lg">
            Play subtle glitch UI sounds for prototypes. Free and fast. Perfect for cyberpunk interfaces.
          </p>
        </div>
        
        {/* Sound Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {sounds.map((sound) => (
            <motion.button
              key={sound.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={lastPlayed === sound.name ? { 
                boxShadow: ['0 0 20px rgba(0,255,255,0.5)', '0 0 40px rgba(0,255,255,0)', '0 0 20px rgba(0,255,255,0.5)'] 
              } : {}}
              onClick={() => play(sound.name, sound.freq)}
              className={`relative h-32 rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-br ${sound.color} overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 grid-bg opacity-20" />
              
              <div className="relative z-10 h-full flex flex-col items-center justify-center gap-2">
                <Zap className="w-8 h-8 text-white" />
                <span className="text-xl font-bold text-white">{sound.name}</span>
                <span className="text-xs text-white/70">{sound.freq} Hz</span>
              </div>
            </motion.button>
          ))}
        </div>
        
        {/* Instructions */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-500/30 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-cyan-400 mb-3">How to Use</h3>
          <ul className="text-cyan-100/80 space-y-2">
            <li>🔊 Click any button to play the sound</li>
            <li>🎵 Each sound has a unique frequency</li>
            <li>⚡ Perfect for UI prototypes and cyberpunk themes</li>
            <li>🎧 Best experienced with headphones</li>
          </ul>
        </div>
        
        {/* SEO Content */}
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">About Glitch Sound Effects</h2>
          <p className="text-cyan-100/80">
            Looking for quick glitch sound effects for your web UI? This tool generates retro-futuristic 
            SFX using the Web Audio API. Perfect for cyberpunk interfaces, sci-fi prototypes, or adding 
            that extra bit of personality to your projects.
          </p>
          
          <h3 className="text-xl font-bold text-purple-400 mt-8 mb-3">Use Cases</h3>
          <ul className="text-cyan-100/80 space-y-2">
            <li>🎮 Game UI prototypes</li>
            <li>💻 Futuristic web interfaces</li>
            <li>📱 App mockups with sound</li>
            <li>🎬 Video editing sound effects</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

