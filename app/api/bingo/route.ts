import { NextRequest, NextResponse } from 'next/server';
import { redis, groupKey, listKind } from '@/lib/redis';
import { GROUP_ID } from '@/lib/content';

export const runtime = 'edge';

export type BingoPayload = {
  userId: string;
  userName: string;
  picks: string[];
  wildcard: string;
  timestamp: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BingoPayload;
    if (!body.userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }
    await redis.set(groupKey(GROUP_ID, 'bingo', body.userId), body);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const all = await listKind<BingoPayload>(GROUP_ID, 'bingo');
    return NextResponse.json({ votes: all });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, votes: [] }, { status: 500 });
  }
}
