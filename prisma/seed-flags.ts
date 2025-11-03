import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultFlags = [
  {
    key: 'terminal_console',
    name: 'Terminal Console',
    description: 'Floating mini-console with system commands',
    enabled: true,
  },
  {
    key: 'device_hologram',
    name: 'Device Hologram',
    description: 'Hologram scan overlay showing device information',
    enabled: true,
  },
  {
    key: 'matrix_rain',
    name: 'Matrix Rain Easter Egg',
    description: 'Matrix-style falling characters easter egg',
    enabled: true,
  },
  {
    key: 'ai_agents',
    name: 'Ambient AI Agents',
    description: 'Draggable floating AI and Coffee agents',
    enabled: true,
  },
  {
    key: 'particle_effects',
    name: 'Particle Effects',
    description: 'Neon particle bursts and visual effects',
    enabled: true,
  },
  {
    key: 'neon_radio',
    name: 'Neon Radio',
    description: 'YouTube-powered music player with cyberpunk UI',
    enabled: true,
    jsonConfig: JSON.stringify({
      neon_radio_default_playlist: 'synthwave',
      neon_radio_autoplay: false,
    }),
  },
]

async function main() {
  console.log('🚀 Seeding feature flags...')

  // Upsert each flag (create if doesn't exist, update if exists)
  for (const flag of defaultFlags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {
        name: flag.name,
        description: flag.description,
        ...(flag.jsonConfig && { jsonConfig: flag.jsonConfig }),
      },
      create: {
        key: flag.key,
        name: flag.name,
        description: flag.description,
        enabled: flag.enabled,
        ...(flag.jsonConfig && { jsonConfig: flag.jsonConfig }),
      },
    })
  }

  console.log(`✅ Seeded ${defaultFlags.length} feature flags`)
  
  // Show current flags
  const allFlags = await prisma.featureFlag.findMany({
    orderBy: { key: 'asc' },
  })
  
  console.log('\n📋 Current feature flags:')
  allFlags.forEach((flag) => {
    const status = flag.enabled ? '✅ ON' : '❌ OFF'
    console.log(`   ${status} ${flag.key} - ${flag.name}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Error seeding feature flags:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


