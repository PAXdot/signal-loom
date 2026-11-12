/**
 * Calculates the rate and throughput based on given events and time window.
 */
export class RateCalculator {
  private readonly startTime: number;
  private eventCount = 0;
  private totalBytes = 0;

  constructor(private windowSeconds = 60) {
    this.startTime = Date.now();
  }

  /**
   * Increment the event count and total bytes for an event with the given size.
   * @param size - Size of the event in bytes.
   */
  public increment(size: number): void {
    this.eventCount++;
    this.totalBytes += size;
  }

  /**
   * Get the current rate in events per second.
   */
  public getEventRate(): number {
    const now = Date.now();
    const elapsedSeconds = (now - this.startTime) / 1000;
    return Math.floor(this.eventCount / elapsedSeconds);
  }

  /**
   * Get the current throughput in bytes per second.
   */
  public getThroughput(): number {
    const now = Date.now();
    const elapsedSeconds = (now - this.startTime) / 1000;
    return Math.floor(this.totalBytes / elapsedSeconds);
  }

  /**
   * Reset the calculator to start a new window.
   */
  public reset(): void {
    this.startTime = Date.now();
    this.eventCount = 0;
    this.totalBytes = 0;
  }
}
