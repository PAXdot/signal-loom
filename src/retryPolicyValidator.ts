/**
 * Validates retry policy configuration for dead-letter queue handling.
 * Ensures all retry-related inputs are well-formed and internally consistent.
 */

export interface RetryPolicyInput {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  deadLetterQueue?: string;
}

const MAX_SAFE_RETRIES = 1000;
const MAX_SAFE_DELAY_MS = 2_147_483_647; // Max 32-bit signed integer, common timeout cap

/**
 * Validates a retry policy object.
 * Throws descriptive errors for invalid configurations.
 */
export function validateRetryPolicy(input: unknown): asserts input is RetryPolicyInput {
  if (typeof input !== 'object' || input === null) {
    throw new Error('Retry policy must be an object');
  }

  const policy = input as RetryPolicyInput;

  if (!Number.isInteger(policy.maxRetries) || policy.maxRetries < 0 || policy.maxRetries > MAX_SAFE_RETRIES) {
    throw new Error(`maxRetries must be an integer between 0 and ${MAX_SAFE_RETRIES}`);
  }

  if (!Number.isFinite(policy.initialDelayMs) || policy.initialDelayMs < 0 || policy.initialDelayMs > MAX_SAFE_DELAY_MS) {
    throw new Error(`initialDelayMs must be a finite number between 0 and ${MAX_SAFE_DELAY_MS}`);
  }

  if (!Number.isFinite(policy.maxDelayMs) || policy.maxDelayMs < 0 || policy.maxDelayMs > MAX_SAFE_DELAY_MS) {
    throw new Error(`maxDelayMs must be a finite number between 0 and ${MAX_SAFE_DELAY_MS}`);
  }

  if (!Number.isFinite(policy.backoffMultiplier) || policy.backoffMultiplier <= 1) {
    throw new Error('backoffMultiplier must be a finite number greater than 1');
  }

  if (policy.maxDelayMs < policy.initialDelayMs) {
    throw new Error('maxDelayMs must be greater than or equal to initialDelayMs');
  }

  if (policy.deadLetterQueue !== undefined && typeof policy.deadLetterQueue !== 'string') {
    throw new Error('deadLetterQueue must be a string');
  }
}

/**
 * Serializes a retry policy object into a JSON-compatible string.
 * Handles optional fields and ensures all values are serializable.
 */
export function serializePolicy(policy: RetryPolicyInput): string {
  const serializedPolicy: Record<string, unknown> = {
    maxRetries: policy.maxRetries,
    initialDelayMs: policy.initialDelayMs,
    maxDelayMs: policy.maxDelayMs,
    backoffMultiplier: policy.backoffMultiplier,
  };

  if (policy.deadLetterQueue !== undefined) {
    serializedPolicy.deadLetterQueue = policy.deadLetterQueue;
  }

  return JSON.stringify(serializedPolicy);
}
