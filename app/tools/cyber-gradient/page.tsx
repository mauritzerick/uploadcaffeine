'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Palette } from 'lucide-react'
import Link from 'next/link'

export default function CyberGradientPage() {
  const [copied, setCopied] = useState<string | null>(null)
  
  const copyGradient = (css: string, id: string) => {
    navigator.clipboard.writeText(css)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }
  
  const presets = [
    {
      id: '1',
      name: 'Cyan to Purple',
      css: 'linear-gradient(135deg, #00ffff 0%, #b000ff 100%)'
    },
    {
      id: '2',
      name: 'Magenta to Cyan',
      css: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)'
    },
    {
      id: '3',
      name: 'Neon Dual Radial',
      css: 'radial-gradient(circle at 30% 30%, rgba(0,255,255,0.4), transparent 50%), radial-gradient(circle at 70% 70%, rgba(255,0,255,0.4), transparent 50%)'
    },
    {
      id: '4',
      name: 'Electric Blue',
      css: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)'
    },
    {
      id: '5',
      name: 'Pink Glow',
      css: 'linear-gradient(135deg, #ff0080 0%, #ff8c00 100%)'
    },
    {
      id: '6',
      name: 'Matrix Green',
      css: 'linear-gradient(135deg, #00ff41 0%, #00cc88 100%)'
    },
    {
      id: '7',
      name: 'Cyber Purple',
      css: 'linear-gradient(135deg, #b000ff 0%, #ff00ff 100%)'
    },
    {
      id: '8',
      name: 'Triple Neon',
      css: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #ffff00 100%)'
    },
    {
      id: '9',
      name: 'Dark Cyber',
      css: 'linear-gradient(135deg, #0a0a14 0%, #1a0f2e 100%)'
    }
  ]
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#0d0015] to-[#0a0a14] text-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
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
            <Palette className="w-10 h-10 text-cyan-400" />
            Cyber Gradient Maker
          </h1>
          <p className="text-cyan-100/80 text-lg">
            Generate neon gradients for your cyberpunk UI. Click any gradient to copy the CSS code.
          </p>
        </div>
        
        {/* Gradient Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {presets.map((preset) => (
            <motion.button
              key={preset.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyGradient(preset.css, preset.id)}
              className="relative h-48 rounded-2xl border-2 border-cyan-500/30 overflow-hidden group"
              style={{ background: preset.css }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              
              {/* Name and Copy Icon */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                <span className="text-xl font-bold text-white drop-shadow-lg">
                  {preset.name}
                </span>
                
                <div className="flex items-center gap-2 text-white/80">
                  {copied === preset.id ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span className="text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span className="text-sm">Click to copy</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="h-full w-full" style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
                }} />
              </div>
            </motion.button>
          ))}
        </div>
        
        {/* Instructions */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-500/30 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-cyan-400 mb-3">How to Use</h3>
          <ul className="text-cyan-100/80 space-y-2">
            <li>🎨 Click any gradient to copy the CSS code</li>
            <li>📋 Paste directly into your stylesheets</li>
            <li>✨ Works with any CSS property that accepts gradients</li>
            <li>🚀 Optimized for modern browsers</li>
          </ul>
        </div>
        
        {/* SEO Content */}
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">About Cyberpunk Gradients</h2>
          <p className="text-cyan-100/80">
            Create stunning neon gradients for your cyberpunk and futuristic web designs. 
            These CSS gradients are optimized for modern interfaces with that retro-futuristic aesthetic.
          </p>
          
          <h3 className="text-xl font-bold text-purple-400 mt-8 mb-3">Perfect For</h3>
          <ul className="text-cyan-100/80 space-y-2">
            <li>🌃 Cyberpunk websites and apps</li>
            <li>🎮 Gaming interfaces</li>
            <li>💻 Developer portfolios</li>
            <li>🎨 Creative projects</li>
            <li>⚡ Futuristic landing pages</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

