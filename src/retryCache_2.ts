import { Cache, CacheConfig, createCache } from './cache';

/**
 * Decorator for creating a retry cache with the given config.
 * @param config - Cache configuration.
 */
export function createRetryCache(config?: CacheConfig): Cache<string, unknown> {
  return createCache<string, unknown>({
    ttl: config?.ttl || 60 * 60 * 1000, // default TTL: 1 hour in milliseconds
    maxKeys: config?.maxKeys || 1000, // default max keys: 1000
  });
}

/**
 * Retry cache instance.
 */
export const retryCache = createRetryCache();
