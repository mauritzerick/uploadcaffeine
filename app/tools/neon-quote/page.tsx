'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Copy, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function NeonQuotePage() {
  const quotes = [
    'Sleep? In this economy?',
    'Deploy coffee → deploy creativity',
    'Reality is in beta',
    'Bugs are just features in disguise',
    'Code now, sleep never',
    'Caffeine.execute()',
    'Ctrl+Z my life decisions',
    'console.log("send help")',
    'git commit -m "YOLO"',
    'It works on my machine ¯\\_(ツ)_/¯'
  ]
  
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [copied, setCopied] = useState(false)
  
  const generateQuote = () => {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setCurrentQuote(newQuote)
  }
  
  const copyQuote = () => {
    navigator.clipboard.writeText(currentQuote)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Neon Quote Generator
          </h1>
          <p className="text-cyan-100/80 text-lg">
            Generate cyberpunk neon quotes for your dev projects. Free tool by an Australian indie developer.
          </p>
        </div>
        
        {/* Quote Display */}
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-500/30 rounded-2xl p-8 md:p-12 mb-8"
          style={{
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.1)'
          }}
        >
          <div className="absolute inset-0 grid-bg opacity-10 rounded-2xl" />
          
          <p className="text-2xl md:text-4xl font-bold text-center relative z-10 text-cyan-300">
            &ldquo;{currentQuote}&rdquo;
          </p>
          
          <motion.div
            className="absolute top-4 right-4"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-purple-400 opacity-50" />
          </motion.div>
        </motion.div>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateQuote}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold px-6 py-3 rounded-xl"
          >
            <RefreshCw className="w-5 h-5" />
            Generate New Quote
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyQuote}
            className="flex items-center gap-2 bg-gray-800 border-2 border-cyan-500/30 text-cyan-400 font-bold px-6 py-3 rounded-xl"
          >
            <Copy className="w-5 h-5" />
            {copied ? 'Copied!' : 'Copy Quote'}
          </motion.button>
        </div>
        
        {/* SEO Content */}
        <div className="mt-16 prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">About This Tool</h2>
          <p className="text-cyan-100/80">
            Need a quick cyberpunk quote for your developer portfolio, GitHub README, or side project? 
            This neon quote generator creates fun, dev-focused quotes with that futuristic vibe.
          </p>
          
          <h3 className="text-xl font-bold text-purple-400 mt-8 mb-3">Features</h3>
          <ul className="text-cyan-100/80 space-y-2">
            <li>✨ Instant random quote generation</li>
            <li>📋 One-click copy to clipboard</li>
            <li>🎨 Cyberpunk aesthetic</li>
            <li>🆓 Completely free, no signup required</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

