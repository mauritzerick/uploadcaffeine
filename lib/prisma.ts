import { PrismaClient } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { getEnvSnapshot } from './env'

// Lazy-load libsql to avoid bundling issues
let libsqlClient: any = null
let PrismaLibSQLAdapter: any = null

function loadLibSQL() {
  if (!libsqlClient) {
    // @ts-ignore - dynamic require to avoid bundling issues
    libsqlClient = require('@libsql/client')
  }
  if (!PrismaLibSQLAdapter) {
    // @ts-ignore - dynamic require to avoid bundling issues
    PrismaLibSQLAdapter = require('@prisma/adapter-libsql')
  }
  return { createClient: libsqlClient.createClient, PrismaLibSQL: PrismaLibSQLAdapter.PrismaLibSQL }
}

// Single instance in dev
// eslint-disable-next-line no-var
var prismaGlobal: PrismaClient | undefined = (global as any).__PRISMA__

function makeClient() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }

  // libsql/turso path (requires DATABASE_AUTH_TOKEN)
  if (url.startsWith('libsql://')) {
    const token = process.env.DATABASE_AUTH_TOKEN
    if (!token) {
      throw new Error('DATABASE_AUTH_TOKEN is required for libsql:// DATABASE_URL')
    }
    try {
      const { createClient, PrismaLibSQL } = loadLibSQL()
      const libsql = createClient({ url, authToken: token })
      const adapter = new PrismaLibSQL(libsql)
      const client = new PrismaClient({ adapter } as Prisma.PrismaClientOptions)
      return client
    } catch (e: any) {
      const hint = 'If you see "bind" undefined, it usually means the libsql adapter/client failed to construct. Ensure @libsql/client and @prisma/adapter-libsql are installed, and this route runs on Node.js runtime.'
      throw new Error(`Failed to init libsql adapter: ${e?.message || e}. ${hint}`)
    }
  }

  // SQLite file path (e.g., file:/tmp/prod.db on Vercel)
  if (url.startsWith('file:')) {
    return new PrismaClient()
  }

  throw new Error(`Unsupported DATABASE_URL scheme: ${url}`)
}

// Lazy initialization - only create when accessed (not during build)
function getPrisma() {
  if (prismaGlobal) {
    return prismaGlobal
  }
  
  // Don't initialize during build if DATABASE_URL is libsql:// without token
  if (process.env.DATABASE_URL?.startsWith('libsql://') && !process.env.DATABASE_AUTH_TOKEN) {
    // Return a proxy that will throw a helpful error when accessed
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error('DATABASE_AUTH_TOKEN is required for libsql:// DATABASE_URL. Set it in Vercel environment variables.')
      }
    })
  }
  
  const client = makeClient()
  if (process.env.NODE_ENV !== 'production') {
    prismaGlobal = client
    ;(global as any).__PRISMA__ = client
  }
  return client
}

const prisma = getPrisma()

export default prisma

// Also export as named export for backward compatibility
export { prisma }
