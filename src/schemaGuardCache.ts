import { SchemaGuard } from './schemaGuard.js';

/**
 * Wraps a schema guard function with an LRU (Least Recently Used) cache.
 * Cache keys are JSON-stringified payloads; cache size is limited to `maxSize` entries.
 *
 * @param guard - The original schema guard function to cache.
 * @param maxSize - Maximum number of cached results (default 1000).
 * @returns A new schema guard function with caching behavior.
 */
export function withCache(guard: SchemaGuard, maxSize = 1000): SchemaGuard {
  const cache = new Map<string, boolean>();
  const cacheKeys = new Set<string>();

  return function cachedGuard(payload: unknown): boolean {
    let key: string;
    try {
      key = JSON.stringify(payload);
    } catch {
      // If serialization fails, fall back to the original guard
      return guard(payload);
    }

    if (cacheKeys.has(key)) {
      // Move the key to the end of the Set to mark it as recently used
      cacheKeys.delete(key);
      cacheKeys.add(key);
      return cache.get(key)!;
    }

    if (cache.size >= maxSize) {
      const oldestKey = cacheKeys.keys().next().value;
      if (!oldestKey) return false;
      cacheKeys.delete(oldestKey);
      cache.delete(oldestKey);
    }

    cacheKeys.add(key);
    const result = guard(payload);
    cache.set(key, result);
    return result;
  };
}
