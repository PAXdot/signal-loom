import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  type RetryDlqEvent,
  formatRetryEvent,
  formatDlqEntry,
  formatRetryStats,
} from '../src/retryDlqFormatter.js';

void describe('formatRetryEvent', () => {
  void it('formats a retry event without DLQ reason', () => {
    const event: RetryDlqEvent = {
      attempt: 2,
      maxAttempts: 5,
      elapsedTimeMs: 1200,
    };
    const result = formatRetryEvent(event);
    assert.strictEqual(result, '🔄 Attempt 2 of 5 - Retrying after 1200ms');
  });

  void it('includes payloadId when provided', () => {
    const event: RetryDlqEvent = {
      attempt: 1,
      maxAttempts: 3,
      elapsedTimeMs: 500,
      payloadId: 'abc-123',
    };
    const result = formatRetryEvent(event);
    assert.strictEqual(result, '🔄 Attempt 1 of 3 - Retrying after 500ms (ID: abc-123)');
  });

  void it('formats a DLQ event', () => {
    const event: RetryDlqEvent = {
      attempt: 5,
      maxAttempts: 5,
      elapsedTimeMs: 10000,
      dlqReason: 'Max retries exceeded',
    };
    const result = formatRetryEvent(event);
    assert.strictEqual(result, '⚠️ Attempt 5 of 5 - Failed after 10000ms (DLQ: Max retries exceeded)');
  });

  void it('includes payloadId in DLQ event', () => {
    const event: RetryDlqEvent = {
      attempt: 3,
      maxAttempts: 3,
      elapsedTimeMs: 5000,
      dlqReason: 'Schema validation failed',
      payloadId: 'xyz-789',
    };
    const result = formatRetryEvent(event);
    assert.strictEqual(result, '⚠️ Attempt 3 of 3 - Failed after 5000ms (DLQ: Schema validation failed) (ID: xyz-789)');
  });

  void it('handles zero elapsed time', () => {
    const event: RetryDlqEvent = {
      attempt: 1,
      maxAttempts: 1,
      elapsedTimeMs: 0,
    };
    const result = formatRetryEvent(event);
    assert.strictEqual(result, '🔄 Attempt 1 of 1 - Retrying after 0ms');
  });
});

void describe('formatDlqEntry', () => {
  void it('formats a basic DLQ entry', () => {
    const firstAttempt = new Date('2024-01-01T00:00:00Z');
    const lastAttempt = new Date('2024-01-01T01:00:00Z');
    const result = formatDlqEntry(
      'webhook.received',
      'msg-001',
      5,
      firstAttempt,
      lastAttempt,
      'Delivery failed after 5 attempts',
    );
    assert.strictEqual(
      result,
      '📦 DLQ Entry [webhook.received] [msg-001]\n'
        + '  Attempts: 5\n'
        + '  Duration: 3600s\n'
        + '  Reason: Delivery failed after 5 attempts\n'
        + `  First Attempt: ${firstAttempt.toISOString()}\n`
        + `  Last Attempt: ${lastAttempt.toISOString()}`,
    );
  });

  void it('includes original error when provided', () => {
    const firstAttempt = new Date('2024-06-15T12:00:00Z');
    const lastAttempt = new Date('2024-06-15T12:00:30Z');
    const error = new Error('Connection refused');
    const result = formatDlqEntry(
      'payment.processed',
      'pmt-456',
      3,
      firstAttempt,
      lastAttempt,
      'Unrecoverable error',
      error,
    );
    assert.ok(result.includes('  Error: Error: Connection refused'));
  });

  void it('handles non-Error original error values', () => {
    const firstAttempt = new Date('2024-01-01T00:00:00Z');
    const lastAttempt = new Date('2024-01-01T00:00:10Z');
    const result = formatDlqEntry(
      'test.event',
      't-999',
      1,
      firstAttempt,
      lastAttempt,
      'Manual intervention',
      'timeout',
    );
    assert.ok(result.includes('  Error: timeout'));
  });

  void it('rounds duration to seconds', () => {
    const firstAttempt = new Date('2024-01-01T00:00:00.500Z');
    const lastAttempt = new Date('2024-01-01T00:01:30.250Z');
    const result = formatDlqEntry('a', 'b', 2, firstAttempt, lastAttempt, 'reason');
    assert.ok(result.includes('  Duration: 90s'));
  });
});

void describe('formatRetryStats', () => {
  void it('formats retry statistics', () => {
    const result = formatRetryStats(100, 20, 80, 5, 1500);
    assert.strictEqual(
      result,
      '📊 Retry Statistics\n'
        + '  Total Attempts: 100\n'
        + '  Total Failed: 20\n'
        + '  Total Success: 80\n'
        + '  DLQ Entries: 5\n'
        + '  Avg Retry Delay: 1500ms',
    );
  });

  void it('handles zero values', () => {
    const result = formatRetryStats(0, 0, 0, 0, 0);
    assert.strictEqual(
      result,
      '📊 Retry Statistics\n'
        + '  Total Attempts: 0\n'
        + '  Total Failed: 0\n'
        + '  Total Success: 0\n'
        + '  DLQ Entries: 0\n'
        + '  Avg Retry Delay: 0ms',
    );
  });
});
