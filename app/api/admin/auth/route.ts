import { NextRequest, NextResponse } from 'next/server'
import { setAdminCookie } from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Validate and set cookie
    const isValid = setAdminCookie(token)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}


