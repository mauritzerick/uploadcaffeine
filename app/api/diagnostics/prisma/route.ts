import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  const url = process.env.DATABASE_URL || '(not set)';
  const mode = url.startsWith('libsql://') ? 'turso/libsql' : (url.startsWith('file:') ? 'sqlite-file' : 'unknown');
  try {
    const okFind = typeof (prisma as any).supporter?.findFirst === 'function';
    const okUpsert = typeof (prisma as any).supporter?.upsert === 'function';
    const ping = await prisma.$queryRawUnsafe('SELECT 1 as ok');
    return NextResponse.json({ ok: true, mode, url: url.replace(/(authToken=)[^&]+/, '$1***'), api: { findFirst: okFind, upsert: okUpsert }, ping });
  } catch (e: any) {
    return NextResponse.json({ ok: false, mode, url: url.replace(/(authToken=)[^&]+/, '$1***'), error: e?.message || String(e) }, { status: 500 });
  }
}

