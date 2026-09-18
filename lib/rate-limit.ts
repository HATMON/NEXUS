type Bucket = { count: number; resetAt: number };

declare global {
  var ecovoltRateLimitStore: Map<string, Bucket> | undefined;
}

const store = global.ecovoltRateLimitStore ?? new Map<string, Bucket>();
global.ecovoltRateLimitStore = store;

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  current.count += 1;
  store.set(key, current);

  if (current.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  return { allowed: true, remaining: Math.max(0, limit - current.count), retryAfter: 0 };
}

export function requestIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
