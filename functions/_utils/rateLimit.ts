export interface KvNamespaceLike {
  list: (options: {
    prefix: string;
    limit: number;
  }) => Promise<{ keys: Array<{ name: string }> }>;
  put: (
    key: string,
    value: string,
    options: { expirationTtl: number },
  ) => Promise<void>;
}

interface RateLimitOptions {
  kv: KvNamespaceLike;
  key: string;
  limit: number;
  windowSeconds: number;
}

export async function checkRateLimit({
  kv,
  key,
  limit,
  windowSeconds,
}: RateLimitOptions): Promise<boolean> {
  const prefix = `${key}:`;
  const list = await kv.list({ prefix, limit: limit + 1 });

  if (list.keys.length >= limit) {
    return false;
  }

  const uniqueKey = `${prefix}${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  await kv.put(uniqueKey, "1", { expirationTtl: windowSeconds });

  return true;
}
