import { randomUUID } from 'node:crypto';

/**
 * Represents a single delivery log entry.
 */
export interface DeliveryLog {
  readonly id: string;
  readonly timestamp: Date;
  readonly eventId: string;
  readonly status: 'queued' | 'delivered' | 'failed' | 'retry';
  readonly destination: string;
  readonly attempt: number;
  readonly error?: string;
}

/**
 * Token bucket rate limiter for controlling webhook delivery rate.
 * Yields delivery log entries as events are processed.
 */
export class RateShapingDeliveryLogs {
  // ... (other methods and properties remain the same)

  /**
   * Returns rate shaping statistics such as token consumption rate,
   * delivery rate, and failure rate.
   */
  public getStatistics(): {
    tokensConsumedPerSecond: number;
    deliveriesPerSecond: number;
    failuresPerSecond: number;
  } {
    const now = new Date();
    const logDuration = (now.getTime() - this.log[0].timestamp.getTime()) / 1000;
    let tokensConsumed = 0;
    let deliveries = 0;
    let failures = 0;

    for (const log of this.log) {
      if (log.timestamp.getTime() > now.getTime() - logDuration) {
        tokensConsumed += log.attempt - 1;
        switch (log.status) {
          case 'delivered':
            deliveries++;
            break;
          case 'failed':
            failures++;
            break;
        }
      }
    }

    return {
      tokensConsumedPerSecond: tokensConsumed / logDuration,
      deliveriesPerSecond: deliveries / logDuration,
      failuresPerSecond: failures / logDuration,
    };
  }
}
