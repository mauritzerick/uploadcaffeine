import { PrismaClient } from '@prisma/client'
import { createClient } from '@libsql/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

// Prisma Client singleton pattern for Next.js
// Prevents multiple instances in development

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with Turso/libsql adapter if needed
const getPrismaClient = (): PrismaClient => {
  const databaseUrl = process.env.DATABASE_URL || ''
  
  // If using Turso (libsql://), use libsql adapter
  if (databaseUrl.startsWith('libsql://')) {
    const libsql = createClient({ 
      url: databaseUrl,
    })
    const adapter = new PrismaLibSQL(libsql as any)
    
    return new PrismaClient({
      adapter: adapter as any,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    } as any)
  }
  
  // Otherwise use default SQLite
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Lazy initialization - only create client when actually accessed (not during build)
function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }
  
  // Only initialize if we have DATABASE_URL (not during build)
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Prisma client cannot be initialized.')
  }
  
  const client = getPrismaClient()
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }
  return client
}

// Export a proxy that only initializes when accessed
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getPrisma()
    const value = client[prop as keyof PrismaClient]
    return typeof value === 'function' ? value.bind(client) : value
  }
})


