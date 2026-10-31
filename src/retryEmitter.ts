/**
 * Configuration for retries and dead-letter queues.
 */
type RetryConfig = {
  maxRetries: number;
  retryInterval: number;
  deadLetterQueue: (event: unknown) => void;
};

/**
 * Emits events with retries and dead-letter queue handling.
 */
class RetryEmitter {
  private config: RetryConfig;
  private retries: number = 0;

  constructor(config: RetryConfig) {
    this.config = config;
  }

  /**
   * Emits an event with retry logic and dead-letter queue handling.
   *
   * @param event - The event to emit.
   */
  public async emit(event: unknown): Promise<void> {
    try {
      this.emitEvent(event);
      this.resetRetries();
    } catch (err) {
      if (this.retries >= this.config.maxRetries) {
        this.config.deadLetterQueue(event);
      } else {
        this(retries + 1) => await this.emit(event);
        setTimeout(this.config.retryInterval);
      }
    }
  }

  private resetRetries() {
    this.retries = 0;
  }

  private emitEvent(event: unknown) {
    // Logic to emit the event
  }
}

export default RetryEmitter;
