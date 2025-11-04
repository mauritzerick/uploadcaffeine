import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/flags - List all feature flags (public for client consumption)
export async function GET() {
  try {
    const flags = await prisma.featureFlag.findMany({
      orderBy: { key: 'asc' },
      select: {
        key: true,
        name: true,
        description: true,
        enabled: true,
        jsonConfig: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ flags }, { status: 200 })
  } catch (error) {
    console.error('Error fetching flags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flags' },
      { status: 500 }
    )
  }
}

// POST /api/flags - Create new feature flag (admin only)
export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await requireAdminAuth()
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { key, name, description, enabled } = body

    if (!key || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: key, name' },
        { status: 400 }
      )
    }

    // Check if flag already exists
    const existing = await prisma.featureFlag.findUnique({
      where: { key },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Flag with this key already exists' },
        { status: 409 }
      )
    }

    // Create new flag
    const flag = await prisma.featureFlag.create({
      data: {
        key,
        name,
        description: description || null,
        enabled: enabled ?? true,
      },
    })

    // Create audit log
    await prisma.featureToggleAudit.create({
      data: {
        flagKey: key,
        oldValue: false,
        newValue: enabled ?? true,
        by: 'admin',
      },
    })

    return NextResponse.json({ flag }, { status: 201 })
  } catch (error) {
    console.error('Error creating flag:', error)
    return NextResponse.json(
      { error: 'Failed to create flag' },
      { status: 500 }
    )
  }
}


