import { createClient } from '@libsql/client'

const connectionString = process.env.DATABASE_URL || ''

if (!connectionString || !connectionString.startsWith('libsql://')) {
  console.error('❌ DATABASE_URL must be set and use libsql:// protocol')
  process.exit(1)
}

const client = createClient({ url: connectionString })

async function initDatabase() {
  try {
    console.log('📦 Creating database tables...')

    // Create all tables
    const tables = [
      `CREATE TABLE IF NOT EXISTS "Supporter" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT,
        "email" TEXT,
        "amountCents" INTEGER NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'usd',
        "monthly" INTEGER NOT NULL DEFAULT 0,
        "message" TEXT,
        "stripeSessionId" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS "Supporter_createdAt_idx" ON "Supporter"("createdAt")`,
      `CREATE INDEX IF NOT EXISTS "Supporter_monthly_idx" ON "Supporter"("monthly")`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "Supporter_stripeSessionId_key" ON "Supporter"("stripeSessionId")`,
      
      `CREATE TABLE IF NOT EXISTS "Event" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "type" TEXT NOT NULL,
        "metadata" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE INDEX IF NOT EXISTS "Event_type_createdAt_idx" ON "Event"("type", "createdAt")`,
      
      `CREATE TABLE IF NOT EXISTS "Experiment" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "variant" TEXT NOT NULL,
        "sessionId" TEXT NOT NULL,
        "converted" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE INDEX IF NOT EXISTS "Experiment_variant_converted_idx" ON "Experiment"("variant", "converted")`,
      
      `CREATE TABLE IF NOT EXISTS "DevQuote" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "quote" TEXT NOT NULL,
        "isActive" INTEGER NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS "DevQuote_isActive_idx" ON "DevQuote"("isActive")`,
      
      `CREATE TABLE IF NOT EXISTS "QuoteHistory" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "quoteId" TEXT NOT NULL,
        "quote" TEXT NOT NULL,
        "shownAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "shownDate" TEXT NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS "QuoteHistory_shownDate_idx" ON "QuoteHistory"("shownDate")`,
      
      `CREATE TABLE IF NOT EXISTS "FeatureFlag" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "key" TEXT NOT NULL UNIQUE,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "enabled" INTEGER NOT NULL DEFAULT 1,
        "intensity" TEXT,
        "jsonConfig" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS "FeatureFlag_key_idx" ON "FeatureFlag"("key")`,
      `CREATE INDEX IF NOT EXISTS "FeatureFlag_enabled_idx" ON "FeatureFlag"("enabled")`,
      
      `CREATE TABLE IF NOT EXISTS "FeatureToggleAudit" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "flagKey" TEXT NOT NULL,
        "oldValue" INTEGER NOT NULL,
        "newValue" INTEGER NOT NULL,
        "by" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE INDEX IF NOT EXISTS "FeatureToggleAudit_flagKey_idx" ON "FeatureToggleAudit"("flagKey")`,
      `CREATE INDEX IF NOT EXISTS "FeatureToggleAudit_createdAt_idx" ON "FeatureToggleAudit"("createdAt")`,
    ]

    for (const sql of tables) {
      await client.execute(sql)
      console.log('✅ Created:', sql.substring(0, 50) + '...')
    }

    console.log('')
    console.log('✅ Database initialized successfully!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Run: npm run db:seed-flags')
    console.log('2. Update Vercel DATABASE_URL with the full connection string')
    console.log('3. Redeploy on Vercel')
    
    await client.close()
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

initDatabase()

