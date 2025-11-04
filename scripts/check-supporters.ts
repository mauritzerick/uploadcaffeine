import { createClient } from '@libsql/client'

const connectionString = process.env.DATABASE_URL || ''

if (!connectionString || !connectionString.startsWith('libsql://')) {
  console.error('❌ DATABASE_URL must be set and use libsql:// protocol')
  process.exit(1)
}

const client = createClient({ url: connectionString })

async function checkSupporters() {
  try {
    // Get all supporters
    const allSupporters = await client.execute({
      sql: 'SELECT id, name, amountCents, createdAt, monthly FROM Supporter ORDER BY createdAt DESC',
    })

    console.log('📊 All Supporters in Database:')
    console.log(`Total: ${allSupporters.rows.length}`)
    console.log('')

    if (allSupporters.rows.length === 0) {
      console.log('  No supporters found')
    } else {
      allSupporters.rows.forEach((row: any) => {
        const created = new Date(row.createdAt)
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const isCurrentMonth = created >= startOfMonth

        console.log(`- ${row.name || 'Anonymous'}: $${(row.amountCents / 100).toFixed(2)}`)
        console.log(`  Monthly: ${row.monthly ? 'yes' : 'no'}`)
        console.log(`  Created: ${created.toLocaleString()}`)
        console.log(`  Current Month: ${isCurrentMonth ? '✅ YES' : '❌ NO'}`)
        console.log('')
      })
    }

    // Check current month stats
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const monthlySupport = await client.execute({
      sql: 'SELECT SUM(amountCents) as total FROM Supporter WHERE createdAt >= ? AND monthly = 0',
      args: [startOfMonth.toISOString()],
    })

    const total = (monthlySupport.rows[0]?.total as number) || 0
    console.log('📈 Current Month Stats:')
    console.log(`  Start of Month: ${startOfMonth.toISOString()}`)
    console.log(`  One-Time Total: $${(Number(total) / 100).toFixed(2)}`)
    
    await client.close()
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

checkSupporters()

