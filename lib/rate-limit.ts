import "server-only";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Above this many tracked keys, expired buckets are swept to bound memory. */
const MAX_TRACKED_KEYS = 5000;

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the window resets; 0 when the request is allowed. */
  retryAfterSeconds: number;
}

/**
 * A fixed-window request counter held in process memory.
 *
 * Deliberately storage-free because this project has no database. That makes it
 * per-instance: it resets on a cold start and does not coordinate across
 * instances. It is enough to stop casual overuse of the demo endpoint; a real
 * deployment would move this to a shared store. See
 * docs/adr/0004-in-memory-abuse-guardrails.md.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  sweepExpired(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function sweepExpired(now: number) {
  if (buckets.size < MAX_TRACKED_KEYS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}
