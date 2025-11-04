import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    // Parse request body with error handling
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError)
      return NextResponse.json(
        { error: 'Invalid request body', code: 'INVALID_BODY' },
        { status: 400 }
      )
    }

    const { amount, monthly, name, message, coffeeType } = body

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum is $1.00', code: 'INVALID_AMOUNT' },
        { status: 400 }
      )
    }

    // For one-time payments, create a PaymentIntent
    if (!monthly) {
      try {
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
      } catch (stripeError: any) {
        console.error('❌ Stripe PaymentIntent error:', {
          type: stripeError.type,
          code: stripeError.code,
          message: stripeError.message,
          statusCode: stripeError.statusCode,
        })
        return NextResponse.json(
          { 
            error: stripeError.message || 'Failed to create payment',
            code: stripeError.code || 'STRIPE_ERROR',
            type: stripeError.type,
          },
          { status: 500 }
        )
      }
    } else {
      // For monthly subscriptions, we still need to use Checkout Sessions
      // PaymentIntent doesn't support subscriptions directly
      const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      
      try {
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
      } catch (stripeError: any) {
        console.error('❌ Stripe Checkout Session error:', {
          type: stripeError.type,
          code: stripeError.code,
          message: stripeError.message,
          statusCode: stripeError.statusCode,
        })
        return NextResponse.json(
          { 
            error: stripeError.message || 'Failed to create checkout session',
            code: stripeError.code || 'STRIPE_ERROR',
            type: stripeError.type,
          },
          { status: 500 }
        )
      }
    }
  } catch (error: any) {
    console.error('❌ Unexpected error in create-payment-intent:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      type: error.type,
      code: error.code,
    })
    
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
    
    // Handle Stripe errors that might have been thrown
    if (error.type && error.code) {
      return NextResponse.json(
        { 
          error: error.message || 'Payment processing error',
          code: error.code,
          type: error.type,
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create payment intent',
        code: 'UNKNOWN_ERROR',
      },
      { status: 500 }
    )
  }
}


