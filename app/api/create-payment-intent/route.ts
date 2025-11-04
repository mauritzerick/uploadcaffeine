import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { amount, monthly, name, message, coffeeType } = await request.json()

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum is $1.00' },
        { status: 400 }
      )
    }

    // For one-time payments, create a PaymentIntent
    if (!monthly) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'aud',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          name: name || '',
          message: message || '',
          coffeeType: coffeeType || 'cyber',
          monthly: 'false',
        },
        description: `Buy Me a Coffee - $${(amount / 100).toFixed(2)}`,
      })

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      })
    } else {
      // For monthly subscriptions, we still need to use Checkout Sessions
      // PaymentIntent doesn't support subscriptions directly
      const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'aud',
              product_data: {
                name: 'Monthly Coffee Support',
                description: 'Recurring monthly support - cancel anytime',
              },
              unit_amount: amount,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/#coffee`,
        metadata: {
          name: name || '',
          message: message || '',
          amount: (amount / 100).toString(),
          monthly: 'true',
          coffeeType: coffeeType || 'cyber',
        },
      })

      return NextResponse.json({ 
        sessionId: session.id,
        isSubscription: true,
      })
    }
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    
    // Check if it's a Stripe configuration error
    if (error.message?.includes('STRIPE_SECRET_KEY')) {
      return NextResponse.json(
        { 
          error: 'Payment system is not configured. Please contact support.',
          code: 'STRIPE_NOT_CONFIGURED'
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}


