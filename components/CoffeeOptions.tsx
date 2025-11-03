'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Zap, Rocket, Crown, CreditCard, TrendingUp, RefreshCw, ChevronDown } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { trackEvent } from '@/lib/analytics'
import ParticleBurst from './ParticleBurst'
import DeviceHologram from './DeviceHologram'
import InlinePay from './InlinePay'
import { useFeatureFlagsContext } from '@/providers/FeatureFlagsProvider'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

const coffeeTypes = [
  { id: 'espresso', name: '☕ Espresso', color: 'from-amber-600 to-orange-700', particleColor: '#ff8800' },
  { id: 'nitro', name: '🧊 Nitro Cold Brew', color: 'from-blue-600 to-indigo-700', particleColor: '#00ffff' },
  { id: 'matcha', name: '🍵 Matcha Latte', color: 'from-green-500 to-emerald-600', particleColor: '#00ff88' },
  { id: 'cyber', name: '⚡ Cyber-Latte', color: 'from-purple-600 to-pink-600', particleColor: '#ff00ff' },
]

const coffeeTiers = [
  { id: 3, name: 'Small', icon: Coffee, gradient: 'from-cyan-500 to-blue-600', glowColor: 'rgba(0, 255, 255, 0.6)' },
  { id: 5, name: 'Medium', icon: Zap, gradient: 'from-purple-500 to-pink-600', glowColor: 'rgba(255, 0, 255, 0.6)', popular: true },
  { id: 10, name: 'Large', icon: Rocket, gradient: 'from-pink-500 to-orange-600', glowColor: 'rgba(255, 105, 180, 0.6)' },
]

export default function CoffeeOptions() {
  const [loading, setLoading] = useState(false)
  const [customAmount, setCustomAmount] = useState('')
  const [isMonthly, setIsMonthly] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(5)
  const [particleBurst, setParticleBurst] = useState(false)
  const [coffeeType, setCoffeeType] = useState('cyber')
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const { isEnabled } = useFeatureFlagsContext()
  const router = useRouter()

  const handleCheckout = async (amountDollars: number) => {
    const amountCents = amountDollars * 100
    
    // Trigger particle burst
    setParticleBurst(true)
    setTimeout(() => setParticleBurst(false), 100)

    // Track checkout start
    trackEvent('checkout_start', {
      amount: amountDollars,
      monthly: isMonthly,
      method: isMonthly ? 'redirect' : 'inline',
    })

    // For monthly subscriptions, redirect to Stripe Checkout (subscriptions require it)
    if (isMonthly) {
      setLoading(true)
      
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountCents,
            monthly: true,
            coffeeType,
          }),
        })

        const data = await response.json()
        
        if (!response.ok || data.error) {
          console.error('API Error:', data.error || 'Unknown error')
          alert(`Error: ${data.error || 'Something went wrong. Please try again.'}`)
          setLoading(false)
          return
        }

        if (data.sessionId) {
          const stripe = await stripePromise
          if (stripe) {
            await stripe.redirectToCheckout({ sessionId: data.sessionId })
          }
        }
      } catch (error: any) {
        console.error('Checkout error:', error)
        alert(`Error: ${error.message || 'Something went wrong. Please try again.'}`)
        setLoading(false)
      }
    } else {
      // For one-time payments, show inline payment form
      setShowPaymentForm(true)
    }
  }

  const handlePaymentSuccess = () => {
    // Trigger particle burst on success
    setParticleBurst(true)
    
    // Redirect to success page after a short delay
    setTimeout(() => {
      router.push('/success')
    }, 500)
  }

  const handlePaymentCancel = () => {
    setShowPaymentForm(false)
    setLoading(false)
  }

  const handleCustomAmount = () => {
    const amount = parseFloat(customAmount)
    if (amount && amount >= 1) {
      handleCheckout(amount)
    } else {
      alert('Please enter a valid amount (minimum $1)')
    }
  }

  const currentAmount = selectedAmount || parseFloat(customAmount) || 5

  return (
    <section id="coffee" className="relative py-20 px-4 bg-gradient-to-br from-[#0a0a14] via-[#120a1f] to-[#0a0a14] overflow-hidden">
      {/* Particle Burst Effect */}
      <ParticleBurst trigger={particleBurst} />
      
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3 sm:mb-4 uppercase tracking-wider leading-tight">
            Upload caffeine
            <br />
            to my system ☕⚡
          </h2>
          <p className="text-base sm:text-xl md:text-2xl text-cyan-100/80 font-light px-4">
            No perks. No paywall. Just appreciation.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-8 md:p-12 border-2 border-cyan-500/30 overflow-hidden relative"
          style={{ boxShadow: '0 0 60px rgba(0, 255, 255, 0.3)' }}
        >
          <div className="absolute inset-0 scanline pointer-events-none" />

          {/* Monthly Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 sm:gap-4 bg-gray-900/50 p-2 rounded-lg border border-cyan-500/30">
              <button
                onClick={() => setIsMonthly(false)}
                className={`px-3 sm:px-6 py-2 rounded-md font-bold uppercase tracking-wider transition-all text-xs sm:text-sm ${
                  !isMonthly
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                    : 'text-cyan-400/60 hover:text-cyan-400'
                }`}
              >
                One-Time
              </button>
              <button
                onClick={() => setIsMonthly(true)}
                className={`px-3 sm:px-6 py-2 rounded-md font-bold uppercase tracking-wider transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                  isMonthly
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                    : 'text-purple-400/60 hover:text-purple-400'
                }`}
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                Monthly
              </button>
            </div>
          </div>

          {/* Coffee Type Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <label className="block text-cyan-400 font-bold mb-3 uppercase tracking-wider text-xs sm:text-sm text-center">
              Choose Your Brew ☕
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {coffeeTypes.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => {
                    setCoffeeType(type.id)
                    trackEvent('coffee_type_selected', { type: type.name })
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-2 sm:p-3 rounded-lg border-2 transition-all text-xs sm:text-sm font-semibold ${
                    coffeeType === type.id
                      ? `border-cyan-400 bg-gradient-to-r ${type.color}`
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                  }`}
                >
                  <span className={`${coffeeType === type.id ? 'text-white' : 'text-gray-400'} block truncate`}>
                    {type.name}
                  </span>
                  {coffeeType === type.id && (
                    <motion.div
                      layoutId="coffeeBorder"
                      className="absolute inset-0 rounded-lg border-2 border-cyan-400"
                      style={{
                        boxShadow: `0 0 15px ${type.particleColor}`,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Amount Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
            {coffeeTiers.map((tier) => {
              const Icon = tier.icon
              const isSelected = selectedAmount === tier.id
              // Calculate glow intensity based on amount (more = hotter/brighter)
              const glowIntensity = tier.id / 10 // 0.3, 0.5, 1.0
              const baseGlow = isSelected ? 30 : 15
              const glowSize = baseGlow + (glowIntensity * 20)
              
              return (
                <motion.button
                  key={tier.id}
                  onClick={() => {
                    setSelectedAmount(tier.id)
                    setCustomAmount('')
                    trackEvent('cta_click', { tier: tier.name, amount: tier.id })
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: isSelected
                      ? [
                          `0 0 ${glowSize}px ${tier.glowColor}`,
                          `0 0 ${glowSize + 10}px ${tier.glowColor}`,
                          `0 0 ${glowSize}px ${tier.glowColor}`,
                        ]
                      : 'none',
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/20 to-purple-500/20'
                      : 'border-cyan-500/30 bg-gray-900/50 hover:border-cyan-400/50'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] sm:text-xs px-2 py-1 rounded-full font-bold">
                      POPULAR
                    </div>
                  )}
                  <Icon
                    className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-cyan-400"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))' }}
                  />
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">${tier.id}</div>
                  <div className="text-cyan-400/70 text-xs sm:text-sm uppercase tracking-wider">{tier.name}</div>
                </motion.button>
              )
            })}
          </div>

          {/* Custom Amount */}
          <div className="mb-8">
            <label className="block text-cyan-400 font-bold mb-2 uppercase tracking-wider text-xs sm:text-sm">
              Or enter custom amount
            </label>
            <div className="relative">
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-cyan-400 text-lg sm:text-xl font-bold">$</span>
              <input
                type="number"
                min="1"
                step="1"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setSelectedAmount(null)
                }}
                placeholder="10"
                className="w-full pl-8 sm:pl-10 pr-4 py-3 sm:py-4 bg-gray-900/50 border-2 border-cyan-500/30 rounded-lg focus:border-cyan-400 focus:outline-none text-xl sm:text-2xl font-bold text-white placeholder-gray-600"
              />
            </div>
          </div>

          {/* CTA Button with Device Hologram */}
          {isEnabled('device_hologram') ? (
            <DeviceHologram>
              <motion.button
                onClick={() => handleCheckout(currentAmount)}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                animate={{
                  boxShadow: loading
                    ? '0 0 40px rgba(0, 255, 255, 0.5)'
                    : [
                        `0 0 ${30 + currentAmount * 2}px rgba(0, 255, 255, ${0.3 + currentAmount * 0.03})`,
                        `0 0 ${40 + currentAmount * 2}px rgba(255, 0, 255, ${0.4 + currentAmount * 0.03})`,
                        `0 0 ${30 + currentAmount * 2}px rgba(0, 255, 255, ${0.3 + currentAmount * 0.03})`,
                      ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-bold py-4 sm:py-6 px-4 sm:px-8 rounded-lg text-base sm:text-xl uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm sm:text-base">Processing...</span>
                  </span>
                ) : showPaymentForm && !isMonthly ? (
                  <span className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
                    <span className="text-sm sm:text-base">Secure Payment Form Below</span>
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-base">
                      {isMonthly ? `Support $${currentAmount}/month` : `Buy me a coffee - $${currentAmount}`}
                    </span>
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                  </span>
                )}
              </motion.button>
            </DeviceHologram>
          ) : (
            <motion.button
              onClick={() => handleCheckout(currentAmount)}
              disabled={loading || (showPaymentForm && !isMonthly)}
              whileHover={{ scale: (loading || (showPaymentForm && !isMonthly)) ? 1 : 1.02 }}
              whileTap={{ scale: (loading || (showPaymentForm && !isMonthly)) ? 1 : 0.98 }}
              animate={{
                boxShadow: loading
                  ? '0 0 40px rgba(0, 255, 255, 0.5)'
                  : [
                      `0 0 ${30 + currentAmount * 2}px rgba(0, 255, 255, ${0.3 + currentAmount * 0.03})`,
                      `0 0 ${40 + currentAmount * 2}px rgba(255, 0, 255, ${0.4 + currentAmount * 0.03})`,
                      `0 0 ${30 + currentAmount * 2}px rgba(0, 255, 255, ${0.3 + currentAmount * 0.03})`,
                    ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-full bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-bold py-4 sm:py-6 px-4 sm:px-8 rounded-lg text-base sm:text-xl uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm sm:text-base">Processing...</span>
                </span>
              ) : showPaymentForm && !isMonthly ? (
                <span className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
                  <span className="text-sm sm:text-base">Secure Payment Form Below</span>
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-base">
                    {isMonthly ? `Support $${currentAmount}/month` : `Buy me a coffee - $${currentAmount}`}
                  </span>
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
              )}
            </motion.button>
          )}

          {/* Inline Payment Form */}
          <AnimatePresence>
            {showPaymentForm && !isMonthly && (
              <InlinePay
                amount={currentAmount * 100}
                monthly={isMonthly}
                coffeeType={coffeeType}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            )}
          </AnimatePresence>

          {/* Trust Message */}
          <p className="text-center text-cyan-400/60 text-sm mt-6 font-light">
            Funds cover hosting, coffee, and bug-fix snacks. {isMonthly && 'Cancel anytime.'}
          </p>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-cyan-100/60 text-sm font-light"
        >
          <p>Every coffee = fewer bugs (probably)</p>
        </motion.div>
      </div>
    </section>
  )
}

