import assert from 'node:assert';
import { describe, it } from 'node:test';
import { RateShapingEmitter, EventTypes } from '../src/rateShapingEmitter.ts';

describe('RateShapingEmitter', () => {
  let emitter: RateShapingEmitter;

  beforeEach(() => {
    emitter = new RateShapingEmitter();
  });

  it('emits rateLimited event with correct payload', () => {
    const retryAfter = 10;
    const details = 'Too many requests';
    emitter.emitRateLimited(retryAfter, details);
    assert.deepEqual(emitter.listeners(EventTypes.RateLimited)[0].callbacks[0](), { retryAfter, details });
  });

  it('emits delivered event with correct payload', () => {
    const payload = { message: 'test' };
    emitter.emitDelivered(payload);
    assert.deepEqual(emitter.listeners(EventTypes.Delivered)[0].callbacks[0](), payload);
  });

  it('emits failed event with correct payload', () => {
    const error = new Error('Test error');
    emitter.emitFailed(error);
    assert.deepEqual(emitter.listeners(EventTypes.Failed)[0].callbacks[0](), error);
  });
});
