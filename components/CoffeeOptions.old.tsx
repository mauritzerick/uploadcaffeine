'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Coffee, Zap, Rocket, Crown, CreditCard, TrendingUp } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

const coffeeTiers = [
  {
    id: 'tier1',
    name: 'Single Brew',
    amount: 5,
    icon: Coffee,
    description: 'Power up my code with a single shot',
    gradient: 'from-cyan-500 to-blue-600',
    glowColor: 'rgba(0, 255, 255, 0.6)',
    borderColor: 'border-cyan-500/50',
  },
  {
    id: 'tier2',
    name: 'Triple Shot',
    amount: 15,
    icon: Zap,
    description: 'Supercharge my productivity!',
    gradient: 'from-purple-500 to-pink-600',
    glowColor: 'rgba(255, 0, 255, 0.6)',
    borderColor: 'border-purple-500/50',
    popular: true,
  },
  {
    id: 'tier3',
    name: 'Turbo Boost',
    amount: 25,
    icon: Rocket,
    description: 'Launch me into overdrive',
    gradient: 'from-pink-500 to-orange-600',
    glowColor: 'rgba(255, 105, 180, 0.6)',
    borderColor: 'border-pink-500/50',
  },
  {
    id: 'tier4',
    name: 'Elite Sponsor',
    amount: 50,
    icon: Crown,
    description: 'Become an elite supporter',
    gradient: 'from-yellow-500 via-purple-500 to-cyan-500',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    borderColor: 'border-yellow-500/50',
  },
]

export default function CoffeeOptions() {
  const [loading, setLoading] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState('')

  const handleCheckout = async (amount: number) => {
    setLoading(`${amount}`)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      })

      const { sessionId } = await response.json()

      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Error:', error)
          alert('Something went wrong. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleCustomAmount = () => {
    const amount = parseFloat(customAmount)
    if (amount && amount >= 1) {
      handleCheckout(amount * 100) // Convert to cents
    } else {
      alert('Please enter a valid amount (minimum $1)')
    }
  }

  return (
    <section id="coffee" className="relative py-20 px-4 bg-gradient-to-br from-[#0a0a14] via-[#120a1f] to-[#0a0a14] overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <TrendingUp 
                className="w-10 h-10 text-cyan-400"
                style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.8))' }}
              />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              CHOOSE YOUR POWER LEVEL
            </h2>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Zap 
                className="w-10 h-10 text-pink-500"
                style={{ filter: 'drop-shadow(0 0 15px rgba(255, 0, 255, 0.8))' }}
              />
            </motion.div>
          </div>
          <p className="text-xl md:text-2xl text-cyan-100 max-w-2xl mx-auto font-light">
            <span className="text-purple-400">Select a tier</span> or <span className="text-pink-400">enter a custom amount</span>
            <br />
            <span className="text-cyan-400 font-semibold">Every contribution fuels innovation</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {coffeeTiers.map((tier, index) => {
            const Icon = tier.icon
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border-2 ${tier.borderColor} ${
                  tier.popular ? 'scale-105 md:scale-110' : ''
                }`}
                style={{
                  boxShadow: tier.popular 
                    ? `0 0 40px ${tier.glowColor}` 
                    : `0 0 20px ${tier.glowColor}`,
                }}
              >
                {tier.popular && (
                  <motion.div
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg z-20 uppercase tracking-wider"
                    style={{
                      boxShadow: '0 0 20px rgba(255, 0, 255, 0.8)',
                    }}
                  >
                    Most Popular
                  </motion.div>
                )}

                {/* Scanline effect */}
                <div className="absolute inset-0 scanline pointer-events-none" />

                {/* Top section with icon and name */}
                <div className={`relative p-6 bg-gradient-to-br ${tier.gradient} overflow-hidden`}>
                  {/* Animated particles */}
                  <motion.div
                    className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white"
                    animate={{ 
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.5, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="mb-4"
                    >
                      <Icon 
                        className="w-16 h-16 text-white"
                        style={{
                          filter: `drop-shadow(0 0 20px ${tier.glowColor})`,
                        }}
                      />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white text-center mb-2 uppercase tracking-wider">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-white/90 text-center font-light">
                      {tier.description}
                    </p>
                  </div>
                </div>

                {/* Bottom section with price and button */}
                <div className="p-6 bg-gray-900/50 backdrop-blur-sm">
                  <div 
                    className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent"
                    style={{
                      textShadow: `0 0 30px ${tier.glowColor}`,
                    }}
                  >
                    ${tier.amount}
                  </div>
                  <motion.button
                    onClick={() => handleCheckout(tier.amount * 100)}
                    disabled={loading === `${tier.amount * 100}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full bg-gradient-to-r ${tier.gradient} hover:opacity-90 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider text-sm ${
                      loading === `${tier.amount * 100}`
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    style={{
                      boxShadow: `0 0 20px ${tier.glowColor}`,
                    }}
                  >
                    {loading === `${tier.amount * 100}` ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Support Now
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Custom amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border-2 border-cyan-500/50 relative overflow-hidden"
          style={{
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)',
          }}
        >
          {/* Scanline effect */}
          <div className="absolute inset-0 scanline pointer-events-none" />

          {/* Animated corner accents */}
          <motion.div
            className="absolute top-4 right-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <CreditCard 
              className="w-8 h-8 text-cyan-400"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))' }}
            />
          </motion.div>

          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wider">
            Custom Power Level
          </h3>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-cyan-400 mb-2 uppercase tracking-wider">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 text-2xl font-bold">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border-2 border-cyan-500/50 rounded-lg focus:border-cyan-500 focus:outline-none text-2xl font-bold text-white placeholder-gray-600 backdrop-blur-sm"
                  style={{
                    boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
                  }}
                />
              </div>
            </div>
            <div className="flex items-end">
              <motion.button
                onClick={handleCustomAmount}
                disabled={loading !== null}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                className={`w-full md:w-auto bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                style={{
                  boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
                }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Donate
                  </>
                )}
              </motion.button>
            </div>
          </div>
          <p className="text-sm text-cyan-400/70 mt-6 text-center font-mono uppercase tracking-wider">
            Minimum: $1.00 • Every contribution matters
          </p>
        </motion.div>
      </div>
    </section>
  )
}
