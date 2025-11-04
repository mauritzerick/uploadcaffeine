import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Get monthly goal from env
    const monthlyGoalCents = parseInt(process.env.NEXT_PUBLIC_MONTHLY_GOAL_CENTS || '15000')

    // Get current month's supporters
    // Use UTC to avoid timezone issues - database stores dates in UTC
    const now = new Date()
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0))

    // Calculate total raised this month
    const monthlySupport = await prisma.supporter.aggregate({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
        monthly: false, // One-time donations
      },
      _sum: {
        amountCents: true,
      },
    })

    // Get active monthly subscriptions (total ever, as they recur)
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

    // Get recent supporters (last 10)
    const recentSupporters = await prisma.supporter.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      select: {
        id: true,
        name: true,
        amountCents: true,
        currency: true,
        monthly: true,
        message: true,
        createdAt: true,
      },
    })

    // Get total supporters count
    const totalSupporters = await prisma.supporter.count()

    // Calculate progress percentage
    const progressPercentage = Math.min(
      Math.round((totalRaisedCents / monthlyGoalCents) * 100),
      100
    )

    // Debug logging
    console.log('📊 Stats API response:', {
      totalRaisedCents,
      monthlyGoalCents,
      progressPercentage,
      oneTimeTotal,
      subscriptionTotal,
      totalSupporters,
      startOfMonth: startOfMonth.toISOString(),
      now: now.toISOString(),
    })

    return NextResponse.json({
      goal: {
        targetCents: monthlyGoalCents,
        currentCents: totalRaisedCents,
        progressPercentage,
        oneTimeTotal: oneTimeTotal,
        subscriptionTotal: subscriptionTotal,
      },
      supporters: {
        total: totalSupporters,
        recent: recentSupporters,
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}


