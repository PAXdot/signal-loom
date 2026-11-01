/**
 * Normalizes a string for schema guard comparisons by trimming,
 * collapsing internal whitespace, and lowercasing.
 */
export function normalizeString(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Checks whether two strings are equal after normalization.
 */
export function areStringsEqualNormalized(a: string, b: string): boolean {
  return normalizeString(a) === normalizeString(b);
}
