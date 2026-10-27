// src/rateShapingEmitter.ts

import { EventEmitter } from 'events';

enum EventTypes {
  RateLimited = 'rateLimited',
  Delivered = 'delivered',
  Failed = 'failed',
}

/**
 * Event emitter for rate shaping and delivery logs.
 */
export class RateShapingEmitter extends EventEmitter {
  /**
   * Emit rateLimited event with retryAfter and details.
   */
  emitRateLimited(retryAfter: number, details: string): void {
    this.emit(EventTypes.RateLimited, { retryAfter, details });
  }

  /**
   * Emit Delivered event with payload.
   */
  emitDelivered(payload: any): void {
    this.emit(EventTypes.Delivered, payload);
  }

  /**
   * Emit Failed event with error.
   */
  emitFailed(error: Error): void {
    this.emit(EventTypes.Failed, error);
  }
}
