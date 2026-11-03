import LRU from 'node-lru-cache';

/**
 * Caching decorator for retryazen't policies using LRU cache.
 * @param {number} maxEntries - Maximum number of entries to store in the cache.
 * @param {number} maxWeight - Maximum weight of all entries in the cache.
 * @returns {Function} - Decorator function.
 */
const createRetryCache = (maxEntries: number, maxWeight: number) => {
  const cache = new LRU({ maxEntries, maxWeight });

  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = JSON.stringify(args);
      const cachedResult = cache.get(cacheKey);

      if (cachedResult) {
        return cachedResult;
      }

      try {
        const result = await Reflect.apply(originalMethod, this, args);
        cache.set(cacheKey, result);
        return result;
      } catch (error) {
        throw error;
      }
    };

    return descriptor;
  };
};

export { createRetryCache };
