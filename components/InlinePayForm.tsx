'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import { Zap, Coffee, AlertCircle, CheckCircle2 } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

interface InlinePayFormProps {
  amount: number
  onSuccess: () => void
  onCancel: () => void
}

export default function InlinePayForm({ amount, onSuccess, onCancel }: InlinePayFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || 'Failed to submit payment')
        setLoading(false)
        return
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
      })

      if (confirmError) {
        setError(confirmError.message || 'Payment failed')
        setLoading(false)
        trackEvent('payment_failed', { error: confirmError.message || 'Payment failed', amount: amount / 100 })
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSuccess(true)
        trackEvent('checkout_success', { amount: amount / 100, method: 'inline' })
        
        // Wait a bit to show success state, then trigger parent callback
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
      trackEvent('payment_error', { error: err instanceof Error ? err.message : String(err), amount: amount / 100 })
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)' }}
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-green-400 mb-2">Payment Successful!</h3>
        <p className="text-cyan-100/80">Redirecting to celebration...</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="relative">
        <PaymentElement
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card'],
            fields: {
              billingDetails: {
                name: 'auto',
                email: 'auto',
                phone: 'never',
                address: 'never',
              },
            },
            terms: {
              card: 'never',
            },
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/50 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <motion.button
          type="submit"
          disabled={!stripe || loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="flex-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-bold py-4 px-6 rounded-lg text-lg uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          style={{
            boxShadow: loading
              ? '0 0 40px rgba(0, 255, 255, 0.5)'
              : '0 0 30px rgba(0, 255, 255, 0.4)',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-sm sm:text-base">Processing...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Coffee className="w-5 h-5" />
              <span className="text-sm sm:text-base">Pay ${(amount / 100).toFixed(2)}</span>
              <Zap className="w-5 h-5" />
            </span>
          )}
        </motion.button>

        <motion.button
          type="button"
          onClick={onCancel}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="px-6 py-4 bg-gray-800 border-2 border-cyan-500/30 hover:border-cyan-500 text-cyan-400 font-bold rounded-lg uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
        >
          Cancel
        </motion.button>
      </div>

      {/* Trust Message */}
      <p className="text-center text-cyan-400/60 text-xs mt-4">
        🔒 Secure payment powered by Stripe • No card data stored
      </p>
    </form>
  )
}


