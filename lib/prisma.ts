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
  // Only consider it build time if we're actually in the build process
  // Don't treat runtime as build time
  if (typeof process === 'undefined' || !process.env) {
    return false
  }
  
  // PRIMARY CHECK: NEXT_PHASE is the most reliable indicator
  // This is set by Next.js during build phase only
  const nextPhase = process.env.NEXT_PHASE
  if (nextPhase === 'phase-production-build' || 
      nextPhase === 'phase-export' || 
      nextPhase === 'phase-development-build') {
    return true
  }
  
  // SECONDARY CHECK: Only if we're in Vercel build (not runtime)
  // During runtime requests, VERCEL_ENV will be 'production', 'preview', or 'development'
  // During build, VERCEL_ENV might not be set, but we should be more careful
  if (process.env.VERCEL === '1') {
    // If VERCEL_ENV is explicitly set, we're in runtime
    if (process.env.VERCEL_ENV) {
      return false
    }
    // If NEXT_PHASE is set, we're definitely in build
    if (nextPhase) {
      return true
    }
    // Otherwise, be conservative - don't assume build
    return false
  }
  
  // Not in Vercel, check if we're running build command
  // But only if we're definitely in build phase
  return false
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
  const url = process.env.DATABASE_URL
  const isBuild = isBuildContext()

  // CRITICAL: During build, NEVER try to initialize Prisma
  // Even if DATABASE_AUTH_TOKEN is set, we don't want to connect during build
  if (isBuild) {
    // Don't cache deferred proxy - always return fresh one during build
    return createDeferredProxy()
  }

  // AT RUNTIME: Always try to get real Prisma client
  // Check if we have a cached real client
  if (prismaGlobal) {
    // Verify it's a real client (not a deferred proxy)
    // Real Prisma clients have actual model properties with methods
    const testModel = (prismaGlobal as any).supporter
    if (testModel && typeof testModel.findMany === 'function') {
      // This is a real Prisma client
      return prismaGlobal
    }
    // If it's a deferred proxy or invalid, clear it
    prismaGlobal = undefined
  }

  // At runtime, if using libsql and missing token, throw helpful error
  // Don't return deferred proxy - we want a clear error at runtime
  if (url?.startsWith('libsql://') && !process.env.DATABASE_AUTH_TOKEN) {
    throw new Error('DATABASE_AUTH_TOKEN is required for libsql:// DATABASE_URL. Set it in Vercel environment variables.')
  }

  // At runtime, try to initialize with all required vars
  try {
    const client = makeClient()
    
    // Verify the client was created correctly
    const testModel = (client as any).supporter
    if (!testModel || typeof testModel.findMany !== 'function') {
      throw new Error('Prisma client created but models are not accessible. Check adapter configuration.')
    }
    
    // Cache the client
    prismaGlobal = client
    if (process.env.NODE_ENV !== 'production') {
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
      
      // Get the actual value from the instance
      const value = (instance as any)[prop]
      
      // If value is undefined, return undefined
      if (value === undefined || value === null) {
        return undefined
      }
      
      // CRITICAL: Prisma models are objects with methods already bound
      // We must return them directly without any modification
      // Prisma models like prisma.supporter have methods like findMany, findFirst, etc.
      if (typeof value === 'object' && value !== null) {
        // Don't modify Date objects or arrays
        if (value instanceof Date || Array.isArray(value)) {
          return value
        }
        
        // For Prisma model delegates, they have methods like findMany, findFirst, create, aggregate, etc.
        // These are already properly bound by Prisma, so return them as-is
        // Check if it has Prisma model methods (not just any object)
        const hasPrismaMethods = typeof (value as any).findMany === 'function' ||
                                  typeof (value as any).findFirst === 'function' ||
                                  typeof (value as any).create === 'function' ||
                                  typeof (value as any).aggregate === 'function' ||
                                  typeof (value as any).count === 'function' ||
                                  typeof (value as any).update === 'function' ||
                                  typeof (value as any).delete === 'function'
        
        if (hasPrismaMethods) {
          // This is a Prisma model delegate - return it directly
          return value
        }
        
        // For other objects, return as-is
        return value
      }
      
      // For functions, bind them to the instance
      if (typeof value === 'function') {
        return value.bind(instance)
      }
      
      // For primitives, return as-is
      return value
    } catch (e: any) {
      // If we can't get the instance, log the error and return a function that throws
      console.error('Prisma proxy error:', e.message)
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
