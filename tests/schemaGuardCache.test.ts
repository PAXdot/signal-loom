import { assert } from 'node:assert';
import { describe, it } from 'node:test';
import { withCache } from '../src/schemaGuardCache.js';

describe('schemaGuardCache', () => {
  const originalGuard = (payload: unknown) => typeof payload === 'object';

  it('caches positive results', () => {
    const cachedGuard = withCache(originalGuard);
    const payload = { a: 1 };
    assert.equal(cachedGuard(payload), true);
    assert.equal(cachedGuard(payload), true); // Second call should be cached
  });

  it('caches negative results', () => {
    const cachedGuard = withCache(originalGuard);
    const payload = 'not an object';
    assert.equal(cachedGuard(payload), false);
    assert.equal(cachedGuard(payload), false); // Second call should be cached
  });

  it('falls back to original guard on serialization failure', () => {
    const cachedGuard = withCache(originalGuard);
    const payload = Symbol();
    assert.equal(cachedGuard(payload), false);
  });

  it('evicts the oldest entry on max size', () => {
    const cachedGuard = withCache(originalGuard, 2);
    const payload1 = { a: 1 };
    const payload2 = { b: 2 };
    const payload3 = { c: 3 };
    assert.equal(cachedGuard(payload1), true);
    assert.equal(cachedGuard(payload2), true);
    assert.equal(cachedGuard(payload3), true);
    assert.equal(cachedGuard(payload1), true); // Latest used
    assert.equal(cachedGuard(payload2), false); // Oldest, should have been evicted
  });
});
