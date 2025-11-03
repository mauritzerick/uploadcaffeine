import { NextResponse, NextRequest } from 'next/server'
import { SITE } from './lib/seo.config'

// Exclude API routes, static files, and image generation routes
export const config = { 
  matcher: ['/((?!_next/|api/seo-kpi|api/flags|api/webhook|api/stats|api/track|opengraph-image|twitter-image|icon|apple-icon|.*\\..*).*)'] 
}

export function middleware(req: NextRequest) {
  const url = new URL(req.url)
  
  // Force https + canonical host
  const isHttps = url.protocol === 'https:'
  const host = url.host.replace(/^www\./, '')
  let changed = false
  
  // In development, skip HTTPS enforcement
  const isDev = process.env.NODE_ENV === 'development'
  
  if (!isDev && (!isHttps || host !== SITE.canonicalHost)) {
    url.protocol = 'https:'
    url.host = SITE.canonicalHost
    changed = true
  }
  
  // Strip tracking params
  const stripParams = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
    'ref',
    '_ga'
  ]
  
  for (const param of stripParams) {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param)
      changed = true
    }
  }
  
  return changed ? NextResponse.redirect(url, 301) : NextResponse.next()
}

