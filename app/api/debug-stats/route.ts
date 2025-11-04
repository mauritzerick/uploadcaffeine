import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Debug endpoint to check what's in the database
 * Only works in development or with proper auth
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  // Only allow in development or with proper auth
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_DIAGNOSTICS) {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    )
  }

  try {
    // Get all supporters
    const allSupporters = await prisma.supporter.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Get current month's supporters
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const monthlySupport = await prisma.supporter.aggregate({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
        monthly: false,
      },
      _sum: {
        amountCents: true,
      },
    })

    const monthlySubscriptions = await prisma.supporter.aggregate({
      where: {
        monthly: true,
      },
      _sum: {
        amountCents: true,
      },
    })

    return NextResponse.json({
      totalSupporters: allSupporters.length,
      allSupporters: allSupporters.map(s => ({
        id: s.id,
        name: s.name,
        amountCents: s.amountCents,
        amountDollars: (s.amountCents / 100).toFixed(2),
        monthly: s.monthly,
        currency: s.currency,
        createdAt: s.createdAt,
        stripeSessionId: s.stripeSessionId,
      })),
      currentMonthStats: {
        startOfMonth: startOfMonth.toISOString(),
        oneTimeTotal: monthlySupport._sum.amountCents || 0,
        subscriptionTotal: monthlySubscriptions._sum.amountCents || 0,
        combinedTotal: (monthlySupport._sum.amountCents || 0) + (monthlySubscriptions._sum.amountCents || 0),
      },
      webhookSecretConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    )
  }
}

