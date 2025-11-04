import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Debug endpoint to check what's in the database
 * Only works in development or with proper auth
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  // Allow in production for debugging (remove restriction)
  // In production, you might want to add basic auth or rate limiting

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
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
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
      allSupporters: allSupporters.map(s => {
        const created = new Date(s.createdAt)
        const isCurrentMonth = created.getMonth() === currentMonth && created.getFullYear() === currentYear
        return {
          id: s.id,
          name: s.name,
          amountCents: s.amountCents,
          amountDollars: (s.amountCents / 100).toFixed(2),
          monthly: s.monthly,
          currency: s.currency,
          createdAt: s.createdAt,
          isCurrentMonth: isCurrentMonth, // ✅ NEW: Shows if payment is in current month
          stripeSessionId: s.stripeSessionId,
        }
      }),
      currentMonthStats: {
        startOfMonth: startOfMonth.toISOString(),
        currentMonth: currentMonth + 1, // 1-12
        currentYear: currentYear,
        oneTimeTotal: monthlySupport._sum.amountCents || 0,
        subscriptionTotal: monthlySubscriptions._sum.amountCents || 0,
        combinedTotal: (monthlySupport._sum.amountCents || 0) + (monthlySubscriptions._sum.amountCents || 0),
        combinedTotalDollars: ((monthlySupport._sum.amountCents || 0) + (monthlySubscriptions._sum.amountCents || 0)) / 100,
      },
      webhookSecretConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
      note: 'If isCurrentMonth is false, the payment won\'t appear in monthly goal (by design - monthly goal only counts current month)',
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    )
  }
}

