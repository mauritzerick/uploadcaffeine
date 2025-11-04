import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { amount, monthly, name, message } = await request.json()

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum is $1.00' },
        { status: 400 }
      )
    }

    const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // For monthly subscriptions, we need to create a price object first
    if (monthly) {
      // Create a subscription session
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
        cancel_url: `${baseUrl}/cancel`,
        metadata: {
          name: name || '',
          message: message || '',
          amount: (amount / 100).toString(),
          monthly: 'true',
        },
      })

      return NextResponse.json({ sessionId: session.id })
    } else {
      // Create a one-time payment session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'aud',
              product_data: {
                name: 'Buy Me a Coffee',
                description: 'One-time support - thank you!',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/cancel`,
        metadata: {
          name: name || '',
          message: message || '',
          amount: (amount / 100).toString(),
          monthly: 'false',
        },
      })

      return NextResponse.json({ sessionId: session.id })
    }
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    
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
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
