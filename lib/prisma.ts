import type { PrismaClient } from '@prisma/client'
import type { Prisma } from '@prisma/client'

// Single instance in dev
// eslint-disable-next-line no-var
var prismaGlobal: PrismaClient | undefined = (global as any).__PRISMA__

// Lazy-load libsql to avoid bundling issues - only load when actually needed
function loadLibSQL() {
  try {
    // @ts-ignore - dynamic require to avoid bundling issues
    const libsqlClient = require('@libsql/client')
    // @ts-ignore - dynamic require to avoid bundling issues
    const PrismaLibSQLAdapter = require('@prisma/adapter-libsql')
    return {
      createClient: libsqlClient.createClient,
      PrismaLibSQL: PrismaLibSQLAdapter.PrismaLibSQL,
    }
  } catch (e: any) {
    throw new Error(`Failed to load libsql packages: ${e?.message || e}. Ensure @libsql/client and @prisma/adapter-libsql are installed.`)
  }
}

function makeClient(): PrismaClient {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }

  // libsql/turso path (requires DATABASE_AUTH_TOKEN)
  // NOTE: This should never be called if DATABASE_AUTH_TOKEN is missing
  // because getPrismaInstance() checks for it first
  if (url.startsWith('libsql://')) {
    const token = process.env.DATABASE_AUTH_TOKEN
    if (!token) {
      // This should never happen, but add safety check
      throw new Error('DATABASE_AUTH_TOKEN is required for libsql:// DATABASE_URL. This should have been caught earlier.')
    }
    try {
      const { createClient, PrismaLibSQL } = loadLibSQL()
      
      // Validate that createClient and PrismaLibSQL are actually functions
      if (typeof createClient !== 'function') {
        throw new Error('createClient from @libsql/client is not a function. Package may not be installed correctly.')
      }
      if (typeof PrismaLibSQL !== 'function') {
        throw new Error('PrismaLibSQL from @prisma/adapter-libsql is not a function. Package may not be installed correctly.')
      }
      
      const libsql = createClient({ url, authToken: token })
      
      // Validate libsql client was created
      if (!libsql || typeof libsql !== 'object') {
        throw new Error('Failed to create libsql client. createClient did not return a valid client object.')
      }
      
      const adapter = new PrismaLibSQL(libsql)
      
      // Validate adapter was created
      if (!adapter || typeof adapter !== 'object') {
        throw new Error('Failed to create PrismaLibSQL adapter. Constructor did not return a valid adapter object.')
      }
      
      // @ts-ignore - dynamic require to avoid bundling issues
      const { PrismaClient } = require('@prisma/client')
      const client = new PrismaClient({ adapter } as Prisma.PrismaClientOptions)
      return client
    } catch (e: any) {
      const hint = 'If you see "bind" undefined, it usually means the libsql adapter/client failed to construct. Ensure @libsql/client and @prisma/adapter-libsql are installed, and this route runs on Node.js runtime.'
      throw new Error(`Failed to init libsql adapter: ${e?.message || e}. ${hint}`)
    }
  }

  // SQLite file path (e.g., file:/tmp/prod.db on Vercel)
  if (url.startsWith('file:')) {
    // @ts-ignore - dynamic require to avoid bundling issues
    const { PrismaClient } = require('@prisma/client')
    return new PrismaClient()
  }

  throw new Error(`Unsupported DATABASE_URL scheme: ${url}`)
}

// Detect if we're in a build context (Next.js build phase)
function isBuildContext(): boolean {
  // Check various indicators that we're in a build phase
  return (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-export' ||
    process.env.NEXT_PHASE === 'phase-development-build' ||
    // During build, Next.js may not have VERCEL_ENV set
    (process.env.VERCEL === '1' && !process.env.VERCEL_ENV) ||
    // If we're collecting page data during build
    process.argv.includes('build') ||
    process.argv.includes('export')
  )
}

// Create a safe proxy that defers initialization until runtime
function createDeferredProxy(): PrismaClient {
  return new Proxy({} as PrismaClient, {
    get(_target, prop) {
      // For model access (like prisma.supporter), return a proxy that handles all Prisma model methods
      if (typeof prop === 'string' && prop !== '$connect' && prop !== '$disconnect' && 
          prop !== '$queryRaw' && prop !== '$queryRawUnsafe' && 
          prop !== '$transaction' && prop !== '$extends' &&
          !prop.startsWith('$') && !prop.startsWith('_')) {
        // Return a proxy for the model (e.g., supporter, featureFlag, etc.)
        return new Proxy({}, {
          get(_modelTarget, modelProp) {
            // Return a function that throws at runtime with helpful error
            return async (...args: any[]) => {
              throw new Error(`Prisma client not initialized during build. Database operations will work at runtime when DATABASE_AUTH_TOKEN is set. Cannot execute ${String(prop)}.${String(modelProp)}.`)
            }
          },
        })
      }
      // For Prisma client methods ($connect, $disconnect, etc.), return a function that throws
      if (typeof prop === 'string' && prop.startsWith('$')) {
        return async (...args: any[]) => {
          throw new Error(`Prisma client not initialized during build. Database operations will work at runtime when DATABASE_AUTH_TOKEN is set.`)
        }
      }
      // For any other properties, return undefined
      return undefined
    },
  })
}

// Fully lazy initialization - only create when a method is actually called
function getPrismaInstance(): PrismaClient {
  if (prismaGlobal) {
    return prismaGlobal
  }

  // CRITICAL: During build, NEVER try to initialize Prisma
  // Even if DATABASE_AUTH_TOKEN is set, we don't want to connect during build
  if (isBuildContext()) {
    return createDeferredProxy()
  }

  const url = process.env.DATABASE_URL
  
  // If using libsql and missing token, return a deferred proxy
  if (url?.startsWith('libsql://') && !process.env.DATABASE_AUTH_TOKEN) {
    return createDeferredProxy()
  }

  // Only try to initialize at runtime with all required vars
  try {
    const client = makeClient()
    if (process.env.NODE_ENV !== 'production') {
      prismaGlobal = client
      ;(global as any).__PRISMA__ = client
    }
    return client
  } catch (e: any) {
    // If initialization fails, re-throw with helpful message
    throw new Error(`Failed to initialize Prisma client: ${e.message}. Check DATABASE_URL and DATABASE_AUTH_TOKEN.`)
  }
}

// Export a proxy that only initializes when methods are called
const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    try {
      const instance = getPrismaInstance()
      const value = (instance as any)[prop]
      if (value === undefined || value === null) {
        return undefined
      }
      return typeof value === 'function' ? value.bind(instance) : value
    } catch (e: any) {
      // If we can't get the instance, return a function that throws
      return () => {
        throw new Error(`Cannot access Prisma client: ${e.message}`)
      }
    }
  },
  has(_target, prop) {
    try {
      const instance = getPrismaInstance()
      return prop in instance
    } catch {
      return false
    }
  },
})

export default prisma

// Also export as named export for backward compatibility
export { prisma }
