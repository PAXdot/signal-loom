// src/rateScoring.ts

import { IncomingMessage } from 'http';
import { RateCalculator } from './rateCalculator';
import { RateShapingDeliveryLogs } from './rateShapingDeliveryLogs';

/**
 * Calculates a score for incoming events based on rate shaping and delivery logs.
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
  const recentDeliveryLogs = deliveryLogs.getRecentDeliveries(event);

  // Calculate score based on rate limit, remaining rate limit, and recent delivery failures.
  // Adjust the calculation as needed to fit your specific requirements.
  const score = (
    (rateLimit === 0 ? 0 : rateLimitRemaining / rateLimit) +
    (recentDeliveryLogs.some((log) => log.failed) ? 0.5 : 0)
  ).toFixed(2);

  return score;
}

/**
 * Ranks incoming events based on their calculated scores.
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
    .sort((a, b) => b.score - a.score)
    .map(({ event }) => event);
}
