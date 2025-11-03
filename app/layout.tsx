import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FeatureFlagsProvider } from '@/providers/FeatureFlagsProvider'
import GlitchAgent from '@/components/GlitchAgent'
import { SITE } from '@/lib/seo.config'

const inter = Inter({ subsets: ['latin'], display: 'swap', preload: true })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: SITE.defaultTitle,
    template: `%s | ${SITE.name}`
  },
  description: SITE.defaultDescription,
  keywords: SITE.keywords,
  authors: [{ name: SITE.author.name, url: SITE.domain }],
  creator: SITE.author.name,
  publisher: SITE.author.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: SITE.domain,
    siteName: SITE.name,
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
    images: ['/twitter-image'],
    creator: '@mauritzerick',
  },
  alternates: {
    canonical: SITE.domain,
    types: {
      'application/rss+xml': `${SITE.domain}/feed.xml`,
      'application/atom+xml': `${SITE.domain}/atom.xml`,
    },
  },
  category: 'technology',
  verification: {
    // Add when available:
    // google: 'verification-code',
    // yandex: 'verification-code',
    // bing: 'verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} font-sans`}>
        <FeatureFlagsProvider>
          <GlitchAgent />
          {children}
        </FeatureFlagsProvider>
      </body>
    </html>
  )
}
