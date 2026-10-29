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
  private readonly capacity: number;
  private readonly refillRate: number; // tokens per second
  private tokens: number;
  private lastRefill: number;
  private log: DeliveryLog[] = [];
  private currentLogIndex = 0;
  private closed = false;
  private timeoutId: ReturnType<typeof setTimeout> | null;

  /**
   * @param capacity - Maximum burst of tokens (e.g., 10)
   * @param refillRate - Tokens replenished per second (e.g., 2)
   */
  constructor(capacity: number, refillRate: number) {
    if (capacity <= 0 || refillRate <= 0) {
      throw new RangeError('capacity and refillRate must be positive');
    }
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = new Date();
  }

  /**
   * Refills tokens based on elapsed time.
   */
  private refill(): void {
    const now = new Date();
    const elapsedSeconds = (now.getTime() - this.lastRefill.getTime()) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSeconds * this.refillRate);
    this.lastRefill = now;
  }

  /**
   * Attempts to consume one token to process an event.
   * @param eventId - Unique identifier for the event
   * @param destination - Delivery target URL or name
   * @returns `true` if token consumed (event allowed), `false` if rate limited
   */
  public tryConsume(eventId: string, destination: string): boolean {
    this.refill();
    const attempt = this.log.filter(l => l.eventId === eventId).length + 1;
    if (this.tokens >= 1) {
      this.tokens -= 1;
      this.log.push({
        id: randomUUID(),
        timestamp: new Date(),
        eventId,
        status: 'queued',
        destination,
        attempt,
      });
      return true;
    }
    this.log.push({
      id: randomUUID(),
      timestamp: new Date(),
      eventId,
      status: 'failed',
      destination,
      attempt,
      error: 'Rate limited',
    });
    return false;
  }

  /**
   * Updates a queued log entry to delivered or failed status.
   * @param logId - The ID of the delivery log entry to update
   * @param status - New status ('delivered' | 'failed' | 'retry')
   * @param error - Optional error message if failed
   * @throws {Error} If logId not found or invalid status transition
   */
  public updateLog(logId: string, status: 'delivered' | 'failed' | 'retry', error?: string): void {
    const entry = this.log.find(l => l.id === logId);
    if (!entry) {
      throw new Error(`Delivery log entry not found: ${logId}`);
    }
    if (entry.status !== 'queued') {
      throw new Error(`Cannot transition from ${entry.status} to ${status}`);
    }
    entry.status = status;
    if (error !== undefined) {
      entry.error = error;
    }
  }

  /**
   * Returns a synchronous generator that iterates over all delivery logs
   * in chronological order. Useful for delivery log reporting or replay.
   */
  public *deliveryLogEntries(): Generator<DeliveryLog> {
    for (const log of this.log) {
      yield log;
    }
  }

  /**
   * Returns a live generator that yields delivery logs as they are added.
   * Continues until `close()` is called.
   */
  public *liveDeliveryLogs(): Generator<DeliveryLog> {
    while (this.currentLogIndex < this.log.length || !this.closed) {
      while (this.currentLogIndex < this.log.length) {
        yield this.log[this.currentLogIndex++];
      }
      if (!this.closed && this.timeoutId === null) {
        this.timeoutId = setTimeout(() => { this.timeoutId = null; }, 10);
        continue;
      }
    }
  }

  /**
   * Closes the live delivery log generator.
   */
  public close(): void {
    this.closed = true;
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }
  }

  /**
   * Current number of tokens available.
   */
  public get tokenCount(): number {
    this.refill();
    return this.tokens;
  }

  /**
   * Number of delivery logs recorded.
   */
  public get logCount(): number {
    return this.log.length;
  }

  /**
   * Clears all delivery logs and resets token bucket to capacity.
   */
  public reset(): void {
    this.log = [];
    this.currentLogIndex = 0;
    this.tokens = this.capacity;
    this.lastRefill = new Date();
    this.closed = false;
    this.timeoutId = null;
  }
}
