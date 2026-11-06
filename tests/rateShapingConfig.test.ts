import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadRateShapingConfig,
  loadRateShapingConfigFromRecord,
  RateShapingConfigError,
} from '../src/rateShapingConfig.js';

describe('loadRateShapingConfig', () => {
  it('returns defaults when called with no arguments', () => {
    const config = loadRateShapingConfig();
    assert.equal(config.rateLimit.maxTokens, 100);
    assert.equal(config.rateLimit.refillRatePerSecond, 10);
    assert.equal(config.rateLimit.burstWindowMs, 1_000);
    assert.equal(config.deliveryLog.enabled, true);
    assert.equal(config.deliveryLog.maxEntries, 1_000);
    assert.equal(config.deliveryLog.retentionMs, 86_400_000);
  });

  it('returns defaults when called with empty object', () => {
    const config = loadRateShapingConfig({});
    assert.equal(config.rateLimit.maxTokens, 100);
    assert.equal(config.deliveryLog.enabled, true);
  });

  it('merges partial rate limit overrides', () => {
    const config = loadRateShapingConfig({ rateLimit: { maxTokens: 50 } });
    assert.equal(config.rateLimit.maxTokens, 50);
    assert.equal(config.rateLimit.refillRatePerSecond, 10);
  });

  it('merges partial delivery log overrides', () => {
    const config = loadRateShapingConfig({ deliveryLog: { enabled: false } });
    assert.equal(config.deliveryLog.enabled, false);
    assert.equal(config.deliveryLog.maxEntries, 1_000);
  });

  it('throws for null input', () => {
    assert.throws(
      () => loadRateShapingConfig(null as any),
      RateShapingConfigError,
    );
  });

  it('throws for non-object input', () => {
    assert.throws(
      () => loadRateShapingConfig('foo' as any),
      RateShapingConfigError,
    );
  });

  describe('rateLimit validation', () => {
    it('throws for non-positive maxTokens', () => {
      assert.throws(
        () => loadRateShapingConfig({ rateLimit: { maxTokens: 0 } }),
        RateShapingConfigError,
      );
    });

    it('throws for negative maxTokens', () => {
      assert.throws(
        () => loadRateShapingConfig({ rateLimit: { maxTokens: -1 } }),
        RateShapingConfigError,
      );
    });

    it('throws for non-finite refillRatePerSecond', () => {
      assert.throws(
        () => loadRateShapingConfig({ rateLimit: { refillRatePerSecond: Infinity } }),
        RateShapingConfigError,
      );
    });

    it('throws for NaN burstWindowMs', () => {
      assert.throws(
        () => loadRateShapingConfig({ rateLimit: { burstWindowMs: NaN } }),
        RateShapingConfigError,
      );
    });

    it('throws for non-number type', () => {
      assert.throws(
        () => loadRateShapingConfig({ rateLimit: { maxTokens: 'abc' as any } }),
        RateShapingConfigError,
      );
    });
  });

  describe('deliveryLog validation', () => {
    it('throws for non-boolean enabled', () => {
      assert.throws(
        () => loadRateShapingConfig({ deliveryLog: { enabled: 1 as any } }),
        RateShapingConfigError,
      );
    });

    it('throws for negative maxEntries', () => {
      assert.throws(
        () => loadRateShapingConfig({ deliveryLog: { maxEntries: -5 } }),
        RateShapingConfigError,
      );
    });

    it('throws for non-integer maxEntries', () => {
      assert.throws(
        () => loadRateShapingConfig({ deliveryLog: { maxEntries: 1.5 } }),
        RateShapingConfigError,
      );
    });

    it('throws for negative retentionMs', () => {
      assert.throws(
        () => loadRateShapingConfig({ deliveryLog: { retentionMs: -100 } }),
        RateShapingConfigError,
      );
    });
  });
});

describe('loadRateShapingConfigFromRecord', () => {
  it('uses defaults when record is empty', () => {
    const config = loadRateShapingConfigFromRecord({});
    assert.equal(config.rateLimit.maxTokens, 100);
    assert.equal(config.deliveryLog.enabled, true);
  });

  it('reads numeric values from string record', () => {
    const config = loadRateShapingConfigFromRecord({
      RATE_LIMIT_MAX_TOKENS: '200',
      RATE_LIMIT_REFILL_PER_SECOND: '20',
      RATE_LIMIT_BURST_WINDOW_MS: '500',
      DELIVERY_LOG_MAX_ENTRIES: '500',
      DELIVERY_LOG_RETENTION_MS: '3600000',
    });
    assert.equal(config.rateLimit.maxTokens, 200);
    assert.equal(config.rateLimit.refillRatePerSecond, 20);
    assert.equal(config.rateLimit.burstWindowMs, 500);
    assert.equal(config.deliveryLog.maxEntries, 500);
    assert.equal(config.deliveryLog.retentionMs, 3_600_000);
  });

  it('reads boolean values', () => {
    const config = loadRateShapingConfigFromRecord({
      DELIVERY_LOG_ENABLED: 'false',
    });
    assert.equal(config.deliveryLog.enabled, false);
  });

  it('treats empty string as undefined and uses default', () => {
    const config = loadRateShapingConfigFromRecord({
      RATE_LIMIT_MAX_TOKENS: '',
      DELIVERY_LOG_ENABLED: '',
    });
    assert.equal(config.rateLimit.maxTokens, 100);
    assert.equal(config.deliveryLog.enabled, true);
  });

  it('throws for non-numeric value in numeric field', () => {
    assert.throws(
      () =>
        loadRateShapingConfigFromRecord({
          RATE_LIMIT_MAX_TOKENS: 'not-a-number',
        }),
      RateShapingConfigError,
    );
  });

  it('throws for non-boolean value in boolean field', () => {
    assert.throws(
      () =>
        loadRateShapingConfigFromRecord({
          DELIVERY_LOG_ENABLED: 'yes',
        }),
      RateShapingConfigError,
    );
  });

  it('ignores unrecognized keys', () => {
    const config = loadRateShapingConfigFromRecord({
      UNKNOWN_KEY: '100',
      RATE_LIMIT_MAX_TOKENS: '50',
    });
    assert.equal(config.rateLimit.maxTokens, 50);
  });
});
