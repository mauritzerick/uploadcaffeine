import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/seo.config'

export const runtime = 'edge'

export async function ogBase({ title, subtitle }: { title: string; subtitle?: string }) {
  return new ImageResponse(
    (
      <div 
        style={{ 
          height: '100%', 
          width: '100%', 
          display: 'flex', 
          background: 'linear-gradient(135deg,#05070d,#0a0f1f)', 
          color: 'white', 
          fontSize: 48, 
          padding: 64, 
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* Neon glow background */}
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'radial-gradient(circle at 20% 30%, rgba(0,255,255,.25), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,0,255,.2), transparent 40%)' 
          }} 
        />
        
        {/* Content */}
        <div style={{ display:'flex', flexDirection:'column', gap:16, position: 'relative', zIndex: 10 }}>
          <div style={{ fontSize: 28, opacity:.8, color: '#00ffff' }}>{SITE.name}</div>
          <div style={{ fontWeight: 800, fontSize: 64, lineHeight: 1.2 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 32, opacity:.9, color: '#ff00ff' }}>{subtitle}</div>}
          <div style={{ fontSize: 24, opacity:.7, marginTop: 16 }}>🇦🇺 AU • Cyberpunk Donations</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

