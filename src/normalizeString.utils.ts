import { toLower } from 'lodash-es';

/**
 * Normalizes a given string by using lodash's toLower for consistent
 * case conversion, removing leading/trailing spaces, and trims empty strings.
 * Throws an error if the input is not a string.
 *
 * @param {string} str - The string to normalize.
 * @throws {Error} When input is not a string.
 * @returns {string} The normalized string.
 */
export const normalizeString = (str: string): string => {
  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
  }
  return toLower(str.trim());
};
