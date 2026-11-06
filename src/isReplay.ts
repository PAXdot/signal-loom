/**
 * Checks whether a webhook delivery event is a potential replay attempt.
 * A potential replay is identified by the presence of a `replay-id` header
 * that is a non-empty string after trimming whitespace and special characters.
 *
 * @param headers - Incoming request headers (lowercase keys).
 * @returns `true` if the request is a potential replay, `false` otherwise.
 */
export function isPotentialReplay(headers: Record<string, string | string[] | undefined>): boolean {
  const replayId = headers['replay-id']?.trim()?.replace(/[\s\W_]+/g, '') ?? '';
  return replayId !== '';
}
