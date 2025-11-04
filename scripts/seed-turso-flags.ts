import { createClient } from '@libsql/client'

const connectionString = process.env.DATABASE_URL || ''

if (!connectionString || !connectionString.startsWith('libsql://')) {
  console.error('❌ DATABASE_URL must be set and use libsql:// protocol')
  process.exit(1)
}

const client = createClient({ url: connectionString })

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
    description: 'Press M three times to activate',
    enabled: true,
  },
  {
    key: 'glitch_agent',
    name: 'Glitch Agent Button',
    description: 'Show the glitch agent button in top-right corner',
    enabled: true,
  },
  {
    key: 'effect_glitch_cinematic',
    name: 'Glitch Effect',
    description: 'Press G to activate chaotic glitch effects',
    enabled: true,
    intensity: 'med',
    jsonConfig: JSON.stringify({ intensity: 'med' }),
  },
  {
    key: 'neon_radio',
    name: 'Neon Radio',
    description: 'YouTube-powered music player with cyberpunk UI',
    enabled: true,
    jsonConfig: JSON.stringify({
      default_playlist: 'synthwave',
      autoplay: false,
    }),
  },
]

async function seedFlags() {
  try {
    console.log('🌱 Seeding feature flags...')

    for (const flag of defaultFlags) {
      const id = `flag_${flag.key}`
      
      // Check if exists
      const existing = await client.execute({
        sql: 'SELECT id FROM FeatureFlag WHERE key = ?',
        args: [flag.key],
      })

      if (existing.rows.length > 0) {
        // Update
        await client.execute({
          sql: `UPDATE FeatureFlag 
                SET name = ?, description = ?, enabled = ?, intensity = ?, jsonConfig = ?, updatedAt = CURRENT_TIMESTAMP
                WHERE key = ?`,
          args: [
            flag.name,
            flag.description || null,
            flag.enabled ? 1 : 0,
            (flag as any).intensity || null,
            (flag as any).jsonConfig || null,
            flag.key,
          ],
        })
        console.log(`✅ Updated: ${flag.key}`)
      } else {
        // Insert
        await client.execute({
          sql: `INSERT INTO FeatureFlag (id, key, name, description, enabled, intensity, jsonConfig, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          args: [
            id,
            flag.key,
            flag.name,
            flag.description || null,
            flag.enabled ? 1 : 0,
            (flag as any).intensity || null,
            (flag as any).jsonConfig || null,
          ],
        })
        console.log(`✅ Created: ${flag.key}`)
      }
    }

    console.log('')
    console.log('✅ Feature flags seeded successfully!')
    
    await client.close()
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

seedFlags()

