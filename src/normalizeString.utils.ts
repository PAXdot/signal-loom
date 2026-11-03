// src/normalizeString.utils.ts

/**
 * Normalizes a given string by lowercasing it and removing leading/trailing spaces.
 * @param {string} str - The string to normalize.
 * @returns {string} - The normalized string.
 */
export const normalizeString = (str: string): string => {
  return str.toLowerCase().trim();
};
