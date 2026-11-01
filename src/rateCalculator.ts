/**
 * Calculates the rate (events per second) and throughput (bytes per second)
 * based on incoming events and their payload sizes.
 */
export class RateCalculator {
  private eventCount = 0;
  private byteCount = 0;
  private startTime: number;
  private lastResetTime: number;

  constructor() {
    this.reset();
  }

  /**
   * Resets the calculator's counters and timer.
   */
  reset(): void {
    this.eventCount = 0;
    this.byteCount = 0;
    this.startTime = performance.now();
    this.lastResetTime = this.startTime;
  }

  /**
   * Updates the calculator with the new event and its payload size.
   * @param eventSize - The size of the event's payload in bytes.
   */
  update(eventSize: number): void {
    this.eventCount++;
    this.byteCount += eventSize;

    const now = performance.now();
    if (now - this.lastResetTime > 1000) {
      this.reset();
    }
  }

  /**
   * Calculates and returns the current rate in events per second.
   */
  getEventsPerSecond(): number {
    const elapsedTime = performance.now() - this.startTime;
    return this.eventCount / (elapsedTime / 1000);
  }

  /**
   * Calculates and returns the current throughput in bytes per second.
   */
  getBytesPerSecond(): number {
    const elapsedTime = performance.now() - this.startTime;
    return this.byteCount / (elapsedTime / 1000);
  }
}
