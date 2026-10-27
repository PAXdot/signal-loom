import { SchemaGuard } from './schemaGuard.js';

/**
 * Wraps a schema guard function with an in-memory cache.
 * Cache keys are JSON-stringified payloads; cache size is limited to `maxSize` entries.
 * When the cache is full, the oldest entries are evicted via a simple FIFO strategy.
 *
 * @param guard - The original schema guard function to cache.
 * @param maxSize - Maximum number of cached results (default 1000).
 * @returns A new schema guard function with caching behavior.
 */
export function withCache(
  guard: SchemaGuard,
  maxSize: number = 1000,
): SchemaGuard {
  const cache = new Map<string, boolean>();
  const keys: string[] = [];

  return function cachedGuard(payload: unknown): boolean {
    let key: string;
    try {
      key = JSON.stringify(payload);
    } catch {
      // If serialization fails, fall through to the original guard
      return guard(payload);
    }

    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const result = guard(payload);

    if (cache.size >= maxSize && keys.length > 0) {
      const oldestKey = keys.shift()!;
      cache.delete(oldestKey);
    }

    cache.set(key, result);
    keys.push(key);

    return result;
  };
}
