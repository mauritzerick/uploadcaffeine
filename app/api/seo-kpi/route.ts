import { NextRequest, NextResponse } from 'next/server'

interface SEOKPIPayload {
  metric: 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB' | 'INP'
  value: number
  path: string
  rating?: 'good' | 'needs-improvement' | 'poor'
  navigationType?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: SEOKPIPayload = await req.json()
    
    // Validate payload
    if (!body.metric || typeof body.value !== 'number' || !body.path) {
      return NextResponse.json(
        { ok: false, error: 'Invalid payload. Required: metric, value, path' },
        { status: 400 }
      )
    }
    
    // Log to console (in production, you'd send to analytics service)
    console.log('📊 Web Vital:', {
      metric: body.metric,
      value: body.value,
      rating: body.rating,
      path: body.path,
      timestamp: new Date().toISOString()
    })
    
    // TODO: Persist to database or send to analytics service
    // await prisma.webVital.create({ data: body })
    // or
    // await sendToAnalytics(body)
    
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('SEO KPI error:', e)
    return NextResponse.json(
      { ok: false, error: e.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'SEO KPI endpoint. Use POST to submit web vitals.',
    acceptedMetrics: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP']
  })
}

