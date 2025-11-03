import { SITE } from '@/lib/seo.config'

export async function GET() {
  // TODO: Import getAllPosts when blog system is ready
  // const posts = await getAllPosts()
  // const items = posts.map(p => 
  //   `<item>
  //     <title>${escapeXml(p.meta.title)}</title>
  //     <link>${SITE.domain}/blog/${p.slug}</link>
  //     <description>${escapeXml(p.meta.description)}</description>
  //     <pubDate>${new Date(p.meta.publishedAt).toUTCString()}</pubDate>
  //   </item>`
  // ).join('')
  
  const items = '' // Placeholder until blog posts exist
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.name}</title>
    <link>${SITE.domain}</link>
    <description>${SITE.defaultDescription}</description>
    <language>${SITE.locale}</language>
    <atom:link href="${SITE.domain}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(xml, { 
    headers: { 
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    } 
  })
}

function escapeXml(str: string): string {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case "'": return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

