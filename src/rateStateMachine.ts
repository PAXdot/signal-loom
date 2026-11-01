/**
 * RateState represents the different states in the rate shaping state machine.
 */
enum RateState {
  /**
   * Initial state, ready to process events.
   */
  IDLE,

  /**
   * Currently processing an event.
   */
  PROCESSING,

  /**
   * Rate limit exceeded, cannot process any more events until timeout ends.
   */
  LIMIT_EXCEEDED,

  /**
   * No events can be processed until the cooldown period ends.
   */
  COOLED_DOWN,
}

/**
 * RateStateMachine manages the state and transitions of the rate shaping process.
 */
export class RateStateMachine {
  private state = RateState.IDLE;
  private timeoutId?: number;
  private lastActiveTime = 0;

  /**
   * Start processing an event. If the rate limit is exceeded, triggers the cooldown period.
   * If cooldown period has not ended, returns false; otherwise, transitions to PROCESSING state.
   */
  public startProcessingEvent = (): boolean => {
    if (this.state !== RateState.IDLE || this.state === RateState.COOLED_DOWN) {
      return false;
    }

    this.state = RateState.PROCESSING;

    // Simulate processing event (replace with actual processing logic)
    const processingTime = Math.floor(Math.random() * 1000);

    setTimeout(() => {
      this.state = RateState.IDLE;
      this.lastActiveTime = Date.now();
    }, processingTime);

    return true;
  };

  /**
   * Process an event immediately without waiting for processing to complete.
   * Returns false if the rate limit is exceeded, true otherwise.
   */
  public processEventImmediately = (): boolean => {
    return this.state === RateState.IDLE;
  };

  /**
   * Check if the cooldown period has ended.
   * If it has, transitions to IDLE state and clears the timeout.
   */
  private checkCooldown = () => {
    if (this.state === RateState.COOLED_DOWN) {
      const timePassed = Date.now() - this.lastActiveTime;
      if (timePassed >= 5000) { // replace with actual cooldown time
        this.state = RateState.IDLE;
        clearTimeout(this.timeoutId);
      }
    }
  };

  /**
   * Transition to LIMIT_EXCEEDED state and set a timeout to transition to COOLED_DOWN state.
   */
  public triggerRateLimit = () => {
    this.state = RateState.LIMIT_EXCEEDED;
    this.timeoutId = setTimeout(() => {
      this.state = RateState.COOLED_DOWN;
      this.checkCooldown();
    }, 1000); // replace with actual rate limit reset time
  };
}
