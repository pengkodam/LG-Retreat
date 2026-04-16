import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();

// Scope all keys under a group ID so different lifegroups / weeks don't mix.
export function groupKey(groupId: string, kind: string, id?: string) {
  const base = `stirup:${groupId}:${kind}`;
  return id ? `${base}:${id}` : base;
}

// Convenience: list all keys of a kind for a group, then MGET their values.
export async function listKind<T>(groupId: string, kind: string): Promise<T[]> {
  const pattern = `stirup:${groupId}:${kind}:*`;
  const keys: string[] = [];
  let cursor = 0;
  do {
    const [next, batch] = await redis.scan(cursor, { match: pattern, count: 100 });
    keys.push(...batch);
    cursor = Number(next);
  } while (cursor !== 0);

  if (keys.length === 0) return [];
  const values = await redis.mget<T[]>(...keys);
  return values.filter((v): v is T => v !== null);
}
