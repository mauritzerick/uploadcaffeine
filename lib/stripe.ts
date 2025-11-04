import Stripe from 'stripe'

// Lazy initialization to avoid errors during build time
// The Stripe client will be initialized when first used
let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
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

