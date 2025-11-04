'use client'

import { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { motion, AnimatePresence } from 'framer-motion'
import InlinePayForm from './InlinePayForm'
import { Zap } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface InlinePayProps {
  amount: number
  monthly: boolean
  coffeeType: string
  onSuccess: () => void
  onCancel: () => void
}

export default function InlinePay({ amount, monthly, coffeeType, onSuccess, onCancel }: InlinePayProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch PaymentIntent clientSecret from server
    const fetchPaymentIntent = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            monthly,
            coffeeType,
          }),
        })

        const data = await response.json()

        if (!response.ok || data.error) {
          const errorMessage = data.code === 'STRIPE_NOT_CONFIGURED'
            ? 'Payment system is temporarily unavailable. Please try again later or contact support.'
            : data.error || 'Failed to initialize payment'
          setError(errorMessage)
          setLoading(false)
          return
        }

        // If it's a subscription, we need to handle it differently (redirect)
        if (data.isSubscription && data.sessionId) {
          // For subscriptions, redirect to Stripe Checkout
          const stripe = await stripePromise
          if (stripe) {
            await stripe.redirectToCheckout({ sessionId: data.sessionId })
          }
          return
        }

        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          setError('No client secret received')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to initialize payment')
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentIntent()
  }, [amount, monthly, coffeeType])

  const elementsOptions: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    loader: 'auto',
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#00ffff',
        colorBackground: '#1a1a2e',
        colorText: '#ffffff',
        colorDanger: '#ff006e',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        borderRadius: '8px',
      },
      rules: {
        '.Input': {
          border: '2px solid rgba(0, 255, 255, 0.3)',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.1)',
          backgroundColor: 'rgba(26, 26, 46, 0.8)',
        },
        '.Input:focus': {
          border: '2px solid rgba(0, 255, 255, 0.8)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
        },
        '.Label': {
          color: '#00ffff',
          fontWeight: '600',
          textTransform: 'uppercase',
          fontSize: '12px',
          letterSpacing: '1px',
        },
        '.Tab': {
          border: '2px solid rgba(0, 255, 255, 0.3)',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.1)',
        },
        '.Tab:hover': {
          border: '2px solid rgba(0, 255, 255, 0.5)',
          boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
        },
        '.Tab--selected': {
          border: '2px solid rgba(0, 255, 255, 0.8)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)',
          backgroundColor: 'rgba(0, 255, 255, 0.1)',
        },
      },
    },
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-6 p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border-2 border-cyan-500/30"
        style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)' }}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Zap className="w-12 h-12 text-cyan-400" style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.8))' }} />
          </motion.div>
          <p className="text-cyan-400 font-mono uppercase tracking-wider">Initializing secure payment...</p>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-6 p-8 bg-gradient-to-br from-red-900/30 to-gray-900/50 backdrop-blur-sm rounded-xl border-2 border-red-500/50"
        style={{ boxShadow: '0 0 30px rgba(255, 0, 0, 0.2)' }}
      >
        <div className="text-center">
          <p className="text-red-400 font-bold mb-4">⚠️ {error}</p>
          <motion.button
            onClick={onCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gray-800 border-2 border-cyan-500/30 hover:border-cyan-500 text-cyan-400 font-bold rounded-lg uppercase tracking-wider transition-all"
          >
            Go Back
          </motion.button>
        </div>
      </motion.div>
    )
  }

  if (!clientSecret) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="mt-6 p-4 sm:p-8 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-xl border-2 border-cyan-500/50 relative overflow-hidden"
      style={{ boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)' }}
    >
      {/* Scanline effect */}
      <div className="absolute inset-0 scanline pointer-events-none opacity-30" />
      
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 20px rgba(0, 255, 255, 0.3)',
            '0 0 40px rgba(255, 0, 255, 0.3)',
            '0 0 20px rgba(0, 255, 255, 0.3)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative z-10">
        <div className="mb-6 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wider">
            Secure Payment Form
          </h3>
          <p className="text-cyan-100/60 text-sm mt-2">
            Amount: <span className="text-cyan-400 font-bold text-lg">${(amount / 100).toFixed(2)}</span>
          </p>
        </div>

        <AnimatePresence mode="wait">
          {clientSecret && (
            <Elements stripe={stripePromise} options={elementsOptions}>
              <InlinePayForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
            </Elements>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}


