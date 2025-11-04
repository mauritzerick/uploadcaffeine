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
  
  // CRITICAL: If we're in Vercel and VERCEL_ENV is set, we're in RUNTIME
  // This is the most reliable runtime indicator
  if (process.env.VERCEL === '1' && process.env.VERCEL_ENV) {
    return false // We're in runtime, not build
  }
  
  // If we're in Vercel but VERCEL_ENV is not set, we might be in build
  // But only if NEXT_PHASE is explicitly set
  if (process.env.VERCEL === '1' && nextPhase) {
    return true
  }
  
  // If we're in Vercel without VERCEL_ENV or NEXT_PHASE, assume runtime
  // (This is safer - we'd rather initialize Prisma than return a deferred proxy)
  if (process.env.VERCEL === '1') {
    return false
  }
  
  // Not in Vercel, only return true if NEXT_PHASE is explicitly set
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
    try {
      const testModel = (prismaGlobal as any).supporter
      if (testModel && typeof testModel.findMany === 'function') {
        // This is a real Prisma client - use it
        return prismaGlobal
      }
    } catch (e) {
      // If accessing supporter throws, it's not a real client
      console.warn('Prisma client cache invalid, clearing:', e)
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
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Initializing Prisma client at runtime...', {
        hasUrl: !!url,
        hasToken: !!process.env.DATABASE_AUTH_TOKEN,
        urlPrefix: url?.substring(0, 20),
        vercelEnv: process.env.VERCEL_ENV,
      })
    }
    
    const client = makeClient()
    
    // Verify the client was created correctly - test with a simple property access
    try {
      const testModel = (client as any).supporter
      if (!testModel) {
        throw new Error('Prisma client created but supporter model is undefined')
      }
      if (typeof testModel.findMany !== 'function') {
        throw new Error(`Prisma client created but supporter.findMany is not a function (got ${typeof testModel.findMany})`)
      }
    } catch (testError: any) {
      console.error('❌ Prisma client verification failed:', testError.message)
      throw new Error(`Prisma client created but models are not accessible: ${testError.message}`)
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Prisma client initialized successfully')
    }
    
    // Cache the client
    prismaGlobal = client
    if (process.env.NODE_ENV !== 'production') {
      ;(global as any).__PRISMA__ = client
    }
    return client
  } catch (e: any) {
    // If initialization fails, re-throw with helpful message
    console.error('❌ Failed to initialize Prisma client:', e.message)
    throw new Error(`Failed to initialize Prisma client: ${e.message}. Check DATABASE_URL and DATABASE_AUTH_TOKEN.`)
  }
}

// Export a proxy that only initializes when methods are called
// SIMPLIFIED: Just return the value directly from the instance
const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    try {
      const instance = getPrismaInstance()
      // Simply return the property from the instance - Prisma handles binding
      return (instance as any)[prop]
    } catch (e: any) {
      // If we can't get the instance, log the error
      console.error('Prisma proxy error:', e.message, {
        stack: process.env.NODE_ENV === 'development' ? e.stack : undefined,
      })
      // Return a function that throws with helpful error
      if (typeof prop === 'string' && prop !== 'then' && prop !== 'catch') {
        return (...args: any[]) => {
          throw new Error(`Cannot access Prisma client: ${e.message}. Check DATABASE_URL and DATABASE_AUTH_TOKEN.`)
        }
      }
      throw e
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
