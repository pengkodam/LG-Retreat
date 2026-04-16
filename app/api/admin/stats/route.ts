import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { GROUP_ID } from '@/lib/content';

export const runtime = 'edge';

async function countKind(kind: string): Promise<number> {
  const pattern = `stirup:${GROUP_ID}:${kind}:*`;
  let count = 0;
  let cursor = 0;
  do {
    const [next, batch] = await redis.scan(cursor, { match: pattern, count: 100 });
    count += batch.length;
    cursor = Number(next);
  } while (cursor !== 0);
  return count;
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('x-admin-secret');
  if (auth !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const [reflect, bingo, prayer, drawing] = await Promise.all([
      countKind('reflect'),
      countKind('bingo'),
      countKind('prayer'),
      countKind('drawing'),
    ]);

    return NextResponse.json({
      groupId: GROUP_ID,
      counts: { reflect, bingo, prayer, drawing },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
