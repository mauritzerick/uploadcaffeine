import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import { Coffee, Calendar, Tag } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Australian Indie Developer',
  description: 'Thoughts on indie development, cyberpunk design, and building in public from Australia.',
  alternates: {
    canonical: '/blog'
  }
}

export const dynamic = 'force-static'

export default async function BlogIndex() {
  const posts = await getAllPosts()
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#0d0015] to-[#0a0a14] text-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        {/* Back link */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 text-sm"
        >
          ← Back to Home
        </Link>
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
            <Coffee className="w-10 h-10 text-cyan-400" />
            Blog
          </h1>
          <p className="text-cyan-100/80 text-lg">
            Thoughts on indie development, cyberpunk design, and building in public from Australia.
          </p>
        </div>
        
        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-cyan-100/60">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {posts.map(post => (
              <li key={post.slug}>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="block p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-500/30 rounded-2xl hover:border-cyan-500/60 transition-all group"
                >
                  <div className="flex flex-col gap-3">
                    <h2 className="text-2xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                      {post.meta.title}
                    </h2>
                    
                    <p className="text-cyan-100/70 leading-relaxed">
                      {post.meta.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-cyan-100/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.meta.publishedAt).toLocaleDateString('en-AU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      
                      {post.meta.tags && post.meta.tags.length > 0 && (
                        <span className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          {post.meta.tags.map(tag => (
                            <span 
                              key={tag}
                              className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}

