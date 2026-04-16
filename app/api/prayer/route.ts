import { NextRequest, NextResponse } from 'next/server';
import { redis, groupKey, listKind } from '@/lib/redis';
import { GROUP_ID } from '@/lib/content';

export const runtime = 'edge';

export type PrayerPayload = {
  userId: string;
  userName: string;
  text: string;
  anonymous: boolean;
  timestamp: number;
  prayedCount: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PrayerPayload;
    if (!body.userId || !body.text?.trim()) {
      return NextResponse.json({ error: 'userId and text required' }, { status: 400 });
    }
    await redis.set(groupKey(GROUP_ID, 'prayer', body.userId), {
      ...body,
      prayedCount: body.prayedCount ?? 0,
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const all = await listKind<PrayerPayload>(GROUP_ID, 'prayer');

    // Optionally assign a random prayer from someone else
    let assigned: PrayerPayload | null = null;
    if (userId) {
      const others = all.filter((p) => p.userId !== userId);
      if (others.length > 0) {
        assigned = others[Math.floor(Math.random() * others.length)];
      }
    }

    const mine = userId ? all.find((p) => p.userId === userId) || null : null;

    return NextResponse.json({ prayers: all, assigned, mine });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, prayers: [] }, { status: 500 });
  }
}
