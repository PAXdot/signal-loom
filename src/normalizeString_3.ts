/**
 * Normalizes a given string by lowercasing it and removing leading/trailing whitespace.
 *
 * @param {string} str - The input string to normalize.
 * @returns {string} - The normalized string.
 */
export function normalizeString(str: string): string {
  return str.trim().toLowerCase();
}
