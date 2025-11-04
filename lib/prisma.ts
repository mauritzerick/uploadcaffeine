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
  if (url.startsWith('libsql://')) {
    const token = process.env.DATABASE_AUTH_TOKEN
    if (!token) {
      throw new Error('DATABASE_AUTH_TOKEN is required for libsql:// DATABASE_URL')
    }
    try {
      const { createClient, PrismaLibSQL } = loadLibSQL()
      const libsql = createClient({ url, authToken: token })
      const adapter = new PrismaLibSQL(libsql)
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

// Fully lazy initialization - only create when a method is actually called
function getPrismaInstance(): PrismaClient {
  if (prismaGlobal) {
    return prismaGlobal
  }

  // Check if we're in a build context
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                      process.env.NEXT_PHASE === 'phase-export' ||
                      process.env.NODE_ENV === 'production' && process.env.VERCEL && !process.env.VERCEL_ENV

  // During build, if using libsql and missing token, return a no-op proxy
  const url = process.env.DATABASE_URL
  if (url?.startsWith('libsql://') && !process.env.DATABASE_AUTH_TOKEN) {
    // Return a proxy that defers initialization until runtime
    // This allows the build to succeed even without DATABASE_AUTH_TOKEN
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        // For model access (like prisma.supporter), return a proxy that handles all Prisma model methods
        if (typeof prop === 'string' && prop !== '$connect' && prop !== '$disconnect' && 
            prop !== '$queryRaw' && prop !== '$queryRawUnsafe' && prop !== '$transaction' && 
            !prop.startsWith('$') && !prop.startsWith('_')) {
          // Return a proxy for the model (e.g., supporter, featureFlag, etc.)
          return new Proxy({}, {
            get(_modelTarget, modelProp) {
              // Return a function that throws at runtime with helpful error
              return async (...args: any[]) => {
                throw new Error(`DATABASE_AUTH_TOKEN is required for libsql:// DATABASE_URL. Set it in Vercel environment variables. Cannot execute ${String(prop)}.${String(modelProp)} without database connection.`)
              }
            },
          })
        }
        // For Prisma client methods ($connect, $disconnect, etc.), return a function that throws
        if (typeof prop === 'string' && prop.startsWith('$')) {
          return async (...args: any[]) => {
            throw new Error(`DATABASE_AUTH_TOKEN is required for libsql:// DATABASE_URL. Set it in Vercel environment variables.`)
          }
        }
        // For any other properties, return undefined
        return undefined
      },
    })
  }

  // Runtime or build with all required vars - initialize
  try {
    const client = makeClient()
    if (process.env.NODE_ENV !== 'production') {
      prismaGlobal = client
      ;(global as any).__PRISMA__ = client
    }
    return client
  } catch (e: any) {
    // If initialization fails during build, return a proxy that will throw at runtime
    if (isBuildTime) {
      return new Proxy({} as PrismaClient, {
        get(_target, prop) {
          return () => {
            throw new Error(`Prisma initialization failed: ${e.message}. This will be resolved at runtime when DATABASE_AUTH_TOKEN is set.`)
          }
        },
      })
    }
    throw e
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
