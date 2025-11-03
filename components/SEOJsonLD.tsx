import React from 'react'
import { SITE } from '@/lib/seo.config'

interface SEOJsonLDProps {
  type?: string
  data?: Record<string, any>
}

export default function SEOJsonLD({ type = 'WebPage', data = {} }: SEOJsonLDProps) {
  const base = {
    '@context': 'https://schema.org',
    '@type': type,
    inLanguage: SITE.locale,
    ...data
  }
  
  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(base) }} 
    />
  )
}

