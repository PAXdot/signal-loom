import { normalizeString, isSignatureValid } from './helpers.js';

/**
 * Calculates a scoring value for a given signature.
 * The scoring value is a number between 0 and 100, where 100 indicates a perfect match.
 *
 * @param signature - The signature to score.
 * @param expectedSignature - The expected signature.
 * @returns The scoring value.
 */
export function calculateSignatureScore(signature: string, expectedSignature: string): number {
  const similarityRatio = signature.length > 0 && expectedSignature.length > 0
    ? Math.max(
        normalizedSignatureSimilarity(signature, expectedSignature),
        normalizedSignatureSimilarity(expectedSignature, signature),
      )
    : 0;

  const score = similarityRatio * 50 + (isSignatureValid(signature, expectedSignature) ? 50 : 0);

  return Math.min(Math.round(score), 100);
}

/**
 * Calculates the similarity ratio between two normalized signatures.
 *
 * @param s1 - The first normalized signature.
 * @param s2 - The second normalized signature.
 * @returns The similarity ratio.
 */
function normalizedSignatureSimilarity(s1: string, s2: string): number {
  return normalizeString(s1).length / normalizeString(s2).length;
}

// ... other functions and module exports ...

describe('calculateSignatureScore', () => {
  test('returns 100 for identical signatures', () => {
    expect(calculateSignatureScore('expected', 'expected')).toBe(100);
  });

  test('returns 0 for completely different signatures', () => {
    expect(calculateSignatureScore('different', 'expected')).toBe(0);
  });

  test('returns a value between 0 and 100 for similar signatures', () => {
    expect(calculateSignatureScore('expectedSignature', 'expctedSign')).toBeGreaterThan(0);
    expect(calculateSignatureScore('expectedSignature', 'expctedSign')).toBeLessThan(100);
  });

  test('is optimized for performance', () => {
    const start = performance.now();
    const score = calculateSignatureScore('expectedSignature'.repeat(1000), 'expctedSign'.repeat(1000));
    const end = performance.now();
    expect(end - start).toBeLessThan(10); // Adjust the expected time as needed.
  });
});
