import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts')

interface PostMeta {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  tags?: string[]
  ogTitle?: string
  ogDescription?: string
}

export async function getAllPosts(): Promise<{ slug: string; meta: PostMeta }[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR)
    const mdxFiles = files.filter(f => f.endsWith('.mdx'))
    
    const posts = await Promise.all(
      mdxFiles.map(async (file) => {
        const slug = file.replace(/\.mdx$/, '')
        const raw = await fs.readFile(path.join(CONTENT_DIR, file), 'utf8')
        const { data } = matter(raw)
        
        return { 
          slug, 
          meta: { ...data, slug } as PostMeta
        }
      })
    )
    
    // Sort by published date, newest first
    return posts.sort((a, b) => 
      new Date(b.meta.publishedAt).getTime() - new Date(a.meta.publishedAt).getTime()
    )
  } catch (error) {
    console.error('Error reading posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<{ Content: () => JSX.Element; meta: PostMeta }> {
  const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`)
  const raw = await fs.readFile(fullPath, 'utf8')
  const { content, data } = matter(raw)
  
  const { content: compiledContent } = await compileMDX({
    source: content,
    options: { 
      parseFrontmatter: false 
    }
  })
  
  const Content = () => compiledContent as JSX.Element
  
  return { 
    Content, 
    meta: { ...data, slug } as PostMeta
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR)
    return files
      .filter(f => f.endsWith('.mdx'))
      .map(f => f.replace(/\.mdx$/, ''))
  } catch (error) {
    console.error('Error reading post slugs:', error)
    return []
  }
}

