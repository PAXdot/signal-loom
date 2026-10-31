/**
 * The FilterStateMachine manages the state associated with filtering rules and rate shaping.
 */
enum FilterState {
  /**
   * The initial state of the state machine.
   */
  Idle,

  /**
   * The state machine is actively applying filtering rules or rate shaping.
   */
  Processing,

  /**
   * Filtering rules or rate shaping have been applied and the result has been delivered.
   */
  Processed,
}

/**
 * Represents the state and logic for filtering rules and rate shaping.
 */
export class FilterStateMachine {
  /**
   * Create a new instance of FilterStateMachine with the initial state.
   * @param filterRule - The filtering rule to apply.
   * @param rateLimiter - The rate limiter for rate shaping.
   * @param eventEmitter - The event emitter for delivery logs.
   */
  public constructor(
    private readonly filterRule: FilterRule,
    private readonly rateLimiter: RateLimiter,
    private readonly eventEmitter: EventEmitter
  ) {
    this.state = FilterState.Idle;
  }

  /**
   * The current state of the state machine.
   */
  public state: FilterState = FilterState.Idle;

  /**
   * Applies the filtering rules and rate shaping, then progresses the state machine.
   *
   * @param payload - The payload to apply the filtering rules and rate shaping to.
   * @returns A promise that resolves with the result of the processing.
   */
  public async processPayload(payload: unknown): Promise<unknown> {
    if (this.state !== FilterState.Idle) {
      throw new Error("Already in the process of filtering or rate shaping.");
    }

    this.state = FilterState.Processing;

    try {
      const shapedPayload = await this.rateLimiter.shape(payload);
      const result = await this.applyFilterRule(shapedPayload);
      this.state = FilterState.Processed;
      this.eventEmitter.emit('deliveryLog', { payload: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      this.state = FilterState.Idle;
      throw error;
    }
  }

  /**
   * Applies the filter rule to the given payload.
   *
   * @param payload - The payload to apply the filter rule to.
   * @returns The result of the filtering process.
   */
  private async applyFilterRule(payload: unknown): Promise<unknown> {
    return await this.filterRule.apply(payload);
  }
}
