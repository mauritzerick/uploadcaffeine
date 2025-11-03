import { ogBase } from '@/lib/og'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Upload Caffeine to My System'
  const subtitle = searchParams.get('subtitle') || 'Support an Australian Indie Developer'
  
  return ogBase({ title, subtitle })
}

