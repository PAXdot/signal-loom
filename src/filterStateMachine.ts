/**
 * The FilterStateMachine manages the state associated with filtering rules.
 */
enum FilterState {
  /**
   * The initial state of the state machine.
   */
  Idle,

  /**
   * The state machine is actively applying filtering rules.
   */
  Filtering,

  /**
   * Filtering rules have been applied and the result has been delivered.
   */
  Filtered,
}

/**
 * Represents the state and logic for filtering rules.
 */
export class FilterStateMachine {
  /**
   * Create a new instance of FilterStateMachine with the initial state.
   */
  public constructor(
    private readonly filterRule: FilterRule,
    private readonly eventEmitter: EventEmitter
  ) {
    this.state = FilterState.Idle;
  }

  /**
   * The current state of the state machine.
   */
  public state: FilterState = FilterState.Idle;

  /**
   * Applies the filtering rules and progresses the state machine.
   *
   * @param payload - The payload to apply the filtering rules to.
   * @returns A promise that resolves with the result of the filtering process.
   */
  public async processPayload(payload: unknown): Promise<unknown> {
    switch (this.state) {
      case FilterState.Idle:
        this.state = FilterState.Filtering;
        return this.applyFilterRule(payload);
      case FilterState.Filtering:
        throw new Error("Already in the process of filtering.");
      case FilterState.Filtered:
        throw new Error("Payload has already been filtered.");
    }
  }

  /**
   * Applies the filter rule to the given payload.
   *
   * @param payload - The payload to apply the filter rule to.
   * @returns The result of the filtering process.
   */
  private async applyFilterRule(payload: unknown): Promise<unknown> {
    const result = await this.filterRule.apply(payload);
    this.state = FilterState.Filtered;
    return result;
  }
}
