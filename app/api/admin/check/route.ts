import { NextResponse } from 'next/server'
import { validateAdminAuth } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const result = await validateAdminAuth()

    if (result.isAuthenticated) {
      return NextResponse.json({ authenticated: true }, { status: 200 })
    }

    return NextResponse.json(
      { authenticated: false, error: result.error },
      { status: 401 }
    )
  } catch (error) {
    console.error('Admin check error:', error)
    return NextResponse.json(
      { authenticated: false, error: 'Check failed' },
      { status: 500 }
    )
  }
}


