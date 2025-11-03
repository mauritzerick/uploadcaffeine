'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, CheckCircle, Zap, Home, Share2, Twitter, Linkedin, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'
import HoloCoin from '@/components/HoloCoin'
import Achievement from '@/components/Achievement'

const cyberThanksMessages = [
  "🧠 Neural caffeine acquired. System efficiency +3%",
  "☕ Energy core fueled. Initiating higher_purpose.exe",
  "⚡ Quantum coffee particles detected. Creativity matrix: OVERCLOCKED",
  "🔋 Power cells recharged. Developer mode: LEGENDARY",
  "💾 Transaction logged to the blockchain of gratitude",
  "🚀 Coffee fuel injected. Launching innovation sequence...",
  "🎯 Support signal received. Dopamine levels: OPTIMAL",
  "⚙️ Cybernetic enhancement complete. Productivity boost: +47%",
  "🌟 Energy transfer successful. Next-level coding: UNLOCKED",
  "💻 Hacker fuel delivered. Bug-crushing mode: ACTIVATED",
  "🔥 Core temperature rising. Creative fire: IGNITED",
  "🎮 Achievement unlocked: LEGENDARY SUPPORTER",
  "🧪 Experimental coffee compound synthesized. Results: EXTRAORDINARY",
  "📡 Support beacon detected across the digital void. Connection: STRONG"
]

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [shareOpen, setShareOpen] = useState(false)
  const [thanksMessage, setThanksMessage] = useState('')
  const [showCoin, setShowCoin] = useState(false)
  const [showAchievement, setShowAchievement] = useState(false)

  useEffect(() => {
    // Track success
    trackEvent('checkout_success')
    
    // Select random thanks message
    setThanksMessage(cyberThanksMessages[Math.floor(Math.random() * cyberThanksMessages.length)])
    
    const timer = setTimeout(() => {
      setLoading(false)
      setShowCoin(true)
      // Hide coin after 3 seconds
      setTimeout(() => setShowCoin(false), 3000)
      // Show achievement after coin
      setTimeout(() => setShowAchievement(true), 3500)
      // Hide achievement after 5 seconds
      setTimeout(() => setShowAchievement(false), 8500)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const shareText = "I just supported this project! Check it out 💙"
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const handleShare = (platform: string) => {
    trackEvent('cta_click', { action: 'share', platform })
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    }

    if (platform === 'twitter' || platform === 'linkedin') {
      window.open(urls[platform as keyof typeof urls], '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a14] via-[#120a1f] to-[#0a0a14]">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Zap 
            className="w-16 h-16 text-cyan-400"
            style={{ filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.8))' }}
          />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a14] via-[#120a1f] to-[#0a0a14] px-4 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      {/* Floating cyber particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          <div 
            className="w-1 h-1 rounded-full"
            style={{
              background: i % 3 === 0 ? '#00ffff' : i % 3 === 1 ? '#ff00ff' : '#b000ff',
              boxShadow: `0 0 15px currentColor`,
            }}
          />
        </motion.div>
      ))}

      {/* Holo Coin Celebration */}
      {showCoin && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: -100 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <HoloCoin />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="max-w-md w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center border-2 border-cyan-500/50 relative z-10 overflow-hidden"
        style={{
          boxShadow: '0 0 60px rgba(0, 255, 255, 0.4)',
        }}
      >
        {/* Scanline effect */}
        <div className="absolute inset-0 scanline pointer-events-none" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6 relative z-10"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto shadow-lg relative"
            style={{
              boxShadow: '0 0 40px rgba(0, 255, 255, 0.6)',
            }}
          >
            <CheckCircle 
              className="w-14 h-14 text-white"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.8))',
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-cyan-400"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 uppercase tracking-wider relative z-10"
        >
          Success!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-cyan-100 mb-6 font-light relative z-10"
        >
          <span className="text-cyan-400 font-semibold">Transaction complete!</span>
          <br />
          Your support powers innovation
        </motion.p>

        {/* AI Thanks Message */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="mb-6 relative z-10"
        >
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(0, 255, 255, 0.3)',
                '0 0 30px rgba(255, 0, 255, 0.3)',
                '0 0 20px rgba(0, 255, 255, 0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm px-4 py-3 rounded-lg border border-cyan-500/30"
          >
            <p className="text-sm md:text-base text-cyan-300 font-mono leading-relaxed">
              {thanksMessage}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3 text-purple-400 mb-8 text-lg relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="w-6 h-6" />
          </motion.div>
          <span className="font-bold uppercase tracking-wider">Payment Verified</span>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          >
            <Heart className="w-6 h-6 fill-current text-pink-500" />
          </motion.div>
        </motion.div>

        {sessionId && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-cyan-400/60 mb-6 font-mono relative z-10"
          >
            SESSION: {sessionId.substring(0, 20)}...
          </motion.p>
        )}

        <div className="space-y-4 relative z-10">
          {/* Share Section */}
          <div className="mb-6">
            <button
              onClick={() => setShareOpen(!shareOpen)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-4 px-6 rounded-lg text-lg uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              style={{ boxShadow: '0 0 20px rgba(255, 0, 255, 0.5)' }}
            >
              <Share2 className="w-5 h-5" />
              Share & Spread the Word
            </button>

            {shareOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-4 flex gap-3 justify-center"
              >
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex-1 bg-gray-800 border border-cyan-500/30 hover:border-cyan-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Twitter className="w-5 h-5" />
                  Twitter
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex-1 bg-gray-800 border border-cyan-500/30 hover:border-cyan-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </button>
              </motion.div>
            )}
          </div>

          {/* Consider Monthly CTA (if was one-time) */}
          <Link href="/#coffee">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gray-800 border-2 border-purple-500/50 text-white font-bold py-4 px-6 rounded-lg text-lg uppercase tracking-wider flex items-center justify-center gap-2 hover:border-purple-500 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Make it Monthly?
            </motion.button>
          </Link>

          {/* Return Home */}
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg text-lg uppercase tracking-wider flex items-center justify-center gap-2"
              style={{
                boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
              }}
            >
              <Home className="w-5 h-5" />
              Return Home
            </motion.button>
          </Link>

          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center justify-center gap-2 text-cyan-400/80 text-sm font-mono uppercase tracking-wider pt-4"
          >
            <Heart className="w-4 h-4 fill-current text-pink-500" />
            <span>Thank You for Your Support</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Achievement Notification */}
      <Achievement
        title="☕ First Brew"
        description="You've made your first support! Welcome to the cyber community."
        icon="trophy"
        isVisible={showAchievement}
      />
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a14] via-[#120a1f] to-[#0a0a14]">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Zap 
              className="w-16 h-16 text-cyan-400"
              style={{ filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.8))' }}
            />
          </motion.div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
