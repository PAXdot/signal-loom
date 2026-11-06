// src/rateScoring.ts

import { IncomingMessage } from 'http';
import { RateCalculator } from './rateCalculator';
import { RateShapingDeliveryLogs } from './rateShapingDeliveryLogs';

/**
 * Calculates a score for incoming events based on rate shaping and delivery logs.
 * The score is a value between 0 and 1, with higher values indicating better prospects for delivery.
 * @param event - The incoming event.
 * @param eventEmitter - The event emitter instance.
 * @param rateCalculator - The rate calculator instance.
 * @param deliveryLogs - The delivery logs instance.
 * @returns The calculated score.
 */
export function calculateScore(
  event: IncomingMessage,
  eventEmitter: ReturnType<typeof import('./eventEmitter')['create']>,
  rateCalculator: RateCalculator,
  deliveryLogs: RateShapingDeliveryLogs,
) {
  const { rateLimit, rateLimitRemaining } = rateCalculator.getRateLimit(event);
  const recentDeliveryLog = deliveryLogs.getMostRecentDelivery(event);

  if (rateLimit === 0 || recentDeliveryLog?.failed) {
    // If rate limit is exhausted or most recent delivery failed, score is significantly reduced.
    return 0.1;
  }

  // Calculate score based on rate limit usage and recent delivery failures (if any).
  const score = (rateLimitRemaining / rateLimit) * 0.8 +
               (recentDeliveryLog?.failed ? 0.2 : 0);

  return parseFloat(score.toFixed(2));
}

/**
 * Ranks incoming events based on their calculated scores in descending order.
 * @param events - The list of incoming events.
 * @param eventEmitter - The event emitter instance.
 * @param rateCalculator - The rate calculator instance.
 * @param deliveryLogs - The delivery logs instance.
 * @returns The ranked list of events.
 */
export function rankEvents(
  events: IncomingMessage[],
  eventEmitter: ReturnType<typeof import('./eventEmitter')['create']>,
  rateCalculator: RateCalculator,
  deliveryLogs: RateShapingDeliveryLogs,
) {
  return events
    .map((event) => ({ event, score: calculateScore(event, eventEmitter, rateCalculator, deliveryLogs) }))
    .sort((a, b) => b.score - a.score) // Sort by score in descending order
    .map(({ event }) => event);
}
