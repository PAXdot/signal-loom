/**
 * Checks whether a webhook delivery event is a potential replay attempt.
 * A potential replay is identified by the presence of a `replay-id` header
 * with a non-empty string value, which may include whitespace or special characters,
 * as per common webhook provider conventions. For absolute certainty, the replay-id
 * should be trimmed and non-empty.
 *
 * @param headers - Incoming request headers (lowercase keys).
 * @returns `true` if the request is a potential replay.
 */
export function isPotentialReplay(headers: Record<string, string | string[] | undefined>): boolean {
  const replayId = headers['replay-id']?.trim();
  return typeof replayId === 'string' && replayId.length > 0;
}
