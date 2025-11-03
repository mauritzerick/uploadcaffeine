import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const effectFlags = [
  {
    key: 'glitch_agent',
    name: 'Glitch Agent Button',
    description: 'Top-right glitch trigger button with keyboard shortcut (G)',
    enabled: true,
    intensity: 'med',
  },
  {
    key: 'effect_glitch_cinematic',
    name: 'Cinematic Glitch Effect',
    description: 'RGB split + noise + scanlines visual effect',
    enabled: true,
    intensity: 'med',
  },
  {
    key: 'effect_quantum_bean_rain',
    name: 'Quantum Bean Rain',
    description: 'Coffee bean particles on payment success',
    enabled: true,
    intensity: 'med',
  },
  {
    key: 'effect_screen_fracture',
    name: 'Screen Fracture Pulse',
    description: 'SVG slice burst effect',
    enabled: true,
    intensity: 'med',
  },
  {
    key: 'effect_time_warp',
    name: 'Time Warp (Slow-Mo)',
    description: 'Slow-motion effect when holding Space for 800ms',
    enabled: true,
    intensity: 'med',
  },
  {
    key: 'cursor_afterimage',
    name: 'Spectral Afterimage Cursor',
    description: 'Trailing dots behind cursor (desktop only)',
    enabled: false,
    intensity: 'low',
  },
  {
    key: 'kaleidoscope_mode',
    name: 'Kaleidoscope Mode',
    description: 'Mirror effect triggered by double-clicking logo',
    enabled: false,
    intensity: 'med',
  },
  {
    key: 'vibe_mode_audio',
    name: 'Vibe Mode (Ambient Synth)',
    description: 'Looped ambient synth pad audio',
    enabled: false,
    intensity: 'low',
    jsonConfig: JSON.stringify({ volume: 0.3, muted: true }),
  },
]

async function main() {
  console.log('🎮 Seeding effect feature flags...')

  for (const flag of effectFlags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {
        name: flag.name,
        description: flag.description,
        enabled: flag.enabled,
        intensity: flag.intensity,
        jsonConfig: flag.jsonConfig,
      },
      create: flag,
    })
    console.log(`✅ ${flag.key}`)
  }

  console.log('\n🎉 Effect flags seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


