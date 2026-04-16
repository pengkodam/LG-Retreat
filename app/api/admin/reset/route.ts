import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { GROUP_ID } from '@/lib/content';

export const runtime = 'edge';

const VALID_KINDS = ['reflect', 'bingo', 'prayer', 'drawing', 'all'] as const;
type Kind = (typeof VALID_KINDS)[number];

export async function POST(req: NextRequest) {
  const auth = req.headers.get('x-admin-secret');
  if (auth !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const { kind } = (await req.json()) as { kind: Kind };
    if (!VALID_KINDS.includes(kind)) {
      return NextResponse.json({ error: 'invalid kind' }, { status: 400 });
    }

    const patterns = kind === 'all' ? ['reflect', 'bingo', 'prayer', 'drawing'] : [kind];

    let totalDeleted = 0;
    for (const p of patterns) {
      const pattern = `stirup:${GROUP_ID}:${p}:*`;
      const keys: string[] = [];
      let cursor = 0;
      do {
        const [next, batch] = await redis.scan(cursor, { match: pattern, count: 100 });
        keys.push(...batch);
        cursor = Number(next);
      } while (cursor !== 0);

      if (keys.length > 0) {
        // Redis del accepts multiple args; chunk to avoid huge single commands
        const CHUNK = 100;
        for (let i = 0; i < keys.length; i += CHUNK) {
          const slice = keys.slice(i, i + CHUNK);
          await redis.del(...slice);
        }
        totalDeleted += keys.length;
      }
    }

    return NextResponse.json({ ok: true, deleted: totalDeleted, kind });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
