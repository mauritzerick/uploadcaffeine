import { createClient } from '@libsql/client'
import { randomBytes } from 'crypto'

const connectionString = process.env.DATABASE_URL || ''

if (!connectionString || !connectionString.startsWith('libsql://')) {
  console.error('❌ DATABASE_URL must be set and use libsql:// protocol')
  process.exit(1)
}

const client = createClient({ url: connectionString })

async function addInitialSupporter() {
  try {
    console.log('💰 Adding initial $8 supporter...')

    // Generate a unique ID
    const id = `supporter_${randomBytes(8).toString('hex')}`
    
    // Insert supporter with $8 (800 cents)
    await client.execute({
      sql: `INSERT INTO Supporter (id, name, email, amountCents, currency, monthly, message, stripeSessionId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [
        id,
        'Initial Supporter',
        null,
        800, // $8.00 in cents
        'aud',
        false, // One-time payment
        'Initial funding to get started!',
        `initial_${Date.now()}`,
      ],
    })

    console.log('✅ Added initial supporter: $8.00')
    console.log('')
    console.log('📊 Progress bar will now show:')
    console.log('   $8.00 / $150.00 (5%)')
    
    await client.close()
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint')) {
      console.log('ℹ️  Initial supporter already exists')
    } else {
      console.error('❌ Error:', error.message)
      process.exit(1)
    }
  }
}

addInitialSupporter()

