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
      normalizeString(signature).length / normalizeString(expectedSignature).length,
      normalizeString(expectedSignature).length / normalizeString(signature).length,
    )
    : 0;

  const score = similarityRatio * 50 + (isSignatureValid(signature, expectedSignature) ? 50 : 0);

  return Math.min(Math.round(score), 100);
}

// ... other functions and module exports ...

/**
 * Tests the calculateSignatureScore function.
 */
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
});
