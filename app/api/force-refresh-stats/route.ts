import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Force refresh endpoint - manually trigger stats recalculation
 * Useful for debugging
 */
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    // Get monthly goal from env
    const monthlyGoalCents = parseInt(process.env.NEXT_PUBLIC_MONTHLY_GOAL_CENTS || '15000')

    // Get current month's supporters
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Calculate total raised this month
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

    const oneTimeTotal = monthlySupport._sum.amountCents || 0
    const subscriptionTotal = monthlySubscriptions._sum.amountCents || 0
    const totalRaisedCents = oneTimeTotal + subscriptionTotal

    const progressPercentage = Math.min(
      Math.round((totalRaisedCents / monthlyGoalCents) * 100),
      100
    )

    return NextResponse.json({
      success: true,
      goal: {
        targetCents: monthlyGoalCents,
        currentCents: totalRaisedCents,
        progressPercentage,
        oneTimeTotal,
        subscriptionTotal,
      },
      message: 'Stats refreshed successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

