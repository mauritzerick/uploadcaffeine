import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * One-time endpoint to seed initial $16 supporter
 * Safe to call multiple times (idempotent)
 * Supports both GET and POST for easier access
 */
export async function GET() {
  // Call the POST handler logic directly
  return handleSeed()
}

export async function POST(req: Request) {
  return handleSeed()
}

async function handleSeed() {
  try {
    // Check DATABASE_URL first
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: 'DATABASE_URL is not configured',
          message: 'Database environment variable is missing',
        },
        { status: 500 }
      )
    }

    // Check if we're using libsql and need auth token
    if (process.env.DATABASE_URL.startsWith('libsql://') && !process.env.DATABASE_AUTH_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: 'DATABASE_AUTH_TOKEN is required',
          message: 'DATABASE_AUTH_TOKEN is required for libsql:// DATABASE_URL',
        },
        { status: 500 }
      )
    }

    // Check if initial supporter already exists
    const existing = await prisma.supporter.findFirst({
      where: {
        stripeSessionId: {
          startsWith: 'initial_',
        },
      },
    })

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Initial supporter already exists',
        supporter: {
          id: existing.id,
          amountCents: existing.amountCents,
          amountDollars: (existing.amountCents / 100).toFixed(2),
          createdAt: existing.createdAt,
        },
      })
    }

    // Create initial supporter with $16 (1600 cents)
    const supporter = await prisma.supporter.create({
      data: {
        name: 'Initial Supporter',
        amountCents: 1600, // $16.00
        currency: 'aud',
        monthly: false,
        message: 'Initial funding to get started!',
        stripeSessionId: `initial_${Date.now()}`,
      },
    })

    // Get updated stats to verify
    const now = new Date()
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0))

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

    const totalRaisedCents = monthlySupport._sum.amountCents || 0
    const monthlyGoalCents = parseInt(process.env.NEXT_PUBLIC_MONTHLY_GOAL_CENTS || '15000')
    const progressPercentage = Math.min(
      Math.round((totalRaisedCents / monthlyGoalCents) * 100),
      100
    )

    return NextResponse.json({
      success: true,
      message: 'Initial supporter added successfully',
      supporter: {
        id: supporter.id,
        amountCents: supporter.amountCents,
        amountDollars: (supporter.amountCents / 100).toFixed(2),
        createdAt: supporter.createdAt,
      },
      stats: {
        totalRaisedCents,
        totalRaisedDollars: (totalRaisedCents / 100).toFixed(2),
        monthlyGoalCents,
        monthlyGoalDollars: (monthlyGoalCents / 100).toFixed(2),
        progressPercentage,
      },
    })
  } catch (error: any) {
    console.error('Error seeding initial supporter:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

