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

  const policy = input as Record<string, unknown>;

  if (!Number.isInteger(policy.maxRetries) || (policy.maxRetries as number) < 0 || (policy.maxRetries as number) > MAX_SAFE_RETRIES) {
    throw new Error(`maxRetries must be an integer between 0 and ${MAX_SAFE_RETRIES}`);
  }

  if (!Number.isFinite(policy.initialDelayMs) || (policy.initialDelayMs as number) < 0 || (policy.initialDelayMs as number) > MAX_SAFE_DELAY_MS) {
    throw new Error(`initialDelayMs must be a finite number between 0 and ${MAX_SAFE_DELAY_MS}`);
  }

  if (!Number.isFinite(policy.maxDelayMs) || (policy.maxDelayMs as number) < 0 || (policy.maxDelayMs as number) > MAX_SAFE_DELAY_MS) {
    throw new Error(`maxDelayMs must be a finite number between 0 and ${MAX_SAFE_DELAY_MS}`);
  }

  if (!Number.isFinite(policy.backoffMultiplier) || (policy.backoffMultiplier as number) <= 1) {
    throw new Error('backoffMultiplier must be a finite number greater than 1');
  }

  if ((policy.maxDelayMs as number) < (policy.initialDelayMs as number)) {
    throw new Error('maxDelayMs must be greater than or equal to initialDelayMs');
  }

  if (policy.deadLetterQueue !== undefined && typeof policy.deadLetterQueue !== 'string') {
    throw new Error('deadLetterQueue must be a string');
  }
}
