import { NextRequest, NextResponse } from 'next/server';
import { redis, groupKey } from '@/lib/redis';
import { GROUP_ID } from '@/lib/content';
import type { PrayerPayload } from '../route';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { ownerUserId } = (await req.json()) as { ownerUserId: string };
    if (!ownerUserId) {
      return NextResponse.json({ error: 'ownerUserId required' }, { status: 400 });
    }
    const key = groupKey(GROUP_ID, 'prayer', ownerUserId);
    const existing = await redis.get<PrayerPayload>(key);
    if (!existing) {
      return NextResponse.json({ error: 'prayer not found' }, { status: 404 });
    }
    existing.prayedCount = (existing.prayedCount || 0) + 1;
    await redis.set(key, existing);
    return NextResponse.json({ ok: true, prayedCount: existing.prayedCount });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
