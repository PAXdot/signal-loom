/**
 * Date/time utilities for filtering rules.
 * Provides parsing, comparison, and creation of date/time values.
 * All functions work in UTC to ensure consistency.
 */

/**
 * Parses a date/time string into a Date object.
 * Supports ISO 8601, Unix timestamps (milliseconds and seconds),
 * and common date formats: YYYY-MM-DD, YYYY-MM-DD HH:mm:ss.
 * Returns null for invalid strings.
 *
 * @param value - The date/time string to parse.
 * @returns A Date object or null if parsing fails.
 */
export function parseDateTime(value: string): Date | null {
  if (typeof value !== 'string') return null;

  // Trim whitespace
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;

  // Try ISO 8601 parse (native)
  const isoDate = new Date(trimmed);
  if (!Number.isNaN(isoDate.getTime())) return isoDate;

  // Try Unix timestamp (milliseconds or seconds)
  const timestamp = Number(trimmed);
  if (!Number.isNaN(timestamp) && Number.isFinite(timestamp)) {
    // Assume milliseconds if > 1e12, otherwise seconds
    const ms = timestamp > 1e12 ? timestamp : timestamp * 1000;
    const tsDate = new Date(ms);
    if (!Number.isNaN(tsDate.getTime())) return tsDate;
  }

  // Try YYYY-MM-DD
  const dateOnlyMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  }

  // Try YYYY-MM-DD HH:mm:ss
  const dateTimeMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
  if (dateTimeMatch) {
    const [, year, month, day, hours, minutes, seconds] = dateTimeMatch;
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`);
  }

  return null;
}

/**
 * Formats a Date object as an ISO 8601 string (UTC).
 * Returns null if the date is invalid.
 *
 * @param date - The date to format.
 * @returns ISO 8601 string or null.
 */
export function formatDateTime(date: Date): string | null {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

/**
 * Returns the current date/time as an ISO 8601 string (UTC).
 */
export function now(): string {
  return new Date().toISOString();
}

/**
 * Returns the current date/time as a Unix timestamp in milliseconds.
 */
export function nowTimestamp(): number {
  return Date.now();
}

/**
 * Converts a Date or string to a Unix timestamp in milliseconds.
 * Returns -1 for invalid input.
 */
export function toTimestamp(value: Date | string): number {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return -1;
    return value.getTime();
  }
  const parsed = parseDateTime(value);
  return parsed ? parsed.getTime() : -1;
}

/**
 * Checks if a date/time string is within a given range (inclusive).
 * Returns false if any input is invalid.
 *
 * @param value - The date/time string to check.
 * @param start - The start of the range (inclusive).
 * @param end - The end of the range (inclusive).
 * @returns Whether the value is within the range.
 */
export function isWithinRange(value: string, start: string, end: string): boolean {
  const valueDate = parseDateTime(value);
  const startDate = parseDateTime(start);
  const endDate = parseDateTime(end);

  if (!valueDate || !startDate || !endDate) return false;

  const valueTime = valueDate.getTime();
  return valueTime >= startDate.getTime() && valueTime <= endDate.getTime();
}

/**
 * Checks if a date/time string is after a given reference time.
 * Returns false if any input is invalid.
 *
 * @param value - The date/time string to check.
 * @param reference - The reference date/time string.
 * @returns Whether the value is strictly after the reference.
 */
export function isAfter(value: string, reference: string): boolean {
  const valueDate = parseDateTime(value);
  const refDate = parseDateTime(reference);
  if (!valueDate || !refDate) return false;
  return valueDate.getTime() > refDate.getTime();
}

/**
 * Checks if a date/time string is before a given reference time.
 * Returns false if any input is invalid.
 *
 * @param value - The date/time string to check.
 * @param reference - The reference date/time string.
 * @returns Whether the value is strictly before the reference.
 */
export function isBefore(value: string, reference: string): boolean {
  const valueDate = parseDateTime(value);
  const refDate = parseDateTime(reference);
  if (!valueDate || !refDate) return false;
  return valueDate.getTime() < refDate.getTime();
}

/**
 * Adds a duration to a date/time string and returns the result as an ISO 8601 string (UTC).
 * Duration is specified in milliseconds.
 * Returns null if the input is invalid.
 *
 * @param value - The base date/time string.
 * @param durationMs - The duration to add in milliseconds (can be negative).
 * @returns The resulting date/time string or null.
 */
export function addDuration(value: string, durationMs: number): string | null {
  const date = parseDateTime(value);
  if (!date) return null;
  if (!Number.isFinite(durationMs)) return null;
  return new Date(date.getTime() + durationMs).toISOString();
}

/**
 * Calculates the difference in milliseconds between two date/time strings.
 * Returns NaN if either string is invalid.
 *
 * @param a - The first date/time string.
 * @param b - The second date/time string.
 * @returns The difference in milliseconds (a - b).
 */
export function diffMilliseconds(a: string, b: string): number {
  const dateA = parseDateTime(a);
  const dateB = parseDateTime(b);
  if (!dateA || !dateB) return NaN;
  return dateA.getTime() - dateB.getTime();
}

/**
 * Calculates the difference in seconds between two date/time strings.
 * Returns NaN if either string is invalid.
 *
 * @param a - The first date/time string.
 * @param b - The second date/time string.
 * @returns The difference in seconds (a - b), rounded down.
 */
export function diffSeconds(a: string, b: string): number {
  const diffMs = diffMilliseconds(a, b);
  if (Number.isNaN(diffMs)) return NaN;
  return Math.floor(diffMs / 1000);
}
