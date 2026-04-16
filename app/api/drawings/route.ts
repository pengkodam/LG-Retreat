import { NextRequest, NextResponse } from 'next/server';
import { redis, groupKey, listKind } from '@/lib/redis';
import { GROUP_ID } from '@/lib/content';

export const runtime = 'edge';

export type DrawingPayload = {
  userId: string;
  userName: string;
  friendFor: string;
  image: string; // data URL
  timestamp: number;
};

// Images are capped at ~500KB (Redis value limit safety).
const MAX_IMAGE_BYTES = 500_000;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DrawingPayload;
    if (!body.userId || !body.image) {
      return NextResponse.json({ error: 'userId and image required' }, { status: 400 });
    }
    if (body.image.length > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: 'image too large' }, { status: 413 });
    }
    // Unique per drawing
    const uniqueId = `${body.userId}-${body.timestamp}`;
    await redis.set(groupKey(GROUP_ID, 'drawing', uniqueId), body);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const all = await listKind<DrawingPayload>(GROUP_ID, 'drawing');
    all.sort((a, b) => b.timestamp - a.timestamp);
    return NextResponse.json({ drawings: all });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, drawings: [] }, { status: 500 });
  }
}
