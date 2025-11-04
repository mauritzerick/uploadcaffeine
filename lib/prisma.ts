import type { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

// Prevent multiple instances in dev
// eslint-disable-next-line no-var
var prismaGlobal: PrismaClient | undefined = (global as any).__PRISMA__;

function makeClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');

  // Turso / libSQL path — requires DATABASE_AUTH_TOKEN
  if (url.startsWith('libsql://')) {
    // Try env var first, then extract from URL if present
    let token = process.env.DATABASE_AUTH_TOKEN;
    if (!token) {
      try {
        const urlObj = new URL(url);
        token = urlObj.searchParams.get('authToken') || undefined;
      } catch {
        // URL parsing failed
      }
    }
    if (!token) {
      throw new Error('DATABASE_AUTH_TOKEN is required for libsql:// DATABASE_URL');
    }
    try {
      // Dynamic requires avoid ESM/edge bundling issues
      // @ts-ignore - dynamic require needed for libsql
      const { createClient } = require('@libsql/client');
      // @ts-ignore - dynamic require needed for adapter
      const { PrismaLibSQL } = require('@prisma/adapter-libsql');

      // Ensure URL is clean (no query params), token separate
      let cleanUrl = url;
      try {
        const u = new URL(url);
        cleanUrl = `${u.protocol}//${u.host}`; // e.g. libsql://host
      } catch {
        // URL parsing failed, try regex fallback
        const match = url.match(/^(libsql:\/\/[^?]+)/);
        if (match) cleanUrl = match[1];
      }
      const libsql = createClient({ url: cleanUrl, authToken: token });
      const adapter = new PrismaLibSQL(libsql);

      // Cast to Prisma options to satisfy TS with adapter
      const client = new PrismaClient({ adapter, log: ["error", "warn"] } as unknown as Prisma.PrismaClientOptions);

      // Runtime sanity check — verify delegate methods exist
      const delegate: any = (client as any).supporter;
      if (!delegate || typeof delegate.findFirst !== 'function') {
        const keys = delegate ? Object.keys(delegate) : [];
        throw new Error(`Prisma delegate for 'supporter' is invalid. typeof findFirst=${typeof delegate?.findFirst}, keys=[${keys.join(', ')}]. Ensure prisma generate ran and versions match.`);
      }
      return client;
    } catch (e: any) {
      throw new Error(`Failed to initialize Prisma libsql adapter: ${e?.message || e}`);
    }
  }

  // SQLite file (Vercel runtime can only write to /tmp)
  if (url.startsWith('file:')) {
    return new PrismaClient({ log: ["error", "warn"] });
  }

  throw new Error(`Unsupported DATABASE_URL scheme: ${url}`);
}

// Lazy initialization - only create client when actually accessed
function getPrisma() {
  if (!prismaGlobal) {
    prismaGlobal = makeClient();
    if (process.env.NODE_ENV !== 'production') {
      (global as any).__PRISMA__ = prismaGlobal;
    }
  }
  return prismaGlobal;
}

// Export a proxy that initializes on first access
const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as any)[prop];
  },
  has(_target, prop) {
    return prop in getPrisma();
  },
});

export default prisma;
