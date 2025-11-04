import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

// PATCH /api/flags/[key] - Toggle a specific feature flag (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    // Check admin authentication
    const authResult = await requireAdminAuth()
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    const { key } = params
    const body = await req.json()
    const { enabled, jsonConfig } = body

    // Validate at least one field is provided
    if (enabled === undefined && jsonConfig === undefined) {
      return NextResponse.json(
        { error: 'At least one field (enabled or jsonConfig) must be provided' },
        { status: 400 }
      )
    }

    // Validate enabled if provided
    if (enabled !== undefined && typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid field: enabled (must be boolean)' },
        { status: 400 }
      )
    }

    // Get current flag state
    const currentFlag = await prisma.featureFlag.findUnique({
      where: { key },
    })

    if (!currentFlag) {
      return NextResponse.json(
        { error: 'Feature flag not found' },
        { status: 404 }
      )
    }

    // Build update data
    const updateData: any = {}
    if (enabled !== undefined) {
      updateData.enabled = enabled
    }
    if (jsonConfig !== undefined) {
      updateData.jsonConfig = JSON.stringify(jsonConfig)
    }

    // Update flag
    const updatedFlag = await prisma.featureFlag.update({
      where: { key },
      data: updateData,
    })

    // Create audit log
    await prisma.featureToggleAudit.create({
      data: {
        flagKey: key,
        oldValue: currentFlag.enabled,
        newValue: enabled,
        by: 'admin',
      },
    })

    return NextResponse.json({ flag: updatedFlag }, { status: 200 })
  } catch (error) {
    console.error('Error updating flag:', error)
    return NextResponse.json(
      { error: 'Failed to update flag' },
      { status: 500 }
    )
  }
}

// GET /api/flags/[key] - Get a specific feature flag (public)
export async function GET(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = params

    const flag = await prisma.featureFlag.findUnique({
      where: { key },
      select: {
        key: true,
        name: true,
        description: true,
        enabled: true,
        jsonConfig: true,
        updatedAt: true,
      },
    })

    if (!flag) {
      return NextResponse.json(
        { error: 'Feature flag not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ flag }, { status: 200 })
  } catch (error) {
    console.error('Error fetching flag:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flag' },
      { status: 500 }
    )
  }
}


