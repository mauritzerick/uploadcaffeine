import { getPostBySlug, getAllPostSlugs } from '@/lib/mdx'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { meta } = await getPostBySlug(params.slug)
  
  return {
    title: meta.ogTitle || `${meta.title} | Buy Me a Coffee AU`,
    description: meta.ogDescription || meta.description,
    alternates: { 
      canonical: `/blog/${params.slug}` 
    },
    openGraph: { 
      title: meta.ogTitle || meta.title,
      description: meta.ogDescription || meta.description,
      type: 'article',
      publishedTime: meta.publishedAt,
      modifiedTime: meta.updatedAt,
      images: [`/opengraph-image?title=${encodeURIComponent(meta.title)}&subtitle=${encodeURIComponent(meta.description)}`] 
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.ogTitle || meta.title,
      description: meta.ogDescription || meta.description,
    }
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { Content, meta } = await getPostBySlug(params.slug)
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#0d0015] to-[#0a0a14] text-white">
      <article className="mx-auto max-w-3xl px-4 py-16">
        {/* Back link */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
        
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent leading-tight">
            {meta.title}
          </h1>
          
          <p className="text-xl text-cyan-100/80 mb-6 leading-relaxed">
            {meta.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-cyan-100/60">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(meta.publishedAt).toLocaleDateString('en-AU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            
            {meta.tags && meta.tags.length > 0 && (
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {meta.tags.map(tag => (
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
        </header>
        
        {/* Content */}
        <div className="prose prose-invert prose-cyan max-w-none
          prose-headings:text-cyan-300
          prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-xl prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-cyan-100/80 prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300
          prose-strong:text-cyan-200
          prose-ul:text-cyan-100/80 prose-ul:my-4
          prose-li:my-2
          prose-code:text-cyan-300 prose-code:bg-gray-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
        ">
          <Content />
        </div>
        
        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-cyan-500/30">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all posts
          </Link>
        </footer>
      </article>
    </main>
  )
}

