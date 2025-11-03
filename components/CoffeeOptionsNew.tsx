'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Zap, Rocket, Crown, CreditCard, TrendingUp, RefreshCw } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { trackEvent } from '@/lib/analytics'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

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

  const handleCheckout = async (amountDollars: number) => {
    const amountCents = amountDollars * 100
    setLoading(true)

    // Track checkout start
    trackEvent('checkout_start', {
      amount: amountDollars,
      monthly: isMonthly,
    })

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountCents,
          monthly: isMonthly,
        }),
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
      setLoading(false)
    }
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
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 uppercase tracking-wider">
            If my work helped you,
            <br />
            buy me a coffee
          </h2>
          <p className="text-xl md:text-2xl text-cyan-100/80 font-light">
            No perks. No paywall. Just appreciation.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 border-2 border-cyan-500/30 overflow-hidden relative"
          style={{ boxShadow: '0 0 60px rgba(0, 255, 255, 0.3)' }}
        >
          <div className="absolute inset-0 scanline pointer-events-none" />

          {/* Monthly Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-4 bg-gray-900/50 p-2 rounded-lg border border-cyan-500/30">
              <button
                onClick={() => setIsMonthly(false)}
                className={`px-6 py-2 rounded-md font-bold uppercase tracking-wider transition-all ${
                  !isMonthly
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                    : 'text-cyan-400/60 hover:text-cyan-400'
                }`}
              >
                One-Time
              </button>
              <button
                onClick={() => setIsMonthly(true)}
                className={`px-6 py-2 rounded-md font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  isMonthly
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                    : 'text-purple-400/60 hover:text-purple-400'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                Monthly
              </button>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {coffeeTiers.map((tier) => {
              const Icon = tier.icon
              const isSelected = selectedAmount === tier.id
              
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
                  className={`relative p-6 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/20 to-purple-500/20'
                      : 'border-cyan-500/30 bg-gray-900/50 hover:border-cyan-400/50'
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 0 30px ${tier.glowColor}` : 'none',
                  }}
                >
                  {tier.popular && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      POPULAR
                    </div>
                  )}
                  <Icon
                    className="w-8 h-8 mx-auto mb-2 text-cyan-400"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))' }}
                  />
                  <div className="text-3xl font-bold text-white mb-1">${tier.id}</div>
                  <div className="text-cyan-400/70 text-sm uppercase tracking-wider">{tier.name}</div>
                </motion.button>
              )
            })}
          </div>

          {/* Custom Amount */}
          <div className="mb-8">
            <label className="block text-cyan-400 font-bold mb-2 uppercase tracking-wider text-sm">
              Or enter custom amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 text-xl font-bold">$</span>
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
                className="w-full pl-10 pr-4 py-4 bg-gray-900/50 border-2 border-cyan-500/30 rounded-lg focus:border-cyan-400 focus:outline-none text-2xl font-bold text-white placeholder-gray-600"
              />
            </div>
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={() => handleCheckout(currentAmount)}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-bold py-6 px-8 rounded-lg text-xl uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            style={{ boxShadow: '0 0 40px rgba(0, 255, 255, 0.5)' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <Coffee className="w-6 h-6" />
                {isMonthly ? `Support $${currentAmount}/month` : `Buy me a coffee - $${currentAmount}`}
                <Zap className="w-6 h-6" />
              </span>
            )}
          </motion.button>

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


