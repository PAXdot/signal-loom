/**
 * Time and date utilities for retry and dead-letter queue operations.
 * Provides helpers for calculating retry windows, DLQ expiry, and
 * formatting ISO timestamps for delivery logs.
 */

/**
 * Calculates the absolute deadline for a retry attempt based on the
 * initial attempt time and the total backoff duration.
 *
 * @param initialAttemptTime - The timestamp when the original delivery was attempted.
 * @param totalBackoffMs - The cumulative backoff delay in milliseconds before the retry.
 * @returns The Date representing when the retry should be attempted.
 */
export function calculateRetryDeadline(
  initialAttemptTime: Date,
  totalBackoffMs: number,
): Date {
  return new Date(initialAttemptTime.getTime() + totalBackoffMs);
}

/**
 * Determines whether a retry deadline has passed.
 *
 * @param deadline - The retry deadline to check.
 * @param now - The current time (defaults to `Date.now()`).
 * @returns `true` if the deadline is in the past, otherwise `false`.
 */
export function isRetryDeadlinePassed(
  deadline: Date,
  now: number = Date.now(),
): boolean {
  return deadline.getTime() <= now;
}

/**
 * Calculates the remaining time in milliseconds until a retry deadline.
 * Returns `0` if the deadline has already passed.
 *
 * @param deadline - The retry deadline.
 * @param now - The current time (defaults to `Date.now()`).
 * @returns The remaining milliseconds (non-negative), or `0` if expired.
 */
export function getRemainingRetryTime(
  deadline: Date,
  now: number = Date.now(),
): number {
  const remaining = deadline.getTime() - now;
  return remaining > 0 ? remaining : 0;
}

/**
 * Calculates the expiry timestamp for a dead-letter queue entry.
 *
 * @param enqueuedAt - The time the message was placed in the DLQ.
 * @param retentionMs - The retention period in milliseconds.
 * @returns The expiry Date.
 */
export function calculateDlqExpiry(
  enqueuedAt: Date,
  retentionMs: number,
): Date {
  return new Date(enqueuedAt.getTime() + retentionMs);
}

/**
 * Checks whether a DLQ entry has expired based on its expiry timestamp.
 *
 * @param expiry - The expiry timestamp of the DLQ entry.
 * @param now - The current time (defaults to `Date.now()`).
 * @returns `true` if the entry has expired, otherwise `false`.
 */
export function isDlqEntryExpired(
  expiry: Date,
  now: number = Date.now(),
): boolean {
  return expiry.getTime() <= now;
}

/**
 * Formats a Date object into an ISO 8601 string with millisecond precision,
 * suitable for delivery logs and audit trails.
 *
 * @param date - The date to format.
 * @returns The ISO string (e.g., `2025-01-01T12:00:00.000Z`).
 */
export function formatIsoTimestamp(date: Date): string {
  return date.toISOString();
}

/**
 * Parses an ISO 8601 timestamp string into a Date object.
 * Throws an error if the input is not a valid ISO timestamp.
 *
 * @param isoString - The ISO string to parse.
 * @returns The parsed Date.
 * @throws {Error} If the string is not a valid date.
 */
export function parseIsoTimestamp(isoString: string): Date {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ISO timestamp: ${isoString}`);
  }
  return date;
}

/**
 * Adds a specified number of milliseconds to a base time.
 *
 * @param baseTime - The base time as a Date or timestamp.
 * @param durationMs - The duration to add in milliseconds.
 * @returns The new Date.
 */
export function addDuration(
  baseTime: Date | number,
  durationMs: number,
): Date {
  const baseMs = baseTime instanceof Date ? baseTime.getTime() : baseTime;
  return new Date(baseMs + durationMs);
}

/**
 * Subtracts a specified number of milliseconds from a base time.
 *
 * @param baseTime - The base time as a Date or timestamp.
 * @param durationMs - The duration to subtract in milliseconds.
 * @returns The new Date.
 */
export function subtractDuration(
  baseTime: Date | number,
  durationMs: number,
): Date {
  const baseMs = baseTime instanceof Date ? baseTime.getTime() : baseTime;
  return new Date(baseMs - durationMs);
}
