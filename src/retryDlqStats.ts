/**
 * Tracks and exposes statistics for retry operations and dead-letter queue (DLQ) deliveries.
 * Designed to be used alongside retry backoff and DLQ logic.
 */
export interface RetryDlqStats {
  totalRetries: number;
  successfulRetries: number;
  failedRetries: number;
  dlqDeliveries: number;
  dlqDeliveryErrors: number;
  currentRetryCount: number;
  lastPayload?: string; // Add a new optional field for the last transformed payload
}

export function createRetryDlqStats(): RetryDlqStats {
  return {
    totalRetries: 0,
    successfulRetries: 0,
    failedRetries: 0,
    dlqDeliveries: 0,
    dlqDeliveryErrors: 0,
    currentRetryCount: 0,
    lastPayload: undefined, // Initialize lastPayload as undefined
  };
}

// ... (other functions remain the same)

// Add a new function to update the last payload upon successful transform or DLQ delivery
export function updateLastPayload(stats: RetryDlqStats, payload: string): void {
  stats.lastPayload = payload;
}

export function getRetryDlqStatsSummary(stats: RetryDlqStats): string {
  const lastPayload = stats.lastPayload ? `Last Payload (transformed): ${stats.lastPayload}` : '';
  return (
    `Retries: ${stats.totalRetries} total, ` +
    `${stats.successfulRetries} successful, ` +
    `${stats.failedRetries} failed; ` +
    `DLQ: ${stats.dlqDeliveries} deliveries, ` +
    `${stats.dlqDeliveryErrors} errors\n` +
    `${lastPayload}` // Include the last payload in the summary
  );
}
