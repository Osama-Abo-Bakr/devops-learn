interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export function rateLimit(options: {
  windowMs: number;
  maxRequests: number;
}): (key: string) => { allowed: boolean; remaining: number } {
  const { windowMs, maxRequests } = options;

  return (key: string) => {
    const now = Date.now();
    const entry = store.get(key);

    // Clean up expired entries
    for (const [k, v] of store) {
      if (v.resetAt <= now) store.delete(k);
    }

    if (!entry || entry.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (entry.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    entry.count++;
    return { allowed: true, remaining: maxRequests - entry.count };
  };
}