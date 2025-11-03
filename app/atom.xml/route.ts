import { SITE } from '@/lib/seo.config'

export async function GET() {
  // TODO: Import getAllPosts when blog system is ready
  // const posts = await getAllPosts()
  // const items = posts.map(p => 
  //   `<entry>
  //     <title>${escapeXml(p.meta.title)}</title>
  //     <link href='${SITE.domain}/blog/${p.slug}'/>
  //     <id>${SITE.domain}/blog/${p.slug}</id>
  //     <updated>${new Date(p.meta.updatedAt || p.meta.publishedAt).toISOString()}</updated>
  //     <summary>${escapeXml(p.meta.description)}</summary>
  //   </entry>`
  // ).join('')
  
  const items = '' // Placeholder until blog posts exist
  const now = new Date().toISOString()
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${SITE.name}</title>
  <link href="${SITE.domain}"/>
  <link href="${SITE.domain}/atom.xml" rel="self"/>
  <updated>${now}</updated>
  <id>${SITE.domain}/</id>
  <author>
    <name>${SITE.author.name}</name>
    <email>${SITE.author.email}</email>
  </author>
  ${items}
</feed>`

  return new Response(xml, { 
    headers: { 
      'content-type': 'application/atom+xml; charset=utf-8',
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

