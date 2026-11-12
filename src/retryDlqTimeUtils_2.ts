import { strict as assert } from 'node:assert';

/**
 * Compute the next retry deadline as a Unix timestamp (milliseconds).
 * `deadline` must be a finite positive number; `now` defaults to Date.now().
 */
export function computeDeadline(
  baseTimestamp: number,
  delayMs: number,
  now: number = Date.now(),
): number {
  assert(
    Number.isFinite(delayMs) && delayMs >= 0,
    `delayMs must be a non-negative finite number, got ${delayMs}`,
  );
  const deadline = baseTimestamp + delayMs;
  return deadline > now ? deadline : now;
}

/**
 * Whether a given timestamp (ms) is before or at the current time.
 */
export function isExpired(timestamp: number, now: number = Date.now()): boolean {
  return timestamp <= now;
}

/**
 * Parse an ISO 8601 string to a Unix timestamp (ms). Returns null on invalid input.
 */
export function parseIsoToMs(iso: string): number | null {
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : null;
}

/**
 * Format a Unix timestamp (ms) to an ISO 8601 string.
 * Throws if the timestamp is not a finite number.
 */
export function formatMsToIso(ms: number): string {
  assert(
    Number.isFinite(ms),
    `ms must be a finite number, got ${ms}`,
  );
  return new Date(ms).toISOString();
}

/**
 * Calculate the exponential backoff interval (ms) for a given attempt (1-based).
 * `baseMs` must be > 0; `maxMs` must be >= `baseMs` and is the ceiling.
 */
export function calculateBackoffMs(
  attempt: number,
  baseMs: number,
  maxMs: number,
): number {
  assert(Number.isInteger(attempt) && attempt >= 1, `attempt must be a positive integer, got ${attempt}`);
  assert(Number.isFinite(baseMs) && baseMs > 0, `baseMs must be a finite positive number, got ${baseMs}`);
  assert(Number.isFinite(maxMs) && maxMs >= baseMs, `maxMs must be a finite number >= baseMs, got ${maxMs}`);

  const exponential = baseMs * Math.pow(2, attempt - 1);
  return Math.min(exponential, maxMs);
}

/**
 * Calculate the next retry timestamp (ms) given the current attempt and configuration.
 */
export function nextRetryTimestamp(
  attempt: number,
  baseMs: number,
  maxMs: number,
  now: number = Date.now(),
): number {
  const interval = calculateBackoffMs(attempt, baseMs, maxMs);
  return now + interval;
}
