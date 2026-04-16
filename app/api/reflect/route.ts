import { NextRequest, NextResponse } from 'next/server';
import { redis, groupKey, listKind } from '@/lib/redis';
import { GROUP_ID } from '@/lib/content';

export const runtime = 'edge';

export type ReflectPayload = {
  userId: string;
  userName: string;
  answers: Record<string, string>;
  prayerNotes: Record<string, string>;
  shareFlags: Record<string, boolean>;
  timestamp: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReflectPayload;
    if (!body.userId || !body.userName) {
      return NextResponse.json({ error: 'userId and userName required' }, { status: 400 });
    }
    await redis.set(groupKey(GROUP_ID, 'reflect', body.userId), body);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const all = await listKind<ReflectPayload>(GROUP_ID, 'reflect');
    return NextResponse.json({ responses: all });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, responses: [] }, { status: 500 });
  }
}
