import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { type, metadata } = await request.json()

    if (!type) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      )
    }

    // Accept all event types - validation handled by TypeScript on client
    // Event types are defined in lib/analytics.ts EventMap

    // Store event in database
    await prisma.event.create({
      data: {
        type,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking event:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to fetch analytics
export async function GET() {
  try {
    // Get event counts by type
    const eventCounts = await prisma.event.groupBy({
      by: ['type'],
      _count: {
        type: true,
      },
    })

    // Get conversion rate (checkout_success / checkout_start)
    const checkoutStarts = await prisma.event.count({
      where: { type: 'checkout_start' },
    })

    const checkoutSuccesses = await prisma.event.count({
      where: { type: 'checkout_success' },
    })

    const conversionRate = checkoutStarts > 0
      ? ((checkoutSuccesses / checkoutStarts) * 100).toFixed(2)
      : '0.00'

    return NextResponse.json({
      events: eventCounts,
      conversionRate: `${conversionRate}%`,
      totals: {
        checkoutStarts,
        checkoutSuccesses,
      },
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}


