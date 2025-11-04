import { PrismaClient } from '@prisma/client'
import { createClient } from '@libsql/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

// Prisma Client singleton pattern for Next.js
// Prevents multiple instances in development

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with Turso/libsql adapter if needed
const getPrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL || ''
  
  // If using Turso (libsql://), use libsql adapter
  if (databaseUrl.startsWith('libsql://')) {
    const libsql = createClient({ 
      url: databaseUrl,
    })
    const adapter = new PrismaLibSQL(libsql)
    
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }
  
  // Otherwise use default SQLite
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma =
  globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


