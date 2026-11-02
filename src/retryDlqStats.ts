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
}

export function createRetryDlqStats(): RetryDlqStats {
  return {
    totalRetries: 0,
    successfulRetries: 0,
    failedRetries: 0,
    dlqDeliveries: 0,
    dlqDeliveryErrors: 0,
    currentRetryCount: 0,
  };
}

export function recordRetryAttempt(stats: RetryDlqStats): void {
  stats.totalRetries++;
  stats.currentRetryCount++;
}

export function recordRetrySuccess(stats: RetryDlqStats): void {
  stats.successfulRetries++;
  stats.currentRetryCount = 0;
}

export function recordRetryFailure(stats: RetryDlqStats): void {
  stats.failedRetries++;
  stats.currentRetryCount = 0;
}

export function recordDlqDelivery(stats: RetryDlqStats): void {
  stats.dlqDeliveries++;
}

export function recordDlqDeliveryError(stats: RetryDlqStats): void {
  stats.dlqDeliveryErrors++;
}

export function getRetryDlqStatsSummary(stats: RetryDlqStats): string {
  return (
    `Retries: ${stats.totalRetries} total, ` +
    `${stats.successfulRetries} successful, ` +
    `${stats.failedRetries} failed; ` +
    `DLQ: ${stats.dlqDeliveries} deliveries, ` +
    `${stats.dlqDeliveryErrors} errors`
  );
}
