// src/schemaGuard.ts

/**
 * A decorator for schema guards to cache their results.
 * @param schemaGuard - The schema guard function to cache.
 * @param ttl - The time-to-live for the cache in milliseconds.
 * @returns A memoized version of the schema guard function.
 */
export const withSchemaGuardCache = (schemaGuard: (input: any) => boolean, ttl = 60000) => {
  const cache = new Map<string, { value: boolean; expiresAt: number }>();

  return (input: any): boolean => {
    const key = JSON.stringify(input);

    if (cache.has(key) && cache.get(key)!.expiresAt > Date.now()) {
      return cache.get(key)!.value;
    }

    const result = schemaGuard(input);

    cache.set(key, { value: result, expiresAt: Date.now() + ttl });

    return result;
  };
};
