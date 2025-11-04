import Stripe from 'stripe'

// Lazy initialization to avoid errors during build time
// The Stripe client will be initialized when first used
let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeInstance) {
    // Try multiple possible environment variable names
    const secretKey = 
      process.env.STRIPE_SECRET_KEY || 
      process.env.STRIPE_SECRET_KEY_LIVE || 
      process.env.STRIPE_SECRET_KEY_TEST ||
      process.env.STRIPE_API_KEY ||
      process.env.STRIPE_SECRET
    
    if (!secretKey) {
      const error = new Error('STRIPE_SECRET_KEY is not set in environment variables')
      // Log helpful debugging info (without exposing sensitive data)
      console.error('⚠️ Stripe Configuration Error:', {
        availableEnvVars: Object.keys(process.env).filter(k => k.includes('STRIPE')),
        nodeEnv: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
      })
      throw error
    }
    
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  }
  return stripeInstance
}

// Export a getter that initializes on first use
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    const instance = getStripe()
    const value = instance[prop as keyof Stripe]
    return typeof value === 'function' ? value.bind(instance) : value
  }
})

