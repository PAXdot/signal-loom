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
