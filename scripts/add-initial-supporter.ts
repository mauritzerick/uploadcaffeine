import { createClient } from '@libsql/client'
import { randomBytes } from 'crypto'

const connectionString = process.env.DATABASE_URL || ''
const authToken = process.env.DATABASE_AUTH_TOKEN

if (!connectionString || !connectionString.startsWith('libsql://')) {
  console.error('❌ DATABASE_URL must be set and use libsql:// protocol')
  process.exit(1)
}

// Combine auth token if provided separately
let clientUrl = connectionString
if (!connectionString.includes('authToken') && authToken) {
  const separator = connectionString.includes('?') ? '&' : '?'
  clientUrl = `${connectionString}${separator}authToken=${authToken}`
}

const client = createClient({ url: clientUrl })

async function addInitialSupporter() {
  try {
    console.log('💰 Adding initial $16 supporter...')

    // Generate a unique ID
    const id = `supporter_${randomBytes(8).toString('hex')}`
    
    // Insert supporter with $16 (1600 cents) - two payments worth
    await client.execute({
      sql: `INSERT INTO Supporter (id, name, email, amountCents, currency, monthly, message, stripeSessionId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [
        id,
        'Initial Supporter',
        null,
        1600, // $16.00 in cents
        'aud',
        false, // One-time payment
        'Initial funding to get started!',
        `initial_${Date.now()}`,
      ],
    })

    console.log('✅ Added initial supporter: $16.00')
    console.log('')
    console.log('📊 Progress bar will now show:')
    console.log('   $16.00 / $150.00 (11%)')
    
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

