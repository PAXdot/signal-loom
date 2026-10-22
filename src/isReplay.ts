/**
 * Checks whether a webhook delivery event is a replay attempt.
 * A replay is identified by the presence of a `replay-id` header
 * with a truthy string value, as per common webhook provider conventions.
 *
 * @param headers - Incoming request headers (lowercase keys).
 * @returns `true` if the request is a replay.
 */
export function isReplay(headers: Record<string, string | string[] | undefined>): boolean {
  const replayId = headers['replay-id'];
  return typeof replayId === 'string' && replayId.length > 0;
}
