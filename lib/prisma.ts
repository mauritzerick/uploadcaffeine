import { PrismaClient } from '@prisma/client'
import { createClient } from '@libsql/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

// Prisma Client singleton pattern for Next.js
// Prevents multiple instances in development

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with Turso/libsql adapter if needed
// NOTE: Turso / libSQL uses DATABASE_AUTH_TOKEN injected by Vercel
// This value does NOT exist in the repo — it must be added in the Vercel dashboard.
const getPrismaClient = (): PrismaClient => {
  let databaseUrl = process.env.DATABASE_URL || ''
  const authToken = process.env.DATABASE_AUTH_TOKEN
  
  // If using Turso (libsql://), use libsql adapter
  if (databaseUrl.startsWith('libsql://')) {
    // If DATABASE_URL doesn't include authToken but we have DATABASE_AUTH_TOKEN, combine them
    if (!databaseUrl.includes('authToken') && authToken) {
      const separator = databaseUrl.includes('?') ? '&' : '?'
      databaseUrl = `${databaseUrl}${separator}authToken=${authToken}`
    }
    
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
  // Cache in both dev and production to prevent multiple instances
  globalForPrisma.prisma = client
  return client
}

// Export a proxy that only initializes when accessed
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    try {
      const client = getPrisma()
      if (!client) {
        throw new Error('Prisma client failed to initialize. Check DATABASE_URL.')
      }
      
      const value = (client as any)[prop]
      
      // Handle undefined/null values
      if (value === undefined || value === null) {
        return undefined
      }
      
      // Bind functions directly to the client instance
      if (typeof value === 'function') {
        return value.bind(client)
      }
      
      // For Prisma models (objects with methods like findMany, aggregate, etc.)
      // Return the model directly - Prisma models already have their methods bound correctly
      if (typeof value === 'object' && value !== null) {
        return value
      }
      
      return value
    } catch (error: any) {
      // If initialization fails, provide helpful error
      throw new Error(`Prisma client error: ${error.message}. Make sure DATABASE_URL is set correctly.`)
    }
  },
  has(target, prop) {
    try {
      const client = getPrisma()
      return client ? prop in client : false
    } catch {
      return false
    }
  }
})


