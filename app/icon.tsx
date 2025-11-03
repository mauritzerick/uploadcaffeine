import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // Coffee icon SVG with cyberpunk neon glow
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #0a0a14 0%, #0d0015 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Coffee icon path with cyan glow */}
          <path
            d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"
            stroke="#00ffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: 'drop-shadow(0 0 4px rgba(0, 255, 255, 0.8))',
            }}
          />
          <path
            d="M6 2v2M10 2v2M14 2v2"
            stroke="#00ffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: 'drop-shadow(0 0 4px rgba(0, 255, 255, 0.8))',
            }}
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}

