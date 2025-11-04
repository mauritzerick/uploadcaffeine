import { NextResponse } from 'next/server'

/**
 * Diagnostic endpoint to check Stripe configuration
 * Only works in development or with proper auth
 */
export async function GET() {
  // Only allow in development or with proper auth
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_DIAGNOSTICS) {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    )
  }

  const diagnostics = {
    hasSecretKey: !!(
      process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY_LIVE ||
      process.env.STRIPE_SECRET_KEY_TEST ||
      process.env.STRIPE_API_KEY ||
      process.env.STRIPE_SECRET
    ),
    hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKeyPrefix: process.env.STRIPE_SECRET_KEY
      ? process.env.STRIPE_SECRET_KEY.substring(0, 7)
      : 'not set',
    publishableKeyPrefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 7)
      : 'not set',
    nodeEnv: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    allStripeEnvVars: Object.keys(process.env)
      .filter(k => k.includes('STRIPE'))
      .map(k => ({ key: k, hasValue: !!process.env[k], prefix: process.env[k]?.substring(0, 7) || 'empty' })),
  }

  return NextResponse.json(diagnostics)
}

