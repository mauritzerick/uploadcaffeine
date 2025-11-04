import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #05070d, #0a0f1f)',
          color: 'white',
          fontSize: 48,
          padding: 64,
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 30%, rgba(0,255,255,0.25), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,0,255,0.2), transparent 40%)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 10 }}>
          <div style={{ fontSize: 28, opacity: 0.8, color: '#00ffff' }}>Upload Caffeine to My System</div>
          <div style={{ fontWeight: 800, fontSize: 64, lineHeight: 1.2 }}>Support an Australian Indie Developer</div>
          <div style={{ fontSize: 32, opacity: 0.9, color: '#ff00ff' }}>Cyberpunk Buy-Me-A-Coffee</div>
          <div style={{ fontSize: 24, opacity: 0.7, marginTop: 16 }}>🇦🇺 AU • Cyberpunk Donations</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
