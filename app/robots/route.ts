import { SITE } from '@/lib/seo.config'

export async function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /web-admin
Disallow: /api/

Sitemap: ${SITE.domain}/sitemap.xml`

  return new Response(body, { 
    headers: { 
      'content-type': 'text/plain',
      'cache-control': 'public, max-age=3600'
    } 
  })
}

