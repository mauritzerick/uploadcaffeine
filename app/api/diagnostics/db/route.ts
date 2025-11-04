import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getEnvSnapshot, maskUrl } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  // simple bearer token to allow prod diagnostics
  const auth = new URL(req.url).searchParams.get('token') || req.headers.get('x-diag-token')
  const needsToken = process.env.NODE_ENV === 'production'
  if (needsToken && (!process.env.DIAG_TOKEN || auth !== process.env.DIAG_TOKEN)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized diagnostics. Set DIAG_TOKEN env and pass ?token=...' }, { status: 401 })
  }

  const env = getEnvSnapshot()
  const mode = !env.DATABASE_URL ? 'unknown' : (env.DATABASE_URL.startsWith('libsql://') ? 'turso/libsql' : (env.DATABASE_URL.startsWith('file:') ? 'sqlite-file' : 'unknown'))

  try {
    // Very light query; avoids touching app tables
    const ping = await prisma.$queryRawUnsafe('SELECT 1 as ok')

    // versions (best-effort)
    let prismaPkg: any = null
    try { prismaPkg = require('@prisma/client/package.json') } catch {}
    let libsqlPkg: any = null
    try { libsqlPkg = require('@libsql/client/package.json') } catch {}

    return NextResponse.json({
      ok: true,
      mode,
      env: { ...env, DATABASE_URL: maskUrl(env.DATABASE_URL) },
      versions: {
        node: process.version,
        '@prisma/client': prismaPkg?.version || 'unknown',
        '@libsql/client': libsqlPkg?.version || (mode === 'turso/libsql' ? 'not-found' : 'n/a'),
      },
      ping,
    })
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      mode,
      env: { ...env, DATABASE_URL: maskUrl(env.DATABASE_URL) },
      error: e?.message || String(e),
      stack: process.env.NODE_ENV === 'development' ? e?.stack : undefined,
    }, { status: 500 })
  }
}

