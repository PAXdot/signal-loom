import { RetryDlq, RetryDlqSerializer } from './retryDlqSerializer.js';

/**
 * Statistics for retry dead-letter queues.
 */
export interface RetryDlqStats {
  totalEvents: number;
  totalRetries: number;
  maxRetries: number;
  maxRetriesInRow: number;
  lastRetrySuccess: Date | null;
}

/**
 * Calculates and updates statistics for a given retry dead-letter queue.
 * @param serializers - The serializers for deserializing the retry DLQ events.
 * @param dlq - The retry dead-letter queue to calculate statistics for.
 * @returns The updated retry dead-letter queue statistics.
 */
export function calculateRetryDlqStats(
  serializers: RetryDlqSerializer[],
  dlq: RetryDlq
): RetryDlqStats {
  const stats: RetryDlqStats = {
    totalEvents: dlq.events.length,
    totalRetries: dlq.totalRetries,
    maxRetries: dlq.maxRetries,
    maxRetriesInRow: dlq.maxRetriesInRow,
    lastRetrySuccess: dlq.lastRetrySuccess,
  };

  return stats;
}
