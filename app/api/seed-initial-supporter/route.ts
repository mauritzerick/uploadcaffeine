import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Check if initial supporter already exists
    const existing = await prisma.supporter.findFirst({
      where: {
        stripeSessionId: 'seed-initial',
      },
    });

    if (existing) {
      return NextResponse.json({ ok: true, supporter: existing, message: 'Initial supporter already exists' });
    }

    // Create initial supporter with $16 (1600 cents)
    const s = await prisma.supporter.create({
      data: {
        stripeSessionId: 'seed-initial',
        name: 'First Supporter',
        email: 'seed@example.com',
        amountCents: 1600,
        currency: 'AUD',
        monthly: false,
        message: 'Seed record',
      },
    });

    return NextResponse.json({ ok: true, supporter: s, message: 'Initial supporter created successfully' });
  } catch (e: any) {
    // Inspect delegate shape to help debug in prod
    const delegate: any = (prisma as any).supporter;
    const shape = delegate ? Object.keys(delegate) : [];
    return NextResponse.json({ ok: false, error: e?.message || String(e), delegateKeys: shape }, { status: 500 });
  }
}
