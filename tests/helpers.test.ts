import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isFilterMatch } from '../src/isFilterMatch.js';
import { RateShapingEmitter } from '../src/rateShapingEmitter.js';

describe('isFilterMatch', () => {
  it('matches an exact nested value', () => {
    const payload = { event: { type: 'delivery' } };
    assert.strictEqual(
      isFilterMatch({ path: 'event.type', value: 'delivery' }, payload),
      true
    );
  });

  it('matches a string field against a regex', () => {
    const payload = { id: 'evt_123' };
    assert.strictEqual(isFilterMatch({ path: 'id', regex: '^evt_' }, payload), true);
  });

  it('does not match a missing path', () => {
    assert.strictEqual(isFilterMatch({ path: 'missing', value: 'x' }, {}), false);
  });
});

describe('RateShapingEmitter', () => {
  it('emits rateLimited with retry details', () => {
    const emitter = new RateShapingEmitter();
    let received: { retryAfter: number; details: string } | undefined;
    emitter.on('rateLimited', (event) => {
      received = event;
    });

    emitter.emitRateLimited(30, 'slow down');

    assert.deepStrictEqual(received, { retryAfter: 30, details: 'slow down' });
  });

  it('emits delivered and failed events', () => {
    const emitter = new RateShapingEmitter();
    const seen: string[] = [];
    emitter.on('delivered', () => seen.push('delivered'));
    emitter.on('failed', () => seen.push('failed'));

    emitter.emitDelivered({ ok: true });
    emitter.emitFailed(new Error('downstream'));

    assert.deepStrictEqual(seen, ['delivered', 'failed']);
  });
});
