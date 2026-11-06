import { IncomingMessage } from 'http';
import { RateCalculator } from './rateCalculator';
import { RateShapingDeliveryLogs } from './rateShapingDeliveryLogs';
import { normalizeStringField } from './utility'; // New import

/**
 * Calculates a score for incoming events based on rate shaping and delivery logs.
 * @param event - The incoming event with string fields normalized.
 * @param eventEmitter - The event emitter instance.
 * @param rateCalculator - The rate calculator instance.
 * @param deliveryLogs - The delivery logs instance.
 * @returns The calculated score.
 */
export function calculateScore(
  event: NormalizedIncomingMessage, // Updated parameter type
  eventEmitter: ReturnType<typeof import('./eventEmitter')['create']>,
  rateCalculator: RateCalculator,
  deliveryLogs: RateShapingDeliveryLogs,
) {
  const { rateLimit, rateLimitRemaining } = rateCalculator.getRateLimit(event);
  const recentDeliveryLogs = deliveryLogs.getRecentDeliveries(event);

  // Calculate score based on rate limit, remaining rate limit, and recent delivery failures.
  const score = (
    (rateLimit === 0 ? 0 : rateLimitRemaining / rateLimit) +
    (recentDeliveryLogs.some((log) => log.failed) ? 0.5 : 0)
  ).toFixed(2);

  return score;
}

/**
 * Normalizes string fields in an incoming message.
 * @param event - The incoming event.
 * @returns The normalized event.
 */
function normalizeEvent(event: IncomingMessage): NormalizedIncomingMessage {
  return {
    ...event,
    headers: Object.fromEntries(
      Object.entries(event.headers).map(([key, value]) => [normalizeStringField(key), normalizeStringField(value)])
    ),
  };
}

/**
 * Ranks incoming events based on their calculated scores.
 * @param events - The list of incoming events with string fields normalized.
 * @param eventEmitter - The event emitter instance.
 * @param rateCalculator - The rate calculator instance.
 * @param deliveryLogs - The delivery logs instance.
 * @returns The ranked list of events.
 */
export function rankEvents(
  events: NormalizedIncomingMessage[], // Updated parameter type
  eventEmitter: ReturnType<typeof import('./eventEmitter')['create']>,
  rateCalculator: RateCalculator,
  deliveryLogs: RateShapingDeliveryLogs,
) {
  return events
    .map((event) => ({ event, score: calculateScore(event, eventEmitter, rateCalculator, deliveryLogs) }))
    .sort((a, b) => b.score - a.score)
    .map(({ event }) => event);
}

/**
 * The shape of an incoming message with normalized string fields.
 */
interface NormalizedIncomingMessage extends IncomingMessage {
  headers: Record<string, string>;
}
