import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SignatureVerificationStats } from '../src/signatureStats';
import { SignatureVerificationResult } from '../src/isSignatureValid';

describe('SignatureVerificationStats', () => {
  it('starts with zero counts', () => {
    const stats = new SignatureVerificationStats();
    assert.strictEqual(stats._countTotal, 0);
    assert.strictEqual(stats._countValid, 0);
    assert.strictEqual(stats._countInvalid, 0);
  });

  it('updates countTotal on each call', () => {
    const stats = new SignatureVerificationStats();
    stats.update(SignatureVerificationResult.Valid);
    assert.strictEqual(stats._countTotal, 1);
    stats.update(SignatureVerificationResult.Invalid);
    assert.strictEqual(stats._countTotal, 2);
  });

  it('increments countValid for a valid result', () => {
    const stats = new SignatureVerificationStats();
    stats.update(SignatureVerificationResult.Valid);
    assert.strictEqual(stats._countValid, 1);
    assert.strictEqual(stats._countInvalid, 0);
  });

  it('increments countInvalid for an invalid result', () => {
    const stats = new SignatureVerificationStats();
    stats.update(SignatureVerificationResult.Invalid);
    assert.strictEqual(stats._countInvalid, 1);
    assert.strictEqual(stats._countValid, 0);
  });

  it('handles multiple updates correctly', () => {
    const stats = new SignatureVerificationStats();
    stats.update(SignatureVerificationResult.Valid);
    stats.update(SignatureVerificationResult.Valid);
    stats.update(SignatureVerificationResult.Invalid);
    stats.update(SignatureVerificationResult.Valid);
    stats.update(SignatureVerificationResult.Invalid);
    assert.strictEqual(stats._countTotal, 5);
    assert.strictEqual(stats._countValid, 3);
    assert.strictEqual(stats._countInvalid, 2);
  });

  it('throws for unknown result', () => {
    const stats = new SignatureVerificationStats();
    assert.throws(() => stats.update('unknown'), {
      message: 'Unknown signature verification result: unknown',
    });
  });

  it('throws for invalid enum value', () => {
    const stats = new SignatureVerificationStats();
    assert.throws(() => stats.update(99 as SignatureVerificationResult), {
      message: 'Unknown signature verification result: 99',
    });
  });

  it('does not throw for valid result', () => {
    const stats = new SignatureVerificationStats();
    stats.update(SignatureVerificationResult.Valid);
    assert.strictEqual(stats._countTotal, 1);
  });
});
