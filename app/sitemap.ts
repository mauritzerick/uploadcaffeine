import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo.config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.domain
  
  // Static routes
  const staticRoutes = [
    '/',
    '/mission',
    '/success',
    '/cancel',
    '/blog',
    '/tools/neon-quote',
    '/tools/glitch-sfx',
    '/tools/cyber-gradient'
  ]
  
  const now = new Date().toISOString()
  
  const routes = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' as const : 'monthly' as const,
    priority: path === '/' ? 1.0 : path.startsWith('/blog') ? 0.8 : 0.6
  }))
  
  // TODO: Add dynamic blog post routes when blog posts exist
  // const posts = await getAllPosts()
  // const postRoutes = posts.map((post) => ({
  //   url: `${base}/blog/${post.slug}`,
  //   lastModified: post.meta.updatedAt || post.meta.publishedAt,
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.7
  // }))
  
  return routes
}

