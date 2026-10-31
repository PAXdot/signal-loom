// src/retryBackoff.ts

import { EventEmitter } from 'events';

/** Options for backoff strategy. */
type BackoffOptions = {
  maxAttempts?: number;
  initialDelay?: number;
  delayIncrease?: number;
  randomFactor?: number;
  maxDelay?: number;
};

/** Emits an event with delay and retries if necessary. */
class RetryBackoffEmitter extends EventEmitter {
  private options: Required<BackoffOptions>;
  private attemptCount = 0;

  constructor(options: BackoffOptions = {}) {
    super();
    this.options = {
      maxAttempts: 5,
      initialDelay: 1000,
      delayIncrease: 2000,
      randomFactor: 0.5,
      maxDelay: 60000,
      ...options,
    };
  }

  private getDelay(): number {
    const { attemptCount, options } = this;
    const baseDelay = options.initialDelay + (attemptCount - 1) * options.delayIncrease;
    const randomDelay = baseDelay * options.randomFactor;
    return Math.min(baseDelay + randomDelay, options.maxDelay);
  }

  /** Emit an event with retry and backoff strategy. */
  public emitWithRetry(event: string, ...args: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.emit(event, ...args, (err?: Error) => {
        if (err) {
          this.attemptCount++;
          if (this.attemptCount <= this.options.maxAttempts) {
            setTimeout(() => {
              this.emitWithRetry(event, ...args)
                .then(resolve)
                .catch(reject);
            }, this.getDelay());
          } else {
            reject(err);
          }
        } else {
          resolve();
        }
      });
    });
  }

  /** Reset the number of attempts. */
  public resetAttemptCount(): void {
    this.attemptCount = 0;
  }
}

export default RetryBackoffEmitter;
