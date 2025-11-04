import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    console.error('❌ Webhook: No signature header')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('❌ Webhook: STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  console.log('✅ Webhook: Secret configured, verifying signature...')

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Webhook signature verification failed: ${errorMessage}`)
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 })
  }

  // Handle the checkout.session.completed event (subscriptions and redirect payments)
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Extract data from session
      const amountCents = session.amount_total || 0
      const currency = session.currency || 'usd'
      const customerEmail = session.customer_details?.email
      const customerName = session.customer_details?.name
      const isMonthly = session.mode === 'subscription'
      const metadata = session.metadata || {}

      // Store supporter in database
      const supporter = await prisma.supporter.create({
        data: {
          name: customerName || metadata.name || null,
          email: customerEmail || null,
          amountCents,
          currency,
          monthly: isMonthly,
          message: metadata.message || null,
          stripeSessionId: session.id,
        },
      })

      console.log('✅ Supporter saved (checkout):', supporter.id)

      // Track the event
      await prisma.event.create({
        data: {
          type: 'checkout_success',
          metadata: JSON.stringify({
            supporterId: supporter.id,
            amountCents,
            monthly: isMonthly,
            method: 'checkout',
          }),
        },
      })
    } catch (error) {
      console.error('Error saving supporter:', error)
      // Don't return error to Stripe - we got the event successfully
      // Log it for manual review instead
    }
  }

  // Handle the payment_intent.succeeded event (inline payments)
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent

    try {
      // Extract data from payment intent
      const amountCents = paymentIntent.amount
      const currency = paymentIntent.currency
      const metadata = paymentIntent.metadata || {}

      // Check if we already saved this payment (avoid duplicates)
      const existing = await prisma.supporter.findFirst({
        where: {
          stripeSessionId: paymentIntent.id,
        },
      })

      if (existing) {
        console.log('⚠️ Payment intent already processed:', paymentIntent.id)
        return NextResponse.json({ received: true })
      }

      // Store supporter in database
      const supporter = await prisma.supporter.create({
        data: {
          name: metadata.name || null,
          email: null, // PaymentIntent doesn't include email by default
          amountCents,
          currency,
          monthly: metadata.monthly === 'true',
          message: metadata.message || null,
          stripeSessionId: paymentIntent.id, // Use payment intent ID
        },
      })

      console.log('✅ Supporter saved (inline payment):', supporter.id)

      // Track the event
      await prisma.event.create({
        data: {
          type: 'checkout_success',
          metadata: JSON.stringify({
            supporterId: supporter.id,
            amountCents,
            monthly: false,
            method: 'inline',
            coffeeType: metadata.coffeeType || 'cyber',
          }),
        },
      })
    } catch (error) {
      console.error('Error saving supporter from payment intent:', error)
      // Don't return error to Stripe - we got the event successfully
      // Log it for manual review instead
    }
  }

  return NextResponse.json({ received: true })
}

