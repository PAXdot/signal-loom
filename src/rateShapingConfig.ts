import type { RateLimitConfig } from './rateShaper.js';
import type { DeliveryLogConfig } from './rateShapingDeliveryLogs.js';

/** Fully resolved rate shaping configuration. */
export interface RateShapingConfig {
  /** Rate limiter settings consumed by the shaper. */
  rateLimit: RateLimitConfig;
  /** Delivery log settings consumed by the log sink. */
  deliveryLog: DeliveryLogConfig;
}

/** Raw, possibly partial configuration input. */
export interface RateShapingConfigInput {
  rateLimit?: Partial<RateLimitConfig>;
  deliveryLog?: Partial<DeliveryLogConfig>;
}

/** Raised when configuration cannot be validated or resolved. */
export class RateShapingConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateShapingConfigError';
  }
}

const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxTokens: 100,
  refillRatePerSecond: 10,
  burstWindowMs: 1_000,
};

const DEFAULT_DELIVERY_LOG: DeliveryLogConfig = {
  enabled: true,
  maxEntries: 1_000,
  retentionMs: 24 * 60 * 60 * 1_000,
};

/** Returns a positive finite number or throws a config error. */
function requirePositiveNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new RateShapingConfigError(
      `"${field}" must be a positive finite number, received ${String(value)}`,
    );
  }
  return value;
}

/** Returns a non-negative integer or throws a config error. */
function requireNonNegativeInteger(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new RateShapingConfigError(
      `"${field}" must be a non-negative integer, received ${String(value)}`,
    );
  }
  return value;
}

/** Merges partial overrides onto the default rate limiter settings. */
function resolveRateLimit(input: Partial<RateLimitConfig> | undefined): RateLimitConfig {
  const merged = { ...DEFAULT_RATE_LIMIT, ...(input ?? {}) };
  return {
    maxTokens: requirePositiveNumber(merged.maxTokens, 'rateLimit.maxTokens'),
    refillRatePerSecond: requirePositiveNumber(
      merged.refillRatePerSecond,
      'rateLimit.refillRatePerSecond',
    ),
    burstWindowMs: requirePositiveNumber(merged.burstWindowMs, 'rateLimit.burstWindowMs'),
  };
}

/** Merges partial overrides onto the default delivery log settings. */
function resolveDeliveryLog(
  input: Partial<DeliveryLogConfig> | undefined,
): DeliveryLogConfig {
  const merged = { ...DEFAULT_DELIVERY_LOG, ...(input ?? {}) };
  if (typeof merged.enabled !== 'boolean') {
    throw new RateShapingConfigError(
      `"deliveryLog.enabled" must be a boolean, received ${String(merged.enabled)}`,
    );
  }
  return {
    enabled: merged.enabled,
    maxEntries: requireNonNegativeInteger(merged.maxEntries, 'deliveryLog.maxEntries'),
    retentionMs: requireNonNegativeInteger(merged.retentionMs, 'deliveryLog.retentionMs'),
  };
}

/**
 * Resolves a raw rate shaping configuration input into a validated,
 * fully-populated configuration. Omitted fields fall back to defaults;
 * invalid values raise a {@link RateShapingConfigError}.
 */
export function loadRateShapingConfig(
  input: RateShapingConfigInput = {},
): RateShapingConfig {
  if (typeof input !== 'object' || input === null) {
    throw new RateShapingConfigError('configuration input must be an object');
  }
  return {
    rateLimit: resolveRateLimit(input.rateLimit),
    deliveryLog: resolveDeliveryLog(input.deliveryLog),
  };
}

/**
 * Reads a rate shaping configuration from a plain key/value record, such as
 * parsed environment variables. Values are coerced where numeric fields are
 * expected; unrecognized keys are ignored.
 */
export function loadRateShapingConfigFromRecord(
  record: Record<string, string | undefined>,
): RateShapingConfig {
  const num = (key: string): number | undefined => {
    const raw = record[key];
    if (raw === undefined || raw === '') return undefined;
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) {
      throw new RateShapingConfigError(`"${key}" is not a number: ${raw}`);
    }
    return parsed;
  };

  const bool = (key: string): boolean | undefined => {
    const raw = record[key];
    if (raw === undefined || raw === '') return undefined;
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    throw new RateShapingConfigError(`"${key}" is not a boolean: ${raw}`);
  };

  return loadRateShapingConfig({
    rateLimit: {
      maxTokens: num('RATE_LIMIT_MAX_TOKENS'),
      refillRatePerSecond: num('RATE_LIMIT_REFILL_PER_SECOND'),
      burstWindowMs: num('RATE_LIMIT_BURST_WINDOW_MS'),
    },
    deliveryLog: {
      enabled: bool('DELIVERY_LOG_ENABLED'),
      maxEntries: num('DELIVERY_LOG_MAX_ENTRIES'),
      retentionMs: num('DELIVERY_LOG_RETENTION_MS'),
    },
  });
}
